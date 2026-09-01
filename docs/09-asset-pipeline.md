# Agentic Asset Pipeline

## Purpose

This document defines how external art assets enter the project without requiring the human owner to manually import, convert, configure or place them in a desktop editor.

The intended workflow is:

```text
Human acquires/provides source asset when necessary
        |
        v
Asset Inbox / source manifest
        |
        v
Technical Art Director agent
  inspect -> select -> convert -> normalize -> validate
        |
        v
Canonical runtime assets
        |
        v
Scene/game integration by code or engine tooling
        |
        v
Preview / playtest
```

The human should normally be responsible only for decisions or access that cannot be delegated legally or technically: purchasing an asset, accepting a license, logging into a gated store, or choosing between subjective visual alternatives.

Everything after the source asset becomes accessible to the project should be automatable where practical.

## Core principle

> The human supplies rights and direction; agents perform asset production.

External packs are raw material, not final art direction.

## Canonical asset strategy

### 3D interchange/runtime format

Use **glTF 2.0 / GLB** as the canonical portable 3D format unless a concrete engine/tool constraint requires otherwise.

Reasons:

- portable across engines and web runtimes;
- can include geometry, materials, textures, hierarchy, skinning and animation;
- easy for agents/tools to inspect and validate;
- reduces lock-in while the final runtime stack is still evolving.

Keep original FBX/OBJ/BLEND/etc. only when needed for provenance or reprocessing. Do not make engine-specific prefab/material metadata the only surviving source.

### Textures

Prefer ordinary portable image formats. Do not convert blindly merely to standardize extensions.

General preference:

- PNG when alpha/lossless preservation matters;
- WebP/JPEG where lossy compression is acceptable;
- keep source texture only if needed to regenerate runtime output.

### Animation

Prefer a normalized humanoid/rigged pipeline that can ultimately produce portable GLB animation assets or engine-compatible clips derived from a documented source.

## Repository layout

Target structure:

```text
art-source/
  inbox/
    README.md
  sources/
    example.yml

runtime-assets/
  README.md
  environment/
  characters/
  animations/
  textures/
  audio/

tools/
  asset-pipeline/
    README.md
```

`art-source/inbox/` is staging, not a permanent dumping ground.

`art-source/sources/` contains source/provenance manifests.

`runtime-assets/` contains only assets intentionally selected and normalized for the game.

The eventual runtime/build system may copy, transform or expose `runtime-assets/` through an engine-specific folder such as a web `public/assets/` directory. Do not make that build detail the source of truth.

## Intake modes

### 1. Public/free source URL — preferred when legally redistributable/downloadable

The agent may fetch a public asset when:

- the URL is publicly accessible without bypassing authentication/paywalls;
- the license permits the intended game use;
- the source and license are recorded in a manifest;
- any attribution requirement can be satisfied;
- there is no known restriction incompatible with the intended agentic processing workflow.

The agent must not assume that `free to download` means `free for commercial use` or `safe to redistribute`.

### 2. Purchased/gated/private source

The agent must **not** bypass a login, purchase flow, access control, DRM or license gate.

Human responsibility:

1. acquire/accept the asset legally;
2. make the source bundle available to the project/agent workspace using an approved private mechanism.

Preferred cloud-friendly persistence options, in order of simplicity for the current stage:

- a private GitHub Release asset or other private binary storage accessible to the coding environment;
- an explicitly provided file in the active agent/workspace session;
- Git LFS for selected reusable source binaries if long-term repository-versioned storage becomes necessary.

Do not commit a giant purchased source pack to ordinary Git history merely because it is convenient.

### 3. Human-created/custom source

Treat custom Blender/GLB/texture/animation files the same way: record provenance, preserve the source only when useful, and generate canonical runtime assets through the same validation path.

## Source manifest

Every external asset family that reaches production should have a small manifest under `art-source/sources/`.

Recommended fields:

```yaml
id: medieval-village-example
name: Medieval Village Example
provider: Example Provider
source_url: https://example.invalid/asset
license_name: Example License
license_url: https://example.invalid/license
acquired_by_human: false
redistribution_notes: "Do not redistribute original source archive"
ai_processing_notes: "No known incompatible restriction"
requested_scope:
  - tavern exterior
  - two house facades
  - table
  - chairs
notes: "Use as geometry source; replace/adapt materials and proportions"
```

Do not invent license metadata. If the license is unclear, stop the import and surface the uncertainty to the human.

## Technical Art Director responsibilities

When a new source is provided, the Technical Art Director should:

1. inspect the archive/files;
2. identify useful assets relevant to the current issue only;
3. read/record provenance and license constraints;
4. avoid importing the entire pack by default;
5. convert selected models to canonical GLB when useful;
6. preserve meaningful hierarchy/node names where possible;
7. normalize coordinate system, scale and orientation;
8. validate materials/textures;
9. optimize obvious waste without destructive premature optimization;
10. create/record collision strategy when required by gameplay;
11. adapt visible assets to `docs/07-visual-direction.md` through composition, proportions, materials and lighting rather than accepting default pack aesthetics;
12. place only validated runtime output under `runtime-assets/`;
13. update the source manifest/catalog when an asset enters or leaves production use;
14. provide a preview or screenshot/playable result when the issue is visual.

## Selection rule

If a pack contains 300 assets and the current issue needs six, import six.

Do not turn asset ingestion into collection building.

## Visual adaptation rule

For prominent final-target assets, at least one or more of these should normally change from the source-pack presentation:

- proportions;
- composition;
- material treatment;
- palette;
- lighting context;
- modular combination;
- silhouette;
- surrounding staging.

The goal is not random deformation. Changes must support the project's gothic-expressionist visual language and preserve first-person readability.

## Provenance / legal guardrails

Agents MUST:

- record where an external asset came from;
- record the known license or flag it as unresolved;
- preserve attribution requirements;
- respect restrictions on redistribution and modification;
- avoid uploading/licensing source content publicly when the source terms do not permit it;
- avoid using a source pack in an AI-processing workflow when its terms clearly prohibit the intended workflow;
- escalate ambiguous license terms instead of guessing.

Agents MUST NOT:

- bypass paid/login-gated access;
- remove license/attribution files merely to make the tree cleaner;
- assume a private repository automatically makes every redistribution legal;
- commit an entire asset marketplace package to source control without an explicit reason;
- use assets whose rights are unknown in a release candidate.

## Normalization contract

For each production 3D asset, the pipeline should eventually be able to answer:

- source manifest ID;
- canonical runtime file path;
- approximate scale/unit convention;
- forward/up orientation;
- hierarchy/node summary;
- materials/textures used;
- whether it is static or skinned;
- available animation clips if any;
- collision requirement/status;
- visual adaptation notes;
- license/attribution requirement.

This may begin as Markdown/YAML and become machine-readable tooling only when repeated work justifies it.

## Agent/tool interface target

Do not build these commands prematurely, but when automation is justified prefer a small stable interface such as:

```text
asset:inspect <source>
asset:import <source-id> [selection]
asset:validate [path]
asset:catalog
```

The implementation may use Blender headless, glTF tooling or other command-line utilities. Tool choice is secondary to repeatability and portability.

## Generated vs source data

Separate:

```text
source bundle / original files
        !=
selected normalized runtime asset
        !=
scene placement/configuration
```

This separation lets agents re-run conversion without losing the original source and lets scene code change without duplicating binary art.

## Cloud-first requirement

The pipeline should not require the human owner to open Blender, Unity, PlayCanvas Editor or another desktop content tool for ordinary ingestion.

A command-line/headless conversion path is preferred whenever it is reliable.

Desktop/manual intervention is acceptable only when:

- a source file is corrupt or unusual;
- an artistic edit genuinely requires human judgment;
- a license/access step cannot be delegated;
- automation cost exceeds the expected repeated benefit.

When manual work is needed, document exactly what remains manual instead of silently making it part of the normal workflow.

## Human workflow

Ideal case for the human:

```text
1. Find/buy/download asset pack if needed.
2. Make the source bundle or legal source URL available.
3. Tell the Technical Art Director what the current scene needs.
4. Open the generated preview.
5. Approve/reject the visual result.
```

The human should not normally:

- import 100 FBX files one by one;
- fix material slots manually;
- reorganize asset folders;
- create routine colliders;
- convert FBX to GLB manually;
- place every prop by hand merely because an editor traditionally expects it.

## Acceptance criteria for an asset-import issue

An asset-ingestion task is complete only when:

1. the source/provenance is recorded;
2. license ambiguity is resolved or explicitly blocking;
3. only the needed subset is imported;
4. runtime assets are in portable normalized formats where practical;
5. conversion is repeatable/documented;
6. no giant unnecessary source bundle was added to ordinary Git history;
7. scene/game integration uses the normalized asset, not an accidental local file path;
8. visible assets respect the visual bible rather than default pack styling;
9. the resulting build/preview still runs;
10. known limitations are recorded.

## Current scope

This document defines the production contract now, but **does not justify building a large asset-processing framework before M0 conversation works**.

Implement automation incrementally when the first real external pack is needed.
