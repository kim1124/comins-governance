# Release Policy

This repository does not publish npm packages. Each Comins module owns its own version, changelog, CI, package contents, and npm publication.

## Required Release Evidence

- Target version, Semantic Versioning rationale, release and migration notes, residual risks, and unsupported cases.
- Exact verification commands and results, including `npm pack --dry-run --json`.
- A consumer installation or smoke check for the packed artifact.

## Publication Controls

- A brand-new npm package cannot use staged publishing or register a trusted publisher before it exists on the registry. Bootstrap the first public version interactively with maintainer 2FA and no automation token.
- Immediately after the bootstrap publication, register the exact GitHub repository, workflow filename, and `npm` environment as the package's trusted publisher.
- Allow only `npm stage publish` for the trusted publisher, disallow token publishing, and require a maintainer to approve or reject each staged version with npm 2FA.
- Use automatic provenance from GitHub Actions trusted publishing for eligible public packages.
- Keep package release credentials, workflow permissions, and release histories isolated per module.

## Emergency Releases

- Security or package-integrity incidents may justify an expedited patch release, but still require reproducible evidence, focused verification, and maintainer approval.
- Do not use an emergency release to bypass package ownership, provenance, or disclosure review.
