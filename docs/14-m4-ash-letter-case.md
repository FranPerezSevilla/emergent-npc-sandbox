# M4 case design — The Ash Letter

Status: **prototype case / disposable content**

Parent: #30
Design slice: #33

> This case exists to test whether the M0–M3 social systems become fun when combined around one concrete investigation. It is not a commitment to the final game's plot, lore or product direction.

## 1. Player-facing premise

A red-cloaked courier stayed the night at Mara Vey's tavern carrying a sealed magistrate warrant. By dawn, the warrant was gone from his upstairs room.

The player has one simple goal:

> **Find what happened to the missing warrant and decide who took it.**

The investigation should be solvable through a mixture of conversation, source-checking, physical inspection and social consequences. The player may accuse the wrong person for understandable reasons.

## 2. What this case is testing

The case deliberately creates three different reasons for testimony to be false:

1. **Mara is uncertain but broadly correct** — she heard somebody use the back door but never saw who.
2. **Iven is sincere and wrong** — he saw a red silhouette upstairs and inferred the courier never left.
3. **Corren lies about an unrelated secret** — he did leave, but his lie is not evidence that he stole the warrant.
4. **Nera lies because she is actually responsible** — she took and burned the warrant to protect her brother.

The intended player lesson is:

> A contradiction is a lead, not proof of guilt.

## 3. Cast

### Mara Vey — tavern keeper

Existing NPC retained.

Character role in case:

- social hub;
- first source of the back-door clue;
- knows normal tavern access rules;
- useful propagation node;
- does not know the hidden solution.

Social policy:

- observant;
- cautious about accusing regulars or staff;
- willing to admit uncertainty;
- slightly more forthcoming at positive trust.

### Iven Holt — night watchman

Existing NPC retained.

Character role in case:

- sincere incorrect alibi for Corren;
- demonstrates inference vs eyewitness evidence;
- later target of information propagation;
- proud enough to resist contradiction until given a causal reason to reconsider.

Social policy:

- prefers own observations over gossip;
- discounts hearsay;
- initially defends his conclusion;
- can revise the conclusion without rewriting what he actually saw.

### Corren Vale — red-cloaked courier

New NPC.

Role:

- owner/carrier of the missing warrant;
- obvious suspect once the player learns he secretly left the room;
- intentional liar for a reason unrelated to the theft.

Personality target:

- controlled and formal;
- status-conscious;
- irritated by amateur interrogation;
- more afraid of public embarrassment and a watch fine than of looking suspicious.

Private secret:

- he left after midnight to retrieve a hidden bottle of untaxed brandy from his saddlebag in the stable yard.

Authored lie:

- default claim: he remained upstairs after retiring for the night.

Lie-break condition:

- once the player has a strong contradiction such as the physical cloak clue plus the back-door evidence, or discovers the brandy, Corren may admit leaving and explain the unrelated secret.

He **does not know** who took the warrant.

### Nera Pell — tavern servant

New NPC.

Role:

- actual culprit;
- relationship-sensitive disclosure target;
- has legitimate upstairs-room access through her work.

Personality target:

- competent and guarded;
- protective of family;
- dislikes authority but is not casually criminal;
- becomes more candid if the player demonstrates discretion rather than threatening her.

Private secret:

- the warrant named her younger brother, Jorin Pell;
- she entered Corren's room while he was absent;
- she stole the warrant and burned it in the kitchen hearth.

Authored lie:

- default claim: she did not enter Corren's room after evening service and knows nothing about the disappearance.

Relationship disclosure:

- at positive trust she may admit that she recognized Jorin's name on the folded warrant before it vanished;
- this reveals motive but does not automatically confess the theft.

Confession condition:

- the player confronts her with sufficient independent evidence tying the burned warrant to the tavern kitchen plus her access/motive.

## 4. Authoritative truth timeline

Times are authoritative simulation data for the case. NPCs only receive the portions they actually know.

| Approx. time | Objective event |
| --- | --- |
| Before sunset | Corren Vale arrives wearing a faded red cloak and rents the small upstairs room. |
| Early evening | Corren places his courier satchel in the room. The folded, sealed warrant visibly names **Jorin Pell** on its exterior. |
| Evening service | Nera sees Jorin's name while serving Corren and realizes the magistrate has sent something concerning her brother. She does not know every legal detail inside the sealed document. |
| Before midnight | Corren hangs his red cloak on the tall peg beside the upstairs window. From the lane it can resemble a person-shaped red silhouette in low light. |
| Shortly after midnight | Corren quietly leaves through the tavern back door to retrieve untaxed brandy hidden in his saddlebag. |
| Minutes later | Mara hears the back door and footsteps cross the yard. She does not see who made them. |
| Same window | On patrol, Iven sees the red shape at the upstairs window and assumes Corren is still in the room. |
| During Corren's absence | Nera uses the normal service key, enters the room, removes the warrant from the satchel and returns downstairs. |
| Minutes later | Nera burns the warrant in the kitchen hearth. A charred folded-paper fragment and part of the magistrate's wax seal survive in the ash. |
| Before dawn | Corren returns through the back entrance with the brandy and goes upstairs. |
| Dawn | Corren discovers the warrant missing. He reports the disappearance but lies that he never left the room. |
| Start of play | Mara asks the player to make sense of the contradictory accounts before Iven settles on the wrong explanation. |

## 5. Knowledge / belief / lie matrix

Legend:

- **K** — known directly;
- **B** — belief/inference;
- **H** — hearsay only;
- **L** — intentionally lies about it;
- **—** — unavailable and must not enter prompt context.

| Information | Mara | Iven | Corren | Nera |
| --- | --- | --- | --- | --- |
| Corren arrived in red cloak | K | K/H | K | K |
| Back door opened after midnight | K by sound | — initially | K + L about own role | may know room became empty, but does not know Mara's exact observation |
| Corren left after midnight | B, medium | B: **did not leave**, high | K + L | K because she entered while he was absent |
| Red shape remained at upstairs window | — initially | K visual | K that cloak was hanging there | may know cloak was there if she entered room |
| Shape was the hanging cloak | — until physical clue/told | — until physical clue/told | K | K after entering room |
| Corren's brandy secret | — | — | K + concealed | — |
| Warrant named Jorin Pell | — unless told | — | K | K |
| Nera entered Corren's room | — | — | — | K + L |
| Nera burned warrant | — | — | — | K + L |
| Warrant ash is in kitchen hearth | — until inspected/told | — | — | K |

No NPC receives the complete objective timeline.

## 6. Evidence atoms

Evidence is game-owned state. Dialogue may describe an evidence atom but cannot create a new one.

### E1 — Back-door sound

Source: Mara first-hand auditory observation.

Structured content:

- back door opened shortly after midnight;
- footsteps crossed the yard;
- Mara did not visually identify the person.

Supports:

- somebody plausibly left the tavern;
- weakly challenges Iven's inference.

Does **not** prove:

- Corren was the person;
- who took the warrant.

### E2 — Iven's red-window observation

Source: Iven first-hand visual observation + inference.

Structured content:

- Iven saw a person-like red shape at the upstairs window after midnight;
- he inferred it was Corren.

Supports:

- why Iven sincerely believes Corren stayed upstairs.

Does **not** prove:

- the shape was a person;
- Corren remained in the room.

### E3 — Cloak by the upstairs window

Source: physical inspection.

Inspection point: Corren's upstairs room / window peg.

Structured content:

- Corren's faded red cloak is hanging on a tall peg immediately beside the window;
- from the lane it can plausibly create the silhouette Iven described.

Consequence:

- explains Iven's observation without making Iven dishonest;
- permits the player to challenge the alibi inference.

### E4 — Burned magistrate fragment

Source: physical inspection.

Inspection point: kitchen hearth.

Structured content:

- a charred fragment of folded official paper remains in the ash;
- part of the magistrate's wax seal survives;
- the remaining exterior text contains the fragment `...PELL`.

Supports:

- the missing warrant was burned in the tavern kitchen;
- someone with access to the kitchen disposed of it;
- connection to the Pell family becomes plausible.

Does **not** by itself prove Nera burned it.

### E5 — Corren's stable secret

Source: Corren admission after contradiction, or optional stable/saddlebag inspection if that interaction is implemented.

Structured content:

- Corren had untaxed brandy hidden with his travel gear;
- he went outside after midnight to retrieve it;
- this is why he lied about remaining upstairs.

Consequence:

- proves that Corren's lie is real but unrelated to the missing warrant;
- makes a wrong Corren accusation highly plausible before this evidence is discovered.

## 7. Access and motive facts

These are not standalone proof.

### A1 — Nera's room access

Mara knows that Nera carries/uses the normal service key for occupied rooms as part of closing and morning work.

This establishes opportunity but is ordinary job access, not guilt.

### A2 — Nera recognized Jorin's name

At sufficient relationship trust, Nera can disclose:

- she saw her brother Jorin Pell's name on the exterior of Corren's folded warrant;
- she was afraid of what the magistrate intended.

This establishes motive but still does not prove she took the document.

## 8. Memory / relationship hook

One explicit game-owned interaction:

**`Promise Nera discretion until you understand what happened.`**

Effect:

- records a compact `NpcMemory` for Nera;
- increases Nera trust by one bounded step;
- does not change truth or evidence;
- later permits the A2 disclosure about recognizing Jorin's name.

The LLM may decide how relieved, skeptical or grateful Nera sounds. It may not create the trust change itself.

This interaction is deliberately non-monetary so M4 tests a different social action from Mara's M2 baker-debt fixture.

## 9. Information-propagation hook

One explicit authored transfer chain:

```text
Player physically discovers E3: cloak by window
        ↓
Player explicitly tells Mara what they found
        ↓
Game records structured claim/source=player/recipient=Mara
        ↓
Deterministic Mara → Iven social event
        ↓
Iven gains hearsay that the cloak was found hanging beside the window
        ↓
Later conversation: Iven may reconsider his conclusion while preserving
his original observation that he really did see a red shape
```

This is the M4 representative propagation event. No generic automatic extraction is required.

## 10. Authored lie policy

M4 does **not** introduce a generic deception planner.

Each lie is a small authored policy with explicit truth ownership and break conditions.

### Corren

Protected truths:

- he left after midnight;
- he retrieved untaxed brandy.

Default false claim:

- he stayed upstairs all night.

Break condition:

- strong contradictory evidence is presented or the brandy is found.

After break:

- he may admit the exit and brandy;
- he still truthfully denies taking the warrant.

### Nera

Protected truths:

- she entered the room;
- she took the warrant;
- she burned it.

Default false claim:

- she did not enter the room after evening service.

Trust-sensitive partial disclosure:

- at positive trust she may admit recognizing Jorin's name and fearing the warrant.

Confession condition:

- player has E4 plus credible access/motive context and explicitly accuses/confronts Nera.

Generated prose never changes whether these policies are active.

## 11. Critical path

A likely successful playthrough:

1. Mara frames the missing-warrant problem.
2. Player questions Mara and learns E1 plus normal access information A1.
3. Player questions Iven and gets E2; Corren appears to have an alibi.
4. Player questions Corren; he claims he stayed upstairs.
5. Player inspects the upstairs room and discovers E3, explaining Iven's silhouette.
6. Player tells Mara about E3; the authored propagation event eventually reaches Iven.
7. Player returns to Iven and sees him distinguish his real observation from his now-weaker conclusion.
8. Player inspects the kitchen hearth and discovers E4.
9. Player builds trust with Nera and learns A2, or obtains the warrant addressee/motive context from another legitimate route.
10. Player exposes Corren's unrelated lie through E1/E3/E5, learning that lying did not make him the thief.
11. Player combines E4 + Nera access/motive and accuses Nera.
12. Nera confesses according to authoritative state; tone/details depend on trust and conversation history.

The exact conversation order is not authored.

## 12. Alternate reasoning paths

### Physical-first

- inspect cloak;
- inspect hearth;
- ask Mara who could access the room;
- approach Nera with evidence before deeply questioning Iven/Corren;
- later use conversations to verify motive and eliminate Corren.

### Social-first

- collect Mara/Iven/Corren contradictions;
- pressure Corren until his unrelated secret breaks;
- build Nera trust and learn Jorin's name;
- use physical inspection last to confirm the warrant was burned.

### Plausible wrong path — accuse Corren

The player may reasonably conclude Corren did it because:

- Mara's sound suggests somebody left;
- Corren explicitly lies about leaving;
- the missing document was his responsibility;
- Iven's alibi becomes unreliable after E3.

A wrong accusation must be allowed. It should not silently rewrite truth.

If Corren is accused without proof linking him to the burned warrant, he denies the theft. Depending on evidence already found, he may reveal E5 and expose why his lie was unrelated.

## 13. Accusation and resolution state

Minimum authoritative case state:

```text
case.accusedNpcId
case.discoveredEvidenceIds
case.relationships
case.memories
case.propagationEvents
case.resolution
```

Resolution v0:

- **Correct accusation: Nera + sufficient evidence** → Nera confession; case marked solved.
- **Nera accused too early** → denial; investigation remains open.
- **Corren accused** → wrong accusation; he may reveal unrelated secret if conditions are met; investigation remains open.
- **Mara/Iven accused** → wrong accusation; case remains open.
- **Player gives up / unresolved** → explicit unresolved outcome is allowed for playtest telemetry.

No morality/endgame branch is required in M4 v0. First prove that reaching the truth is fun.

## 14. What is authored vs emergent

### Authoritative/authored

- objective timeline;
- evidence atoms;
- who knows what;
- belief confidence/provenance;
- Corren and Nera lie policies;
- trust/memory mutations;
- propagation transition;
- accusation validity and resolution.

### Emergent/model-performed

- exact wording;
- conversational order;
- attitude, hesitation and emotional presentation;
- whether an optional known detail is volunteered when policy permits;
- how an NPC reacts to free-form phrasing;
- how memorable or antagonistic a confrontation becomes.

The model performs the case; it does not author the case truth.

## 15. Blind-playtest anti-spoiler rules

Normal playtest UI must not expose:

- objective truth timeline;
- private NPC knowledge;
- lie-policy flags;
- undiscovered evidence IDs;
- provenance/debug internals;
- correct culprit.

Debug/QA may expose these only behind an explicit debug mode or in the exported session evidence.

Session export should contain enough state after play to reconstruct:

- evidence discovery order;
- conversations/traces;
- social decisions;
- validation/retries;
- memories/relationships;
- propagation events;
- accusation and final resolution.

## 16. Minimum spatial slice

Only four small areas are required:

1. tavern common room;
2. upstairs courier room/window;
3. kitchen hearth;
4. back yard/stable edge.

The case does not require a town map.

## 17. Exit check for design slice

- [x] stable authoritative truth timeline;
- [x] four distinct NPC roles/motives/policies;
- [x] sincere false belief: Iven;
- [x] intentional unrelated lie: Corren;
- [x] intentional culprit lie: Nera;
- [x] evidence never depends on model invention;
- [x] physical and social evidence cross-check testimony;
- [x] relationship hook changes disclosure;
- [x] propagation hook changes later interpretation;
- [x] correct solution requires multiple independent evidence sources;
- [x] plausible wrong Corren accusation exists;
- [x] implementation remains one tavern-centered slice.

## 18. Next implementation question

Do **not** generalize the entire case into a generic mystery engine yet.

The next bounded implementation should answer:

> Can the game represent this case's authoritative truth, evidence discovery and authored lie/disclosure policies with the smallest extension of the existing M0–M3 state model?
