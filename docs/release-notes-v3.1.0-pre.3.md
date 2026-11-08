# better-deepseek-harness-codex v3.1.0-pre.3

This is a GitHub pre-release. It is intentionally published on the `pre` channel
and must not be treated as `latest` or stable.

## Changes

- Added `dsh-rea` from `Fanqi89/dsh-rea` at commit `5769b4e55246787cb7c09025725db8e34db93e81` (v1.4.0).
- The bundle exposes REA through `@deepseek-ai/dsh-mcp-client`; the plugin declares `engines.dsh >=0.2.1-rc.2`, which covers DSH `0.2.2-rc.1`.
- Added the open-source `dsh-deepseek-stack` adapter from `yukitakasama/dsh-deepseek-stack` at commit `9d5b7a7f819ee3410ba8b135946617ea71d2b91b`.
- The adapter exposes all 29 upstream skills through the official DSH skill registry; personal policy overlays are kept out of the public plugin repository.

## Package contents

- Mounted plugins: 14
- Official base bundles: 2
- Bundled skills: 0 (skills are supplied by `dsh-deepseek-stack`)
- Release tag: `v3.1.0-pre.3`
- Release channel: GitHub pre-release (`--prerelease`)

## Compatibility

The repository compatibility check reports 13 plugins as compatible with the host gate and 1 plugin as unverified because `billion-context` publishes no explicit DSH version declaration.

## Runtime requirement

DSH `0.2.2-rc.1` requires Node `>=24.9.0`.
