# Release Policy

This repository does not publish npm packages. Each Comins module owns its own version, changelog, CI, package contents, and npm publication.

## Required Release Evidence

- Target version, Semantic Versioning rationale, release and migration notes, residual risks, and unsupported cases.
- Confirm the intended package boundary in `package.json#files`.
- Create exactly one package artifact with `npm pack --json --ignore-scripts`, extract it into a disposable directory, scan that extracted directory with Gitleaks, and inspect the same artifact's contents.
- Record only constant, redacted security-gate results and run the consumer installation or smoke check against that exact artifact.

## Publication Controls

- A brand-new npm package cannot use staged publishing or register a trusted publisher before it exists on the registry. Bootstrap the first public version interactively with maintainer 2FA and no automation token.
- Immediately after the bootstrap publication, register the exact GitHub repository, workflow filename, and `npm` environment as the package's trusted publisher.
- Allow only `npm stage publish` for the trusted publisher, disallow token publishing, and require a maintainer to approve or reject each staged version with npm 2FA.
- Use automatic provenance from GitHub Actions trusted publishing for eligible public packages.
- Keep privacy-safe publisher metadata and use only maintainer-approved public role identities.
- Keep package release credentials, workflow permissions, and release histories isolated per module.

## Emergency Releases

- Security or package-integrity incidents may justify an expedited patch release, but still require reproducible evidence, focused verification, and maintainer approval.
- Do not use an emergency release to bypass package ownership, provenance, or disclosure review.
