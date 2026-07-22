# Comins Governance AGENTS.md

## Scope and Authority

- Own the Comins brand, shared contracts, module templates, and release and security policy. Do not add product source or package artifacts here.
- Treat `COMINS_CONTRACT.md`, `SENSITIVE_DATA_STANDARD.md`, and `RELEASE_POLICY.md` as the canonical policy sources. Keep module API, performance, browser, and implementation rules in the independent module.
- Modify an independent module only when the request explicitly includes that repository. Keep each repository's diff and verification boundary separate.
- Require maintainer approval for new public policy, license or security-contact changes, release-policy changes, external writes, destructive operations, cost, or a material scope expansion.

## Work Routing

- For inspection or research, read the relevant active sources and report evidence. Do not create work reports or run product gates by default.
- For documentation, guidance, configuration, or deterministic scripts, make the requested local change and run only the matching reference, contract, script, and parse checks.
- Use a written design or implementation plan only for material ambiguity, cross-boundary behavior, high-risk work, or changes that need a durable multi-step handoff.
- Keep common guidance short, testable, and framework-neutral. Audit the effective global, project, path-local, skill, tool, and validation chain before attributing latency to file size or reasoning effort.
- Preserve reports and completed plans as historical evidence; never treat them as active runtime policy.

## Sensitive Data

- Adopt Comins Contract v1.2 and the governance `SENSITIVE_DATA_STANDARD.md`.
- Never track personal names, personal email addresses, local account paths, credentials, tokens, secrets, or value-derived fingerprints.
- Use only an approved public handle, GitHub noreply identity, service identity, explicit placeholder, or repository-relative path; run the required local Gitleaks hook and security CI, and when a package boundary exists run the exact package-artifact gate.
- Redact detector output, fail closed when a required scanner is unavailable, and handle legacy remediation through a separate audit.

## Verify

- For Markdown or configuration changes, run `git diff --check`, verify local references, parse tracked configuration, and run the applicable instruction tests.
- For skill or deterministic-script changes, run focused tests, all Governance tests, and the official skill validator.
- Do not run independent module product gates for a Governance-only change.
