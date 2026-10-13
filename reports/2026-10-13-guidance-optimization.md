# Governance v1.11 local optimization — 2026-10-13

## Scope and time

- Recorded 2026-10-13 09:50 KST, Governance branch `main`, base HEAD
  `0c07f41465867978e67abd2eb4b6f8b368dcae9a` plus the existing local v1.11 candidate.
- Local edits and verification only. No commit, push, release, dependency change,
  subagent spawn, model inference, or paid comparison.
- Preserved the existing model/effort choices and prior uncommitted work.

## Changes in priority order

1. Telemetry summary schema v2 now reads current `effort` and legacy
   `reasoning_effort`, counts recorded function/custom tool invocations without
   inspecting their inputs, and sums completed-turn durations. Missing effort or
   required duration is marked partial. Explicit scope/basis fields distinguish
   recorded calls from unmeasured nested Code Mode calls and turn-duration sums
   from wall time. Cumulative token maxima remain unchanged.
2. Inventory includes `.codex/agents/*.toml` as `agent-definition`, with separate
   definition and literal multiline instruction-source bytes. Unsupported body
   syntax remains unmeasured; installed definitions do not imply activation.
3. Split `docs/agent-handoff.md` from `docs/agent-roles.md`. Assigned workers load
   only the handoff/recovery contract, once per task. Role selection and deployment
   remain in the role guide. Contract wording now routes to the guide when selecting
   roles rather than requiring every delegated worker to load the role catalog.
   Concise role purposes remain in all eight TOML definitions.
4. The audit skill reuses inventory while sources/config/activated skills are
   unchanged and inspects changed guidance first. Existing applicable verification
   and approval boundaries remain intact.
5. Personal-copy parity is verified on install/update or observed drift, not on
   every task. Installed all eight updated copies, retaining every TOML field
   except `developer_instructions`. Deployment evidence is recorded below.
6. Request-template output permits prose required by explicit user communication
   rules; one copyable template and the read-only request-template scope remain.

Existing files touched: Contract and changelog; role guide and eight agent files;
`comins-updatemd` skill, audit rubric, eval matrix and its two scripts;
`comins-request` skill; inventory and telemetry tests.
New files: handoff reference and this report. Personal agent copies were synchronized.

## Verification

- RED: three telemetry regressions, the missing-completed-duration regression,
  and the agent-inventory regression failed against the old implementation.
- GREEN: final Governance `node --test test/*.test.mjs` passed 77/77. Existing
  privacy-safe unknown-schema, source-redaction, partial-metric and invalid-JSONL
  checks remain passing. Legacy synthetic duration fixtures now use explicit
  `task_complete` records rather than asserting unsupported duration semantics.
- Both edited skills passed Skill Creator validation using the existing Anaconda
  Python. The 320-word audit-skill limit was maintained, without dependency changes.
- Compared schema v2 with a projection of actual conversation records containing
  only required telemetry fields: 183 recorded calls, high=25/medium=3 effort
  records, and 6,266,826 ms completed-turn duration sum matched independent counts.
  This is a snapshot of the broader conversation, not a v1.11 quality benchmark,
  elapsed wall-time measurement, or savings claim.
- Inventory reports eight role definitions, 4,905 definition bytes and 3,055
  instruction-source bytes; activation remains unmeasured.
- Role instruction-source bytes decreased from 5,246 to 3,055. The worker handoff
  reference is 3,029 bytes; the role-selection guide is 4,215 bytes. Only necessary
  sections are routed to a worker; bytes do not establish token or time savings.
- Local references, parsed role settings, personal-copy parity and
  `git diff --check` passed.
- All seven checkout HEADs, all six child checkout states/files, and all unrelated
  Governance files remained unchanged. Personal base config is byte-identical to
  the pre-edit snapshot. Existing non-instruction role fields are identical.
- Budgets retained: Contract 5,579/5,600; README 1,792/1,800; template 933/1,000
  bytes. No budget was raised.

## Deployment and remaining boundaries

- Source identity: base HEAD above plus local unpublished Contract v1.11 and the
  current uncommitted role files. Personal role copies match this candidate.
- Role-content SHA-256 (sorted filename, NUL, then file bytes):
  `d3a053af1ae861637db087a72aea8b15a9c1a640c5627de492dc50d353b30185`.
- Installation parity was verified once after this update. Recheck after source
  or installed-role changes or observed drift; task boundaries alone do not require
  reinstalling or rereading all role files.
- Module AGENTS still reference published v1.10 and were not modified here.
- No actual delegated-model behavior was exercised. Runtime skill discovery may
  require a fresh Codex session; do not infer loaded settings solely from files.
- Summary v2 preserves the `durationMs` field name but changes its meaning to
  completed-turn sum; consumers must use `version` and `durationBasis`.
  Overlapping input logs can double-count evidence and are not independent samples.
- No new workflow stages, fixed retries, heartbeat, or automatic model escalation.
