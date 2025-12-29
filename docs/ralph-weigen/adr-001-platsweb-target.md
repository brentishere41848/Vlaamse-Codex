<!--
ADR-001 — PlatsWeb target
-->

# ADR-001: PlatsWeb target = vanilla HTML/JS/CSS + mini runtime

## Status

Accepted (MVP).

## Context

We willen `.plats` als single-file page/component kunnen builden naar statische web output, met minimale dependencies en een simpele dev server.

## Decision

- Codegen target: **vanilla** `dist/index.html` + `dist/app.js` + `dist/app.css`.
  - Geen bundler (Vite/Webpack/Rollup) in MVP.
  - Reden: zero heavy deps, voorspelbare output, makkelijk te debuggen.

- Runtime aanpak:
  - Eén root mount (`#plats-root`).
  - Render = volledige root HTML string (geen diffing).
  - Event wiring via **event delegation** op root (events blijven werken na re-render).
  - State via `state` object + `setState(patch)` dat merge + `render()` triggert.
  - Interpolatie `{{ naam }}` wordt safe by default:
    - statische tekst + interpolaties worden HTML-escaped (geen raw HTML injectie).

- Dev mode:
  - Standard library HTTP server + SSE endpoint.
  - Browser gebruikt `EventSource` → bij rebuild: `location.reload()`.
  - Geen HMR, enkel live reload.

## Consequences

- MVP blijft klein en portable.
- Geen framework lock-in.
- Beperkingen: grotere pages renderen trager (full re-render), beperkte script DSL (line-based), geen routing.

