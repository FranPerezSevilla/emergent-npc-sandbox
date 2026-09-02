# Attributions

<!-- GENERATED FROM legal/third-party.json. Do not manually add authoritative records here. -->

## Software & runtimes

### @mlc-ai/web-llm

- Creator/provider: MLC community and contributors
- Registry ID: `webllm-0.2.82`
- License/terms: Apache License 2.0
- Source: https://github.com/mlc-ai/web-llm/tree/v0.2.82
- License/terms URL: https://github.com/mlc-ai/web-llm/blob/v0.2.82/LICENSE
- Review status: approved
- Attribution required: no
- Used in: `package.json`, `src/ai/webllm-inference-provider.ts`, `src/ai/webllm-worker.ts`
- Notes: Browser-local inference runtime pinned exactly for M0. Apache-2.0 was verified at the v0.2.82 source tag. Runtime is bundled with the browser application; preserve applicable Apache license/notice obligations.

### actions/checkout

- Creator/provider: GitHub, Inc. and contributors
- Registry ID: `github-actions-checkout-v7`
- License/terms: MIT License
- Source: https://github.com/actions/checkout
- License/terms URL: https://github.com/actions/checkout/blob/v7/LICENSE
- Review status: approved
- Attribution required: no
- Used in: `.github/workflows/legal-registry.yml`, `.github/workflows/bootstrap.yml`
- Notes: CI-only checkout action; not shipped with the game. v7 is the current stable major adopted for the Bootstrap.

### actions/configure-pages

- Creator/provider: GitHub, Inc.
- Registry ID: `github-actions-configure-pages-v6`
- License/terms: MIT License
- Source: https://github.com/actions/configure-pages
- License/terms URL: https://github.com/actions/configure-pages/blob/v6/LICENSE
- Review status: approved
- Attribution required: no
- Used in: `.github/workflows/bootstrap.yml`
- Notes: CI/deployment-only action used to configure GitHub Pages; not shipped with the game.

### actions/deploy-pages

- Creator/provider: GitHub, Inc.
- Registry ID: `github-actions-deploy-pages-v5`
- License/terms: MIT License
- Source: https://github.com/actions/deploy-pages
- License/terms URL: https://github.com/actions/deploy-pages/blob/v5/LICENSE
- Review status: approved
- Attribution required: no
- Used in: `.github/workflows/bootstrap.yml`
- Notes: CI/deployment-only action used to publish GitHub Pages; not shipped with the game.

### actions/setup-node

- Creator/provider: GitHub, Inc. and contributors
- Registry ID: `github-actions-setup-node-v7`
- License/terms: MIT License
- Source: https://github.com/actions/setup-node
- License/terms URL: https://github.com/actions/setup-node/blob/v7/LICENSE
- Review status: approved
- Attribution required: no
- Used in: `.github/workflows/bootstrap.yml`
- Notes: CI-only action used to configure Node.js; not shipped with the game.

### actions/upload-pages-artifact

- Creator/provider: GitHub, Inc.
- Registry ID: `github-actions-upload-pages-artifact-v5`
- License/terms: MIT License
- Source: https://github.com/actions/upload-pages-artifact
- License/terms URL: https://github.com/actions/upload-pages-artifact/blob/v5/LICENSE
- Review status: approved
- Attribution required: no
- Used in: `.github/workflows/bootstrap.yml`
- Notes: CI/deployment-only action used to package the Pages artifact; not shipped with the game.

### PlayCanvas Engine

- Creator/provider: PlayCanvas Ltd.
- Registry ID: `playcanvas-engine-2.21.4`
- License/terms: MIT License
- Source: https://github.com/playcanvas/engine/tree/v2.21.4
- License/terms URL: https://github.com/playcanvas/engine/blob/v2.21.4/LICENSE
- Review status: approved
- Attribution required: no
- Used in: `package.json`, `src/main.ts`
- Notes: Runtime 3D engine bundled into the browser build. Preserve the MIT copyright/license notice with distributed copies or substantial portions of the engine.

### Puter.js

- Creator/provider: Puter Technologies Inc.
- Registry ID: `puter-js-2-6-2`
- License/terms: Apache License 2.0
- Source: https://github.com/HeyPuter/puter/tree/main/src/puter-js
- License/terms URL: https://github.com/HeyPuter/puter/blob/main/src/puter-js/README.md#license
- Review status: approved
- Attribution required: no
- Used in: `package.json`, `src/ai/puter-inference-provider.ts`
- Notes: Frontend SDK adopted for M0 Experiment C. The Puter.js subproject and published package identify version 2.6.2 as Apache-2.0. This approval applies to the SDK software only and does not approve the hosted Puter service or any model accessed through it.

## Tools

### @playcanvas/eslint-config

- Creator/provider: PlayCanvas Ltd.
- Registry ID: `playcanvas-eslint-config-3.0.0-beta.8`
- License/terms: MIT License
- Source: https://github.com/playcanvas/eslint-config/tree/v3.0.0-beta.8
- License/terms URL: https://github.com/playcanvas/eslint-config/blob/v3.0.0-beta.8/LICENSE
- Review status: approved
- Attribution required: no
- Used in: `package.json`, `eslint.config.mjs`
- Notes: Development/CI lint configuration only; not shipped as game runtime content.

### ESLint

- Creator/provider: OpenJS Foundation and other contributors
- Registry ID: `eslint-9.39.5`
- License/terms: MIT License
- Source: https://github.com/eslint/eslint/tree/v9.39.5
- License/terms URL: https://github.com/eslint/eslint/blob/v9.39.5/LICENSE
- Review status: approved
- Attribution required: no
- Used in: `package.json`, `eslint.config.mjs`
- Notes: Development/CI lint tool only; not shipped as game runtime content. npm reports the 9.x line as unsupported; retained temporarily because it is the version in the current official PlayCanvas scaffold and is non-blocking for Bootstrap.

### TypeScript

- Creator/provider: Microsoft Corporation and contributors
- Registry ID: `typescript-6.0.3`
- License/terms: Apache License 2.0
- Source: https://github.com/microsoft/TypeScript/tree/v6.0.3
- License/terms URL: https://github.com/microsoft/TypeScript/blob/v6.0.3/LICENSE.txt
- Review status: approved
- Attribution required: no
- Used in: `package.json`, `tsconfig.json`
- Notes: Development/CI compiler and typechecker only; the TypeScript tool itself is not shipped in the game runtime bundle.

### Vite

- Creator/provider: VoidZero Inc. and Vite contributors
- Registry ID: `vite-8.2.1`
- License/terms: MIT License
- Source: https://github.com/vitejs/vite/tree/v8.2.1
- License/terms URL: https://github.com/vitejs/vite/blob/v8.2.1/LICENSE
- Review status: approved
- Attribution required: no
- Used in: `package.json`, `vite.config.ts`
- Notes: Development/build tool. It produces the static browser bundle but is not itself intentionally shipped as runtime content.

## AI models

### GPT-5.6 Luna via Puter AI Gateway

- Creator/provider: OpenAI; access mediated by Puter AI Gateway
- Registry ID: `gpt-5-6-luna-via-puter-m0`
- License/terms: Hosted model/service terms — release review pending
- Source: https://docs.puter.com/AI/chat/
- License/terms URL: https://puter.com/terms
- Review status: pending
- Attribution required: no
- Used in: `src/ai/puter-inference-provider.ts`
- Notes: Initial remote model identifier for M0 Experiment C. Puter documentation lists `gpt-5.6-luna` for puter.ai.chat(). Model weights are not distributed by this project; dialogue is transient runtime output. Exact upstream/provider output and commercial terms were not independently established here, so this model is prototype-only and not release-approved.

### MiniMax M3 (free) via OpenRouter

- Creator/provider: MiniMax; hosted by providers routed through OpenRouter
- Registry ID: `minimax-m3-free-via-openrouter-m1`
- License/terms: Model/provider/service terms — release review pending
- Source: https://openrouter.ai/minimax/minimax-m3:free
- License/terms URL: https://openrouter.ai/minimax/minimax-m3:free
- Review status: pending
- Attribution required: no
- Used in: `src/ai/openrouter-inference-provider.ts`
- Notes: Current explicit M1 prototype model selected after the prior gpt-oss free endpoint became unavailable. OpenRouter listed the endpoint as free with text output and response_format JSON support at review time. Free endpoint availability, rate limits, upstream provider privacy/data terms and commercial/release suitability remain release-blocking until explicitly reviewed.

### Qwen2.5-0.5B-Instruct q4f32_1 (MLC)

- Creator/provider: Qwen Team / MLC community
- Registry ID: `qwen2-5-0-5b-instruct-q4f32-1-mlc`
- License/terms: Quantized artifact license pending explicit verification; base Qwen2.5-0.5B-Instruct is Apache License 2.0
- Source: https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f32_1-MLC
- License/terms URL: https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct/blob/main/LICENSE
- Review status: pending
- Attribution required: no
- Used in: `src/ai/webllm-inference-provider.ts`
- Notes: Experiment B compatibility candidate. It loaded successfully on the human test machine, but the browser became unresponsive / effectively crashed on the first real NPC generation. It is no longer the default M0 path. The optional WebLLM adapter remains in source only as experimental evidence. Exact quantized-artifact terms remain unresolved, so release is not allowed.

## AI services

### OpenRouter

- Creator/provider: OpenRouter, Inc.
- Registry ID: `openrouter-ai-service-m1`
- License/terms: OpenRouter Terms of Service — release review pending
- Source: https://openrouter.ai/docs/guides/overview/auth/oauth
- License/terms URL: https://openrouter.ai/terms
- Review status: pending
- Attribution required: no
- Used in: `src/ai/openrouter-inference-provider.ts`
- Notes: M1 browser OAuth PKCE provider experiment. OpenRouter documents user-facing PKCE and user-controlled API keys, avoiding a developer key in the public Pages bundle. Prompt/output logging is opt-in at OpenRouter, while upstream model providers have their own retention/data terms. Prototype use only until service, end-user distribution, privacy and model-provider terms receive explicit release review.

### Puter AI Gateway

- Creator/provider: Puter Technologies Inc.
- Registry ID: `puter-ai-gateway-experiment-c`
- License/terms: Puter hosted-service terms — commercial/release review pending
- Source: https://developer.puter.com/ai/
- License/terms URL: https://puter.com/terms
- Review status: pending
- Attribution required: no
- Used in: `src/ai/puter-inference-provider.ts`
- Notes: Isolated M0 Experiment C service. Puter developer documentation explicitly supports frontend AI calls with no developer API key and a User-Pays model, but the public Terms of Service contain personal/non-commercial language and reference a separate developer agreement. Do not treat prototype success as commercial or release approval without human/legal review. Users authenticate with Puter and their Puter account is charged/allowanced for AI usage.
