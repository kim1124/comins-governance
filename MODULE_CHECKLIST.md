# New Comins Module Checklist

## Before Creation

- Confirm the module solves one focused frontend problem and does not duplicate an existing Comins module.
- Confirm the public npm name, GitHub repository name, module owner, and initial license.
- Define the first supported framework, runtime, browsers, and peer dependencies.
- Define the public API boundary and the primary user workflow before implementation.

## Repository Baseline

- Create an independent Git repository with a root `AGENTS.md` based on `templates/module/AGENTS.md`.
- Add a README with installation, a minimal example, supported versions, and release status.
- Add focused unit and build verification before adding browser-visible behavior.
- Add a browser verification path when interaction, layout, keyboard behavior, or rendering is part of the package contract.
- Namespace public CSS classes and custom properties by module.

## Before First Public Release

- Select a license and publish a security reporting path.
- Verify package contents with `npm pack --dry-run --json`.
- Run the module's full verification gate and a consumer installation check.
- Configure npm trusted publishing, maintainer 2FA, and provenance before public publication.
- Document known limitations, supported versions, and migration expectations.
