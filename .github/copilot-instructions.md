# Repository instructions for coding agents

Follow `AGENTS.md` and the documents under `docs/`.

The central architectural invariant is:

> The game simulation owns truth and state; the language model only interprets a character and proposes structured outputs/actions.

Do not implement unrestricted LLM world mutation, unlimited transcript memory, or direct coupling between domain logic and a single inference provider.

Favor narrow vertical experiments over broad framework construction.
