#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const joined = [command, ...args].map(String).join(" ");
    const err = new Error(`Command failed (${result.status}): ${joined}`);
    err.exitCode = result.status;
    throw err;
  }
}

function tryRunQuiet(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "ignore", ...options });
  return !result.error && result.status === 0;
}

function getPythonVersion(command) {
  const result = spawnSync(
    command,
    ["-c", "import sys; print(f'{sys.version_info[0]}.{sys.version_info[1]}')"],
    { encoding: "utf8" }
  );
  if (result.error || result.status !== 0) return null;
  const raw = String(result.stdout || "").trim();
  const match = raw.match(/^(\d+)\.(\d+)$/);
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2]) };
}

function isSupportedPython(version) {
  if (!version) return false;
  if (version.major !== 3) return false;
  return version.minor >= 10;
}

function findPython() {
  const candidates = [
    process.env.VLAAMSCODEX_PYTHON,
    process.env.PYTHON,
    "python3",
    "python"
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (!tryRunQuiet(candidate, ["--version"])) continue;
    const version = getPythonVersion(candidate);
    if (isSupportedPython(version)) return candidate;
  }

  return null;
}

function venvPythonPath(venvDir) {
  if (process.platform === "win32") {
    return path.join(venvDir, "Scripts", "python.exe");
  }
  return path.join(venvDir, "bin", "python");
}

function ensurePip(pythonExe) {
  if (tryRunQuiet(pythonExe, ["-m", "pip", "--version"])) return;

  run(pythonExe, ["-m", "ensurepip", "--upgrade"]);
}

function main() {
  const packageRoot = path.resolve(__dirname, "..");
  const python = findPython();
  if (!python) {
    console.error(
      [
        "",
        "vlaamscodex (npm) requires Python 3.10+ to be installed and available as `python3` or `python`.",
        "Install Python, then re-run:",
        "  npm rebuild vlaamscodex",
        "",
        "You can also set VLAAMSCODEX_PYTHON=/path/to/python to force a specific interpreter.",
        ""
      ].join("\n")
    );
    process.exit(1);
  }

  const venvDir = path.join(packageRoot, ".vlaamscodex-venv");
  const venvPython = venvPythonPath(venvDir);

  if (!fs.existsSync(venvPython)) {
    run(python, ["-m", "venv", venvDir], { cwd: packageRoot });
  }

  ensurePip(venvPython);

  run(venvPython, ["-m", "pip", "install", "-U", "pip"], { cwd: packageRoot });
  run(venvPython, ["-m", "pip", "install", "."], { cwd: packageRoot });
}

try {
  main();
} catch (err) {
  console.error("");
  console.error("vlaamscodex (npm) postinstall failed.");
  console.error(String(err && err.message ? err.message : err));
  console.error("");
  process.exit(typeof err.exitCode === "number" ? err.exitCode : 1);
}
