# Comins Governance

<a href="https://comins-website.vercel.app/ko/"><img src="brand/comins-symbol.svg" width="64" height="64" alt="Comins brand website" /></a>

[Comins Brand](https://comins-website.vercel.app/ko/)

Shared brand policy and guidance for independent Comins repositories and CI.
[`COMINS_CONTRACT.md`](COMINS_CONTRACT.md) is the sole common execution-policy
source, including the required management order.

## Policy Map

Read only the reference matching the task:

- License review: [license policy](OSS_LICENSE_POLICY.md).
- Security/privacy: [sensitive data](SENSITIVE_DATA_STANDARD.md).
- Public publication: [release policy](RELEASE_POLICY.md).
- Role selection: [agent roles](docs/agent-roles.md).
- Delegated work: [handoff](docs/agent-handoff.md).
- Commit preparation: [commit messages](docs/commit-messages.md).
- Brand/naming: [brand](BRAND.md).
- New module: [checklist](MODULE_CHECKLIST.md).
- Security reporting: [security](SECURITY.md).
- Revision/adoption: [changelog](CHANGELOG.md).

## Module Adoption

From an approved module root, `$comins-reference` syncs managed guidance and
config; module-owned content, product, CI, tests, and releases stay independent.
Change common policy here first; adopt per module. Use `$comins-updatemd` to
audit duplication, conflicts, stale routing, and measured instruction cost.

## Issue Intake

Forms and read-only analysis: `templates/module/.github`. Trusted-reporter issues
run automatically; external reports require `codex:analyze`. Maintainers review
output before using `$comins-request` (`.agents/skills/comins-request`) for a work
brief. Neither step authorizes implementation or external operations.
