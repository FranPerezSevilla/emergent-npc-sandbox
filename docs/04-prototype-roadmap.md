# Prototype Roadmap — Director Operating View

## Purpose

This is the **operational roadmap** for the Studio Director.

It answers only four questions:

1. What are we proving **now**?
2. What must be true before we move on?
3. What is the next milestone if the current one succeeds?
4. What work is explicitly premature?

This roadmap is intentionally gated. Do not treat later milestones as a backlog to implement in parallel.

> The goal is not to build the full game quickly. The goal is to remove the biggest uncertainty, one playable experiment at a time.

## Director rule

At any moment there is exactly **one current product milestone**.

The Studio Director MUST:

1. identify the current milestone from this document;
2. verify the linked issue/PR/playtest state before planning new work;
3. keep implementation focused on that milestone's exit gate;
4. create blocker/fix issues only when they are necessary to pass the current gate;
5. refuse speculative work belonging to later milestones unless the human explicitly changes priority;
6. after the gate passes, record the evidence and advance the roadmap status before starting the next milestone.

A milestone is not complete because the code exists. It is complete when its **exit gate has evidence**.

## Current state

**Current milestone:** `BOOTSTRAP — Cloud playable loop`

**Current implementation issue:** `#2 — Cloud playable bootstrap with PlayCanvas`

**Next milestone:** `M0 — One living NPC`

**M0 is blocked by Bootstrap.** Do not build a separate implementation path to bypass that dependency.

Accepted runtime decision: `docs/adr/001-playcanvas-cloud-first-runtime.md`.

## Roadmap at a glance

| Stage | Status | Core question | Exit gate | Primary owner |
|---|---|---|---|---|
| **BOOTSTRAP** | **NOW** | Can agents build and hand the human a browser-playable result without a local engine/editor? | Agent -> CI -> deployed browser build -> human can play | Gameplay Engineer |
| **M0 — One living NPC** | **NEXT / BLOCKED** | Can one constrained AI NPC feel like a character rather than a chatbot? | Real free-form conversation survives normal + adversarial probing and failures are diagnosable | AI & NPC Systems Engineer |
| **M1 — Truth vs belief** | LATER | Can two NPCs disagree without the model rewriting objective truth? | Conflicting testimony with stable authoritative world state | AI & NPC Systems Engineer |
| **M2 — Memory & relationship** | LATER | Can a later conversation meaningfully depend on an earlier one? | NPC behavior changes because of persisted prior interaction outside immediate transcript | AI & NPC Systems Engineer |
| **M3 — Information propagation** | LATER | Can information travel socially and cause an unscripted delayed consequence? | A tells B; B later reacts to player without handcrafted dialogue branch | AI + Narrative/Social |
| **M4 — Tavern mystery** | LATER | Is the combined social system actually fun for ~30 minutes? | Blind human playtest produces memorable unscripted social/investigation moments | Studio Director + Human |
| **M5 — Product decision** | LATER | What game, if any, has the prototype earned the right to become? | Human chooses investigation/social RPG/sandbox/pivot/stop based on M4 evidence | Human owner |

`NOW` is the only milestone that should normally receive implementation effort.

---

# BOOTSTRAP — Cloud playable loop

## Hypothesis

The project can be developed agentically with PlayCanvas/TypeScript and delivered to the human as a browser-playable build without requiring Unity, PlayCanvas Editor or another local engine/editor for routine iteration.

## Required outcome

Build the smallest possible shell containing:

- PlayCanvas Engine + TypeScript + Vite;
- first-person movement;
- one placeholder interactable NPC/object;
- minimal text conversation UI;
- deterministic `FakeInferenceProvider`;
- deterministic tests/typecheck/build;
- CI;
- browser-accessible deployment/preview;
- third-party dependency registration.

Implementation issue: **#2**.

## Exit gate — PASS only if all are true

- [ ] repository build is reproducible from a clean/cloud environment;
- [ ] human can open a URL and move in first person;
- [ ] human can interact with the placeholder and send text;
- [ ] fake structured response is shown in the game;
- [ ] agent can change gameplay/code without undocumented manual editor work;
- [ ] CI validates the deterministic build/check path;
- [ ] third-party dependencies adopted by the bootstrap are registered;
- [ ] human confirms the browser-playtest loop is usable enough to continue.

## If the gate fails

Fix only the concrete workflow blocker:

- build/deployment friction;
- code-first scene friction;
- browser/input issue;
- unacceptable agent-editability;
- dependency/legal blocker.

Do **not** add real AI to compensate for a broken delivery loop.

## Explicitly not now

- real LLM integration;
- NPC memory/beliefs;
- final art;
- asset-pack production pipeline beyond a real immediate need;
- combat/inventory/quests;
- broader world simulation.

## Gate unlocks

`M0 — One living NPC`.

---

# M0 — One living NPC

## Hypothesis

A small real language model can perform one tightly constrained NPC well enough that free-form interaction feels like talking to a fictional person rather than a generic assistant.

## Required outcome

Build on the Bootstrap application:

- one authored NPC;
- `NpcProfile`;
- minimal `NpcCompetenceProfile`;
- small permitted knowledge/fact set;
- provider-agnostic inference boundary;
- one real provider/model experiment;
- fake/recorded provider retained;
- versioned structured response;
- deterministic response/action validation;
- diegetic robustness + leakage fallback;
- `ConversationTrace` / replayable diagnostics;
- fixed adversarial/model benchmark probe set.

Implementation issue: **#1** after #2 passes.

## Exit gate — PASS only if all are true

- [ ] one real NPC can be freely questioned in the browser build;
- [ ] normal conversation stays recognizably in character;
- [ ] inaccessible world secrets are not available to extract;
- [ ] meta/jailbreak prompts do not turn the NPC into a generic AI assistant;
- [ ] NPC competence constrains model expertise without blocking legitimate in-world competence;
- [ ] invalid/meta output is intercepted and falls back diegetically;
- [ ] failures can be explained from `ConversationTrace` rather than guessed;
- [ ] model/provider benchmark records quality + latency + Spanish behavior;
- [ ] adopted model/runtime/service provenance is registered;
- [ ] human playtest answer to **"does this feel like a character?"** is good enough to continue.

## If the gate fails

Classify the failure before changing architecture:

1. authored NPC data problem;
2. context-selection problem;
3. schema/validation problem;
4. model capability/latency problem;
5. presentation problem;
6. fundamental interaction not compelling.

Run the smallest experiment against that failure class.

Do not hide repeated failures by endlessly growing the prompt.

## Explicitly not now

- long-term memory;
- gossip propagation;
- multiple deeply simulated NPCs;
- vector database;
- agent framework/planner;
- complex final visuals;
- combat/inventory/quests.

## Gate unlocks

`M1 — Truth vs belief`.

---

# M1 — Truth vs belief

## Hypothesis

The simulation can maintain objective truth separately from character belief, allowing believable disagreement, misinformation and testimony without letting generated dialogue rewrite reality.

## Required outcome

- `WorldFact`;
- `Belief`;
- NPC-specific context filtering;
- two NPCs with contradictory beliefs/testimony;
- provenance/confidence sufficient for the experiment;
- debug inspector/traces showing objective truth vs each NPC belief.

## Exit gate

PASS when:

- NPC A and NPC B can give conflicting answers;
- both answers are explainable from their own supplied beliefs;
- objective world truth remains unchanged;
- jailbreak/conversation cannot grant an NPC knowledge it was never given;
- the human can inspect why each NPC believes what it believes.

## Explicitly not now

- persistent episodic memory beyond what M1 needs;
- NPC-to-NPC gossip;
- town-scale simulation.

## Gate unlocks

`M2 — Memory & relationship`.

---

# M2 — Memory & relationship

## Hypothesis

A character becomes substantially more believable when a later interaction changes because of a meaningful earlier interaction that is no longer in the immediate chat window.

## Required outcome

- compact structured memories;
- minimal relationship state (start only with dimensions proven necessary, e.g. trust/suspicion);
- relevance selection for prior memories;
- persistence/reload if cheap enough to validate correctly;
- debug visibility into why a memory was retrieved.

## Exit gate

PASS when:

- player interaction A occurs;
- enough time/context passes that A is outside the immediate raw transcript;
- later interaction B changes meaningfully because stored memory A was retrieved;
- the effect survives the deterministic validation boundary;
- human can inspect the causal memory/relationship state.

Optional only after the basic gate works: repeated bizarre/out-of-world player speech may feed a fictional social signal such as perceived strangeness.

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

The system becomes genuinely emergent when information can leave the player/NPC conversation, travel through another relationship and later produce a consequence the designer did not encode as a dialogue branch.

## Required outcome

- `ClaimedStatement`;
- source/provenance tracking;
- knowledge/belief transfer;
- one NPC-to-NPC social event path;
- delayed consequence/reaction;
- deterministic scheduling/resolution where practical.

## Exit gate

PASS when this chain works:

```text
Player tells NPC A something
        ->
NPC A later transmits it to NPC B
        ->
NPC B updates belief/suspicion according to rules/context
        ->
NPC B later reacts to/confronts the player
```

There must be **no handcrafted dialogue branch encoding that exact chain**.

## Explicitly not now

- hundreds of background conversations;
- full off-screen LLM simulation;
- economy/factions/large world simulation.

## Gate unlocks

`M4 — Tavern mystery`.

---

# M4 — Tavern mystery vertical prototype

## Hypothesis

The combined systems create enough agency, surprise and social coherence to support an enjoyable ~30-minute game experience.

## Scope

One deliberately small playable situation:

- one atmospheric location: tavern + minimal surrounding slice;
- 3–5 meaningful NPCs;
- one authored incident/mystery;
- one objective hidden truth;
- partial/contradictory knowledge;
- at least one liar;
- at least one incorrect belief;
- relationships/memories;
- information propagation;
- free-form interrogation/manipulation;
- minimal gesture/emotion presentation;
- first validated slice of the gothic-expressionist visual target;
- diegetic robustness retained.

This is **not** a content-production milestone. It is a fun test.

## Exit gate

Run a blind human playtest.

PASS-worthy evidence includes:

- player can spend roughly 30 minutes with meaningful goals/questions;
- player recalls at least a few specific unscripted interactions;
- social consequences feel causally understandable rather than random;
- player discovers/uses information through conversation rather than waiting for dialogue options;
- trolling does not trivially collapse characters into assistants;
- latency/UX is tolerable enough that conversation remains enjoyable;
- the visual presentation supports rather than distracts from social presence.

The Studio Director cannot self-certify this gate. **Human judgment is mandatory.**

## If the gate fails

Do not immediately expand content.

Identify whether the core problem is:

- conversation not fun;
- stakes/goals too weak;
- NPC behavior incoherent;
- social propagation too opaque/random;
- latency/friction;
- presentation;
- concept fundamentally weak.

Then run a bounded corrective experiment or stop/pivot.

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

## Required evidence

Use M4 playtest evidence, not theoretical feature appeal.

The human owner decides:

- which interactions were actually fun;
- what players wanted to do more of;
- what production cost appears sustainable;
- whether local/browser AI quality and hardware constraints are acceptable;
- whether the visual direction is worth continuing;
- whether the concept has enough differentiation to justify production.

## Exit gate

A written human decision exists.

If the decision is **continue**, create **Roadmap v2 / Production Roadmap** based on the chosen game, including only then:

- final genre/core loop;
- content scale;
- production NPC count;
- world scope;
- art/content pipeline scale;
- save/load requirements;
- performance/hardware target;
- packaging/distribution strategy;
- platform AI compliance;
- marketing/release milestones.

Do not define that production roadmap before M5.

---

# Cross-cutting tracks

These are **guardrails**, not parallel product milestones.

## Licensing / attribution

Always active when a third-party resource is adopted. Follow `docs/10-licensing-attribution.md`.

This track may block a milestone but does not justify unrelated work.

## Asset pipeline

Use `docs/09-asset-pipeline.md` only when a current milestone actually needs external assets.

Do not bulk-ingest content in advance.

## Visual direction

`docs/07-visual-direction.md` remains the visual north star.

Do not invest in the polished style target until the roadmap milestone actually needs visual validation; M4 is the first milestone that requires a representative combined art slice, although tiny presentation experiments are allowed earlier when they directly improve conversation UX.

## QA / adversarial testing

Validation is part of every milestone gate, not a separate late phase.

## Observability

From M0 onward, probabilistic behavior should be traceable enough that failures can be diagnosed from evidence.

---

# How the Studio Director chooses the next issue

Use this decision sequence:

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
                       NO  -> create the smallest first issue for next milestone.
```

Before creating any issue, ask:

> If this issue succeeds, which unchecked condition in the **current milestone gate** becomes checked?

If the answer is "none", the issue is probably premature and should not be prioritized.

# Status update discipline

Whenever a milestone advances:

1. update `Current state` near the top of this document;
2. update the roadmap table status (`NOW`, `NEXT / BLOCKED`, `LATER`, `DONE`, `STOPPED`);
3. link the evidence/issue/PR/playtest that passed the previous gate;
4. identify exactly one next milestone;
5. do not rewrite later milestone scope unless new evidence materially changes it.
