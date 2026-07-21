# Comins Minimal Sensitive-Data Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt Contract v1.2 with a short common policy and enforce new changes through Gitleaks plus one small public-Git-identity checker.

**Architecture:** Governance owns policy, templates, a Gitleaks configuration, and CI wiring. Gitleaks handles content and history scanning; repository-owned code only validates public Git identities from stable `git config` or `git log --format` output.

**Tech Stack:** Markdown, Node.js 24 built-ins, Git, Gitleaks 8.30.1, GitHub Actions.

## Global Constraints

- Keep `SENSITIVE_DATA_STANDARD.md` at 120 lines or fewer and the module-template privacy block at 15 lines or fewer.
- Do not create an npm project or add production or development dependencies.
- Do not implement a Git object, revision, annotated-tag, tar, PAX, checksum, provider-token, or binary parser.
- Do not add an enforcement-history baseline; legacy remediation remains a separate audit.
- Do not store actual personal names, personal email addresses, local account paths, credentials, tokens, secrets, or value-derived fingerprints in source, fixtures, allowlists, reports, or plans.
- Assemble synthetic detector values only at test runtime.
- Capture and discard Gitleaks stdout and stderr; user-visible failures must be constant and must not expose author, email, match, fingerprint, or sensitive path values.
- Do not use `.gitleaksignore` or `gitleaks:allow` suppressions.
- Do not push, open a PR, change repository settings, publish, or perform any other external write.
- Do not remove the superseded long-form design and plans until all four clean implementation branches pass final review.

---

### Task 1: Adopt the Concise Contract v1.2 Policy

**Files:**
- Modify: `AGENTS.md`
- Modify: `COMINS_CONTRACT.md`
- Create: `SENSITIVE_DATA_STANDARD.md`
- Modify: `MODULE_CHECKLIST.md`
- Modify: `SECURITY.md`
- Modify: `RELEASE_POLICY.md`
- Modify: `templates/module/AGENTS.md`
- Modify: `CHANGELOG.md`
- Create: `test/policy-contract.test.mjs`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-21-comins-sensitive-data-minimal-design.md`.
- Produces: Contract v1.2 policy text and a module template adopted by later repository plans.

- [ ] **Step 1: Write the failing policy-conformance test**

Create `test/policy-contract.test.mjs` with Node's built-in test runner. It must read the eight active policy surfaces and assert all of the following:

```js
assert.match(contract, /^# Comins Contract v1\.2$/m);
assert.ok(standard.split("\n").length <= 120);
for (const term of ["personal email", "API key", "Gitleaks", "npm pack", "redact", "fail closed"]) {
  assert.match(standard, new RegExp(term, "i"));
}
assert.match(moduleAgents, /Contract v1\.2/);
assert.match(moduleAgents, /Never track personal names, personal email addresses/);
assert.doesNotMatch(`${contract}\n${standard}`, /security-audit|Git object parser|tar header parser/i);
assert.equal(existsSync(join(root, "package.json")), false);
```

Also assert that the checklist requires local hook setup before the first commit, required security CI before the first PR, and exact package-artifact inspection before the first public release.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test test/policy-contract.test.mjs`

Expected: FAIL because Contract v1.1 is active and the standard does not exist.

- [ ] **Step 3: Implement only the concise policy surfaces**

Use these exact section responsibilities:

- `COMINS_CONTRACT.md`: retain the existing independent-repository, package, consumer-neutrality, and quality rules; add one `Sensitive Data` section covering prohibited values, approved public identities, Gitleaks/CI/package gates, redacted output, and separate legacy remediation.
- `SENSITIVE_DATA_STANDARD.md`: `Scope`, `Prohibited`, `Allowed`, `Required Gates`, `Safe Output`, `Exceptions`, `Incident Response`, and `Residual Risks`; no implementation algorithms.
- `AGENTS.md` and `templates/module/AGENTS.md`: add the same short operational rule block and Contract v1.2 adoption.
- `MODULE_CHECKLIST.md`: first-commit hook, first-PR CI, and first-release exact artifact gates.
- `SECURITY.md`: credential/PII incident response must stop release and rotate credentials without public disclosure.
- `RELEASE_POLICY.md`: require `package.json#files`, one exact `npm pack --json --ignore-scripts` artifact, extracted-directory Gitleaks scan, and privacy-safe publisher metadata.
- `CHANGELOG.md`: add the v1.2 adoption entry and require separate module adoption.

- [ ] **Step 4: Run policy validation**

Run:

```bash
node --test test/policy-contract.test.mjs
git diff --check
```

Expected: policy test passes; no whitespace errors.

- [ ] **Step 5: Commit Task 1**

```bash
git add AGENTS.md COMINS_CONTRACT.md SENSITIVE_DATA_STANDARD.md MODULE_CHECKLIST.md SECURITY.md RELEASE_POLICY.md templates/module/AGENTS.md CHANGELOG.md test/policy-contract.test.mjs
git commit -m "docs: adopt minimal Comins contract v1.2"
```

---

### Task 2: Add Thin Identity and Gitleaks Enforcement

**Files:**
- Create: `.gitleaks.toml`
- Create: `.githooks/pre-commit`
- Create: `.github/workflows/verify.yml`
- Create: `scripts/check-public-identities.mjs`
- Create: `test/public-identities.test.mjs`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: zero or two positional arguments: no arguments checks local `user.name` and `user.email`; `<base-sha> <head-sha>` checks commits returned by `git log --format` for that range.
- Produces: exit `0` for public GitHub noreply/service identities; exit `1` with exactly `public-identity-check: failed\n` on invalid input, Git errors, or non-public identities.

- [ ] **Step 1: Write failing identity tests**

Create temporary Git repositories with `node:test`, assemble every email at runtime, and cover these exact assertions:

- a public handle whose name matches the handle encoded in a GitHub noreply address exits `0` with empty stderr;
- a synthetic non-public local name and reserved-domain address exits `1`, writes exactly `public-identity-check: failed\n`, and does not echo either value;
- an explicit ancestor-to-head SHA range containing one safe commit and one synthetic unsafe-identity commit exits `1` with the same constant stderr;
- malformed SHA input, a missing object, and a base that is not an ancestor of head each exit `1` with the same constant stderr.

The test file must not contain a complete personal email literal; join the local part, `@`, and reserved test domain at runtime.

- [ ] **Step 2: Confirm RED**

Run: `node --test test/public-identities.test.mjs`

Expected: FAIL because `scripts/check-public-identities.mjs` does not exist.

- [ ] **Step 3: Implement the narrow identity checker**

The checker must:

- call Git only with `execFileSync` argument arrays;
- accept only 40- or 64-character lowercase hexadecimal SHAs for range mode;
- require `base` to be an ancestor of `head`;
- obtain four NUL-delimited fields per commit with `%aN%x00%aE%x00%cN%x00%cE%x00`;
- allow GitHub noreply handles when the name matches the encoded public handle, plus GitHub Actions and Dependabot service identities;
- never print Git output or caught error details;
- contain no file-content, Git-object, tag, archive, or secret-pattern scanning.

- [ ] **Step 4: Add the minimal Gitleaks configuration**

Create `.gitleaks.toml` with `minVersion = "v8.30.1"`, `[extend] useDefault = true`, and four Comins rules:

- non-placeholder email with rule allowlists limited to GitHub noreply and reserved example domains;
- `/Users/<account>/` and `/home/<account>/` paths with neutral placeholder and CI-runner allowlists;
- Korean mobile/identity-number shapes;
- sensitive credential filenames through a standalone `path` rule.

Do not add global allowlists, commit allowlists, fingerprints, or inline suppression instructions.

- [ ] **Step 5: Add the local hook and required workflow**

The pre-commit hook must run the identity checker, require `gitleaks version` to report exactly `8.30.1`, execute official staged mode, capture output in `mktemp`, delete it with `trap`, and print only `sensitive-data-check: failed` on failure.

The workflow must:

- use full-history credential-free checkout and Node 24 actions pinned by commit SHA;
- validate PR/push base and head through the identity checker;
- download only `gitleaks_8.30.1_linux_x64.tar.gz` and verify SHA-256 `551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb` before extraction;
- run Gitleaks on `base..head` with `--redact --ignore-gitleaks-allow --no-banner --no-color --log-level error`;
- capture and delete raw output without uploading it;
- run both Node test files and `git diff --check` equivalent validation.

Add `.local/`, `.gitleaks-output/`, and local downloaded binaries to `.gitignore`; do not ignore `.gitleaks.toml`.

- [ ] **Step 6: Run focused and integrated validation**

Run:

```bash
node --test test/*.test.mjs
node scripts/check-public-identities.mjs
git diff --check
```

Then download the pinned Linux or Darwin asset for the current platform, verify its documented checksum, and run the config against the working directory and `HEAD~1..HEAD` with all raw output captured to a temporary file.

Expected: tests and identity check pass; Gitleaks exits `0`; temporary raw output is deleted.

- [ ] **Step 7: Commit Task 2**

```bash
git add .gitignore .gitleaks.toml .githooks/pre-commit .github/workflows/verify.yml scripts/check-public-identities.mjs test/public-identities.test.mjs
git commit -m "ci: enforce minimal sensitive data gates"
```

---

### Task 3: Verify Governance Handoff

**Files:**
- Create: `reports/2026-07-21-minimal-sensitive-data-governance.md`

**Interfaces:**
- Consumes: Task 1 policy and Task 2 enforcement.
- Produces: verification evidence and exact module-adoption inputs; no code or scanner expansion.

- [ ] **Step 1: Run the complete local gate**

Run:

```bash
node --test test/*.test.mjs
node scripts/check-public-identities.mjs
git diff --check
git status --short
```

Run the pinned Gitleaks `dir` and `git` scans through the same capture-and-discard boundary used by CI.

Expected: all checks pass, no raw finding output is retained, and the worktree is clean before the report commit.

- [ ] **Step 2: Record the handoff report**

Record the timestamp, changed files, exact commands and results, current Contract version, module-adoption order, and these residual items:

- remote Push Protection, required-check, and workflow execution are not changed locally;
- legacy public history and provider metadata remain separate remediation;
- superseded long-form design/plan files remain until all module branches pass final review.

- [ ] **Step 3: Commit the report**

```bash
git add reports/2026-07-21-minimal-sensitive-data-governance.md
git commit -m "docs: record minimal governance verification"
```

- [ ] **Step 4: Handoff to module plans**

Provide module implementers only the Contract v1.2 policy, `.gitleaks.toml` rule contract, identity-checker interface, CI redaction boundary, and repository-specific package requirements. Do not copy this entire plan or add a shared runtime package.

The final cross-repository cleanup removes the superseded long-form design/plans and abandoned worktrees only after Governance, Data Table, Grid Layout, and Sortable each pass task review and one whole-branch review.
