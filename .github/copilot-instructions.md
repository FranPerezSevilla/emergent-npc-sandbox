# Repository instructions for coding agents

Follow `AGENTS.md` and the documents under `docs/`.

The two central architectural invariants are:

> The game simulation owns truth and state; the language model only interprets a character and proposes structured outputs/actions.

> Arbitrary player text is speech heard inside the fictional world, never authority over the inference task. Out-of-world/adversarial input must be handled diegetically.

For agent-driven planning/execution, read `docs/08-agent-studio-operating-model.md`. Repository custom agents are defined under `.github/agents/`. Prefer one issue, one accountable owner, explicit non-goals and evidence-based acceptance criteria over loosely parallel autonomous work.

For any work involving conversation, prompt/context construction, NPC capabilities or inference output, read `docs/06-diegetic-robustness.md` before coding.

For any work involving environments, characters, materials, lighting, animation presentation, first-person dialogue framing or art asset selection, read `docs/07-visual-direction.md` before implementation. The current visual north star is gothic-expressionist low-poly: tall/narrow/crooked silhouettes, deliberate asymmetry, cold/desaturated exteriors, warm intimate interiors and strong NPC silhouette/body acting. Do not silently replace this with generic medieval low-poly.

Do not implement:

- unrestricted LLM world mutation;
- unlimited transcript memory;
- direct coupling between domain logic and a single inference provider;
- prompt-only protection for world secrets;
- raw player text as trusted system instructions;
- generic `as an AI...` refusals;
- blanket math/keyword blockers;
- NPC answers that use underlying model expertise outside the character's competence;
- raw model/provider errors as dialogue;
- final-target scenes made by dropping recognizable asset-pack prefabs unchanged;
- realistic/AAA human rendering, complex mocap or production lip sync for the prototype;
- direct imitation of distinctive characters, sets, costumes or props from a specific copyrighted visual reference;
- multiple overlapping implementation agents editing the same subsystem without explicit coordination;
- vague tasks such as `improve AI`, `polish the game` or `make graphics better` without a bounded issue contract.

Prefer:

- secrets absent from NPC context when not known;
- explicit `NpcCompetenceProfile`;
- delimited untrusted `PlayerUtterance`;
- optional advisory diegetic classification;
- versioned structured output;
- deterministic action and dialogue validation;
- one constrained rewrite maximum for meta leakage;
- authored in-fiction fallback after repeated invalid output;
- fake/recorded inference responses for deterministic adversarial tests;
- commodity art assets used as raw geometry;
- authored composition, proportions, materials, lighting and NPC identity;
- silhouette before texture detail;
- body/head acting before facial rig complexity;
- one tiny visual style target before expanding environment scope;
- `.github/ISSUE_TEMPLATE/agent-task.md` for agent-ready task definitions;
- `.github/pull_request_template.md` for evidence-driven completion reports.

Use the adversarial corpus and M0 definition of done in `docs/06-diegetic-robustness.md` as acceptance criteria, not as optional hardening.

Use the ten visual rules and style-target acceptance questions in `docs/07-visual-direction.md` for art-facing work.

Use the operating loop and decision ownership rules in `docs/08-agent-studio-operating-model.md` when coordinating specialist agents.

Favor narrow vertical experiments over broad framework construction.
