# Comins Guidance Audit Rubric

## Instruction layers

Inspect each layer independently before attributing cost:

| Layer | Inspect | Typical finding |
|---|---|---|
| Direct context | Global, root, and applicable path-local instructions | Duplicate clauses, conflict, model prose |
| Conditional context | Activated skills and references | Over-broad trigger, skill leakage, deep references |
| Process chain | Research, design, plan, TDD, review, completion | Mandatory steps unrelated to risk |
| Tool loop | Repeated reads, searches, subagents, retries | Blind pre-read or unchanged retry |
| Validation | Focused, baseline, browser, performance, release gates | Verification leakage or repeated broad gate |
| Reasoning | Configured model and effort | Latency incorrectly blamed on prompt size |

## Finding classes

- **Duplication:** the same policy or approval boundary appears in more than one
  active owner.
- **Conflict:** two applicable instructions require incompatible behavior.
- **Blind pre-read:** a rule loads documents or all nested instructions without
  a task or path predicate.
- **Skill leakage:** specialized or rare workflow detail is always loaded.
- **Process leakage:** research, design, plan, TDD, or multi-review is required
  for work whose risk does not justify it.
- **Verification leakage:** product, browser, performance, security, or release
  gates run for an unrelated change class.
- **Stale guidance:** a live rule points to an obsolete model, path, command, or
  completed historical artifact.
- **Module-local defect:** a finding belongs to one independent module and must
  not be fixed by Governance synchronization.

## Admission rule

Keep a common always-loaded rule only when it is an invariant across at least
two Comins modules or a universal safety and approval boundary. Put module API,
performance, browser, and command details in module guidance. Put rare repeatable
workflows in a skill and deterministic mechanics in scripts or CI.

Do not optimize to a line-count target. Record bytes and effective chain size,
then change only measured duplication, conflict, unconditional work, or stale
routing. A shorter instruction set is not better if it removes a required safety
or completion constraint.

## Development-flow decision

| Risk | Default route |
|---|---|
| Inspection or research | Inspect and report only |
| Documentation or deterministic configuration | Direct edit and type-specific checks |
| Clear local behavior or defect | Acceptance or reproduction, valuable focused test, implementation, baseline once |
| Public API, cross-module, performance, or migration | Research unknowns, close decisions, design or plan, incremental tests, broad gate once |
| Security, release, external, or destructive | Canonical policy, explicit approval, rollback and exact-stage evidence |

Use regression-test-first for reproducible defects, deterministic logic, public
contracts, and characterization before risky refactors when it materially
improves confidence. Use type-appropriate validation for documentation,
generated files, exploratory prototypes, and pure configuration.
