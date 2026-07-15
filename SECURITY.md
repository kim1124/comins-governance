# Security Policy

## Status

GitHub private vulnerability reporting (PVR) is the required intake channel for every public Comins module repository. Each module's `SECURITY.md` must direct reporters to the repository's GitHub Security Advisories page and must not require public issue disclosure.

Do not disclose unpatched vulnerabilities in public issues, pull requests, discussions, or release notes.

## Required Before Public Release

Each public Comins module must:

1. Enable GitHub private vulnerability reporting and subscribe a maintainer to security-advisory notifications.
2. Define supported release lines and the expected security-fix support window.
3. Use a protected release workflow with maintainer approval.
4. Use GitHub Actions OIDC trusted publishing before its first public npm release and avoid long-lived npm publishing tokens.

## Disclosure and CVEs

- Treat a private vulnerability report as the source of truth while the issue is under investigation and remediation.
- Publish a GitHub repository security advisory only after the affected versions, remediation, and disclosure timing are approved by the maintainer.
- Request a CVE through the GitHub security advisory flow only when a public identifier is warranted by the impact and affected users. A CVE is not a prerequisite for receiving or fixing a report.

## Incident Handling

For a credible vulnerability, credential exposure, malicious dependency signal, or suspected package compromise:

1. Stop the affected release or publication workflow.
2. Preserve the reproduction, package version, commit SHA, and relevant logs.
3. Classify impact before changing code or publishing a remediation.
4. Require maintainer review for the fix, release decision, and public disclosure.
