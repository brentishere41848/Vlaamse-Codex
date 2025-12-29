<!--
RALPH WEIGEN METHODE — FASE 6: VERIFIEER (Verify)
-->

# Verify — bewijs (MVP)

## Commando’s uitgevoerd

### 1) Dev deps + tests

```bash
.venv/bin/pip install -e ".[dev]"
.venv/bin/python -m pytest -q
```

Resultaat:

- `17 passed`

### 2) E2E build (PlatsWeb)

```bash
PYTHONPATH=src python -m vlaamscodex.cli build examples/hello-web
```

Resultaat:

- Schrijft:
  - `examples/hello-web/dist/index.html`
  - `examples/hello-web/dist/app.js`
  - `examples/hello-web/dist/app.css`

### 3) Dev mode (handmatig)

```bash
PYTHONPATH=src python -m vlaamscodex.cli dev examples/hello-web
```

Verwachting:

- Terminal print URL (default `http://127.0.0.1:5173/`)
- Bij save van `examples/hello-web/page.plats` → rebuild + browser refresh (SSE live reload)

## Known limitations (MVP)

- Re-render is full-root (geen diffing).
- Interpolatie ondersteunt enkel `{{ identifier }}`.
- Script DSL is line-based transpile (geen volledige parser).
- Error line/kolom voor `script` block is minimal (MVP); verdere precisie is “later”.

