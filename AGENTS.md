# Comins Governance AGENTS.md

## Scope and Authority

- Own the brand and templates; treat `COMINS_CONTRACT.md`, `SENSITIVE_DATA_STANDARD.md`, and `RELEASE_POLICY.md` as canonical. Keep product and module-specific rules in each independent module.
- Modify only explicitly requested repositories and keep their diffs and checks separate. Maintainer approval is required for public policy, license/security contacts, release policy, external writes, destructive operations, cost, or material scope expansion.

## Work Routing

- For inspection or research, report relevant active evidence without edits, work reports, or product gates.
- For documentation, guidance, configuration, or deterministic scripts, edit directly and run only matching reference, contract, script, or parse checks.
- Use a design or plan only for material ambiguity, cross-boundary/high-risk behavior, or durable multi-step handoff.
- Keep common guidance short, testable, and framework-neutral; use `comins-updatemd` for instruction-cost, tool-surface, or model-guidance audits.
- Preserve reports and completed plans as historical evidence; never treat them as active runtime policy.

## Sensitive Data

- Adopt Comins Contract v1.2 and the governance `SENSITIVE_DATA_STANDARD.md`. Never track personal names, personal email addresses, local account paths, credentials, tokens, secrets, or value-derived fingerprints.
- Use only an approved public handle, GitHub noreply identity, service identity, explicit placeholder, or repository-relative path; run required Gitleaks/security CI and, when a package boundary exists, the exact package-artifact gate.
- Redact detector output, fail closed when unavailable, and audit legacy exposure separately.

## Verify

- For Markdown/configuration, run `git diff --check`, reference and parse checks, and applicable instruction tests.
- For skill/script changes, run focused checks and the official skill validator; run all Governance tests only when their contract changes.
- Do not run independent module product gates for a Governance-only change.
