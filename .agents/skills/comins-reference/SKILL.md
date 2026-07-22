---
name: comins-reference
description: Use when initializing guidance for a new independent Comins module or refreshing an existing module after shared governance guidance changes.
---

# Comins Reference

## Overview

Use `comins-governance` as the only common-policy source. Synchronize the
marker-delimited root guidance and project configuration only after both
surfaces pass preflight. Keep repository-specific API, implementation,
performance, and verification guidance outside the managed blocks.

## Select the operation

| Target state | Operation |
|---|---|
| Root `AGENTS.md` and `.codex/config.toml` are absent | Initialize |
| One guidance block exists; config is absent or managed | Update |
| Either existing surface lacks valid markers | Reviewed migration |

Resolve `<skill-root>` as the directory containing this `SKILL.md`. Confirm the
target is the independent module Git root. Read the live Governance
`COMINS_CONTRACT.md`, `CHANGELOG.md`, `templates/module/AGENTS.template.md`, and
`templates/module/.codex/config.toml`; do not copy policy text into the skill.

## Initialize

1. Inspect only existing sources needed to verify the module purpose, public API
   boundaries, directory ownership, and actual validation commands. Derive
   module guidance only from that evidence.
2. Run:

   ```bash
   node <skill-root>/scripts/sync-guidance.mjs init --target <repo-root>
   ```

3. Append a `## Module Guidance` section for verified module purpose, public API
   boundaries, directory ownership, and actual validation commands. Do not edit
   the managed block.
4. Report that project model settings apply only when Codex has repository trust;
   file presence alone does not prove the effective runtime configuration.

## Update

1. Review the Contract version and relevant `CHANGELOG.md` entries.
2. If the guidance block is valid and the config is absent or managed, run:

   ```bash
   node <skill-root>/scripts/sync-guidance.mjs update --target <repo-root>
   ```

3. Review both diffs. Preserve all module-specific guidance and repository-owned
   config outside the managed blocks byte-for-byte.
4. For an unmarked or malformed surface, require a reviewed one-time migration.
   Refuse symlinked managed surfaces. Never let the helper partially update the
   other surface first.

## Verify and report

- Run `git diff --check` and the target's applicable instruction/security tests.
- Parse `.codex/config.toml` and report the repository trust boundary.
- Run the target's baseline only when the change also affects product behavior,
  runtime configuration, security, release, or a test contract. Guidance/model config alone uses instruction and config checks.
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
- Do not replace an unmarked project config or claim that tracked config is active
  without repository trust.
