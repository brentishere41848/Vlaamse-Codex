# Vlaams Codex – Platskript (VS Code Extension)

Syntax highlighting, snippets, and run/build tools for **Platskript** (`.plats`), the **Vlaams Codex** language.

## Features

- Language support for `.plats` (language id: `platskript`)
- TextMate-based syntax highlighting (keywords, comments, `tekst ... amen`, numbers via `getal`)
- Snippets for common patterns (program skeleton, print, functions, if/else, loops)
- Commands:
  - **VlaamsCodex: Run Plats File**
  - **VlaamsCodex: Run Selection as Plats**
  - **VlaamsCodex: Show Generated Python**
  - **VlaamsCodex: Build Plats to Python File**
  - **VlaamsCodex: Show CLI Help**
  - **VlaamsCodex: Show CLI Version**
  - **VlaamsCodex: Check Plats File**
  - **VlaamsCodex: Start Plats REPL** (runs in an integrated terminal)
  - **VlaamsCodex: Fortune**
  - **VlaamsCodex: Examples (List/Show/Run/Save)**
  - **VlaamsCodex: Init Project**

## Requirements

- Recommended: install VlaamsCodex so the `plats` executable is available.
  - Example: `pipx install vlaamscodex` (or `python -m pip install vlaamscodex`)
- If you don't want a global install, the extension can optionally bootstrap a private Python venv (see Settings).

## Configuration

- `vlaamscodex.platsPath` (default: `"plats"`) — path to the `plats` executable.
- `vlaamscodex.pythonPath` — optional Python 3.10+ path, used as fallback (`python -m vlaamscodex.cli ...`).
- `vlaamscodex.runInTerminal` (default: `true`) — run commands in an integrated terminal (Tasks) instead of the Output panel.
- `vlaamscodex.autoBootstrap` (default: `false`) — allow the extension to create a private venv and install `vlaamscodex` automatically.

## Usage

- Run file: Command Palette → **VlaamsCodex: Run Plats File**
- Run selection: Command Palette → **VlaamsCodex: Run Selection as Plats**
- Show Python: Command Palette → **VlaamsCodex: Show Generated Python**
- Build: Command Palette → **VlaamsCodex: Build Plats to Python File**
- Help/version: Command Palette → **VlaamsCodex: Show CLI Help** / **VlaamsCodex: Show CLI Version**
- Check file: Command Palette → **VlaamsCodex: Check Plats File**
- REPL: Command Palette → **VlaamsCodex: Start Plats REPL**
- Fortune: Command Palette → **VlaamsCodex: Fortune**
- Examples: Command Palette → **VlaamsCodex: Examples (List)** (then optionally Show/Run/Save)
- Init: Command Palette → **VlaamsCodex: Init Project**

## Install from VSIX

Command Palette → **Extensions: Install from VSIX...**

## Development

```bash
npm install
npm run compile
npm run package
```

Press **F5** in VS Code to start an Extension Development Host.

## Deploy / Publish

- Local VSIX: `npm run package` (creates a `.vsix`)
- Marketplace publish: `npx vsce publish` (requires a VSCE PAT and a publisher)
- CI: the repo root workflow `.github/workflows/publish.yml` builds a VSIX on GitHub Releases and can publish if `VSCE_PAT` is set.

## License

MIT. See `LICENSE`.
