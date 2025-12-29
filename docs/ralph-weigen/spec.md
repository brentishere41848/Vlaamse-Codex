<!--
RALPH WEIGEN METHODE — FASE 2: SPEC (Spec)
MVP-spec voor PlatsWeb (SFC + CLI + output + constraints).
-->

# Spec — PlatsWeb (MVP)

## Doel

Één `.plats` bestand kan ook een web page/component zijn via een SFC-structuur:

- `pagina { ... }` → markup DSL
- `script { ... }` → mini script DSL (naar JS)
- `stijl { ... }` → CSS passthrough

## Bestandsstructuur (SFC)

Minimaal voorbeeld:

```plats
pagina {
  blok id:"app" {
    kop tekst:"Hallo {{ naam }}"
    rij {
      invoer id:"naam" placeholder:"Uw naam"
      knop id:"btn" tekst:"Zeg hallo"
    }
    tekst tekst:"Ge typte: {{ naam }}"
  }
}

script {
  staat naam = ""

  functie onInput() {
    staat naam = lees("#naam")
  }

  bij input "#naam" -> onInput()
}

stijl {
  body { font-family: system-ui, sans-serif; padding: 2rem; }
  .rij { display: flex; gap: 0.75rem; align-items: center; }
}
```

### Regels

- Alle 3 secties (`pagina`, `script`, `stijl`) zijn verplicht voor MVP.
- Secties zijn top-level en gebruiken braces `{ ... }`.
- Braces in strings in `script`/`stijl` worden genegeerd door de SFC-brace-matcher (minimale string-aware scanner).

## Markup DSL (minimaal)

Ondersteunde nodes (keyword → HTML):

- `pagina` → fragment (root)
- `blok` → `<div>`
- `rij` → `<div class="rij ...">`
- `kolom` → `<div class="kolom ...">`
- `kop` → `<h1>`
- `tekst` → `<p>`
- `knop` → `<button>`
- `invoer` → `<input>`

Attributen (minimaal):

- `id:"..."`
- `class:"..."`
- `placeholder:"..."` (voor `invoer`)
- `tekst:"..."` (inner text voor `kop`/`tekst`/`knop`, value voor `invoer`)

Nesting:

- `node ... {` opent children
- `}` sluit
- `invoer` mag geen children hebben (parse error).

Interpolatie:

- `{{ variabele }}` in tekst en attributen.
- Runtime escape-by-default: zowel statische tekst als interpolaties worden HTML-escaped.

## Script DSL (minimaal)

Top-level:

- `staat naam = waarde` → initial reactive state
- `functie naam(a, b) { ... }` → JS function
- `bij klik "#selector" -> functieNaam()`
- `bij input "#selector" -> functieNaam()`

Helpers in functies:

- `lees(selector)` → leest `value` voor inputs, anders `textContent`
- `zet(selector, value)` → zet `value` voor inputs, anders `textContent`

State updates:

- `staat naam = expr` in functie compileert naar `setState({ naam: expr })` (triggert re-render).

## Output structuur

`plats build <dir>` schrijft:

- `<dir>/dist/index.html`
- `<dir>/dist/app.js`
- `<dir>/dist/app.css`

`index.html` laadt `app.css` en `app.js` en mount in `<div id="plats-root"></div>`.

## CLI

### `plats build`

- `plats build <file.plats> --out <file>` (bestaand gedrag) → compile naar Python source.
- `plats build <dir>` (nieuw) → PlatsWeb build naar `<dir>/dist`.

Errors:

- Parse/codegen errors geven: pad + lijn/kolom + codeframe.

### `plats dev`

- `plats dev <dir>`:
  - build (dev-mode) + watch
  - serve `<dir>/dist` via lokale HTTP server
  - live reload via SSE (EventSource) → page refresh

Defaults:

- `--port 5173`
- `--host 127.0.0.1`

## Beperkingen (bewust in MVP)

- Geen volledige HTML; alleen DSL nodes hierboven.
- Geen routing, SSR, bundlers, HMR.
- Script body is “JS-ish” line-based transpile (geen volledige parser).
- Re-render = volledige root (geen diffing).
- Interpolatie enkel `{{ identifier }}` (geen expressions).

