# Comins Guidance Renewal Design

## Goal

Renew the active Codex guidance for independent Comins repositories and create
one repeatable `comins-updatemd` skill for future model or guidance
changes. The renewal must reduce unnecessary context and execution work without
weakening product, security, or release controls.

## Approved Decisions

- Use `gpt-5.6-sol` with `xhigh` reasoning as the interim Comins project
  default, including ordinary implementation and documentation work.
- Keep security, vulnerability, runtime-memory, retention, and out-of-memory
  investigations at no less than the same `xhigh` level.
- Use `max` only for a single exceptionally difficult task where depth matters
  more than time or usage.
- Use `ultra` only when a large task has meaningful independent parts that
  benefit from proactive subagent delegation.
- Do not make `max` or `ultra` a default for guidance, planning, or ordinary
  implementation work.
- Keep model and reasoning defaults in Codex configuration rather than repeating
  them in `AGENTS.md` prose.
- Keep Governance as the only common-policy source and adopt changes in each
  independent module through a separate reviewed change.
- Keep Comins Contract v1.2 unchanged because Codex guidance and model
  configuration do not change the public module contract.

## Confirmed Context

- `governance`, `data-table`, `grid-layout`, and `sortable` are independent Git
  repositories. Their parent directory is not a Git repository or a shared
  workspace.
- The current automatically loaded instruction chains are small relative to the
  Codex discovery limit. Raw `AGENTS.md` size is therefore not the primary cause
  of the observed latency.
- Historical long-running Comins sessions accumulated many model turns, tool
  calls, skill reads, full browser gates, and retries. Those workflow effects
  must be measured separately from model reasoning effort.
- The pre-renewal shared template places model selection in `AGENTS.md`. Codex
  configuration is the durable surface for model and reasoning defaults.
- `grid-layout` has a broad instruction to read several live documents before
  work, while closer `AGENTS.md` files are already discovered automatically.
- `data-table` currently builds a consumer-smoke archive separately from the
  final publish archive. That is a release-contract issue as well as duplicated
  work and must be handled in its own module change.

## Scope

### In scope

- Renew Governance and managed module instruction content.
- Introduce Comins project configuration templates with `xhigh` default effort.
- Create and validate the `comins-updatemd` skill.
- Extend `comins-reference` only as needed to distribute the approved managed
  guidance and project configuration safely.
- Define a reproducible evaluation method that separates instruction, reasoning,
  tool, and validation costs.
- Apply the approved managed guidance and project configuration to `data-table`,
  `grid-layout`, and `sortable` as separate repository changes.
- Remove confirmed module-local instruction duplication and blind pre-reads while
  preserving product, API, performance, and browser-specific constraints.

### Out of scope

- Changing global user Codex configuration.
- Automatically selecting the newest model or changing a model without
  maintainer approval.
- Committing, pushing, publishing, or changing remote state in any repository.
- Rewriting historical reports, completed plans, or migration evidence.
- Running paid or long-running A/B model evaluations without explicit approval.
- Fixing the `data-table` or `grid-layout` exact-artifact release flow.
- Adding a Governance runtime package, `package.json`, or third-party dependency.

## Guidance Architecture

### Runtime instruction layers

| Surface | Responsibility |
|---|---|
| `AGENTS.md` | Scope, authority, change boundaries, task routing, stop conditions, and applicable verification |
| Closer `AGENTS.md` | Narrow rules that apply only to that subtree |
| `.codex/config.toml` | Trusted-repository model and reasoning defaults |
| Governance policy documents | Canonical brand, contract, security, and release requirements |
| Skills | Repeatable workflows that are loaded only when triggered |
| Scripts and CI | Deterministic checks that should not be re-described as prose algorithms |
| Reports and completed plans | Historical evidence, never current runtime policy |

The renewal does not use a line-count target as a quality rule. It reports file
size and effective instruction-chain size, but blocks changes only for concrete
problems such as duplication, conflict, unconditional broad work, blind document
loading, stale references, or mixed ownership.

### Managed module guidance

The `comins-reference` managed block remains the shared `AGENTS.md` boundary.
It must:

- retain independent-repository scope and external-write restrictions;
- retain universal sensitive-data invariants;
- route security, release, or public-policy work to the canonical Governance
  document instead of duplicating its procedure;
- select verification by change type rather than implying that every inspection
  requires every security, package, browser, or release gate;
- omit model names and reasoning levels;
- preserve all module-owned guidance outside the managed block byte-for-byte.

Detailed module commands, public API boundaries, performance thresholds, and
browser-test requirements remain module-owned.

### Project model configuration

Governance adds a trusted-repository project configuration and a canonical
module template:

```toml
# comins-reference:managed-start
model = "gpt-5.6-sol"
model_reasoning_effort = "xhigh"
plan_mode_reasoning_effort = "xhigh"
# comins-reference:managed-end
```

The canonical sources are:

- `.codex/config.toml` for the Governance repository;
- `templates/module/.codex/config.toml` for independent modules.

`comins-reference` initializes a missing module configuration, replaces one
well-formed managed block, and refuses automatic migration when an existing
configuration has no markers. Content outside the managed block is preserved
byte-for-byte. Project configuration is effective only when Codex trusts the
repository; the skill must report that boundary rather than claiming the setting
is active.

`xhigh` is the project default. `max` and `ultra` remain explicit per-task
choices in the composer, CLI override, or a separately reviewed custom-agent
configuration. They are not encoded as broad natural-language escalation rules
in `AGENTS.md`.

## Verification Routing

| Change class | Required route |
|---|---|
| Inspection or research only | Read relevant sources and report evidence; do not create a report or run product gates by default |
| Markdown or guidance only | `git diff --check`, reference checks, instruction/config tests, and skill validation when applicable |
| Ordinary source behavior | Focused tests plus the module baseline once after the meaningful change |
| Interaction, layout, or rendering | Focused browser reproduction first, then the applicable full browser gate once |
| Performance or memory | Stable baseline, focused performance gate, and required browser/runtime counters |
| Security or release contract | Canonical security checks and exact-artifact verification for the affected stage |
| Publication | Separate maintainer approval, current remote evidence, and verification of the exact archive being published |

Retries must follow a classified failure: product behavior, test contract, or
execution environment. An unchanged broad gate must not be repeated without new
evidence or a changed state.

## `comins-updatemd` Skill

### Ownership and boundary

The skill source lives at
`.agents/skills/comins-updatemd/` in Governance and is exposed through a
user-scope symlink in the same manner as `comins-reference`.

`comins-updatemd` audits and renews Governance-owned guidance.
`comins-reference` distributes an already approved Governance revision to one
independent module. The renewal skill must not invoke cross-repository writes as
part of a Governance change.

### Trigger examples

- A new Codex model or reasoning level becomes available.
- OpenAI publishes materially changed Codex, prompting, `AGENTS.md`, or skill
  guidance.
- Comins work shows repeated latency, token, tool-call, or verification growth.
- A common rule is duplicated, conflicts across repositories, or repeatedly
  causes unnecessary work.
- A maintainer requests a periodic Comins instruction audit.

### Skill contents

```text
.agents/skills/comins-updatemd/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
│   ├── inventory-instructions.mjs
│   └── summarize-codex-telemetry.mjs
└── references/
    ├── audit-rubric.md
    └── eval-matrix.md
```

No skill-local README, changelog, copied OpenAI documentation, or asset folder
is added. `SKILL.md` contains only the essential workflow and direct routing to
one-level references.

### Deterministic script contracts

`inventory-instructions.mjs` accepts one or more explicit Git repository roots.
It emits logical repository names and repository-relative paths only. It
classifies automatic guidance, conditional references, configuration, skills,
and historical documents, then flags deterministic model-prose, broad pre-read,
mandatory-process-chain, and broad-verification candidates. The skill applies
the audit rubric to duplication, conflict, scope leakage, and stale routing; the
script does not claim semantic conflict detection. It also reports bytes by
surface plus repository-local root and maximum discovered Codex guidance-chain
bytes; those measurements are evidence rather than quality thresholds. It never
modifies a repository.

`summarize-codex-telemetry.mjs` accepts explicit rollout JSONL paths and emits
aggregate model, reasoning, duration, turn, tool-call, wait, delegation, and
token counters. It does not emit prompts, tool arguments, user content,
credentials, personal paths, or detector values. Unknown schemas produce an
`unavailable` classification and a constant diagnostic rather than a raw dump.

Both scripts support human-readable output and stable JSON for tests. Neither
script fetches a remote, starts a model run, or writes files.

### Workflow

1. Confirm the Governance Git root, current branch, dirty state, and requested
   research-versus-edit scope.
2. For a new-model or freshness request, fetch the current Codex manual and
   current-model prompting guidance from official OpenAI sources and record the
   model, URL, and retrieval date. For a local-only audit, use verified local
   sources and state that official guidance was not refreshed.
3. Inventory Governance and explicitly named independent module repositories in
   read-only mode.
4. Summarize explicitly selected local telemetry when available; otherwise mark
   telemetry as not measured.
5. Classify findings as direct context cost, reasoning cost, tool-loop cost,
   validation cost, conflict, stale guidance, or module-local defect.
6. Propose the smallest Governance-owned change and compare it against the
   existing behavior.
7. Stop for maintainer approval when the proposal changes model policy, security,
   release behavior, cross-repository scope, external state, or evaluation cost.
8. After approval, modify Governance-owned sources only and run focused checks.
9. Record the Governance revision and residual module adoption work.
10. Stop. Apply `$comins-reference` separately from each target module repository.

### Failure handling

- If official guidance is unavailable, retain the existing model and policy.
  A dated local cache may support analysis but must be reported as stale.
- If a repository is missing or not a Git root, report it and continue with the
  repositories that were verified; do not create or guess a replacement path.
- If a managed marker is missing, duplicated, or malformed, refuse deterministic
  replacement and require a reviewed migration.
- If a managed surface or its `.codex` directory is a symlink, refuse the write
  instead of following a path outside the repository.
- If a relevant Governance-owned file has unrelated local edits, stop before
  modifying it and report the overlap.
- If telemetry is incomplete, distinguish unmeasured data from a zero result.
- Never fetch, push, merge, publish, alter provider settings, or rewrite history
  without the corresponding explicit request.

## Evaluation Design

The initial controlled evaluation compares the following conditions against the
same clean repository state and task prompt:

| Variant | Guidance | Reasoning |
|---|---|---|
| A | Current | Current configured effort |
| B | Renewed | Same effort as A |
| C | Current | `xhigh` |
| D | Renewed | `xhigh` |

This separates the instruction effect from the reasoning-effort effect. A
latency-focused case may add a `high` comparison, but `high` is not the interim
project default. An `ultra` case is valid only when the task has at least two
independent work streams; it must not be compared with a single-agent task as
though it were only another scalar reasoning level.

Measure:

- task success and instruction compliance;
- unintended or out-of-scope changes;
- review defects and residual risks;
- input, cached-input, output, and reasoning tokens when available;
- model turns, tool calls, waits, delegated workers, and retries;
- wall time separated from test and browser-gate time.

Start with two or three representative tasks. Expand only if the small sample
changes the decision or exposes unstable results. Cached-token totals are
reported separately and are not presented as equivalent to billable waste.

## Planned Governance Changes

- Modify `AGENTS.md` to remove model prose and tighten conditional policy routes.
- Add `.codex/config.toml` with the approved `xhigh` defaults.
- Replace the self-discovering `templates/module/AGENTS.md` with
  `templates/module/AGENTS.template.md`, reduce duplicated policy, and remove
  model prose.
- Add `templates/module/.codex/config.toml` as the canonical module model config.
- Create `.agents/skills/comins-updatemd/` with the defined resources.
- Extend `.agents/skills/comins-reference/` to initialize and update both managed
  guidance surfaces safely.
- Add deterministic unit and contract tests for the new scripts, skill metadata,
  model configuration, marker handling, and preservation behavior.
- Update `README.md` and `CHANGELOG.md` after implementation.
- Update the applicable dated Governance report only after meaningful
  implementation and verification are complete.

Independent module adoption remains a separate change boundary even when it is
performed in the same approved work session. It must begin from each local Git
state, preserve every repository-owned rule outside the managed boundaries, and
run repository-specific instruction checks. A stale tracking reference is
reported but does not block a scoped local documentation/configuration change;
remote mutation still requires separate approval.

## Validation

- Run focused Node tests for each new script and managed-config behavior.
- Run all Governance tests with `node --test test/*.test.mjs`.
- Validate both skills with the official `quick_validate.py` helper.
- Parse the tracked project configuration with the installed Codex CLI in a
  trusted test context.
- Run `git diff --check` and verify all local Markdown references.
- Forward-test the renewal skill with a clean-context, read-only audit scenario.
- For module Markdown/configuration-only adoption, run managed-block equality,
  config parsing, relevant instruction/security-document checks, and
  `git diff --check`; do not run unrelated product or browser gates.

## Success Criteria

- Trusted Comins repositories use Sol `xhigh` by default without model prose in
  `AGENTS.md`.
- `max` and `ultra` remain intentional opt-in choices with distinct use cases.
- Common policy has one source and module-specific rules remain owned by their
  repositories; only confirmed duplicate or over-broad process rules are
  streamlined during explicitly approved module adoption.
- `comins-updatemd` produces a source-backed, value-redacted audit and never
  changes modules automatically.
- The evaluation can distinguish instruction, reasoning, tool-loop, and
  validation costs instead of attributing all latency to token count.
- All Governance tests, skill validation, config parsing, and Markdown checks
  pass before module rollout begins.

## Source Basis

- OpenAI Codex Manual, retrieved 2026-07-22:
  `https://developers.openai.com/codex/codex-manual.md`
- OpenAI GPT-5.6 prompting guidance:
  `https://developers.openai.com/api/docs/guides/prompt-guidance-gpt-5p6.md`
- OpenAI Skills guidance: `https://learn.chatgpt.com/docs/build-skills`
- Agent Skills specification: `https://agentskills.io/specification`
- AGENTS.md project guidance: `https://agents.md/`

The companion development-flow visualization is
[`2026-07-22-comins-development-flow-renewal.png`](./2026-07-22-comins-development-flow-renewal.png).
