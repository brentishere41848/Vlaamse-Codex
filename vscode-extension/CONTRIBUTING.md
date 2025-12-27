# Contributing

Thanks for your interest in contributing to **VlaamsCodex – Platskript**.

## Quick start

1. Install dependencies:

```bash
cd vscode-extension
npm install
```

2. Compile:

```bash
npm run compile
```

3. Run the extension:

- Open `vscode-extension/` in VS Code
- Press **F5** to launch an Extension Development Host

## Project layout

- `src/extension.ts` — command implementation (`Run Plats File`, `Run Selection as Plats`)
- `syntaxes/platskript.tmLanguage.json` — TextMate grammar (highlighting)
- `snippets/platskript.code-snippets` — snippets
- `language-configuration.json` — indentation + editor rules

## Guidelines

- Keep user-facing text in English and professional.
- Avoid heavy dependencies; prefer Node built-ins.
- If you change commands or settings, update `README.md`.

## Releasing (local packaging)

```bash
npm run compile
npx --yes @vscode/vsce package
```

