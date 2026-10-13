# Astra and Sol skill audit — 2026-10-12

## Scope and basis

- Work recorded: 2026-10-12 14:53 KST.
- Local guidance and personal skill configuration only. No commit, push,
  publication, package change, model inference, or paid comparison was performed
  by this audit.
- Governance base: `0c07f41465867978e67abd2eb4b6f8b368dcae9a`, branch `main`.
- Reused the official Astra guidance checked in this conversation on 2026-10-12:
  https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra
- Confirmed supported skill disabling with the official skills documentation:
  https://developers.openai.com/codex/skills

## Changes

- Narrowed the `comins-updatemd` discovery description and corrected the
  assumption that local-only work prohibits source lookup or makes a policy
  stale. Updated its audit rubric to distinguish useful project facts from
  generic procedural scaffolding for both Astra and Sol.
- Replaced obsolete REQUIRED SUB-SKILL banners in six Governance plans dated
  July 15, 21, 22, and 29 with historical-record notices. Preserved the plans'
  implementation details and evidence.
- Personal `ask-research`, `ask-plan`, and `dev-brief`: removed automatic skill
  handoffs and repeated decision instructions; retained material clarification,
  existing approvals, completion criteria, and proportional verification.
- Disabled personal `grilling`, `domain-modeling`, `grill-with-docs`, and
  `to-spec` via supported `skills.config` entries. Preserved upstream files.
  These copies respectively impose exhaustive interviewing/delegation,
  automatic glossary writes, a combined interview/document chain, and tracker
  publication. They remain candidates for deliberate future adaptation.
- Kept existing Superpowers and Orca disables. Preserved all unrelated personal
  settings. Kept Sol 6.1, medium execution, high planning, and the existing
  instruction ceiling of high.
- The Contract v1.10, module template, security/release policies, global
  AGENTS, and module instructions were unchanged. No Contract revision or
  downstream adoption is needed for this maintenance-only change.

## Unnecessary skills and playbooks

- Broad orchestration, mandatory planning/TDD/review chains: redundant as
  default Comins procedures; already disabled rather than deleted.
- The four disabled upstream skills are optional workflows, not necessary
  baseline capabilities. Their popularity is not Astra effectiveness evidence.
- Historical plans are retained as records; six obsolete execution directives
  were removed. No playbook-named files were found in the Comins workspace.
  Playbooks found under external plugin staging directories were not edited;
  presence alone does not establish activation or justify deletion.
- Kept Comins reference/request/audit/security routing and task-specific tools.
  They supply project policy, deterministic mechanics, or distinct capabilities.
  Non-Comins utilities are outside this cleanup's removal scope.

## Verification

- Governance `node --test test/*.test.mjs`: 72 passed, 0 failed after final
  edits. Earlier checks caught wording assertions and a two-word skill-budget
  excess; corrected the guidance without changing test expectations or limits.
- Skill Creator validation: all four edited skills passed. Governance's local
  Python lacked PyYAML; reran with the existing Anaconda Python, without adding
  dependencies.
- TOML parsing and structural comparison: only four disabled-skill entries
  added; unrelated settings and model defaults preserved.
- Fresh local Codex app-server `skills/list`: all four upstream skills report
  disabled, the three personal helpers report enabled, and zero Superpowers
  skills report enabled. The sandboxed app-server could not start; the same
  read-only check succeeded with approved local execution permissions.
- Inventory: automatic guidance 932 bytes, Contract 5,568 bytes. Five existing
  repository heuristic findings are model guidance and descriptions of process
  leakage in the conditional audit rubric, not new execution requirements.
  The activated OpenAI Docs reference also contains model-specific guidance.
  Byte counts and structural checks do not establish model quality or savings.
- `git diff --check` and local reference checks passed.

## Preservation and remaining limits

- Five child checkouts retained identical tracked/nonignored-untracked file
  contents, Git status, and HEAD. Sortable changed concurrently outside this
  audit: its worklog was extended and committed as `f5094da`; its checkout is
  clean. This audit made no writes to child repositories or their Git indexes.
- Governance now contains only this audit's local edits; its HEAD is unchanged.
  Existing personal configuration was compared structurally against a protected
  pre-edit snapshot. Upstream skill sources and cached plugins were untouched.
- Restart Codex for personal configuration changes to affect a new session;
  the current conversation can retain previously injected skill descriptions.
- No live Astra/Sol behavior comparison or module product gates were run.
  Such results are not needed to validate these local instruction edits, and
  no model-performance improvement is claimed.
