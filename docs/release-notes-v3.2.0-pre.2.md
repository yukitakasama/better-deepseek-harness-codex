# v3.2.0-pre.2 release notes

## Summary

- Base DSH version: 0.2.2-rc.5.
- Manifest version: 3.2.0-pre.2.
- Mounted plugins: 20 total (13 from v3.2.0-pre.1 plus seven CI candidates).
- This is a PR validation build. It is not merged and must not replace the stable/latest release.

## Added for CI validation

The following candidates requested in the current task are included on the branch:

| Package | Version | Source | Compatibility status |
|---|---:|---|---|
| dsh-live-compact | 1.1.12 | npm | Declared range requires CI/runtime validation for rc.5 |
| dsh-drawai | 0.4.8 | npm | Peer range requires CI/runtime validation for rc.5 |
| dsh-computer-use-ljl454 | 1.50.1 | npm | Desktop/Windows-oriented; CI/runtime validation required |
| dsh-research | 0.1.0 | Git commit d3827723b242555aed558b7ec02130fd3a2a3f85 | No DSH engine/peer declaration; unverified |
| @hxhxh/dsh-tray-restart | 0.3.1 | npm | Windows package with no DSH engine/peer declaration; unverified |
| @dsh-packforge/dsh-pack-plugin | 0.3.5 | npm | No DSH engine/peer declaration; unverified |
| dsh-bili-whale | 1.0.1 | Git commit f1847ff9e1eca4fc27edadd41847fb3d9e6ec668 | No DSH engine/peer declaration; unverified |

The GitHub repositories are pinned to commits where npm publication was unavailable or the requested source is Git-based.

## Compatibility checker behavior

The checker reads the host from manifest.json and validates declared engines/peers. Packages with no DSH engine or peer declaration are retained for structural/build CI but print INFO no DSH engine/peer declaration: compatibility unverified; they are not treated as runtime-compatible solely because the archive builds.

Broad prerelease ranges also need actual CI/runtime confirmation for DSH 0.2.2-rc.5. npm prerelease semantics do not let a generic 0.2.x range prove compatibility with every rc candidate.

## Validation target

- Pull request CI must run the manifest compatibility and dspack build/inspection jobs.
- No merge or stable release is performed by this change.
