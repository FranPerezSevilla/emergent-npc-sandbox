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

## Prototype target

Start extremely small:

- PC first.
- Runtime/engine choice remains evolvable while the first agentic prototype is proven.
- One small location, initially a tavern or tiny village slice.
- 3–5 NPCs.
- One concrete event or mystery.
- One hidden truth.
- Different partial knowledge per NPC.
- Free-form text conversation.
- NPC memory and relationship changes.
- Information transfer between NPCs.

A strong success criterion is that, after ~30 minutes, the system produces social situations or conversations the designer did not script directly, while still respecting the authored world truth.

## AI strategy

### Development

The inference layer must remain replaceable. Local development may use Ollama or another local/browser provider depending on the chosen runtime stack.

Initial model target is a small local instruct model around the 4B class, with a deterministic fake provider for tests.

Do not hard-code the project to a single model provider.

### Shipping direction

Prefer local/offline inference for the commercial PC experience when practical.

Reasons:

- no per-conversation inference bill;
- offline play;
- no exposed cloud API key;
- simpler long-term operating costs;
- suitable for a game whose core loop depends on frequent dialogue.

Cloud APIs remain a possible optional high-quality mode later, but should not be required for the first architecture.

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

A character may tell the truth, lie, omit information or repeat a false rumor. The simulation tracks the provenance and confidence of information independently from objective world truth.

This “information as an object” idea is one of the central design pillars.

## LLM contract

The model should receive a controlled context containing only relevant information and return structured output, e.g.:

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

The model may **request** actions such as:

- end conversation;
- walk away;
- threaten the player;
- tell another NPC something later;
- give an item;
- attack;
- accuse someone;

But authoritative gameplay systems decide whether those actions are possible.

## Conversation architecture

Conceptually:

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
    LLM agent
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

Avoid dumping the entire world or complete conversation history into every prompt. Retrieval of relevant memories/facts should become a first-class subsystem.

## Possible game directions

The project has not committed to a full game yet. Three promising forms are:

1. **Social RPG** — manipulate, befriend and influence a small living town.
2. **Investigation / mystery** — interrogate characters, compare testimony, lie and accuse without dialogue trees.
3. **Pure social sandbox** — relationships, gossip, deception and information propagate through a simulated community.

The investigation format is currently the strongest prototype because conversation itself becomes gameplay and provides a clear test scenario.

## Visual direction

The current preferred direction is **first-person gothic-expressionist low-poly**: a melancholic, theatrical, slightly uncanny world with distorted proportions rather than generic bright medieval low-poly.

Core visual principles:

- PC / first person;
- stylized low-poly 3D;
- tall, narrow and subtly crooked architecture;
- exaggerated roofs, long chimneys, irregular windows and compressed streets;
- silhouette before surface detail;
- asymmetry without harming navigation/readability;
- cold/desaturated exteriors vs warmer, intimate interiors;
- skeletal/graphic vegetation rather than round cheerful foliage;
- highly recognizable NPC silhouettes, heads and postures;
- caricature with melancholy rather than chibi/comedy;
- body/head gestures before complex facial rigs;
- simple shared materials and strong art-directed lighting;
- no realistic human rendering, mocap or production lip sync for the prototype.

Gothic stop-motion works such as `Corpse Bride` are a **mood/shape-language reference only**. The project should translate general qualities—distorted proportions, theatrical asymmetry, melancholy and expressionist silhouettes—into original designs rather than imitate distinctive copyrighted characters, sets or props.

External low-poly packs are welcome as production shortcuts, but should be treated as **raw geometry**. The identity should come from project-authored composition, reproportioning, palette, materials, lighting and NPC design. The desired rule is:

> Buy/download geometry; author the art direction.

Suggested NPC output can include a finite gesture/emotion token which maps to deterministic animation presentation:

- neutral;
- angry;
- happy;
- sad;
- afraid;
- nervous;
- suspicious;
- embarrassed;
- look away;
- cross arms;
- point;
- walk away.

Conversation should remain visually situated in the world: the NPC stays physically in front of the player rather than being replaced by a giant chatbot/dialogue window.

The first deliberate visual style target should remain tiny: one crooked street, one tavern exterior/interior, two neighboring facades, 2–3 representative NPCs and a short first-person conversation.

See **`docs/07-visual-direction.md`** for the detailed visual bible.

A fallback lower-scope direction remains 2D/2.5D exploration with large illustrated portraits during dialogue if first-person 3D production proves too expensive.

## Agentic asset production

The project should support a cloud-first workflow in which the human does **not** routinely import assets by hand in a desktop editor.

Ideal flow:

```text
Human finds/buys/provides asset source if needed
        |
        v
art-source intake / source manifest
        |
        v
Technical Art Director agent
 inspect -> select -> normalize -> adapt -> validate
        |
        v
runtime-assets/
        |
        v
playable preview
```

Rules:

- glTF 2.0 / GLB is the default portable 3D interchange/runtime format unless a concrete constraint requires otherwise;
- source packs require provenance/license metadata;
- agents never bypass purchase/login/access controls;
- only the subset required by the current issue should enter production;
- raw source archives should normally stay out of ordinary Git history;
- runtime assets must not depend on accidental local-only paths;
- asset packs are adapted to the visual bible rather than shipped with untouched default styling;
- headless/repeatable conversion is preferred so routine production can be performed by agents in cloud environments.

See **`docs/09-asset-pipeline.md`** for the normative asset ingestion contract. Use `.github/ISSUE_TEMPLATE/asset-import.md` for concrete asset-import work.

## Agentic studio workflow

Specialized repository agents live under `.github/agents/`. The studio defaults to one bounded issue with one accountable owner agent, followed by QA and human playtest/review.

See **`docs/08-agent-studio-operating-model.md`**.

## Non-goals for the first prototype

- huge procedural world;
- hundreds of deeply simulated NPCs;
- combat system;
- crafting;
- complex inventory;
- realistic graphics;
- voice synthesis;
- lip sync;
- a giant generic asset-processing framework before real asset imports justify it;
