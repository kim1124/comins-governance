# Security Policy

GitHub private vulnerability reporting (PVR) is the required intake channel for every public Comins module repository. Each module's `SECURITY.md` must direct reporters to the repository's GitHub Security Advisories page and must not require public issue disclosure.

Do not disclose unpatched vulnerabilities in public issues, pull requests, discussions, or release notes.

## Required Before Public Release

- Enable PVR, security-advisory notifications, supported release lines, and the expected security-fix support window.
- Publish a brand-new package interactively with maintainer 2FA and no automation token because npm cannot register trusted or staged publishing before the package exists.
- After bootstrap, use a protected GitHub Actions workflow with OIDC trusted publishing restricted to `npm stage publish`; require maintainer 2FA approval and disallow token publishing.

## Disclosure and CVEs

- Treat a private report as the source of truth while remediation is in progress; publish a repository advisory only after affected versions, remediation, and timing are approved.
- Request a CVE through the GitHub advisory flow only when impact and affected users warrant a public identifier; it is not required to receive or fix a report.

## Incident Handling

For a credible vulnerability, credential exposure, malicious dependency signal, or suspected package compromise:

- Stop the affected release or publication workflow and preserve the reproduction, package version, commit SHA, and relevant logs.
- Classify impact before remediation and require maintainer review for the fix, release decision, and disclosure.
