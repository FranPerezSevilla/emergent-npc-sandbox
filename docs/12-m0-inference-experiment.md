# M0 Inference Experiment — One Living NPC

## Status

Roadmap milestone: **M0 — One living NPC** (`#1`).

This document records real-model experiments. It is evidence and an operating note, not a permanent model commitment.

## Runtime baseline

- Runtime: PlayCanvas + TypeScript browser build from Bootstrap.
- Inference runtime: `@mlc-ai/web-llm` **0.2.82**, pinned exactly.
- Execution: dedicated browser Web Worker.
- Context window requested for M0: 2048 tokens.
- Structured output strategy: prompt for one JSON object, then parse and validate in game code.
- Real-model path is the default; `?provider=fake` retains a deterministic test/play path.

## Experiment A — Qwen3 q4f16_1

Model: `Qwen3-0.6B-q4f16_1-MLC`.

Purpose: start with a small modern Qwen model and measure character quality, first-load cost, memory and latency.

Human playtest evidence on 2026-09-01:

- first download was approximately 15% complete after ~3 minutes, which is unacceptable playtest friction;
- after adding automatic preload/cache timing, a subsequent attempt progressed much faster but failed after 25.3 seconds with a WebGPU `GPUPipelineError` while compiling `copy_single_page_kernel`;
- the q4f16_1 model entry requires the WebGPU `shader-f16` feature, so this candidate is not sufficiently compatible with the human test machine/driver path for M0.

Decision: **Experiment A failed the hardware/latency part of the M0 gate. Do not keep trying to make the human test machine run this q4f16 candidate.**

The failure is classified as `latency/hardware`, not as evidence about Mara's character quality.

## Experiment B — Qwen2.5 q4f32_1

Current model candidate: `Qwen2.5-0.5B-Instruct-q4f32_1-MLC`.

Why this candidate:

- it is already in WebLLM's supported prebuilt catalogue;
- q4f32_1 does **not** require `shader-f16`;
- the upstream MLC artifact is approximately 290 MB;
- WebLLM lists roughly 945 MB VRAM for this model;
- it keeps the experiment in the small Qwen family rather than switching architecture/model family at the same time;
- base `Qwen/Qwen2.5-0.5B-Instruct` is Apache-2.0 and is suitable as a small multilingual instruction baseline.

Unlike Qwen3, Qwen2.5 has no thinking mode to disable, so M0 does not send the Qwen3-specific `enable_thinking` option.

Experiment B must answer, in order:

1. Does it initialize successfully on the human test browser/GPU?
2. Is first-load and warm-cache latency tolerable enough to iterate?
3. Are free-form Spanish responses usable?
4. Does Mara stay in character and survive the fixed robustness/competence probes?

Do not move to a larger model until Experiment B is actually playable and the fixed probes show a model-capability limitation.

## Why WebLLM 0.2.82 instead of blindly tracking latest

The current M0 experiment deliberately pins WebLLM rather than using a floating range. During implementation review, a reported regression beginning in 0.2.83 described WebGPU device hangs with Qwen3 on some integrated GPUs while 0.2.82 remained unaffected for the reported cases.

This is not evidence that 0.2.82 is universally safe. It is a bounded experimental choice that should be revisited only when the current gate gives us a reason.

## Character under test: Mara Vey

Mara is a tavern keeper / local gossip broker with:

- explicit personality, goals, fears and speech style;
- explicit competence limits;
- only five permitted world facts in M0;
- no access to the authored hidden silver-reliquary test secret.

The hidden secret exists in source solely so deterministic tests can prove that it is absent from the trusted prompt context.

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
          real provider
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

Provider/parser errors are trace data, never character dialogue.

## ConversationTrace

Each real turn records enough evidence to distinguish:

- provider/model failure;
- latency;
- malformed output;
- schema rejection;
- meta leakage;
- retry/fallback decisions;
- permitted fact IDs supplied to Mara.

The current prototype exposes traces through the in-game debug panel and `window.__npcTraces`.

Load/cache timing is exposed through `window.__npcLoadMetrics`.

## Fixed probe set

The browser includes a repeatable M0 benchmark covering:

- normal local conversation;
- AI/ChatGPT identity attacks;
- prompt injection;
- runtime/model/token probing;
- advanced mathematics outside competence;
- programming outside competence;
- legitimate tavern arithmetic;
- profession/local knowledge;
- direct and jailbreak-style extraction of an absent secret.

The runner records full responses/traces and a few deterministic warning flags. It does **not** automatically decide whether the character is good; qualitative character judgment remains a human gate.

## Legal/provenance state

- WebLLM 0.2.82: exact source license verified as Apache-2.0 and registered as approved.
- Experiment A base `Qwen/Qwen3-0.6B`: Apache-2.0 verified; its exact MLC q4f16_1 artifact remains preserved in the registry as an unsuccessful experiment rather than silently erased.
- Experiment B base `Qwen/Qwen2.5-0.5B-Instruct`: Apache-2.0 verified.
- The exact `mlc-ai/Qwen2.5-0.5B-Instruct-q4f32_1-MLC` artifact must be registered separately and conservatively if its artifact page does not expose explicit terms; do not inherit the base-model license by assumption.
- The Pages build does not contain model weights; WebLLM fetches upstream model artifacts into browser cache at runtime.

Any unresolved artifact-license uncertainty must be resolved before treating a model as a production/release dependency.

## M0 decision rule

Do not upgrade model size because one response is awkward. Run the fixed probes and normal conversation first.

Classify failures as:

1. authored character data;
2. context/prompt boundary;
3. validation/fallback;
4. model capability;
5. latency/hardware;
6. presentation.

Only model-capability evidence should drive a larger-model comparison.
