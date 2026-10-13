# Comins Contract v1.11

## Authority and Scope

- This Contract owns common Comins execution policy. Governance defines
  common requirements; each module owns its Git boundary, implementation, CI,
  and checker commands.
- Inspection, research, diagnosis, and planning are read-only unless the
  request asks for changes. A change request authorizes in-scope local edits
  and affected non-destructive checks.
- Package and release rules apply only when a package boundary and matching
  workflow exist.
- Common rules cover two or more modules or universal licensing, security,
  privacy, release, or approval boundaries.
- Keep APIs, commands, tests, and browser/performance enforcement module-local.
- Preserve unrelated pre-existing edits and untracked files.
- Maintainer approval is required for remote writes, publishing, public-policy
  changes or exceptions, destructive operations, cost, and material scope
  expansion.
- Apply approval already given for the current scope; do not ask again for
  authorized local edits, affected checks, or routine implementation choices.

## Required Management Order

Resolve the target independent Git root and applicable instructions, then run
only the stages triggered by the requested change:
Before editing, read applicable nested `AGENTS.md` or
`AGENTS.override.md`; do not pre-read unrelated directories.

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
Explicit maintainer instructions take precedence over skill guidelines. If a
skill would stop authorized work or require unrelated checks, name the exact
instruction and follow this Contract's applicable route.

## Model Configuration

Managed configuration owns base defaults. When selecting roles, follow
[agent roles](docs/agent-roles.md) with explicit model and effort.
Use at most `high` for all roles; this instruction policy is not an enforced
client or API limit.

## Change, Git, and Verification

- Name new Codex development branches `codex-<short-feature-name>`; append
  `-2`, `-3`, and so on for additional work under the same representative
  feature. Existing and provider-managed branches are exempt.
- Write commit subjects and bodies in Korean; preserve code/API identifiers.
  Follow [commit message guidance](docs/commit-messages.md) when preparing a commit.
- Run one final review or broad gate after the last meaningful change only when
  the selected route requires it.
- On failure, preserve same-commit evidence and successful checks, classify the
  cause, and rerun only the failed or affected job or test. A retry does not
  restart research, planning, review, or unrelated successful checks.
- Reuse successful evidence while source, relevant configuration, dependencies,
  and required workflow are unchanged; message or turn boundaries alone do not
  invalidate it. Report the verified revision and any uncovered changes.
- If the same defect remains after one fix attempt or recurs, perform one
  systematic root-cause analysis for that task. Before the next implementation,
  confirm a focused regression test fails for the defect and passes with the
  fix. Do not restart either workflow after it passes unless the failure
  signature changes or a later code change can affect the test.
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
- For explicitly approved local-only adoption, use the matching Contract in a
  verified Governance checkout and report it as unpublished. Remote adoption
  still requires a matching canonical version and separate write authority.
- Only meaningful behavior, API, configuration, security, release, or
  test-contract changes need a worklog; editorial and inspection-only work do
  not.
