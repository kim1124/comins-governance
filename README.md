# Comins Governance

This repository is the source of truth for shared Comins brand guidance, operating contracts, and module templates.

Comins modules remain independent Git repositories and independent npm release units. This repository does not contain a runtime package, shared module source code, or a release pipeline for product packages.

## Contents

- `BRAND.md`: public product identity and naming rules.
- `COMINS_CONTRACT.md`: rules shared by every Comins module.
- `MODULE_CHECKLIST.md`: readiness checklist for a new module.
- `SECURITY.md`: security reporting and response prerequisites.
- `RELEASE_POLICY.md`: package release and provenance requirements.
- `templates/module/AGENTS.md`: baseline agent guidance for a new module repository.

## Operating Model

1. Make module-specific product changes in the affected module repository.
2. Make cross-module policy changes here, then update each affected module in a separate reviewed change.
3. Keep package publication, versioning, CI, and npm credentials isolated per module.

## Publication Status

This repository is published under the MIT License. Each public module must enable GitHub private vulnerability reporting before it is treated as externally supported. Trusted npm publishing is configured per module before its first public release.
