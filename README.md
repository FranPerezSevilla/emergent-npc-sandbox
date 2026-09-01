# Emergent NPC Sandbox

> Working title. Experimental PC game prototype focused on AI-driven emergent NPC conversations and social simulation.

## One-sentence pitch

A small sandbox RPG where NPCs are persistent simulated people with personalities, goals, relationships, memories, knowledge and secrets, while a local language model acts as the performer that decides how each NPC expresses itself in free-form conversation.

## Core idea

The player can talk naturally to NPCs instead of selecting fixed dialogue options. NPC responses are generated from structured game state, not from an unconstrained chatbot prompt.

The important distinction is:

- **Game code owns truth and state.**
- **The LLM interprets the NPC and proposes conversational/social actions.**
- **The LLM must not directly mutate authoritative world state.**

The goal is not “ChatGPT inside an NPC”. The goal is a believable social simulation where information, lies, rumors, secrets, relationships and memories propagate through a small community.

## Prototype runtime — decided

The first playable prototype is **cloud/browser-first using PlayCanvas Engine + TypeScript + Vite**.

See `docs/adr/001-playcanvas-cloud-first-runtime.md`.

Why this stack:

- browser-playable builds/previews;
- code-first scenes/gameplay that agents can inspect and modify;
- official PlayCanvas first-person starter and agent skills;
- no requirement for the human owner to install Unity or maintain ordinary scene changes in a desktop editor;
- direct fit with GLB/glTF asset ingestion;
- simple static deployment for rapid playtest loops.

The PlayCanvas Editor may be used when useful, but it is not the authoritative source of truth for routine development.

## Prototype target

Start extremely small:

- PC/browser first;
- PlayCanvas Engine + TypeScript;
- one small location, initially a tavern or tiny village slice;
- 3–5 NPCs;
- one concrete event or mystery;
- one hidden truth;
- different partial knowledge per NPC;
- free-form text conversation;
- NPC memory and relationship changes;
- information transfer between NPCs.

A strong success criterion is that, after ~30 minutes, the system produces social situations or conversations the designer did not script directly, while still respecting the authored world truth.

## Development milestones

Before real inference, **M-1** proves the cloud workflow:

```text
agent changes repo
     ↓
CI tests/build
     ↓
web preview
     ↓
human opens browser and playtests
```

M-1 uses a deterministic fake NPC provider so runtime/deployment problems are not confused with LLM problems.

**M0** then adds one real AI-driven NPC, diegetic jailbreak resistance, structured validation, conversation traces and a small model/provider benchmark.

See `docs/04-prototype-roadmap.md`.

## AI strategy

The inference layer remains replaceable.

Initial architecture includes:

- deterministic `FakeInferenceProvider` for tests and M-1;
- one real provider/model experiment in M0;
- browser-local/WebGPU inference as the preferred product hypothesis;
- optional local sidecar/Ollama or cloud providers only when useful for comparison/fallback.

Initial model target remains a small instruct model around the few-billion-parameter class, but no permanent model should be selected before benchmarking character quality, robustness, structured output and latency.

Prefer local/offline inference for the commercial PC experience when practical because it avoids per-conversation cost, exposed API keys and mandatory connectivity.

## Core NPC model

Each NPC should be represented by structured state, for example:

- identity;
- occupation;
- personality traits;
- goals;
- fears;
- relationships;
- secrets;
- beliefs / known facts;
- confidence in those beliefs;
- current emotion;
- memories;
- opinion of the player;
- willingness to lie;
- conversational boundaries;
- explicit competence separate from the underlying model's capabilities.

The same loaded language model can play every NPC by receiving different context. We do **not** load one model per NPC.

## World truth vs beliefs

Facts in the authoritative world state are separate from what characters believe.

Example:

```text
FACT_173
Truth: Juan steals money from the church.

Knowledge:
- Juan: 100%, first-hand
- Marta: 80%, indirect evidence
- Priest: 40%, suspicion
```

A character may tell the truth, lie, omit information or repeat a false rumor. The simulation tracks provenance and confidence independently from objective world truth.

This “information as an object” idea is one of the central design pillars.

## LLM contract

The model receives controlled context and returns structured output, e.g.:

```json
{
  "dialogue": "Who told you that?",
  "emotion": "nervous",
  "gesture": "look_away",
  "trustDelta": -2,
  "revealedFacts": [],
  "proposedLearnedFacts": ["fact_priest_spoke_to_player"],
  "intent": "continue"
}
```

The game validates and applies allowed changes.

The model may request actions such as ending a conversation, walking away, warning another NPC or threatening the player, but authoritative gameplay systems decide whether those actions are possible.

## Conversation architecture

```text
World state
   +
NPC persistent state
   +
Relevant known facts
   +
Relevant memories
   +
Current goals / emotion
   +
Relationship to player
   +
Player message
       |
       v
    LLM actor
       |
       v
Structured response
       |
       v
Validation / game rules
       |
       v
State changes + visible dialogue
```

Avoid dumping the entire world or complete conversation history into every prompt. Retrieval of relevant memories/facts should become a first-class subsystem only as evidence requires it.

## Possible game directions

The project has not committed to a full game yet. Three promising forms are:

1. **Social RPG** — manipulate, befriend and influence a small living town.
2. **Investigation / mystery** — interrogate characters, compare testimony, lie and accuse without dialogue trees.
3. **Pure social sandbox** — relationships, gossip, deception and information propagate through a simulated community.

The investigation format is currently the strongest prototype because conversation itself becomes gameplay and provides a clear test scenario.

## Visual direction

The preferred direction is **first-person gothic-expressionist low-poly**: a melancholic, theatrical, slightly uncanny world with distorted proportions rather than generic bright medieval low-poly.

Core visual principles:

- tall, narrow and subtly crooked architecture;
- exaggerated roofs, long chimneys, irregular windows and compressed streets;
- silhouette before surface detail;
- cold/desaturated exteriors vs warmer intimate interiors;
- skeletal/graphic vegetation;
- highly recognizable NPC silhouettes, heads and postures;
- caricature with melancholy rather than chibi/comedy;
- body/head gestures before complex facial rigs;
- simple materials and strongly art-directed lighting.

Gothic stop-motion works such as `Corpse Bride` are a **mood/shape-language reference only**. The project translates general qualities into original designs rather than imitating distinctive copyrighted characters, sets or props.

External low-poly packs are production shortcuts, not art direction:

> Buy/download geometry; author the art direction.

Conversation remains visually situated in the world: the NPC stays physically in front of the player rather than being replaced by a giant chatbot window.

See `docs/07-visual-direction.md`.

## Agentic asset production

The human should not routinely import assets by hand in a desktop editor.

```text
Human finds/buys/provides asset source if needed
        ↓
art-source manifest
        ↓
Technical Art Director agent
inspect → select → normalize → adapt → validate
        ↓
runtime-assets/
        ↓
PlayCanvas scene/build
        ↓
playable preview
```

GLB/glTF is the default portable 3D format. Source packs require provenance/license metadata and only the subset needed by the current issue should enter production.

See `docs/09-asset-pipeline.md`.

## Licensing and attribution

Every external resource actually adopted by the project—software, AI models/services, assets, animations, fonts, music, SFX or tools—must be traceable through `legal/third-party.json`.

The `licensing-attribution-steward` owns registry/notices hygiene; agents introducing a resource must identify it immediately rather than expecting credits to be reconstructed at release time.

See `docs/10-licensing-attribution.md`.

## Agentic studio workflow

Specialized repository agents live under `.github/agents/`. The studio defaults to one bounded issue with one accountable owner agent, followed by QA and human playtest/review.

See `docs/08-agent-studio-operating-model.md`.

## Non-goals for the first prototype

- huge procedural world;
- hundreds of deeply simulated NPCs;
- combat system;
- crafting;
- complex inventory;
- realistic graphics;
- voice synthesis;
- lip sync;
- vector databases or generic multi-agent NPC frameworks before evidence requires them;
- a giant generic asset-processing framework before real asset imports justify it.