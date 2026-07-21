# Comins Minimal Sensitive-Data Governance Report

- Timestamp: 2026-07-21 20:13:00 KST
- Branch: `codex/privacy-baseline-simple`
- Implementation range: `05e8218..3b09a88`
- Contract: Comins Contract v1.2

## Summary

- Replaced the proposed repository-owned Git and archive scanner with a 45-line common standard, Gitleaks 8.30.1, and a 68-line public Git identity checker.
- Added a redacted local staged hook and a credential-free GitHub Actions gate pinned to immutable action commits.
- Kept legacy public-history and provider-metadata remediation outside the new-change enforcement contract.
- Preserved the superseded long-form design and plans until all three module branches pass final review.

## Changed Files

- Policy: `AGENTS.md`, `COMINS_CONTRACT.md`, `SENSITIVE_DATA_STANDARD.md`, `MODULE_CHECKLIST.md`, `SECURITY.md`, `RELEASE_POLICY.md`, `CHANGELOG.md`, `templates/module/AGENTS.md`
- Enforcement: `.gitleaks.toml`, `.githooks/pre-commit`, `.github/workflows/verify.yml`, `scripts/check-public-identities.mjs`, `.gitignore`
- Tests: `test/policy-contract.test.mjs`, `test/public-identities.test.mjs`
- Design and execution record: `docs/superpowers/specs/2026-07-21-comins-sensitive-data-minimal-design.md`, `docs/superpowers/plans/2026-07-21-comins-sensitive-data-minimal-governance.md`

## Verification

| Command or check | Result |
|---|---|
| `node --test test/*.test.mjs` | PASS, 17 tests |
| `node scripts/check-public-identities.mjs` | PASS, no output |
| `node scripts/check-public-identities.mjs <base> <head>` | PASS for the complete implementation range |
| `git diff --check <base>..<head>` | PASS |
| Pinned Darwin arm64 archive SHA-256 | PASS against the official v8.30.1 release checksum |
| Pinned Gitleaks version | PASS, 8.30.1 |
| Gitleaks staged scan | PASS; raw output captured and deleted |
| Gitleaks complete implementation-range scan | PASS; raw output captured and deleted |
| Four custom-rule synthetic fixture check | PASS; all blocked fixtures detected and all allowed fixtures accepted |
| Local hook execution | PASS with the pinned local binary |
| Hook shell syntax and workflow YAML syntax | PASS |
| `git status --short` before this report | PASS, clean |

## Module Handoff

Adopt in this order:

1. Data Table: replace the existing broad repository-hygiene scanner only where the Contract v1.2 thin boundary supersedes it; preserve unrelated package hygiene checks.
2. Grid Layout: apply the minimal policy from its clean baseline branch and do not integrate the abandoned security-hardening branch.
3. Sortable: add the same minimal boundary without creating package tooling beyond the repository's actual current state.

Each module receives only the Contract v1.2 policy block, Gitleaks rule contract, raw public-identity interface, redacted CI boundary, and its exact `npm pack --json --ignore-scripts` artifact requirements.

## Residual Risks and External Actions

- GitHub Push Protection, required checks, repository settings, and actual workflow execution were not changed or verified locally.
- The tracked hook was verified manually. Shared `core.hooksPath` was not changed because this linked worktree shares Git configuration with other active worktrees.
- Legacy public Git history and provider metadata remain a separate audit and remediation stream.
- Superseded long-form design and plan files remain until Governance, Data Table, Grid Layout, and Sortable pass whole-branch review.
- No push, pull request, release, publish, tag, provider setting, or other external write was performed.
