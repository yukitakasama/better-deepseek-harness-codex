# better-deepseek-harness-codex v3.1.0-pre.1

This is a GitHub pre-release. It is intentionally published on the `pre` channel and
must not be treated as `latest` or stable.

## Changes

- Upgraded the base DSH version from `0.2.1-rc.2` to `0.2.2-rc.1`.
- Updated the 10 retained plugins to their npm `latest` versions:
  - `dsh-cost-meter@1.9.58`
  - `@linxin666/dsh-client-ui-git-graph@0.4.14`
  - `dsh-pet@0.4.5`
  - `@michengai/dsh-btw@1.3.5`
  - `@michengai/dsh-simplify@1.0.7`
  - `@michengai/dsh-code-review@1.0.8`
  - `@michengai/dsh-codex-ui@2.0.19`
  - `@nanmicoder/dsh-agent-teams@0.1.29`
  - `dsh-context@0.82.2`
  - `dsh-plugin-subagent-director@0.6.0`
- Removed `dsh-workbuddy-connect@0.7.9`. Its six DSH peers remain exact at
  `0.2.1-rc.2`, and npm has no newer compatible release.
- Removed the complete `home/skills/` payload. The resulting `.dspack` contains zero
  bundled skill directories and does not populate `DSH_HOME/skills/` on import.
- Updated the offline compatibility check to mirror DSH 0.2.2's actual preflight:
  top-level `engines.dsh` takes precedence, otherwise DSH peers are checked with
  prerelease-aware semver.

## Package contents

- Mounted plugins: 10
- Official base bundles: 2
- Bundled skills: 0
- Release tag: `v3.1.0-pre.1`
- Release channel: GitHub pre-release (`--prerelease`)

## Runtime requirement

DSH `0.2.2-rc.1` requires Node `>=24.9.0`.
