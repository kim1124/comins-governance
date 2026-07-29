# Governance Changelog

## Unreleased

- No shared-policy changes after Contract v1.3.

## v1.3 - 2026-07-29

- Fixed one required management order from instruction resolution through security, licensing, module rules, verification, Git and pull-request gates, exact-artifact release, and post-publication closure.
- Adopted `OSS_LICENSE_POLICY.md` with an exact automatic-approval list, use-surface evidence, scoped exceptions, and fail-closed pull-request and exact-artifact release gates.
- Required separate reviewed module adoption; this Governance revision does not modify independent module repositories automatically.
- Reduced Comins Codex guidance and project-local tool overrides without changing Sol `xhigh` defaults, and made release reporting and guidance verification conditional on the affected workflow and surface.
- Added `candidate`, `staged`, `published`, and `closed` release states with mandatory post-publication closure evidence for the exact registry version and dist-tag, artifact integrity and provenance, public consumer smoke, source merge, release reporting, and local/remote ref reconciliation.
- Renewed common guidance with risk-based research, planning, TDD, and verification routes; moved the Sol `xhigh` defaults from prose into managed project configuration.
- Added the `comins-updatemd` skill with value-redacted instruction inventory and optional aggregate telemetry helpers.
- Extended `comins-reference` to preflight and synchronize marker-delimited `AGENTS.md` and `.codex/config.toml` surfaces while preserving module-owned content.
- Before v1.3, renamed the module guidance source to non-discovered `templates/module/AGENTS.template.md` and adopted the then-current v1.2 revision in the three modules as independent local changes.
- The current modules remain on the v1.2 managed guidance until separate v1.3 adoption.

## v1.2 - 2026-07-21

- Adopted the concise sensitive-data standard with local hook, required security CI, redacted output, and exact packed-artifact gates.
- Contract behavior changes require separate reviewed module adoption; this governance revision does not modify module repositories automatically.

## v1.1 - 2026-07-15

- Added common-rule admission, adoption, dependency determinism, package boundary, SSR, privacy, and repository-security baselines.
- Clarified that reports cover meaningful contract changes, not inspection-only or editorial work.
- Documented the one-time interactive bootstrap required before a new npm package can adopt OIDC trusted staged publishing.

## v1.0 - 2026-07-15

- Established the initial Comins brand, module, security, and release baseline.
