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

## Read first

- `AGENTS.md`
- `docs/07-visual-direction.md`
- `docs/09-asset-pipeline.md`

## Source

- Source manifest ID or URL/file location:
- Provider:
- Public/free, purchased/gated, or custom:
- Known license status:
- Attribution requirement:
- AI-processing restriction known? yes/no/unknown:

Do not invent missing legal metadata. Mark unknowns explicitly.

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
- [ ] select required assets only;
- [ ] normalize 3D to GLB where practical;
- [ ] normalize scale/orientation/hierarchy;
- [ ] preserve required textures/materials;
- [ ] define collision needs;
- [ ] adapt prominent assets to visual bible;
- [ ] place validated output under `runtime-assets/`;
- [ ] integrate into actual scene/build;
- [ ] produce preview/screenshot if visual.

## Acceptance criteria

1. Provenance/license state is recorded.
2. No access control was bypassed.
3. Only the required subset is imported.
4. Runtime assets are portable/normalized where practical.
5. The build does not depend on an untracked local path.
6. The result visually belongs to this project rather than looking like an untouched asset pack.
7. No giant unnecessary source archive enters ordinary Git history.
8. Build/preview still runs.

## Validation

Describe the build/preview/test used to verify the import.

## Exit question

Did this import reduce the amount of custom art work while preserving the project's visual identity? What part of the process should become automated before the next import?
