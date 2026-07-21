# Comins Governance AGENTS.md

## Scope

- Own Comins brand, shared contracts, module templates, and release/security policy; do not add product source, artifacts, or cross-repository changes without an explicit request.

## Policy

- Use `gpt-5.6-sol` with `xhigh` reasoning as the default for all Comins work.
- For vulnerability investigation, runtime memory leaks, retention, out-of-memory failures, or security work, use `gpt-5.6-sol` with at least `xhigh`.
- For instruction planning, Plan mode, or authoring or updating an implementation plan, use `gpt-5.6-sol` with at least `max`.
- Keep common rules short, testable, framework-neutral, and separate from module-specific API, performance, test, and implementation rules.
- Treat a new public policy, a license change, a security contact change, or a release-policy change as a maintainer decision requiring explicit approval.
- Preserve historical reports as evidence; do not present them as current policy.

## Sensitive Data

- Adopt Comins Contract v1.2 and the governance `SENSITIVE_DATA_STANDARD.md`.
- Never track personal names, personal email addresses, local account paths, credentials, tokens, secrets, or value-derived fingerprints.
- Use only an approved public handle, GitHub noreply identity, service identity, explicit placeholder, or repository-relative path; run the required local Gitleaks hook, security CI, and exact package-artifact gate.
- Redact detector output, fail closed when a required scanner is unavailable, and handle legacy remediation through a separate audit.

## Verify

- For Markdown changes, run `git diff --check`, verify local references, and keep the contract version and module template consistent before publication.
