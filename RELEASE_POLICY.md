# Release Policy

## Scope

This repository does not publish npm packages. Each Comins module owns its own version, changelog, CI, package contents, and npm publication.

## Required Release Evidence

Before a public module release, the module repository must record:

- The target version and Semantic Versioning rationale.
- The exact verification commands run and their results.
- A package-content check using `npm pack --dry-run --json`.
- A consumer installation or smoke check for the packed artifact.
- Known residual risks, unsupported cases, and migration notes.

## Publication Controls

- A maintainer must explicitly approve publishing.
- Prefer GitHub Actions trusted publishing with OIDC over long-lived npm publishing tokens.
- Require maintainer 2FA and restrict token-based publishing after trusted publishing is verified.
- Publish provenance for eligible public packages.
- Keep package release credentials, workflow permissions, and release histories isolated per module.

## Emergency Releases

- Security or package-integrity incidents may justify an expedited patch release.
- An expedited release still requires reproducible evidence, focused verification, and a maintainer release approval.
- Do not use an emergency release to bypass package ownership, provenance, or disclosure review.
