# Better DeepSeek Harness (Codex Style)

简体中文 | English

A DeepSeek Harness modpack for **Coding users**, aligned with the style and features of Codex.
Built on **DSH 0.2.1-rc.2** (since v3.0.0; the previous release used 0.2.0-rc.2).

> Modpack identifier: `better-deepseek-harness-codex` (repo name / `.dspack` prefix / profile name).
> Community modpack — not an official DeepSeek product.

## ⚠️ v3.0.0 is a breaking update (pre-release)

- **Host**: 0.2.0-rc.2 → **0.2.1-rc.2**. This is a cross-minor host change, so every plugin peer gate is re-evaluated and the old plugin set cannot simply be carried over.
- **Only the 11 plugins whose upstream explicitly declares 0.2.1-rc.2 support are mounted.** Another **13 plugins are installed but not mounted** — they are removed from `dsh.profile.bundles`, and their rows in `overrides/cordis.patch.yml` are set to `disabled: true` (the patch layer applies independently of bundles, so leaving a row alive would pull the module back in).
- **Install into a fresh profile**; do not overwrite a v2.x profile in place — the plugin sets only half overlap.
- **To re-enable a shelved plugin**: add it back to `package.json` → `dsh.profile.bundles`, delete the matching `disabled: true` in `overrides/cordis.patch.yml`, and confirm upstream has added 0.2.1-rc.2 to its peer range or `dsh.compatibility.dshReleases`.
- Per-plugin evidence (peer matrix / `dshReleases` / `engines.dsh` / README / release notes) is in `docs/release-notes-v3.0.0.md`.

## What's Inside (the 11 plugins actually mounted in this release)

One command for the core of a Codex-style coding workbench:

- **Codex-style UI** — workspace session tree, global search, turn navigation, session rename/archive/fork (`@michengai/dsh-codex-ui` 1.1.47)
- **Code review & simplification** — `/review` runs an independent sub-agent; `/simplify` works by Git change scope (1.0.1 / 1.0.1)
- **Read-only side-ask** — ask about the current context without interrupting the main task (`@michengai/dsh-btw` 1.0.4)
- **Cost & balance** — per-session/daily cost, model prices, coding-plan quota, balance (`dsh-cost-meter` 1.9.30)
- **Desk pet** — dsh-pet: a blue big fish with 97 seamless transparent animations, idle breathing, screen wandering, throw-and-bounce dragging, multiple pets on one screen, and an optional always-on-top transparent desktop window (`dsh-pet` 0.3.8)
- **Git graph** — branch selection and commit graph (`@linxin666/dsh-client-ui-git-graph` 0.4.8)
- **Context dashboard** — dsh-context visualization (0.74.0)
- **Multi-agent teams** — agent-teams collaboration (`@nanmicoder/dsh-agent-teams` 0.1.26)
- **Per-subagent model** — subagent-director assigns a model per sub-agent (0.6.0-beta.2, **upstream `latest` is a beta**)
- **WorkBuddy model access** — reuses the WorkBuddy desktop app sign-in so GLM-5.3, DeepSeek-V4, Kimi-K3, MiniMax-M3, Hy3 and more appear in the model picker with zero configuration; **when nothing is installed or signed in the group simply hides** (0.7.9)
- **50 bundled skills** — installed into `DSH_HOME/skills/` on import (design/frontend, motion, data analysis, coding, office documents, browser automation including ego-lite's `ego-browser`; MCP servers are not shipped — configure them in your local `cordis.patch.yml`)

### Shelved in this release (installed, not mounted)

Upstream has **not explicitly declared** 0.2.1-rc.2 support for these (or explicitly does not support it); they are not loaded to avoid a gate rejection or a startup crash. Re-enable one at a time and verify it yourself.

| Plugin | Pinned version | Why it is shelved |
|---|---|---|
| `dsh-ops` | 0.3.0 | Upstream 0.4.1 only covers it via `^0.2.0-rc.2`; rc.2 is never named |
| `@goodandready/dsh-context-lens` | 0.1.28 | Range coverage only (`^0.1.7-rc.2 \|\| ^0.2.0-rc.1`) |
| `@goodandready/dsh-key-limits` | 0.2.19 | No `@deepseek-ai/dsh-*` peer at all → cannot confirm |
| `dsh-plugin-wallpaper-engine` | 1.2.0 | Range coverage only (`>=0.2.0-rc.1`); 1.4.0 also splits into 8 packages |
| `@modusensus/dsh-mneme` | 0.8.13 | Range coverage only; 0.9.4 adds a `dsh-better-sidebar` peer |
| `@mrweicodes/dsh-loop-guard` | 1.0.8 | Range coverage only; no upstream update since 2026-10-09 |
| `dsh-computer-use-win` | 0.2.3 | No `@deepseek-ai/dsh-*` peer at all → cannot confirm |
| `dsh-computer-use` | fork `72f390a` | Peers are all `*`, no compat statement; upstream stopped at 2026-09-15 |
| `dsh-prompt` | 0.3.0 | Only `engines.dsh >=0.2.0-rc.2` range coverage, no rc named |
| `@liustack/modlens` | 3.26.6 | No peer / engines declaration at all → cannot confirm |
| `dsh-effort-slider` | 1.3.1 | No compat statement at all; upstream stopped at 2026-09-26 → cannot confirm |
| `dsh-agent-arena` | fork `25e2c55` | Upstream Tikzen 0.7.0 **pins `0.2.0-rc.2` exactly** → not adapted |
| `@tencent-connect/dsh-qqbot` | fork `7e88006` | Range coverage only (`>=0.1.0-rc.6`); upstream 0.5.2 does not name rc.2 either |

## Installation

Requires **DSH 0.2.1-rc.2** (this modpack's `dshVersion` pins exactly that version; since v3.0.0 it no longer declares 0.2.0.x compatibility).

```bash
dsh --profile better-deepseek-harness-codex
```

Or import the `.dspack` from the DSH launcher.

> **Note (git dependencies)**: the pack still carries 3 git dependencies (`dsh-computer-use`, `dsh-agent-arena`,
> `@tencent-connect/dsh-qqbot`), so installation requires access to GitHub. Since v3.0.0 all three are
> **shelved** (not mounted) but stay in `dependencies` so they can be re-enabled at any time; if your network
> cannot fetch git dependencies, delete them from `package.json` — the mounted set is unaffected.

> **WorkBuddy prerequisite**: since v2.7.0 the pack ships `dsh-workbuddy-connect`, which reuses the
> **local sign-in state** of the WorkBuddy desktop app. To actually see the WorkBuddy model groups you
> need WorkBuddy (domestic edition or international WorkBuddy AI) installed and signed in.
> **Not installing it does not break anything** — the group hides and every other plugin works as before.
> See "WorkBuddy model access" below.

## Changelog

### v3.0.0 (2026-10-23) (**breaking update · pre-release**)

- **Host upgrade**: DSH `0.2.0-rc.2` → **`0.2.1-rc.2`** (identical under both npm `latest` and the newest official GitHub Release; npm also carries `0.2.1-rc.3` under `next` as of the same day, with no GitHub Release, and this release does not follow it). `manifest.dshVersions` now declares only `0.2.1-rc.2`.
- **Plugins are selectively mounted** by one criterion: does upstream explicitly declare 0.2.1-rc.2?
  **Mounted (11)**: `@michengai/dsh-codex-ui` 1.1.47, `@michengai/dsh-code-review` 1.0.1, `@michengai/dsh-simplify` 1.0.1, `@michengai/dsh-btw` 1.0.4, `dsh-cost-meter` 1.9.30, `dsh-context` 0.74.0, `dsh-pet` 0.3.8, `@linxin666/dsh-client-ui-git-graph` 0.4.8, `@nanmicoder/dsh-agent-teams` 0.1.26, `dsh-plugin-subagent-director` 0.6.0-beta.2 (upstream `latest` is a beta), `dsh-workbuddy-connect` 0.7.9.
  **Shelved (13)**: installed but removed from `bundles` and disabled in the patch layer — `dsh-ops`, `@goodandready/dsh-context-lens`, `@goodandready/dsh-key-limits`, `dsh-plugin-wallpaper-engine`, `@modusensus/dsh-mneme`, `@mrweicodes/dsh-loop-guard`, `dsh-computer-use-win`, `dsh-computer-use`, `dsh-prompt`, `@liustack/modlens`, `dsh-effort-slider`, `dsh-agent-arena`, `@tencent-connect/dsh-qqbot`.
- **Patch layer disabled in step** (critical — otherwise a single patch row pulls the module back in): `computer-use` (the HOST row, previously the "non-Windows only" guard, now unconditionally `disabled: true`), `preset-computer-use` (whole preset), `mcp-dsh-computer-use-win` (its MCP client), `dsh-ops-file` / `dsh-ops-shell`.
- **Version jumps**: three of the MichengAI plugins cross a major (`dsh-btw` 0.1.15→1.0.4, `dsh-code-review` 0.1.9→1.0.1, `dsh-simplify` 0.1.12→1.0.1), plus `dsh-context` 0.63→0.74, `dsh-cost-meter` 1.7.47→1.9.30, `dsh-agent-teams` 0.1.22→0.1.26. **All of these are upstream rebuilds for the 0.2.1 line, so behaviour changes — walk your usual flows after installing.**
- **Counts**: dependencies 24 → **24** (nothing removed); bundles 26 → **13** (11 plugins + 2 official bases); `compat-check` mounted **11/11 pass**, 13 shelved reported separately (6 of which have no peer declaration at all).
- **Known trade-off**: `dsh-plugin-subagent-director@0.6.0-beta.2` is a beta and moves persona/toolFilter into Agent Presets; it is the only version declaring rc.2, so it is mounted — if you do not want a beta, move it out of `bundles` (same shelving procedure).
- Per-plugin evidence (current version / upstream latest / declaration / source links) is in `docs/release-notes-v3.0.0.md`.
### v2.9.0 (2026-10-23) (**pre-release, not a stable release**)

- **Desk pet swap**: `dsh-whale-girl-pet@0.3.7` → **`dsh-pet@0.3.8`**
  ([PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)). A blue big fish: 97 seamlessly
  chained transparent animations, idle breathing, screen wandering, squash-and-stretch clicks,
  throw-and-bounce drag physics, right-click action menu, balance animation with a thinking bubble,
  occasional self-talk and a chat dialog; multiple pets on one screen, and an optional **desktop**
  (always-on-top transparent) window. Row id `dsh-pet`; the settings section is carried by
  `settings.section` (`pet-config`) and the pet itself is a `position: fixed` overlay that takes no
  sidebar slot — no conflict with codex-ui's sidebar rework, so `overrides/cordis.patch.yml` needed
  **no new entries** (only two comments updated).
- **Desktop window is optional**: the first time the host finds no local Electron it downloads one
  runtime into `~/.dsh/electron` (once only, progress on the console); a failed download or not
  wanting it only affects desktop mode — **the in-browser pet keeps working** (settings → display
  location: browser / desktop / both).
- **Added ego-lite (the `ego-browser` skill)**: [citrolabs/ego-lite](https://github.com/citrolabs/ego-lite)
  v2.1.0 — the agent drives your signed-in Chromium for browser automation. Upstream's DSH entry point
  (`plugins/ego`, package `@citrolabs/ego`) breaks when installed from git because npm/pnpm drop the
  symlinked Skill directory and it then throws `ENOENT` at import (measured), so this pack ships the
  same `skills/ego-browser/` payload (tag `v2.1.0`) instead. See "ego-lite browser automation" above
  for the reasoning and prerequisites.
- **Compatibility**: all 9 `@deepseek-ai/dsh-*` peers of `dsh-pet@0.3.8` are `^0.2.0-rc.1`, satisfied
  by host 0.2.0-rc.2; the package's own `dsh.compatibility.dshReleases` also declares
  `0.2.0-rc.2 = compatible`; non-`dsh-*` peers cordis `^4.0.4` (host 4.0.4) and react/react-dom
  `^18.2.0` match the existing plugin baseline. `docs/compat-check.cjs` gained a `dsh-pet@0.3.8`
  entry: **13/13 pass**.
- **Counts**: plugins 24 → **24** (one-for-one swap; bundles 26 including the 2 official bases,
  dependencies 24); bundled skills **49 → 50** (new `ego-browser`, 50 directories).
- **Release channel**: the version rolls forward a normal minor step 2.8.1 → **2.9.0**, but the GitHub
  Release is published as a **pre-release**, not a stable one. CI (`.github/workflows/release.yml`)
  now checks `docs/prerelease-versions.txt` and passes `--prerelease` for listed versions.
- Full notes: `docs/release-notes-v2.9.0.md`.

### v2.8.1 (2026-10-10)
- **Removed**: `dsh-inline-figures@0.1.0` — its `draw_figure` tool kept failing with
  `invalid output: value is not lossless JSON` on the return channel (reproduced with a
  minimal spec, so the fault is in the tool binding layer, not the spec, and cannot be
  configured around). Figure drawing now falls back to the bundled `chart-visualization`
  skill and host-native capabilities.
- All 6 references cleaned in step: `package.json`, `manifest.json` (both descriptions),
  `pnpm-workspace.yaml`, `docs/compat-check.cjs`, `README.md`, `README.en.md`.
- Plugins 25 → 24 (bundles 27 → 26 including the 2 official base bundles; dependencies
  25 → 24); compat-check installed plugins 13 → 12; the 49 bundled skills are unchanged.
- **No version changes**: the other 24 plugins, and base DSH 0.2.0-rc.2, are identical to v2.8.0.
- Full notes in `docs/release-notes-v2.8.1.md`.

- **Added the dsh-ops plugin** ([T-Auto/dsh-ops](https://github.com/T-Auto/dsh-ops) 0.3.0, from the
  npm registry, whose peer range already declares DSH 0.2.0-rc.2): four Rust file tools
  (`ops_inspect_local_file` / `ops_grep` / `ops_glob` / `ops_replace`), an `ops_bash` command
  executor, and a bundled PowerShell 7 on Windows. The file and shell components are enabled by
  default; ptc (native PTC batch) and tui (read-only sidebar) stay off as upstream ships them.
  `overrides/cordis.patch.yml` records the two enabled components' config and adds
  `disabled: !!js process.platform !== 'win32'` to the `pwsh-sandbox` row, so a non-Windows host
  never points at a missing executable.
- No plugin source was modified; the worker binary and the bash / pwsh payloads arrive with the
  npm dependency, with no install-time download scripts.

### v2.7.1 (2026-10-10)
- **Fixed (issue #1)**: 6 bundled skills (agent-browser / docx / pdf / pptx / research / xlsx) carried a
  mistakenly nested `home/skills/<name>/` tree (introduced in `fafc9e8` when the skills were vendored in
  v2.5.0 with their upstream host prefix attached). The launcher maps `home/` onto the DSH_HOME root on
  import, so the duplicates landed at `$DSH_HOME/skills/<name>/home/skills/<name>/` — dead data the skill
  filesystem (one-level scan) never reads. All nested trees removed; still 49 skill directories.
- **Build regression guard**: `scripts/build-dspack.py` now fails the pack with a listed-path error when
  any payload entry matches `home/**/home/**` (payload is collected and validated before any output is
  written); a matching guard was added to CI.
- **dsh-computer-use platform guard**: the plugin's Python sidecar entry (`cli.py:51`) unconditionally
  imports `computer_use.win_dpi`, whose module top level calls `ctypes.WinDLL("user32", …)` — a
  Windows-only attribute, so non-Windows platforms printed a full Traceback on every startup (harmless
  thanks to `failOnStartupError: false`, but noisy; issue #1). This pack now sets
  `disabled: !!js process.platform !== 'win32'` on both the HOST-plane `computer-use` row (inserted by the
  upstream bundle patch; id verified against the pinned commit) and the `tool-computer-use` row inside
  `preset-computer-use` (same pattern as the existing `tool-pwsh` guard): quietly unavailable on
  non-Windows, unchanged behavior on Windows. Per-key override semantics — only `disabled` is touched;
  the source-level fix goes upstream as a PR.
- **Housekeeping**: removed the unnecessary `dsh-workbuddy-connect@0.7.1` `minimumReleaseAgeExclude` from
  `pnpm-workspace.yaml`, as promised in the v2.7.0 changelog post-mortem (published 2026-10-01, well past
  the 1-day window).
- **No dependency changes**: plugin count, versions and base are identical to v2.7.0.
- Full notes in `docs/release-notes-v2.7.1.md`; fix plan and local evidence in
  `docs/fix-plan-issue-1-v2.7.1.md`.

### v2.7.0 (2026-10-07)
- **Added**: `dsh-workbuddy-connect@0.7.1` — **WorkBuddy model access**. Reuses the WorkBuddy desktop
  app's local sign-in to register GLM-5.3, GLM-5.2, GLM-5.3-Flash, DeepSeek-V4-Pro/Flash, Kimi-K3,
  MiniMax-M3, Hy3 and more as a DSH provider, available in the model picker and `/model` with zero
  configuration; domestic and international editions form separate groups with independent credits.
  See "WorkBuddy model access" below.
- **No new barrier to entry**: with WorkBuddy absent or signed out, the group is simply hidden (since
  0.7 there is no built-in fallback list, because those models always errored) — no startup errors.
- **Compatibility**: all 7 `@deepseek-ai/dsh-*` peers are pinned to exactly `0.2.0-rc.2`, matching this
  pack's base (gate 7/7 ✅). `0.7.x` targets the 0.2.0 kernel only; DSH `0.1.x` users must stay on
  `0.6.5`, and a mismatch makes DSH fail to start.
- **Layer position**: after `@tencent-connect/dsh-qqbot`, before `@michengai/dsh-codex-ui`;
  `overrides/cordis.patch.yml` gains **no new entry** — the provider row comes from the plugin's own
  bundle patch.
- `pnpm-workspace.yaml` adds `dsh-workbuddy-connect@0.7.1` to `minimumReleaseAgeExclude`.
  **Traced afterwards (2026-10-07)**: the threshold is not set in the profile's `pnpm-workspace.yaml` — it
  comes from pnpm 11's `minimumReleaseAge` (the DSH ecosystem treats it as `1440` minutes = 1 day, per the
  bypass logic in the dsh-market installer). 0.7.1 was published 2026-10-01, far outside a 1-day window →
  **this exclude entry is unnecessary**; it stays in the already-published v2.7.0 asset and will be
  **removed in the next version**.
- Plugin total 23 → **24** (bundles 25 → **26** including the 2 official base bundles;
  dependencies 23 → **24**); bundled skills and base unchanged from v2.6.0.
- **Verification (measured 2026-10-07; see "Verification record")**: with an isolated real
  `@deepseek-ai/dsh@0.2.0-rc.2` CLI and a separate DSH_HOME — `dsh --dump-config` **exit 0, 0 bytes on
  stderr**, **23/23 tested bundles present**, `llm-workbuddy` row in place; the web service listened and
  the UI rendered with no WorkBuddy group while signed out. **Limits**: the three git-dependency plugins
  were not part of this boot (pnpm hits a `[EBUSY]` store lock fetching git deps on Windows), and no
  signed-in WorkBuddy smoke test was possible (app not installed here). Upstream states 0.7.0/0.7.1 were
  real-machine tested on 0.2.0-rc.2 web.

### v2.6.0 (2026-10-06)
- **Added**: `dsh-computer-use` (pinned to upstream commit `72f390a`, unmodified) — Codex-style
  Computer Use: 13 native window2 tools plus `batch_actions` / `health` / `experience`, a visible
  synthetic cursor and status pill, an Esc interrupt and per-app approvals.
- **Added a dedicated `computer-use` preset**: the upstream plugin only ships the HOST plane, so this
  pack inserts a **new** preset carrying the tool rows (writing into `preset-standard` would replace
  its whole `plugins` array — measured: the standard preset's 32 rows collapse). **Ordinary coding
  sessions (standard / ptc) never get the mouse.**
- Coexists with `dsh-computer-use-win`, but do not drive the desktop from both in one session.
- **Bundled skills 47 → 49**: `computer-use`, `computer-use-browser` added.
- Plugin total 22 → **23** (bundles 24 → 25; dependencies 22 → 23).

### v2.5.0 (2026-10-06)
- **49 curated cross-harness skills now ship inside the pack**: the `.dspack` carries `home/skills/`,
  which lands in `DSH_HOME/skills/` on import, so skills no longer depend on a local harness folder.
- No MCP servers are shipped with the pack: `overrides/cordis.patch.yml` keeps only the computer-use
  fix; configure extra MCP servers in the launcher's MCP page.
- Base and plugin combination identical to v2.4.0; `scripts/build-dspack.py` now carries `home/skills/`.

### v2.4.0 (2026-10-05)
- **Added**: `@tencent-connect/dsh-qqbot` — a QQ Bot channel (Tencent's official plugin): DM/group chat,
  image and file understanding, streaming replies, proactive questions with action confirmation,
  `/preset`, `/compact`, `/bot-ping`.
- **Switched to the `yukitakasama/dsh-qqbot` fork and kept it disabled by default**: the original blocks
  the cordis plugin chain waiting for a QR scan when credentials are missing (no timeout), which leaves
  the whole instance stuck "waiting for ready".
- Plugin total 21 → **22** (bundles 23 → 24; dependencies 21 → 22).

### v2.3.0 (2026-10-05)
- **Added 7 plugins** (picked via the interactive selector; peer gate all-pass + real `dsh --dump-config` with zero stderr):
  - `@mrweicodes/dsh-loop-guard@1.0.8` — thought-loop guard
  - `@modusensus/dsh-mneme@0.8.13` — cross-session long-term memory
  - `@liustack/modlens@3.26.6` — vision bridge & screenshot understanding
  - `dsh-inline-figures@0.1.0` — inline vector figures in answers
  - `dsh-prompt@0.3.0` — prompt template toolbox
  - `dsh-plugin-wallpaper-engine@1.2.0` — Wallpaper Engine live wallpapers (npm latest is 1.2.0; the repo's 1.3.0 is unpublished)
  - `@goodandready/dsh-key-limits@0.2.19` — API key / subscription quota limits (npm is at 0.2.19, ahead of the repo's 0.2.15)
- **Removed**: `dsh-edit-resend@0.1.0` — the npm artifact declares peers `^0.1.0-rc.6` and is rejected by the runtime
  on 0.2.0-rc.2 (v2.1.0 judged it "no peers" from the GitHub source; corrected by real-machine testing)
- **Fix**: the repo `package.json` had lagged behind the manifest since v2.1.0 (missing 4 plugins); fully re-synced;
  the duplicate codex-ui entry in the manifest was also cleaned up (kept unique at the end of the layer stack)
- Total plugins 15 → 21, dependencies 14 → 21; `pnpm-workspace.yaml` gains `minimumReleaseAgeExclude` entries for new plugins
- Real-machine verification: `dsh --dump-config` exit 0, zero stderr, all 23 bundles loaded (isolated install of @deepseek-ai/dsh@0.2.0-rc.2)

### v2.2.0 (2026-10-05)
- **Added**: dsh-agent-arena — a multi-agent council and prompt arena (adjustable collaboration bar, channel rate limiting, auto turn-taking)
- **Compatibility handling**: upstream `Tikzen/dsh-agent-arena@0.6.0` pins all core peers to exactly `0.1.7-rc.2`,
  which cannot be installed under DSH 0.2.0-rc.2; with authorization, a **fork-with-relaxed-peers** approach is used —
  `yukitakasama/dsh-agent-arena@feat/relax-peers-0.2.0-rc.2` (commit `25e2c55`),
  relaxing 10 core peers from exactly `0.1.7-rc.2` to `>=0.1.7-rc.2`, with the dependency pinned to that fork commit
- **Note**: installation requires access to GitHub (git fork dependency); switch back to the npm version once upstream ships an official 0.2.0-rc.2 release
- `.gitignore` now ignores `.workbuddy/` (local memory directory)

### v2.1.0 (2026-10-04)
- **Added 4 community plugins** (all peers compatible with 0.2.0-rc.2, gated by `docs/compat-check.cjs`):
  - `@nanmicoder/dsh-agent-teams@0.1.22` — multi-agent team collaboration
  - `dsh-context@0.63.0` — context visualization dashboard
  - `dsh-plugin-subagent-director@0.5.5` — per-subagent model selection
  - `dsh-edit-resend@0.1.0` — edit & resend messages, closing the gap left by the earlier removal of edit-message
- Total plugins 12 → 16 (bundles), dependencies 10 → 14, all pinned to exact versions; zh/en descriptions updated
- Added `docs/`: plugin research report, interactive selector (`plugin-selector.html`), compatibility check script (`compat-check.cjs`) and results

### v2.0.0 (2026-09-30)
- **Breaking change**: base upgraded to DSH 0.2.0-rc.2
- **Removed**: dsh-plugin-edit-message (no 0.2.x-compatible version)
- **Updated**: all 10 plugins updated to the latest versions and verified for compatibility
- **Added**: `dshVersions` and `launchers` fields in the manifest (spec v5)
- **Renamed**: the modpack is renamed "Better DeepSeek Harness (Codex Style)"; identifier/repo name/`.dspack` prefix/profile name unified as `better-deepseek-harness-codex`

### v1.1.0
- Added Windows Computer Use support

### v1.0.0
- Initial release, based on DSH 0.1.7-rc.2

## v2.0.0 Migration Notes

### Major changes
- **Base upgrade**: from DSH 0.1.7-rc.2 to 0.2.0-rc.2
- **Removed plugin**: dsh-plugin-edit-message (no 0.2.x-compatible version)
- **All plugins updated**: all 10 plugins updated to the latest versions supporting 0.2.0-rc.2

### Plugin list changes (10 plugins, all pinned to exact versions)

| Plugin | v1.1.0 | v2.0.0 | Change |
|---|---|---|---|
| `@michengai/dsh-codex-ui` | 1.1.18 | 1.1.25 | ↑ 7 patch versions |
| `@michengai/dsh-code-review` | 0.1.7 | 0.1.9 | ↑ 2 patch versions |
| `@michengai/dsh-simplify` | 0.1.10 | 0.1.12 | ↑ 2 patch versions |
| `@michengai/dsh-btw` | 0.1.13 | 0.1.15 | ↑ 2 patch versions |
| `dsh-effort-slider` | 1.2.0 | 1.3.1 | ↑ minor version |
| `dsh-cost-meter` | 1.7.37 | 1.7.47 | ↑ 10 patch versions |
| `dsh-whale-girl-pet` | 0.3.4 | 0.3.7 | ↑ 3 patch versions |
| `@goodandready/dsh-context-lens` | 0.1.24 | 0.1.28 | ↑ 4 patch versions |
| `@linxin666/dsh-client-ui-git-graph` | 0.4.2 | 0.4.4 | ↑ 2 patch versions |
| `dsh-computer-use-win` | 0.1.2 | 0.2.3 | ↑ minor + 1 patch version |
| ~~`dsh-plugin-edit-message`~~ | ~~0.1.5~~ | **removed** | no 0.2.x-compatible version |

### New manifest fields (manifest v5)
- `dshVersions`: declares the set of tested-compatible versions (0.2.0-rc.2, 0.2.0-rc.1)
- `launchers`: declares launcher compatibility (dshl, dsh-packforge-app)

## Plugin List (24 in the pack; 11 mounted in this release)

### Mounted (present in `dsh.profile.bundles`)

| Plugin | Version | Purpose | Upstream declaration |
|---|---|---|---|
| `@michengai/dsh-codex-ui` | 1.1.47 | Codex-style sidebar, workspace session tree, global search, turn navigation | peer matrix enumerates `0.2.1-rc.2`; README says explicit support since 1.1.42 |
| `@michengai/dsh-code-review` | 1.0.1 | `/review` code review via an independent sub-agent | peer matrix + README badge "up to 0.2.1-rc.2" |
| `@michengai/dsh-simplify` | 1.0.1 | `/simplify` Git-scoped simplification | peer matrix enumerates `0.2.1-rc.2` |
| `@michengai/dsh-btw` | 1.0.4 | Read-only side-ask | peer matrix + README says 1.0.0 was tested on rc.1/rc.2 |
| `dsh-cost-meter` | 1.9.30 | Cost metering, model prices, coding-plan quota, balance | `dsh.compatibility.dshReleases` includes rc.2; README names rc.2 as the adaptation target |
| `dsh-context` | 0.74.0 | Context visualization dashboard | `dshReleases` explicitly `0.2.1-rc.2 = compatible` |
| `dsh-pet` | 0.3.8 | Desk pet: blue big fish, 97 transparent animations, multiple pets, optional desktop window | `dshReleases` explicitly rc.2 = compatible |
| `@linxin666/dsh-client-ui-git-graph` | 0.4.8 | Git branch graph | `dsh.engines.dsh >=0.2.1-rc.2` + v0.4.7 notes name rc.2 |
| `@nanmicoder/dsh-agent-teams` | 0.1.26 | Multi-agent teams | 21 peers enumerate rc.2; README recommends "rc.2 + 0.1.26" |
| `dsh-plugin-subagent-director` | 0.6.0-beta.2 | Per-subagent model selection | `dshReleases` rc.1/rc.2 = compatible; `engines.dsh >=0.2.1-rc.1` (**beta**) |
| `dsh-workbuddy-connect` | 0.7.9 | WorkBuddy desktop model access (group hides when signed out) | 6 peers **pin** `0.2.1-rc.2` |

> ⚠️ **`dsh-workbuddy-connect` is deprecated upstream** (npm `deprecated`: the author has stopped maintaining it).
> It stays mounted here because 0.7.9 pins its peers to `0.2.1-rc.2`, which counts as an explicit declaration; but it will
> never be updated again, so if a future host bump leaves it behind, the only options are a local fork or removing it
> (removing it only means dropping it from `bundles` — it has no patch row).

> Layer-stack order: `@deepseek-ai/dsh-base` → `@deepseek-ai/dsh-web-app` → the table order above (`@michengai/dsh-codex-ui` always **last**, since it takes over the sidebar and settings page).

> The **13 shelved plugins** (installed but not mounted, with the re-enable procedure) are listed in the "Shelved in this release" table above.

### Two historical items upstream explicitly does not support

- `dsh-agent-arena`: upstream Tikzen 0.7.0 pins all 10 peers to **`0.2.0-rc.2` exactly**, so it would be rejected outright on 0.2.1-rc.2; this pack only ever mounted it through a self-maintained fork with relaxed peers — shelved in this release.
- `dsh-computer-use`: all peers are `*`, so no gate ever blocks it — and that says nothing about actual compatibility; upstream has had no commit since 2026-09-15, so it is shelved here (together with `preset-computer-use` and its MCP client row).

### Codex-style Computer Use (dsh-computer-use)

> **v3.0.0 status: shelved (not mounted)** — upstream has not explicitly declared 0.2.1-rc.2 support, so this plugin is not loaded in this release. The section is kept as reference for re-enabling it via the procedure in "Shelved in this release".

Upstream: [wushi2333/dsh-computer-use_codex-style](https://github.com/wushi2333/dsh-computer-use_codex-style),
pinned to an exact commit (`#72f390a`) and **shipped unmodified**.

It splits its capability across two planes, and this pack wires up both:

| Plane | Row | Provided by |
|---|---|---|
| HOST (process-wide desktop sidecar: pointer, overlay, capture, approvals, turn lifecycle) | `computer-use` | the plugin's own `cordis.patch.yml` |
| PRESET (the 13 window2 tools) | `tool-computer-use` | **this pack's `overrides/cordis.patch.yml`** |

**Why the pack must supply the second plane**: the upstream plugin ships only the HOST row —
its own comment says "Tools stay in the user agent preset so standard coding sessions do not
get the mouse". A tool row is only visible to the model when it is mounted in an agent preset,
so this pack adds a **`computer-use` preset**:

> **Ordinary coding sessions (standard / ptc) never get the mouse**; only a session created
> with the "Computer Use" preset carries the desktop tools.

Mechanically this layer uses `- insert:` to **add** a preset rather than writing rows into
`preset-standard`. A loader patch replaces an existing preset entry's whole `plugins` array
instead of appending: writing `config.plugins` once against `preset-standard` collapses its
32 rows down to the ones you wrote, which would destroy the default workbench. Adding a preset
leaves the existing four untouched (verified: their row counts are unchanged).

> **Do not drive the desktop from two plugins at once**: `dsh-computer-use-win` (a 22-tool
> extension-based approach) can coexist with this plugin — different tool names, different
> mounting — but two pointers/overlays running together fight each other. Pick one for daily
> desktop work.

The pack ships the `computer-use` and `computer-use-browser` skills into `DSH_HOME/skills/`.

### WorkBuddy model access (dsh-workbuddy-connect)

Upstream: [corrinehu/dsh-workbuddy-connect](https://github.com/corrinehu/dsh-workbuddy-connect),
pinned to npm `0.7.9` (the version that declares 0.2.1-rc.2), **shipped unmodified**.

It registers the models bundled in the WorkBuddy desktop app (GLM-5.3, GLM-5.2, GLM-5.3-Flash,
DeepSeek-V4-Pro/Flash, Kimi-K3, MiniMax-M3, Hy3, …) as a DSH LLM provider (`llm-workbuddy`), so they
appear in the model picker and in `/model` — **no extra API key required**.

- **Credentials come from the local app** — the plugin reuses WorkBuddy's desktop sign-in instead of
  starting its own OAuth flow; switching accounts in the app is followed automatically. On Windows it
  locates the decrypt helper via `%LOCALAPPDATA%\Programs\WorkBuddy\WorkBuddy.exe` first, then the
  uninstall registry; the international edition is registry-only.
- **Domestic and international never mix** — each forms its own group ("WorkBuddy" / "WorkBuddy AI"),
  each keyed to its own app's sign-in, with independent models, accounts and credits.
- **Silent when unsigned** — if an edition was never signed in and left no cached copy, **its group is
  not shown** (behaviour change since 0.7: the domestic edition used to show a built-in fallback list
  whose models always errored when selected). So users without WorkBuddy get **no startup errors** from
  this pack — measured 2026-10-07: `--dump-config` with zero stderr, web service listening, no group in
  the UI. (The browser console gains one more `list slot "plugins.item" requires options.id` message —
  the same class the baseline already emits without this plugin, i.e. a pre-existing slot-registration
  issue, not a v2.7.0 regression.)
- **Feature surface** — image input on most models (GLM-5.3-Flash, GLM-5.2, DeepSeek-V4 series, …);
  reasoning tiers where upstream declares them (low / high / max); credit multipliers and promotion
  badges (free-for-a-limited-time, night discount) right in the model names; a settings card with the
  account, token validity, remaining credits and whether the model list is live / saved / built-in.
- **Billing runs on WorkBuddy credits**, not an API-key balance, so the money figures in
  `dsh-cost-meter` use a **different basis**: cost-meter estimates by model price, while WorkBuddy
  deducts credit multipliers.

> **The version has to match**: v3.0.0 ships `dsh-workbuddy-connect@0.7.9`, whose six
> `@deepseek-ai/dsh-*` peers **pin `0.2.1-rc.2` exactly** — the same base as this pack (the previous
> 0.7.1 pinned `0.2.0-rc.2` and would be skipped wholesale after the host bump). A mismatched
> combination makes DSH **fail to start** — upstream issue #63 is the "plugin skipped wholesale by the
> host" case. This is one reason the pack pins `dshVersion` to `0.2.1-rc.2`. On DSH `0.1.x` you need `0.6.5`.
>
> The plugin also injects **web-platform client code** (`dsh.client.platform: web`, six official
> client packages including model-selection), matching this pack's web base. If you install it into a
> **TUI** profile instead, `@deepseek-harness-tui/dsh-tui` must be **≥ 0.10.0-beta.5**; older versions
> fail to start (`events is not iterable`).

### Native high-performance tooling (dsh-ops)

> **v3.0.0 status: shelved (not mounted)** — upstream has not explicitly declared 0.2.1-rc.2 support, so this plugin is not loaded in this release. The section is kept as reference for re-enabling it via the procedure in "Shelved in this release".

Upstream: [T-Auto/dsh-ops](https://github.com/T-Auto/dsh-ops), pinned to npm `0.3.0`
(the registry latest; upstream 0.3.1 shipped only as a GitHub Release and was never published
to npm). No source changes.

A resident tool set written in Rust, executed through the host subprocess as a fixed worker —
no model code ever runs:

- **Four file tools** — `ops_inspect_local_file` (bounded UTF-8 lines / hex view), `ops_grep`
  (Rust regex search with file filters, counts and summaries), `ops_glob` (multi-pattern path
  finder with excludes), `ops_replace` (cross-file literal replacement; precise edits still use
  the host `edit`)
- **`ops_bash`** — the preferred general command executor; short commands use `command`,
  longer scripts (heredocs, quotes, backslashes, non-ASCII) are written to a file first and
  passed as `script_path` to avoid nested JSON escaping
- **Bundled PowerShell 7** — Windows-native cmdlets / registry / services go through the host
  `pwsh` tool, which the plugin points at its own 7.6.6 at execution time

Tools appear with an `ops_` prefix and coexist with the host `read` / `edit` / `pwsh`: file reads
and replacements are recorded in the host read-before-write observation table, so a file read
through OPS can still be edited with the host `edit`.

**Component switches** (`dsh-ops/shell` and `dsh-ops/file` on by default; `dsh-ops/ptc` and
`dsh-ops/tui` off by default):

| Component | Default | Purpose |
| --- | --- | --- |
| `dsh-ops/shell` | on | `ops_bash` + bundled PowerShell 7 |
| `dsh-ops/file` | on | the four Rust file tools |
| `dsh-ops/ptc` | off | native PTC batch operations (`ops_batch` / `ops_result`), pure PTC sessions only |
| `dsh-ops/tui` | off | read-only dsh-TUI sidebar |
| `dsh-ops/hide-official` | off | masks official tools (not inserted by the 0.3.0 bundle patch) |

> **About bash on Windows**: in restricted modes (`workspace-write` / `read-only`) `ops_bash`
> runs only the IPC-verified bundled MSYS copy; pointing `bashPath` at your own Git for Windows
> returns `EXECUTOR_UNAVAILABLE` by design instead of executing unverified. Under
> `danger-full-access` an explicit `bashPath` is honoured.

### ego-lite browser automation (the ego-browser skill)

Upstream: [citrolabs/ego-lite](https://github.com/citrolabs/ego-lite) v2.1.0. ego-lite is a Chromium
built for AI agents: the agent reuses your **already signed-in** browser state to open pages, fill
forms, click, screenshot and extract data, without starting a blank browser or disturbing what you
are doing.

**Why it ships as a skill instead of a plugin dependency**: the entry point upstream prepares for DSH
is `plugins/ego` (package name `@citrolabs/ego`), and all it does is register the bundled
`ego-browser` Skill as a skill provider. But `plugins/ego/skills/ego-browser` is a **symlink** in git
(pointing back at the repo-root `skills/ego-browser`), and npm/pnpm drop symlinks when packing a git
dependency — the installed package has no `SKILL.md` and the plugin module dies with `ENOENT` at
import time (measured here: `pnpm add github:citrolabs/ego-lite#path:/plugins/ego` installs
`@citrolabs/ego@2.1.0`, but `import('@citrolabs/ego/dsh')` throws
`ENOENT ... skills/ego-browser/SKILL.md`). Upstream's own README says "npm omits the linked Skill when
packing the source directly", and the official DSH artifact
(`@citrolabs/ego-deepseek-harness` tgz) exists only as a build-script output — it is **not on npm**.

So this pack ships the **same** `skills/ego-browser/` (taken from tag `v2.1.0`, including
`references/`, `scripts/`, `learnings/` and `assets/`) through `home/skills/` into
`DSH_HOME/skills/ego-browser/` — equivalent to installing that plugin (the plugin is nothing but a
skill provider, with no extra UI or tools) and independent of git packing behaviour. Once upstream
publishes `@citrolabs/ego-deepseek-harness` to npm, the pack can switch back to the plugin form.

**ego lite itself must be installed first** (the `ego-browser` command comes from the desktop app):
macOS can use the script bundled with the skill (`scripts/install.sh`, see `references/install.md`);
**Windows has no install script** — download the installer from <https://lite.ego.app/>, run it, and
finish the one-time onboarding, which is what puts `ego-browser` on PATH (and only terminals opened
afterwards will see it). This pack ships only the Skill text and small icons (~90 KB), not the browser.

### Computer Use Notes

> **v3.0.0 status: shelved (not mounted)** — upstream has not explicitly declared 0.2.1-rc.2 support, so this plugin is not loaded in this release. The section is kept as reference for re-enabling it via the procedure in "Shelved in this release".

`dsh-computer-use-win` bridges an MCP stdio server through DSH's built-in
`@deepseek-ai/dsh-mcp-client`; the tools appear as `mcp__wincu__windows_computer_use_*`:

- **See**: UIA accessibility tree (`control`/`content`/`raw` views), window-cropped screenshots
  (PrintWindow → WGC → screen-region three-level fallback), OCR word boxes
- **Act**: mouse (standard/double-click/drag/scroll), keyboard, UIA semantic actions, window management
- **Safety**: emergency failsafe (all input rejected when the mouse rests in a screen corner for 500ms),
  fail-closed foreground validation, identity guard (rejects on HWND/PID change), Win-key combo blacklist

Zero runtime dependencies (pure Node built-in modules + PowerShell/C# UIA backend).

> **This modpack patches the plugin's MCP path bug** (see below); otherwise it cannot start inside this modpack.

## Known Upstream Bugs & Fixes

### MCP path resolution in `dsh-computer-use-win@0.1.2`

The plugin's own `cordis.patch.yml` locates its MCP server with
`new URL('mcp/server.mjs', baseUrl)`, and its comments assume `baseUrl` is
**the directory containing that patch file**. But dsh actually sets `baseUrl`
to **the profile root directory**:

```js
// dsh-app-boot: ctx.baseUrl = pathToFileURL(dirname(absoluteConfigPath)).href + "/"
```

**Consequence**: it happens to work in a single-plugin profile (plugin dir ≈ profile root),
but in a multi-plugin profile it resolves to `<profile>/mcp/server.mjs` → `MODULE_NOT_FOUND`,
the MCP server never starts, and the model never sees the `mcp__wincu__*` tools.
The boot log error confirms exactly this.

**Fix in this modpack**: the profile patch layer overrides that entry's `args` to use a path
relative to the profile root (where `node_modules` lives):

```yaml
- id: mcp-dsh-computer-use-win
  name: "@deepseek-ai/dsh-mcp-client"
  config:
    serverName: wincu
    transport: stdio
    command: !!js process.execPath
    args:
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('node_modules/dsh-computer-use-win/mcp/server.mjs', baseUrl))"
    toolCallTimeoutMs: 60000
    failOnStartupError: false
```

After the fix, the boot log shows `windows-computer-use MCP server 0.1.2 ready`.
If upstream fixes this bug, this patch can be removed.

### `dsh-computer-use` sidecar crashes on startup on non-Windows (guarded since v2.7.1)

The plugin (pinned to upstream commit `72f390a`) launches a Python sidecar whose entry
`cli.py:51` unconditionally does `from computer_use.win_dpi import enable_dpi_awareness`,
while `win_dpi.py:13` executes `ctypes.WinDLL("user32", …)` at **module top level** — an
attribute that only exists in Windows' `ctypes`. On Linux / Android (proot) the import
fails immediately with `AttributeError: module 'ctypes' has no attribute 'WinDLL'`.
`failOnStartupError: false` keeps startup unaffected, but **every startup prints a full
Traceback** (issue #1, measured on Android arm64 / proot Ubuntu).

**Fix in this modpack (v2.7.1)**: platform guards on both planes, disabled on non-Windows
and evaluating to `false` (unchanged behavior) on Windows — same pattern as the existing
`tool-pwsh` guard in `preset-computer-use`:

```yaml
# HOST plane (the sidecar row inserted by the plugin's own bundle patch)
- id: computer-use
  name: dsh-computer-use
  disabled: !!js process.platform !== 'win32'
```

plus the same `disabled` on the `tool-computer-use` row inside `preset-computer-use` —
HOST and PRESET planes switch together. Non-Windows goes from "crash + noise" to "quietly
unavailable"; the capability remains Windows-only (that was always the sidecar's platform
boundary). The source-level fix goes upstream as a PR; once upstream lands it, these two
guards can be removed.

## Selection Rationale

### Compatibility criteria

DSH validates with `semver.satisfies(version, peerRange, { includePrerelease: true })`, so:

- Wide ranges like `>=0.1.0-rc.5 <0.2.0` **match** rc.2;
- Plugins pinned to an exact version (e.g. `0.1.7-rc.1`) **hard-fail** on rc.2 — none are selected.

The gate uses the host's own rule — `semver.satisfies(hostVersion, peerRange, { includePrerelease: true })`, with the host version being **0.2.1-rc.2** since v3.0.0.

`docs/compat-check.cjs` now records the 24 plugins in two groups:

- **11 mounted** → they feed the gate, measuring **11/11 pass** (the script exit code only depends on this group);
- **13 shelved** → reported separately, not counted. Six of them have no `@deepseek-ai/dsh*` peer at all (cannot confirm) and the rest only get open-range "coverage" without upstream ever naming rc.2 — which is exactly why this release moved them out of `bundles`.

**Two gate differences to know under v3.0.0**: (1) a few upstreams (`dsh-prompt`, `dsh-plugin-subagent-director`, `dsh-client-ui-git-graph`) declare their floor through `dsh.engines.dsh`, and the DSH 0.2.1 line app-boot gate **prefers `engines.dsh`**; (2) enumeration-style peers (the three MichengAI plugins, agent-teams, workbuddy) hard-code a whitelist of known RCs, so the moment the host moves to 0.2.1-rc.3 those rows are disabled until upstream republishes.

(Historical record) `dsh-workbuddy-connect@0.7.1` (added in v2.7.0) declares 7 `@deepseek-ai/dsh-*` peers, **all pinned to
exactly `0.2.0-rc.2`**, one-for-one with this pack's base → 7/7 ✅. Its non-`dsh-*` host peers are met
by the base tree: `@deepseek-ai/cordis ^4.0.2` (host ships 4.0.4), `@deepseek-ai/schemastery ^3.18.2`
(web-app carries `~3.18.4`), `@earendil-works/pi-ai ^0.87.1` (the range `dsh-llm-pi-ai@0.2.0-rc.2`
depends on itself, so the two-generation mix from upstream issue #74 cannot occur here) and
`react ^18.2.0` (same peer as the already real-machine-tested `dsh-codex-ui`).

> Since v2.7.0 the script prints two separate lines — "在装插件 N/N 通过 ✅" (installed plugins, which
> alone drives the exit code) and "候选池（未装…）" — because candidate entries are tagged
> `installed: false`. A removed historical candidate (`dsh-edit-resend`) no longer turns the summary red.

### Conflict exclusions

- `@michengai/dsh-codex-ui` takes over the official `ui-sidebar` and `ui-settings-general`
  and rebuilds them; it also **re-provides** `sidebar.footer.action` and `settings.section`,
  so dsh-cost-meter's balance card and the desk pet's settings section still have mount points.
- The desk pet uses a floating overlay and does not compete for sidebar slots.
- `dsh-better-sidebar` / `dsh-coding-sidebar` are **not** installed — they compete with codex-ui for the same sidebar slot.
- `dsh-prompt-history` is **not** installed — ↑↓ input recall is built into codex-ui.
- Only 1 desk pet is selected (a candidate pool of 10+ all fight over the same overlay).
- `dsh-workbuddy-connect` **does not compete for UI slots**: it registers one LLM provider row
  (`llm-workbuddy`) and injects into the official model-selection / conversation / renderer client
  packages, leaving the sidebar and settings pages to codex-ui. In the layer stack it sits **before**
  codex-ui, preserving the "codex-ui last" convention.
- In the layer stack, codex-ui is placed **last**, so its slot takeover takes effect after other plugins register.

## Verification record

### v2.7.0 · measured 2026-10-07 (isolated real `@deepseek-ai/dsh@0.2.0-rc.2` CLI + separate DSH_HOME)

| Test | Result |
|---|---|
| Peer gate `node docs/compat-check.cjs` | installed plugins **13/13 ✅**, exit 0; 1 incompatible candidate (not installed) reported separately |
| `dsh --dump-config` | **exit 0, 0 bytes on stderr**, 1367 lines on stdout |
| Layer-stack completeness | **23/23 bundles** in the tested profile all present |
| Provider row | `llm-workbuddy` injected by the plugin's own bundle patch, positioned before codex-ui ✅ |
| Real web service startup | listening on `http://127.0.0.1:3987`; page renders with title `DeepSeek Harness` |
| Computer Use MCP startup | `windows-computer-use MCP server 0.2.3 ready` (the pack's path fix works) |
| Behaviour without WorkBuddy installed | **no WorkBuddy group** in the model picker; startup and UI unaffected |

**Two honest limits of this run:**

1. It covered **23 bundles** (base + 21 npm plugins), not all 26 — the three git-dependency plugins
   (`dsh-computer-use`, `dsh-agent-arena`, `@tencent-connect/dsh-qqbot`) fail to install on Windows
   because pnpm hits a store file lock (`[EBUSY] unlink …\store\v11\tmp\_tmp_*\.git\FETCH_HEAD`),
   reproduced with both a shared and a dedicated store. Those three were each verified on real
   machines in v2.4.0 / v2.6.0.
2. **No smoke test with WorkBuddy signed in** — the desktop app is not installed on this machine.

Unrelated observation: the browser console reports `list slot "plugins.item" requires options.id`;
the **baseline without the new plugin shows it too** (2 occurrences baseline / 3 of the same class with
the plugin), i.e. a pre-existing slot-registration issue, not something v2.7.0 introduces.

### Historical (recorded on the 0.1.x base at v1.1.0, for reference only)

| Test | v1.1.0 result |
|---|---|
| Spec validation (pack-structure v3 + manifest v5 hard constraints) | 30/30 PASS |
| `evaluatePluginCompatibility()` live check | 11/11 no blockers |
| `dsh --dump-config` | exit 0, 1303 lines, zero stderr |
| Plugin MCP self-test | UIA tree + screenshot OK (2560×1600) |

## Customization

The profile patch layer `overrides/cordis.patch.yml` currently holds **5 entries**: the
`dsh-computer-use-win` MCP path fix, `im-qqbot` disabled by default, the `computer-use` preset
insertion, the recorded `dsh-ops` file/shell config, and the `pwsh-sandbox` Windows platform guard.
Everything else is expressed by each plugin's own bundle patch — including
`dsh-workbuddy-connect`'s provider row and dsh-ops' four component rows, which need **no entry
here**. After changes, run:

```bash
dsh --profile better-deepseek-harness-codex --dump-config
```

> The patch **overrides existing entries key-by-key** rather than deep-merging: providing only
> `config:` will not clear `disabled`, but writing `disabled:` replaces the whole thing.

## License & Acknowledgements

This modpack is only a plugin combination and configuration; it does not contain the source
code of the plugins above. Copyright of each plugin belongs to its author:

- [MichengAI](https://github.com/MichengAI) (Codex UI / Code Review / Simplify / BTW)
- [goodandready](https://www.npmjs.com/~goodandready) (Context Lens)
- [linxin666](https://www.npmjs.com/~linxin666) (Git Graph)
- [corrinehu](https://github.com/corrinehu/dsh-workbuddy-connect) (WorkBuddy model access)
- [wushi2333](https://github.com/wushi2333/dsh-computer-use_codex-style) (Codex-style Computer Use)
- [T-Auto](https://github.com/T-Auto/dsh-ops) (native high-performance tooling dsh-ops)
- [PC2005-cloud](https://github.com/PC2005-cloud/dsh-pet) (desk pet dsh-pet)
- The respective authors of `dsh-effort-slider`, `dsh-cost-meter`, `dsh-computer-use-win`
- [citrolabs](https://github.com/citrolabs/ego-lite) (ego-lite / the `ego-browser` skill; the Skill text and icons shipped in this pack remain their copyright, MIT)
- The respective authors of `dsh-context`, `@modusensus/dsh-mneme`, `@liustack/modlens`, `dsh-prompt`,
  `@nanmicoder/dsh-agent-teams`, `dsh-plugin-subagent-director`, `@goodandready/dsh-key-limits`
- The `dsh-agent-arena` and `dsh-qqbot` git dependencies are forks maintained in this repository;
  feature copyright remains with the upstream authors

Format specification: [DSH-PackForge](https://github.com/DSH-PackForge/DSH-PackForge).
