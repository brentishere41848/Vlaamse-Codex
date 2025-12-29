from __future__ import annotations

from dataclasses import dataclass

from .errors import PlatsWebParseError


@dataclass(frozen=True)
class SFCSection:
    text: str
    start_line: int
    start_col: int


@dataclass(frozen=True)
class PlatsSFC:
    pagina: SFCSection
    script: SFCSection
    stijl: SFCSection


def _is_ident_start(ch: str) -> bool:
    return ch.isalpha() or ch == "_"


def _is_ident_part(ch: str) -> bool:
    return ch.isalnum() or ch == "_"


def _advance_pos(src: str, i: int, line: int, col: int) -> tuple[int, int, int]:
    ch = src[i]
    i += 1
    if ch == "\n":
        line += 1
        col = 1
    else:
        col += 1
    return i, line, col


def _skip_ws_and_comments(src: str, i: int, line: int, col: int) -> tuple[int, int, int]:
    while i < len(src):
        ch = src[i]
        if ch in " \t\r\n":
            i, line, col = _advance_pos(src, i, line, col)
            continue
        # Line comments: # ... or // ...
        if ch == "#":
            while i < len(src) and src[i] != "\n":
                i, line, col = _advance_pos(src, i, line, col)
            continue
        if ch == "/" and i + 1 < len(src) and src[i + 1] == "/":
            while i < len(src) and src[i] != "\n":
                i, line, col = _advance_pos(src, i, line, col)
            continue
        break
    return i, line, col


def _read_ident(src: str, i: int, line: int, col: int) -> tuple[str, int, int, int]:
    if i >= len(src) or not _is_ident_start(src[i]):
        raise PlatsWebParseError("expected identifier", line, col)
    start = i
    while i < len(src) and _is_ident_part(src[i]):
        i, line, col = _advance_pos(src, i, line, col)
    return src[start:i], i, line, col


def _extract_brace_block(src: str, i: int, line: int, col: int) -> tuple[str, int, int, int, int, int]:
    if i >= len(src) or src[i] != "{":
        raise PlatsWebParseError("expected '{'", line, col)

    # content starts after the opening brace
    i, line, col = _advance_pos(src, i, line, col)
    start_i = i
    content_line = line
    content_col = col

    depth = 1
    in_string: str | None = None
    escaped = False

    while i < len(src):
        ch = src[i]
        if in_string is not None:
            if escaped:
                escaped = False
                i, line, col = _advance_pos(src, i, line, col)
                continue
            if ch == "\\":
                escaped = True
                i, line, col = _advance_pos(src, i, line, col)
                continue
            if ch == in_string:
                in_string = None
                i, line, col = _advance_pos(src, i, line, col)
                continue
            i, line, col = _advance_pos(src, i, line, col)
            continue

        if ch in ("'", '"', "`"):
            in_string = ch
            i, line, col = _advance_pos(src, i, line, col)
            continue

        if ch == "{":
            depth += 1
            i, line, col = _advance_pos(src, i, line, col)
            continue
        if ch == "}":
            depth -= 1
            if depth == 0:
                content = src[start_i:i]
                i, line, col = _advance_pos(src, i, line, col)
                return content, i, line, col, content_line, content_col
            i, line, col = _advance_pos(src, i, line, col)
            continue

        i, line, col = _advance_pos(src, i, line, col)

    raise PlatsWebParseError("unclosed '{' block", content_line, content_col)


def parse_plats_sfc(src: str) -> PlatsSFC:
    i = 0
    line = 1
    col = 1

    allowed = {"pagina", "script", "stijl"}
    found: dict[str, SFCSection] = {}

    i, line, col = _skip_ws_and_comments(src, i, line, col)
    while i < len(src):
        ident, i, line, col = _read_ident(src, i, line, col)
        if ident not in allowed:
            raise PlatsWebParseError(f"unknown top-level block '{ident}' (expected: pagina/script/stijl)", line, col - len(ident))

        i, line, col = _skip_ws_and_comments(src, i, line, col)
        if i >= len(src) or src[i] != "{":
            raise PlatsWebParseError(f"expected '{{' after '{ident}'", line, col)

        content, i, line, col, content_line, content_col = _extract_brace_block(src, i, line, col)
        found[ident] = SFCSection(text=content.strip(), start_line=content_line, start_col=content_col)

        i, line, col = _skip_ws_and_comments(src, i, line, col)

    missing = [k for k in ("pagina", "script", "stijl") if k not in found]
    if missing:
        raise PlatsWebParseError(f"missing required block(s): {', '.join(missing)}", 1, 1)

    return PlatsSFC(pagina=found["pagina"], script=found["script"], stijl=found["stijl"])
