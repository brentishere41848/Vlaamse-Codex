from __future__ import annotations

from dataclasses import dataclass


def _codeframe(src: str, line: int, col: int, context: int = 2) -> str:
    lines = src.splitlines()
    if not lines:
        return ""

    line = max(1, min(line, len(lines)))
    col = max(1, col)

    start = max(1, line - context)
    end = min(len(lines), line + context)
    width = len(str(end))

    out: list[str] = []
    for ln in range(start, end + 1):
        prefix = ">" if ln == line else " "
        out.append(f"{prefix} {ln:>{width}} | {lines[ln - 1]}")
        if ln == line:
            caret_pad = " " * (col - 1)
            out.append(f"  {' ' * width} | {caret_pad}^")
    return "\n".join(out)


@dataclass
class PlatsWebParseError(Exception):
    message: str
    line: int
    col: int

    def format(self, src: str, path: str | None = None) -> str:
        loc = f"{path}:{self.line}:{self.col}" if path else f"{self.line}:{self.col}"
        frame = _codeframe(src, self.line, self.col)
        if frame:
            return f"{loc}: error: {self.message}\n{frame}"
        return f"{loc}: error: {self.message}"

