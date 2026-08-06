# Comins Contract v1.5

## Scope and Change Control

- Every module is an independent Git repository and CI boundary. Package and
  release rules apply only when a package boundary and matching workflow exist.
- Make a rule common only when it affects at least two modules or establishes a
  universal security, licensing, release, privacy, or approval boundary.
- Keep module APIs, commands, test suites, browser checks, performance targets,
  and policy enforcement implementations in the affected module.
- Require maintainer approval for remote writes, publishing, public-policy
  exceptions, destructive operations, cost, and material scope expansion.

## Required Management Order

Before the numbered checks, resolve the target independent Git root and its
applicable instructions. Then proceed in this order:

1. **License compliance:** inspect used packages, copied or modified code,
   generated material, assets, and distributed contents under
   `OSS_LICENSE_POLICY.md`.
2. **Security:** inspect vulnerabilities, credentials, secrets, personal data,
   and dependency alerts under `SENSITIVE_DATA_STANDARD.md`.
3. **Comins common rules:** confirm this Contract, scope, authority, repository
   independence, and approval boundaries.
4. **Module rules:** apply the target module's API, structure, test, browser,
   performance, and command requirements.
5. **Change and verification:** make the smallest authorized change and run only
   checks required by the affected surface.
6. **Git, pull request, and CI:** confirm diff hygiene, required checks, and
   protected-branch requirements.
   Name each new Codex development branch `codex-<short-feature-name>`. For
   additional work under the same representative feature, append `-2`, `-3`,
   and so on. Existing and provider-managed branches are exempt.
7. **Release, when applicable:** for an actual public package publication only,
   apply `RELEASE_POLICY.md` to the exact release artifact and closure.

Only a triggered stage requires execution. A required failed, incomplete, or
unavailable gate blocks that workflow. It must not expand the task into
unrelated module, browser, performance, or release work.

## Common Module Boundaries

- Preserve documented public APIs and types and apply Semantic Versioning to
  public releases.
- Keep framework integrations such as React and React DOM as peer dependencies
  and commit the package-manager lockfile when a package boundary exists.
- Declare package exports, types, CSS entry points, and intentional CSS side
  effects; namespace public CSS and avoid global resets.
- Do not access the DOM at module evaluation time without a documented
  client-only boundary. Network access, remote assets, telemetry, and error
  reporting require consumer opt-in.
- Keep third-party engines behind a module-owned adapter boundary.

## Policy Ownership

- Governance defines common requirements; each module defines how its
  repository implements and verifies them.
- Record behavior-changing revisions in `CHANGELOG.md` and adopt them through
  separate reviewed module changes.
- Record executed checks and unresolved blockers for meaningful behavior, API,
  configuration, security, release, or test-contract changes. Editorial and
  inspection-only work does not require a worklog.
