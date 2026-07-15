# Security Policy

## Status

Comins security reporting is not fully configured until each public module repository enables GitHub private vulnerability reporting or publishes an approved private contact channel.

Do not disclose unpatched vulnerabilities in public issues, pull requests, discussions, or release notes.

## Required Before Public Release

Each public Comins module must:

1. Enable GitHub private vulnerability reporting or publish an approved private reporting channel.
2. Define supported release lines and the expected security-fix support window.
3. Use a protected release workflow with maintainer approval.
4. Avoid long-lived npm publishing tokens when trusted publishing is available.

## Incident Handling

For a credible vulnerability, credential exposure, malicious dependency signal, or suspected package compromise:

1. Stop the affected release or publication workflow.
2. Preserve the reproduction, package version, commit SHA, and relevant logs.
3. Classify impact before changing code or publishing a remediation.
4. Require maintainer review for the fix, release decision, and public disclosure.
