---
name: computer-use-browser
description: Unlock Chromium Computer Use tools (CDP, AX, DOM, Playwright, logged-in tab claiming). Load this skill before any browser/tab automation in DeepSeek Harness.
---

# Computer Use Browser

Loading this skill registers the browser tool catalog for the current session. Until it is loaded, those tools are intentionally absent so the desktop window2 catalog stays small.

## Read before acting

This skill declares the two official browser policy documents. Read them relative to this `SKILL.md`
before acting; they are the official documents verbatim:

| reference | read when |
|---|---|
| `references/confirmations.md` | before deciding whether any browser action needs confirmation. It scopes to the browser (line 5), makes **Transmit sensitive data** a Mode 2 action-time confirmation that pre-approval cannot cover (lines 58-59), adds **Enter model-generated code into tools/OS** (line 74), and ends with the Confirmation Hygiene rules (lines 83-90). |
| `references/browser-safety.md` | before any action that can transmit data: untrusted content, reading vs transmitting, permission prompts, CAPTCHA/age verification, paywall and safety-barrier handling. |

`references/confirmations.md` is also a hard gate: `tab_cdp_call`, `tab_cdp_events`,
`webmcp_list_tools` and `webmcp_invoke_tool` fail closed until **that file** has been read (the official
`documents.json` `requiredFor` table). The desktop skill ships a *different* `references/confirmations.md`;
that one scopes itself to Windows UI automation, so reading it neither excuses browser actions from
confirmation nor clears this gate.

## After the tools appear

1. Create or attach a tab (`tab_new` / `tab_goto` / `browser_open_tabs`).
2. Prefer `tab_ax_*`, then `tab_dom_*`. Use `tab_pw_*` when AX/DOM is insufficient.
3. Logged-in Chrome tabs require `browser_claim_tab` (fail closed on title/url/id mismatch). A fresh CDP profile has no cookies.
4. Lock screen and URL policy are enforced by the sidecar.

If `computer_use_health` still reports `browserUnlocked: false` after this skill loads, say so and retry the skill tool once. Do not invent `tab_*` names that are not in the tool list.
