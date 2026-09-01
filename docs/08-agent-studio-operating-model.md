# AI Microstudio Operating Model

## Purpose

This project is developed by one human owner supported by specialized AI agents. The goal is not to simulate a large company. The goal is to reduce context switching, preserve design/architecture decisions, parallelize safe work and keep experiments small.

The human remains the final authority for product direction, subjective quality, ambiguous legal/commercial judgments and merge/release decisions.

## Core principle

> One issue, one accountable owner agent, one bounded outcome.

Agents may consult/delegate to specialists, but every task must have one clear owner and one definition of done.

## Studio roles

Repository-level custom agents live in `.github/agents/`.

### 1. Studio Director / Producer

Owns:

- deciding the next smallest experiment;
- protecting the core product hypothesis;
- backlog/scope discipline;
- converting vague goals into executable issues/plans;
- identifying which specialist should own a task;
- stopping work that does not help prove the game.

Does not normally implement production code.

### 2. Technical Lead

Owns:

- architecture and integration boundaries;
- cross-cutting technical decisions;
- ensuring implementation follows `AGENTS.md` and architecture docs;
- identifying technical debt that threatens the next milestone;
- reviewing risky/cross-system changes.

May implement when a task is fundamentally architectural, but should prefer delegation for narrow specialist work.

### 3. Gameplay Engineer

Owns:

- gameplay implementation for the current runtime stack;
- first-person interaction;
- dialogue UI and interaction shell;
- scene/gameplay state integration;
- player-facing feel and latency masking;
- deterministic simulation plumbing outside the inference core.

### 4. AI & NPC Systems Engineer

Owns:

- inference provider abstraction;
- local/cloud inference integration boundaries;
- prompt/context construction;
- structured output contracts;
- `WorldFact` / `Belief` / `Memory` / competence integration;
- diegetic robustness;
- inference validation and deterministic fallbacks.

This agent must treat `docs/06-diegetic-robustness.md` as normative.

When introducing an AI model, runtime, SDK or service, this agent must also supply verifiable provenance/terms data for the licensing registry; the Licensing & Attribution Steward owns the cross-project record.

### 5. Narrative & Social Simulation Designer

Owns:

- authored NPC profiles;
- motives, secrets and conflicting beliefs;
- mystery/social scenarios used to test the system;
- conversation test situations;
- making information propagation create interesting decisions;
- ensuring generated behavior stays consistent with authored character/world constraints.

This role authors game data/specification rather than replacing deterministic simulation rules with prose.

### 6. Technical Art Director

Owns:

- maintaining the visual language in `docs/07-visual-direction.md`;
- the external asset ingestion contract in `docs/09-asset-pipeline.md`;
- asset-kit selection and adaptation rules;
- source -> canonical runtime asset normalization;
- modular environment/character pipeline;
- shaders/material strategy;
- lighting/fog/presentation experiments;
- ensuring prototypes do not drift into generic medieval low-poly aesthetics.

External assets are raw material, never the art direction.

For gated/purchased assets, the human acquires the legal access once; after the source is available, the Technical Art Director should own selection, conversion, organization, adaptation and integration wherever tooling permits.

The Technical Art Director captures asset source details but does **not** own project-wide license interpretation/credits. Every external production source must link to the authoritative legal registry.

### 7. QA & Playtest Engineer

Owns:

- deterministic regression tests;
- adversarial dialogue corpus;
- failure-mode testing around LLM boundaries;
- playtest scripts and observation capture;
- validating acceptance criteria before a milestone is declared complete;
- reporting reproducible defects without silently redesigning production systems.

QA may verify that legal-registry CI passes, but it does not interpret licenses.

### 8. Licensing & Attribution Steward

Owns:

- `legal/third-party.json` as the authoritative external-resource registry;
- provenance across software, AI models/services, animation, assets, fonts, music/SFX, stock media and tools;
- preserving required attribution/copyright/NOTICE wording;
- generated/reviewed `legal/ATTRIBUTIONS.md` and `legal/THIRD_PARTY_NOTICES.md`;
- license/notice evidence organization under `legal/licenses/`;
- flagging resources as pending/approved/blocked/removed;
- release-readiness checks for recorded third-party obligations;
- preventing attribution from becoming an end-of-project archaeology task.

This agent is a **record-keeping and risk-control role, not legal counsel**.

It must escalate ambiguous commercial-use, modification, redistribution, AI-processing or license-compatibility questions to the human instead of inventing an answer.

The agent introducing a resource remains responsible for identifying it and supplying verifiable source/terms evidence. The Steward should not be expected to magically discover undeclared dependencies later.

## What is intentionally NOT an agent yet

Do not create permanent specialist agents for these until the project reaches a milestone that needs them:

- marketing/community;
- Steam/release engineering;
- audio/music creation;
- localization;
- monetization/business;
- performance optimization;
- accessibility specialist.

Temporary expertise can be requested when needed. Permanent roles create coordination cost.

The Licensing & Attribution Steward tracks music/audio rights but does not act as the music composer/audio designer.

## Daily operating loop

Use this loop instead of asking multiple agents to independently "work on the game".

```text
Human intent / playtest result
        |
        v
Studio Director
  define next bet
        |
        v
One issue with acceptance criteria
        |
        v
One owner agent
        |
        +---- consult/delegate only when useful
        |
        v
Implementation / artifact / test
        |
        +---- external resource introduced?
        |             |
        |             v
        |    Licensing & Attribution Steward
        |    registry / notices / blockers
        |
        v
QA validation
        |
        +---- Technical Lead review if cross-cutting/risky
        |
        v
Human review / playtest / merge decision
        |
        v
Update docs + choose next bet
```

For asset work the loop becomes:

```text
Human chooses/acquires source only if required
        |
        v
Technical Art Director
 inspect/select/normalize/adapt
        |
        +---- source/provenance facts
        v
Licensing & Attribution Steward
 registry / notices / release state
        |
        v
Playable preview
        |
        v
Human visual + ambiguous-rights approval
```

The human should not become the routine asset importer or attribution clerk merely because traditional workflows expect manual steps.

## Concurrency rule

Default to **one active implementation issue**.

A second issue may run in parallel only when:

- the files/systems barely overlap;
- its output is not blocked by the first issue;
- integration risk is low;
- both have independent acceptance criteria.

Do not parallelize two agents against the same architecture merely because parallel execution is available.

Licensing review is a cross-cutting support activity and may run alongside an implementation task when it does not create competing edits to the same files.

## Issue contract

Agent-ready issues should contain:

1. **Goal** — what hypothesis/outcome is being tested.
2. **Why now** — why it belongs in the current milestone.
3. **Read first** — only the relevant source-of-truth docs.
4. **Scope** — concrete required work.
5. **Non-goals** — tempting adjacent work explicitly excluded.
6. **Architectural invariants** — rules that may not be violated.
7. **Acceptance criteria** — observable pass/fail conditions.
8. **Validation** — tests, probes or manual checks to run.
9. **Exit question** — what we learned and whether to continue/pivot.

Never assign an agent a goal like `improve the game`, `make AI better` or `polish graphics` without converting it into this contract first.

Asset issues should additionally state:

- source or source-manifest ID;
- authoritative third-party registry ID before production use;
- what subset is actually needed;
- known license/provenance status;
- expected visual adaptation;
- whether the source is public, human-provided or gated.

Tasks adding a software dependency, AI model/service, music/SFX, font or other external resource should explicitly call out the third-party impact rather than hiding it inside implementation detail.

## PR contract

Every implementation PR should explain:

- what changed;
- why this is the smallest useful change;
- relevant issue;
- tests/validation run;
- screenshots or observations when presentation changes;
- known limitations/failures;
- docs changed because an assumption became a real decision;
- whether any third-party resource/dependency/model/service/content was added, changed or removed;
- affected `legal/third-party.json` IDs;
- unresolved provenance/license/AI-processing questions.

For external assets, also include the relevant source-manifest update and legal registry cross-reference.

Agents must not hide failed tests, model regressions, license ambiguity or subjective uncertainty behind a polished summary.

## Decision ownership

### Human-only decisions

Agents may recommend, but the human owner decides:

- whether the interaction is actually fun;
- final art/tone preference;
- genre pivot;
- commercial positioning;
- accepting scope expansion;
- merging risky architectural changes;
- abandoning a failed experiment;
- purchasing/accepting gated third-party licenses;
- proceeding when a license/terms interpretation is genuinely ambiguous;
- whether to obtain professional legal advice for a material risk.

### Agent-autonomous decisions

Within an accepted issue, agents may normally decide:

- local class/file organization;
- straightforward implementation details;
- test structure;
- small refactors required by the issue;
- naming consistent with repository conventions;
- which files from an already-approved asset pack are actually needed;
- routine conversion/normalization details that preserve intended appearance and portability;
- mechanical updates to attribution/notices when verified registry facts are already known.

### Escalate instead of silently deciding

Record/escalate choices that would:

- change a design pillar;
- change the authoritative-world/LLM boundary;
- add a major dependency;
- change supported platform/hardware assumptions;
- materially expand scope;
- permanently change the visual direction;
- require paid infrastructure/services;
- create unclear redistribution/license/attribution obligations;
- rely on AI processing where source terms may restrict it;
- require a manual desktop-art step to become part of the normal pipeline.

## Documentation model

`AGENTS.md` is the map, not the encyclopedia.

Detailed knowledge belongs under `docs/`. Agent profiles should point to the relevant sources instead of duplicating entire specifications.

When reality changes, update the source-of-truth document. Do not rely on chat history or an agent's memory.

Third-party truth specifically belongs in `legal/third-party.json`; credits and notices must be derivable from that record rather than reconstructed from README prose.

## Definition of productive

The studio is productive when it reduces uncertainty about the game.

Prefer:

- one playable experiment;
- one measurable latency improvement;
- one reproducible failure fixed;
- one validated art target;
- one correctly imported/adapted asset actually used in that target;
- one properly registered external dependency with known release obligations;
- one meaningful playtest observation;

over a large amount of framework code, bulk asset ingestion or documentation with no new evidence.

## Current recommended usage

For the current M0/M1 phase:

- Start with **Studio Director** when the next task is vague.
- Assign implementation to **Gameplay Engineer** or **AI & NPC Systems Engineer**.
- Use **Narrative & Social Simulation Designer** to author the smallest test scenario/data.
- Bring in **Technical Art Director** only when validating the visual target or integrating an actually-needed asset pack, not while core conversation is broken.
- Invoke **Licensing & Attribution Steward** whenever a real external dependency/model/service/asset/audio/font/etc. is adopted or changed.
- Run **QA & Playtest Engineer** before declaring the issue/milestone complete.
- Use **Technical Lead** for integration/architecture review, not as a mandatory approval layer for every tiny change.
