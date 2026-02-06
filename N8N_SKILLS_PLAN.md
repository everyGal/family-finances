# n8n Skills Installation Plan

## Overview

Seven n8n-specific Claude Code skills have been installed at the **user level** (`~/.claude/skills/`) to provide expert n8n knowledge across all sessions. These skills come from [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills) and total ~26,600 lines of n8n expertise.

## Installed Skills

### Core Workflow Skills

| Skill | Trigger Keywords | Purpose |
|-------|-----------------|---------|
| `n8n-workflow-patterns` | "build workflow", "webhook", "scheduled task", "API integration" | 5 proven architectural patterns: webhook processing, HTTP API, database ops, AI agents, scheduled tasks |
| `n8n-expression-syntax` | `{{ }}`, `$json`, `$node`, "expression error" | Expression syntax validation, `$json/$node/$now/$env` variables, webhook `.body` gotcha |
| `n8n-node-configuration` | "configure node", "required fields", "displayOptions" | Operation-aware node config, property dependencies, progressive discovery |

### Code Node Skills

| Skill | Trigger Keywords | Purpose |
|-------|-----------------|---------|
| `n8n-code-javascript` | "javascript code node", `$input`, `$helpers.httpRequest` | JS in Code nodes: data access, return format `[{json:{}}]`, built-in functions, error patterns |
| `n8n-code-python` | "python code node", `_input`, `_json` | Python in Code nodes (standard library only, no pip), data access, limitations |

### MCP & Validation Skills

| Skill | Trigger Keywords | Purpose |
|-------|-----------------|---------|
| `n8n-mcp-tools-expert` | "search nodes", "validate", "create workflow", "n8n-mcp" | Using n8n-mcp MCP tools: search, validate, create/edit workflows, templates |
| `n8n-validation-expert` | "validation error", "false positive", "validation profile" | Interpret validation errors, 4 profiles (minimal/runtime/ai-friendly/strict), fix cycles |

## How They Were Installed

Skills are stored at the **user level** so they persist across all projects:

```
~/.claude/skills/
  n8n-code-javascript/      (6 files, 4468 lines)
  n8n-code-python/           (6 files, 4205 lines)
  n8n-expression-syntax/     (4 files, 1485 lines)
  n8n-mcp-tools-expert/      (5 files, 2175 lines)
  n8n-node-configuration/    (4 files, 2851 lines)
  n8n-validation-expert/     (4 files, 2642 lines)
  n8n-workflow-patterns/     (7 files, 4283 lines)
```

Each skill has a `SKILL.md` (auto-loaded by Claude Code when triggered) plus supporting reference files.

**Source commit:** `d9c287202999481777868c4ce7441ced847350b3` from https://github.com/czlonkowski/n8n-skills

## Usage

### Automatic Activation

Claude Code automatically loads the relevant skill when it detects matching context. For example:
- Asking about webhook data access triggers `n8n-expression-syntax`
- Writing a Code node triggers `n8n-code-javascript` or `n8n-code-python`
- Building a workflow triggers `n8n-workflow-patterns`

### Manual Invocation

Explicitly invoke a skill by name:
```
/n8n-workflow-patterns
Design a workflow that receives budget JSON via webhook and updates the monthly data
```

### Skill Combinations for This Project

Common scenarios for the family budget app:

| Scenario | Skills Used |
|----------|-------------|
| Build n8n workflow to update budget JSON | `n8n-workflow-patterns` + `n8n-node-configuration` |
| Write Code node to transform budget data | `n8n-code-javascript` + `n8n-expression-syntax` |
| Configure webhook to receive budget imports | `n8n-workflow-patterns` + `n8n-expression-syntax` |
| Validate workflow before deployment | `n8n-validation-expert` + `n8n-mcp-tools-expert` |
| Use n8n-mcp tools to search/create nodes | `n8n-mcp-tools-expert` + `n8n-node-configuration` |

## Key Gotchas Across All Skills

These are the most critical patterns documented across the skills:

1. **Webhook data is under `.body`**: Always use `$json.body.fieldName`, not `$json.fieldName`
2. **Code node return format**: Must return `[{json: {...}}]` array, not bare objects
3. **Expression syntax**: Use `{{ }}` in node fields, but direct JS in Code nodes (no braces)
4. **nodeType formats differ**: `nodes-base.*` for search/validate tools vs `n8n-nodes-base.*` for workflow tools
5. **Python has no external libraries**: Only standard library (json, datetime, re, etc.)

## Reinstallation

To reinstall these skills on a new machine or after a reset:

```bash
cd /tmp
git clone https://github.com/czlonkowski/n8n-skills.git
cd n8n-skills
git checkout d9c287202999481777868c4ce7441ced847350b3
cp -r skills/n8n-code-javascript ~/.claude/skills/
cp -r skills/n8n-code-python ~/.claude/skills/
cp -r skills/n8n-expression-syntax ~/.claude/skills/
cp -r skills/n8n-mcp-tools-expert ~/.claude/skills/
cp -r skills/n8n-node-configuration ~/.claude/skills/
cp -r skills/n8n-node-configuration ~/.claude/skills/
cp -r skills/n8n-validation-expert ~/.claude/skills/
cp -r skills/n8n-workflow-patterns ~/.claude/skills/
rm -rf /tmp/n8n-skills
```
