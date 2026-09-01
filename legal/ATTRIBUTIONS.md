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

### Qwen2.5-0.5B-Instruct q4f32_1 (MLC)

- Creator/provider: Qwen Team / MLC community
- Registry ID: `qwen2-5-0-5b-instruct-q4f32-1-mlc`
- License/terms: Quantized artifact license pending explicit verification; base Qwen2.5-0.5B-Instruct is Apache License 2.0
- Source: https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f32_1-MLC
- License/terms URL: https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct/blob/main/LICENSE
- Review status: pending
- Attribution required: no
- Used in: `src/ai/webllm-inference-provider.ts`
- Notes: Active M0 compatibility candidate after the q4f16 Qwen3 experiment failed on the human test GPU. WebLLM includes this q4f32_1 model in its prebuilt catalogue without a shader-f16 requirement; the upstream MLC artifact is about 290 MB and WebLLM reports about 945 MB VRAM. Base Qwen/Qwen2.5-0.5B-Instruct is Apache-2.0, but the exact MLC artifact page was not treated as inheriting that license without explicit evidence. The project does not commit or redistribute model weights; WebLLM downloads the upstream artifact into browser cache at runtime.
