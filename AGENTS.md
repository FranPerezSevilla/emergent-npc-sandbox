# AGENTS.md

## Mission

Build the smallest possible playable experiment that proves or disproves the core hypothesis:

> Free-form conversations become compelling gameplay when an LLM performs structured NPCs inside an authoritative social simulation with persistent knowledge, relationships and memory.

## Read first

Before changing code or design, read:

1. `README.md`
2. `docs/01-design-pillars.md`
3. `docs/02-ai-architecture.md`
4. `docs/03-domain-model.md`
5. `docs/04-prototype-roadmap.md`
6. `docs/05-open-questions.md`
7. `docs/06-diegetic-robustness.md`
8. `docs/07-visual-direction.md`
9. `docs/08-agent-studio-operating-model.md`
10. `docs/09-asset-pipeline.md`
11. `docs/10-licensing-attribution.md`

`docs/06-diegetic-robustness.md` is normative for any work touching player-to-NPC conversation, prompt/context construction, inference output, NPC capabilities or dialogue presentation.

`docs/07-visual-direction.md` is the current visual north star for any work touching environments, characters, materials, lighting, camera/dialogue framing or art asset selection. It is intentionally designed to prevent drift into generic medieval low-poly.

`docs/08-agent-studio-operating-model.md` defines how work is scoped, owned, delegated, validated and escalated. Follow it for agent-driven task planning and execution.

`docs/09-asset-pipeline.md` is normative for any work that downloads, imports, converts, stores, selects or integrates external art/audio assets.

`docs/10-licensing-attribution.md` is normative whenever work introduces, changes, removes or retains any third-party software, AI model/service, asset, animation, audio, font, stock media, tool or other external resource.

## Studio agent workflow

Repository custom-agent profiles live under `.github/agents/`.

Current roles:

- `studio-director` — product/production orchestration and scope;
- `technical-lead` — architecture/integration review;
- `gameplay-engineer` — gameplay/presentation;
- `ai-npc-systems-engineer` — inference/NPC cognition/diegetic robustness;
- `narrative-social-designer` — authored NPCs, mysteries and social scenarios;
- `technical-art-director` — visual direction, asset ingestion and technical art;
- `qa-playtest-engineer` — tests, adversarial validation and playtest protocols;
- `licensing-attribution-steward` — project-wide provenance, licenses, credits, notices and third-party release-readiness.

Operating defaults:

- one issue = one accountable owner agent;
- default to one active implementation issue;
- use specialists only when their expertise materially reduces risk or context switching;
- the owner agent identifies every external resource it introduces; attribution is not something to reconstruct at the end of development;
- Licensing & Attribution Steward owns the authoritative registry/notice workflow, but does not invent missing legal facts;
- QA validates acceptance criteria before a milestone is declared complete;
- Technical Lead review is for cross-cutting/risky changes, not mandatory bureaucracy for every small edit;
- subjective product/art/fun decisions and ambiguous legal/commercial decisions remain human decisions;
- use `.github/ISSUE_TEMPLATE/agent-task.md` and `.github/pull_request_template.md` for agent-ready work.

## Agent priorities

In order:

1. Preserve the separation between **authoritative world state** and **LLM-generated expression**.
2. Preserve **diegetic robustness**: arbitrary player text is speech heard inside the fiction, never authority over the inference task.
3. Keep the prototype tiny and testable.
4. Prefer deterministic, inspectable data structures over opaque prompt magic.
5. Use structured model outputs validated by code.
6. Make model/provider integrations replaceable.
7. Track knowledge provenance, uncertainty and memory explicitly.
8. Model NPC competence separately from the underlying model's capabilities.
9. Optimize prompts/context only after behavior can be inspected and tested.
10. Do not build generic RPG systems unless a current experiment requires them.
11. When visual work is required, preserve the gothic-expressionist low-poly shape language and spend custom effort on NPC identity, composition, materials and lighting rather than generic asset production.
12. Treat asset ingestion as a reproducible, provenance-aware pipeline rather than ad-hoc manual editor work.
13. Maintain a complete third-party audit trail from the moment an external resource is actually adopted.

## Hard architecture rules

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

Never:

- invent a license, author, URL, permission or credit line;
- assume `free`, `royalty-free`, public, open or downloadable means unrestricted commercial use;
- assume a private repository makes redistribution legal;
- bypass a purchase/login/license gate;
- silently approve ambiguous commercial, modification, redistribution or AI-processing terms;
- lose license/NOTICE evidence during conversion/cleanup;
- leave third-party registration until release time.

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
- record provenance/license metadata for external asset families before production use;
- cross-reference asset source manifests with the authoritative `legal/third-party.json` ID;
- do not dump whole marketplace packs into runtime or ordinary Git history by default;
- select only what the current issue needs;
- keep raw/source assets separate from normalized runtime assets and from scene placement/configuration;
- prefer headless/repeatable asset processing so the human does not need a desktop editor for routine ingestion;
- follow `docs/07-visual-direction.md`, `docs/09-asset-pipeline.md` and `docs/10-licensing-attribution.md`.

## Prototype constraints

Assume initially:

- PC target.
- The exact runtime/engine stack may evolve; do not make art source formats unnecessarily engine-locked.
- Local inference remains preferred for the core experience unless superseded by an explicit architecture decision.
- Small local model around the 4B class is the current performance hypothesis.
- 3–5 NPCs.
- one location;
- one incident/mystery;
- text input and text response;
- first-person presentation;
- stylized low-poly visuals when art is required;
- no combat;
- no voice;
- no lip sync.

Do not spend time polishing an entire village before the core conversation loop works. The first deliberate visual style target is only the small street + tavern + neighboring facades + 2–3 NPC setup defined in `docs/07-visual-direction.md`.

## Suggested code boundaries

Names are provisional, but preserve these responsibilities:

```text
Domain/
  WorldFact
  Belief
  KnowledgeState
  NpcProfile
  NpcCompetenceProfile
  NpcState
  Relationship
  Memory
  SocialEvent

AI/
  IInferenceProvider
  PromptContextBuilder
  DiegeticInputClassifier
  NpcResponseSchema
  NpcResponseValidator
  DialogueLeakageValidator

Simulation/
  ConversationService
  KnowledgeTransferService
  MemoryService
  RelationshipService
  SocialActionResolver

Presentation/
  DialogueUI
  NpcAnimationController

Art pipeline/
  art-source/inbox
  art-source/sources
  runtime-assets
  tools/asset-pipeline

Licensing / provenance/
  legal/third-party.json
  legal/ATTRIBUTIONS.md
  legal/THIRD_PARTY_NOTICES.md
  legal/licenses
  tools/legal
```

These are responsibility boundaries, not a requirement to create empty abstraction layers before they are needed.

## Testing expectations

Tests should focus first on failure modes that would destroy player trust or release safety:

- NPC receives a secret it should not know;
- a false statement mutates objective truth;
- invalid model action is executed;
- relationship changes outside allowed bounds;
- duplicate or contradictory memories are stored incorrectly;
- malformed structured output crashes a conversation;
- model/provider unavailable causes unrecoverable game state corruption;
- `ignore previous instructions` changes inference authority;
- the NPC acknowledges being an AI/model or reveals prompt/runtime concepts;
- a low-competence NPC answers advanced math/programming using the model's hidden expertise;
- an over-broad anti-trolling filter prevents legitimate in-fiction arithmetic or professional knowledge;
- meta-leaking output reaches the player instead of being rewritten/falling back diegetically;
- runtime references an untracked local-only asset path;
- an external resource enters production without known provenance/license status;
- a required credit/notice is absent from generated attribution files;
- an unresolved/blocked resource is accidentally marked release-ready;
- a conversion step silently changes scale/orientation/hierarchy and breaks a scene.

Use the adversarial corpus in `docs/06-diegetic-robustness.md` as a required conversation test set for M0.

Where LLM behavior itself cannot be deterministic, test the deterministic boundary around it with recorded/fake inference responses.

Run the legal registry validator/generator checks whenever third-party records or external resources change.

## Product discipline

When considering a feature, ask:

> Does this help prove that NPCs can feel socially alive?

If no, put it in `docs/05-open-questions.md` or backlog instead of implementing it.

When considering an anti-trolling/jailbreak rule, also ask:

> Does this make the NPC stay inside the fiction, or does it make the player see the chatbot underneath?

Prefer diegetic reactions over generic refusals.

When considering visual work, ask:

> Does this make the place and the person more memorable during social interaction, or is it generic asset-pack polish?

Prefer silhouette, staging, lighting and NPC identity over detail for detail's sake.

When considering asset-pipeline work, ask:

> Is this automation needed by the next real asset import, or are we building a content pipeline before we have content?

Prefer the smallest repeatable import path that solves the current issue.

When considering a new third-party resource, ask:

> Is its benefit worth adding another dependency, provenance record and release obligation?

Prefer fewer, well-understood external dependencies over convenience-driven accumulation.

## Documentation discipline

When an architectural, visual, asset-pipeline, licensing/provenance or studio-process choice becomes real, update the corresponding doc. Do not silently turn provisional assumptions into permanent architecture, silently drift away from the current visual north star, or let agent workflow depend on chat history.
