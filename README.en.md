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
- **Edit & resend** — edit-resend lets you edit a past message and resend it
- **Computer Use** — control the native Windows desktop: UIA accessibility tree inspection, screenshots, mouse/keyboard, window management (22 tools)

## Installation

Requires **DSH 0.2.0-rc.2** (this modpack's `dshVersion` pins exactly that version; it also declares compatibility with 0.2.0-rc.1).

```bash
dsh --profile better-deepseek-harness-codex
```

Or import the `.dspack` from the DSH launcher.

> **Note**: since v2.2.0, `dsh-agent-arena` is added as a git fork dependency
> (`github:yukitakasama/dsh-agent-arena#25e2c55`), so installation requires access to GitHub.
> It will be switched back to the npm registry version once upstream ships an official release for 0.2.0-rc.2.

## Changelog

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

## Plugin List (15)

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
| `@nanmicoder/dsh-agent-teams` | 0.1.22 | Multi-agent team collaboration |
| `dsh-context` | 0.63.0 | Context visualization dashboard |
| `dsh-plugin-subagent-director` | 0.5.5 | Per-subagent model selection |
| `dsh-edit-resend` | 0.1.0 | Edit & resend messages |
| `dsh-agent-arena` | 0.6.0 (fork `25e2c55`) | Multi-agent council and prompt arena |

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

All 10 plugins' peerDependencies were verified against rc.2 via its bundled
`evaluatePluginCompatibility()`: 10/10 with no blockers.

### Conflict exclusions

- `@michengai/dsh-codex-ui` takes over the official `ui-sidebar` and `ui-settings-general`
  and rebuilds them; it also **re-provides** `sidebar.footer.action` and `settings.section`,
  so dsh-cost-meter's balance card and the desk pet's settings section still have mount points.
- The desk pet uses a floating overlay and does not compete for sidebar slots.
- `dsh-better-sidebar` / `dsh-coding-sidebar` are **not** installed — they compete with codex-ui for the same sidebar slot.
- `dsh-prompt-history` is **not** installed — ↑↓ input recall is built into codex-ui.
- Only 1 desk pet is selected (a candidate pool of 10+ all fight over the same overlay).
- In the layer stack, codex-ui is placed **last**, so its slot takeover takes effect after other plugins register.

## Verification (to be re-verified under DSH 0.2.0-rc.2)

| Test | v1.1.0 result | v2.0.0 status |
|---|---|---|
| Spec validation (pack-structure v3 + manifest v5 hard constraints) | 30/30 PASS | pending |
| `evaluatePluginCompatibility()` live check | 11/11 no blockers | pending (10 plugins) |
| `pnpm install` full resolution | success, 11 plugins in place | pending |
| `dsh --dump-config` | exit 0, 1303 lines, zero stderr | pending |
| Real web service startup | listening, plugins initialized | pending |
| Computer Use MCP server startup | `windows-computer-use MCP server 0.1.2 ready` | pending (0.2.3) |
| Plugin MCP self-test (independent verification) | UIA tree + screenshot OK (2560×1600) | pending |

## Customization

The profile patch layer `overrides/cordis.patch.yml` is an empty array `[]` — the mount
relations are fully expressed by each plugin's own bundle patch. After changes, run:

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
- The respective authors of `dsh-effort-slider`, `dsh-cost-meter`, `dsh-whale-girl-pet`, `dsh-computer-use-win`

Format specification: [DSH-PackForge](https://github.com/DSH-PackForge/DSH-PackForge).
