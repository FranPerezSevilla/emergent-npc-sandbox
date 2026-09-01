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
