# Better DeepSeek Harness (Codex Style)

简体中文 | English

A DeepSeek Harness modpack for **Coding users**, aligned with the style and features of Codex.
Built on **DSH 0.2.0-rc.2**.

> Modpack identifier: `better-deepseek-harness-codex` (repo name / `.dspack` prefix / profile name).
> Community modpack — not an official DeepSeek product.

## What's Inside

One command to get a complete Codex-style coding workbench:

- **Codex-style UI** — workspace session tree, global search, turn navigation, session rename/archive/fork
- **Code review & simplification** — `/review` runs an independent sub-agent for code review; `/simplify` simplifies code by Git change scope
- **Read-only side-ask** — ask questions based on the current context without interrupting the main task
- **Reasoning-effort slider** — the reasoning level becomes a Codex-style continuous slider, with animations
- **Cost & balance** — per-session/daily cost, 90+ model prices, quota for 11 coding plans
- **Desk pet** — a DeepSeek whale-girl maid pet that announces work start/end and per-turn cost
- **Context guard** — AST compression, test log filtering, token budget
- **Git graph** — branch selection and commit graph
- **Multi-agent collaboration** — agent-teams for multi-agent teamwork; dsh-agent-arena as a multi-agent council and prompt arena (adjustable collaboration bar, channel rate limiting, auto turn-taking)
- **Context dashboard** — dsh-context for context visualization
- **Per-subagent model** — subagent-director assigns an independent model to each sub-agent
- **Loop guard** — loop-guard detects degenerate "all thought, no action" loops and auto-interrupts with corrective prompts
- **Cross-session memory** — mneme lets the agent remember project background and past decisions
- **Vision** — modlens as a vision bridge, routing screenshots/images to a vision model
- **Inline figures** — inline-figures turns answers into "text-figure-text"
- **Prompt toolbox** — dsh-prompt with 24 deep templates one click away
- **Live wallpapers** — brings Wallpaper Engine wallpapers into the DSH web UI
- **Quota limits** — key-limits shows API key / subscription remaining quota (complements cost-meter)
- **Computer Use** — control the native Windows desktop: UIA accessibility tree inspection, screenshots, mouse/keyboard, window management (22 tools)
- **Codex-style Computer Use** — a separate `computer-use` agent preset with 13 native window2 tools, a visible synthetic cursor and an Esc interrupt; ordinary coding sessions never get the mouse
- **QQ Bot channel** — dsh-qqbot bridges a QQ Bot into DSH (DMs and group chats, image/file understanding, streaming replies); **disabled by default, opt-in**
- **WorkBuddy model access** — dsh-workbuddy-connect reuses the WorkBuddy desktop app's local sign-in so GLM-5.3, DeepSeek-V4, Kimi-K3, MiniMax-M3, Hy3 and more show up in the model picker with zero configuration; the domestic and international editions form separate groups, and **when WorkBuddy is not installed or signed in the group simply hides — startup is unaffected**
- **49 bundled skills** — installed into `DSH_HOME/skills/` on import, ready to use (design/frontend, motion, data analysis, coding, office documents, browser automation and more; MCP servers are not shipped with the pack — configure them in your local `cordis.patch.yml`)

## Installation

Requires **DSH 0.2.0-rc.2** (this modpack's `dshVersion` pins exactly that version; it also declares compatibility with 0.2.0-rc.1).

```bash
dsh --profile better-deepseek-harness-codex
```

Or import the `.dspack` from the DSH launcher.

> **Note**: since v2.2.0, `dsh-agent-arena` is added as a git fork dependency
> (`github:yukitakasama/dsh-agent-arena#25e2c55`), so installation requires access to GitHub.
> It will be switched back to the npm registry version once upstream ships an official release for 0.2.0-rc.2.

> **WorkBuddy prerequisite**: since v2.7.0 the pack ships `dsh-workbuddy-connect`, which reuses the
> **local sign-in state** of the WorkBuddy desktop app. To actually see the WorkBuddy model groups you
> need WorkBuddy (domestic edition or international WorkBuddy AI) installed and signed in.
> **Not installing it does not break anything** — the group hides and every other plugin works as before.
> See "WorkBuddy model access" below.

## Changelog

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

## Plugin List (24)

| Plugin | Version | Purpose |
|---|---|---|
| `@michengai/dsh-codex-ui` | 1.1.25 | Codex-style sidebar, workspace session tree, global search, turn navigation |
| `@michengai/dsh-code-review` | 0.1.9 | `/review` code review via an independent sub-agent |
| `@michengai/dsh-simplify` | 0.1.12 | `/simplify` Git-scoped code simplification |
| `@michengai/dsh-btw` | 0.1.15 | Read-only side-ask without interrupting the main task |
| `dsh-effort-slider` | 1.3.1 | Codex-style continuous reasoning-effort slider |
| `dsh-cost-meter` | 1.7.47 | Cost metering, model prices, coding plan quota, balance |
| `dsh-whale-girl-pet` | 0.3.7 | DeepSeek whale-girl maid desk pet |
| `@goodandready/dsh-context-lens` | 0.1.28 | AST context compression, token budget guard |
| `@linxin666/dsh-client-ui-git-graph` | 0.4.4 | Git branch graph |
| `dsh-computer-use-win` | 0.2.3 | Windows Computer Use desktop control (22 tools) |
| `dsh-computer-use` | fork `72f390a` | **Codex-style Computer Use**: 13 native window2 tools (+3 DSH extensions), a visible synthetic cursor and status pill, an Esc interrupt, per-app approvals. Mounted in its own **`computer-use` preset**, so ordinary coding sessions never get the mouse. See "Codex-style Computer Use" below |
| `@nanmicoder/dsh-agent-teams` | 0.1.22 | Multi-agent team collaboration |
| `dsh-context` | 0.63.0 | Context visualization dashboard |
| `dsh-plugin-subagent-director` | 0.5.5 | Per-subagent model selection |
| `dsh-agent-arena` | 0.6.0 (fork `25e2c55`) | Multi-agent council and prompt arena |
| `@mrweicodes/dsh-loop-guard` | 1.0.8 | Thought-loop guard with auto-interruption |
| `@modusensus/dsh-mneme` | 0.8.13 | Cross-session long-term memory |
| `@liustack/modlens` | 3.26.6 | Vision bridge & screenshot understanding |
| `dsh-inline-figures` | 0.1.0 | Inline vector figures in answers |
| `dsh-prompt` | 0.3.0 | Prompt template toolbox |
| `dsh-plugin-wallpaper-engine` | 1.2.0 | Wallpaper Engine live wallpapers |
| `@goodandready/dsh-key-limits` | 0.2.19 | API key / subscription quota limits |
| `@tencent-connect/dsh-qqbot` | fork 0.5.1 | QQ Bot channel: **disabled by default, opt-in**. DM/group chat, image & file understanding, streaming replies, proactive questions and action confirmations, `/preset` switching, `/compact`. This pack uses the `yukitakasama/dsh-qqbot` fork, which skips instead of blocking when credentials are missing |
| `dsh-workbuddy-connect` | 0.7.1 | **WorkBuddy model access**: reuses the WorkBuddy desktop app's local sign-in to feed GLM-5.3, DeepSeek-V4, Kimi-K3, MiniMax-M3, Hy3 and more into the DSH model picker with zero configuration; domestic and international editions form separate groups with independent accounts and credits, and an unsigned-in edition just hides its group. See "WorkBuddy model access" below |

### Codex-style Computer Use (dsh-computer-use)

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
pinned to npm `0.7.1` (current stable), **shipped unmodified**.

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

> **The version has to match**: since `0.7.0` the plugin targets the **0.2.0 kernel only**
> (`0.7.1` supports `0.2.0-rc.2` and nothing else), which is exactly this pack's base. On DSH `0.1.x`
> you need `0.6.5`. A mismatched combination makes DSH **fail to start** — upstream issue #63 is the
> "plugin skipped wholesale by the host" case. This is one reason the pack pins `dshVersion`
> to `0.2.0-rc.2`.
>
> The plugin also injects **web-platform client code** (`dsh.client.platform: web`, six official
> client packages including model-selection), matching this pack's web base. If you install it into a
> **TUI** profile instead, `@deepseek-harness-tui/dsh-tui` must be **≥ 0.10.0-beta.5**; older versions
> fail to start (`events is not iterable`).

### Computer Use Notes

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

## Selection Rationale

### Compatibility criteria

DSH validates with `semver.satisfies(version, peerRange, { includePrerelease: true })`, so:

- Wide ranges like `>=0.1.0-rc.5 <0.2.0` **match** rc.2;
- Plugins pinned to an exact version (e.g. `0.1.7-rc.1`) **hard-fail** on rc.2 — none are selected.

The gate uses the host's own rule — `semver.satisfies(hostVersion, peerRange, { includePrerelease: true })`.
`docs/compat-check.cjs` currently records peer ranges for **13 of the installed plugins**, and they
measure **13/13 pass**; the candidate pool adds 1 incompatible entry (`dsh-edit-resend`, removed in
v2.3.0, not installed) which no longer counts toward the verdict. The remaining plugins' ranges were
evaluated one by one during v2.0.0–v2.3.0 selection but **are not in the script**, so do not read this
as a 24/24 automated-coverage claim.

`dsh-workbuddy-connect@0.7.1` (added in v2.7.0) declares 7 `@deepseek-ai/dsh-*` peers, **all pinned to
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

The profile patch layer `overrides/cordis.patch.yml` currently holds **3 entries**: the
`dsh-computer-use-win` MCP path fix, `im-qqbot` disabled by default, and the `computer-use` preset
insertion. Everything else is expressed by each plugin's own bundle patch — including
`dsh-workbuddy-connect`'s provider row, which needs **no entry here**. After changes, run:

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
- The respective authors of `dsh-effort-slider`, `dsh-cost-meter`, `dsh-whale-girl-pet`, `dsh-computer-use-win`
- The respective authors of `dsh-context`, `@modusensus/dsh-mneme`, `@liustack/modlens`, `dsh-prompt`,
  `dsh-inline-figures`, `@mrweicodes/dsh-loop-guard`, `dsh-plugin-wallpaper-engine`,
  `@nanmicoder/dsh-agent-teams`, `dsh-plugin-subagent-director`, `@goodandready/dsh-key-limits`
- The `dsh-agent-arena` and `dsh-qqbot` git dependencies are forks maintained in this repository;
  feature copyright remains with the upstream authors

Format specification: [DSH-PackForge](https://github.com/DSH-PackForge/DSH-PackForge).
