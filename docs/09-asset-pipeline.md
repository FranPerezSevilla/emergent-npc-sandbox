# Agentic Asset Pipeline

## Purpose

This document defines how external art/audio assets enter the project without requiring the human owner to manually import, convert, configure or place them in a desktop editor.

Rights/provenance governance is defined separately in `docs/10-licensing-attribution.md` and `legal/third-party.json`.

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
        +---- source/provenance facts
        v
Licensing & Attribution Steward
  registry -> notices -> release status
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

The human should normally be responsible only for decisions or access that cannot be delegated legally or technically: purchasing an asset, accepting a gated license, logging into a store, deciding an ambiguous legal/commercial question, or choosing between subjective visual alternatives.

Everything after the source asset becomes accessible to the project should be automatable where practical.

## Core principle

> The human supplies rights and direction; agents perform asset production; the legal registry preserves the audit trail.

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

legal/
  third-party.json
  ATTRIBUTIONS.md
  THIRD_PARTY_NOTICES.md
  licenses/
```

`art-source/inbox/` is staging, not a permanent dumping ground.

`art-source/sources/` contains asset-production source manifests and must cross-reference the stable `third_party_id` from `legal/third-party.json` before the source is treated as production/release-ready.

`legal/third-party.json` is authoritative for license/provenance/credit/release status across the whole project, not only art.

`runtime-assets/` contains only assets intentionally selected and normalized for the game.

The eventual runtime/build system may copy, transform or expose `runtime-assets/` through an engine-specific folder such as a web `public/assets/` directory. Do not make that build detail the source of truth.

## Intake modes

### 1. Public/free source URL — preferred when legally usable

The agent may fetch a public asset when:

- the URL is publicly accessible without bypassing authentication/paywalls;
- the source and stated license/terms are identified;
- any attribution requirement can be preserved;
- there is no known restriction incompatible with the intended agentic processing workflow;
- a legal registry entry is created/updated before production use.

The agent must not assume that `free to download` means `free for commercial use`, `safe to redistribute`, or `AI-processing permitted`.

If material terms are unclear, the Licensing & Attribution Steward records the uncertainty and escalates instead of approving the resource.

### 2. Purchased/gated/private source

The agent must **not** bypass a login, purchase flow, access control, DRM or license gate.

Human responsibility:

1. acquire/accept the asset legally;
2. make the source bundle available to the project/agent workspace using an approved private mechanism;
3. answer/escalate any material ambiguity that agents cannot resolve from authoritative terms.

Preferred cloud-friendly persistence options, in order of simplicity for the current stage:

- a private GitHub Release asset or other private binary storage accessible to the coding environment;
- an explicitly provided file in the active agent/workspace session;
- Git LFS for selected reusable source binaries if long-term repository-versioned storage becomes necessary.

Do not commit a giant purchased source pack to ordinary Git history merely because it is convenient.

### 3. Human-created/custom source

Treat custom Blender/GLB/texture/animation files through the same production pipeline. Purely original human-created content may not require a third-party entry, but any embedded third-party components, tools with disclosure obligations, fonts, textures, base meshes or generated-content provenance that matter must still be registered appropriately.

## Source manifest

Every external asset family that reaches production should have a small manifest under `art-source/sources/`.

Recommended fields:

```yaml
id: medieval-village-example
third_party_id: medieval-village-example
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

The asset manifest is **not** the authoritative license registry. Its `third_party_id` must reference `legal/third-party.json`, where review status, exact attribution text, permissions and release state are maintained.

Do not invent license metadata. If the license is unclear, mark the legal record pending/blocked and surface the uncertainty to the human.

## Technical Art Director responsibilities

When a new source is provided, the Technical Art Director should:

1. inspect the archive/files;
2. identify useful assets relevant to the current issue only;
3. capture source/provider/version/acquisition facts for the source manifest/legal steward;
4. ensure a stable third-party registry ID exists before production/release-ready use;
5. avoid importing the entire pack by default;
6. convert selected models to canonical GLB when useful;
7. preserve meaningful hierarchy/node names where possible;
8. normalize coordinate system, scale and orientation;
9. validate materials/textures;
10. optimize obvious waste without destructive premature optimization;
11. create/record collision strategy when required by gameplay;
12. adapt visible assets to `docs/07-visual-direction.md` through composition, proportions, materials and lighting rather than accepting default pack aesthetics;
13. place only validated runtime output under `runtime-assets/`;
14. update the source manifest/catalog when an asset enters or leaves production use;
15. record derived `usedIn` paths for the Licensing & Attribution Steward;
16. provide a preview or screenshot/playable result when the issue is visual.

The Technical Art Director must not decide ambiguous legal terms. Mechanical import success is not license approval.

## Licensing & Attribution Steward responsibilities for asset intake

For any external source that reaches production, the Steward should:

1. create/update its `legal/third-party.json` entry from verifiable evidence;
2. preserve source/license URLs and relevant evidence;
3. record attribution requirements and exact credit wording;
4. record commercial/modification/redistribution/AI-processing status;
5. track `pending`, `approved`, `blocked` or `removed` review state;
6. record runtime/source usage paths;
7. regenerate/check `legal/ATTRIBUTIONS.md` and `legal/THIRD_PARTY_NOTICES.md`;
8. escalate ambiguous terms to the human rather than guessing.

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
- ensure it has an authoritative `legal/third-party.json` record before production/release-ready use;
- preserve attribution requirements and exact required credit text;
- respect restrictions on redistribution and modification;
- avoid uploading/licensing source content publicly when source terms do not permit it;
- avoid using a source pack in an AI-processing workflow when its terms prohibit the intended workflow;
- escalate ambiguous terms instead of guessing;
- preserve supplied license/NOTICE evidence when appropriate.

Agents MUST NOT:

- bypass paid/login-gated access;
- remove license/attribution files merely to make the tree cleaner;
- assume a private repository automatically makes every redistribution legal;
- commit an entire asset marketplace package to source control without an explicit reason;
- mark assets with unknown material rights as release-ready;
- duplicate conflicting license truth between the asset manifest and legal registry.

## Normalization contract

For each production 3D asset, the pipeline should eventually be able to answer:

- source manifest ID;
- authoritative third-party registry ID or explicit original-content origin;
- canonical runtime file path;
- approximate scale/unit convention;
- forward/up orientation;
- hierarchy/node summary;
- materials/textures used;
- whether it is static or skinned;
- available animation clips if any;
- collision requirement/status;
- visual adaptation notes;
- attribution/release status reference.

This may begin as Markdown/YAML/JSON and become more automated only when repeated work justifies it.

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
        !=
legal/provenance registry
```

This separation lets agents re-run conversion without losing the original source, lets scene code change without duplicating binary art, and lets credits survive asset renames/conversions.

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
4. Resolve only genuinely ambiguous legal/commercial decisions surfaced by the Steward.
5. Open the generated preview.
6. Approve/reject the visual result.
```

The human should not normally:

- import 100 FBX files one by one;
- fix material slots manually;
- reorganize asset folders;
- create routine colliders;
- convert FBX to GLB manually;
- manually reconstruct credits at release time;
- place every prop by hand merely because an editor traditionally expects it.

## Acceptance criteria for an asset-import issue

An asset-ingestion task is complete only when:

1. source/provenance is recorded;
2. a stable `legal/third-party.json` entry exists for external production content;
3. asset source manifest references that registry ID;
4. license ambiguity is resolved or explicitly pending/blocking;
5. required attribution/NOTICE wording is preserved;
6. only the needed subset is imported;
7. runtime assets are in portable normalized formats where practical;
8. conversion is repeatable/documented;
9. no giant unnecessary source bundle was added to ordinary Git history;
10. scene/game integration uses the normalized asset, not an accidental local file path;
11. visible assets respect the visual bible rather than default pack styling;
12. generated attribution/notices are synchronized;
13. the resulting build/preview still runs;
14. known limitations are recorded.

## Current scope

This document defines the production contract now, but **does not justify building a large asset-processing framework before M0 conversation works**.

Implement automation incrementally when the first real external pack is needed. The legal registry/attribution discipline should begin immediately because retroactive provenance reconstruction is expensive.
