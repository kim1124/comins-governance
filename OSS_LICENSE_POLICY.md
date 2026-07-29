# Comins Open-Source License Policy

## Scope

This policy is part of Comins Contract v1.3 and is the canonical target for
every current and future Comins repository. It applies to a module only after
that repository separately adopts Contract v1.3. It covers third-party
packages, transitive runtime code, copied or modified source and snippets,
fonts, icons, images, data, WASM, generated output, and other material used or
distributed by a module.

The automated gate determines whether the evidence required by this policy is
complete. It does not declare legal compliance or replace legal review.

## Use Surfaces

Classify each third-party component by its exact version or revision and one or
more of these surfaces:

- development-only tooling that is not distributed;
- peer or external runtime dependency that the consumer installs separately;
- bundled runtime or transitive code included in a Comins artifact;
- copied or modified source, snippet, or generated code;
- font, icon, image, data, WASM, or other repository or package asset;
- generated documentation, demo, binary, or package output containing
  third-party material.

A version, source, modification, or use-surface change starts a new review.

## Automatic Approval

Only these exact SPDX identifiers may pass automatically when the declared
metadata, upstream license text, source, and actual use surface agree:

- `MIT`
- `MIT-0`
- `ISC`
- `0BSD`
- `BSD-2-Clause`
- `BSD-3-Clause`
- `Apache-2.0`

`OFL-1.1` may pass automatically only for unmodified fonts when the full license
text accompanies the distributed fonts and reserved-font-name conditions are
recorded and preserved.

No other identifier, expression, alias, license family, or version range passes
automatically.

Automatic approval does not waive copyright, attribution, license-text,
`NOTICE`, source-marking, or other applicable obligations. Development-only
tools need not be listed in a published notice unless they or their output are
distributed, but their license metadata must still pass the repository gate.

## Manual Review And Approval

Fail closed and require a scoped maintainer approval for:

- missing license metadata, `NOASSERTION`, or `UNLICENSED`;
- custom terms, `LicenseRef`, or a license identified only by a file reference;
- a compound SPDX expression using `AND`, `OR`, or `WITH`;
- copyleft, weak-copyleft, source-available, or proprietary terms;
- noncommercial, no-derivatives, field-of-use, platform, redistribution,
  commercial, or other use restrictions;
- a mismatch between metadata, upstream text, source, bundle contents, or use
  surface;
- copied, modified, or generated material whose source, exact version or
  revision, modification state, and obligations cannot be reproduced.

Approval must identify the component, exact version or revision, use surface,
applicable conditions, rationale, approved public handle or role, review date,
and the dependency, version, source, modification, or distribution change that
invalidates the approval. Until that record exists, pull requests and releases
remain blocked.

## Required Evidence

For bundled, copied, modified, generated, peer, external-runtime, or asset
surfaces, maintain `THIRD_PARTY_NOTICES.md` with:

- component name and exact version or revision;
- use surface and whether it is distributed;
- SPDX expression or the exact manual-review classification;
- canonical source;
- whether Comins copied or modified the material;
- required copyright, attribution, license-text, `NOTICE`, source-marking, or
  redistribution actions;
- a reference to any scoped approval.

Store required upstream texts that must accompany distributed material under
`THIRD_PARTY_LICENSES/` using stable component-and-version filenames. Include
those files and any required upstream `NOTICE` in the exact package artifact.

Preserve canonical-source third-party legal text only when legally required,
including verbatim copyright, attribution, license, and `NOTICE` content. Omit
personal contact details when a canonical project or repository URL is
sufficient.

## Pull Request And CI Gates

- Run the repository license gate when a dependency, lockfile, peer range,
  bundle boundary, copied or generated code, asset, notice, license text, or
  package file list changes.
- When a package boundary exists, expose a deterministic `check:licenses`
  command, include it in baseline verification, and test the exact bundle and
  package boundaries.
- A repository without a package boundary applies this policy to tracked
  material but does not invent npm commands or artifact gates.
- Fail closed when the gate, metadata, source, notice, required text, or scoped
  approval is missing or cannot be verified.
- Gate output may identify the component, SPDX expression, and use surface, but
  must not print upstream personal contacts or unnecessary license bodies.

## Release Gate

Before staging or publishing, run the license gate against the reviewed
dependency and asset state and the one exact artifact used for consumer testing.
Verify that the artifact contains the Comins `LICENSE`,
`THIRD_PARTY_NOTICES.md` when applicable, every required file under
`THIRD_PARTY_LICENSES/`, and no unrecorded bundled or copied third-party
material.

Fail closed if the license gate is unavailable, the artifact differs from the
reviewed artifact, or any required evidence or approval is incomplete. An
emergency release does not bypass this gate.

## Exceptions

An exception is valid only for one component, exact version or revision, use
surface, and recorded set of conditions. Do not use repository-wide
suppressions, broad license-family allowlists, version ranges, inline bypasses,
or undocumented verbal approval. Re-review an exception when its invalidation
condition occurs.

## Legacy And Residual Risk

Audit already-published versions separately from the current-change gate.
Removing a dependency or adding a notice to a future version does not alter
legacy registry artifacts. Deprecation, unpublish, provider support, or legal
remediation requires a separate maintainer decision and exact-version evidence.

A passing automated gate proves only that declared metadata and repository
evidence satisfy this policy. It cannot prove license ownership, upstream
authenticity, or a court's interpretation of the terms.

## References

- [npm package license metadata](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#license)
- [SPDX license expressions](https://spdx.github.io/spdx-spec/v3.0.1/annexes/spdx-license-expressions/)
- [SIL Open Font License 1.1 guidance](https://openfontlicense.org/ofl-faq/)
- [GitHub dependency review configuration](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/manage-your-dependency-security/configure-dependency-review-action)
