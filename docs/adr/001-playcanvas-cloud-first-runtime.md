# ADR-001 — PlayCanvas cloud-first runtime

Status: Accepted
Date: 2026-09-01

## Decision

Use **PlayCanvas Engine + TypeScript + Vite** as the runtime/application stack for the first playable prototype.

Author the prototype as a code-first web project rather than making a desktop editor the primary source of truth.

Use the official PlayCanvas first-person starter or equivalent minimal code-first setup as the bootstrap reference. Keep scenes/game state inspectable and modifiable from the repository so coding agents can implement, review, test and deploy changes without requiring the human owner to run a local 3D editor.

## Primary workflow

```text
GitHub issue
   |
   v
owner agent / Codex
   |
   v
TypeScript + assets + tests
   |
   v
CI build
   |
   v
web preview/deployment
   |
   v
human opens browser and playtests
```

The human owner should not need Unity, Blender or the PlayCanvas Editor for routine code/gameplay iteration. The PlayCanvas Editor may still be used when it provides clear value, but it is not the authoritative project representation.

## Why

The project is intentionally agent-first and cloud-first. PlayCanvas Engine is a strong fit because:

- the game runs directly in a browser;
- source is ordinary TypeScript/JavaScript suitable for code agents and review;
- the official `create-playcanvas` workflow scaffolds Vite + TypeScript projects;
- PlayCanvas provides official agent skills for code-based projects;
- GLB/glTF assets fit the portable asset pipeline already defined in `docs/09-asset-pipeline.md`;
- previews can be deployed as static web builds;
- the first-person low-poly target does not require a heavyweight AAA editor/runtime.

## Initial application stack

Use:

- PlayCanvas Engine;
- TypeScript;
- Vite;
- a lightweight TypeScript test runner selected during bootstrap (Vitest is the current preference unless the scaffold dictates otherwise);
- GitHub Actions for deterministic CI;
- static web preview/deployment;
- PlayCanvas Skills generated/installed for compatible coding agents.

Pin real adopted dependency versions in the package manager/lockfile. Do not put `latest` into production/runtime source as a permanent version policy.

## Inference decision

This ADR does **not** lock the NPC inference provider.

The game must keep a provider abstraction. M-1 should begin with a deterministic `FakeInferenceProvider` so the whole browser/game/CI loop can be proven without inference complexity.

M0 then adds a real provider experiment. Browser-local inference (for example WebGPU/WebLLM-compatible models) is the preferred direction because it preserves the no-server/no-per-message-cost goal, but it must earn adoption through measured quality, latency, browser support and licensing tests.

Ollama remains useful as an optional development/provider experiment but is no longer a mandatory runtime assumption.

## Asset decision

Keep glTF 2.0 / GLB as the canonical portable 3D format. Runtime assets live through the project asset pipeline rather than engine-specific Unity prefabs/materials.

## Consequences

Positive:

- browser-playable previews;
- easier agentic code manipulation;
- fewer local-machine requirements for the human owner;
- simpler CI/deployment loop;
- less engine lock-in for source assets;
- direct alignment with the project's agent-first operating model.

Tradeoffs:

- smaller asset/plugin ecosystem than Unity;
- some sophisticated visual/editor workflows may require additional tooling;
- desktop-native packaging/inference decisions remain future work;
- browser/WebGPU variability must be measured before choosing local inference requirements.

## Superseded assumptions

Documentation/issues that still prescribe `Unity/C#` or `Ollama` as mandatory for M0 must be updated.

This ADR supersedes those implementation assumptions, but not the game's design pillars, AI authority boundaries, diegetic robustness rules, asset governance or visual direction.

## Revisit condition

Revisit the runtime only if a playable experiment demonstrates a concrete blocker that materially threatens the core game: required performance, asset workflow, browser capabilities, local inference, distribution or first-person presentation.

Do not revisit merely because another engine has more features.