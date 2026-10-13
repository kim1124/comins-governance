# Agent handoff and module-reference review — 2026-10-13

## Scope and changes

- Work recorded: 2026-10-13 09:36 KST.
- Local instruction edits and validation only; module guidance inspected read-only.
- Governance branch `main`, HEAD `0c07f41465867978e67abd2eb4b6f8b368dcae9a`.
- Updated `docs/agent-roles.md`: branch/base revision and pre-existing changes
  in the handoff brief; complete/blocked/stopped results; actual verification
  target; review-fix responsibility; cause-based retries; timeout ownership;
  cancellation/resumption and overall completion boundaries.
- Updated instructions in all eight `.codex/agents/comins_*.toml` files and their
  matching personal copies. Preserved every other TOML value, including model,
  execution/planning effort, name, description, and sandbox declarations.
- Added one entry to the existing local v1.11 changelog. Contract text, template,
  base configuration, and prior uncommitted instruction work were preserved.
- No tracker, heartbeat, retry count, automatic escalation, mandatory role
  sequence, new package, or extra approval stage was added.
- No commit, push, agent spawn, model inference, or paid evaluation was run.

## Module reference audit

Read the canonical Contract and module template from GitHub on 2026-10-13.
The canonical Contract is v1.10. For each checkout below, the managed block
matches the remote template byte-for-byte, its marker and link label agree,
and its URL points to the Governance Contract. Each base config remains
Sol 6.1 / medium with high planning.

| Checkout | Managed Contract | Canonical template match |
|---|---|---|
| data-table | v1.10 | Pass |
| grid-layout | v1.10 | Pass |
| sortable | v1.10 | Pass |
| capture | v1.10 | Pass |
| website | v1.10 | Pass |
| website-release-021-015 worktree | v1.10 | Pass |

Grid Layout's five nested AGENTS files contain module/path-specific rules and
inherit the root common-policy route; no competing common-policy owner or
different Contract version was found. No nested instruction files were found
in the other inspected checkouts outside dependencies and Git metadata.

Canonical source:
https://github.com/kim1124/comins-governance/blob/main/COMINS_CONTRACT.md

The local Governance candidate remains v1.11. Module references are correct
for the published v1.10; they do not automatically adopt the unpublished role
guide. Personal role availability does not prove common-policy adoption.
No module AGENTS or product files were changed during this review.

## Verification and preservation

- Governance `node --test test/*.test.mjs`: 72 passed, 0 failed after guidance
  and role edits. Later edits only recorded the changelog and this report.
- All eight role files parsed as TOML. Structural comparisons confirmed only
  `developer_instructions` changed; all personal copies match Governance.
- Local reference checks, base model checks, instruction inventory and
  `git diff --check` passed. Inventory findings are heuristic review candidates,
  not an automatic compliance verdict.
- All seven checkout HEADs and all six child checkout statuses/files remained
  unchanged. Existing Governance files changed only for the scoped guide, eight
  role instructions, and one changelog entry. Prior uncommitted changes survived.
- A preservation check detected a concurrent change to personal base config
  after role copies had been synchronized. This audit never wrote that file and
  did not restore it. Current model/effort defaults remain Sol 6.1/medium/high;
  unrelated concurrent configuration content is preserved without attribution.
- The initial sandboxed GitHub read failed due to network access; the approved
  read-only retry succeeded. No remote write occurred.
- Actual delegated behavior and module product gates were not executed; the
  checks validate configuration/instruction consistency and reference routing.
