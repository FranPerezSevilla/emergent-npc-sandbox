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

**Current milestone:** `M4 — Tavern mystery`

**Current milestone issue:** `#30 — M4 — Tavern mystery`

**Current bounded slice:** `#39 — M4 playable slice — Put Corren and Nera in the browser scene`

**Previous milestone:** `M3 — Information propagation` — **DONE** via issue #21.

M3 evidence:

- game-owned `ClaimedStatement` and deterministic player→Mara→Iven propagation exist independently of generated prose;
- provenance survives transfer and Iven receives hearsay rather than magically gaining eyewitness knowledge;
- objective `WorldFact` remains unchanged;
- transfer is idempotent and inspectable;
- contextual dialogue intents and deterministic `SocialDialogueDecision` separate what the NPC knows from how they are inclined to handle it;
- free-form dialogue is allowed to omit or discount hearsay rather than being forced to recite all beliefs;
- source-focused dialogue preserves Mara as Iven's immediate source;
- session export captures conversations, traces, social decisions, beliefs, memories, relationships and M3 state;
- deterministic regression coverage passes;
- final human/session gate: **PASS 2026-09-02** — Iven distinguished own observation, skeptical hearsay, source attribution and challenge behavior coherently.

Playable URL: `https://franperezsevilla.github.io/emergent-npc-sandbox/`

Deterministic no-login URL: `https://franperezsevilla.github.io/emergent-npc-sandbox/?provider=fake`

**Next milestone if M4 passes:** `M5 — Product decision`.

Accepted runtime decision: `docs/adr/001-playcanvas-cloud-first-runtime.md`.

## Roadmap at a glance

| Stage | Status | Core question | Exit gate | Primary owner |
|---|---|---|---|---|
| **BOOTSTRAP** | **DONE** | Can agents hand the human a browser-playable result without a local engine/editor? | Agent → CI → Pages → human playtest | Gameplay Engineer |
| **M0 — One living NPC** | **DONE** | Can one constrained AI NPC feel like a character rather than a chatbot? | Real conversation + adversarial/competence/secret QA + human judgment | AI & NPC Systems + QA |
| **M1 — Truth vs belief** | **DONE** | Can two NPCs disagree without the model rewriting objective truth? | Conflicting testimony with stable authoritative truth and inspectable beliefs | AI & NPC Systems Engineer |
| **M2 — Memory & relationship** | **DONE** | Can a later conversation meaningfully depend on an earlier one? | Persisted prior interaction changes later behavior | AI & NPC Systems Engineer |
| **M3 — Information propagation** | **DONE** | Can information travel socially and cause a delayed consequence? | A tells B; B later reacts without a handcrafted dialogue branch | AI + Narrative/Social |
| **M4 — Tavern mystery** | **NOW** | Is the combined social system actually fun for ~30 minutes? | Blind human playtest produces memorable unscripted moments | Studio Director + Human |
| **M5 — Product decision** | **NEXT / BLOCKED** | What game, if any, has the prototype earned the right to become? | Human chooses investigation/social RPG/sandbox/pivot/stop | Human owner |

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

# M3 — Information propagation — DONE

Implementation issue: **#21**.

> Information transfer is a game-owned state transition. The LLM may phrase what characters say, but it may not directly grant another NPC knowledge.

> Provenance survives transfer. Hearsay does not become eyewitness evidence merely because it is repeated.

Gate evidence:

- [x] one structured claim is created through explicit game logic;
- [x] generated dialogue alone cannot create or transfer authoritative information;
- [x] original source and recipient are recorded;
- [x] deterministic Mara→Iven transfer works;
- [x] Iven's resulting belief preserves hearsay/provenance;
- [x] objective world truth remains unchanged;
- [x] transfer is idempotent;
- [x] later testimony can depend on transferred information;
- [x] traces/debug/session export expose the causal chain;
- [x] contextual intent chips reduce typing friction without replacing free text;
- [x] deterministic social metabehavior distinguishes knowledge from disclosure/attitude;
- [x] human browser/session playtest passes.

Evidence: issue **#21**, PRs **#22**, **#24**, **#29**, final exported-session PASS on 2026-09-02.

M3 is closed. Future rumor sophistication belongs inside a concrete M4 need, not as a standalone infrastructure project.

---

# M4 — Tavern mystery — NOW

Milestone issue: **#30**.

Current bounded slice: **#39 — Put Corren and Nera in the browser scene**.

## Hypothesis

The combined systems create enough agency, surprise and social coherence to support an enjoyable ~20–30-minute experience.

M4 exists to discover the product direction rather than assume it. The mystery is prototype content, not a final narrative commitment.

## Scope

- one tavern + minimal surrounding slice;
- 3–5 meaningful NPCs;
- one authored incident/mystery;
- one objective hidden truth;
- partial/contradictory knowledge;
- at least one intentional liar and one sincere incorrect belief;
- relationships/memories;
- information propagation;
- free-form interrogation plus contextual intent chips;
- minimal physical evidence/inspection;
- accusation/conclusion outcome derived from authoritative state;
- representative gothic-expressionist visual slice;
- diegetic robustness and evidence fidelity retained.

## Completed M4 slices

### #31 — Evidence verbalization fidelity — DONE

PR #32 added a bounded deterministic guardrail:

> Tone may be embellished. Evidence may not.

The guardrail targets source count, source time/place, directness, inference→eyewitness upgrades and certainty upgrades while preserving the NPC's freedom to omit, discount, refuse or reinterpret available information.

### #33 — The Ash Letter case design — DONE

The disposable prototype case is authored in `docs/14-m4-ash-letter-case.md`. It fixes the objective timeline, four-NPC knowledge/belief/lie matrix, evidence E1–E5, relationship and propagation hooks, accusation states and plausible wrong paths.

### #35 — Authoritative case state & evidence — DONE

PR #36 established a private `m4-ash-letter` truth definition plus the fixed E1–E5 evidence registry. Player-discovered evidence starts empty, only explicit game code can discover it, discovery is idempotent/persistent, arbitrary model prose cannot create clues, and the culprit/private truth remains outside ordinary NPC prompts.

### #37 — Corren/Nera testimony & lie policies — DONE

PR #38 added distinct Corren and Nera profiles, isolated private case knowledge and deterministic authored cover-story selection. The model may perform an active cover but cannot activate, break or rewrite it. Evidence-fidelity validation constrains even authorized lies, and traces expose the active policy for QA without placing it in normal dialogue UI.

## Active slice

### #39 — Put Corren and Nera in the browser scene — NOW

Make the four-person Ash Letter cast human-testable in the deployed browser build before adding more mystery transitions.

The slice places Mara, Iven, Corren and Nera in the existing small PlayCanvas scene, wires only the owning testimony context into Corren/Nera, retains free text and the M0–M3 regression paths, provides a deterministic no-login fake mode, and exports four-NPC conversation/trace/M4 state evidence.

This remains an early testimony test. It does not yet implement Corren's lie-break, Nera's trust-sensitive disclosure, E3/E4 physical inspection or accusation/resolution.

## Exit gate

- [ ] one coherent authored mystery has stable objective truth independent of model prose;
- [ ] 3–5 NPCs have distinct motives, beliefs, knowledge and social policies;
- [ ] at least one NPC lies intentionally and at least one is sincerely wrong;
- [ ] no NPC receives secrets they should not know;
- [ ] player can investigate via both intent chips and free text;
- [ ] observation/hearsay/source distinctions remain causally inspectable;
- [ ] evidence-bearing model prose cannot invent critical clue details;
- [ ] memory/relationship produces at least one meaningful delayed consequence;
- [ ] information propagation produces at least one meaningful delayed consequence;
- [ ] player can inspect the minimum physical evidence required to cross-check testimony;
- [ ] player can make a conclusion/accusation and receive an outcome derived from authoritative state;
- [ ] deterministic regression coverage keeps M0–M3 invariants intact;
- [ ] session export is sufficient to diagnose the blind playtest;
- [ ] representative visual/audio presentation supports social presence without dominating scope;
- [ ] human completes a blind playtest of roughly 20–30 minutes without needing developer explanation;
- [ ] human reports at least one memorable unscripted interaction and finds the experience worth continuing.

## Explicitly not now

- second mystery;
- procedural mystery generation;
- generic deception planner;
- town-scale rumor graph;
- autonomous background LLM conversations at scale;
- vector DB / embeddings by default;
- schedules/economy/factions;
- combat/inventory/loot;
- full production art pass;
- voice/lip sync;
- monetization/store work.

## Gate unlocks

`M5 — Product decision`.

---

# M5 — Product decision — NEXT / BLOCKED

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
