# Release Policy

This repository does not publish npm packages. Each Comins module owns its CI. When a package boundary exists, the module owns its own version, changelog, package contents, and npm publication. The remaining states and gates apply only to modules with a package boundary and a public package release.

## Release States

- **Candidate:** the target version, notes, exact artifact, and pre-publication evidence are prepared but not staged.
- **Staged:** the trusted publisher has staged the exact artifact and maintainer 2FA approval is pending.
- **Published:** the exact version resolves on the public registry but post-publication closure is pending.
- **Closed:** every post-publication check has passed, evidence is recorded, and local/remote default-branch state is reconciled.
- Only closed is complete.

## Required Release Evidence

- Target version, Semantic Versioning rationale, release and migration notes, residual risks, and unsupported cases.
- Run the module license gate against the reviewed dependency, copied-code, asset, and bundle state; retain every required scoped approval.
- Confirm the intended package boundary in `package.json#files`.
- Create exactly one package artifact with `npm pack --json --ignore-scripts`. Compare the package file list returned by `npm pack --json --ignore-scripts` with the `package.json#files` allow-list.
- Extract that exact artifact into a disposable directory, scan the extracted directory with Gitleaks, and verify that its `LICENSE`, applicable `THIRD_PARTY_NOTICES.md`, required `THIRD_PARTY_LICENSES/` files, and bundled third-party boundary match the reviewed evidence.
- Record only constant, redacted security-gate results and run the consumer installation or smoke check against that exact artifact.

## Evidence Ownership And Reuse

- Successful verification evidence may be reused only when the verified source tree and relevant workflow, configuration, and dependency state are unchanged.
- A metadata-only change invalidates only the metadata and artifact evidence it can affect. Pull-request CI and publication workflows may intentionally rerun broader gates at distinct trust boundaries.
- When a module publish workflow verifies, packages, and stages one artifact, the module release workflow is the canonical owner of the exact artifact. Do not create a separate local candidate artifact unless the workflow is absent, changed by the release, or the maintainer explicitly requests local diagnostic evidence; local diagnostics do not replace required workflow evidence.

## Publication Controls

- A brand-new npm package cannot use staged publishing or register a trusted publisher before it exists on the registry. Bootstrap the first public version interactively with maintainer 2FA and no automation token.
- Immediately after the bootstrap publication, register the exact GitHub repository, workflow filename, and `npm` environment as the package's trusted publisher.
- Allow only `npm stage publish` for the trusted publisher, disallow token publishing, and require a maintainer to approve or reject each staged version with npm 2FA.
- Use automatic provenance from GitHub Actions trusted publishing for eligible public packages.
- Keep privacy-safe publisher metadata and use only an approved public handle, GitHub noreply identity, or service identity.
- Run the module-owned current npm maintainer identity check immediately before `npm stage publish`; expose only a constant, value-free result and fail closed on unavailable or mismatched evidence.
- Freeze npm account email, package ownership, and trusted-publisher configuration from the pre-stage identity check through maintainer approval and post-publication closure.
- Keep package release credentials, workflow permissions, and release histories isolated per module.
- Fail closed before staging or publication when the license gate, required evidence, or scoped approval is unavailable or incomplete.

## Post-Publication Closure

- A registry-visible version is published, not closed, until every closure check below passes and the module records the evidence.
- Verify the exact version and intended dist-tag on the public registry.
- Verify that the exact published version's maintainer identity and publisher metadata match the approved delivery-capable service identity using a constant, value-free result.
- Verify the public artifact's integrity, expected registry signature, and provenance, and compare it with the staged or validated artifact when the release workflow exposes a digest or integrity value.
- Install the exact public version or tarball in an isolated consumer and run the module's public consumer smoke check.
- Confirm the protected source merge and applicable post-merge checks; record the source merge or commit and the release workflow run.
- Append the closure time, exact version, dist-tag, executed checks, results, and residual risks to the module's release evidence instead of rewriting its pre-publication history.
- Fetch remote refs and reconcile the local default branch with the remote default branch without rewriting unrelated work.
- Report remaining release branches and worktrees. Their deletion requires separate maintainer approval.
- If any check fails or remains unverified, keep the release published but not closed and record the blocker.

## Emergency Releases

- Security or package-integrity incidents may justify an expedited patch release, but still require reproducible evidence, focused verification, and maintainer approval.
- Do not use an emergency release to bypass package ownership, license, provenance, or disclosure review.
