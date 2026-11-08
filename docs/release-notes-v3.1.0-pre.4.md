# better-deepseek-harness-codex v3.1.0-pre.4

This is a GitHub pre-release.

## Fix

- Fixed `dsh-deepseek-stack` being skipped during profile loading because its
  package did not declare `dsh.bundle.patch` metadata.
- The plugin now ships the standard `cordis.patch.yml` entry and is pinned to
  `yukitakasama/dsh-deepseek-stack@ed2fb187e6c8eea1b74bba754c1b229d17c176ac`
  (plugin version `0.1.1`).
- The upstream 29 skill files remain unchanged.

## Package contents

- Mounted plugins: 14
- Official base bundles: 2
- Bundled skills in the public package: 0 (skills are supplied by the plugin)
- Release tag: `v3.1.0-pre.4`
- Release channel: GitHub pre-release (`--prerelease`)

## Personal package

The personal `.dspack` was regenerated outside the open-source repository. It
contains the same public plugin pin plus the 29-skill local policy overlay.
