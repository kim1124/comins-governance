# Comins role configuration — 2026-10-12

## Scope

- Work recorded: 2026-10-12 17:28 KST.
- Local shared guidance and role configuration, with local validation only.
- Governance branch `main`, base `0c07f41465867978e67abd2eb4b6f8b368dcae9a`.
- Preserved the pre-existing Astra skill audit edits and all unrelated files.
- No commit, push, publication, agent spawn, model inference, or paid comparison.

## Changes

- Prepared local, unpublished Contract v1.11. Linked conditional role selection
  from the model section without increasing the 5,600-byte limit. Updated the
  module template, license-policy version reference, changelog, and existing
  version assertions together. License and public security rules are unchanged.
- Added `docs/agent-roles.md` and eight canonical `.codex/agents/comins_*.toml`
  definitions. Installed identical personal copies for use across independent
  Comins repositories, without replacing built-in or unrelated agents.
- Explicit selections: orchestrator Astra/high; planner Astra/medium;
  architect Astra/high; explorer Sol 6.1/medium; worker Sol 6.1/high;
  debugger Astra/medium; reviewer Sol 6.1/high; integrator Astra/high.
- Each role explicitly sets model, execution effort, and planning effort.
  Explorer, reviewer, and integration-review roles declare read-only sandbox
  intent; parent live permissions remain authoritative in the running client.
- Added `scripts/comins-orchestrator.sh` for a main CLI Astra/high session.
  Desktop users select Astra/high in the model picker. A custom subagent file
  does not change an already running main chat's model.
- Tests/builds retain the assigned agent. Role selection does not require
  every stage, automatic delegation, redundant reviews, or new approval steps.
- Personal/base/project Sol 6.1 defaults remain unchanged: medium execution,
  high planning, existing policy ceiling high.

## Verification

- Governance `node --test test/*.test.mjs`: 72 passed, 0 failed.
- Parsed all eight role files with Python TOML; checked required metadata,
  selected model/effort mapping, explicit planning effort, unique matching names,
  and byte-for-byte parity with personal copies.
- `sh -n` passed. A stub Codex executable verified launcher arguments and prompt
  forwarding without model calls; the real CLI accepted the launcher's `--help`.
- Fresh local Codex app-server with strict configuration read the effective
  project base as Sol 6.1/medium/high. With orchestration CLI configuration
  overrides it read Astra/high/high, proving precedence over the project base.
- Local model listing exposed Astra and Sol 6.1 with medium/high support. No
  model request or subagent session was started. The first sandboxed app-server
  could not start; the same read-only check succeeded with approved permissions.
- Local references, unchanged base/template TOML, and `git diff --check` passed.
- Budgets: Contract 5,590/5,600 bytes, README 1,792/1,800, module template
  933/1,000. Inventory findings remain manual-review heuristics: model prose in
  the conditional role guide is intentional; audit-rubric findings are existing
  descriptions of risks, not mandatory workflow requirements. Agent TOML files
  were validated directly because the inventory does not classify them.
- Preservation snapshot: 2,194 existing files unchanged; only the five scoped
  existing Governance policy/template/test files changed. All seven checkout
  HEADs, six child checkout statuses, and personal base config remained unchanged.
  No pre-existing skill-audit edit was overwritten.

## Remaining boundaries

- Contract v1.11 is a local candidate. Existing modules retain their separately
  adopted Contract versions; no module AGENTS or product files were modified.
- `comins-reference` still distributes only managed AGENTS and base config.
  Named roles are available from the installed personal copies; source changes
  require comparing/reinstalling those copies separately.
- Restart Codex or begin a fresh session if new named roles are not visible.
  Role-file parsing and config checks do not prove actual spawned model behavior;
  that runtime exercise was deliberately not run in this validation-only scope.
- The high ceiling remains an instruction policy, not a client/API clamp.

Official configuration reference checked 2026-10-12:
https://developers.openai.com/codex/multi-agent
