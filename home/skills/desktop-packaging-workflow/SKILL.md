---
name: desktop-packaging-workflow
description: "Use when building or packaging a desktop application for Windows x64/ARM64 and Linux x64/ARM64, including installers, ZIP archives, and tar.xz archives."
---

# Desktop Packaging Workflow

Use this workflow for desktop application releases that need the four standard
artifacts: Windows x64, Windows ARM64, Linux x64, and Linux ARM64. The workflow
is platform-aware, keeps Windows and Linux builds separate, and verifies the
canonical artifacts before any release upload.

## Rules

- Build Windows targets on Windows and Linux targets inside WSL/Linux.
- Run the Linux build from the WSL native filesystem, such as `/home/<user>/project`.
  Do not build from `/mnt/c/...` for ARM64 or native dependency work.
- Use the repository's existing build scripts and package configuration. Do not
  replace them with ad-hoc Electron Builder commands unless the script is
  missing a required target.
- Keep `--publish never` for local builds. Uploading or creating a release is a
  separate, explicitly requested operation.
- Do not delete unrelated worktree changes. Build scripts may clean only their
  own generated output directories.
- Do not skip package smoke checks unless the environment cannot run them;
  record the skip and perform the artifact checks below manually.

## Required Outputs

Each build must be copied to its canonical directory:

| Platform | Directory | Required artifacts |
| --- | --- | --- |
| Windows x64 | `desktop/build-artifacts/windows-x64/` | NSIS `.exe`, portable `.zip` |
| Windows ARM64 | `desktop/build-artifacts/windows-arm64/` | NSIS `.exe`, portable `.zip` |
| Linux x64 | `desktop/build-artifacts/linux-x64/` | `.AppImage`, `.deb`, `.tar.xz` |
| Linux ARM64 | `desktop/build-artifacts/linux-arm64/` | `.AppImage`, `.deb`, `.tar.xz` |

The artifact names must include the application version, operating system, and
architecture. Also preserve `BUILD_INFO.txt` when the repository build script
generates it.

## Procedure

### 1. Preflight

From the repository root:

1. Read the version from the desktop package metadata.
2. Check `git status --short` and preserve existing user changes.
3. Confirm the required toolchains are available:
   - Windows: Bun, Bunx, Visual Studio Build Tools with the C++ workload, and
     the repository's Windows build prerequisites.
   - WSL/Linux: Bun, Electron Builder dependencies, and `tar` with xz support.
4. Confirm enough disk space for sidecars, unpacked Electron output, and all
   four canonical artifact directories.

Do not begin a release upload during preflight.

### 2. Windows x64

Run on Windows from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\desktop\scripts\build-windows-x64.ps1 --win nsis zip
```

The script builds the Windows x64 sidecar, renderer, Electron bundles, NSIS
installer, and portable ZIP, then copies outputs to:

```text
desktop/build-artifacts/windows-x64/
```

If native Electron dependencies must be rebuilt, set `REBUILD_NATIVE=1`. Keep
`SKIP_PACKAGE_SMOKE` unset unless the smoke check is genuinely blocked.

### 3. Windows ARM64

Run on Windows from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\desktop\scripts\build-windows-arm64.ps1 --win nsis zip
```

The script targets `aarch64-pc-windows-msvc` and copies outputs to:

```text
desktop/build-artifacts/windows-arm64/
```

Verify that both the `.exe` and `.zip` exist. If the ARM64 script does not run
package smoke for the current repository revision, perform the manual checks
in the Verification section.

### 4. Enter WSL/Linux

Open the intended WSL distribution from Windows:

```powershell
wsl -l -v
wsl -d <distribution-name>
```

Inside WSL, move to a native Linux checkout:

```bash
cd /home/<user>/<project>
```

Confirm that `uname -s` reports `Linux` and that `bun --version` is available
before building.

### 5. Linux x64

Inside WSL/Linux, from the repository root:

```bash
LINUX_ARCH=x64 LINUX_TARGETS='AppImage deb' bash desktop/scripts/build-linux.sh
```

The script builds the `x86_64-unknown-linux-gnu` sidecar and copies the AppImage,
deb, and `linux-unpacked/` directory to:

```text
desktop/build-artifacts/linux-x64/
```

Create the requested xz archive from the unpacked application directory:

```bash
VERSION=$(node -p "require('./desktop/package.json').version")
tar -cJf "desktop/build-artifacts/linux-x64/Minicode-${VERSION}-linux-x64.tar.xz" \
  -C desktop/build-artifacts/linux-x64 linux-unpacked
```

### 6. Linux ARM64

Inside WSL/Linux, from the repository root:

```bash
LINUX_ARCH=arm64 LINUX_TARGETS='AppImage deb' bash desktop/scripts/build-linux.sh
```

The script builds the `aarch64-unknown-linux-gnu` sidecar and copies outputs to:

```text
desktop/build-artifacts/linux-arm64/
```

Create the ARM64 xz archive:

```bash
VERSION=$(node -p "require('./desktop/package.json').version")
tar -cJf "desktop/build-artifacts/linux-arm64/Minicode-${VERSION}-linux-arm64.tar.xz" \
  -C desktop/build-artifacts/linux-arm64 linux-unpacked
```

### 7. Verification

From the repository root, verify every canonical directory:

```bash
find desktop/build-artifacts/windows-x64 -maxdepth 1 -type f
find desktop/build-artifacts/windows-arm64 -maxdepth 1 -type f
find desktop/build-artifacts/linux-x64 -maxdepth 1 -type f
find desktop/build-artifacts/linux-arm64 -maxdepth 1 -type f
```

Check all archives without extracting them:

```bash
unzip -t desktop/build-artifacts/windows-x64/*.zip
unzip -t desktop/build-artifacts/windows-arm64/*.zip
tar -tJf desktop/build-artifacts/linux-x64/*.tar.xz >/dev/null
tar -tJf desktop/build-artifacts/linux-arm64/*.tar.xz >/dev/null
```

Check that:

- Each Windows directory contains exactly the intended architecture's NSIS
  installer and ZIP archive.
- Each Linux directory contains AppImage, deb, and tar.xz artifacts for the
  intended architecture.
- No artifact is copied from another architecture's output directory.
- `BUILD_INFO.txt` target triples match the platform directory.
- Package smoke results are recorded separately from build success.
- Build failures, skipped checks, and environment blockers are reported as
  distinct states.

Only after these checks pass may a separately authorized release or upload
workflow begin.

## Repository Adaptation

For another desktop repository, preserve this order and replace only:

- the Windows build script paths;
- the Linux build script paths and target variables;
- the canonical output directory names;
- the package filename prefix;
- the package smoke command;
- the unpacked application directory used to create `.tar.xz`.

Keep the four-platform matrix, WSL native-filesystem rule, artifact verification,
and no-publish default unchanged.
