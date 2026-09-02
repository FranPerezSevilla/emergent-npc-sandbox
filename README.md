# Emergent NPC Sandbox

> Working title. Experimental browser/PC game prototype focused on AI-driven emergent NPC conversations and social simulation.

## One-sentence pitch

A small social sandbox where NPCs are structured simulated people with personalities, goals, knowledge, beliefs, secrets, memories and relationships, while a language model acts as the performer that decides how each NPC expresses itself in free-form conversation.

## Core rule

The project is **not** “ChatGPT inside an NPC”.

- **Game code owns truth and authoritative state.**
- **NPCs own beliefs/knowledge assigned by the simulation.**
- **Memories and relationships are structured game state.**
- **Information transfer is a game-owned state transition.**
- **Social metabehavior decides how an NPC is inclined to handle available information.**
- **The LLM performs wording, attitude and presentation.**
- **Generated prose never directly mutates authoritative world state.**
- **Evidence-bearing prose may not invent provenance, source count, source time/place, directness or certainty.**
- **Player text is speech inside the fiction, never privileged model instruction.**

## Current roadmap focus

**DONE:** `BOOTSTRAP — Cloud playable loop` (`#2`, PR `#4`)

**DONE:** `M0 — One living NPC with real AI` (`#1`)

**DONE:** `M1 — Truth vs belief` (`#14`)

**DONE:** `M2 — Memory & relationship` (`#19`, PR `#20`)

**DONE:** `M3 — Information propagation` (`#21`, PRs `#22`, `#24`, `#29`)

M3 proved that structured information can travel player→NPC→NPC with provenance preserved, affect later conversations, and coexist with NPC-specific social policy rather than forcing every known belief to be spoken. Final human/session validation passed on 2026-09-02.

**NOW:** `M4 — Tavern mystery` (`#30`)

**CURRENT SLICE:** `#33 — The Ash Letter case design`

**NEXT / BLOCKED:** `M5 — Product decision`

The first M4 reliability guardrail is already done: `#31` / PR `#32` prevents evidence-bearing dialogue from inventing extra sources, source time/place, direct conversations or unsupported certainty while leaving character performance free.

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
M3 — information propagation           DONE
        ↓
M4 — tavern mystery / blind playtest   NOW
        ↓
M5 — human product decision            NEXT / BLOCKED
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

The M2 slice includes compact `NpcMemory`, one-dimensional `RelationshipState.trust`, deterministic memory/trust mutations, relevance selection, per-NPC isolation, structured persistence and trace evidence.

Human browser validation confirmed Mara remembered the earlier interaction as expected after reload.

## What M3 proved — social information propagation

M3 answered:

> Can information move from one character to another through deterministic, inspectable simulation rules and later change behavior without a handcrafted dialogue branch?

**Yes.**

The M3 slice includes:

- structured `ClaimedStatement` state;
- explicit source/recipient/provenance;
- deterministic Mara→Iven transfer;
- hearsay beliefs that never become objective truth;
- idempotent propagation;
- contextual dialogue intents;
- deterministic `SocialDialogueDecision` for observation, rumor, source and challenge handling;
- free text retained alongside intent chips;
- full-session JSON export for causal QA.

The final session showed Iven correctly separate what he personally observed from hearsay relayed by Mara, identify Mara as his immediate source, and defend his own view when challenged.

## M4 target — one actual mystery

M4 asks a different question:

> When the proven social systems are combined around one concrete mystery, is the result actually fun and memorable enough to justify choosing a real product direction?

The working prototype case is **The Ash Letter**. A sealed magistrate warrant disappears from a red-cloaked courier's upstairs tavern room before dawn.

The case deliberately contains:

- Mara: uncertain but useful observation;
- Iven: sincere incorrect belief;
- Corren Vale: an intentional lie about an unrelated secret;
- Nera Pell: an intentional lie because she is responsible for the missing warrant;
- physical evidence that cross-checks testimony;
- one relationship-sensitive disclosure;
- one information-propagation consequence;
- a plausible wrong accusation path.

This is disposable prototype content, not a final story commitment.

See `docs/14-m4-ash-letter-case.md` and issue `#33`.

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
Transferred claims / provenance
        +
Dialogue intent + social metabehavior
        +
Relevant current context
        +
Player utterance (untrusted speech)
              ↓
       InferenceProvider
              ↓
     Structured proposal
              ↓
Schema + leakage + evidence-fidelity validation
              ↓
Allowed game effects + dialogue
```

The model is the **actor**, not the simulation authority.

Important robustness rule:

> Out-of-world, adversarial or nonsensical player input is interpreted from inside the NPC's worldview, never answered from the underlying model's worldview.

Important investigation rule:

> Tone may be embellished. Evidence may not.

See `docs/02-ai-architecture.md`, `docs/06-diegetic-robustness.md` and issue `#31`.

## Prototype product direction

The project has **not** committed to the final game yet. That is intentional.

Promising outcomes still include:

1. investigation / mystery;
2. broader social RPG;
3. pure social sandbox;
4. substantial pivot or stop if M4 is not fun.

M4 is intended to produce evidence for that decision. M5 is where the human owner chooses the direction.

## Visual direction

Preferred target: **first-person gothic-expressionist low-poly** — melancholic, theatrical and slightly uncanny rather than generic bright medieval low-poly.

M4 is the first milestone expected to build one representative tavern-centered visual slice rather than placeholder cubes.

See `docs/07-visual-direction.md`.

## Licensing and attribution

Every external resource actually adopted by the project—software, AI runtime/model/service, animations, assets, fonts, music, SFX or tools—must be traceable through `legal/third-party.json`.

See `docs/10-licensing-attribution.md`.

## Agentic studio workflow

Specialized repository agents live under `.github/agents/`.

Default discipline:

> One current milestone, one bounded issue, one accountable owner, evidence before advancing.

Current product owner: `studio-director` through **#30 — M4 Tavern mystery**.

Current bounded work: **#33 — The Ash Letter case design**.

See `docs/08-agent-studio-operating-model.md`.

## Non-goals right now

Until M4 passes, do **not** build:

- a second mystery;
- procedural mystery generation;
- a generic deception planner;
- background LLM conversations at scale;
- hundreds of autonomous gossip events;
- generic town-scale rumor graph;
- vector database / embeddings by default;
- schedules/economy/factions;
- combat/inventory/loot;
- huge world simulation;
- full production art pass;
- voice synthesis / lip sync;
- monetization/store work.
