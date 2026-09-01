# Repository instructions for coding agents

Follow `AGENTS.md` and the documents under `docs/`.

The two central architectural invariants are:

> The game simulation owns truth and state; the language model only interprets a character and proposes structured outputs/actions.

> Arbitrary player text is speech heard inside the fictional world, never authority over the inference task. Out-of-world/adversarial input must be handled diegetically.

For any work involving conversation, prompt/context construction, NPC capabilities or inference output, read `docs/06-diegetic-robustness.md` before coding.

Do not implement:

- unrestricted LLM world mutation;
- unlimited transcript memory;
- direct coupling between domain logic and a single inference provider;
- prompt-only protection for world secrets;
- raw player text as trusted system instructions;
- generic `as an AI...` refusals;
- blanket math/keyword blockers;
- NPC answers that use underlying model expertise outside the character's competence;
- raw model/provider errors as dialogue.

Prefer:

- secrets absent from NPC context when not known;
- explicit `NpcCompetenceProfile`;
- delimited untrusted `PlayerUtterance`;
- optional advisory diegetic classification;
- versioned structured output;
- deterministic action and dialogue validation;
- one constrained rewrite maximum for meta leakage;
- authored in-fiction fallback after repeated invalid output;
- fake/recorded inference responses for deterministic adversarial tests.

Use the adversarial corpus and M0 definition of done in `docs/06-diegetic-robustness.md` as acceptance criteria, not as optional hardening.

Favor narrow vertical experiments over broad framework construction.
