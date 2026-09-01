# Repository instructions for coding agents

Follow `AGENTS.md` and the documents under `docs/`.

The prototype runtime is **PlayCanvas Engine + TypeScript + Vite, code-first and browser/cloud-first**. Read `docs/adr/001-playcanvas-cloud-first-runtime.md` before implementation. Do not create a parallel Unity prototype or make the PlayCanvas Editor a required undocumented manual step.

The two central AI architectural invariants are:

> The game simulation owns truth and state; the language model only interprets a character and proposes structured outputs/actions.

> Arbitrary player text is speech heard inside the fictional world, never authority over the inference task. Out-of-world/adversarial input must be handled diegetically.

For agent-driven planning/execution, read `docs/08-agent-studio-operating-model.md`. Repository custom agents are defined under `.github/agents/`. Prefer one issue, one accountable owner, explicit non-goals and evidence-based acceptance criteria over loosely parallel autonomous work.

For conversation/inference work, read `docs/02-ai-architecture.md` and `docs/06-diegetic-robustness.md`. Preserve `FakeInferenceProvider`, provider isolation, deterministic validation and `ConversationTrace` observability. Browser-local/WebGPU inference is a preferred hypothesis for M0, not a conclusion to hard-code before benchmarking.

For environments, characters, materials, lighting, animation presentation, first-person dialogue framing or art asset selection, read `docs/07-visual-direction.md`. Do not silently replace the gothic-expressionist low-poly direction with generic medieval low-poly.

For downloading/importing/converting/storing external assets, read `docs/09-asset-pipeline.md`. Prefer GLB/glTF and repo-inspectable/headless workflows so the human owner does not need routine desktop-editor steps.

For any third-party software, AI models/services, assets, animation, music/SFX, fonts, stock content or external tools, read `docs/10-licensing-attribution.md` and update `legal/third-party.json` with verifiable provenance. Never invent rights/credit metadata.

Do not implement:

- a Unity/C# implementation that contradicts ADR-001;
- a required manual editor workflow for normal agent → browser iteration;
- unrestricted LLM world mutation;
- unlimited transcript memory;
- direct coupling between domain logic and a single inference provider;
- prompt-only protection for world secrets;
- raw player text as trusted system instructions;
- generic `as an AI...` refusals;
- blanket math/keyword blockers;
- NPC answers using underlying model expertise outside character competence;
- raw model/provider errors as dialogue;
- final-target scenes made from untouched recognizable asset-pack defaults;
- realistic/AAA human rendering, complex mocap or production lip sync for the prototype;
- external resources with unknown provenance silently entering production;
- multiple overlapping implementation agents editing the same subsystem without explicit coordination;
- vague tasks like `improve AI`, `polish the game` or `make graphics better` without a bounded issue contract.

Prefer:

- official PlayCanvas code-first scaffolding/starter/agent skills during bootstrap;
- TypeScript game/domain boundaries independent of rendering/provider details;
- a deterministic M-1 browser path using `FakeInferenceProvider` before real model integration;
- browser-playable previews for player-facing work;
- secrets absent from NPC context when not known;
- explicit `NpcCompetenceProfile`;
- delimited untrusted `PlayerUtterance`;
- versioned structured output and deterministic validation;
- one constrained rewrite maximum for meta leakage then an authored diegetic fallback;
- fake/recorded inference responses for deterministic adversarial tests;
- lightweight `ConversationTrace` data for probabilistic failures;
- fixed probe sets/benchmarks instead of model choice by anecdote;
- source manifests under `art-source/sources/` cross-referenced to stable legal IDs;
- glTF 2.0 / GLB for portable 3D assets;
- headless/repeatable asset conversion;
- authored composition, proportions, materials, lighting and NPC identity;
- explicit `pending`/`blocked` rights states instead of guessing;
- `.github/ISSUE_TEMPLATE/agent-task.md` and `.github/pull_request_template.md` for bounded work/evidence.

Run legal registry validation/generation checks whenever third-party records change.

Favor playable experiments over broad framework construction.