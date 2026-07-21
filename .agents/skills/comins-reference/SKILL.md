---
name: comins-reference
description: Use when initializing guidance for a new independent Comins module or refreshing an existing module after shared governance guidance changes.
---

# Comins Reference

## Overview

Use `comins-governance` as the only common-policy source. Create or replace the
marker-delimited shared block deterministically, then keep repository-specific
API, implementation, performance, and verification guidance outside that block.

## Select the operation

| Target state | Operation |
|---|---|
| Root `AGENTS.md` is absent | Initialize |
| One `comins-reference` managed block exists | Update |
| `AGENTS.md` exists without markers | Reviewed legacy migration |

Resolve `<skill-root>` as the directory containing this `SKILL.md`. Confirm the
target is the independent module Git root. Read the live Governance
`COMINS_CONTRACT.md`, `CHANGELOG.md`, and `templates/module/AGENTS.md`; do not
copy policy text into the skill.

## Initialize

1. Inspect the target's `package.json`, README, CI, tests, and nested
   `AGENTS.md` files. Derive module guidance only from existing evidence.
2. Run:

   ```bash
   node <skill-root>/scripts/sync-guidance.mjs init --target <repo-root>
   ```

3. Append a `## Module Guidance` section for verified module purpose, public API
   boundaries, directory ownership, and actual validation commands. Do not edit
   the managed block.

## Update

1. Review the Contract version and relevant `CHANGELOG.md` entries.
2. If one managed block exists, run:

   ```bash
   node <skill-root>/scripts/sync-guidance.mjs update --target <repo-root>
   ```

3. Review the diff. Preserve all module-specific guidance outside the managed
   block and adapt project behavior only when the changed Contract requires it.
4. For an unmarked file, require a reviewed one-time migration: insert the
   canonical managed block, remove only confirmed duplicate common clauses, and
   preserve every module-specific rule. Never let the helper overwrite it first.

## Verify and report

- Run `git diff --check` and the target's applicable instruction/security tests.
- Run the target's baseline verification only when the guidance change affects
  its behavior, configuration, security, release, or test contract.
- Report changed files, adopted Contract version, executed checks, and residual
  risks.
- Do not push, merge, publish, delete branches, or change provider settings
  without an explicit maintainer request.

## Common mistakes

- Do not use another module's `AGENTS.md` as the common source.
- Do not invent scripts, package boundaries, or browser gates absent from the
  target repository.
- Do not place module-specific commands inside the managed block.
- Do not treat a Contract version string alone as proof that guidance is current.
