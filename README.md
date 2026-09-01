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
- Unity.
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

Use **Ollama** as a local HTTP inference server because it is fast to iterate and free per inference.

Initial model candidates:

- Qwen 3.5 4B-class local model as the default starting point.
- Phi-class small model as a comparison baseline.

Do not hard-code the project to a single model provider.

### Shipping direction

For a commercial PC build, prefer embedding local inference using **llama.cpp / GGUF** rather than requiring players to install Ollama.

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
- conversational boundaries.

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

Preferred current direction:

- PC;
- first-person;
- stylized low-poly 3D;
- deliberately limited geometry and simple materials;
- strong lighting, fog, atmosphere and audio;
- highly recognizable NPC silhouettes;
- small reusable gesture/emotion animation set rather than facial realism.

Do **not** target realistic human rendering, mocap or complex lip sync.

Suggested NPC output can include a gesture/emotion token which maps to a finite animation catalogue:

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

A fallback lower-scope direction is 2D/2.5D exploration with large illustrated portraits during dialogue.

## Non-goals for the first prototype

- huge procedural world;
- hundreds of deeply simulated NPCs;
- combat system;
- crafting;
- complex inventory;
- realistic graphics;
- voice synthesis;
- lip sync;
