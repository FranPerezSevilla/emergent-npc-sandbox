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

**DONE:** `M1 — Truth vs belief` (`#14`)

M1 evidence includes the two-NPC truth/belief slice in PR `#15`, provider blocker `#16`, OpenRouter replacement PR `#17`, free-model correction PR `#18`, deterministic truth/belief tests and a human browser PASS on 2026-09-02.

**NOW:** `M2 — Memory & relationship` (`#19`)

**NEXT / BLOCKED:** `M3 — Information propagation`

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
M2 — memory & relationship             NOW
        ↓
M3 — information propagation           NEXT / BLOCKED
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

Browser-local WebGPU inference was tested and failed the real hardware/runtime gate through load, shader compatibility and browser stability problems.

The current prototype remote path is **OpenRouter OAuth PKCE + `minimax/minimax-m3:free`** behind the same provider-agnostic `InferenceProvider` boundary. No developer API key is embedded in the public Pages build; the user-controlled OpenRouter key is stored only in browser session storage. This remains a **prototype inference path, not a final production-provider commitment**.

Puter was previously tested and rejected as the default prototype delivery path after it required phone verification. Provider/auth/quota/network failures are now surfaced as non-diegetic system state rather than NPC dialogue.

## What M1 proved — truth vs belief

M1 answered:

> Can two NPCs sincerely disagree in free-form conversation for deterministic, inspectable reasons while objective truth remains stable and outside the model's control?

**Yes.**

The executable M1 slice now includes:

- authoritative `WorldFact` data;
- NPC-owned `Belief` data;
- provenance/confidence;
- context filtering so each NPC receives only its own beliefs;
- Mara and Iven with contradictory testimony;
- debug visibility into truth vs each NPC belief;
- `ConversationTrace` evidence of which belief IDs were supplied;
- deterministic tests proving truth immutability and belief isolation.

Human browser validation confirmed Mara and Iven behaved coherently and as expected when questioned separately.

The LLM may phrase testimony, but it may not create truth or silently grant knowledge.

See issue `#14` for the completed gate and evidence.

## M2 target — memory & relationship

M2 asks:

> Can an NPC later behave differently for a deterministic, inspectable reason rooted in a meaningful earlier interaction that is no longer in the immediate transcript?

The smallest experiment introduces:

- compact structured `NpcMemory` state;
- a minimal `RelationshipState` with only 1–2 proven dimensions;
- deterministic memory creation and relationship mutation for one authored scenario;
- relevance selection instead of dumping all memories into context;
- NPC ownership/isolation;
- persistence/reload only as needed for the experiment;
- debug visibility into stored/retrieved memories and relationship state;
- `ConversationTrace` evidence of selected memory IDs and relationship context.

The LLM may express remembered experience, but generated prose alone may not author arbitrary memories or relationship changes.

See issue `#19` for the exact gate and scope.

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

M1 makes this distinction executable and inspectable.

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

Current accountable owner: `ai-npc-systems-engineer` through **#19 — M2 Memory & relationship**.

See `docs/08-agent-studio-operating-model.md`.

## Non-goals right now

Until M2 passes, do **not** build:

- NPC-to-NPC gossip/information propagation;
- vector database unless structured memory retrieval measurably fails;
- embeddings by default;
- sophisticated forgetting/decay psychology;
- dozens of relationship axes;
- unrestricted LLM-authored memories;
- generic multi-agent/planner framework;
- schedules/economy/factions;
- combat/inventory/quests;
- huge world simulation;
- final art production;
- voice synthesis / lip sync;
- M3/M4 systems in parallel.
