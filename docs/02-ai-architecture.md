# AI Architecture

## Current technical hypothesis

Use one local language model as a shared actor for all NPCs. NPC identity comes from structured context, not dedicated model instances.

### Development stack

```text
Unity / C#
   |
   | HTTP
   v
Ollama
   |
   v
small local instruct model
```

### Shipping direction

```text
Game executable
   |
   +-- Unity game
   +-- inference abstraction
   +-- llama.cpp backend
   +-- GGUF model
```

Ollama is a development convenience, not a required shipping dependency.

## Inference request

The context builder should select only relevant data:

```text
SYSTEM RULES
+ WORLD CONTEXT SAFE FOR THIS NPC
+ NPC PROFILE
+ CURRENT NPC STATE
+ RELEVANT BELIEFS
+ RELEVANT MEMORIES
+ RELATIONSHIP TO PLAYER
+ CURRENT CONVERSATION SUMMARY
+ PLAYER MESSAGE
```

Never include global secrets merely because they exist in the game database.

## Structured response

Provisional schema:

```json
{
  "dialogue": "string",
  "emotion": "neutral|angry|happy|sad|afraid|nervous|suspicious|embarrassed",
  "gesture": "none|look_away|cross_arms|point|step_back|walk_away",
  "trustDelta": 0,
  "fearDelta": 0,
  "revealedFactIds": [],
  "claimedStatements": [],
  "proposedMemories": [],
  "proposedActions": [],
  "intent": "continue|end_conversation"
}
```

This is deliberately provisional. The implementation should use a versioned schema.

## Validation boundary

All output must pass through deterministic validation.

Examples:

- clamp relationship deltas;
- reject unknown fact IDs;
- reject impossible item transfers;
- reject attack requests when the NPC cannot attack;
- reject memories containing inaccessible system secrets;
- prevent model output from assigning authoritative truth.

## Model abstraction

Define an interface similar to:

```csharp
public interface IInferenceProvider
{
    Task<NpcInferenceResult> GenerateAsync(
        NpcInferenceRequest request,
        CancellationToken cancellationToken);
}
```

Adapters may later include:

- Ollama;
- llama.cpp native/local server;
- optional cloud provider;
- deterministic fake provider for tests.

## Memory strategy

Do not store unlimited raw transcript in prompts.

Candidate memory layers:

1. short conversation window;
2. structured episodic memories;
3. relationship state;
4. known beliefs/facts;
5. rolling conversation summary;
6. relevance retrieval when constructing context.

The exact retrieval mechanism should be chosen only after the first naive implementation is measured.

## Latency UX

Use streaming text where possible.

Presentation can mask latency using:

- reaction animation;
- gaze changes;
- short hesitation;
- gesture selection;
- typing/text reveal.

Do not artificially add large delays simply to imitate humans.

## Safety / distribution note

If the final game ships with live-generated AI content, distribution platform requirements and content safeguards must be reviewed before release. This is not part of the first technical prototype.
