# Bootstrap Runbook — PlayCanvas cloud loop

## Purpose

This runbook exists only for the current `BOOTSTRAP — Cloud playable loop` milestone.

The gate is successful when an agent can change repository code, CI can validate/build it, and the human can play the result in a browser without installing a game engine/editor.

## Stack

- PlayCanvas Engine
- TypeScript
- Vite
- browser DOM for the minimal conversation shell
- deterministic `FakeInferenceProvider`
- GitHub Actions
- GitHub Pages after merge to `main`

The Bootstrap intentionally uses a small kinematic first-person controller instead of adding Ammo/physics. Collision/jumping are not required to answer the current roadmap question and would add binary/runtime complexity before it is justified.

## Local or cloud development

Requires Node `>=22.23.2`.

```bash
npm install
npm run dev
```

The Vite server listens on all interfaces so Codespaces/cloud environments can expose it as a forwarded port.

## Deterministic validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Or all together:

```bash
npm run check
```

No real model/provider is needed.

## Browser path to validate

1. Open the build/preview.
2. Click the 3D scene to capture the mouse.
3. Move with WASD and mouse look.
4. Approach the purple placeholder NPC, Mara.
5. Face her until `E — Talk to Mara` appears.
6. Press E.
7. Type arbitrary text and press Send.
8. Confirm a deterministic structured fake-provider response appears.
9. Close conversation and continue moving.

## Deployment

Pull requests run deterministic checks/builds.

Pushes to `main` additionally deploy `dist/` through GitHub Pages using the official Pages actions. The first Pages run may expose a repository/account configuration blocker; record that exact blocker instead of adding another hosting platform prematurely.

## Known Bootstrap limitations

- no collision/physics;
- no jump;
- no real LLM;
- no final art/assets;
- no package lock yet in the first scaffold commit — generate and commit it before declaring the Bootstrap gate complete;
- Pages URL is only considered proven after a successful `main` deployment and human browser playtest.

These are deliberate unless they block the Bootstrap exit gate.
