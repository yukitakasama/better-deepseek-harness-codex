---
name: write-skill
description: Create, modify, or review Codex skills (.Codex/skills/). Guides skill authoring from concept to completion.
---

# Write-Skill: Codex Skill Authoring Guide

You are a skill authoring assistant. Your job is to help the user create, modify, or review Codex skills that live in `.Codex/skills/<skill-name>/`.

## 1. Understanding the Skill System

Skills are modular expertise packages extending Codex with specialized, repeatable capabilities.

**Skill directory structure:**
```
.Codex/skills/<skill-name>/
├── SKILL.md              # Required: YAML frontmatter + Markdown instructions
├── scripts/              # Optional: helper scripts (Python, JS, shell)
├── references/           # Optional: reference docs, loaded on demand
├── resources/            # Optional: templates, sample data
└── evals/                # Optional: test cases
```

**Where skills live:**
- **Project-level** (recommended): `.Codex/skills/` — version-controlled, team-shared
- **User-level**: `~/.Codex/skills/` — personal preferences only

**SKILL.md frontmatter format:**
```yaml
---
name: kebab-case-name        # Max 64 chars, use hyphens
description: "When to use"   # Max 200 chars, critical for discovery
---
```

## 2. Skill Authoring Process

### Step 1: Understand the goal
Ask the user to clarify:
- What workflow or domain knowledge should this skill encode?
- How will the user invoke it (verbally or via `/name`)?
- Should it be project-level or user-level?

### Step 2: Design the structure
- **One workflow per skill** — compose multiple small skills over one giant one.
- **Progressive disclosure** — keep `SKILL.md` lean, point to `references/` for depth.
- **Clear trigger description** — the `description` field is what makes Codex invoke the skill.

### Step 3: Write SKILL.md

Structure the body as:
```
# Skill Name: One-liner

## Context (1-2 paragraphs)
When does this skill activate? What problem does it solve?

## Instructions (core logic)
Clear step-by-step or rules for Codex to follow when invoked.

## Guidelines / Constraints
- Edge cases to handle
- Things to avoid
- Safety considerations

## Examples (optional)
Real input/output patterns.
```

### Step 4: Add optional resources
- `scripts/` — executable helpers (Python, JS, shell scripts)
- `references/` — detailed docs loaded on-demand
- `resources/` — templates, config stubs

## 3. Best Practices

- **`name`**: Use kebab-case, descriptive but concise.
- **`description`**: Write from Codex's perspective — when should I trigger? E.g. `"When the user wants to analyze logs"` not `"Log analysis tool"`.
- **Frontmatter only**: `name` and `description` are the only standard fields. No other YAML keys should be added unless Anthropic documents them.
- **Progressive disclosure is critical**: Keep SKILL.md under ~300 lines. Offload detail to `references/`.
- **Be prescriptive**: Tell Codex exactly what steps to follow, in order. Use numbered lists for procedures.
- **Include examples**: Concrete input → output pairs improve reliability.
- **Safety first**: Never suggest skills that modify system files, eval untrusted code, or exfiltrate data.
- **Test before declaring done**: After writing, run the skill with a test prompt to verify it triggers and behaves correctly.

## 4. Templates

### Minimal skill
```yaml
---
name: my-skill
description: "Use when the user asks about X, Y, or Z"
---

# My Skill

When invoked, do these steps in order:

1. Analyze the user's request for keywords related to X
2. Apply the following rules:
   - Rule one
   - Rule two
3. Output results in the specified format
```

### Standard skill with references
```yaml
---
name: my-skill
description: "Trigger for tasks involving domain X"
---

# My Skill

See `references/guide.md` for detailed rules.

## Quick reference
- Step 1: ...
- Step 2: ...
```

## 5. Safety Rules

CRITICAL — Never create skills that:
- Accept `"url"` or `"file"` as SKILL.md frontmatter fields (not standard)
- Execute arbitrary user-provided shell commands without validation
- Access or exfiltrate user environment variables, API keys, or secrets
- Modify `.git`, system directories, or files outside the project
- Bypass safety checks or override Codex's built-in constraints
- Use insecure deserialization or eval-like constructs

Always:
- Validate file paths before writing — ensure they stay within `.Codex/skills/`
- Confirm with the user before overwriting existing skills
- Use the Edit/Write tools correctly, not shell redirection, for file operations
- Keep frontmatter minimal — only `name` and `description`

## 6. Project-Level Setup

After creating a skill, verify:
1. The `.Codex/skills/` directory is in `.gitignore` if the skill is personal
2. The skill directory name matches the `name` field in SKILL.md
3. The `description` is under 200 chars and clearly states when to trigger
