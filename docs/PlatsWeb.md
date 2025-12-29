# PlatsWeb (MVP) — `.plats` als web page/component

PlatsWeb laat u één `.plats` bestand bouwen naar statische web output:

- `dist/index.html`
- `dist/app.js`
- `dist/app.css`

## 5‑min quickstart

1) Build het voorbeeld:

```bash
PYTHONPATH=src python -m vlaamscodex.cli build examples/hello-web
```

2) Start dev server (watch + live reload):

```bash
PYTHONPATH=src python -m vlaamscodex.cli dev examples/hello-web
```

Open daarna de URL die in de terminal verschijnt (default `http://127.0.0.1:5173/`).

## SFC structuur

Een PlatsWeb bestand bestaat uit 3 blokken:

```plats
pagina { ... }
script { ... }
stijl { ... }
```

## Markup DSL

Ondersteunde nodes:

- `blok`, `rij`, `kolom`, `kop`, `tekst`, `knop`, `invoer`

Attributen:

- `id:"..."`
- `class:"..."`
- `placeholder:"..."` (enkel `invoer`)
- `tekst:"..."` (inner text of input value)

Interpolatie:

- `{{ naam }}` in `tekst:"..."` en in attributen.
- Safe-by-default: statische tekst en interpolaties worden ge-escaped (geen raw HTML injectie).

## Script DSL

State:

```plats
staat naam = ""
```

Functies:

```plats
functie onInput() {
  staat naam = lees("#naam")
}
```

Events:

```plats
bij input "#naam" -> onInput()
bij klik "#btn" -> doSomething()
```

Helpers:

- `lees(selector)` → leest `value` voor inputs, anders `textContent`
- `zet(selector, value)` → zet `value` voor inputs, anders `textContent`

## CLI

- `plats build <dir>` → build PlatsWeb naar `<dir>/dist`
- `plats dev <dir>` → build + watch + server + live reload
- `plats build <file.plats> [--out <file.py>]` → bestaande Python codegen blijft werken

## Known limitations (MVP)

- Re-render is full-root (geen diffing).
- Interpolatie ondersteunt enkel `{{ identifier }}` (geen expressions).
- Script DSL is line-based transpile (geen volledige parser).
- Geen routing / SSR / bundlers.

