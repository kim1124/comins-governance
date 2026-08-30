---
name: security-scan
description: "Use for Comins security review routing: run a Codex Security diff scan for security-sensitive changes, a Standard scan for an explicit repository baseline, or a Deep scan only when explicitly requested. Do not use for routine documentation, style, or test-only changes, or as a replacement for deterministic security gates."
---

# Comins Security Scan

Use the smallest Codex Security scan that matches the authorized Comins
security stage. This skill owns scan admission and routing, not the underlying
scanner implementation.

## Boundaries

- Scan only code the user owns or is authorized to assess.
- Resolve the independent Git root, exact branch or revision, requested scope,
  and dirty state before starting. Do not silently include unrelated changes.
- Keep scans read-only by default. A scan does not authorize code changes,
  dependency updates, issue or advisory creation, uploads, commits, pushes,
  releases, or configuration changes.
- Use the installed Codex Security plugin for actual scans. If its required
  skill or tool is unavailable, report the blocker instead of simulating a
  scan or weakening the workflow.
- This skill refines only the Comins security stage. It does not add or repeat
  license, common-policy, module, browser, performance, Git, or release stages.

## Admission

An explicit `$security-scan` request authorizes one read-only scan in the mode
selected below. Without explicit invocation, use this skill only when the
requested review includes a security-sensitive surface such as:

- runtime dependencies or package execution boundaries;
- untrusted input, HTML rendering, URL handling, parsing, serialization,
  clipboard, file import or export;
- network access, remote assets, telemetry, persistence, authentication,
  authorization, credentials, or secrets;
- GitHub Actions permissions, release credentials, package publication, or
  another supply-chain boundary.

Do not start Codex Security for routine documentation, CSS-only, snapshot,
test-description, report, or version-string changes unless the user explicitly
requests a scan.

## Preserve Deterministic Gates

Codex Security supplements Gitleaks, public-identity and personal-data checks,
dependency auditing, Dependabot, CodeQL, license checks, and module-owned
tests. Reuse current successful evidence and rerun only missing, failed, or
diff-affected deterministic checks. Never claim a repository is secure from an
AI-assisted scan alone.

## Choose One Mode

1. **Diff scan — default for a change:** For a pull request, commit, branch
   range, or working-tree patch, load and follow
   `$codex-security:security-diff-scan`. Preserve the exact target and baseline
   for the entire scan.
2. **Standard scan — explicit baseline:** For an explicitly requested whole
   repository or scoped-folder audit with no diff, load and follow
   `$codex-security:security-scan`. Prefer a reviewed stable revision or release
   candidate. Do not repeat Standard scans on every pull request.
3. **Deep scan — explicit quality-first work:** Use only when the user asks for
   a deep, exhaustive, or multi-pass scan, then load and follow
   `$codex-security:deep-security-scan`. Before starting, disclose that it runs
   repeated Standard scans and may consume substantially more time, memory,
   and tokens. Do not infer Deep mode from general words such as thorough or
   final.

When the target or baseline is materially ambiguous, stop before starting the
scan and obtain the missing choice. Do not widen a scoped request.

## Execution And Reporting

- Start one scan and let its canonical phases finish. Preserve its scan ID,
  completed phases, and artifacts across interruptions; do not restart the
  workflow or repeat successful phases after a failure.
- Treat unvalidated candidates as deferred evidence, not confirmed findings.
- Report the exact target and revision, validated findings, coverage and
  exclusions, proof gaps or deferred work, artifact paths, and measured usage
  when available. Do not estimate unavailable usage.
- Redact credentials, personal data, detector matches, fingerprints, and local
  account details from user-visible output.
- Fixing a finding or tracking it in GitHub, Linear, Jira, or an advisory is a
  separate workflow requiring a new explicit request and the applicable
  approval immediately before any write.
