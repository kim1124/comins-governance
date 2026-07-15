# New Comins Module Checklist

## Before Creation

- Confirm the module solves one focused frontend problem and does not duplicate an existing Comins module.
- Confirm the public npm name, GitHub repository name, module owner, and MIT license copyright holder.
- Define the supported framework, runtime, browsers, peer dependencies, SSR boundary, package manager, public API, and primary workflow.

## Repository Baseline

- Create an independent Git repository with a root `AGENTS.md` based on `templates/module/AGENTS.md` and a README with installation, a minimal example, supported versions, and release status.
- Commit the package-manager lockfile and use its immutable install mode in CI.
- Add focused unit and build verification, plus a browser path for interaction, layout, keyboard, or rendering behavior.
- Namespace public CSS classes and custom properties; document exported CSS and intentional side effects.

## Before First Public Release

- Add the MIT `LICENSE`, applicable third-party notices, PVR, a repository-local `SECURITY.md`, and available dependency and secret-scanning alerts.
- Add release notes or a changelog with known limitations and migration expectations.
- Verify package contents with `npm pack --dry-run --json`, the full gate, and a consumer installation check.
- Confirm maintainer 2FA, then bootstrap a brand-new package interactively without an automation token.
- After the package exists, register the exact GitHub repository, workflow filename, and `npm` environment as its trusted publisher; allow only `npm stage publish`, disallow token publishing, and require maintainer 2FA approval.
