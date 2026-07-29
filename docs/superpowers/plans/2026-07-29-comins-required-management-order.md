# Comins Required Management Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix one mandatory Comins management order in Governance and prepare its reviewed adoption by every independent module.

**Architecture:** `COMINS_CONTRACT.md` owns the detailed ten-stage sequence. Governance and module `AGENTS` keep a concise always-loaded routing statement, while `DEV_GUIDE.md` explains operator behavior. Governance merges before independent module adoption.

**Tech Stack:** Markdown, Node.js built-in test runner, deterministic `comins-reference` synchronization, GitHub pull requests.

## Global Constraints

- The exact order is repository and instructions, Contract, scope and authority, sensitive-data security, OSS licensing, module rules, implementation, verification, Git and PR, exact-artifact release, closure and reporting.
- Every stage is evaluated in order; a stage is `N/A` only when its gate is not triggered.
- A required unavailable, incomplete, or failed gate stops progression.
- Keep the managed module block at or below 360 words by removing equivalent duplication instead of raising the cap.
- Keep module API, browser, performance, and command details outside the managed block.
- Governance merges before Data Table, Grid Layout, or Sortable adopts the revision.
- Preserve unrelated dirty and untracked work.
- Do not delete branches or worktrees.

---

### Task 1: Executable Management-Order Contract

**Files:**
- Modify: `test/policy-contract.test.mjs`
- Test: `test/policy-contract.test.mjs`

**Interfaces:**
- Consumes: current Contract v1.3 documents and the canonical managed module template.
- Produces: a regression contract that fails when a required stage is omitted, duplicated, or reordered.

- [x] **Step 1: Add the failing order test**

Add an order helper and a focused test:

```js
function assertOrdered(content, terms) {
  let cursor = -1;
  for (const term of terms) {
    const next = content.indexOf(term);
    assert.ok(next > cursor, `${term} must appear once after the prior stage`);
    assert.equal(content.indexOf(term, next + term.length), -1);
    cursor = next;
  }
}

test("fixes one required Comins management order", () => {
  const requiredOrder = section(contract, "## Required Management Order");
  assertOrdered(requiredOrder, [
    "independent Git root",
    "shared Contract",
    "sensitive-data and security",
    "open-source license",
    "module-owned",
    "smallest authorized",
    "focused, baseline",
    "Git hooks",
    "one exact artifact",
    "post-publication closure",
  ]);
  assert.match(requiredOrder, /not applicable only when/i);
  assert.match(requiredOrder, /stops progression/i);
  assertOrdered(moduleAgents, [
    "## Scope",
    "## Work Routing",
    "## Required Order",
    "## Change Boundaries",
    "## Sensitive Data",
    "## Open Source Licensing",
    "## Verification",
    "## Reporting",
  ]);
});
```

- [x] **Step 2: Verify RED**

Run:

```sh
node --test test/policy-contract.test.mjs
```

Expected: the new test fails because `## Required Management Order` and
`## Required Order` do not exist.

### Task 2: Canonical Order And Operator Guidance

**Files:**
- Modify: `COMINS_CONTRACT.md`
- Modify: `AGENTS.md`
- Modify: `templates/module/AGENTS.template.md`
- Modify: `DEV_GUIDE.md`
- Modify: `CHANGELOG.md`
- Modify: `reports/2026-07-29.md`
- Modify: `test/policy-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1's failing order contract.
- Produces: one detailed Contract sequence, concise automatic routing, and administrator guidance.

- [x] **Step 1: Add the detailed Contract sequence**

Add `## Required Management Order` after `Scope and Change Control`. Use the
ten exact stages from the design and state that every stage is evaluated,
`N/A` requires an unaffected surface, and a required failed or unavailable
gate stops progression.

- [x] **Step 2: Add concise automatic routing**

Add `## Required Order` between `Work Routing` and `Change Boundaries` in the
module template. Add the equivalent concise rule to Governance `AGENTS.md`.
Remove equivalent routing words elsewhere so the module template remains at
or below 360 words.

- [x] **Step 3: Align operator guidance and history**

Add the fixed sequence to `DEV_GUIDE.md`, record it under the v1.3 changelog
entry, and append the implementation and adoption boundary to
`reports/2026-07-29.md`.

- [x] **Step 4: Verify GREEN**

Run:

```sh
node --test test/policy-contract.test.mjs
```

Expected: all focused policy-contract tests pass.

### Task 3: Governance Verification And Integration

**Files:**
- Verify: every intended Governance file on `codex/oss-license-policy`

**Interfaces:**
- Consumes: Tasks 1 and 2 plus the existing Contract v1.3 OSS policy work.
- Produces: a merged Governance revision that independent modules can adopt.

- [x] **Step 1: Run the full local gates**

Run:

```sh
node --test test/*.test.mjs
node .agents/skills/comins-updatemd/scripts/inventory-instructions.mjs --repo governance="$PWD"
git diff --check
```

Expected: zero test failures, instruction `findings: 0`, and no diff error.

- [x] **Step 2: Verify scope and sensitive-data safety**

Review the complete staged diff, exclude the pre-existing
`reports/2026-07-27.md`, and scan only intended changed files with the pinned
Gitleaks configuration in redacted mode.

- [ ] **Step 3: Commit and publish**

Stage only intended files, commit the Contract v1.3 policy and fixed order,
push `codex/oss-license-policy`, and create a ready pull request to `main`.

- [ ] **Step 4: Merge after required checks**

Wait for required checks, verify the expected head SHA, merge without deleting
the branch, and record the merged Governance SHA for module adoption.

### Task 4: Independent Module Adoption

**Files:**
- Create: one implementation plan in each module
- Modify: each module's managed `AGENTS.md`
- Modify: only repository-owned license, test, package, workflow, and report
  files proven necessary by that module's v1.3 readiness audit

**Interfaces:**
- Consumes: the merged Governance SHA from Task 3.
- Produces: three independent Contract v1.3 adoption pull requests.

- [ ] **Step 1: Create isolated module worktrees**

Create one branch and temporary worktree per module from the refreshed remote
default branch. Do not modify the dirty primary worktrees.

```sh
COMINS_GOVERNANCE_ROOT="$(git rev-parse --show-toplevel)"
COMINS_PARENT_ROOT="$(dirname "$COMINS_GOVERNANCE_ROOT")"
git -C "$COMINS_PARENT_ROOT/data-table" fetch origin main
git -C "$COMINS_PARENT_ROOT/data-table" worktree add /private/tmp/comins-data-table-v13 -b agent/adopt-contract-v1.3 origin/main
git -C "$COMINS_PARENT_ROOT/grid-layout" fetch origin main
git -C "$COMINS_PARENT_ROOT/grid-layout" worktree add /private/tmp/comins-grid-layout-v13 -b agent/adopt-contract-v1.3 origin/main
git -C "$COMINS_PARENT_ROOT/sortable" fetch origin main
git -C "$COMINS_PARENT_ROOT/sortable" worktree add /private/tmp/comins-sortable-v13 -b agent/adopt-contract-v1.3 origin/main
```

- [ ] **Step 2: Synchronize managed guidance**

From each module root run:

```sh
node "$COMINS_GOVERNANCE_ROOT/.agents/skills/comins-reference/scripts/sync-guidance.mjs" update --target /private/tmp/comins-data-table-v13
node "$COMINS_GOVERNANCE_ROOT/.agents/skills/comins-reference/scripts/sync-guidance.mjs" update --target /private/tmp/comins-grid-layout-v13
node "$COMINS_GOVERNANCE_ROOT/.agents/skills/comins-reference/scripts/sync-guidance.mjs" update --target /private/tmp/comins-sortable-v13
```

Review managed and module-owned diffs separately.

- [ ] **Step 3: Implement repository-appropriate v1.3 gates**

For Data Table and Grid Layout, expose and baseline a deterministic
`check:licenses` gate and validate dependency, bundle, notice, license-text,
and exact-artifact boundaries required by the audit. For Sortable, validate
tracked material without adding npm or artifact commands.

- [ ] **Step 4: Verify, publish, and merge separately**

Run each repository's instruction, security, license, baseline, inventory, and
diff gates. Commit, push, open a ready PR, wait for required checks, and merge
each expected head SHA without deleting branches or worktrees.

### Task 5: Final Cross-Repository Closure

**Files:**
- Verify: Governance, Data Table, Grid Layout, and Sortable remote defaults

**Interfaces:**
- Consumes: four merged pull requests.
- Produces: final evidence that every repository adopted the same Governance revision.

- [ ] **Step 1: Refresh and compare**

Fetch every repository, verify each remote default contains its merge commit,
and compare managed blocks and managed project configuration to Governance.

- [ ] **Step 2: Run final inventory**

Run the Governance inventory helper for all four repositories and require
`findings: 0`.

- [ ] **Step 3: Report closure**

Report PR URLs, merge SHAs, validation results, preserved unrelated work, and
any exact external blocker. Do not call the rollout complete if any module PR
is unmerged.
