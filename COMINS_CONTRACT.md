# Comins Contract v1.3

## Scope and Change Control

- Every module is an independent Git repository and CI boundary; package and release units apply only when a package boundary exists. Do not use another repository's workspace, source synchronization, dependency linking, or release process without a maintainer request.
- Make a rule common only when it affects at least two modules or security, licensing, release, or consumer privacy. Record it in `CHANGELOG.md` and adopt behavior-changing revisions through separate reviewed module changes.
- Treat historical KMSF references as migration evidence, not active operational dependencies.
- Require an explicit maintainer request for remote writes and escalate unresolved product, API, data, security, migration, release, or destructive-operation decisions.

## Required Management Order

Every change evaluates these stages in order:

1. Resolve the independent Git root and applicable user, root, and path-local instructions.
2. Confirm the shared Contract, scope, authority, approval boundary, and change class.
3. Evaluate sensitive-data and security requirements.
4. Evaluate open-source license surfaces and evidence.
5. Apply module-owned API, directory, browser, performance, and command rules.
6. Make the smallest authorized implementation or documentation change.
7. Run focused, baseline, browser, artifact, and consumer checks required by the affected surface.
8. Run Git hooks, diff hygiene, pull-request CI, and protected-branch checks.
9. For a public package release, validate and stage one exact artifact.
10. Complete post-publication closure and meaningful-change reporting.

Every stage must be evaluated. A stage is not applicable only when its gate is
not triggered by the change surface. A required unavailable, incomplete, or
failed gate stops progression.

## Package and Consumer Rules

- Preserve documented public APIs and types, applying Semantic Versioning to public releases.
- Keep framework integrations such as React and React DOM as peer dependencies, and document supported runtime, browser, framework, peer dependency, SSR, and client-only behavior.
- Declare package exports, types, CSS entry points, and intentional CSS side effects; set a supported runtime in `engines` when the package has one.
- Do not declare mutable dist-tags such as `latest`, `next`, or `canary` as dependencies. Commit a lockfile and use the package manager's immutable installation mode in CI.
- Publish the module's MIT `LICENSE` with a current Comins copyright notice.
- Adopt Governance `OSS_LICENSE_POLICY.md`; classify dependencies, copied or modified code, assets, and generated third-party output by exact version and use surface.
- Fail closed on missing, ambiguous, restricted, or unapproved license evidence, and record distributed third-party material and required texts in the module repository and exact artifact.
- Do not access the DOM at module evaluation time without a documented client-only boundary, or make network requests, load remote assets, collect telemetry, or report errors without consumer opt-in.

## Consumer Neutrality

- Do not apply global CSS resets or modify document-level styles.
- Namespace public CSS classes and custom properties by module.
- Make visual tokens opt-in and avoid requiring a Comins design system.
- Keep third-party engines behind a module-owned adapter boundary.

## Sensitive Data

- Never track personal names, personal email addresses, local account paths, credentials, tokens, secrets, or value-derived fingerprints in source, fixtures, allowlists, reports, plans, or release artifacts except the required legal text below.
- Outside the required legal-text boundary, permit only an approved public handle, GitHub noreply identity, service identity, explicit placeholder, repository-relative path, or synthetic detector fixture value assembled at test runtime.
- Preserve canonical-source third-party legal text only when legally required; omit personal contact details when a canonical project URL is sufficient.
- Require the local Gitleaks hook, required security CI, and exact packed-artifact inspection defined by `SENSITIVE_DATA_STANDARD.md`; fail closed when a required gate is unavailable.
- Redact detector output, expose only constant failure messages, and handle legacy history or provider remediation as a separate audit.

## Quality Gates

- Define a local baseline verification command, run focused checks for changed behavior, and use browser verification for browser-visible interaction.
- Accessibility, keyboard interaction, and error states are public behavior.
- Record executed validation and residual risks for behavior, public API, configuration, security, release, or test-contract changes; do not require a worklog for inspection-only or editorial changes.
- Before first public release, enable the repository license gate, GitHub private vulnerability reporting, a repository-local `SECURITY.md`, and available dependency and secret-scanning alerts.
