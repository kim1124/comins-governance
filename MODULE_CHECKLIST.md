# New Comins Module Checklist

## Before Creation

- Confirm the module solves one focused frontend problem and does not duplicate an existing Comins module.
- Confirm the public npm name, GitHub repository name, module owner, and MIT license copyright holder.
- Define the supported framework, runtime, browsers, peer dependencies, SSR boundary, package manager, public API, and primary workflow.

## Repository Baseline

- Create an independent Git repository, run `$comins-reference` to initialize its root `AGENTS.md`, and add a README with installation, a minimal example, supported versions, and release status.
- Commit the package-manager lockfile and use its immutable install mode in CI.
- Add focused unit and build verification, plus a browser path for interaction, layout, keyboard, or rendering behavior.
- Namespace public CSS classes and custom properties; document exported CSS and intentional side effects.

## Before First Commit

- Install and run the required local hook for Gitleaks; fail closed if the scanner or hook is unavailable.

## Before First Pull Request

- Make Gitleaks required security CI and expose only constant, redacted failure output.

## Before First Public Release

- Add the MIT `LICENSE`, applicable third-party notices, PVR, a repository-local `SECURITY.md`, and available dependency and secret-scanning alerts.
- Add release notes or a changelog with known limitations and migration expectations.
- Create exactly one artifact with `npm pack --json --ignore-scripts`. Compare the package file list returned by `npm pack --json --ignore-scripts` with the `package.json#files` allow-list.
- Extract that exact artifact, scan the extracted directory with Gitleaks, inspect its contents, and use it for the consumer installation check.
- Confirm maintainer 2FA, then bootstrap a brand-new package interactively without an automation token.
- After the package exists, register the exact GitHub repository, workflow filename, and `npm` environment as its trusted publisher; allow only `npm stage publish`, disallow token publishing, and require maintainer 2FA approval.

## After Every Public Release

- Verify the exact version and intended dist-tag on the public registry, including the public artifact's integrity, expected registry signature, and provenance.
- Install the exact public version or tarball in an isolated consumer and run the public consumer smoke check.
- Append post-publication closure evidence, reconcile the local default branch with the remote default branch, and report remaining release branches and worktrees without deleting them unless separately approved.
