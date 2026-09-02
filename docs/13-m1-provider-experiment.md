# M1 remote provider follow-up

## Trigger

The M1 human playtest was blocked by Puter with `phone_verification_required`. This is an upstream account gate rather than a truth-vs-belief failure.

## Experiment D — OpenRouter browser OAuth PKCE

M1 switches the default remote inference path to OpenRouter using browser-side OAuth PKCE. No developer API key is embedded in the public Pages bundle and no application backend is required for this prototype experiment.

### Model candidate history

Initial candidate: `openai/gpt-oss-20b:free`.

Human runtime result on 2026-09-02: OpenRouter returned HTTP 404 with `This model is unavailable for free`, so that endpoint failed the availability gate before M1 dialogue quality could be tested.

Current candidate: `minimax/minimax-m3:free`.

At the time of selection OpenRouter listed the MiniMax M3 free endpoint at zero token cost, with text output, high recent availability, and support for `response_format` JSON. The adapter therefore requests `response_format: { type: "json_object" }` while the existing deterministic response validator remains authoritative.

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
