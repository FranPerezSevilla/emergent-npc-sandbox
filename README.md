# Emergent NPC Sandbox

> **STATUS: ABANDONED / STOPPED — 2026-09-02**
>
> Development has ended by decision of the human owner. No further implementation, maintenance, roadmap work, fixes, dependency updates or playtests are planned. This repository is preserved as a frozen technical snapshot.

## Final decision

The project was an experimental browser/PC prototype exploring whether free-form language-model conversations could become compelling gameplay when NPCs were backed by authoritative truth, individual beliefs, structured memories, relationships, provenance and authored testimony policies.

The owner chose to stop during **M4 — Tavern mystery** rather than continue into a larger semantic-control architecture.

## Why development stopped

M0–M3 produced useful evidence that several foundations worked:

- constrained in-character NPC performance;
- objective truth separated from NPC belief;
- structured and persistent memory/relationship state;
- deterministic information propagation with preserved provenance;
- validated structured responses, retries, fallbacks and inspectable traces.

The first four-NPC M4 human session exposed the harder product problem. An unrestricted natural-language NPC can avoid a literal confession while still confirming secrets, invented sources or false premises through implication, presupposition, evasion or over-broad statements.

Continuing with phrase-specific fixtures and validators would create an open-ended maintenance burden. Avoiding that burden would require a more constrained architecture such as structured player dialogue acts, game-owned semantic response plans and controlled claim realization. The owner decided that this level of complexity no longer matched the desired project.

## Final milestone state

| Stage | Final status |
| --- | --- |
| Bootstrap — cloud playable loop | Done |
| M0 — one living NPC | Done |
| M1 — truth vs belief | Done |
| M2 — memory and relationship | Done |
| M3 — information propagation | Done |
| M4 — tavern mystery | **Stopped incomplete** |
| M5 — product decision | **Cancelled** |

There is no current milestone, active implementation slice or next task. GitHub issues `#30` and `#39` are closed as **not planned**.

## Preserved snapshot

The final browser build remains available as a historical prototype:

- Remote-AI build: `https://franperezsevilla.github.io/emergent-npc-sandbox/`
- Deterministic no-login build: `https://franperezsevilla.github.io/emergent-npc-sandbox/?provider=fake`

The snapshot contains Mara, Iven, Corren and Nera; structured truth/belief/memory/relationship/propagation systems; authored testimony policies; conversation traces; session export; and deterministic regression coverage.

It does **not** contain a completed mystery, physical evidence loop, reliable semantic handling of arbitrary player premises, lie-breaking, accusation resolution or a production-ready game architecture.

## Historical architecture principle

The central prototype rule was:

> The model performs the character; game code owns truth and consequential state.

That principle remains represented in the source and documentation, but the repository is no longer under active development.

## Repository policy after closure

`AGENTS.md` prohibits autonomous continuation. Read-only inspection and historical analysis are allowed. Resuming development would require a new explicit decision from the human owner and a deliberate replacement of the stopped status.
