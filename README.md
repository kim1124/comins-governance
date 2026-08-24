# Comins Governance

This repository owns shared Comins brand policy and managed module guidance.
Each Comins product remains an independent Git repository and CI boundary.

[`COMINS_CONTRACT.md`](COMINS_CONTRACT.md) is the sole common execution-policy
source, including the required management order. Other documents add detail
only for the stage named below.

## Policy Map

- [`BRAND.md`](BRAND.md): product identity and naming.
- [`OSS_LICENSE_POLICY.md`](OSS_LICENSE_POLICY.md): license-review triggers.
- [`SENSITIVE_DATA_STANDARD.md`](SENSITIVE_DATA_STANDARD.md): security and
  sensitive-data requirements.
- [`RELEASE_POLICY.md`](RELEASE_POLICY.md): public-package release requirements.
- [`MODULE_CHECKLIST.md`](MODULE_CHECKLIST.md): new-module readiness.
- [`SECURITY.md`](SECURITY.md): security reporting.
- [`CHANGELOG.md`](CHANGELOG.md): Contract revision history.

## Module Adoption

Use `$comins-reference` from an approved independent module root to refresh only
the managed guidance and configuration blocks. Module-owned content remains
unchanged, and product, CI, test, or release behavior is not synchronized.

Use `$comins-updatemd` to audit measured duplication, conflicts, stale routing,
or instruction cost. Common-policy changes are made in Governance first and
adopted separately by each affected module.
