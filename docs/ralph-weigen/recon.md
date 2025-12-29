<!--
RALPH WEIGEN METHODE — FASE 1: VERKEN (Recon)
Doel: snel, feitelijk overzicht van repo + huidige tooling.
-->

# Recon

## Repo-structuur (high level)

- Python package: `src/vlaamscodex/`
- CLI entrypoint: `src/vlaamscodex/cli.py` (`plats` → `vlaamscodex.cli:main` in `pyproject.toml`)
- Plats compiler (naar Python): `src/vlaamscodex/compiler.py` (whitespace-tokenized, `amen` terminator)
- Magic Mode codec: `src/vlaamscodex/codec.py` + `data/vlaamscodex_autoload.pth`
- Tests: `tests/` (pytest-style)
- Docs: `docs/` (diverse markdown)
- Examples (CLI/taal): `examples/*.plats`

## Entrypoints / waar we inpluggen

- `plats` CLI wordt gebouwd rond `argparse` in `src/vlaamscodex/cli.py`.
  - `cmd_build()` bestaat al en compileert een `.plats` **file** naar Python source.
  - We moeten `plats build <dir>` toevoegen voor PlatsWeb zonder de bestaande `plats build <file>` te breken.
  - Nieuwe `plats dev <dir>` command toevoegen.
- Nieuwe PlatsWeb code hoort onder `src/vlaamscodex/` (zelfde distributie).

## Baseline commando’s (wat werkt nu)

Executed (met `PYTHONPATH=src` zodat we de repo-code gebruiken i.p.v. een geïnstalleerde versie):

- `PYTHONPATH=src python -m vlaamscodex.cli version`
  - Output: `VlaamsCodex v0.2.5`
- `PYTHONPATH=src python -m vlaamscodex.cli help`
  - Output bevat o.a. `plats run`, `plats build <file.plats> --out <file>`, `plats show-python`, ...

## Tests status (baseline)

- `python -m pytest -q` faalt in deze omgeving met:
  - `No module named pytest`
- In `pyproject.toml` bestaat wel `optional-dependencies.dev = ["pytest>=7", ...]`.
  - Conclusie: pytest is niet geïnstalleerd in de runtime; voor Verify gaan we een dev install gebruiken.

## Wat ontbreekt (voor PlatsWeb MVP)

- Geen parser/DSL voor `.plats` SFC (`pagina {}`, `script {}`, `stijl {}`).
- Geen codegen target naar `dist/index.html`, `app.js`, `app.css`.
- Geen mini runtime (state → re-render, event wiring, safe interpolation).
- Geen `plats build <dir>` / `plats dev <dir>` (watch + live reload).
- Geen PlatsWeb voorbeelden/docs/tests.

