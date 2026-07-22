# Comins Guidance Evaluation Matrix

## Clean-context variants

Run representative tasks from the same clean repository state and prompt.

| Variant | Guidance | Model and reasoning | Purpose |
|---|---|---|---|
| A | Current, without skill | Current fixed baseline | Control |
| B | Renewed, with skill | Same as A | Isolate guidance effect |
| C | Current | Alternative reasoning effort | Isolate reasoning effect |
| D | Renewed | Same alternative as C | Interaction check |

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

- Task success and required evidence.
- Instruction and approval-boundary compliance.
- Unintended or out-of-scope changes.
- Review defects, escaped defects, and rework.
- User interventions and unnecessary questions.
- Input, cached-input, output, and reasoning tokens when available.
- Wall time separated from test and browser-gate time.
- Turns, tool calls, waits, delegations, retries, and repeated broad gates.

## Interpretation

Compare with skill versus without skill using success first, then time and token
cost. A faster run that misses a required safety or completion condition is not
an improvement. A small initial sample is a smoke test, not statistical proof;
repeat stable task families before adopting numeric thresholds.

Change one instruction group at a time. Remove guidance that adds repeated work
without a measurable quality gain, and retain concise constraints that prevent
observed defects or unsafe actions.
