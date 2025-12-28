#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function venvPythonPath(packageRoot) {
  const venvDir = path.join(packageRoot, ".vlaamscodex-venv");
  if (process.platform === "win32") {
    return path.join(venvDir, "Scripts", "python.exe");
  }
  return path.join(venvDir, "bin", "python");
}

function main() {
  const packageRoot = path.resolve(__dirname, "..");
  const pythonExe = venvPythonPath(packageRoot);
  if (!fs.existsSync(pythonExe)) {
    console.error(
      [
        "vlaamscodex is not fully installed (missing embedded venv).",
        "Try:",
        "  npm rebuild vlaamscodex",
        ""
      ].join("\n")
    );
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const result = spawnSync(pythonExe, ["-m", "vlaamscodex.cli", ...args], {
    stdio: "inherit"
  });

  if (result.error) {
    console.error(String(result.error));
    process.exit(1);
  }
  process.exit(typeof result.status === "number" ? result.status : 0);
}

main();

