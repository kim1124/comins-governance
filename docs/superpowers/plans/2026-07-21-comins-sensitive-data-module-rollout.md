# Comins Minimal Sensitive-Data Module Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt the reviewed Contract v1.2 gate in Data Table, Grid Layout, and Sortable without restoring a repository-owned secret, Git-object, tag, or archive scanner.

**Architecture:** Each independent repository owns a byte-for-byte copy of the reviewed Gitleaks rules and raw public-identity checker. Gitleaks handles staged, commit-range, and extracted-package content; module code only preserves package-specific hygiene and validates the `npm pack --json --ignore-scripts` file list.

**Tech Stack:** Markdown, Node.js 24 built-ins, Git, POSIX shell, npm, Gitleaks 8.30.1, GitHub Actions.

## Global Constraints

- Use Governance commit `7e51e9e` as the reviewed policy and shared-gate source.
- Do not implement Git-object, annotated-tag, tar, PAX, checksum, token-pattern, or binary parsers.
- Keep scanner output captured and deleted; expose only constant, value-free failure messages.
- Do not use `.gitleaksignore`, inline suppression, history baselines, or finding fingerprints.
- Use `npm pack --json --ignore-scripts` exactly once per package release candidate.
- Do not add a package manifest or npm tooling to Sortable before its package scope is separately approved.
- Do not push, publish, tag, open a pull request, change provider settings, or modify required checks.
- Do not remove superseded Governance long-form plans until all four branches pass whole-branch review.

---

### Task 1: Adopt the Thin Gate in Data Table

**Files:**
- Modify: `AGENTS.md`, `SECURITY.md`, `package.json`, `.gitignore`
- Replace: `scripts/check-repository-hygiene.mjs`, `test/repository-hygiene.test.ts`
- Create: `.gitleaks.toml`, `scripts/check-public-identities.mjs`, `scripts/verify-package-artifact.mjs`
- Modify: `.githooks/pre-commit`, `.githooks/pre-push`, `.github/workflows/verify.yml`, `.github/workflows/publish.yml`
- Create: `test/sensitive-data-gates.test.mjs`, `test/package-artifact-gate.test.mjs`
- Modify: `reports/2026-07-21.md`

**Interfaces:**
- `check-repository-hygiene.mjs [--staged]` checks only forced `.local/` paths and Comins Table's benchmark path/content policy.
- `check-public-identities.mjs [<base-sha> <head-sha>]` matches the reviewed Governance interface and raw, mailmap-independent fields.
- `verify-package-artifact.mjs` runs one ignored-script npm pack, accepts only paths covered by `package.json#files` plus npm's implicit `package.json` and `LICENSE`, and writes only the safe artifact filename on success.

- [ ] **Step 1: Write the failing contract tests**

Assert Contract v1.2 policy text, the four reviewed Gitleaks rules, immutable action pins, redacted hook/workflow commands, mailmap-resistant identity behavior, the absence of Git-object/tag/history parser terms in the hygiene script, and constant package-gate failures.

- [ ] **Step 2: Confirm RED**

Run: `node --test test/sensitive-data-gates.test.mjs test/package-artifact-gate.test.mjs`

Expected: FAIL because Contract v1.1, the shared gate, and exact artifact validator are absent.

- [ ] **Step 3: Implement the minimal module boundary**

Copy `.gitleaks.toml` and `scripts/check-public-identities.mjs` byte-for-byte from reviewed Governance. Rewrite repository hygiene to retain only current-index or staged-index benchmark/local-only checks; remove secret regex, identity, commit, tag, and history-object scanning. Keep `npm run check:hygiene` in `verify` and add the Node sensitive-data tests.

- [ ] **Step 4: Harden local and CI boundaries**

The pre-commit hook runs repository hygiene, raw identity validation, and pinned staged Gitleaks. The pre-push hook validates each pushed ancestor range with the identity checker and Gitleaks. The security CI job uses full-history credential-free checkout and the pinned Gitleaks checksum before scanning `base..head`.

- [ ] **Step 5: Enforce the exact package artifact**

The publish workflow builds and verifies first, runs `verify-package-artifact.mjs` once, extracts that exact archive with system `tar`, scans only the extracted `package/` directory with Gitleaks, uploads the same archive, and stages only the downloaded archive.

- [ ] **Step 6: Verify and commit**

Run:

```bash
node --test test/sensitive-data-gates.test.mjs test/package-artifact-gate.test.mjs
npm run verify
npm run test:consumer
node scripts/verify-package-artifact.mjs
git diff --check
```

Also run pinned staged and implementation-range Gitleaks with raw output captured and deleted. Remove the generated archive after inspection.

Commit: `security: adopt minimal sensitive data gates`

---

### Task 2: Adopt the Thin Gate in Grid Layout

**Files:**
- Modify: `AGENTS.md`, `SECURITY.md`, `package.json`, `.gitignore`
- Create: `.gitleaks.toml`, `.githooks/pre-commit`, `.githooks/pre-push`
- Create: `scripts/check-public-identities.mjs`, `scripts/verify-package-artifact.mjs`
- Modify: `.github/workflows/verify.yml`, `.github/workflows/publish.yml`
- Create: `test/security/sensitive-data-gates.test.mjs`, `test/security/package-artifact-gate.test.mjs`
- Create: `reports/2026-07-21.md`

**Interfaces:**
- Use the same reviewed raw identity and package-artifact interfaces as Task 1.
- Preserve all existing Grid Layout product tests and package behavior; no product source changes are allowed.

- [ ] **Step 1: Write and confirm failing Node tests**

Run: `node --test test/security/*.test.mjs`

Expected: FAIL because Contract v1.2, local hooks, Gitleaks, and the exact artifact gate are absent.

- [ ] **Step 2: Implement policy, shared gates, and scripts**

Copy the reviewed shared files, add `check:security`, `test:security`, `setup:hooks`, and `verify:package-artifact` scripts, and prepend `check:security` plus `test:security` to `npm run verify`. Do not change runtime dependencies or the lockfile.

- [ ] **Step 3: Replace mutable workflow actions and enforce package inspection**

Pin checkout and setup-node to reviewed immutable commits, disable persisted checkout credentials, add the redacted range scan, and change publish into verify-and-pack plus trusted stage jobs using the same exact inspected archive.

- [ ] **Step 4: Verify and commit**

Run:

```bash
node --test test/security/*.test.mjs
npm run verify
npm run test:consumer
node scripts/verify-package-artifact.mjs
git diff --check
```

Also run pinned staged and implementation-range Gitleaks with raw output captured and deleted. Remove the generated archive after inspection.

Commit: `security: adopt minimal sensitive data gates`

---

### Task 3: Adopt the Pre-Package Gate in Sortable

**Files:**
- Modify: `AGENTS.md`, `SECURITY.md`, `.gitignore`
- Create: `.gitleaks.toml`, `.githooks/pre-commit`, `.githooks/pre-push`
- Create: `.github/workflows/verify.yml`, `scripts/check-public-identities.mjs`
- Create: `test/sensitive-data-gates.test.mjs`
- Create: `reports/2026-07-21.md`

**Interfaces:**
- Use the reviewed raw identity checker, hook, config, and redacted range workflow.
- Do not add `package.json`, package artifact code, dependencies, build commands, or release workflow.

- [ ] **Step 1: Write and confirm the failing Node test**

Run: `node --test test/sensitive-data-gates.test.mjs`

Expected: FAIL because Contract v1.2 and the enforcement files are absent.

- [ ] **Step 2: Implement only the pre-package boundary**

Adopt the seven-line Contract v1.2 sensitive-data block, the reviewed Gitleaks and identity files, local staged/range hooks, and a Node 24 security workflow. Record that package inspection remains blocked until package scope exists.

- [ ] **Step 3: Verify and commit**

Run:

```bash
node --test test/sensitive-data-gates.test.mjs
node scripts/check-public-identities.mjs
git diff --check
```

Also run pinned staged and implementation-range Gitleaks with raw output captured and deleted.

Commit: `security: adopt minimal sensitive data gates`

---

### Task 4: Cross-Repository Review and Governance Cleanup

**Files:**
- Modify: Governance module template and final report as required by verified module behavior.
- Remove only after all reviews: the superseded 2026-07-21 long-form sensitive-data design and plans identified in the final review.

- [ ] **Step 1: Run each repository's whole-branch tests, identity range, Gitleaks range, diff hygiene, and status checks**

Expected: all four implementation branches pass and contain no raw scanner output or generated package archive.

- [ ] **Step 2: Compare shared files byte-for-byte**

Expected: Gitleaks rule contract and identity checker match Governance unless a documented module-specific path is required.

- [ ] **Step 3: Remove only superseded Governance long-form files and rerun all Governance checks**

Keep the concise standard, minimal design, minimal Governance plan, this module rollout plan, and historical reports.

- [ ] **Step 4: Record residual external work**

Required checks, Push Protection, workflow runs, remote integration, provider metadata, publication, and legacy-history remediation remain unverified until separately authorized and executed.
