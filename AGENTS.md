# Comins Governance AGENTS.md

## Scope

- This repository owns Comins brand, shared operating contracts, module templates, and release/security policy.
- Do not add product source code, package build output, or npm release artifacts here.
- Do not modify a Comins module repository from this repository unless the user explicitly requests the cross-repository change.

## Change Rules

- Keep policies short, testable, and independent of one module's framework or internal architecture.
- Put module-specific API, performance, test, and implementation rules in the module repository.
- Treat a new public policy, a license change, a security contact change, or a release-policy change as a maintainer decision requiring explicit approval.
- Preserve historical reports as evidence; do not present them as current policy.

## Validation

- For Markdown changes, run `git diff --check` and verify referenced local files exist.
- Before publishing a governance update, verify that the contract version and module template are consistent.
