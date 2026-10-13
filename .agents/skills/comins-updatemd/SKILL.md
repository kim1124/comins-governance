---
name: comins-updatemd
description: Use when auditing Comins guidance for Codex model changes, conflicting instructions, or measured workflow overhead.
---

# Comins Update MD

Audit duplication, conflict, unnecessary work, and stale Governance routing.

## Boundaries

- Audits are read-only; corrections require a change request.
- Reuse explicit approval. Stop for unapproved model policy, public
  security/release behavior, cross-repository scope, evaluation cost, or any
  external, destructive, costly, or scope-expanding action.
- Never guess paths or telemetry, expose sensitive values, or perform
  unauthorized external, provider, publication, or history changes.

## Route

- Refresh official OpenAI sources only for model or current-guidance work.
- A local-only audit limits writes, not source lookup. Reuse verified sources;
  mark external guidance unrefreshed only when it was not checked.
- For module adoption, do not modify independent modules here; use
  `$comins-reference` from each approved module root.

## Workflow

Resolve `<skill-root>` from this `SKILL.md`.

1. Confirm roots, dirty state, scope, and authority.
2. For freshness, record OpenAI model, URL, and date.
3. Inspect changed guidance first. Reuse inventory while sources, config,
   and activated skills are unchanged; otherwise run
   `node <skill-root>/scripts/inventory-instructions.mjs --repo <name>=<git-root>`
   for each repository. Pass externally activated skills as
   `--external-skill <logical-name>=<SKILL.md>`; never pass inactive installed
   skills. Read
   `<skill-root>/references/audit-rubric.md`. Audit the effective global,
   project, path-local, and activated skill chain plus relevant tools and gates.
4. For requested changes, make minimal corrections. For an external skill, never edit its cache or
   bundled source. Change supported skill or plugin enable/disable configuration
   only with explicit scope for personal config; otherwise report the owner,
   conflict, and residual activation.
5. Select verification by touched surface: check references and
   `git diff --check`; instruction tests for shared contracts, skill
   validation when a skill changes, config parsing when configuration changes,
   and script tests when scripts change. Run all Governance tests once only when
   the instruction or test contract crosses surfaces.
6. Record revision and remaining module adoption.

## Optional evaluation

With approved evaluation cost, read `<skill-root>/references/eval-matrix.md`.
