# Emergent NPC Sandbox

> Working title. Experimental browser/PC game prototype focused on AI-driven emergent NPC conversations and social simulation.

## One-sentence pitch

A small social sandbox where NPCs are structured simulated people with personalities, goals, knowledge, beliefs, secrets, memories and relationships, while a language model acts as the performer that decides how each NPC expresses itself in free-form conversation.

## Core rule

The project is **not** “ChatGPT inside an NPC”.

- **Game code owns truth and authoritative state.**
- **NPCs own beliefs/knowledge assigned by the simulation.**
- **Memories and relationships are structured game state.**
- **The LLM interprets the NPC and proposes dialogue/social actions.**
- **Generated prose never directly mutates authoritative world state.**
- **Player text is speech inside the fiction, never privileged model instruction.**

## Current roadmap focus

**DONE:** `BOOTSTRAP — Cloud playable loop` (`#2`, PR `#4`)

**DONE:** `M0 — One living NPC with real AI` (`#1`)

**DONE:** `M1 — Truth vs belief` (`#14`)

**DONE:** `M2 — Memory & relationship` (`#19`, PR `#20`)

M2 evidence includes structured `NpcMemory`, `RelationshipState.trust`, relevance selection, per-NPC isolation, trace evidence, reload persistence without transcript persistence, deterministic tests and a human browser PASS on 2026-09-02.

**NOW:** `M3 — Information propagation` (`#21`)

**NEXT / BLOCKED:** `M4 — Tavern mystery`

Playable build:

`https://franperezsevilla.github.io/emergent-npc-sandbox/`

The Studio Director must follow the gated roadmap in `docs/04-prototype-roadmap.md`. Later milestones are hypotheses, not a parallel implementation backlog.

## Development sequence

```text
BOOTSTRAP — cloud playable loop        DONE
        ↓
M0 — one living NPC                    DONE
        ↓
M1 — truth vs belief                   DONE
        ↓
M2 — memory & relationship             DONE
        ↓
M3 — information propagation           NOW
        ↓
M4 — tavern mystery / blind playtest   NEXT / BLOCKED
        ↓
M5 — human product decision
```

A production roadmap is deliberately deferred until M5.

## What M0 proved

One constrained real-AI NPC can be good enough to continue building the social simulation.

Mara passed normal free-form Spanish conversation, AI/ChatGPT identity attacks, prompt injection, runtime/model probing, competence boundaries, legitimate local arithmetic/knowledge, inaccessible-secret extraction attempts, validation/retry/fallback behavior and trace diagnosis.

Browser-local WebGPU inference failed the real hardware/runtime gate. The current prototype remote path is **OpenRouter OAuth PKCE + `minimax/minimax-m3:free`** behind the provider-agnostic `InferenceProvider` boundary. No developer API key is embedded in the public Pages build. This is a prototype inference path, not a final production-provider commitment.

## What M1 proved — truth vs belief

M1 answered:

> Can two NPCs sincerely disagree in free-form conversation for deterministic, inspectable reasons while objective truth remains stable and outside the model's control?

**Yes.**

The executable M1 slice includes authoritative `WorldFact`, NPC-owned `Belief`, provenance/confidence, per-NPC context filtering, Mara/Iven contradictory testimony, debug visibility and `ConversationTrace.selectedBeliefIds`.

The LLM may phrase testimony, but it may not create truth or silently grant knowledge.

## What M2 proved — memory & relationship

M2 answered:

> Can an NPC later behave differently for a deterministic, inspectable reason rooted in a meaningful earlier interaction that is no longer in the immediate transcript?

**Yes.**

The M2 slice now includes:

- compact structured `NpcMemory` state;
- one-dimensional `RelationshipState.trust`;
- deterministic memory creation and trust mutation for one authored Mara interaction;
- relevance selection instead of dumping all memories into context;
- per-NPC ownership/isolation;
- persistence of structured state across browser reload;
- deliberate non-persistence of raw dialogue history;
- debug visibility into stored/retrieved memories and relationship state;
- `ConversationTrace.selectedMemoryIds` + relationship snapshot;
- deterministic tests covering creation, retrieval, isolation and persistence.

Human browser validation confirmed Mara remembered the earlier interaction as expected after reload.

The LLM may express remembered experience, but generated prose alone may not author arbitrary memories or relationship changes.

## M3 target — information propagation

M3 asks:

> Can information move from one character to another through deterministic, inspectable simulation rules and later change behavior without a handcrafted dialogue branch?

The smallest experiment uses Mara and Iven only:

```text
Player gives one explicit claim to Mara
        ↓
Game records ClaimedStatement + provenance
        ↓
Deterministic social event transfers it to Iven
        ↓
Iven gains a hearsay belief with provenance preserved
        ↓
Player later questions Iven
        ↓
Iven's free-form answer changes because that belief is now in context
```

M3 deliberately does **not** add background LLM conversations, a town-scale rumor graph, embeddings, autonomous gossip at scale or automatic extraction of every player sentence into state.

See issue `#21` for the exact gate and scope.

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
Relevant memories / relationship state
        +
Transferred claims / provenance when applicable
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

## Prototype product direction

The project has not committed to the final game yet. Promising outcomes include:

1. investigation / mystery;
2. broader social RPG;
3. pure social sandbox.

Investigation remains the strongest prototype framing because free-form conversation itself becomes gameplay.

## Visual direction

Preferred target: **first-person gothic-expressionist low-poly** — melancholic, theatrical and slightly uncanny rather than generic bright medieval low-poly.

See `docs/07-visual-direction.md`.

## Licensing and attribution

Every external resource actually adopted by the project—software, AI runtime/model/service, animations, assets, fonts, music, SFX or tools—must be traceable through `legal/third-party.json`.

See `docs/10-licensing-attribution.md`.

## Agentic studio workflow

Specialized repository agents live under `.github/agents/`.

Default discipline:

> One current milestone, one bounded issue, one accountable owner, evidence before advancing.

Current accountable owner: `ai-npc-systems-engineer` through **#21 — M3 Information propagation**.

See `docs/08-agent-studio-operating-model.md`.

## Non-goals right now

Until M3 passes, do **not** build:

- background LLM conversations between NPCs;
- hundreds of autonomous gossip events;
- generic rumor network / town-scale knowledge graph;
- vector database / embeddings by default;
- sophisticated deception planner;
- schedules/economy/factions;
- combat/inventory/quests;
- huge world simulation;
- final art production;
- voice synthesis / lip sync;
- M4 content in parallel.
