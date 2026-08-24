# Comins Contract v1.7

## Authority and Scope

- This Contract solely owns common Comins execution policy. Governance defines
  common requirements; each module owns its Git boundary, implementation, CI,
  and checker commands.
- Inspection, research, diagnosis, and planning are read-only unless the
  request asks for changes. A change request authorizes in-scope local edits
  and affected non-destructive checks.
- Package and release rules apply only when a package boundary and matching
  workflow exist.
- A common rule covers at least two modules or a universal licensing, security,
  privacy, release, or approval boundary.
- Keep module APIs, commands, tests, browser/performance rules, and enforcement
  in the affected module.
- Maintainer approval is required for remote writes, publishing, public-policy
  changes or exceptions, destructive operations, cost, and material scope
  expansion.

## Required Management Order

Resolve the target independent Git root and applicable instructions, then run
only the stages triggered by the requested change:

1. **License compliance:** inspect dependencies and distributed or reused
   material under `OSS_LICENSE_POLICY.md`.
2. **Security:** inspect vulnerabilities, secrets, credentials, and personal
   data under `SENSITIVE_DATA_STANDARD.md`.
3. **Comins common rules:** confirm this Contract's scope and approval boundary.
4. **Module rules:** apply the target module's API, structure, and checks.
5. **Change and verification:** make the smallest authorized change and run
   affected checks only.
6. **Git, pull request, and CI:** confirm diff hygiene, required checks, and
   protected-branch requirements.
7. **Release, when applicable:** apply `RELEASE_POLICY.md` only to an actual
   public publication.

A failed, incomplete, or unavailable required stage blocks only the affected
workflow. It does not trigger unrelated module, browser, performance, or
release work.
General-purpose skills and historical plans may refine mechanics but cannot add
stages, authority, or verification. Use subagents only when the maintainer
requests delegation or approved work is independently parallel; pass a bounded
brief, never full conversation history.

## Change, Git, and Verification

- Name new Codex development branches `codex-<short-feature-name>`; append
  `-2`, `-3`, and so on for additional work under the same representative
  feature. Existing and provider-managed branches are exempt.
- Run one final review or broad gate after the last meaningful change only when
  the selected route requires it.
- On failure, preserve same-commit evidence and successful checks, classify the
  cause, and rerun only the failed or affected job or test. A retry does not
  restart research, planning, review, or unrelated successful checks.
- Correct deterministic policy, type, and unit-test failures rather than
  retrying. A new commit reruns security and other diff-affected gates.

## Common Module Boundaries

- Preserve public APIs and types; use Semantic Versioning for releases.
- At package boundaries, keep React and React DOM integrations as peer
  dependencies and commit the lockfile.
- Declare package exports, types, CSS entry points, and intentional CSS side
  effects. Namespace public CSS and avoid global resets.
- Do not access the DOM at module evaluation time without a documented
  client-only boundary. Network access, remote assets, telemetry, and error
  reporting require consumer opt-in.
- Keep third-party engines behind a module-owned adapter boundary.

## Adoption and Records

- Record behavior-changing revisions in `CHANGELOG.md`; adopt them through
  separate reviewed module changes.
- Only meaningful behavior, API, configuration, security, release, or
  test-contract changes need a worklog; editorial and inspection-only work do
  not.
