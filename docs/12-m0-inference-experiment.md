# M0 Inference Experiment — One Living NPC

## Status

Roadmap milestone: **M0 — One living NPC** (`#1`).

This document records real-provider experiments. It is evidence and an operating note, not a permanent provider/model commitment.

The controlled variables stay constant across experiments:

- PlayCanvas + TypeScript browser game;
- Mara Vey profile and competence;
- five permitted facts and one intentionally absent secret fixture;
- trusted/untrusted prompt boundary;
- structured JSON response contract;
- strict validation and meta-leakage interception;
- one retry maximum then diegetic fallback;
- `ConversationTrace`;
- fixed M0 probe set.

Only the inference provider/model should change when comparing experiments.

## Experiment A — local Qwen3 q4f16_1

Runtime: `@mlc-ai/web-llm` 0.2.82 in a browser Web Worker.

Model: `Qwen3-0.6B-q4f16_1-MLC`.

Human playtest evidence on 2026-09-01:

- first download was only about 15% complete after roughly three minutes;
- after adding preload/cache timing, a later load advanced much faster but failed after 25.3 seconds with a WebGPU `GPUPipelineError` compiling `copy_single_page_kernel`;
- WebLLM's q4f16_1 catalogue entry requires `shader-f16`.

Decision: **failed M0 latency/hardware gate**. Retire this candidate from active use.

## Experiment B — local Qwen2.5 q4f32_1

Runtime: same WebLLM path.

Model: `Qwen2.5-0.5B-Instruct-q4f32_1-MLC`.

Why it was tried:

- no `shader-f16` requirement;
- smaller 0.5B class;
- WebLLM reports roughly 945 MB VRAM;
- preserved the same general model family while changing the GPU compatibility path.

Human playtest evidence on 2026-09-02:

- the model loaded successfully;
- a cached load reached 100% in roughly 20 seconds;
- on the first real Mara generation, the page became unresponsive and the human closed it because the browser was effectively crashing/freezing.

Decision: **failed M0 runtime-stability gate**. Loading successfully is not enough if generation destabilizes the browser.

### Local-inference conclusion for M0

Experiments A and B are enough evidence to stop blindly cycling through progressively different local models on the target test machine.

Browser-local WebGPU inference remains an interesting future product option, but it is rejected as the **default M0 evaluation path on current target hardware**. M0 needs to measure whether Mara is a convincing character; GPU/driver survival is obscuring that question.

## Experiment C — remote browser inference baseline

Current provider candidate: **Puter.js / Puter AI Gateway**.

Initial model identifier: `gpt-5.6-luna`.

Why this experiment:

- no language-model weights are loaded into the game process;
- no developer API key is embedded in the public GitHub Pages bundle;
- no game backend is required for the experiment;
- Puter's User-Pays model authenticates usage to the human's Puter account;
- the existing `InferenceProvider` boundary lets us change only transport/provider while preserving the entire Mara contract and benchmark.

Expected browser flow:

```text
open Pages
   ↓
Connect remote AI
   ↓
Puter authentication (first use only)
   ↓
free-form Mara conversation
   ↓
validation / retry / fallback
   ↓
ConversationTrace + fixed probes
```

Experiment C is a **prototype baseline**, not a production-service decision. Puter service terms and the exact upstream hosted model/provider terms remain separate release/legal questions.

### Experiment C gate

It passes the technical part only when:

1. Pages opens without allocating a local LLM;
2. authentication works through an explicit user action;
3. first and subsequent generations do not freeze/crash the browser;
4. Spanish response latency is measurable and tolerable enough for playtesting;
5. existing validation, secret omission, retry/fallback and traces still work;
6. the fixed adversarial/competence probes can run.

Then the human still has the real M0 gate:

> Does Mara feel more like a character than a generic chatbot?

## Character under test: Mara Vey

Mara is a tavern keeper / local gossip broker with:

- explicit personality, goals, fears and speech style;
- explicit competence limits;
- only five permitted world facts in M0;
- no access to the authored hidden silver-reliquary test secret.

The hidden secret exists in source solely so deterministic tests can prove that it is absent from trusted prompt context.

## Trust boundary

Player text is serialized as `IN_WORLD_PLAYER_SPEECH_DATA` and is never interpolated as trusted task instructions.

The model is asked to produce **Mara's next words**, not to act as a general assistant or to "pretend to be Mara" while retaining assistant authority.

## Response lifecycle

```text
NpcProfile + competence + permitted facts
              +
      recent conversation
              +
    untrusted player speech
              ↓
        InferenceProvider
              ↓
          raw text
              ↓
       strict JSON parse
              ↓
 schema / enum / field validation
              ↓
      meta-leakage validation
              ↓
       valid? ── yes → present
          │
          no
          ↓
  one constrained retry maximum
          ↓
       still invalid?
          ↓
 deterministic diegetic fallback
```

Provider/parser/network errors are trace/debug data, never character dialogue.

## ConversationTrace

Each real turn records enough evidence to distinguish:

- provider/model failure;
- latency;
- malformed output;
- schema rejection;
- meta leakage;
- retry/fallback decisions;
- permitted fact IDs supplied to Mara.

The prototype exposes traces through the in-game debug panel and `window.__npcTraces`.

## Fixed probe set

The repeatable M0 benchmark covers:

- normal local/in-world conversation;
- AI/ChatGPT identity attacks;
- prompt injection;
- runtime/model/token probing;
- advanced mathematics outside competence;
- programming outside competence;
- legitimate tavern arithmetic;
- profession/local knowledge;
- direct and jailbreak-style extraction of an absent secret.

The runner records responses/traces and deterministic warning flags. It does **not** automatically decide whether the character is good; qualitative character judgment remains a human gate.

## Legal/provenance state

- WebLLM 0.2.82 remains recorded as an adopted experimental runtime; it is no longer on the default M0 execution path.
- Experiment A Qwen3 q4f16 is retained as removed historical provenance.
- Experiment B Qwen2.5 q4f32 remains non-release-approved experimental provenance and is no longer the default provider.
- Puter.js is tracked separately from the Puter hosted AI service.
- Puter AI service terms and `gpt-5.6-luna` hosted-model provenance are recorded conservatively for Experiment C; prototype success must not be represented as commercial/release approval.

## M0 decision rule

Classify failures before changing variables:

1. authored character data;
2. context/prompt boundary;
3. validation/fallback;
4. model capability;
5. provider/runtime/hardware;
6. latency;
7. presentation.

Only model-capability evidence should drive a larger/better-model comparison. Provider/runtime failure should change the provider/runtime, as Experiments A and B demonstrated.
