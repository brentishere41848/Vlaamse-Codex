import * as vscode from "vscode";
import { spawn, spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

type RunResult = { code: number | null; signal: NodeJS.Signals | null };
type CliInvocation = { command: string; baseArgs: string[]; displayName: string };

function getPlatsPath(): string {
  return vscode.workspace.getConfiguration("vlaamscodex").get<string>("platsPath", "plats");
}

function getPythonPath(): string {
  return vscode.workspace.getConfiguration("vlaamscodex").get<string>("pythonPath", "");
}

function getRunInTerminal(): boolean {
  return vscode.workspace.getConfiguration("vlaamscodex").get<boolean>("runInTerminal", true);
}

function getAutoBootstrap(): boolean {
  return vscode.workspace.getConfiguration("vlaamscodex").get<boolean>("autoBootstrap", false);
}

function getWorkingDirectoryForFile(filePath: string): string {
  const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
  if (folder) return folder.uri.fsPath;
  return path.dirname(filePath);
}

function getDefaultCwd(): string {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (folder) return folder.uri.fsPath;
  return os.homedir();
}

async function ensurePlatsFileUri(maybeUri?: vscode.Uri): Promise<vscode.Uri> {
  if (maybeUri) {
    if (maybeUri.fsPath.endsWith(".plats")) return maybeUri;
    throw new Error("Selected file is not a .plats file.");
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) throw new Error("No active editor. Open a .plats file first.");
  const filePath = editor.document.uri.fsPath;
  if (!filePath.endsWith(".plats")) throw new Error("The active file is not a .plats file.");
  return editor.document.uri;
}

async function saveIfDirty(uri: vscode.Uri): Promise<void> {
  const openDoc = vscode.workspace.textDocuments.find((d) => d.uri.toString() === uri.toString());
  if (openDoc?.isDirty) await openDoc.save();
}

function appendChannelHeader(channel: vscode.OutputChannel, title: string): void {
  channel.appendLine("");
  channel.appendLine(`=== ${title} (${new Date().toISOString()}) ===`);
}

function isSpawnNotFound(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code?: unknown }).code === "ENOENT";
}

function runCommand(channel: vscode.OutputChannel, command: string, args: string[], cwd: string): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(command, args, { cwd });
    } catch (err) {
      reject(err);
      return;
    }

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (chunk: string) => channel.append(chunk));
    child.stderr.on("data", (chunk: string) => channel.append(chunk));

    child.on("error", (err) => reject(err));
    child.on("close", (code, signal) => resolve({ code, signal }));
  });
}

function venvPythonPath(venvDir: string): string {
  if (process.platform === "win32") return path.join(venvDir, "Scripts", "python.exe");
  return path.join(venvDir, "bin", "python");
}

function getPythonMajorMinor(pythonExe: string): { major: number; minor: number } | null {
  const result = spawnSync(pythonExe, ["-c", "import sys; print(f'{sys.version_info[0]}.{sys.version_info[1]}')"], {
    encoding: "utf8",
  });
  if (result.error || result.status !== 0) return null;
  const raw = String(result.stdout || "").trim();
  const match = raw.match(/^(\d+)\.(\d+)$/);
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2]) };
}

function isSupportedPython(pythonExe: string): boolean {
  const version = getPythonMajorMinor(pythonExe);
  if (!version) return false;
  return version.major === 3 && version.minor >= 10;
}

function canRunCommand(command: string, args: string[], cwd: string): boolean {
  const result = spawnSync(command, args, { cwd, stdio: "ignore" });
  return !result.error && result.status === 0;
}

function hasVlaamscodexModule(pythonExe: string, cwd: string): boolean {
  return canRunCommand(pythonExe, ["-c", "import vlaamscodex, vlaamscodex.cli; print(vlaamscodex.__version__)"], cwd);
}

function getPythonCandidates(): string[] {
  const configured = getPythonPath().trim();
  const candidates = [configured, "python3", "python"].filter((c) => c && c.length > 0);
  return Array.from(new Set(candidates));
}

async function bootstrapVlaamscodex(
  context: vscode.ExtensionContext,
  channel: vscode.OutputChannel,
  pythonExe: string,
): Promise<string> {
  const storageRoot = context.globalStorageUri.fsPath;
  await fs.mkdir(storageRoot, { recursive: true });

  const venvDir = path.join(storageRoot, "vlaamscodex-venv");
  const pythonInVenv = venvPythonPath(venvDir);

  channel.show(true);
  appendChannelHeader(channel, "Bootstrapping VlaamsCodex (Python venv)");
  channel.appendLine(`Python: ${pythonExe}`);
  channel.appendLine(`Venv: ${venvDir}`);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "VlaamsCodex: installing Python tooling (first run)",
      cancellable: false,
    },
    async () => {
      if (!(await fs.stat(pythonInVenv).catch(() => null))) {
        channel.appendLine("Creating venv...");
        const r = await runCommand(channel, pythonExe, ["-m", "venv", venvDir], getDefaultCwd());
        if (r.code !== 0) throw new Error(`Failed to create venv (exit code ${r.code ?? "unknown"}).`);
      }

      channel.appendLine("Ensuring pip...");
      const ensure = await runCommand(channel, pythonInVenv, ["-m", "ensurepip", "--upgrade"], getDefaultCwd());
      if (ensure.code !== 0) throw new Error(`Failed to ensure pip (exit code ${ensure.code ?? "unknown"}).`);

      channel.appendLine("Upgrading pip...");
      const pipUp = await runCommand(channel, pythonInVenv, ["-m", "pip", "install", "-U", "pip"], getDefaultCwd());
      if (pipUp.code !== 0) throw new Error(`Failed to upgrade pip (exit code ${pipUp.code ?? "unknown"}).`);

      channel.appendLine("Installing vlaamscodex from PyPI...");
      const install = await runCommand(channel, pythonInVenv, ["-m", "pip", "install", "-U", "vlaamscodex"], getDefaultCwd());
      if (install.code !== 0) throw new Error(`Failed to install vlaamscodex (exit code ${install.code ?? "unknown"}).`);
    },
  );

  return pythonInVenv;
}

async function resolveCli(
  context: vscode.ExtensionContext,
  channel: vscode.OutputChannel,
  options?: { allowPromptBootstrap?: boolean },
): Promise<CliInvocation> {
  const cwd = getDefaultCwd();

  const platsPath = getPlatsPath();
  if (canRunCommand(platsPath, ["version"], cwd)) {
    return { command: platsPath, baseArgs: [], displayName: platsPath };
  }

  for (const pythonExe of getPythonCandidates()) {
    if (!isSupportedPython(pythonExe)) continue;
    if (hasVlaamscodexModule(pythonExe, cwd)) {
      return { command: pythonExe, baseArgs: ["-m", "vlaamscodex.cli"], displayName: `${pythonExe} -m vlaamscodex.cli` };
    }
  }

  // Check extension-managed venv
  const venvDir = path.join(context.globalStorageUri.fsPath, "vlaamscodex-venv");
  const pythonInVenv = venvPythonPath(venvDir);
  if (await fs.stat(pythonInVenv).catch(() => null)) {
    if (hasVlaamscodexModule(pythonInVenv, cwd)) {
      return {
        command: pythonInVenv,
        baseArgs: ["-m", "vlaamscodex.cli"],
        displayName: `${pythonInVenv} -m vlaamscodex.cli`,
      };
    }
  }

  const allowPromptBootstrap = options?.allowPromptBootstrap ?? true;
  const autoBootstrap = getAutoBootstrap();

  const pythonForBootstrap = getPythonCandidates().find((p) => isSupportedPython(p));
  if (!pythonForBootstrap) {
    throw new Error("No suitable Python 3.10+ found. Install Python or set vlaamscodex.pythonPath.");
  }

  const shouldBootstrap =
    autoBootstrap ||
    (allowPromptBootstrap &&
      (await vscode.window.showErrorMessage(
        "Could not find the VlaamsCodex CLI ('plats') or an installed Python module. Install vlaamscodex into a private venv now?",
        "Install",
        "Cancel",
      )) === "Install");

  if (!shouldBootstrap) {
    throw new Error("VlaamsCodex CLI not found. Install vlaamscodex (pip/pipx) or enable vlaamscodex.autoBootstrap.");
  }

  const venvPython = await bootstrapVlaamscodex(context, channel, pythonForBootstrap);
  return { command: venvPython, baseArgs: ["-m", "vlaamscodex.cli"], displayName: `${venvPython} -m vlaamscodex.cli` };
}

async function runWithErrorHandling(
  context: vscode.ExtensionContext,
  channel: vscode.OutputChannel,
  title: string,
  platsArgs: string[],
  cwd: string,
  onSuccess?: () => void,
): Promise<void> {
  try {
    const cli = await resolveCli(context, channel);

    channel.show(true);
    appendChannelHeader(channel, title);
    channel.appendLine(`Command: ${cli.displayName} ${platsArgs.join(" ")}`);
    channel.appendLine(`CWD: ${cwd}`);

    const result = await runCommand(channel, cli.command, [...cli.baseArgs, ...platsArgs], cwd);
    if (result.code !== 0) {
      void vscode.window.showErrorMessage(`VlaamsCodex failed (exit code ${result.code ?? "unknown"}). See Output: VlaamsCodex.`);
    } else {
      onSuccess?.();
    }
  } catch (err) {
    if (isSpawnNotFound(err)) {
      void vscode.window.showErrorMessage(
        "Could not run VlaamsCodex. Install vlaamscodex (pip/pipx) or configure vlaamscodex.platsPath / vlaamscodex.pythonPath.",
      );
    } else {
      void vscode.window.showErrorMessage("Failed to run Plats. See Output: VlaamsCodex.");
    }
    channel.appendLine("");
    channel.appendLine(`Error: ${String(err)}`);
  }
}

async function runInTerminal(
  context: vscode.ExtensionContext,
  channel: vscode.OutputChannel,
  title: string,
  platsArgs: string[],
  cwd: string,
): Promise<void> {
  try {
    const cli = await resolveCli(context, channel);
    const execution = new vscode.ProcessExecution(cli.command, [...cli.baseArgs, ...platsArgs], { cwd });
    const scope = vscode.workspace.workspaceFolders ? vscode.TaskScope.Workspace : vscode.TaskScope.Global;
    const task = new vscode.Task({ type: "vlaamscodex", task: title }, scope, title, "VlaamsCodex", execution);
    task.presentationOptions = {
      reveal: vscode.TaskRevealKind.Always,
      panel: vscode.TaskPanelKind.Dedicated,
      clear: true,
      showReuseMessage: false,
      focus: false,
    };
    await vscode.tasks.executeTask(task);
  } catch (err) {
    channel.show(true);
    appendChannelHeader(channel, title);
    channel.appendLine(`Error: ${String(err)}`);
    void vscode.window.showErrorMessage(String(err instanceof Error ? err.message : err));
  }
}

function normalizeSelectionText(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

function ensureCodingCookie(text: string): string {
  const trimmed = text.trimStart();
  if (trimmed.startsWith("# coding:")) return text;
  return `# coding: vlaamsplats\n${text}`;
}

function ensureProgramWrapper(text: string): string {
  const hasPlan = /\bplan\s+doe\b/.test(text);
  const hasGedaan = /\bgedaan\b/.test(text);
  if (hasPlan && hasGedaan) return text;

  const body = text
    .split("\n")
    .map((line) => (line.trim().length === 0 ? "" : `  ${line}`))
    .join("\n");
  return `plan doe\n${body}\n\ngedaan\n`;
}

async function cmdRunFile(context: vscode.ExtensionContext, channel: vscode.OutputChannel, uri?: vscode.Uri): Promise<void> {
  const fileUri = await ensurePlatsFileUri(uri);
  await saveIfDirty(fileUri);

  const filePath = fileUri.fsPath;
  const cwd = getWorkingDirectoryForFile(filePath);

  const title = `Run Plats: ${path.basename(filePath)}`;
  if (getRunInTerminal()) {
    await runInTerminal(context, channel, title, ["run", filePath], cwd);
    return;
  }
  await runWithErrorHandling(context, channel, title, ["run", filePath], cwd);
}

async function cmdRunSelection(context: vscode.ExtensionContext, channel: vscode.OutputChannel): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) throw new Error("No active editor. Select Plats code in a .plats file first.");
  if (!editor.document.uri.fsPath.endsWith(".plats")) throw new Error("The active file is not a .plats file.");
  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);
  if (!selectedText || selectedText.trim().length === 0) {
    void vscode.window.showInformationMessage("Select some Plats code first.");
    return;
  }

  const normalized = normalizeSelectionText(selectedText);
  const wrapped = ensureProgramWrapper(normalized);
  const withCookie = ensureCodingCookie(wrapped);

  const tmpFile = path.join(os.tmpdir(), `vlaamscodex-selection-${Date.now()}-${Math.random().toString(16).slice(2)}.plats`);
  await fs.writeFile(tmpFile, withCookie, { encoding: "utf8" });

  const filePath = editor.document.uri.fsPath;
  const cwd = getWorkingDirectoryForFile(filePath);

  try {
    const title = `Run Selection: ${path.basename(filePath)}`;
    if (getRunInTerminal()) {
      await runInTerminal(context, channel, title, ["run", tmpFile], cwd);
      return;
    }
    await runWithErrorHandling(context, channel, title, ["run", tmpFile], cwd);
  } finally {
    try {
      await fs.unlink(tmpFile);
    } catch {
      // ignore
    }
  }
}

async function cmdShowPython(context: vscode.ExtensionContext, channel: vscode.OutputChannel, uri?: vscode.Uri): Promise<void> {
  const fileUri = await ensurePlatsFileUri(uri);
  await saveIfDirty(fileUri);

  const filePath = fileUri.fsPath;
  const cwd = getWorkingDirectoryForFile(filePath);

  const cli = await resolveCli(context, channel);
  channel.show(true);
  appendChannelHeader(channel, `Show Generated Python: ${path.basename(filePath)}`);
  channel.appendLine(`Command: ${cli.displayName} show-python ${filePath}`);
  channel.appendLine(`CWD: ${cwd}`);

  const result = spawnSync(cli.command, [...cli.baseArgs, "show-python", filePath], { cwd, encoding: "utf8" });
  if (result.error || result.status !== 0) {
    channel.appendLine("");
    channel.appendLine(String(result.stderr || result.error || "Unknown error"));
    void vscode.window.showErrorMessage("Failed to generate Python. See Output: VlaamsCodex.");
    return;
  }

  const pythonSource = String(result.stdout || "");
  const doc = await vscode.workspace.openTextDocument({ language: "python", content: pythonSource });
  await vscode.window.showTextDocument(doc, { preview: true });
}

async function cmdBuildPython(context: vscode.ExtensionContext, channel: vscode.OutputChannel, uri?: vscode.Uri): Promise<void> {
  const fileUri = await ensurePlatsFileUri(uri);
  await saveIfDirty(fileUri);

  const filePath = fileUri.fsPath;
  const cwd = getWorkingDirectoryForFile(filePath);

  const defaultOut = filePath.replace(/\.plats$/i, ".py");
  const outUri = await vscode.window.showSaveDialog({
    title: "Build Plats to Python",
    defaultUri: vscode.Uri.file(defaultOut),
    filters: { Python: ["py"] },
  });
  if (!outUri) return;

  const title = `Build Plats: ${path.basename(filePath)}`;
  if (getRunInTerminal()) {
    await runInTerminal(context, channel, title, ["build", filePath, "--out", outUri.fsPath], cwd);
    return;
  }
  await runWithErrorHandling(context, channel, title, ["build", filePath, "--out", outUri.fsPath], cwd, () =>
    void vscode.window.showInformationMessage(`Built Python file: ${outUri.fsPath}`),
  );
}

async function cmdHelp(context: vscode.ExtensionContext, channel: vscode.OutputChannel): Promise<void> {
  const title = "Plats CLI Help";
  if (getRunInTerminal()) {
    await runInTerminal(context, channel, title, ["help"], getDefaultCwd());
    return;
  }
  await runWithErrorHandling(context, channel, title, ["help"], getDefaultCwd());
}

async function cmdVersion(context: vscode.ExtensionContext, channel: vscode.OutputChannel): Promise<void> {
  const title = "Plats CLI Version";
  if (getRunInTerminal()) {
    await runInTerminal(context, channel, title, ["version"], getDefaultCwd());
    return;
  }
  await runWithErrorHandling(context, channel, title, ["version"], getDefaultCwd());
}

async function cmdCheckFile(context: vscode.ExtensionContext, channel: vscode.OutputChannel, uri?: vscode.Uri): Promise<void> {
  const fileUri = await ensurePlatsFileUri(uri);
  await saveIfDirty(fileUri);

  const filePath = fileUri.fsPath;
  const cwd = getWorkingDirectoryForFile(filePath);

  const title = `Check Plats: ${path.basename(filePath)}`;
  if (getRunInTerminal()) {
    await runInTerminal(context, channel, title, ["check", filePath], cwd);
    return;
  }
  await runWithErrorHandling(context, channel, title, ["check", filePath], cwd);
}

async function cmdRepl(context: vscode.ExtensionContext, channel: vscode.OutputChannel): Promise<void> {
  const cli = await resolveCli(context, channel);
  const cwd = getDefaultCwd();

  const terminal = vscode.window.createTerminal({
    name: "VlaamsCodex REPL",
    cwd,
  });
  terminal.show(true);
  const args = [...cli.baseArgs, "repl"].map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(" ");
  terminal.sendText(`${cli.command} ${args}`);
}

async function cmdFortune(context: vscode.ExtensionContext, channel: vscode.OutputChannel): Promise<void> {
  const title = "Plats Fortune";
  if (getRunInTerminal()) {
    await runInTerminal(context, channel, title, ["fortune"], getDefaultCwd());
    return;
  }
  await runWithErrorHandling(context, channel, title, ["fortune"], getDefaultCwd());
}

async function cmdExamplesList(context: vscode.ExtensionContext, channel: vscode.OutputChannel): Promise<void> {
  const title = "Plats Examples (List)";
  if (getRunInTerminal()) {
    await runInTerminal(context, channel, title, ["examples"], getDefaultCwd());
    return;
  }
  await runWithErrorHandling(context, channel, title, ["examples"], getDefaultCwd());
}

async function promptExampleName(title: string): Promise<string | undefined> {
  const name = await vscode.window.showInputBox({
    title,
    prompt: "Enter an example name (see 'VlaamsCodex: Examples (List)' for available examples).",
    placeHolder: "example-name",
  });
  if (!name || name.trim().length === 0) return undefined;
  return name.trim();
}

async function cmdExamplesShow(context: vscode.ExtensionContext, channel: vscode.OutputChannel): Promise<void> {
  const name = await promptExampleName("Show Example");
  if (!name) return;

  const cwd = getDefaultCwd();
  const cli = await resolveCli(context, channel);
  const result = spawnSync(cli.command, [...cli.baseArgs, "examples", "--show", name], { cwd, encoding: "utf8" });
  if (result.error || result.status !== 0) {
    channel.show(true);
    appendChannelHeader(channel, `Plats Examples (Show): ${name}`);
    channel.appendLine(String(result.stderr || result.error || "Unknown error"));
    void vscode.window.showErrorMessage("Failed to show example. See Output: VlaamsCodex.");
    return;
  }

  const content = String(result.stdout || "");
  const doc = await vscode.workspace.openTextDocument({ language: "platskript", content });
  await vscode.window.showTextDocument(doc, { preview: true });
}

async function cmdExamplesRun(context: vscode.ExtensionContext, channel: vscode.OutputChannel): Promise<void> {
  const name = await promptExampleName("Run Example");
  if (!name) return;
  const title = `Plats Examples (Run): ${name}`;
  if (getRunInTerminal()) {
    await runInTerminal(context, channel, title, ["examples", "--run", name], getDefaultCwd());
    return;
  }
  await runWithErrorHandling(context, channel, title, ["examples", "--run", name], getDefaultCwd());
}

async function cmdExamplesSave(context: vscode.ExtensionContext, channel: vscode.OutputChannel): Promise<void> {
  const name = await promptExampleName("Save Example");
  if (!name) return;

  channel.show(true);
  appendChannelHeader(channel, `Plats Examples (Save): ${name}`);
  channel.appendLine("Note: This command runs 'plats examples --save <NAME>' in the workspace folder.");

  const cwd = getDefaultCwd();
  const title = `Plats Examples (Save): ${name}`;
  if (getRunInTerminal()) {
    await runInTerminal(context, channel, title, ["examples", "--save", name], cwd);
    return;
  }
  await runWithErrorHandling(context, channel, title, ["examples", "--save", name], cwd);
}

async function cmdInitProject(context: vscode.ExtensionContext, channel: vscode.OutputChannel): Promise<void> {
  const name = await vscode.window.showInputBox({
    title: "Init VlaamsCodex Project",
    prompt: "Project name (optional). Leave empty to let the CLI choose defaults.",
    placeHolder: "my-plats-project",
  });
  const args = ["init"];
  if (name && name.trim().length > 0) args.push(name.trim());

  const title = "Plats Init Project";
  if (getRunInTerminal()) {
    await runInTerminal(context, channel, title, args, getDefaultCwd());
    return;
  }
  await runWithErrorHandling(context, channel, title, args, getDefaultCwd());
}

export function activate(context: vscode.ExtensionContext): void {
  const channel = vscode.window.createOutputChannel("VlaamsCodex");

  context.subscriptions.push(
    channel,
    vscode.commands.registerCommand("vlaamscodex.runFile", (uri?: vscode.Uri) => cmdRunFile(context, channel, uri)),
    vscode.commands.registerCommand("vlaamscodex.runSelection", () => cmdRunSelection(context, channel)),
    vscode.commands.registerCommand("vlaamscodex.showPython", (uri?: vscode.Uri) => cmdShowPython(context, channel, uri)),
    vscode.commands.registerCommand("vlaamscodex.buildPython", (uri?: vscode.Uri) => cmdBuildPython(context, channel, uri)),
    vscode.commands.registerCommand("vlaamscodex.help", () => cmdHelp(context, channel)),
    vscode.commands.registerCommand("vlaamscodex.version", () => cmdVersion(context, channel)),
    vscode.commands.registerCommand("vlaamscodex.checkFile", (uri?: vscode.Uri) => cmdCheckFile(context, channel, uri)),
    vscode.commands.registerCommand("vlaamscodex.repl", () => void cmdRepl(context, channel)),
    vscode.commands.registerCommand("vlaamscodex.fortune", () => cmdFortune(context, channel)),
    vscode.commands.registerCommand("vlaamscodex.examplesList", () => cmdExamplesList(context, channel)),
    vscode.commands.registerCommand("vlaamscodex.examplesShow", () => cmdExamplesShow(context, channel)),
    vscode.commands.registerCommand("vlaamscodex.examplesRun", () => cmdExamplesRun(context, channel)),
    vscode.commands.registerCommand("vlaamscodex.examplesSave", () => cmdExamplesSave(context, channel)),
    vscode.commands.registerCommand("vlaamscodex.initProject", () => cmdInitProject(context, channel)),
  );
}

export function deactivate(): void {
  // no-op
}
