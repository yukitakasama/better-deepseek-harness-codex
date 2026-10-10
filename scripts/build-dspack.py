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
    """Return (arcname, src_rel) pairs for every file under HOME_PAYLOAD_DIR.

    Raises SystemExit when the payload contains a nested ``home/`` tree —
    see :func:`_reject_nested_home`.
    """
    out: list[tuple[str, str]] = []
    base = repo_root / HOME_PAYLOAD_DIR
    if not base.is_dir():
        return out
    for p in sorted(base.rglob("*")):
        if p.is_file():
            rel = p.relative_to(repo_root).as_posix()
            out.append((rel, rel))
    _reject_nested_home(out)
    return out


def _reject_nested_home(entries: list[tuple[str, str]]) -> None:
    """Fail fast on nested ``home/`` directories inside the payload.

    An arcname shaped like ``home/**/home/**`` means a bundled skill was
    copied with its upstream host ``home/`` prefix still attached (issue #1):
    the launcher maps ``home/`` onto the DSH_HOME root on import, so the
    duplicate would land at ``<DSH_HOME>/skills/<name>/home/skills/<name>/``
    — dead data the skill filesystem never scans. Surface it at pack time
    instead of shipping it silently.
    """
    prefix = f"{HOME_PAYLOAD_DIR}/"
    inner = f"/{HOME_PAYLOAD_DIR}/"
    polluted = [
        arcname
        for arcname, _ in entries
        if arcname.startswith(prefix) and inner in arcname[len(prefix):]
    ]
    if not polluted:
        return
    shown = "\n".join(f"  - {arcname}" for arcname in polluted[:20])
    more = len(polluted) - 20
    raise SystemExit(
        f"build-dspack: {len(polluted)} payload file(s) live under a nested "
        "'home/' directory (e.g. home/skills/<name>/home/...). The launcher "
        "maps 'home/' onto the DSH_HOME root, so these would become dead "
        f"duplicates under <DSH_HOME>:\n{shown}"
        + (f"\n  ... and {more} more" if more > 0 else "")
        + "\nFix: remove the nested home/ tree(s), e.g. `git rm -r "
        "home/skills/<name>/home`. See docs/fix-plan-issue-1-v2.7.1.md."
    )


def build(repo_root: Path, out_dir: Path) -> tuple[Path, str]:
    manifest = json.loads((repo_root / "manifest.json").read_text(encoding="utf-8"))
    name = manifest["name"]
    version = manifest["version"]
    dspack_name = f"{name}-{version}.dspack"

    out_dir.mkdir(parents=True, exist_ok=True)
    dspack_path = out_dir / dspack_name

    # Collect (and validate) home payload entries *before* touching the
    # output files, so a nested-home rejection leaves no partial dspack.
    home_entries = collect_home_entries(repo_root)

    with zipfile.ZipFile(dspack_path, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("dspack.json", DSPACK_JSON)
        for arcname, src in ENTRIES:
            zf.writestr(arcname, (repo_root / src).read_bytes())
        for arcname, src in home_entries:
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

    # Count skill directories: home/skills/<name>/... (not SKILL.md files —
    # a skill may legitimately ship nested SKILL.md files, and the old
    # `count("/") == 2` check could never match home/skills/<name>/SKILL.md,
    # so it always printed 0 even when all 47 skills were packed).
    skill_count = len({
        e[0].split("/")[2]
        for e in collect_home_entries(repo_root)
        if e[0].startswith("home/skills/") and len(e[0].split("/")) > 3
    })
    print(f"skills {skill_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
