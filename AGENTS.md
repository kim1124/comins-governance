# Comins Governance AGENTS.md

## Scope and Authority

- Own the brand, common policy, and module template. Keep product behavior,
  commands, tests, and enforcement implementations in each independent module.
- Modify only explicitly requested repositories and keep their diffs and checks separate. Maintainer approval is required for public policy, license/security contacts, release policy, external writes, destructive operations, cost, or material scope expansion.

## Work Routing

- For inspection or research, report relevant active evidence without edits, work reports, or product gates.
- For documentation, guidance, configuration, or deterministic scripts, edit directly and run only matching reference, contract, script, or parse checks.
- Use a design or plan only for material ambiguity, cross-boundary/high-risk behavior, or durable multi-step handoff.
- General-purpose skills may refine mechanics within the selected route; they do not override direct or project instructions or trigger unrelated stages.
- Subagents require explicit delegation or approved independent parallel work; never pass full history. Default to one final review and required broad gate per final change, then recheck affected failures only.
- Keep common guidance short, testable, and framework-neutral.
- Preserve reports and completed plans as historical evidence; never treat them as active runtime policy.

## Required Order

- Resolve the target independent Git root and applicable instructions first.
- Follow Contract v1.5 in this order: license compliance; security and sensitive
  data; Comins common rules; module rules; smallest change and affected checks;
  Git, pull request, and CI; release checks only when publishing.
- Name new Codex development branches `codex-<short-feature-name>`; append `-2`,
  `-3`, and so on for additional work under the same representative feature.
  Existing and provider-managed branches are exempt.
- Apply only triggered gates. A required failed or unavailable gate blocks the
  affected workflow; it does not trigger unrelated module or release checks.

## Canonical Policies

- `COMINS_CONTRACT.md` defines common order, scope, and approval boundaries.
- `OSS_LICENSE_POLICY.md`, `SENSITIVE_DATA_STANDARD.md`, and
  `RELEASE_POLICY.md` define conditional requirements. Each module owns the
  tools and commands that implement them.
- Adopt behavior-changing Contract revisions through separate reviewed module
  changes. Governance changes do not modify independent modules automatically.

## Verify

- For Markdown/configuration, run `git diff --check`, reference and parse checks, and applicable instruction tests.
- For skill/script changes, run focused checks and the official skill validator; run all Governance tests only when their contract changes.
- Do not run independent module product gates for a Governance-only change.
