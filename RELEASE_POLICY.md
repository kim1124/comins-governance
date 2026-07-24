# Release Policy

This repository does not publish npm packages. Each Comins module owns its own version, changelog, CI, package contents, and npm publication.

## Release States

- **Candidate:** the target version, notes, exact artifact, and pre-publication evidence are prepared but not staged.
- **Staged:** the trusted publisher has staged the exact artifact and maintainer 2FA approval is pending.
- **Published:** the exact version resolves on the public registry but post-publication closure is pending.
- **Closed:** every post-publication check has passed, evidence is recorded, and local/remote default-branch state is reconciled.
- Only closed is complete.

## Required Release Evidence

- Target version, Semantic Versioning rationale, release and migration notes, residual risks, and unsupported cases.
- Confirm the intended package boundary in `package.json#files`.
- Create exactly one package artifact with `npm pack --json --ignore-scripts`. Compare the package file list returned by `npm pack --json --ignore-scripts` with the `package.json#files` allow-list.
- Extract that exact artifact into a disposable directory, scan the extracted directory with Gitleaks, and inspect the same artifact's contents.
- Record only constant, redacted security-gate results and run the consumer installation or smoke check against that exact artifact.

## Publication Controls

- A brand-new npm package cannot use staged publishing or register a trusted publisher before it exists on the registry. Bootstrap the first public version interactively with maintainer 2FA and no automation token.
- Immediately after the bootstrap publication, register the exact GitHub repository, workflow filename, and `npm` environment as the package's trusted publisher.
- Allow only `npm stage publish` for the trusted publisher, disallow token publishing, and require a maintainer to approve or reject each staged version with npm 2FA.
- Use automatic provenance from GitHub Actions trusted publishing for eligible public packages.
- Keep privacy-safe publisher metadata and use only an approved public handle, GitHub noreply identity, or service identity.
- Keep package release credentials, workflow permissions, and release histories isolated per module.

## Post-Publication Closure

- A registry-visible version is published, not closed, until every closure check below passes and the module records the evidence.
- Verify the exact version and intended dist-tag on the public registry.
- Verify the public artifact's integrity, expected registry signature, and provenance, and compare it with the staged or validated artifact when the release workflow exposes a digest or integrity value.
- Install the exact public version or tarball in an isolated consumer and run the module's public consumer smoke check.
- Confirm the protected source merge and applicable post-merge checks; record the source merge or commit and the release workflow run.
- Append the closure time, exact version, dist-tag, executed checks, results, and residual risks to the module's release evidence instead of rewriting its pre-publication history.
- Fetch remote refs and reconcile the local default branch with the remote default branch without rewriting unrelated work.
- Report remaining release branches and worktrees. Their deletion requires separate maintainer approval.
- If any check fails or remains unverified, keep the release published but not closed and record the blocker.

## Emergency Releases

- Security or package-integrity incidents may justify an expedited patch release, but still require reproducible evidence, focused verification, and maintainer approval.
- Do not use an emergency release to bypass package ownership, provenance, or disclosure review.
