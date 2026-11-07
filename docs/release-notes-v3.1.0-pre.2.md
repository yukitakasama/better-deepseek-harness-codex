# better-deepseek-harness-codex v3.1.0-pre.2

This is a GitHub pre-release. It is intentionally published on the `pre` channel and
must not be treated as `latest` or stable.

## Changes

- Added `billion-context@0.1.212` for model-driven context compression. The package ships a DSH bundle patch but does not declare `engines.dsh` or an `@deepseek-ai/dsh-*` peer, so it is not verifiable by the host compatibility gate.
- Added `dshmarket@1.73.14` for the in-DSH plugin marketplace. Its `@deepseek-ai/dsh-settings` peer range covers DSH `0.2.2-rc.1`.
- Kept the DSH host pinned to `0.2.2-rc.1` and the existing 10 plugins at their npm `latest` versions.

## Package contents

- Mounted plugins: 12
- Official base bundles: 2
- Bundled skills: 0
- Release tag: `v3.1.0-pre.2`
- Release channel: GitHub pre-release (`--prerelease`)

## Compatibility

The repository compatibility check reports 11 plugins as compatible with the host gate and 1 plugin as unverified because `billion-context` publishes no explicit DSH version declaration. The check has no incompatible entries.

## Runtime requirement

DSH `0.2.2-rc.1` requires Node `>=24.9.0`.
