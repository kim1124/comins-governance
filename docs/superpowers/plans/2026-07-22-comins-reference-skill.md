# Comins Reference Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and locally expose the `comins-reference` skill for initializing and refreshing shared Comins module guidance.

**Architecture:** Governance owns one marker-delimited canonical block in `templates/module/AGENTS.md`. A small Node.js helper initializes or replaces that block in an independent target repository, while the skill directs Codex to inspect and preserve module-specific guidance.

**Tech Stack:** Markdown, Node.js 24 ESM, `node:test`, Git, Codex agent skills.

## Global Constraints

- Use the normalized skill identifier `comins-reference` and the user-facing name `Comins-reference`.
- Keep Governance as the only policy source; do not duplicate policy in skill references.
- Preserve all target `AGENTS.md` content outside the managed block byte-for-byte.
- Refuse automatic migration of an existing unmarked `AGENTS.md`.
- Do not add dependencies or remote-write behavior.

---

### Task 1: Define the deterministic guidance boundary

**Files:**
- Modify: `templates/module/AGENTS.md`
- Modify: `test/policy-contract.test.mjs`

**Interfaces:**
- Produces: `<!-- comins-reference:managed-start contract=v1.2 -->` and `<!-- comins-reference:managed-end -->` around the canonical module template.

- [ ] Add a failing policy test requiring exactly one ordered marker pair.
- [ ] Run `node --test test/policy-contract.test.mjs` and confirm the marker assertion fails.
- [ ] Add the marker pair without changing the existing common guidance text.
- [ ] Re-run the focused policy test and confirm it passes.

### Task 2: Test the synchronization contract

**Files:**
- Create: `test/comins-reference-sync.test.mjs`
- Create: `.agents/skills/comins-reference/scripts/sync-guidance.mjs`

**Interfaces:**
- Consumes: `node sync-guidance.mjs <init|update> --target <git-root>`.
- Produces: constant `comins-reference: initialized`, `comins-reference: updated`, or `comins-reference: failed` output.

- [ ] Write tests using disposable Git repositories for initialization, overwrite refusal, marked update preservation, unmarked update refusal, and non-root refusal.
- [ ] Run `node --test test/comins-reference-sync.test.mjs` and confirm failure because the helper is absent.
- [ ] Implement argument validation, real Governance source discovery, target-root validation, canonical-block extraction, initialization, and marked replacement.
- [ ] Re-run the focused tests and confirm all cases pass.

### Task 3: Author and validate the skill

**Files:**
- Create: `.agents/skills/comins-reference/SKILL.md`
- Create: `.agents/skills/comins-reference/agents/openai.yaml`
- Create: `test/comins-reference-skill.test.mjs`

**Interfaces:**
- Consumes: Governance `COMINS_CONTRACT.md`, `CHANGELOG.md`, `templates/module/AGENTS.md`, and the synchronization helper.
- Produces: explicit initialization, update, and one-time legacy-migration workflows.

- [ ] Capture no-skill baseline responses for initialization and legacy update scenarios.
- [ ] Initialize the skill with the official `init_skill.py` and generated interface metadata.
- [ ] Write a failing structure/behavior test for the final skill contract.
- [ ] Replace the generated placeholders with the concise skill workflow and common-mistake boundaries.
- [ ] Run `quick_validate.py` and the focused skill test.
- [ ] Re-run the same application scenarios with the skill and confirm the shared/module boundary is followed.

### Task 4: Expose and verify the skill

**Files:**
- Create outside repository: `$HOME/.agents/skills/comins-reference` symlink to the Governance skill source.

**Interfaces:**
- Produces: one user-scope skill source usable from all independent Comins repositories.

- [ ] Create the user skills directory when absent and add the symlink without replacing a non-symlink path.
- [ ] Resolve the symlink from each current module repository and verify it points to the Governance source.
- [ ] Run `node --test test/*.test.mjs`, `quick_validate.py`, and `git diff --check`.
- [ ] Review `git status -sb` and report local-only branch state and residual risks.

