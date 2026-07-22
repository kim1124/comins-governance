---
name: comins-updatemd
description: Use when a Codex model or official guidance changes, Comins instruction latency or token cost grows, shared AGENTS.md rules drift, or a periodic Comins guidance audit is requested.
---

# Comins Update MD

## Overview

Audit the effective Comins instruction system and renew only Governance-owned
sources. Separate direct context, process-chain, reasoning, tool-loop, and
validation costs before changing guidance.

## Select the scope

| Request | Source rule |
|---|---|
| New model or current guidance | Refresh official OpenAI sources |
| Local-only audit of duplication or drift | Use verified local sources; mark external guidance not refreshed |
| Governance edit already approved | Implement the smallest in-scope local change |
| Module adoption | Stop and use `$comins-reference` from that module root |

## Workflow

1. Confirm the Governance Git root, branch, dirty state, requested repositories,
   and whether the request is research-only or authorizes edits. Safe in-scope
   local edits and checks do not need another approval.
2. For model or guidance freshness, use official OpenAI documentation and record
   the model, direct URL, and retrieval date. If unavailable, retain current
   policy and label the source stale. Do not substitute community opinion for an
   official product fact.
3. Run `scripts/inventory-instructions.mjs --repo <name>=<git-root>` for each
   explicit repository. Add `--json` when stable machine output is needed.
   Compare repository-local root and maximum discovered guidance-chain bytes as
   evidence, not as a quality threshold.
4. If the maintainer selects rollout JSONL files, run
   `scripts/summarize-codex-telemetry.mjs --input <jsonl>`; otherwise report
   telemetry as unmeasured, not zero.
5. Audit the effective global, project, path-local, and activated skill chain,
   plus relevant tool descriptions and validation loops. Read
   `references/audit-rubric.md` for classification criteria.
6. Propose or apply the smallest Governance-owned correction. Route research,
   design, planning, TDD, review, and broad verification by task risk rather than
   making them one mandatory chain. If an activated skill is plugin, system, or
   repository-owned, never edit its cache or bundled source. With
   explicit scope for personal config, use supported skill or plugin enable/disable configuration;
   otherwise report the owner, conflict, and residual activation.
7. Stop for approval only when changing model policy, public security or release behavior,
   cross-repository scope, evaluation cost, or an external, destructive, costly, or scope-expanding action.
8. After an approved edit, run focused tests, all Governance instruction tests,
   skill validation, config parsing, reference checks, and `git diff --check`.
9. Record the Governance revision and remaining module adoption. Stop; do not modify independent modules
   as part of this skill. Apply `$comins-reference`
   separately from each explicitly approved module repository.

## Evaluation

Use `references/eval-matrix.md` for clean-context with/without comparisons.
Keep model and reasoning fixed while measuring an instruction change; compare
reasoning levels only in a separate variant.

## Fail closed

- Do not guess repository paths, model names, telemetry values, or missing markers.
- Do not emit prompts, tool arguments, user content, credentials, personal paths,
  detector values, or raw telemetry records.
- Do not fetch, push, merge, publish, alter provider settings, or rewrite history
  unless the corresponding request explicitly authorizes that action.
