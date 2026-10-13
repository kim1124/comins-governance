# Guidance priority and v1.11 adoption

Recorded 2026-10-13 (KST).

## Scope

Prioritize required/prohibited actions and conditional reference routing, retain
model/effort settings and instruction budgets, and adopt the candidate in each
Comins checkout. The maintainer authorized scoped commits and branch pushes after
local verification. Default-branch merges and package publication are separate.
Existing v1.11 role, handoff, audit and telemetry changes are included as related
Governance work; unrelated module changes remain outside the commits.

## Changes

- `COMINS_CONTRACT.md`: preserve unrelated existing edits and untracked files.
- Skill entrypoints: front-load audit/sync boundaries, make audit corrections
  conditional on a change request, and reuse already granted fix authority.
- `README.md`: task-based policy, role, handoff and commit reference map.
- License/release policies: blocking and publication controls before mechanics.
- `BRAND.md`: independently released frontend modules, without a React-only scope.
- Module `AGENTS.md`: managed v1.11 block only; module guidance remains unchanged.
- Data Table, Grid Layout and Sortable instruction tests: version label/assertion
  updated together; assertions and budgets remain intact.

## Local verification

- Governance: all 77 tests passed after the final policy edit.
- Data Table: all 21 security tests passed in both the preserved working tree
  and the isolated remote-main publication candidate after an offline
  `npm ci --ignore-scripts`; the initial candidate attempt lacked dependencies.
- Grid Layout: all 53 security tests passed.
- Sortable: all 72 policy tests passed.
- Four skill entrypoints passed skill validation; personal skill links match.
- Eight personal role files match canonical files byte-for-byte and parse as TOML.
- Personal base config and all seven checkout model configs remain unchanged.
- Six managed module blocks match the Governance template; module-local text is
  preserved. Existing unrelated tracked/untracked file content is preserved.
- Diff hygiene passed. Contract 5,593/5,600 bytes; README 1,681/1,800 bytes;
  template 933/1,000 bytes. No budget increase.

## Publication boundary

This is a locally verified v1.11 candidate. Module branch proposals depend on
Governance v1.11 becoming canonical before merge/adoption on default branches.
No product, browser, release or paid model evaluation was needed for this scope.
Static checks and file parity do not prove runtime model selection or token gains.
Data Table publication must exclude the pre-existing Vue readiness commit.
Website has two local checkouts of one repository; publish one equivalent change.
Capture has no remote commits; publish its guidance/configuration history only,
leaving untracked product, hook and research files local.

## Sources

- [Prompt structure](https://developers.openai.com/api/docs/guides/prompt-engineering#message-formatting-with-markdown-and-xml)
- [AGENTS discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Skill routing](https://developers.openai.com/codex/skills)
- [Astra guidance](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)

Official sources were checked during the preceding review and reused here.
