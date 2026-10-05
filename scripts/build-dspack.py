#!/usr/bin/env python3
"""Build a DSH ``.dspack`` (format v3) zip plus its SHA-256 sidecar.

This mirrors the output that the ``dsh-packforge-app`` launcher produces for
the ``better-deepseek-harness-codex`` profile, so that the bundle can be
installed by ``dsh`` exactly like a launcher-built package.

Produced artifacts (named ``<manifest.name>-<manifest.version>.<ext>``):

* ``.dspack``  — a ZIP (DEFLATED) containing these entries, in order:
    - ``dspack.json``             (synthetic, 41 bytes, fixed content)
    - ``manifest.json``
    - ``package.json``
    - ``pnpm-workspace.yaml``
    - ``overrides/cordis.patch.yml``
    - ``home/skills/<name>/...``  (zero or more; each bundled skill ships
                                   under ``home/skills/`` so the launcher's
                                   import step copies it onto the DSH_HOME
                                   root → ``<DSH_HOME>/skills/<name>``)
* ``.dspack.sha256`` — lowercase hex SHA-256 of the ``.dspack`` file,
  64 bytes, **no** trailing newline.

Usage:
    python scripts/build-dspack.py [REPO_ROOT] [OUT_DIR]

Defaults: REPO_ROOT = repo root (parent of this script's dir),
OUT_DIR   = current working directory.
"""
from __future__ import annotations

import hashlib
import json
import sys
import zipfile
from pathlib import Path

# Exact bytes produced by dsh-packforge-app (41 bytes incl. trailing newline).
DSPACK_JSON = b'{\n  "format": "dspack",\n  "version": 3\n}\n'

# (archive path, source path relative to repo root); dspack.json is synthetic.
ENTRIES = [
    ("manifest.json", "manifest.json"),
    ("package.json", "package.json"),
    ("pnpm-workspace.yaml", "pnpm-workspace.yaml"),
    ("overrides/cordis.patch.yml", "overrides/cordis.patch.yml"),
]

# Directory (relative to repo root) whose contents are shipped verbatim under
# the same path inside the dspack. The launcher copies ``home/`` onto the
# DSH_HOME root on import, so ``home/skills/<name>`` lands at
# ``<DSH_HOME>/skills/<name>``.
HOME_PAYLOAD_DIR = "home"


def collect_home_entries(repo_root: Path) -> list[tuple[str, str]]:
    """Return (arcname, src_rel) pairs for every file under HOME_PAYLOAD_DIR."""
    out: list[tuple[str, str]] = []
    base = repo_root / HOME_PAYLOAD_DIR
    if not base.is_dir():
        return out
    for p in sorted(base.rglob("*")):
        if p.is_file():
            rel = p.relative_to(repo_root).as_posix()
            out.append((rel, rel))
    return out


def build(repo_root: Path, out_dir: Path) -> tuple[Path, str]:
    manifest = json.loads((repo_root / "manifest.json").read_text(encoding="utf-8"))
    name = manifest["name"]
    version = manifest["version"]
    dspack_name = f"{name}-{version}.dspack"

    out_dir.mkdir(parents=True, exist_ok=True)
    dspack_path = out_dir / dspack_name

    with zipfile.ZipFile(dspack_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("dspack.json", DSPACK_JSON)
        for arcname, src in ENTRIES:
            zf.writestr(arcname, (repo_root / src).read_bytes())
        for arcname, src in collect_home_entries(repo_root):
            zf.writestr(arcname, (repo_root / src).read_bytes())

    digest = hashlib.sha256(dspack_path.read_bytes()).hexdigest()
    (out_dir / f"{dspack_name}.sha256").write_text(digest)  # 64 bytes, no newline

    return dspack_path, digest


def main() -> int:
    here = Path(__file__).resolve().parent
    repo_root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else here.parent
    out_dir = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else Path.cwd()

    dspack_path, digest = build(repo_root, out_dir)
    size = dspack_path.stat().st_size
    print(f"built  {dspack_path}  ({size} bytes)")
    print(f"sha256 {digest}")
    print(f"sidecar {(out_dir / (dspack_path.name + '.sha256'))}")

    skill_count = len([e for e in collect_home_entries(repo_root)
                       if e[0].startswith("home/skills/") and e[0].count("/") == 2
                       and e[0].endswith("SKILL.md")])
    print(f"skills {skill_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
