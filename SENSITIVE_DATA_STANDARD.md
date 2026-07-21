# Comins Sensitive Data Standard

## Scope

- This standard covers tracked source, fixtures, allowlists, reports, plans, commit metadata, CI output, and release artifacts in every Comins repository.
- It governs current changes and releases; legacy history and provider-side remediation require a separate audit.

## Prohibited

- Never store personal names, personal email addresses, local account paths, credentials, API keys, access tokens, secrets, or value-derived fingerprints.
- Never expose detector author, email, match, fingerprint, or sensitive path values in user-visible output.
- Do not use `.gitleaksignore` or inline `gitleaks:allow` suppressions.
- Do not implement custom parsers for Git objects, revisions, annotated tags, tar or PAX headers, checksums, provider tokens, or binary formats.

## Allowed

- Allow only these non-sensitive values: public handle, GitHub noreply identity, service identity, explicit placeholder, and repository-relative path.
- Assemble synthetic detector fixture values only at test runtime and do not retain the assembled values.

## Required Gates

- Before the first commit, install and run the repository's local Gitleaks hook.
- Before the first pull request, make Gitleaks security CI a required check.
- Before the first public release, create exactly one artifact with `npm pack --json --ignore-scripts`, compare its returned package file list with the `package.json#files` allow-list, extract that artifact, and scan the extracted directory with Gitleaks.
- Fail closed when a required scanner or gate is unavailable.

## Safe Output

- Capture and discard Gitleaks stdout and stderr.
- Redact retained evidence and expose only a constant, value-free failure message without author, email, match, fingerprint, or sensitive path values.

## Exceptions

- A maintainer may approve an allowed public identity, but may not exempt a prohibited private value or bypass a required gate.
- Record policy exceptions without recording the sensitive value.

## Incident Response

- Stop the affected release, rotate exposed credentials, preserve only redacted evidence, and coordinate remediation privately without public disclosure.
- Audit legacy history and provider surfaces separately from current-change enforcement.

## Residual Risks

- Current-change and package gates do not prove that legacy history, cached objects, registry metadata, or public profiles are clean.
- This standard does not add an enforcement-history baseline; legacy remediation remains a separate audit.
