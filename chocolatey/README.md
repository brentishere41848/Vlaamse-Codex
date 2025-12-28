# Chocolatey packaging

This repo ships a Chocolatey package skeleton under `chocolatey/`.

## Build the embedded wheel

From the repo root:

```powershell
python -m pip install -U build
python -m build --wheel --outdir chocolatey/tools
```

This should create `chocolatey/tools/vlaamscodex-<version>-py3-none-any.whl`.

## Pack a local `.nupkg`

From `chocolatey/`:

```powershell
choco pack .\vlaamscodex.nuspec
```

## Test install locally

```powershell
choco install vlaamscodex --source . -y
plats version
```

## Publish (community feed)

When you are ready, push the `.nupkg` to your Chocolatey feed / community repository.

