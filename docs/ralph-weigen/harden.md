<!--
RALPH WEIGEN METHODE — FASE 5: VERHARD (Harden)
-->

# Harden — verharding (MVP)

## Security / safety

- Interpolatie `{{ ... }}` is safe-by-default:
  - statische tekst + interpolaties worden HTML-escaped in runtime
  - geen raw HTML injectie in tekstnodes of attributen
- Events binden via event delegation (geen re-bind bugs bij re-render).
- Geen `eval()` in runtime; handlers worden via object map aangeroepen.

## Robustness

- GitHub/CI context: pytest is in `pyproject.toml` als dev dependency; Verify installeert dev deps.
- Dev server blijft draaien bij parse errors (rebuild attempt + reload signaal).

## UX / foutmeldingen

- `PlatsWebParseError` bevat lijn/kolom + codeframe formattering.

