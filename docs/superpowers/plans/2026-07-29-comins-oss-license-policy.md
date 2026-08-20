# Comins OSS License Policy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish Contract v1.3 with a Governance-owned, fail-closed open-source license policy and document how every Comins module adopts and verifies it.

**Architecture:** `OSS_LICENSE_POLICY.md` is the single detailed policy owner. The Contract, managed module guidance, checklist, release policy, README, changelog, and `DEV_GUIDE.md` carry only the lifecycle rules needed by their readers. Independent modules adopt the revision later through separate reviewed changes.

**Tech Stack:** Markdown, Node.js built-in test runner, deterministic Comins guidance synchronization.

## Global Constraints

- Approved policy mode is fail closed.
- Automatic approval is limited to the exact policy allow-list and its stated use-surface conditions.
- Missing, ambiguous, custom, compound, copyleft, source-available, noncommercial, no-derivatives, field-of-use, or otherwise restricted evidence requires a scoped maintainer approval before merge or release.
- The automated gate proves Comins policy evidence, not legal compliance.
- Do not add an external scanner dependency in Governance.
- Do not modify independent module repositories during this Governance change.
- Preserve existing untracked reports and unrelated work.
- Do not commit, push, publish, merge, tag, or change provider settings without a separate maintainer request.

---

### Task 1: Contract v1.3 Test Boundary

**Files:**
- Modify: `test/policy-contract.test.mjs`
- Test: `test/policy-contract.test.mjs`

**Interfaces:**
- Consumes: the current policy documents and managed module template.
- Produces: executable assertions for Contract v1.3, the canonical policy, fail-closed review cases, evidence records, exact-artifact enforcement, and separate module adoption.

- [x] **Step 1: Add failing policy assertions**

Add a `licensePolicy` fixture for `OSS_LICENSE_POLICY.md`, update Contract and marker expectations to `v1.3`, and assert these observable document contracts:

```js
assert.match(contract, /^# Comins Contract v1\.3$/m);
assert.match(moduleAgents, /contract=v1\.3/);
assert.match(licensePolicy, /fail closed/i);
assert.match(licensePolicy, /THIRD_PARTY_NOTICES\.md/);
assert.match(licensePolicy, /exact artifact/i);
assert.match(changelog, /^## v1\.3 /m);
```

Assert the exact automatic-review license identifiers and require manual review for missing, ambiguous, custom, compound, copyleft, source-available, noncommercial, no-derivatives, and field-of-use cases. Assert that exceptions are component-, version-, and use-surface-specific.

- [x] **Step 2: Run the focused test and confirm RED**

Run:

```sh
node --test test/policy-contract.test.mjs
```

Expected: failures caused by the absent `OSS_LICENSE_POLICY.md`, Contract v1.2, and the v1.2 managed marker.

### Task 2: Canonical Policy and Lifecycle Integration

**Files:**
- Create: `OSS_LICENSE_POLICY.md`
- Modify: `COMINS_CONTRACT.md`
- Modify: `AGENTS.md`
- Modify: `templates/module/AGENTS.template.md`
- Modify: `SENSITIVE_DATA_STANDARD.md`
- Modify: `MODULE_CHECKLIST.md`
- Modify: `RELEASE_POLICY.md`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `DEV_GUIDE.md`
- Create: `docs/assets/comins-brand-management-overview.png`

**Interfaces:**
- Consumes: Task 1 assertions and the approved fail-closed decision.
- Produces: one canonical policy, a versioned managed block, PR/release lifecycle routing, and administrator-facing operating guidance.

- [x] **Step 1: Write the canonical policy**

Define:

- covered use surfaces: development tooling, external peers, bundled runtime/transitive code, copied or modified code, assets, and generated output;
- the exact automatic-review allow-list;
- conditional OFL-1.1 handling for fonts with the license text and reserved-name obligations preserved;
- manual-review triggers and scoped approval evidence;
- `THIRD_PARTY_NOTICES.md` and `THIRD_PARTY_LICENSES/` responsibilities;
- PR, CI, exact-artifact, release, legacy-audit, and value-safe output rules.

- [x] **Step 2: Bump and route Contract v1.3**

Update the Contract heading, Governance guidance, managed marker, and module guidance. Keep the managed block concise and framework-neutral.

- [x] **Step 3: Integrate lifecycle documents**

Add only context-specific summaries:

- checklist: first PR and first release readiness;
- release policy: exact-artifact license evidence and fail-closed staging;
- README: policy index, flow, and current Contract version;
- changelog: v1.3 behavior and separate reviewed module adoption;
- `DEV_GUIDE.md`: canonical ownership, use-surface classification, automatic/manual decision table, evidence files, PR/release gates, and module-adoption boundary.

- [x] **Step 4: Run the focused test and confirm GREEN**

Run:

```sh
node --test test/policy-contract.test.mjs
```

Expected: all focused policy-contract tests pass.

### Task 3: Governance Verification and Review

**Files:**
- Verify: all files changed by Tasks 1 and 2.

**Interfaces:**
- Consumes: the completed Governance policy revision.
- Produces: reference, instruction, test, and diff evidence suitable for maintainer review.

- [x] **Step 1: Check references and managed markers**

Verify local Markdown links, the single v1.3 managed marker pair, and the absence of stale active v1.2 references outside historical plans and reports.

- [x] **Step 2: Run all Governance tests once**

Run:

```sh
node --test test/*.test.mjs
```

Expected: zero failures.

- [x] **Step 3: Run instruction inventory and diff hygiene**

Run:

```sh
node .agents/skills/comins-updatemd/scripts/inventory-instructions.mjs --repo governance="$PWD"
git diff --check
```

Expected: no instruction finding and no whitespace error.

- [x] **Step 4: Request an independent read-only review**

Review the working-tree diff against this plan. Fix every Critical or Important finding and rerun the affected focused check plus the full Governance suite once after the final meaningful contract change.

- [x] **Step 5: Report the adoption boundary**

Report the Governance branch and changed files, exact verification results, and the three independent module adoptions that remain intentionally unperformed. Keep the branch local; commit and remote publication require a separate request.
