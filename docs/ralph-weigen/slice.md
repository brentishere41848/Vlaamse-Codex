<!--
RALPH WEIGEN METHODE — FASE 3: VERTICALE SLICE (Slice)
Doel: end-to-end flow afdwingen met een test/fixture.
-->

# Slice — end-to-end flow

## Fixture

- `examples/hello-web/page.plats` (PlatsWeb SFC: `pagina` + `script` + `stijl`)

## Failing test (eerst)

Toegevoegd:

- `tests/test_platsweb_e2e_build.py`
  - runt: `python -m vlaamscodex.cli build examples/hello-web`
  - verwacht: `dist/index.html`, `dist/app.js`, `dist/app.css`

Initieel faalde dit (voor implementatie) omdat:

- `vlaamscodex.platsweb.*` modules niet bestonden
- `plats build <dir>` nog niet supported was

Daarna is de implementatie toegevoegd tot de slice groen werd.

