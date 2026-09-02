# M1 remote provider follow-up

## Trigger

The M1 human playtest was blocked by Puter with `phone_verification_required`. This is an upstream account gate rather than a truth-vs-belief failure.

## Experiment D — OpenRouter browser OAuth PKCE

M1 switches the default remote inference path to OpenRouter using browser-side OAuth PKCE. No developer API key is embedded in the public Pages bundle and no application backend is required for this prototype experiment.

Model candidate: `openai/gpt-oss-20b:free`.

Reasons for this bounded experiment:

- OpenRouter documents OAuth PKCE for browser/user-facing applications and exchanges the authorization code for a user-controlled API key;
- the selected model currently has a free variant, so the M1 gate can be tested without introducing per-turn prototype cost;
- the existing provider-agnostic `InferenceProvider` boundary, Mara/Iven profiles, prompts, validation and traces remain unchanged;
- the model identifier is explicit rather than using a random free-model router, keeping M1 behavior comparable across turns.

The returned OpenRouter key is stored only in browser `sessionStorage` for the current tab/session. It is never committed to the repository.

## UX rule learned from Puter

Authentication, quota, network and upstream-provider failures are infrastructure state. They must be shown as non-diegetic system status and must not be presented as NPC dialogue.

## Release status

This is a prototype provider experiment. OpenRouter service/model terms and upstream hosting/privacy behavior remain subject to explicit release/legal review. Prototype success does not imply final production-provider selection.
