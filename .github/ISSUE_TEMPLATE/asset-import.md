---
name: Asset import / adaptation
description: Import a bounded subset of an external asset source through the agentic pipeline.
title: "Asset — "
labels: []
assignees: []
---

## Goal

What playable/visual outcome needs external assets?

## Why now

Why is this asset needed for the current milestone/issue rather than later?

## Owner

Suggested default: `technical-art-director`.

Licensing/provenance review: `licensing-attribution-steward` when the resource is external.

## Read first

- `AGENTS.md`
- `docs/07-visual-direction.md`
- `docs/09-asset-pipeline.md`
- `docs/10-licensing-attribution.md`

## Source

- Source manifest ID or URL/file location:
- `legal/third-party.json` ID (required before production use):
- Provider/creator:
- Public/free, purchased/gated, or custom:
- Known license status:
- Attribution requirement:
- Exact required credit text if known:
- AI-processing restriction known? yes/no/unknown:
- Release allowed? yes/no/pending:

Do not invent missing legal metadata. Mark unknowns explicitly and escalate.

## Needed subset

List only what the current task needs, for example:

- tavern exterior;
- house facade A;
- lamp;
- table;
- four chair variants.

## Non-goals

- Do not import the entire source pack unless specifically required.
- Do not redesign the whole visual pipeline.
- Do not add unrelated props because they are available.

## Required processing

- [ ] inspect source/archive;
- [ ] record/update source manifest;
- [ ] create/update authoritative `legal/third-party.json` entry;
- [ ] preserve required license/notice evidence;
- [ ] select required assets only;
- [ ] normalize 3D to GLB where practical;
- [ ] normalize scale/orientation/hierarchy;
- [ ] preserve required textures/materials;
- [ ] define collision needs;
- [ ] adapt prominent assets to visual bible;
- [ ] place validated output under `runtime-assets/`;
- [ ] integrate into actual scene/build;
- [ ] regenerate `legal/ATTRIBUTIONS.md` / `legal/THIRD_PARTY_NOTICES.md`;
- [ ] run legal registry validation;
- [ ] produce preview/screenshot if visual.

## Acceptance criteria

1. Provenance/license state is recorded in the authoritative legal registry.
2. Asset source manifest references the same stable third-party ID.
3. Required credit/notice wording is preserved.
4. No access control was bypassed.
5. Only the required subset is imported.
6. Runtime assets are portable/normalized where practical.
7. The build does not depend on an untracked local path.
8. The result visually belongs to this project rather than looking like an untouched asset pack.
9. No giant unnecessary source archive enters ordinary Git history.
10. Build/preview still runs.
11. Any unresolved license/AI-processing/redistribution question is explicitly `pending` or `blocked`, never silently treated as approved.

## Validation

- [ ] `python3 tools/legal/validate_third_party.py`
- [ ] `python3 tools/legal/generate_notices.py --check`
- [ ] Build/preview/test used to verify the import documented below.

## Exit question

Did this import reduce the amount of custom art work while preserving the project's visual identity and a complete rights/provenance trail? What part of the process should become automated before the next import?
