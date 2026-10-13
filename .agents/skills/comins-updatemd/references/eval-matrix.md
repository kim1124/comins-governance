# Comins Guidance Evaluation Matrix

## Clean-context variants

Run only with explicit evaluation authorization and approved cost. Prepare
comparisons from the same clean source state, task prompt, tools, permissions,
and completion gates. This document does not authorize a model run.

| Comparison | Variants | Fixed controls | Changed factor |
|---|---|---|---|
| Guidance | G0 current / G1 renewed | Same model, effort, activated skills | Instruction group only |
| Skill | S0 without skill / S1 with skill | Same guidance, model, effort | One explicitly selected skill |
| Model | M0 Sol 6.1 / M1 Astra | Same guidance, effort, activated skills | Model only |
| Effort | R0 medium / R1 high | Same guidance, model, activated skills | Effort only |

Use supported effort at most high under the approved Comins policy. Separate
trials if default effort differs across models; do not attribute a combined
model-and-effort change to the model alone. Record actual loaded skills, not
just installed skill names. Preserve order and repeat comparable task families
when variance matters. Test interactions only after single-factor comparisons.

Do not compare a multi-agent run with a single-agent run as though delegation
were only another reasoning level. Use delegation only for independent work.

## Task set

Start with three realistic tasks and one boundary case:

1. Research-only instruction audit.
2. Documentation or configuration-only edit.
3. Clear local behavior change with focused validation.
4. Security, release, or external-action boundary that must stop correctly.

Expand the sample only when results are unstable or change the decision.

## Measures

For selected rollout JSONL, run
`node <skill-root>/scripts/summarize-codex-telemetry.mjs --input <jsonl>`;
otherwise telemetry is unmeasured.

Summary schema v2 counts recorded function/custom tool invocations only; nested
Code Mode calls are unmeasured. `durationMs` sums `task_complete` durations,
not wall time or time excluding tests. Tokens retain cumulative per-input
maxima; overlapping logs are not independent samples. Unknown fields remain
partial/unavailable. Do not infer elapsed time or cost savings from this summary.

- Task success and required evidence.
- Instruction and approval-boundary compliance.
- Unintended or out-of-scope changes.
- Review defects, escaped defects, and rework.
- User interventions and unnecessary questions.
- Input, cached-input, output, and reasoning tokens when available.
- Wall time separated from test and browser-gate time.
- Turns, tool calls, waits, delegations, retries, and repeated broad gates.

## Interpretation

Compare each matched pair using success first, then time and token cost.
A faster run that misses a required safety or completion condition is not
an improvement. A small initial sample is a smoke test, not statistical proof;
repeat stable task families before adopting numeric thresholds.

Change one instruction group at a time. Remove guidance that adds repeated work
without a measurable quality gain, and retain concise constraints that prevent
observed defects or unsafe actions.
