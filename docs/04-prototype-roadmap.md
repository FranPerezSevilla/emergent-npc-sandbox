# Prototype Roadmap — Director Operating View

## Purpose

This is the operational roadmap for the Studio Director. It answers what we are proving now, what must be true before we move on, what comes next, and what is explicitly premature.

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

A milestone is complete only when its exit gate has evidence.

## Current state

**Current milestone:** `M3 — Information propagation`

**Current implementation issue:** `#21 — M3 — Information propagation`

**Previous milestone:** `M2 — Memory & relationship` — **DONE** via issue #19 and PR #20.

M2 evidence:

- game-owned `NpcMemory` and one-dimensional `RelationshipState.trust` exist independently of generated prose;
- one explicit Mara interaction deterministically creates the baker-debt memory and `trust +1`;
- memory ownership is isolated per NPC;
- relevance selection avoids blindly dumping memories into every prompt;
- selected memory IDs and relationship snapshots are recorded in `ConversationTrace`;
- structured memory/relationship state persists across reload while raw dialogue history does not;
- deterministic tests cover creation, retrieval, isolation, prompt context, trace evidence and persistence boundaries;
- deployed browser build exposes memory/relationship state and reset controls;
- human memory/relationship gate: **PASS 2026-09-02** — Mara remembered the earlier interaction as expected after reload.

Playable URL: `https://franperezsevilla.github.io/emergent-npc-sandbox/`

**Next milestone if M3 passes:** `M4 — Tavern mystery`.

Accepted runtime decision: `docs/adr/001-playcanvas-cloud-first-runtime.md`.

## Roadmap at a glance

| Stage | Status | Core question | Exit gate | Primary owner |
|---|---|---|---|---|
| **BOOTSTRAP** | **DONE** | Can agents hand the human a browser-playable result without a local engine/editor? | Agent → CI → Pages → human playtest | Gameplay Engineer |
| **M0 — One living NPC** | **DONE** | Can one constrained AI NPC feel like a character rather than a chatbot? | Real conversation + adversarial/competence/secret QA + human judgment | AI & NPC Systems + QA |
| **M1 — Truth vs belief** | **DONE** | Can two NPCs disagree without the model rewriting objective truth? | Conflicting testimony with stable authoritative truth and inspectable beliefs | AI & NPC Systems Engineer |
| **M2 — Memory & relationship** | **DONE** | Can a later conversation meaningfully depend on an earlier one? | Persisted prior interaction changes later behavior | AI & NPC Systems Engineer |
| **M3 — Information propagation** | **NOW** | Can information travel socially and cause a delayed consequence? | A tells B; B later reacts without a handcrafted dialogue branch | AI + Narrative/Social |
| **M4 — Tavern mystery** | **NEXT / BLOCKED** | Is the combined social system actually fun for ~30 minutes? | Blind human playtest produces memorable unscripted moments | Studio Director + Human |
| **M5 — Product decision** | LATER | What game, if any, has the prototype earned the right to become? | Human chooses investigation/social RPG/sandbox/pivot/stop | Human owner |

`NOW` is the only milestone that should normally receive implementation effort.

---

# BOOTSTRAP — Cloud playable loop — DONE

The project can be developed agentically with PlayCanvas/TypeScript and delivered as a browser-playable build without requiring a desktop game editor for routine iteration.

Evidence: issue **#2**, PR **#4**, deployed Pages build, human playtest.

---

# M0 — One living NPC — DONE

A tightly constrained real-AI NPC is compelling and robust enough to justify continuing the social-simulation architecture.

Evidence: parent issue **#1**, remote baseline **#8**, final QA **#13**, human character-quality PASS.

Core result: the model can perform Mara while game code constrains knowledge, competence and diegetic behavior, with traceable validation/retry/fallback boundaries.

---

# M1 — Truth vs belief — DONE

Implementation issue: **#14**. Provider blocker: **#16**.

> The game owns truth. NPCs own beliefs. The LLM owns neither.

Gate evidence:

- [x] authoritative world truth exists independently of dialogue;
- [x] Mara and Iven can hold contradictory beliefs about the same subject;
- [x] each NPC receives only its own relevant beliefs;
- [x] conflicting testimony remains belief-consistent;
- [x] generated answers do not mutate truth or silently synchronize beliefs;
- [x] provenance/confidence and selected belief IDs are inspectable;
- [x] deterministic tests and human browser playtest pass.

Evidence: issue **#14**, blocker **#16**, PRs **#15**, **#17**, **#18**, human PASS 2026-09-02.

---

# M2 — Memory & relationship — DONE

Implementation issue: **#19**. Main implementation: **PR #20**.

> Memories are structured game state, not raw model-written autobiography.

> Relationship state is authoritative game data. The LLM may express its consequences but may not silently create or mutate it.

Gate evidence:

- [x] meaningful explicit player interaction creates a compact structured Mara memory through game code;
- [x] generated dialogue alone cannot create arbitrary memories or relationship changes;
- [x] memory ownership is isolated per NPC;
- [x] the original interaction can disappear from the raw transcript;
- [x] a later relevant turn retrieves the stored memory deterministically;
- [x] Mara's later behavior changes because memory/relationship state is supplied;
- [x] unrelated turns do not blindly receive the memory;
- [x] relationship state changes only through explicit game rules and is inspectable;
- [x] traces record selected memory IDs and relationship snapshot;
- [x] structured state survives browser reload while dialogue history does not;
- [x] deterministic tests cover creation, retrieval, isolation and persistence;
- [x] human browser playtest confirms Mara appears to remember the earlier interaction.

Evidence: issue **#19**, PR **#20**, deployed Pages build and human PASS on 2026-09-02.

M2 is closed. Do not reopen it for future memory sophistication unless the core structured-memory hypothesis itself regresses.

---

# M3 — Information propagation — NOW

Implementation issue: **#21**.

## Hypothesis

The system becomes genuinely emergent when information can leave one conversation, travel through another character, preserve provenance, and later create a consequence not encoded as a handcrafted dialogue branch.

## Core rules

> Information transfer is a game-owned state transition. The LLM may phrase what characters say, but it may not directly grant another NPC knowledge.

> Provenance survives transfer. Hearsay does not become eyewitness evidence merely because it is repeated.

## Required outcome

- structured `ClaimedStatement` with source, recipient and provenance;
- one explicit player→Mara claim creation rule;
- one deterministic Mara→Iven social transfer event;
- belief update that preserves hearsay provenance and does not mutate `WorldFact`;
- duplicate/idempotency handling;
- debug visibility into claim → transfer → resulting Iven belief;
- traces that make Iven's later testimony explainable;
- deterministic fake/replay coverage.

## Exit gate — PASS only if all are true

- [ ] one structured claim is created through explicit game logic;
- [ ] generated dialogue alone cannot create or transfer authoritative information;
- [ ] original source and recipient are recorded;
- [ ] a deterministic social event transfers the claim from Mara to Iven;
- [ ] Iven's resulting belief preserves hearsay/provenance;
- [ ] objective world truth remains unchanged;
- [ ] transfer is idempotent and does not duplicate endlessly;
- [ ] Iven's later free-form testimony changes because the transferred belief is supplied;
- [ ] traces/debug expose the full causal chain;
- [ ] deterministic tests cover creation, transfer, provenance, isolation and truth immutability;
- [ ] human browser playtest confirms the delayed reaction feels causally connected rather than random.

## Explicitly not now

- background LLM conversations between NPCs;
- hundreds of autonomous gossip events;
- generic rumor network / town-scale knowledge graph;
- embeddings/vector DB;
- schedules/economy/factions;
- deception planner;
- automatic extraction of every player utterance into claims;
- full tavern mystery content.

## Gate unlocks

`M4 — Tavern mystery`.

---

# M4 — Tavern mystery — NEXT / BLOCKED

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

Run a blind human playtest. PASS-worthy evidence includes roughly 30 minutes of meaningful goals/questions, memorable unscripted interactions, causal social consequences, tolerable latency/UX and presentation that supports social presence.

The Studio Director cannot self-certify this gate. Human judgment is mandatory.

## Gate unlocks

`M5 — Product decision`.

---

# M5 — Product decision

Possible decisions: investigation/mystery game, broader social RPG, social sandbox, substantial pivot, or stop.

The exit gate is a written human decision based on M4 evidence. Only after a **continue** decision should Roadmap v2 / a production roadmap be created.

---

# Cross-cutting tracks

## Licensing / attribution

Always active when a third-party resource is adopted. Follow `docs/10-licensing-attribution.md`.

## Asset pipeline

Use `docs/09-asset-pipeline.md` only when the current milestone actually needs external assets. Do not bulk-ingest in advance.

## Visual direction

`docs/07-visual-direction.md` remains the north star. M4 is the first milestone requiring a representative art slice.

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
```

Before creating any issue, ask:

> If this issue succeeds, which unchecked condition in the current milestone gate becomes checked?

If the answer is “none”, the issue is premature.

# Status update discipline

Whenever a milestone advances:

1. update `Current state`;
2. update roadmap status (`NOW`, `NEXT / BLOCKED`, `LATER`, `DONE`, `STOPPED`);
3. link the evidence/issue/PR/playtest that passed the previous gate;
4. identify exactly one next milestone;
5. do not rewrite later milestone scope unless new evidence materially changes it.
