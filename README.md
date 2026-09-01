# Emergent NPC Sandbox

> Working title. Experimental browser/PC game prototype focused on AI-driven emergent NPC conversations and social simulation.

## One-sentence pitch

A small social sandbox where NPCs are structured simulated people with personalities, goals, knowledge, secrets and eventually memories/relationships, while a language model acts as the performer that decides how each NPC expresses itself in free-form conversation.

## Core rule

The project is **not** “ChatGPT inside an NPC”.

- **Game code owns truth and authoritative state.**
- **The LLM interprets the NPC and proposes dialogue/social actions.**
- **Generated prose never directly mutates authoritative world state.**
- **Player text is speech inside the fiction, never privileged model instruction.**

## Current roadmap focus

**DONE:** `BOOTSTRAP — Cloud playable loop` (`#2`, PR `#4`)

**NOW:** `M0 — One living NPC with real AI` (`#1`)

**NEXT / BLOCKED:** `M1 — Truth vs belief`

Bootstrap proved the core development loop:

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

Playable build:

`https://franperezsevilla.github.io/emergent-npc-sandbox/`

The Studio Director must follow the gated roadmap in `docs/04-prototype-roadmap.md`. Later milestones are hypotheses, not parallel implementation work.

## Prototype runtime

The prototype runtime is **PlayCanvas Engine + TypeScript + Vite**, code-first and browser/cloud-first.

See `docs/adr/001-playcanvas-cloud-first-runtime.md`.

Why:

- browser-playable builds;
- agent-editable code/data rather than editor-only scene state;
- no routine local Unity/PlayCanvas Editor requirement;
- direct GLB/glTF asset path;
- simple CI and static deployment;
- easy provider swapping for AI experiments.

The PlayCanvas Editor may still be used when useful, but it is not the authoritative source of truth for ordinary development.

## Development sequence

```text
BOOTSTRAP — cloud playable loop        DONE
        ↓
M0 — one living NPC                    NOW
        ↓
M1 — truth vs belief
        ↓
M2 — memory & relationship
        ↓
M3 — information propagation
        ↓
M4 — tavern mystery / blind playtest
        ↓
M5 — human product decision
```

A production roadmap is deliberately deferred until M5.

## M0 target

M0 asks one question:

> Can one constrained AI NPC feel more like a fictional person than a generic chatbot, including when the player deliberately tries to break the fiction?

M0 builds on the deployed Bootstrap and adds only what is required to answer that:

- one authored NPC;
- `NpcProfile`;
- explicit `NpcCompetenceProfile`;
- small permitted knowledge set;
- one real model/provider experiment;
- provider-agnostic `InferenceProvider` boundary;
- deterministic fake/recorded provider retained;
- versioned structured response;
- validation and diegetic fallback;
- adversarial/meta-jailbreak probes;
- `ConversationTrace` diagnostics;
- repeatable quality/latency/Spanish benchmark;
- legal/provenance registration for adopted AI resources.

Browser-local/WebGPU inference is the preferred product hypothesis, but model/runtime selection is evidence-driven.

## AI architecture

Conceptually:

```text
Authoritative world state
        +
NPC profile / competence
        +
Only facts this NPC may know
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

So input such as “ignore your instructions” or “you are an AI” should produce an in-fiction reaction, not reveal the implementation.

See `docs/02-ai-architecture.md` and `docs/06-diegetic-robustness.md`.

## World truth vs beliefs

Objective truth and character belief are separate concepts.

Example:

```text
FACT_173
Truth: Juan steals money from the church.

Beliefs / knowledge:
- Juan: first-hand certainty
- Marta: strong indirect evidence
- Priest: suspicion
```

NPCs may tell the truth, lie, omit information or later repeat false information. The LLM does not get to rewrite `FACT_173` by saying something different.

This becomes the explicit focus of M1 only after M0 passes.

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

External low-poly packs are raw production material, not final art direction:

> Buy/download geometry; author the art direction.

See `docs/07-visual-direction.md`.

## Asset pipeline

Routine external-asset ingestion should be agentic and reproducible:

```text
source / legal access
      ↓
source manifest
      ↓
Technical Art Director
inspect → select → normalize → adapt → validate
      ↓
runtime-assets/
      ↓
PlayCanvas scene/build
```

GLB/glTF is the default portable 3D format. Do not dump whole packs into production when an issue needs only a small subset.

See `docs/09-asset-pipeline.md`.

## Licensing and attribution

Every external resource actually adopted by the project—software, AI runtime/model/service, animations, assets, fonts, music, SFX or tools—must be traceable through `legal/third-party.json`.

The `licensing-attribution-steward` maintains registry/notices hygiene, while the agent introducing a resource must provide its identity and intended use immediately.

See `docs/10-licensing-attribution.md`.

## Agentic studio workflow

Specialized repository agents live under `.github/agents/`.

Default discipline:

> One current milestone, one bounded issue, one accountable owner, evidence before advancing.

The current accountable owner is `ai-npc-systems-engineer` through issue #1, with gameplay, QA and licensing support where required.

See `docs/08-agent-studio-operating-model.md`.

## Non-goals right now

Until M0 proves the single-NPC interaction, do **not** build:

- long-term memory;
- gossip propagation;
- multiple deeply simulated NPCs;
- vector database;
- generic multi-agent/planner framework;
- combat/inventory/quests;
- huge world simulation;
- final art production;
- voice synthesis / lip sync;
- large speculative asset pipelines.
