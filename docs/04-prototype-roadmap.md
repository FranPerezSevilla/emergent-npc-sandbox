# Prototype Roadmap — Director Operating View

## Purpose

This is the **operational roadmap** for the Studio Director. It answers four questions:

1. What are we proving **now**?
2. What must be true before we move on?
3. What comes next if the current milestone succeeds?
4. What work is explicitly premature?

The roadmap is gated. Later milestones are hypotheses, not a parallel implementation backlog.

> The goal is not to build the full game quickly. The goal is to remove the biggest uncertainty, one playable experiment at a time.

## Director rule

At any moment there is exactly **one current product milestone**.

The Studio Director MUST:

1. identify `NOW` from this document;
2. verify linked issue/PR/playtest evidence before planning new work;
3. work only on unchecked conditions in the current gate;
4. create blocker/fix issues only when necessary to pass that gate;
5. refuse speculative work from later milestones unless the human explicitly changes priority;
6. after a gate passes, record evidence here before advancing.

A milestone is complete only when its **exit gate has evidence**.

## Current state

**Current milestone:** `M1 — Truth vs belief`

**Current implementation issue:** `#14 — M1 — Truth vs belief`

**Previous milestone:** `M0 — One living NPC with real AI` — **DONE** via parent issue #1, remote experiment #8 and final QA #13.

M0 evidence:

- deployed browser conversation driven by a real provider;
- responsive remote inference path after local WebGPU experiments failed the human hardware/runtime gate;
- authored Mara profile, competence and permitted facts;
- inaccessible facts omitted from model context;
- structured validation, max-one-retry and diegetic fallback;
- deterministic fake/recorded path and tests;
- `ConversationTrace` diagnosed real provider failures;
- real-model sweep passed normal conversation, meta/jailbreak, runtime probing, competence boundaries, legitimate arithmetic/local knowledge and secret extraction;
- one first-attempt `ChatGPT` leakage was intercepted by validation and corrected by the single retry;
- benchmark `answered-programming` flag was reviewed as a false positive because Mara refused coding and emitted no code;
- human character-quality gate: **PASS 2026-09-02**;
- adopted AI resources remain registered with explicit legal review state.

Playable URL: `https://franperezsevilla.github.io/emergent-npc-sandbox/`

**Next milestone if M1 passes:** `M2 — Memory & relationship`.

Accepted runtime decision: `docs/adr/001-playcanvas-cloud-first-runtime.md`.

## Roadmap at a glance

| Stage | Status | Core question | Exit gate | Primary owner |
|---|---|---|---|---|
| **BOOTSTRAP** | **DONE** | Can agents hand the human a browser-playable result without a local engine/editor? | Agent -> CI -> Pages -> human playtest | Gameplay Engineer |
| **M0 — One living NPC** | **DONE** | Can one constrained AI NPC feel like a character rather than a chatbot? | Real conversation + adversarial/competence/secret QA + human character judgment | AI & NPC Systems + QA |
| **M1 — Truth vs belief** | **NOW** | Can two NPCs disagree without the model rewriting objective truth? | Conflicting testimony with stable authoritative truth and inspectable beliefs | AI & NPC Systems Engineer |
| **M2 — Memory & relationship** | **NEXT / BLOCKED** | Can a later conversation meaningfully depend on an earlier one? | Persisted prior interaction changes later behavior | AI & NPC Systems Engineer |
| **M3 — Information propagation** | LATER | Can information travel socially and cause an unscripted delayed consequence? | A tells B; B later reacts without a handcrafted branch | AI + Narrative/Social |
| **M4 — Tavern mystery** | LATER | Is the combined social system actually fun for ~30 minutes? | Blind human playtest produces memorable unscripted moments | Studio Director + Human |
| **M5 — Product decision** | LATER | What game, if any, has the prototype earned the right to become? | Human chooses investigation/social RPG/sandbox/pivot/stop | Human owner |

`NOW` is the only milestone that should normally receive implementation effort.

---

# BOOTSTRAP — Cloud playable loop — DONE

## Result

The project can be developed agentically with PlayCanvas/TypeScript and delivered as a browser-playable build without requiring a desktop game editor for routine iteration.

Evidence: issue **#2**, PR **#4**, deployed Pages build, human playtest.

---

# M0 — One living NPC — DONE

## Result

A tightly constrained real-AI NPC is compelling and robust enough to justify continuing the social-simulation architecture.

Evidence:

- parent milestone **#1**;
- remote baseline experiment **#8**;
- final real-model QA **#13**;
- human character-quality PASS.

## Gate evidence

- [x] one real NPC can be freely questioned in the deployed browser build;
- [x] normal conversation stays recognizably in character;
- [x] inaccessible world secrets remain absent/unextractable;
- [x] meta/jailbreak prompts do not turn the NPC into a generic assistant;
- [x] NPC competence constrains model expertise without blocking legitimate in-world competence;
- [x] invalid/meta output is intercepted/retried/fallbacked rather than shown raw;
- [x] failures can be explained from `ConversationTrace` rather than guessed;
- [x] fixed real-model sweep records quality, latency and Spanish behavior;
- [x] adopted model/runtime/service provenance is registered with explicit review state;
- [x] human answer to **“does this feel like a character?”** is good enough to continue.

M0 is closed. Do not reopen it because of future provider/product optimization unless the core single-NPC assumption itself regresses.

---

# M1 — Truth vs belief — NOW

Implementation issue: **#14**.

## Hypothesis

The simulation can maintain objective truth separately from character belief, allowing believable disagreement, misinformation and testimony without generated dialogue rewriting reality.

## Core rule

> The game owns truth. NPCs own beliefs. The LLM owns neither.

Generated dialogue is testimony, not authority.

## Required outcome

Implement the smallest executable truth-vs-belief slice:

- authoritative `WorldFact`;
- NPC-owned `Belief`;
- belief confidence/provenance;
- NPC-specific context filtering;
- two NPCs with contradictory beliefs/testimony about one tiny incident;
- debug visibility into objective truth vs each NPC belief;
- `ConversationTrace` records selected belief IDs/context decisions;
- deterministic tests proving truth cannot be mutated by generated testimony.

## Exit gate — PASS only if all are true

- [ ] one authoritative world fact exists independently of dialogue;
- [ ] NPC A and NPC B can hold contradictory beliefs about the same subject;
- [ ] each NPC receives only its own relevant beliefs/knowledge;
- [ ] asking both NPCs the same question produces conflicting but belief-consistent testimony;
- [ ] objective truth remains unchanged regardless of generated answers;
- [ ] repeated conversation does not silently synchronize beliefs;
- [ ] conversation cannot grant knowledge/belief that game code never supplied;
- [ ] debug view makes truth, belief, provenance and confidence inspectable;
- [ ] traces make each testimony explainable from selected belief IDs;
- [ ] deterministic fake/replay path covers the contradictory-testimony scenario;
- [ ] human browser playtest confirms the disagreement feels coherent rather than random.

## Smallest scenario

Use one tiny authored incident, not a full mystery.

Example shape:

```text
WorldFact F1
Truth: the red-cloaked traveler left through the back door after midnight.

Mara belief B1
Believes she heard the back door after midnight.
Confidence: medium.
Source: first-hand sound; did not see the traveler.

Second NPC belief B2
Believes the traveler never left the upstairs room.
Confidence: high.
Source: visual evidence interpreted incorrectly.
```

The exact fiction may change. The proof is the data boundary, not the content.

## Explicitly not now

- long-term episodic memory;
- relationship simulation beyond a tiny M1 need;
- NPC-to-NPC gossip/information propagation;
- automatic belief updating from every conversation;
- vector DB / town-scale knowledge graph;
- deception planner unless strictly required by the authored scenario;
- schedules/economy/factions;
- full tavern mystery content;
- M2/M3 implementation.

## Gate unlocks

`M2 — Memory & relationship`.

---

# M2 — Memory & relationship — NEXT / BLOCKED

## Hypothesis

A character becomes substantially more believable when a later interaction changes because of a meaningful earlier interaction no longer present in the immediate transcript.

## Required outcome

- compact structured memories;
- minimal relationship state, starting only with proven dimensions;
- relevance selection for prior memories;
- persistence/reload if needed for the experiment;
- debug visibility into retrieved memories.

## Exit gate

PASS when interaction A falls outside the raw dialogue window and a later interaction B changes meaningfully because stored memory A is retrieved and applied through deterministic rules.

## Explicitly not now

- vector DB unless structured retrieval measurably fails;
- sophisticated forgetting psychology;
- full NPC schedules;
- social propagation.

## Gate unlocks

`M3 — Information propagation`.

---

# M3 — Information propagation

## Hypothesis

The system becomes genuinely emergent when information can leave a player/NPC conversation, travel through another relationship and later create a consequence not encoded as a dialogue branch.

## Required outcome

- `ClaimedStatement`;
- source/provenance tracking;
- knowledge/belief transfer;
- one NPC-to-NPC social event path;
- delayed consequence/reaction;
- deterministic scheduling/resolution where practical.

## Exit gate

PASS when this chain works without a handcrafted branch encoding it:

```text
Player tells NPC A something
        ->
NPC A later transmits it to NPC B
        ->
NPC B updates belief/suspicion
        ->
NPC B later reacts to the player
```

## Explicitly not now

- hundreds of background conversations;
- full off-screen LLM simulation;
- economy/factions/large-world simulation.

## Gate unlocks

`M4 — Tavern mystery`.

---

# M4 — Tavern mystery vertical prototype

## Hypothesis

The combined systems create enough agency, surprise and social coherence to support an enjoyable ~30-minute experience.

## Scope

- one tavern + minimal surrounding slice;
- 3–5 meaningful NPCs;
- one authored incident/mystery;
- one objective hidden truth;
- partial/contradictory knowledge;
- at least one liar and one incorrect belief;
- relationships/memories;
- information propagation;
- free-form interrogation/manipulation;
- minimal gesture/emotion presentation;
- first representative gothic-expressionist visual slice;
- diegetic robustness retained.

This is a **fun test**, not a content-production milestone.

## Exit gate

Run a blind human playtest. PASS-worthy evidence includes:

- roughly 30 minutes of meaningful goals/questions;
- memorable unscripted interactions;
- social consequences feel causal rather than random;
- conversation is used to discover/manipulate information;
- trolling does not trivially collapse characters into assistants;
- latency/UX remains tolerable;
- visual presentation supports social presence.

The Studio Director cannot self-certify this gate. Human judgment is mandatory.

## Gate unlocks

`M5 — Product decision`.

---

# M5 — Product decision

## Question

What product has the prototype earned the right to become?

Possible decisions:

- investigation/mystery game;
- broader social RPG;
- social sandbox;
- substantial pivot;
- stop the project.

## Exit gate

A written human decision exists, based on M4 evidence rather than theoretical feature appeal.

Only if the decision is **continue** should the Studio Director create Roadmap v2 / Production Roadmap covering final genre/core loop, content scale, production NPC count, world scope, art pipeline scale, save/load, performance/hardware, packaging/distribution, AI compliance and marketing/release milestones.

Do not define that production roadmap before M5.

---

# Cross-cutting tracks

These are guardrails, not parallel product milestones.

## Licensing / attribution

Always active when a third-party resource is adopted. Follow `docs/10-licensing-attribution.md`.

## Asset pipeline

Use `docs/09-asset-pipeline.md` only when the current milestone actually needs external assets. Do not bulk-ingest in advance.

## Visual direction

`docs/07-visual-direction.md` remains the north star. Tiny presentation work is allowed earlier only when it directly improves the current experiment; M4 is the first milestone requiring a representative art slice.

## QA / adversarial testing

Validation is part of every milestone gate, not a separate late phase.

## Observability

From M0 onward, probabilistic behavior must be traceable enough that failures can be diagnosed from evidence.

---

# How the Studio Director chooses the next issue

```text
1. Is the current milestone gate already passed?
      NO -> identify the single biggest missing gate condition.
              |
              +-> Is there already an active issue addressing it?
                       YES -> do not create competing work.
                       NO  -> create one bounded issue for it.

      YES -> record evidence + advance roadmap status.
              |
              +-> Does the next milestone require human approval first?
                       YES -> request/record human decision.
                       NO  -> activate the smallest existing issue or create one.
```

Before creating any issue, ask:

> If this issue succeeds, which unchecked condition in the **current milestone gate** becomes checked?

If the answer is “none”, the issue is premature.

# Status update discipline

Whenever a milestone advances:

1. update `Current state`;
2. update the roadmap table status (`NOW`, `NEXT / BLOCKED`, `LATER`, `DONE`, `STOPPED`);
3. link the evidence/issue/PR/playtest that passed the previous gate;
4. identify exactly one next milestone;
5. do not rewrite later milestone scope unless new evidence materially changes it.
