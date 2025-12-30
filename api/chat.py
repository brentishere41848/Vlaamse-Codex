from __future__ import annotations

import json
import os
import sys
import time
from collections import deque
from http.server import BaseHTTPRequestHandler
from pathlib import Path


# Make sure imports work both in Vercel and in a plain repo checkout.
_ROOT = Path(__file__).resolve().parents[1]
_SRC = _ROOT / "src"
if _SRC.exists():
    sys.path.insert(0, str(_SRC))

from vlaamscodex.platvlaams_ai.openai_client import (  # noqa: E402
    call_openai_chat_completions,
    load_openai_config_from_env,
)
from vlaamscodex.platvlaams_ai.policy import process_chat  # noqa: E402
from vlaamscodex.platvlaams_ai.refusal import rate_limited_message  # noqa: E402


def _env_int(*names: str, default: int) -> int:
    for n in names:
        v = os.environ.get(n)
        if v is None:
            continue
        try:
            return int(v)
        except ValueError:
            continue
    return default


_MAX_INPUT_CHARS = _env_int("MAX_INPUT_CHARS", "AI_MAX_INPUT_CHARS", default=8000)
_RATE_LIMIT_PER_MINUTE = _env_int("RATE_LIMIT_PER_MINUTE", "AI_RATE_LIMIT_PER_MINUTE", default=30)


class _RateLimiter:
    def __init__(self, limit_per_minute: int) -> None:
        self._limit = limit_per_minute
        self._hits: dict[str, deque[float]] = {}

    def allow(self, key: str) -> bool:
        if self._limit <= 0:
            return True
        now = time.time()
        cutoff = now - 60.0
        dq = self._hits.get(key)
        if dq is None:
            dq = deque()
            self._hits[key] = dq
        while dq and dq[0] < cutoff:
            dq.popleft()
        if len(dq) >= self._limit:
            return False
        dq.append(now)
        return True


_limiter = _RateLimiter(_RATE_LIMIT_PER_MINUTE)


def _client_ip(headers) -> str:
    xff = headers.get("x-forwarded-for")
    if isinstance(xff, str) and xff.strip():
        return xff.split(",")[0].strip()
    xri = headers.get("x-real-ip")
    if isinstance(xri, str) and xri.strip():
        return xri.strip()
    return "unknown"


class handler(BaseHTTPRequestHandler):  # noqa: N801
    def log_message(self, fmt: str, *args: object) -> None:
        return

    def _send_json(self, status: int, payload: object) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_POST(self) -> None:  # noqa: N802
        ip = _client_ip(self.headers)
        if not _limiter.allow(ip):
            self._send_json(429, {"error": {"code": "RATE_LIMITED", "message": rate_limited_message()}})
            return

        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            self._send_json(400, {"error": {"code": "BAD_REQUEST", "message": "Ge mist een body, jong."}})
            return
        if length > (_MAX_INPUT_CHARS * 8):
            self._send_json(413, {"error": {"code": "TOO_LARGE", "message": "Da is te veel ineens, jong."}})
            return

        try:
            body = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            self._send_json(400, {"error": {"code": "BAD_JSON", "message": "Da is gene proper JSON, jong."}})
            return

        if not isinstance(body, dict):
            self._send_json(400, {"error": {"code": "BAD_REQUEST", "message": "Da requestke klopt ni."}})
            return

        messages = body.get("messages")
        if not isinstance(messages, list):
            self._send_json(400, {"error": {"code": "BAD_REQUEST", "message": "Ge mist `messages[]`."}})
            return

        norm: list[dict[str, str]] = []
        for m in messages:
            if not isinstance(m, dict):
                continue
            role = m.get("role")
            content = m.get("content")
            if role in ("user", "assistant", "system") and isinstance(content, str):
                norm.append({"role": role, "content": content})

        cfg = load_openai_config_from_env()

        def _call_model(msgs: list[dict[str, str]]) -> str:
            return call_openai_chat_completions(cfg, msgs)

        result = process_chat(messages=norm, call_model=_call_model, max_input_chars=_MAX_INPUT_CHARS)

        if result.offline:
            self._send_json(503, {"error": {"code": "AI_OFFLINE", "message": result.content}})
            return

        self._send_json(
            200,
            {
                "message": {"role": "assistant", "content": result.content},
                "refused": result.refused,
            },
        )

