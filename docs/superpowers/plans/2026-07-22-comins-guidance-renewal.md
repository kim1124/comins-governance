# Comins Guidance Renewal Implementation Plan

> **Execution:** Apply this plan in the current session. Keep each independent
> Git repository as a separate change surface and verification boundary.

**Goal:** Renew all active Comins guidance, move model defaults into project
configuration, and add the reusable `comins-updatemd` audit skill.

**Architecture:** Governance remains the sole common-policy source. A
non-discovered module template and marker-delimited project config are
distributed by `comins-reference`; module-owned guidance stays outside managed
boundaries. `comins-updatemd` audits and renews Governance but never writes to
independent modules automatically.

**Tech Stack:** Markdown, TOML, Node.js ESM scripts and `node:test`, Codex skill
metadata.

**Local Status:** Completed and verified on 2026-07-22. A follow-up approval
allows one scoped local commit per independent repository; no push,
publication, provider change, or other remote mutation is authorized.

## Global Constraints

- Use the exact skill name `comins-updatemd`.
- Keep `gpt-5.6-sol` and `xhigh` in `.codex/config.toml`, not `AGENTS.md` prose.
- Keep Comins Contract v1.2 unchanged.
- Preserve module-owned guidance outside managed blocks.
- Use risk-based research, planning, TDD, and verification routes rather than a
  universal workflow.
- Keep local commits scoped per independent repository. Do not push, publish,
  change providers, or rewrite published history.
- Preserve the existing untracked renewal infographic.

---

### Task 1: Lock contracts with failing tests

**Files:**

- Modify: `test/comins-reference-sync.test.mjs`
- Modify: `test/comins-reference-skill.test.mjs`
- Modify: `test/policy-contract.test.mjs`
- Create: `test/comins-updatemd-skill.test.mjs`
- Create: `test/inventory-instructions.test.mjs`
- Create: `test/summarize-codex-telemetry.test.mjs`

- [x] Add tests for the non-discovered module template, exact managed project
  config, two-surface preflight, byte-preserving updates, and fail-closed
  unmarked configurations.
- [x] Add tests for `comins-updatemd` triggers, official-source routing,
  read-only inventory, redacted telemetry, and cross-repository stop boundary.
- [x] Run the focused tests and confirm they fail because the new files and
  behavior do not yet exist.

### Task 2: Renew Governance runtime guidance and distribution

**Files:**

- Modify: `AGENTS.md`
- Move: `templates/module/AGENTS.md` to
  `templates/module/AGENTS.template.md`
- Create: `.codex/config.toml`
- Create: `templates/module/.codex/config.toml`
- Modify: `.agents/skills/comins-reference/SKILL.md`
- Modify: `.agents/skills/comins-reference/agents/openai.yaml`
- Modify: `.agents/skills/comins-reference/scripts/sync-guidance.mjs`

- [x] Replace model prose with risk-based task routing and canonical policy
  references.
- [x] Preflight both managed surfaces before any write and preserve all content
  outside their markers byte-for-byte.
- [x] Initialize missing config safely; refuse an unmarked existing config.
- [x] Run the focused `comins-reference` and policy tests until green.

### Task 3: Create `comins-updatemd`

**Files:**

- Create: `.agents/skills/comins-updatemd/SKILL.md`
- Create: `.agents/skills/comins-updatemd/agents/openai.yaml`
- Create: `.agents/skills/comins-updatemd/scripts/inventory-instructions.mjs`
- Create: `.agents/skills/comins-updatemd/scripts/summarize-codex-telemetry.mjs`
- Create: `.agents/skills/comins-updatemd/references/audit-rubric.md`
- Create: `.agents/skills/comins-updatemd/references/eval-matrix.md`

- [x] Initialize the skill with the official skill scaffold.
- [x] Keep `SKILL.md` concise and route detailed criteria to one-level
  references.
- [x] Emit only logical repository names, relative paths, aggregate counters,
  and constant diagnostics.
- [x] Support stable human and JSON output without network or repository writes.
- [x] Run the script and skill tests until green.

### Task 4: Validate Governance and expose the skill

**Files:**

- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `reports/2026-07-22.md`
- Modify: `docs/superpowers/specs/2026-07-22-comins-guidance-renewal-design.md`
- Create outside repository: `~/.agents/skills/comins-updatemd` symlink

- [x] Update documentation with the exact skill name, config boundary, and
  risk-based workflow.
- [x] Run all Governance tests, both skill validators, config parsing, reference
  checks, and `git diff --check`.
- [x] Create the user-scope symlink only if the target is absent.

### Task 5: Adopt managed guidance in independent modules

**Files:**

- Modify: `data-table/AGENTS.md`
- Create: `data-table/.codex/config.toml`
- Modify: `grid-layout/AGENTS.md`
- Modify: `grid-layout/README.md`
- Modify: `grid-layout/GUIDE.md`
- Modify: `grid-layout/docs/README.md`
- Modify: `grid-layout/src/core/AGENTS.md`
- Modify: `grid-layout/test/AGENTS.md`
- Modify: `grid-layout/test/README.md`
- Create: `grid-layout/.codex/config.toml`
- Modify: `sortable/AGENTS.md`
- Create: `sortable/.codex/config.toml`
- Modify: each module's `reports/2026-07-22.md`

- [x] Run `comins-reference update` from each verified module root.
- [x] Remove Grid Layout's blind pre-read and duplicate full-gate clauses.
- [x] Replace universal behavior-test-first wording with the approved
  risk-based regression-test rule.
- [x] Keep all module APIs, product rules, security gates, and actual commands.

### Task 6: Verify each module independently

- [x] Run the applicable instruction/security Node tests in Data Table, Grid
  Layout, and Sortable.
- [x] Parse each project config through Codex prompt discovery and run the CLI
  strict-config check separately.
- [x] Run `git diff --check` and inspect the complete diff in each repository.
- [x] Do not run product, browser, performance, consumer, or release gates for
  this guidance/config-only change.
- [x] Report every changed repository, executed check, and residual risk.
