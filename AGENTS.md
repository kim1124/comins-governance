# Comins Governance AGENTS.md

## Scope

- Governance owns shared Comins policy and module-guidance distribution.
- `COMINS_CONTRACT.md` is the only common execution-policy source. Read it
  before changing shared policy; do not restate its rules in this file,
  `README.md`, or the module template.
- Keep product behavior, commands, tests, and enforcement implementations in
  each independent module.

## Routing

- Read `OSS_LICENSE_POLICY.md`, `SENSITIVE_DATA_STANDARD.md`, and
  `RELEASE_POLICY.md` only when the Contract triggers that stage.
- Adopt a Contract revision through a separate module change. A Governance
  change does not modify or verify module products automatically.

## Verification

- Run `git diff --check` plus only the reference, contract, script, skill, or
  configuration checks affected by the Governance change.
- Do not run independent module product gates for a Governance-only change.
