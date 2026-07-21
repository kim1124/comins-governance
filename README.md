# Comins Governance

This repository is the source of truth for shared Comins brand guidance, operating contracts, and module templates.

Comins modules remain independent Git repositories and independent npm release units. This repository does not contain a runtime package, shared module source code, or a release pipeline for product packages.

## Contents

- `BRAND.md`: public product identity and naming rules.
- `COMINS_CONTRACT.md`: rules shared by every Comins module.
- `CHANGELOG.md`: shared-policy revision history.
- `MODULE_CHECKLIST.md`: readiness checklist for a new module.
- `SECURITY.md`: security reporting and response prerequisites.
- `RELEASE_POLICY.md`: package release and provenance requirements.
- `templates/module/AGENTS.md`: baseline agent guidance for a new module repository.

## Governance And Module Flow

```mermaid
flowchart TD
    A["Comins Governance<br/>Shared policy source of truth"] --> B["BRAND.md<br/>Brand and naming"]
    A --> C["COMINS_CONTRACT.md<br/>Shared operating contract"]
    A --> D["SENSITIVE_DATA_STANDARD.md<br/>Security and sensitive data"]
    A --> E["RELEASE_POLICY.md<br/>Release and npm policy"]
    A --> F["MODULE_CHECKLIST.md<br/>New-module baseline"]

    C --> R["Versioned policy adoption<br/>Currently Contract v1.2"]
    D --> R
    E --> R

    R --> T["Comins Table<br/>Independent Git, npm, and CI"]
    R --> G["Comins Grid Layout<br/>Independent Git, npm, and CI"]
    R --> S["Comins Sortable<br/>Independent Git and CI"]

    T --> H["Local Git hooks<br/>Pre-commit sensitive-data gate"]
    G --> H
    S --> H

    H --> I["Pull request CI<br/>Gitleaks, identity, and project verification"]
    I --> J["Package artifact gate<br/>Package modules only: inspect the exact archive"]
    I --> K["Independent module lifecycle"]
    J --> K
```

Shared policy changes are reviewed in this repository first and then adopted by
each affected module through its own pull request. The governance repository is
not a runtime dependency and does not synchronize module source or releases.

## Operating Model

1. Make module-specific product changes in the affected module repository.
2. Make cross-module policy changes here, then update each affected module in a separate reviewed change.
3. Keep package publication, versioning, CI, and npm credentials isolated per module.
