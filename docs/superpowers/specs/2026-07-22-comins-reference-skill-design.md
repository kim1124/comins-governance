# Comins Reference Skill Design

## Goal

Create one `comins-reference` Codex skill that initializes shared guidance in a
new independent Comins repository and refreshes the shared portion of guidance
after Governance changes.

## Ownership

- `comins-governance` remains the policy source of truth.
- The skill source lives at `.agents/skills/comins-reference/` in Governance.
- A user-scope symlink exposes the same source to every independent Comins
  repository without copying the skill.
- Module-specific API, implementation, performance, and verification rules
  remain owned by each module repository.

## Guidance Boundary

`templates/module/AGENTS.md` contains one canonical managed block delimited by
`comins-reference` comments. New repositories receive that block. Existing
marked repositories replace only that block; all text outside it is preserved
byte-for-byte.

An existing unmarked `AGENTS.md` is not rewritten automatically. The skill must
perform a reviewed one-time migration that separates common rules from module
rules before deterministic updates are allowed.

## Operations

### Initialize

1. Confirm the target is an independent Git repository root.
2. Refuse to overwrite an existing `AGENTS.md`.
3. Copy the canonical managed block from Governance.
4. Inspect the module and append only module-specific guidance.
5. Validate the resulting diff and the module's applicable checks.

### Update

1. Read the current Contract and Governance changelog.
2. Confirm the target has one well-formed managed block.
3. Replace only that block with the current canonical block.
4. Preserve module-specific guidance outside the block.
5. Review the diff and run applicable module checks.

## Safety

- Emit constant value-free success and failure messages from the helper.
- Do not push, merge, publish, delete branches, or modify provider settings
  without an explicit maintainer request.
- Do not synchronize product code, module verification commands, or release
  state from Governance.

## Verification

- Test initialization, overwrite refusal, deterministic update, legacy-file
  refusal, and target-root validation with disposable Git repositories.
- Validate the skill metadata with `quick_validate.py`.
- Run Governance policy tests and `git diff --check`.

