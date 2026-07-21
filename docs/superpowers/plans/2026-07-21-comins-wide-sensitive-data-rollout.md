# Comins-Wide Sensitive Data Prevention Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply and verify Comins Contract v1.2 sensitive-data prevention across governance, table, grid-layout, and sortable as four independent local changesets, then produce one evidence-backed adoption matrix without remote writes.

**Architecture:** Governance establishes the normative contract and audited reference implementation first. Each module executes its own repository plan, owns copied scanner/hook/CI code, preserves existing product gates, and stops independently on failure. A final governance matrix records local conformance separately from GitHub settings, npm metadata, and historical-remediation status.

**Tech Stack:** Markdown, Git, Node.js 24 ESM, repository-local test runners, Git hooks, GitHub Actions, Gitleaks 8.30.1, npm package gates where a product package exists.

## Global Constraints

- Execute from the common parent containing sibling repositories `governance`, `data-table`, `grid-layout`, and `sortable`; the parent itself is not a Git repository.
- Use each repository's root `AGENTS.md`, branch, lockfile, scripts, and reporting convention.
- Keep each repository as an independent commit, verification, CI, and release unit.
- This rollout is future-prevention only. Do not rewrite history, delete npm or GitHub data, unpublish, revoke accounts, or remove external caches.
- Never print personal identifiers, Git or npm email values, tokens, secrets, local account paths, or matched scanner values in console output, reports, plan tracking, or commit messages.
- Do not overwrite, discard, stage, or commit an unattributed dirty-worktree change. In particular, reconcile grid-layout's in-progress scanner files before continuing.
- A failure in one repository does not become a warning or a pass for another repository.
- Do not push, open or update PRs, dispatch workflows, change GitHub rulesets or security settings, stage or publish npm packages, or perform another external write without a separate explicit request.

## Child Plans

- Governance: `governance/docs/superpowers/plans/2026-07-21-contract-v1.2-sensitive-data-standard.md`
- Table: `data-table/docs/superpowers/plans/2026-07-21-contract-v1.2-sensitive-data-conformance.md`
- Grid layout: `grid-layout/docs/superpowers/plans/2026-07-21-sensitive-data-prevention.md`
- Sortable: `sortable/docs/superpowers/plans/2026-07-21-contract-v1.2-sensitive-data-baseline.md`

---

### Task 1: Freeze the Four-Repository Execution Boundary

**Files:**
- Inspect: each child plan
- Inspect: each repository `AGENTS.md`
- Inspect: each repository worktree and local/remote branch relation

**Interfaces:**
- Consumes: current local repositories and design commit `5f39c66`.
- Produces: an attributed baseline without exposing identity values or changing files.

- [ ] **Step 1: Confirm all repository roots and instructions**

Run from the parent:

```bash
for repo in governance data-table grid-layout sortable
do
  git -C "$repo" rev-parse --show-toplevel
  test -f "$repo/AGENTS.md"
done
```

Expected: four distinct Git roots and four root instruction files.

- [ ] **Step 2: Capture branch and dirty state**

Run:

```bash
for repo in governance data-table grid-layout sortable
do
  git -C "$repo" status --short --branch
  git -C "$repo" log -1 --oneline
done
```

Expected: every dirty path is attributed before execution. Do not use a parent-wide `git add`. Stop only the affected repository if a path overlaps its child plan and ownership cannot be established.

- [ ] **Step 3: Confirm child-plan and design coverage**

Run:

```bash
test -f governance/docs/superpowers/specs/2026-07-21-comins-wide-sensitive-data-prevention-design.md
test -f governance/docs/superpowers/plans/2026-07-21-contract-v1.2-sensitive-data-standard.md
test -f data-table/docs/superpowers/plans/2026-07-21-contract-v1.2-sensitive-data-conformance.md
test -f grid-layout/docs/superpowers/plans/2026-07-21-sensitive-data-prevention.md
test -f sortable/docs/superpowers/plans/2026-07-21-contract-v1.2-sensitive-data-baseline.md
git -C governance show --quiet --oneline 5f39c66
```

Expected: all artifacts exist and governance resolves the approved design commit.

---

### Task 2: Execute and Gate Governance First

**Files:**
- Follow exactly: `governance/docs/superpowers/plans/2026-07-21-contract-v1.2-sensitive-data-standard.md`

**Interfaces:**
- Consumes: approved design and Contract v1.1.
- Produces: Contract v1.2, reference scanner, hooks, pinned Gitleaks installer, and required CI source for module adoption.

- [ ] **Step 1: Execute every governance checklist item**

Use the required execution sub-skill and mark the governance child plan task-by-task. Do not begin a module copy step until governance's detector, CLI, hook, and installer tests are green.

- [ ] **Step 2: Verify the governance handoff**

Run:

```bash
git -C governance diff --check
git -C governance status -sb
git -C governance log --oneline origin/main..HEAD
test -f governance/SENSITIVE_DATA_STANDARD.md
test -f governance/scripts/security-audit-lib.mjs
test -f governance/scripts/security-audit.mjs
test -f governance/scripts/install-security-hooks.mjs
test -f governance/scripts/install-gitleaks.mjs
```

Expected: the governance child plan is fully verified, its implementation paths exist, and the branch is local-only ahead of `origin/main`.

- [ ] **Step 3: Stop all downstream work on a governance failure**

If any governance policy test, mode test, redaction test, archive test, hook test, checksum test, source scan, or history scan fails, classify the failure and correct governance first. Do not distribute an unverified scanner to modules.

---

### Task 3: Execute Table Conformance Without Weakening Existing Gates

**Files:**
- Follow exactly: `data-table/docs/superpowers/plans/2026-07-21-contract-v1.2-sensitive-data-conformance.md`

**Interfaces:**
- Consumes: audited governance files and the existing table hygiene scanner.
- Produces: two independent repository scanners, composed hooks, required CI, exact `.tgz` gates, and privacy-safe release identity preflight.

- [ ] **Step 1: Execute the table child plan**

Preserve the existing benchmark, history, package allowlist, consumer, Playwright, and full verification contracts. Remove path-derived hygiene fingerprints before declaring Contract v1.2 conformance.

- [ ] **Step 2: Require table completion evidence**

Run:

```bash
npm --prefix data-table run test:security
npm --prefix data-table run verify:security
npm --prefix data-table run verify:full
npm --prefix data-table run test:consumer
git -C data-table diff --check
git -C data-table status -sb
git -C data-table log --oneline origin/main..HEAD
```

Expected: both scanners, existing full gate, and consumer gate pass; the exact archive and Gitleaks results are recorded by the child plan. Do not run the authenticated release-identity command unless an authenticated maintainer environment is available.

- [ ] **Step 3: Isolate table failures**

If a table-specific hygiene or product gate fails, keep governance status unchanged and stop table adoption before moving to grid-layout. Classify network, browser bind, product, and test-contract failures separately.

---

### Task 4: Reconcile and Complete Grid-Layout Conformance

**Files:**
- Follow exactly: `grid-layout/docs/superpowers/plans/2026-07-21-sensitive-data-prevention.md`

**Interfaces:**
- Consumes: its merged security branch, in-progress scanner changes, governance reference, and existing resource/browser gates.
- Produces: Contract v1.2 file/history/package coverage without losing branch history or user work.

- [ ] **Step 1: Reconfirm grid-layout ownership before editing**

Run:

```bash
git -C grid-layout status --short --branch
git -C grid-layout log --oneline --decorate -12
git -C grid-layout diff -- scripts/security-audit.mjs test/vitest/security-audit-cli.test.mjs
```

Expected: committed and uncommitted security work is identifiable. Do not overwrite current files merely because the child plan contains an older draft.

- [ ] **Step 2: Execute the reconciled grid-layout child plan**

Complete all Contract v1.2 deltas after Tasks 1-5, including explicit file mode, ordinal path redaction, local markers, full commit/tag/message metadata coverage, constant error output, release identity preflight, exact package scan, and existing resource/browser gates.

- [ ] **Step 3: Require grid-layout completion evidence**

Run:

```bash
npm --prefix grid-layout run verify:security
npm --prefix grid-layout run verify:full
npm --prefix grid-layout run test:consumer
git -C grid-layout diff --check
git -C grid-layout status -sb
git -C grid-layout log --oneline origin/codex/security-hardening..HEAD
```

Expected: focused security, full browser/resource, consumer, archive, and Gitleaks gates have actual results; the branch remains non-rewritten and unpushed.

---

### Task 5: Apply the Sortable Baseline Without Expanding Product Scope

**Files:**
- Follow exactly: `sortable/docs/superpowers/plans/2026-07-21-contract-v1.2-sensitive-data-baseline.md`

**Interfaces:**
- Consumes: audited governance files and the current policy-only repository.
- Produces: private tooling, scanner, hooks, required CI, and a first-release security checklist; no product package.

- [ ] **Step 1: Execute the sortable child plan**

Keep `package.json` private and dependency-free. Do not create source APIs, a publish workflow, a product archive, or npm metadata.

- [ ] **Step 2: Require sortable completion evidence**

Run:

```bash
npm --prefix sortable run verify
node sortable/scripts/security-audit.mjs file sortable/README.md
git -C sortable diff --check
git -C sortable status -sb
git -C sortable log --oneline origin/main..HEAD
```

Expected: policy, scanner, hook, CI-source, Gitleaks, and first-release boundary tests pass; the repository remains intentionally not release-ready.

---

### Task 6: Perform Cross-Repository Contract v1.2 Conformance Audit

**Files:**
- Create: `CONTRACT_ADOPTION.md`
- Inspect: active policy, scanner, hook, workflow, package, and report surfaces in all four repositories

**Interfaces:**
- Consumes: successfully completed child plans.
- Produces: one governance-owned adoption matrix with local evidence and separately labeled remote residuals.

- [ ] **Step 1: Verify active Contract version and scanner modes**

Run from the parent:

```bash
for repo in governance data-table grid-layout sortable
do
  rg -n "Comins Contract v1\.2|Contract v1\.2" "$repo/AGENTS.md"
  rg -n "worktree|file|staged|push|history|package" "$repo/scripts/security-audit.mjs"
  test -x "$repo/.githooks/pre-commit"
  test -x "$repo/.githooks/pre-push"
  test -f "$repo/.github/workflows/verify.yml"
done
```

Expected: all four roots adopt v1.2, all six scanner modes are present, hooks are executable, and required workflow source exists.

- [ ] **Step 2: Verify workflow and release-surface invariants**

Run:

```bash
for repo in governance data-table grid-layout sortable
do
  rg -n "fetch-depth: 0|persist-credentials: false|contents: read|verify:security|gitleaks" "$repo/.github/workflows/verify.yml"
done
rg -n "security-audit\.mjs package|gitleaks.*dir|upload-artifact" data-table/.github/workflows/publish.yml grid-layout/.github/workflows/publish.yml
test ! -e sortable/.github/workflows/publish.yml
```

Expected: required CI uses full history, no persisted checkout credential, read-only permissions, repository scanning, and pinned Gitleaks installation; product repositories scan before artifact upload; sortable has no publish workflow.

- [ ] **Step 3: Check public Git identity without printing values**

Run this read-only command from the parent:

```bash
node -e 'const {execFileSync}=require("node:child_process"); for (const repo of ["governance","data-table","grid-layout","sortable"]) { const get=(args)=>execFileSync("git",["-C",repo,...args],{encoding:"utf8",stdio:["ignore","pipe","pipe"]}).trim(); const remote=get(["remote","get-url","origin"]); const owner=/github\.com[/:]([^/]+)\//i.exec(remote)?.[1]??""; const name=get(["config","--get","user.name"]); const email=get(["config","--get","user.email"]); const safe=owner&&name.toLowerCase()===owner.toLowerCase()&&(/@users\.noreply\.github\.com$/i.test(email)||/^noreply@github\.com$/i.test(email)); process.stdout.write(repo+":"+(safe?"safe":"unsafe")+"\n"); if(!safe) process.exitCode=1; }'
```

Expected: exactly one `safe` status per repository and no identity value. A failure blocks commits in that repository until repository-local identity is corrected; never print the rejected values.

- [ ] **Step 4: Create the adoption matrix**

Create `CONTRACT_ADOPTION.md`:

```markdown
# Comins Contract Adoption

## Contract v1.2 Sensitive Data Prevention

| Repository | Local policy | Repository scanner | Hooks | Required CI source | Package gate | Local verification | Remote settings |
| --- | --- | --- | --- | --- | --- | --- | --- |
| comins-governance | not run | not run | not run | not run | not a product package | not run | unverified |
| comins-table | not run | not run | not run | not run | not run | not run | unverified |
| comins-grid-layout | not run | not run | not run | not run | not run | not run | unverified |
| comins-sortable | not run | not run | not run | not run | first-release gate only | not run | unverified |

Update a cell to `pass` only from a command actually executed in this rollout. Use `fail`, `not run`, or `environment blocked` otherwise. Remote settings remain `unverified` until a separately authorized read verifies Secret Scanning, Push Protection, and required checks.

Historical Git/npm remediation, registry metadata deletion, publish, and remote settings changes are outside this matrix and remain separate workstreams.
```

Replace each `not run` only after the corresponding child-plan evidence is reviewed. Do not put SHA-derived secret fingerprints, identities, matched values, local absolute paths, or npm profile values in the matrix.

- [ ] **Step 5: Verify and commit the governance matrix**

Run:

```bash
node governance/scripts/security-audit.mjs file governance/CONTRACT_ADOPTION.md
npm --prefix governance run verify
git -C governance diff --check
git -C governance add CONTRACT_ADOPTION.md
git -C governance commit -m "docs: record Contract v1.2 adoption"
```

Expected: the exact matrix file scan and governance verification pass, then one local governance documentation commit is created.

---

### Task 7: Stop at the Remote-Write Boundary and Prepare Decisions

**Files:**
- Inspect: `CONTRACT_ADOPTION.md`
- Inspect: each repository final status and commit range

**Interfaces:**
- Consumes: local implementation and audit evidence.
- Produces: a decision packet for separately authorized push, PR, GitHub settings, or release work.

- [ ] **Step 1: Run final non-mutating status checks**

Run:

```bash
for repo in governance data-table grid-layout sortable
do
  git -C "$repo" status -sb
  git -C "$repo" diff --check
done
```

Expected: each child plan reports its own clean or explicitly attributed state. Do not hide a grid-layout user change or another repository's residual behind a global completion statement.

- [ ] **Step 2: Report the four independent outcomes**

For each repository, report:

- local branch and commit count ahead of its upstream;
- focused and full commands actually run;
- exact pass/fail/environment-blocked result;
- package result or intentional no-package status;
- GitHub Secret Scanning, Push Protection, and required-check state as verified or unverified;
- npm identity/metadata state as verified, unverified, or not applicable;
- explicit confirmation that no push, PR mutation, workflow dispatch, stage, publish, history rewrite, or destructive cleanup occurred.

- [ ] **Step 3: Request separate authority for any external follow-up**

Do not combine these decisions:

1. push and PR integration for each repository;
2. GitHub Secret Scanning, Push Protection, and required-check changes;
3. authenticated npm identity or registry metadata verification;
4. first package/release work for sortable;
5. historical remediation, deletion requests, history rewrite, unpublish, or cache cleanup.

Expected: local rollout ends here. Every external or destructive follow-up requires a new explicit maintainer instruction.
