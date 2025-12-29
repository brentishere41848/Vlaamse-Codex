<!--
RALPH WEIGEN METHODE — FASE 4: BOUW ITERATIEF (Build)
-->

# Build — iteratief

## Implementatie (MVP)

- Nieuw package: `src/vlaamscodex/platsweb/`
  - `parser.py` — SFC parser (`pagina/script/stijl`) met brace-matching
  - `compiler.py` — markup DSL → template AST → `index.html/app.js/app.css`
  - `builder.py` — `build_dir()` + `dev_dir()` (watch + server + live reload)
  - `errors.py` — `PlatsWebParseError` met codeframe formattering
- CLI integratie: `src/vlaamscodex/cli.py`
  - `plats build <dir>` → PlatsWeb build naar `<dir>/dist`
  - `plats dev <dir>` → watch + server + live reload
  - `plats build <file.plats> [--out <file.py>]` blijft bestaan

## Output contract

- `dist/index.html` laadt `app.css` en `app.js` en mount in `#plats-root`.
- `app.js` bevat:
  - safe interpolation (`{{ naam }}`) met HTML escaping
  - state (`state` + `setState`)
  - event delegation (`click` / `input`)

