---
name: comins-updatemd
description: Use when a Codex model or official guidance changes, Comins instruction latency or token cost grows, AGENTS.md rules drift, or a guidance audit is requested.
---

# Comins Update MD

## Overview

Reduce measured duplication, conflict, unconditional work, or stale routing in
Governance-owned guidance.

## Route

- Refresh official OpenAI sources only for model or current-guidance work.
- For a local-only audit, use verified local sources and mark external guidance
  unrefreshed.
- For module adoption, do not modify independent modules here; use
  `$comins-reference` from each approved module root.

## Workflow

Resolve `<skill-root>` from this `SKILL.md`.

1. Confirm Git roots, branches, dirty state, scope, and edit authority.
2. For freshness work, record the official OpenAI model, URL, and date; otherwise
   retain and mark the policy stale.
3. Run
   `node <skill-root>/scripts/inventory-instructions.mjs --repo <name>=<git-root>`
   for each repository. Pass externally activated skills as
   `--external-skill <logical-name>=<SKILL.md>`; never pass inactive installed
   skills. Then read
   `<skill-root>/references/audit-rubric.md`. Audit the effective global,
   project, path-local, and activated skill chain plus relevant tools and gates.
4. Apply the smallest correction. For an external skill, never edit its cache or
   bundled source. Change supported skill or plugin enable/disable configuration
   only with explicit scope for personal config; otherwise report the owner,
   conflict, and residual activation.
5. Select verification by touched surface: always check references and
   `git diff --check`; run instruction tests for shared contracts, skill
   validation when a skill changes, config parsing when configuration changes,
   and script tests when scripts change. Run all Governance tests once only when
   the instruction or test contract crosses surfaces.
6. Record the Governance revision and remaining module adoption.

## Optional evaluation

With approved evaluation cost, read `<skill-root>/references/eval-matrix.md`.

## Boundaries

- Stop for approval for model policy, public security/release behavior,
  cross-repository scope, evaluation cost, or any external, destructive, costly,
  or scope-expanding action.
- Never guess paths, models, telemetry, or markers; expose raw sensitive values;
  or perform unauthorized external, provider, publication, or history changes.
