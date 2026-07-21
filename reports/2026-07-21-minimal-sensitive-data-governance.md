# Comins Minimal Sensitive-Data Governance Report

- Timestamp: 2026-07-21 20:50:53 KST
- Branch: `codex/privacy-baseline-simple`
- Implementation base: `05e8218`
- Contract: Comins Contract v1.2

## Summary

- Replaced the proposed repository-owned Git and archive scanner with a 45-line common standard, Gitleaks 8.30.1, and a 68-line public Git identity checker.
- Added a redacted local staged hook and a credential-free GitHub Actions gate pinned to immutable action commits.
- Kept legacy public-history and provider-metadata remediation outside the new-change enforcement contract.
- Completed the reviewed rollout in Data Table, Grid Layout, and Sortable without adding package tooling to the pre-package Sortable repository.
- Removed only the three superseded long-form sensitive-data documents after all four branches passed their whole-branch review.

## Changed Files

- Policy: `AGENTS.md`, `COMINS_CONTRACT.md`, `SENSITIVE_DATA_STANDARD.md`, `MODULE_CHECKLIST.md`, `SECURITY.md`, `RELEASE_POLICY.md`, `CHANGELOG.md`, `templates/module/AGENTS.md`
- Enforcement: `.gitleaks.toml`, `.githooks/pre-commit`, `.github/workflows/verify.yml`, `scripts/check-public-identities.mjs`, `.gitignore`
- Tests: `test/policy-contract.test.mjs`, `test/public-identities.test.mjs`
- Design and execution record: `docs/superpowers/specs/2026-07-21-comins-sensitive-data-minimal-design.md`, `docs/superpowers/plans/2026-07-21-comins-sensitive-data-minimal-governance.md`, `docs/superpowers/plans/2026-07-21-comins-sensitive-data-module-rollout.md`
- Removed after final review: `docs/superpowers/specs/2026-07-21-comins-wide-sensitive-data-prevention-design.md`, `docs/superpowers/plans/2026-07-21-comins-wide-sensitive-data-rollout.md`, `docs/superpowers/plans/2026-07-21-contract-v1.2-sensitive-data-standard.md`

## Verification

| Command or check | Result |
|---|---|
| `node --test test/*.test.mjs` | PASS, 18 tests |
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
| Shared Gitleaks configuration and raw identity checker | PASS, byte-identical across all four repositories |
| Exact package artifacts | PASS for Data Table and Grid Layout; generated archives and extraction directories removed |

## Module Results

1. Data Table: adopted the thin common gate, retained only Table-specific benchmark/local hygiene, and verified one exact package artifact. Local commits: `ed3e0bc`, `9b44aff`.
2. Grid Layout: adopted the common gate without runtime-source or dependency changes and verified one exact package artifact. Local commit: `94d2770`.
3. Sortable: adopted the pre-package policy, hooks, identity checker, and security CI without adding `package.json` or publish automation. Local commit: `686e1dc`.
4. Governance: synchronized a rule-local npm package-coordinate exception after an extracted Grid artifact exposed a valid `package@semver` false positive. No global allow-list or history suppression was added.

The module template now requires the exact package-artifact gate only when a package boundary exists, matching the verified Sortable rollout.

## Residual Risks and External Actions

- GitHub Push Protection, required checks, repository settings, and actual workflow execution were not changed or verified locally.
- The tracked hook was verified manually. Shared `core.hooksPath` was not changed because this linked worktree shares Git configuration with other active worktrees.
- Legacy public Git history and provider metadata remain a separate audit and remediation stream.
- No push, pull request, release, publish, tag, provider setting, or other external write was performed.
