# Legal / Third-Party Registry

This directory is the project's source of truth for provenance, licensing and attribution of external resources.

Read `docs/10-licensing-attribution.md` before adding or changing third-party resources.

## Files

- `third-party.json` — authoritative machine-readable registry.
- `ATTRIBUTIONS.md` — generated/reviewed creative/model/service attribution view.
- `THIRD_PARTY_NOTICES.md` — generated/reviewed software and third-party notice view.
- `licenses/` — license/copyright evidence stored when useful and permitted.

## Important distinction

A technology/resource mentioned in a design document is **not** automatically an adopted dependency.

Only register resources actually incorporated into the project, retained output/provenance, or build/runtime workflow.

## Status meanings

- `pending` — provenance/terms review is incomplete; prototype use may be isolated but it is not release-ready.
- `approved` — reviewed for the recorded intended use; `releaseAllowed` may be true when all material conditions are resolved.
- `blocked` — known unresolved/incompatible condition prevents intended use/release.
- `removed` — no longer used; retain the history when useful for provenance.

## Adding an entry

Use a stable lowercase ID, for example:

- `playcanvas-engine`
- `qwen-npc-model`
- `mixamo-npc-animations`
- `quaternius-medieval-village`
- `tavern-theme-example`

Never invent license facts. If information is unclear, record the uncertainty and escalate.

After editing the registry, run:

```bash
python tools/legal/validate_third_party.py
python tools/legal/generate_notices.py
```

CI runs validation automatically.

## Release rule

No record with a material unresolved condition should be represented as release-ready.
