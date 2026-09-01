# Domain Model

This document separates concepts that must not be collapsed into a prompt string.

## WorldFact

An objective game-owned proposition.

```text
id
subject
predicate
object / payload
truthState
occurredAt
visibility / sensitivity metadata
```

Example:

```text
fact_id: murder_001_killer
subject: Iven
predicate: killed_by
object: blacksmith
```

## Belief

What an NPC thinks about a fact or proposition.

```text
holderNpcId
proposition / factId
confidence
source
learnedAt
firstHand
```

Beliefs can be wrong.

## NpcProfile

Slow-changing authored identity:

- name;
- occupation;
- personality;
- values;
- goals;
- fears;
- speech tendencies;
- social boundaries;
- secrets known at game start.

## NpcCompetenceProfile

What the character is capable of understanding or doing. This is distinct from factual knowledge and distinct from the underlying language model's capabilities.

Candidate dimensions for the prototype:

```text
literacy
arithmetic
medicine
history
religion
professionSkill
abstractReasoning
```

Use coarse, inspectable levels (`NONE`, `LOW`, `BASIC`, `SKILLED`, `EXPERT`) or another small deterministic representation rather than pretending to model human intelligence precisely.

Example:

```text
npc: blacksmith
literacy: LOW
arithmetic: BASIC
professionSkill: EXPERT
abstractReasoning: LOW
```

A character may therefore answer simple trade arithmetic while refusing/misunderstanding advanced mathematics or programming, even though the inference model itself could answer them.

Do not create a global "math allowed" boolean. Competence is contextual and character-specific.

## NpcState

Fast-changing simulation state:

- current emotion;
- current activity;
- location;
- active goals;
- short-term suspicion;
- relationship values;
- recent social pressure.

## Relationship

Relationship values should be explicit rather than inferred solely from prose.

Candidate dimensions:

- trust;
- affection;
- fear;
- respect;
- suspicion.

Do not introduce all dimensions until needed by the prototype.

## Memory

A compact persistent event relevant to future behavior.

Example:

```text
id: memory_0092
npc: Mara
type: player_statement
summary: Player claimed the priest saw the blacksmith covered in blood.
source: player
importance: 0.8
createdAt: ...
relatedFactIds: [...]
```

## ClaimedStatement

A statement uttered by a character/player is not automatically a fact.

Track:

- speaker;
- listener(s);
- proposition;
- asserted confidence;
- source cited by speaker;
- time;
- whether the system knows it contradicts world truth.

This is the basis for gossip, lies and rumor propagation.

## DiegeticInputClassification

Advisory interpretation of a player utterance before NPC acting.

Suggested flags/categories:

```text
NORMAL
OUT_OF_WORLD
PROMPT_INJECTION
OUTSIDE_NPC_COMPETENCE
NONSENSICAL
```

Properties may include:

```text
flags
confidence (optional)
reasonCode (debug only)
```

Rules:

- classification is not authoritative world state;
- classification never produces player-facing dialogue itself;
- multiple flags may apply;
- the original player utterance must remain available to the NPC actor;
- deterministic keyword signals may assist classification but must not define it completely.

## PlayerSocialSignal (future / optional)

Repeated strange or out-of-world speech may later become a fictional social signal, for example:

```text
strangeSpeechCount
perceivedPlayerStrangeness
```

This represents what fictional NPCs infer about the player character's behavior. It must not be framed as a diagnosis of the real player.

Not required for M0.

## SocialAction

An LLM may propose a social/game action, for example:

- tell NPC X about proposition Y;
- avoid player;
- confront player;
- warn friend;
- leave location;
- threaten;
- offer item;
- attack.

A deterministic resolver converts valid proposals into scheduled simulation events.

## Security / fiction boundary

The following are not domain facts and must not leak into NPC knowledge/memory:

- system/developer prompt text;
- model/provider identity;
- API/runtime details;
- secrets the NPC is not authorized to know;
- raw inference error messages.

See `docs/06-diegetic-robustness.md` for normative conversation handling.
