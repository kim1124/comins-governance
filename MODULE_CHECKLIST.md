# New Comins Module Checklist

## Before Creation

- Confirm the module solves one focused frontend problem and does not duplicate an existing Comins module.
- Confirm the public npm name, GitHub repository name, module owner, and MIT license copyright holder.
- Define the first supported framework, runtime, browsers, and peer dependencies.
- Define the public API boundary and the primary user workflow before implementation.

## Repository Baseline

- Create an independent Git repository with a root `AGENTS.md` based on `templates/module/AGENTS.md`.
- Add a README with installation, a minimal example, supported versions, and release status.
- Add focused unit and build verification before adding browser-visible behavior.
- Add a browser verification path when interaction, layout, keyboard behavior, or rendering is part of the package contract.
- Namespace public CSS classes and custom properties by module.

## Before First Public Release

- Add the MIT `LICENSE` and record applicable third-party notices.
- Enable GitHub private vulnerability reporting and add a repository-local `SECURITY.md` that directs reporters to it.
- Verify package contents with `npm pack --dry-run --json`.
- Run the module's full verification gate and a consumer installation check.
- Configure GitHub Actions OIDC trusted publishing, maintainer 2FA, and provenance before public publication.
- Use stage-only publication with maintainer approval for the first public release.
- Document known limitations, supported versions, and migration expectations.
