# Governance Changelog

## Unreleased

- Added `candidate`, `staged`, `published`, and `closed` release states with mandatory post-publication closure evidence for the exact registry version and dist-tag, artifact integrity and provenance, public consumer smoke, source merge, release reporting, and local/remote ref reconciliation; kept Contract v1.2 unchanged.
- Renewed common guidance with risk-based research, planning, TDD, and verification routes; moved the Sol `xhigh` defaults from prose into managed project configuration.
- Added the `comins-updatemd` skill with value-redacted instruction inventory and optional aggregate telemetry helpers.
- Extended `comins-reference` to preflight and synchronize marker-delimited `AGENTS.md` and `.codex/config.toml` surfaces while preserving module-owned content.
- Renamed the module guidance source to non-discovered `templates/module/AGENTS.template.md` and adopted the revision in the three current modules as independent local changes.
- Kept Comins Contract v1.2 unchanged; product APIs, security/release behavior, and remote state remain unchanged.

## v1.2 - 2026-07-21

- Adopted the concise sensitive-data standard with local hook, required security CI, redacted output, and exact packed-artifact gates.
- Contract behavior changes require separate reviewed module adoption; this governance revision does not modify module repositories automatically.

## v1.1 - 2026-07-15

- Added common-rule admission, adoption, dependency determinism, package boundary, SSR, privacy, and repository-security baselines.
- Clarified that reports cover meaningful contract changes, not inspection-only or editorial work.
- Documented the one-time interactive bootstrap required before a new npm package can adopt OIDC trusted staged publishing.

## v1.0 - 2026-07-15

- Established the initial Comins brand, module, security, and release baseline.
