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

**Current milestone:** `M2 — Memory & relationship`

**Current implementation issue:** `#19 — M2 — Memory & relationship`

**Previous milestone:** `M1 — Truth vs belief` — **DONE** via issue #14, provider blocker #16, PR #15, provider PR #17 and free-model correction PR #18.

M1 evidence:

- authoritative `WorldFact` exists independently of generated dialogue;
- NPC-owned `Belief` state carries provenance/confidence and remains separate from truth;
- Mara and Iven receive isolated belief context and can hold contradictory beliefs about the same incident;
- `ConversationTrace` records selected belief IDs;
- deterministic tests prove truth immutability, per-NPC belief isolation, contradictory-belief coexistence and no implicit belief mutation by generated prose;
- deployed browser build exposes truth vs beliefs for inspection;
- Puter was rejected as the default prototype provider after `phone_verification_required` blocked human testing;
- OpenRouter browser OAuth PKCE replaced Puter without embedding a developer API key in Pages;
- the first OpenRouter free-model candidate was retired after a real 404 availability failure and replaced with the current MiniMax M3 free prototype endpoint;
- provider/auth/quota/network failures are now surfaced as non-diegetic system state rather than NPC dialogue;
- human truth-vs-belief gate: **PASS 2026-09-02** — Mara and Iven behaved coherently and as expected when questioned separately.

Playable URL: `https://franperezsevilla.github.io/emergent-npc-sandbox/`

**Next milestone if M2 passes:** `M3 — Information propagation`.

Accepted runtime decision: `docs/adr/001-playcanvas-cloud-first-runtime.md`.

## Roadmap at a glance

| Stage | Status | Core question | Exit gate | Primary owner |
|---|---|---|---|---|
| **BOOTSTRAP** | **DONE** | Can agents hand the human a browser-playable result without a local engine/editor? | Agent -> CI -> Pages -> human playtest | Gameplay Engineer |
| **M0 — One living NPC** | **DONE** | Can one constrained AI NPC feel like a character rather than a chatbot? | Real conversation + adversarial/competence/secret QA + human character judgment | AI & NPC Systems + QA |
| **M1 — Truth vs belief** | **DONE** | Can two NPCs disagree without the model rewriting objective truth? | Conflicting testimony with stable authoritative truth and inspectable beliefs | AI & NPC Systems Engineer |
| **M2 — Memory & relationship** | **NOW** | Can a later conversation meaningfully depend on an earlier one? | Persisted prior interaction changes later behavior | AI & NPC Systems Engineer |
| **M3 — Information propagation** | **NEXT / BLOCKED** | Can information travel socially and cause an unscripted delayed consequence? | A tells B; B later reacts without a handcrafted branch | AI + Narrative/Social |
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

# M1 — Truth vs belief — DONE

Implementation issue: **#14**. Provider blocker: **#16**.

## Result

The simulation can maintain objective truth separately from character belief, allowing two NPCs to disagree coherently without generated dialogue rewriting authoritative state.

## Core rule

> The game owns truth. NPCs own beliefs. The LLM owns neither.

Generated dialogue is testimony, not authority.

## Gate evidence

- [x] one authoritative world fact exists independently of dialogue;
- [x] NPC A and NPC B can hold contradictory beliefs about the same subject;
- [x] each NPC receives only its own relevant beliefs/knowledge;
- [x] asking both NPCs the same question produces conflicting but belief-consistent testimony;
- [x] objective truth remains unchanged regardless of generated answers;
- [x] repeated conversation does not silently synchronize beliefs;
- [x] conversation cannot grant knowledge/belief that game code never supplied;
- [x] debug view makes truth, belief, provenance and confidence inspectable;
- [x] traces make each testimony explainable from selected belief IDs;
- [x] deterministic fake/replay path covers the contradictory-testimony scenario;
- [x] human browser playtest confirms the disagreement feels coherent rather than random.

Evidence: issue **#14**, blocker **#16**, PRs **#15**, **#17**, **#18**, deployed Pages build and human PASS on 2026-09-02.

M1 is closed. Provider optimization may continue later if needed, but it does not reopen the truth-vs-belief hypothesis unless the domain boundary itself regresses.

---

# M2 — Memory & relationship — NOW

Implementation issue: **#19**.

## Hypothesis

A character becomes substantially more believable when a later interaction changes because of a meaningful earlier interaction no longer present in the immediate transcript.

## Core rules

> Memories are structured game state, not raw model-written autobiography.

> Relationship state is authoritative game data. The LLM may express its consequences but may not silently create or mutate it.

## Required outcome

- compact structured memories owned by one NPC;
- minimal relationship state, beginning with at most 1–2 proven dimensions;
- deterministic memory creation for one tiny authored scenario;
- deterministic relationship mutation rules;
- relevance selection for prior memories;
- memory ownership/isolation between NPCs;
- prompt context that distinguishes remembered experience from objective truth;
- `ConversationTrace` records selected memory IDs and relevant relationship state;
- persistence/reload only to the minimum degree required by the experiment;
- debug visibility into stored/retrieved memories and relationship state.

## Exit gate — PASS only if all are true

- [ ] a meaningful prior interaction creates a compact structured memory through game code;
- [ ] generated dialogue alone cannot create arbitrary memories or relationship changes;
- [ ] memory ownership is isolated per NPC;
- [ ] the original interaction can fall outside the immediate raw transcript window;
- [ ] a later turn retrieves the relevant prior memory deterministically;
- [ ] the later response changes meaningfully because that memory/relationship state was supplied;
- [ ] unrelated memories are not blindly dumped into context;
- [ ] relationship state changes only through explicit game rules and is inspectable;
- [ ] traces record selected memory IDs + relationship state used for the turn;
- [ ] persistence/reload works to the minimum degree required by the experiment;
- [ ] deterministic fake/replay tests cover creation, retrieval, isolation and non-mutation by prose;
- [ ] human browser playtest confirms the NPC appears to remember the earlier interaction rather than merely echoing recent transcript text.

## Explicitly not now

- NPC-to-NPC gossip / information propagation;
- vector DB unless structured retrieval measurably fails;
- embeddings by default;
- sophisticated forgetting psychology;
- dozens of relationship dimensions;
- unrestricted LLM-authored memories;
- full NPC schedules;
- schedules/economy/factions;
- full mystery content.

## Gate unlocks

`M3 — Information propagation`.

---

# M3 — Information propagation — NEXT / BLOCKED

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
