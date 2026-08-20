# Comins Required Management Order Design

## Goal

Make one management order mandatory for Governance and every independent
Comins module, then adopt it through separate reviewed module pull requests.

## Fixed Order

Every change evaluates these stages in order:

1. resolve the independent Git root and applicable user, root, and path-local
   instructions;
2. confirm the shared Contract, scope, authority, approval boundary, and change
   class;
3. evaluate sensitive-data and security requirements;
4. evaluate open-source license surfaces and evidence;
5. apply module-owned API, directory, browser, performance, and command rules;
6. make the smallest authorized implementation or documentation change;
7. run focused, baseline, browser, artifact, and consumer checks required by
   the affected surface;
8. run Git hooks, diff hygiene, pull-request CI, and protected-branch checks;
9. for a public package release, validate and stage one exact artifact;
10. complete post-publication closure and meaningful-change reporting.

Each stage must be evaluated. A stage may be recorded as not applicable only
when the change surface does not trigger its gate. A required, unavailable,
incomplete, or failed security, license, verification, approval, artifact, or
closure gate stops progression.

## Ownership

- `COMINS_CONTRACT.md` owns the detailed mandatory sequence.
- Governance `AGENTS.md` and `templates/module/AGENTS.template.md` carry one
  concise routing statement and keep security before licensing.
- `DEV_GUIDE.md` explains the operator-facing sequence and lifecycle gates.
- Module-specific API, performance, browser, and command details remain outside
  the managed block in each independent repository.
- Historical plans and reports do not override active policy.

## Adoption

Governance is reviewed and merged first. Data Table, Grid Layout, and Sortable
then adopt the merged Governance revision through independent branches and pull
requests using `comins-reference`.

Package-boundary repositories must expose a deterministic `check:licenses`
gate in their baseline and validate the exact artifact. A repository without a
package boundary applies the policy to tracked material without inventing npm
or artifact commands.

## Verification

- Add a failing Governance contract test that detects an omitted, duplicated,
  or reordered stage in the canonical Contract and generated managed guidance.
- Run the focused Governance test, then the full Governance suite once.
- For each module, verify marker synchronization, byte-preservation outside the
  managed block, config parsing, instruction/security tests, license behavior,
  and the repository baseline required by the adopted change.
- Run instruction inventory and diff hygiene in all four repositories.
- Merge only after required GitHub checks pass; do not delete branches or
  worktrees as part of adoption.

## Rollback And Failure Handling

- Never partially synchronize only one managed surface.
- Preserve unrelated dirty and untracked work.
- If a module cannot satisfy a required v1.3 gate, leave its pull request
  unmerged and report the exact blocker instead of weakening Governance.
- A published package is not complete until it reaches the Contract's
  `Closed` state.
