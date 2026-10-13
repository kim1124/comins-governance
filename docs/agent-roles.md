# Comins agent roles

Use this guide when a Comins task needs orchestration or delegated work.
Base user and project settings remain Sol 6.1 / medium with high planning.
The role configurations in `../.codex/agents/` own the following selections.

| Role | Agent name | Model | Reasoning | Scope |
|---|---|---|---|---|
| General orchestration | `comins_orchestrator` | Astra | high | Own scope, completion, delegation and consolidated evidence |
| Multi-module design and decomposition | `comins_planner` | Astra | medium | Core/framework boundaries, shared APIs and migrations |
| Difficult design decisions | `comins_architect` | Astra | high | Compatibility, state synchronization and conflicting alternatives |
| File/document/log exploration | `comins_explorer` | Sol 6.1 | medium | Bounded read-only evidence gathering |
| Implementation and regression tests | `comins_worker` | Sol 6.1 | high | Implement an agreed, bounded change and affected tests |
| Complex implementation and root cause | `comins_debugger` | Astra | medium | Virtualization, drag, async state and type boundaries |
| Independent code review | `comins_reviewer` | Sol 6.1 | high | Read-only correctness, regressions and missing evidence |
| High-risk design and integration review | `comins_integrator` | Astra | high | Public APIs, security boundaries and conflicting worker results |

## Select and run

In the desktop app, select Astra / high for the main orchestration chat.
The agent file cannot change the model of an already running main chat.
For CLI orchestration from the target module root, run the verified local
Governance launcher:

```sh
sh <governance-root>/scripts/comins-orchestrator.sh
```

The launcher sets explicit CLI model, execution effort, and planning effort so
project Sol defaults cannot override this orchestration session. It leaves base
configuration intact and does not create a session until run by the maintainer.
The `comins_orchestrator` agent file also supports a bounded delegated
coordination task; it does not automatically become the main agent.

Choose only the roles needed for the approved task; this table is not an
eight-stage pipeline. Tests and builds stay with the assigned agent, using the
module's actual commands. A stage change does not automatically switch the
running model or effort. If a different role is needed, create that bounded
agent or explicitly switch the main session; preserve successful evidence.

## Delegation

Select the named agent, or specify both its model ID and reasoning when the host
only exposes generic spawning. Never rely on inherited parent settings for a
Comins worker. Astra uses `gpt-6-astra`; Sol 6.1 uses `gpt-6.1-sol`.
With a spawn API that requires a fresh context for model overrides, pass a
bounded brief rather than a full-history fork.

Read the [handoff contract](agent-handoff.md) once for delegated work. An already
assigned worker reads that contract, not the role catalog or installation guide.

## Local configuration and adoption

Codex discovers personal agents in `~/.codex/agents/` and project agents in
`.codex/agents/`. Keep the `comins_` names distinct from built-in roles. Install
copies of the Governance files in the personal directory for cross-repository
selection; preserve unrelated agents. Compare copies at installation/update or
after observed drift, not before every task. Record the source revision (including
a local unpublished candidate) and role-content digest in the installation record.
Custom role files set both model and effort and take precedence for those values.
They do not widen inherited permissions or authorize remote operations.

The existing `comins-reference` helper synchronizes only managed AGENTS and base
configuration. It does not distribute role files. Publishing this Contract and
adopting it in module AGENTS remain separate changes. A verified local role
installation is not a claim that a module adopted the new Contract.

Checked 2026-10-12 against OpenAI's [subagent configuration](https://developers.openai.com/codex/multi-agent).
No model inference or paid quality comparison is required for configuration
validation, and these selections do not establish comparative performance.
