# v3.2.0-pre.1 release notes

## Summary

- Base DSH version: 0.2.2-rc.1 -> 0.2.2-rc.5.
- Manifest version: 3.2.0-pre.1.
- Mounted plugins: 13 total (11 retained from v3.1.0 plus two additions).
- Compatibility gate: 13/13 mounted plugins pass docs/compat-check.cjs.

## Added

| Package | Version | Evidence |
|---|---:|---|
| dsh-chief | 1.4.0 | engines.dsh >=0.2.2-rc.2; upstream README says adapted to DSH 0.2.2-rc.5. No independent rc.5 smoke test was available. |
| dsh-deep-ptc-mode | 2.1.0 | engines.dsh >=0.2.2-rc.1; peers for DSH base/client/UI/tools/web use the same lower line. Node >=24. No independent rc.5 smoke test was available. |

## Skipped

The target is a prerelease host, so a coarse 0.2.x range is not enough. npm semver only allows a prerelease candidate when the comparator set includes a prerelease comparator for the same major/minor/patch tuple. See https://raw.githubusercontent.com/npm/node-semver/main/README.md (Prerelease Tags).

| Candidate | Decision | Reason |
|---|---|---|
| dsh-live-compact@1.1.12 | skipped | Its >=0.2.0-rc.2 <0.3.0 engines/peers do not strictly satisfy 0.2.2-rc.5; no explicit rc.5 test. |
| dsh-drawai@0.4.8 | skipped | Its @deepseek-ai/dsh-tools >=0.2.0-rc.1 <0.3.0-0 peer does not strictly satisfy 0.2.2-rc.5; no explicit rc.5 test. |
| dsh-computer-use-ljl454@1.50.1 | skipped | Its DSH/peer >=0.2.1-rc.2 <0.3.0 declarations do not strictly satisfy 0.2.2-rc.5; explicit releases list only rc.2/rc.3. Windows desktop only. |
| dsh-research@0.4.6 | skipped | Requested wonderandyou identity does not match the npm maintainer/repository. No dsh engine declaration; host-webserver peer starts at 0.1.0-rc.6, not rc.5 tuple. |
| @hxhxh/dsh-tray-restart@0.3.1 | skipped | Supplied repository unavailable; only a Windows desktop package was found, with no DSH engine or peer declaration. |
| @dsh-packforge/dsh-pack-plugin@0.3.5 | skipped | No engines, peerDependencies, dshVersion, or dshVersions declaration. |

## Validation

- node --check docs/compat-check.cjs passed.
- node docs/compat-check.cjs passed: 13/13.
- Manifest and package JSON parse successfully.
- This is intentionally a prerelease. It must not be marked stable/latest.
