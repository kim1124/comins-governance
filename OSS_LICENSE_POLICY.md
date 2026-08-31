# Comins Open-Source License Policy

## Purpose And Scope

This policy is part of Comins Contract v1.8. It applies to a module after that
repository separately adopts the Contract revision.

The check covers third-party packages, copied or modified code, generated
material, fonts, icons, images, data, WASM, and other assets used by a module.
It determines whether required license review and evidence are complete. It
does not declare legal compliance or replace legal review.

## Routine Dependency Check

Each module inventories its dependencies with its package manager and standard
license tooling. These SPDX identifiers may pass the routine check when the
declared metadata is unambiguous and no conflicting or restrictive terms are
found:

- `MIT`
- `MIT-0`
- `ISC`
- `0BSD`
- `BSD-2-Clause`
- `BSD-3-Clause`
- `Apache-2.0`

Ordinary development-only, peer, external-runtime, and runtime dependencies do
not require a separate upstream-source, hash, license-text, or notice record for
every transitive package when they are not copied, modified, bundled, or
distributed by Comins and no manual-review trigger applies.

`OFL-1.1` may pass for an unmodified font only when its distribution conditions,
full license text, and reserved-font-name requirements are preserved.

## Manual Review Triggers

Stop the affected pull request or release and obtain scoped maintainer review
when any of these conditions exists:

- missing, unknown, `NOASSERTION`, or `UNLICENSED` metadata;
- custom, compound, copyleft, source-available, proprietary, noncommercial,
  no-derivatives, field-of-use, or other restrictive terms;
- a mismatch between package metadata, source, included license text, bundle,
  or actual use;
- copied, modified, generated, bundled, or distributed material whose source,
  version or revision, license, modification state, or obligations are unclear.

The approval record identifies the component, version or revision, use surface,
conditions, rationale, approver role or approved public handle, review date, and
the change that invalidates the approval. It must not include unnecessary
personal contact information.

## Distributed And Copied Material

For copied, modified, generated, bundled, or distributed third-party material,
record the component, version or revision, source, license, use surface,
modification state, and applicable attribution, notice, source-marking, or
redistribution obligations.

Use `THIRD_PARTY_NOTICES.md` and `THIRD_PARTY_LICENSES/` only when those records
or texts are required by the material's license or distribution conditions.
Include required notices, license texts, and upstream `NOTICE` files in the
distributed artifact.

Do not require published notices for ordinary non-distributed development tools
or separately installed peer and external dependencies unless their license or
the actual distribution model requires them.

## Module Implementation Boundary

- Governance defines the review triggers and blocking result. Each module owns
  the checker, command name, fixtures, CI integration, and bundle inspection
  appropriate to its stack.
- Run the module's license check when dependencies, lockfiles, peer ranges,
  bundle boundaries, copied or generated code, assets, notices, license texts,
  or package contents change.
- A repository without a package boundary checks tracked third-party material
  but does not invent npm commands or package-artifact gates.
- Fail closed only for an applicable missing, ambiguous, restricted,
  incompatible, or unapproved result. Do not expand a routine check into
  unrelated source or artifact investigation.
- Check output may identify the component, SPDX expression, and use surface,
  but must not print personal contacts or unnecessary license bodies.

## Release Gate

For an actual public package release, run the module's license check against the
reviewed dependency and asset state and the exact release artifact. Confirm the
artifact contains the Comins `LICENSE`, applicable notices and license texts,
and no unrecorded copied or bundled third-party material.

A failed or unavailable applicable license gate blocks publication. An
emergency release does not bypass license review.

## Exceptions And Legacy

An exception applies only to its recorded component, version or revision, use
surface, and conditions. Re-review it when any of those facts changes. Do not
use repository-wide suppressions or undocumented verbal approval.

Audit already-published versions separately. A current clean check does not
alter legacy registry artifacts or provider-retained metadata. Provider or
legal remediation requires a separate maintainer decision.

## References

- [npm package license metadata](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#license)
- [SPDX license expressions](https://spdx.github.io/spdx-spec/v3.0.1/annexes/spdx-license-expressions/)
- [SIL Open Font License 1.1 guidance](https://openfontlicense.org/ofl-faq/)
