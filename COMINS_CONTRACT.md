# Comins Contract v1.0

## Repository Ownership

- Every Comins module is an independent Git repository, npm package, CI pipeline, and release unit.
- Do not use another repository's workspace commands, source synchronization, dependency linking, or release process unless the maintainer explicitly requests it.
- Treat historical KMSF references as migration evidence, not active operational dependencies.

## Public Package Rules

- Preserve documented public APIs and types unless the change is explicitly versioned and documented.
- Apply Semantic Versioning to public package releases.
- Keep framework integrations such as React and React DOM as peer dependencies when the module is consumed by an application.
- Document supported runtime, browser, framework, and peer dependency ranges in the module repository.
- Publish the module's MIT `LICENSE` with a current Comins copyright notice.
- Record bundled or copied third-party components and their required notices in the module repository.

## Consumer Neutrality

- Do not apply global CSS resets or modify document-level styles.
- Namespace public CSS classes and custom properties by module.
- Make visual tokens opt-in and avoid requiring a Comins design system.
- Keep third-party engines behind a module-owned adapter boundary.

## Quality Gates

- Each module must define its local baseline verification command and run the relevant focused checks for a changed behavior.
- Browser-visible interaction requires browser verification in the affected module.
- Accessibility, keyboard interaction, and error states are part of the public behavior contract.
- Meaningful code, documentation, configuration, or test changes must record executed validation and residual risks in the module's established report location.
- A public module must enable GitHub private vulnerability reporting and maintain a repository-local `SECURITY.md` that points reporters to that channel.

## Change Boundaries

- Keep changes scoped to the requested module and behavior.
- Do not publish, tag, create a release, or push a remote branch without an explicit maintainer request.
- Escalate unresolved product, public API, data, security, migration, release, or destructive-operation decisions before implementation.
