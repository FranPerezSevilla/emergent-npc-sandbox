# M0 Inference Experiment — One Living NPC

## Status

Roadmap milestone: **M0 — One living NPC** (`#1`).

This document records the first real-model experiment. It is evidence and an operating note, not a permanent model commitment.

## Experiment A

- Runtime: PlayCanvas + TypeScript browser build from Bootstrap.
- Inference runtime: `@mlc-ai/web-llm` **0.2.82**, pinned exactly.
- Execution: dedicated browser Web Worker.
- Model candidate: `Qwen3-0.6B-q4f16_1-MLC`.
- Context window requested for M0: 2048 tokens.
- Thinking mode: disabled for the NPC response task.
- Structured output strategy: prompt for one JSON object, then parse and validate in game code.
- Real-model path is the default; `?provider=fake` retains a deterministic test/play path.

## Why 0.2.82 instead of blindly tracking latest

The current M0 experiment deliberately pins WebLLM rather than using a floating range. During implementation review, a reported regression beginning in 0.2.83 described WebGPU device hangs with Qwen3 on some integrated GPUs while 0.2.82 remained unaffected for the reported cases.

This is not evidence that 0.2.82 is universally safe. It is a bounded experimental choice that should be revisited only when the current gate gives us a reason.

## Why Qwen3-0.6B first

M0 is testing whether the architecture can produce a convincing constrained character at acceptable browser latency. Starting with a small model makes download, memory and latency costs visible without prematurely assuming that a larger model is required.

If the fixed probe set shows that 0.6B is systematically too weak, the next comparison should reuse the exact same authored NPC, prompt contract, validators and probes with a larger compatible candidate such as the 1.7B class. Do not change several variables at once.

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
- Base `Qwen/Qwen3-0.6B`: Apache-2.0 verified.
- `mlc-ai/Qwen3-0.6B-q4f16_1-MLC`: model card verifies that it is the MLC q4f16_1 quantization and intended for WebLLM, but the reviewed artifact page does not expose an explicit license of its own. The project registry therefore keeps this exact quantized artifact **pending / not release-approved** instead of assuming terms.
- The Pages build does not contain model weights; WebLLM fetches the upstream model artifact into browser cache at runtime.

This uncertainty must be resolved before treating this exact model artifact as a production/release dependency.

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
