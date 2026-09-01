# Prototype Roadmap — Director Operating View

## Purpose

This is the **operational roadmap** for the Studio Director. It exists to answer four questions only:

1. What are we proving **now**?
2. What must be true before we move on?
3. What is next if the current milestone succeeds?
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

**Current milestone:** `M0 — One living NPC with real AI`

**Current implementation issue:** `#1 — M0 — One living NPC with real AI`

**Previous milestone:** `BOOTSTRAP — Cloud playable loop` — **DONE** via issue #2 and PR #4.

Bootstrap evidence:

- reproducible PlayCanvas + TypeScript + Vite build;
- deterministic CI/typecheck/lint/test/build;
- GitHub Pages deployment from `main`;
- browser first-person interaction with Mara + free-text fake response;
- third-party registry checks green;
- human confirmed the URL-based playtest loop is usable.

Playable Bootstrap URL: `https://franperezsevilla.github.io/emergent-npc-sandbox/`

**Next milestone if M0 passes:** `M1 — Truth vs belief`.

Accepted runtime decision: `docs/adr/001-playcanvas-cloud-first-runtime.md`.

## Roadmap at a glance

| Stage | Status | Core question | Exit gate | Primary owner |
|---|---|---|---|---|
| **BOOTSTRAP** | **DONE** | Can agents hand the human a browser-playable result without a local engine/editor? | Agent -> CI -> Pages -> human playtest | Gameplay Engineer |
| **M0 — One living NPC** | **NOW** | Can one constrained AI NPC feel like a character rather than a chatbot? | Real free-form conversation survives normal + adversarial probing and failures are diagnosable | AI & NPC Systems Engineer |
| **M1 — Truth vs belief** | **NEXT / BLOCKED** | Can two NPCs disagree without the model rewriting objective truth? | Conflicting testimony with stable authoritative world state | AI & NPC Systems Engineer |
| **M2 — Memory & relationship** | LATER | Can a later conversation meaningfully depend on an earlier one? | Persisted prior interaction changes later behavior | AI & NPC Systems Engineer |
| **M3 — Information propagation** | LATER | Can information travel socially and cause an unscripted delayed consequence? | A tells B; B later reacts without a handcrafted branch | AI + Narrative/Social |
| **M4 — Tavern mystery** | LATER | Is the combined social system actually fun for ~30 minutes? | Blind human playtest produces memorable unscripted moments | Studio Director + Human |
| **M5 — Product decision** | LATER | What game, if any, has the prototype earned the right to become? | Human chooses investigation/social RPG/sandbox/pivot/stop | Human owner |

`NOW` is the only milestone that should normally receive implementation effort.

---

# BOOTSTRAP — Cloud playable loop — DONE

## Result

The project can be developed agentically with PlayCanvas/TypeScript and delivered as a browser-playable build without requiring a desktop game editor for routine iteration.

Implementation evidence: issue **#2**, PR **#4**, deployed Pages build, human playtest.

## Gate evidence

- [x] clean/cloud build is reproducible;
- [x] human can open a URL and move/look in first person;
- [x] human can interact with Mara and send text;
- [x] deterministic fake structured response is shown;
- [x] routine gameplay/code changes require no undocumented editor step;
- [x] CI validates the deterministic path;
- [x] adopted third-party dependencies are registered;
- [x] human confirmed the browser-playtest loop is usable.

Bootstrap is closed. Do not reopen it unless the delivery loop itself regresses.

---

# M0 — One living NPC — NOW

## Hypothesis

A small real language model can perform one tightly constrained NPC well enough that free-form interaction feels like talking to a fictional person rather than a generic assistant.

Implementation issue: **#1**.

## Required outcome

Build on the existing Bootstrap application:

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
- fixed adversarial/model benchmark probe set;
- provenance/license registration for adopted model/runtime/service.

Browser-local/WebGPU is the preferred product hypothesis, but M0 chooses by evidence rather than doctrine.

## Exit gate — PASS only if all are true

- [ ] one real NPC can be freely questioned in the deployed browser build;
- [ ] normal conversation stays recognizably in character;
- [ ] inaccessible world secrets are absent/unextractable;
- [ ] meta/jailbreak prompts do not turn the NPC into a generic assistant;
- [ ] NPC competence constrains model expertise without blocking legitimate in-world competence;
- [ ] invalid/meta output is intercepted and falls back diegetically;
- [ ] failures can be explained from `ConversationTrace` rather than guessed;
- [ ] fixed benchmark records quality + latency + Spanish behavior;
- [ ] adopted model/runtime/service provenance is registered;
- [ ] human playtest answer to **“does this feel like a character?”** is good enough to continue.

## If the gate fails

Classify the failure before changing architecture:

1. authored NPC data;
2. context selection;
3. schema/validation;
4. model capability/latency;
5. presentation;
6. fundamental interaction not compelling.

Run the smallest experiment against the diagnosed failure. Do not hide repeated failures by endlessly growing the prompt.

## Explicitly not now

- M1 truth-vs-belief implementation;
- long-term memory;
- gossip propagation;
- multiple deeply simulated NPCs;
- vector DB;
- generic agent/planner framework;
- complex final visuals;
- combat/inventory/quests.

## Gate unlocks

`M1 — Truth vs belief`.

---

# M1 — Truth vs belief — NEXT / BLOCKED

## Hypothesis

The simulation can maintain objective truth separately from character belief, allowing believable disagreement, misinformation and testimony without generated dialogue rewriting reality.

## Required outcome

- `WorldFact`;
- `Belief`;
- NPC-specific context filtering;
- two NPCs with contradictory beliefs/testimony;
- provenance/confidence sufficient for the experiment;
- debug visibility into objective truth vs each NPC belief.

## Exit gate

PASS when:

- NPC A and B can give conflicting answers;
- both answers are explainable from their supplied beliefs;
- objective truth remains unchanged;
- conversation cannot grant knowledge that was never supplied;
- the human can inspect why each NPC believes what it believes.

## Explicitly not now

- persistent episodic memory beyond M1 needs;
- NPC-to-NPC gossip;
- town-scale simulation.

## Gate unlocks

`M2 — Memory & relationship`.

---

# M2 — Memory & relationship

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
