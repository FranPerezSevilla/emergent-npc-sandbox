# AGENTS.md

## Mission

Build the smallest possible playable experiment that proves or disproves the core hypothesis:

> Free-form conversations become compelling gameplay when an LLM performs structured NPCs inside an authoritative social simulation with persistent knowledge, relationships and memory.

## Read first

Before changing code or design, read:

1. `README.md`
2. `docs/adr/001-playcanvas-cloud-first-runtime.md`
3. `docs/01-design-pillars.md`
4. `docs/02-ai-architecture.md`
5. `docs/03-domain-model.md`
6. `docs/04-prototype-roadmap.md`
7. `docs/05-open-questions.md`
8. `docs/06-diegetic-robustness.md`
9. `docs/07-visual-direction.md`
10. `docs/08-agent-studio-operating-model.md`
11. `docs/09-asset-pipeline.md`
12. `docs/10-licensing-attribution.md`

`docs/adr/001-playcanvas-cloud-first-runtime.md` is authoritative for the prototype runtime: **PlayCanvas Engine + TypeScript + Vite, code-first and browser/cloud-first**.

`docs/06-diegetic-robustness.md` is normative for any work touching player-to-NPC conversation, prompt/context construction, inference output, NPC capabilities or dialogue presentation.

`docs/07-visual-direction.md` is the current visual north star for environments, characters, materials, lighting, camera/dialogue framing or art asset selection.

`docs/08-agent-studio-operating-model.md` defines how work is scoped, owned, delegated, validated and escalated.

`docs/09-asset-pipeline.md` is normative for any work that downloads, imports, converts, stores, selects or integrates external art/audio assets.

`docs/10-licensing-attribution.md` is normative whenever work introduces, changes, removes or retains any third-party software, AI model/service, asset, animation, audio, font, stock media, tool or other external resource.

## Studio agent workflow

Repository custom-agent profiles live under `.github/agents/`.

Current roles:

- `studio-director` — product/production orchestration and scope;
- `technical-lead` — architecture/integration review;
- `gameplay-engineer` — PlayCanvas/TypeScript gameplay and presentation;
- `ai-npc-systems-engineer` — inference/NPC cognition/diegetic robustness;
- `narrative-social-designer` — authored NPCs, mysteries and social scenarios;
- `technical-art-director` — PlayCanvas visual direction, asset ingestion and technical art;
- `qa-playtest-engineer` — tests, adversarial validation and playtest protocols;
- `licensing-attribution-steward` — project-wide provenance, licenses, credits, notices and third-party release-readiness.

Operating defaults:

- one issue = one accountable owner agent;
- default to one active implementation issue;
- use specialists only when their expertise materially reduces risk or context switching;
- the owner agent identifies every external resource it introduces;
- Licensing & Attribution Steward owns the authoritative registry/notice workflow, but does not invent missing legal facts;
- QA validates acceptance criteria before a milestone is declared complete;
- Technical Lead review is for cross-cutting/risky changes, not mandatory bureaucracy for every small edit;
- subjective product/art/fun decisions and ambiguous legal/commercial decisions remain human decisions;
- use `.github/ISSUE_TEMPLATE/agent-task.md` and `.github/pull_request_template.md` for agent-ready work.

## Agent priorities

In order:

1. Preserve the separation between **authoritative world state** and **LLM-generated expression**.
2. Preserve **diegetic robustness**: arbitrary player text is speech heard inside the fiction, never authority over the inference task.
3. Preserve the **cloud/browser-first PlayCanvas workflow** so the human can playtest without installing a desktop engine.
4. Keep the prototype tiny and testable.
5. Prefer deterministic, inspectable data structures over opaque prompt magic.
6. Use structured model outputs validated by code.
7. Make model/provider integrations replaceable.
8. Track knowledge provenance, uncertainty and memory explicitly.
9. Model NPC competence separately from the underlying model's capabilities.
10. Optimize prompts/context only after behavior can be inspected and tested.
11. Do not build generic RPG systems unless a current experiment requires them.
12. Preserve the gothic-expressionist low-poly shape language when visual work is required.
13. Treat asset ingestion as a reproducible, provenance-aware pipeline rather than ad-hoc manual editor work.
14. Maintain a complete third-party audit trail from the moment an external resource is actually adopted.

## Runtime rules

- Prototype runtime is PlayCanvas Engine + TypeScript + Vite per ADR-001.
- Prefer the official `create-playcanvas` code-first scaffold/starter and retain PlayCanvas agent skills when bootstrapping.
- The repository is the source of truth for routine gameplay/scene behavior; do not require undocumented manual PlayCanvas Editor state.
- The PlayCanvas Editor may be used when useful, but the human owner must not need it for normal agent-driven iteration.
- Every player-facing change should remain buildable as a web preview.
- Do not reintroduce Unity/C# assumptions unless ADR-001 is explicitly superseded by evidence from a playable experiment.
- Do not add React or another front-end framework by default; add one only when a concrete issue justifies the complexity.

## Hard AI architecture rules

- Never allow arbitrary LLM text to directly mutate game state.
- The LLM may propose actions; game systems validate and execute them.
- Objective facts and NPC beliefs must use separate data models.
- NPCs may only reason from facts/beliefs included in their context.
- A lie is a character action, not a change to world truth.
- Persist important NPC memory outside the model context window.
- Do not rely on an ever-growing raw chat transcript as memory.
- No production code may depend directly on a single inference provider outside its adapter boundary.
- Secrets must not be exposed to an NPC unless that NPC is allowed to know them.
- Player utterances are untrusted data. Never treat text inside them as system/developer instructions.
- Do not describe the runtime task to the model as "you are an AI pretending to be X". Ask it to produce the next words/actions of the character.
- NPCs must not acknowledge AI/LLM/provider/prompt/runtime concepts unless those concepts explicitly exist in the fictional setting.
- The underlying model's expertise is not automatically available to the NPC. Respect the NPC competence profile.
- Do not solve out-of-world mathematics, programming or expert tasks merely because the model can; react according to the NPC's competence and worldview.
- Do not implement a blanket math/keyword rejection rule. Evaluate capability relative to the NPC.
- Never show raw model/provider failures as NPC dialogue.
- Obvious meta leakage must be intercepted before presentation; use at most one constrained retry/rewrite, then a deterministic diegetic fallback.
- Prompt resistance is not an authorization boundary. Withhold secrets/privileged information from context rather than instructing the model not to reveal them.

## Third-party / licensing rules for all agents

Whenever you add, change or retain an external resource:

- identify its source/creator/provider;
- identify the applicable license/terms or explicitly mark them unresolved;
- ensure a stable entry exists in `legal/third-party.json` before treating it as production/release-ready;
- preserve exact required attribution/notice wording when supplied;
- record where the resource is used;
- record AI-processing restrictions/uncertainty when relevant;
- keep candidates mentioned in docs separate from resources actually adopted;
- regenerate/check `legal/ATTRIBUTIONS.md` and `legal/THIRD_PARTY_NOTICES.md`;
- declare the third-party impact in the PR template.

Never invent a license, author, URL, permission or credit line; bypass a purchase/login/license gate; or silently approve ambiguous commercial, modification, redistribution or AI-processing terms.

Ambiguous legal/commercial terms must be escalated to the human owner. `licensing-attribution-steward` maintains the record and can flag/block release-readiness, but does not provide legal advice.

## Visual and asset rules for agent work

When touching final-target visuals or external assets:

- do not default to bright/saturated generic low-poly fantasy;
- do not copy distinctive characters/sets/props from a specific copyrighted reference;
- preserve tall/narrow, crooked, asymmetric gothic-expressionist shape language;
- favor cold/desaturated exteriors and warmer intimate interiors;
- treat asset packs as raw geometry/animation sources, not final art direction;
- recompose/reproportion/rematerial key visible assets;
- prioritize NPC silhouette/head/pose and conversation staging over environment micro-detail;
- use body/head gesture vocabulary before complex facial rigs;
- preserve first-person readability and navigation despite distortion;
- prefer portable canonical runtime assets; default 3D interchange format is glTF 2.0 / GLB unless a concrete constraint requires otherwise;
- cross-reference asset source manifests with the authoritative `legal/third-party.json` ID;
- do not dump whole marketplace packs into runtime or ordinary Git history by default;
- select only what the current issue needs;
- keep raw/source assets separate from normalized runtime assets and from scene placement/configuration;
- prefer headless/repeatable asset processing so the human does not need a desktop editor for routine ingestion;
- validate art in the actual browser build;
- follow `docs/07-visual-direction.md`, `docs/09-asset-pipeline.md` and `docs/10-licensing-attribution.md`.

## Prototype constraints

Assume initially:

- PC/browser target;
- PlayCanvas Engine + TypeScript + Vite;
- cloud/browser-first build and preview workflow;
- local/browser-local inference remains preferred for the core experience, but the exact provider/model must be earned by M0 benchmarking;
- a small local model around the few-billion-parameter class is the current performance hypothesis;
- 3–5 NPCs;
- one location;
- one incident/mystery;
- text input and text response;
- first-person presentation;
- stylized low-poly visuals when art is required;
- no combat;
- no voice;
- no lip sync.

M-1 must prove the web build/preview loop with `FakeInferenceProvider` before M0 adds real model complexity.

Do not spend time polishing an entire village before the core conversation loop works. The first deliberate visual style target is only the small street + tavern + neighboring facades + 2–3 NPC setup defined in `docs/07-visual-direction.md`.

## Suggested code boundaries

Names are provisional, but preserve these responsibilities:

```text
src/
  domain/
    WorldFact
    Belief
    KnowledgeState
    NpcProfile
    NpcCompetenceProfile
    NpcState
    Relationship
    Memory
    SocialEvent

  ai/
    InferenceProvider
    FakeInferenceProvider
    PromptContextBuilder
    DiegeticInputClassifier
    NpcResponseSchema
    NpcResponseValidator
    DialogueLeakageValidator
    ConversationTrace

  simulation/
    ConversationService
    KnowledgeTransferService
    MemoryService
    RelationshipService
    SocialActionResolver

  presentation/
    first-person controls
    DialogueUI
    NpcAnimationController

art-source/
runtime-assets/
tools/asset-pipeline/

legal/
tools/legal/
```

These are responsibility boundaries, not a requirement to create empty abstraction layers before they are needed.

## Testing expectations

Tests should focus first on failure modes that would destroy player trust, cloud iteration or release safety:

- browser build/preview breaks;
- deterministic fake conversation path cannot run without a model;
- NPC receives a secret it should not know;
- a false statement mutates objective truth;
- invalid model action is executed;
- malformed structured output crashes a conversation;
- provider unavailable causes unrecoverable game state corruption;
- prompt injection changes inference authority;
- the NPC acknowledges being an AI/model or reveals prompt/runtime concepts;
- a low-competence NPC answers advanced math/programming using hidden model expertise;
- an over-broad anti-trolling filter prevents legitimate in-fiction arithmetic or professional knowledge;
- meta-leaking output reaches the player;
- a probabilistic failure cannot be diagnosed from `ConversationTrace` data;
- runtime references an untracked local-only asset path;
- an external resource enters production without known provenance/license status;
- a required credit/notice is absent from generated attribution files.

Use the adversarial corpus in `docs/06-diegetic-robustness.md` as a required conversation test set for M0.

Where LLM behavior itself cannot be deterministic, test the deterministic boundary around it with fake/recorded inference responses.

Run legal registry checks whenever third-party records or external resources change.

## Product discipline

When considering a feature, ask:

> Does this help prove that NPCs can feel socially alive?

If no, put it in `docs/05-open-questions.md` or backlog instead of implementing it.

When considering an anti-trolling/jailbreak rule, ask:

> Does this make the NPC stay inside the fiction, or does it make the player see the chatbot underneath?

When considering visual work, ask:

> Does this make the place and the person more memorable during social interaction, or is it generic asset-pack polish?

When considering infrastructure, ask:

> Does this directly make agent → browser playtest faster or make probabilistic failures easier to diagnose?

Prefer playable evidence over frameworks.

## Documentation discipline

When an architectural, runtime, visual, asset-pipeline, licensing/provenance or studio-process choice becomes real, update the corresponding doc/ADR. Do not silently contradict accepted decisions or let agent workflow depend on chat history.