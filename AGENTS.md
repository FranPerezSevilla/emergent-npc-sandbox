# AGENTS.md

## Mission

Build the smallest possible playable experiment that proves or disproves the core hypothesis:

> Free-form conversations become compelling gameplay when an LLM performs structured NPCs inside an authoritative social simulation with persistent knowledge, relationships and memory.

## Read first

Before changing code or design, read:

1. `README.md`
2. `docs/01-design-pillars.md`
3. `docs/02-ai-architecture.md`
4. `docs/03-domain-model.md`
5. `docs/04-prototype-roadmap.md`
6. `docs/05-open-questions.md`

## Agent priorities

In order:

1. Preserve the separation between **authoritative world state** and **LLM-generated expression**.
2. Keep the prototype tiny and testable.
3. Prefer deterministic, inspectable data structures over opaque prompt magic.
4. Use structured model outputs validated by code.
5. Make model/provider integrations replaceable.
6. Track knowledge provenance, uncertainty and memory explicitly.
7. Optimize prompts/context only after behavior can be inspected and tested.
8. Do not build generic RPG systems unless a current experiment requires them.

## Hard architecture rules

- Never allow arbitrary LLM text to directly mutate game state.
- The LLM may propose actions; game systems validate and execute them.
- Objective facts and NPC beliefs must use separate data models.
- NPCs may only reason from facts/beliefs included in their context.
- A lie is a character action, not a change to world truth.
- Persist important NPC memory outside the model context window.
- Do not rely on an ever-growing raw chat transcript as memory.
- No production code may depend directly on Ollama-specific response types outside the inference adapter.
- Secrets must not be exposed to an NPC unless that NPC is allowed to know them.

## Prototype constraints

Assume initially:

- Unity/C# client.
- PC target.
- Ollama for local development inference.
- Small local model around the 4B class.
- 3–5 NPCs.
- one location;
- one incident/mystery;
- text input and text response;
- no combat;
- no voice;
- no lip sync.

## Suggested code boundaries

Names are provisional, but preserve these responsibilities:

```text
Domain/
  WorldFact
  Belief
  KnowledgeState
  NpcProfile
  NpcState
  Relationship
  Memory
  SocialEvent

AI/
  IInferenceProvider
  OllamaInferenceProvider
  PromptContextBuilder
  NpcResponseSchema
  NpcResponseValidator

Simulation/
  ConversationService
  KnowledgeTransferService
  MemoryService
  RelationshipService
  SocialActionResolver

Presentation/
  DialogueUI
  NpcAnimationController
```

## Testing expectations

Tests should focus first on failure modes that would destroy player trust:

- NPC receives a secret it should not know;
- a false statement mutates objective truth;
- invalid model action is executed;
- relationship changes outside allowed bounds;
- duplicate or contradictory memories are stored incorrectly;
- malformed structured output crashes a conversation;
- model/provider unavailable causes unrecoverable game state corruption.

Where LLM behavior itself cannot be deterministic, test the deterministic boundary around it with recorded/fake inference responses.

## Product discipline

When considering a feature, ask:

> Does this help prove that NPCs can feel socially alive?

If no, put it in `docs/05-open-questions.md` or backlog instead of implementing it.

## Documentation discipline

When an architectural choice becomes real, update the corresponding doc. Do not silently turn provisional assumptions into permanent architecture.
