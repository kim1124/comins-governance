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
- Use GitHub Actions trusted publishing with OIDC rather than long-lived npm publishing tokens.
- For a module's first public release, CI may stage the package but a maintainer must approve final publication with npm 2FA.
- After trusted publishing is verified, require maintainer 2FA and restrict token-based publishing.
- Publish provenance for eligible public packages.
- Keep package release credentials, workflow permissions, and release histories isolated per module.

## Emergency Releases

- Security or package-integrity incidents may justify an expedited patch release.
- An expedited release still requires reproducible evidence, focused verification, and a maintainer release approval.
- Do not use an emergency release to bypass package ownership, provenance, or disclosure review.
