# Emergent NPC Sandbox

> Working title. Experimental browser/PC game prototype focused on AI-driven emergent NPC conversations and social simulation.

## One-sentence pitch

A small social sandbox where NPCs are structured simulated people with personalities, goals, knowledge, beliefs, secrets and eventually memories/relationships, while a language model acts as the performer that decides how each NPC expresses itself in free-form conversation.

## Core rule

The project is **not** “ChatGPT inside an NPC”.

- **Game code owns truth and authoritative state.**
- **NPCs own beliefs/knowledge assigned by the simulation.**
- **The LLM interprets the NPC and proposes dialogue/social actions.**
- **Generated prose never directly mutates authoritative world state.**
- **Player text is speech inside the fiction, never privileged model instruction.**

## Current roadmap focus

**DONE:** `BOOTSTRAP — Cloud playable loop` (`#2`, PR `#4`)

**DONE:** `M0 — One living NPC with real AI` (`#1`)

M0 evidence includes the remote inference experiment `#8`, final QA `#13`, deterministic validation and a human character-quality PASS on 2026-09-02.

**NOW:** `M1 — Truth vs belief` (`#14`)

**NEXT / BLOCKED:** `M2 — Memory & relationship`

Playable build:

`https://franperezsevilla.github.io/emergent-npc-sandbox/`

The Studio Director must follow the gated roadmap in `docs/04-prototype-roadmap.md`. Later milestones are hypotheses, not a parallel implementation backlog.

## Development sequence

```text
BOOTSTRAP — cloud playable loop        DONE
        ↓
M0 — one living NPC                    DONE
        ↓
M1 — truth vs belief                   NOW
        ↓
M2 — memory & relationship             NEXT / BLOCKED
        ↓
M3 — information propagation
        ↓
M4 — tavern mystery / blind playtest
        ↓
M5 — human product decision
```

A production roadmap is deliberately deferred until M5.

## What M0 proved

One constrained real-AI NPC can be good enough to continue building the social simulation.

Mara passed:

- normal free-form Spanish conversation;
- AI/ChatGPT identity attacks;
- prompt injection;
- runtime/model/token probing;
- competence boundaries for advanced math and programming;
- legitimate tavern arithmetic and local knowledge;
- direct and jailbreak-style attempts to extract an inaccessible secret;
- validation/retry/fallback behavior;
- `ConversationTrace` diagnosis of real provider failures.

One benchmark flag (`answered-programming`) was a false positive: Mara explicitly refused the programming request and emitted no code. This is recorded as a benchmark-heuristic issue, not an M0 failure.

Browser-local WebGPU inference was tested and failed the real hardware/runtime gate through load, shader compatibility and browser stability problems. The current prototype uses a remote Puter/Luna provider behind the same provider-agnostic `InferenceProvider` boundary. That is an experimental baseline, **not a final production-provider commitment**.

## M1 target — truth vs belief

M1 asks:

> Can two NPCs sincerely disagree in free-form conversation for deterministic, inspectable reasons while objective truth remains stable and outside the model's control?

The smallest experiment introduces:

- authoritative `WorldFact` data;
- NPC-owned `Belief` data;
- provenance/confidence;
- context filtering so each NPC receives only its own beliefs;
- a second NPC with contradictory testimony;
- debug visibility into truth vs each NPC belief;
- `ConversationTrace` evidence of which beliefs were supplied.

The LLM may phrase testimony, but it may not create truth or silently grant knowledge.

See issue `#14` for the exact gate and scope.

## Prototype runtime

The runtime is **PlayCanvas Engine + TypeScript + Vite**, code-first and browser/cloud-first.

Routine flow:

```text
agent/repo change
      ↓
CI checks + build
      ↓
merge to main
      ↓
GitHub Pages
      ↓
human browser playtest
```

The PlayCanvas Editor may be used when helpful, but it is not the authoritative source of truth for routine development.

See `docs/adr/001-playcanvas-cloud-first-runtime.md`.

## AI architecture

Conceptually:

```text
Authoritative world truth
        +
NPC profile / competence
        +
NPC-specific beliefs / permitted knowledge
        +
Relevant current context
        +
Player utterance (untrusted speech)
              ↓
       InferenceProvider
              ↓
     Structured proposal
              ↓
 Validation / leakage checks
              ↓
Allowed game effects + dialogue
```

The model is the **actor**, not the simulation authority.

Important robustness rule:

> Out-of-world, adversarial or nonsensical player input is interpreted from inside the NPC's worldview, never answered from the underlying model's worldview.

See `docs/02-ai-architecture.md` and `docs/06-diegetic-robustness.md`.

## World truth vs beliefs

Objective truth and character belief are separate concepts.

Example:

```text
FACT_173
Truth: Juan steals money from the church.

Beliefs:
- Juan: first-hand certainty
- Marta: strong indirect evidence
- Priest: suspicion
```

NPCs may tell the truth, be mistaken, omit information or eventually lie. None of those utterances rewrite `FACT_173`.

M1 now makes this distinction executable and inspectable.

## Prototype product direction

The project has not committed to the final game yet. Promising outcomes include:

1. investigation / mystery;
2. broader social RPG;
3. pure social sandbox.

Investigation remains the strongest prototype framing because free-form conversation itself becomes gameplay.

## Visual direction

Preferred target: **first-person gothic-expressionist low-poly** — melancholic, theatrical and slightly uncanny rather than generic bright medieval low-poly.

Principles:

- tall, narrow, subtly crooked architecture;
- exaggerated roofs/chimneys/windows;
- strong silhouettes before surface detail;
- cold/desaturated exteriors and warmer intimate interiors;
- skeletal/graphic vegetation;
- recognizable NPC heads, bodies and postures;
- body/head gesture vocabulary before complex facial rigs;
- simple materials with art-directed lighting.

See `docs/07-visual-direction.md`.

## Licensing and attribution

Every external resource actually adopted by the project—software, AI runtime/model/service, animations, assets, fonts, music, SFX or tools—must be traceable through `legal/third-party.json`.

The `licensing-attribution-steward` maintains registry/notices hygiene, while the agent introducing a resource must provide its identity and intended use immediately.

See `docs/10-licensing-attribution.md`.

## Agentic studio workflow

Specialized repository agents live under `.github/agents/`.

Default discipline:

> One current milestone, one bounded issue, one accountable owner, evidence before advancing.

Current accountable owner: `ai-npc-systems-engineer` through **#14 — M1 Truth vs belief**.

See `docs/08-agent-studio-operating-model.md`.

## Non-goals right now

Until M1 passes, do **not** build:

- long-term episodic memory;
- relationship systems beyond any tiny M1 need;
- NPC-to-NPC gossip/information propagation;
- automatic belief updating from every conversation;
- vector database / town-scale knowledge graph;
- generic multi-agent/planner framework;
- combat/inventory/quests;
- huge world simulation;
- final art production;
- voice synthesis / lip sync;
- M2/M3 systems in parallel.
