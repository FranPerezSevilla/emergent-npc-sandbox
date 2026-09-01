# Licensing, Provenance & Attribution

## Purpose

This document defines how the project records and validates every third-party dependency/resource so credits, notices, provenance and release obligations do not depend on memory or chat history.

The project must be able to audit external inputs across software, AI, art, animation and audio from the first prototype onward.

## Core rule

> No external resource reaches release-ready production use without a recorded provenance/license entry.

This does **not** mean every external resource must be shown in player-facing credits. It means every external resource must be traceable internally, and any legally/contractually required credit or notice must be preserved and surfaced correctly.

## Ownership

The repository role `licensing-attribution-steward` owns the operational registry and release-facing attribution outputs.

Other agents remain responsible for identifying external resources they introduce. They must not assume the steward will discover them later.

Human owner is the final authority for ambiguous legal/commercial choices.

## What must be tracked

Track at least these categories when actually used:

- `software` — engine, libraries, packages, SDKs, runtimes;
- `tool` — externally authored build/content tools when provenance matters;
- `ai_model` — local or hosted foundation/inference models;
- `ai_service` — cloud inference/generation services used by production or retained content;
- `generated_content_source` — AI-generated/assisted retained content when model/service provenance should remain traceable;
- `animation` — Mixamo or other animation libraries;
- `asset_3d`;
- `asset_2d`;
- `texture`;
- `font`;
- `music`;
- `sfx`;
- `stock_media`;
- `other`.

A resource mentioned only as a possible future option in documentation is not automatically a production registry entry. Register actual adoption/use.

## Authoritative registry

`legal/third-party.json` is the machine-readable source of truth.

Each entry should capture enough information for another agent or future human to understand what happened without reconstructing old conversations.

Core fields:

```json
{
  "id": "stable-project-local-id",
  "type": "asset_3d",
  "name": "Example Pack",
  "creator": "Example Studio",
  "version": "1.2 or acquisition date",
  "sourceUrl": "https://...",
  "licenseName": "...",
  "licenseUrl": "https://...",
  "reviewStatus": "pending|approved|blocked|removed",
  "releaseAllowed": false,
  "attributionRequired": true,
  "requiredCreditText": "Exact required wording when applicable",
  "commercialUse": "allowed|prohibited|unclear|not_applicable",
  "modification": "allowed|prohibited|unclear|not_applicable",
  "redistribution": "allowed|restricted|prohibited|unclear|not_applicable",
  "aiProcessing": "allowed|prohibited|unclear|not_applicable",
  "usedIn": ["runtime-assets/..."],
  "notes": "...",
  "evidence": ["legal/licenses/... or stable URL"],
  "lastReviewed": "YYYY-MM-DD"
}
```

Do not invent missing values. Use explicit `unclear`/`pending` states and escalate.

## Attribution vs provenance

Keep these concepts separate.

### Provenance

Internal answer to: where did this come from?

Record provenance even when attribution is optional/waived/CC0-like.

### Attribution

A credit obligation requested/required by license or source terms.

Preserve exact wording when specified.

### Third-party notice

A license/copyright notice that may need to ship even when it is not a normal creative credit.

Software often falls here.

## Release-facing outputs

Maintain:

- `legal/ATTRIBUTIONS.md` — human-readable creative/service/model credits and required attribution wording;
- `legal/THIRD_PARTY_NOTICES.md` — software/license notices and broad third-party inventory relevant to distribution;
- `legal/licenses/` — stored license/notice evidence when appropriate and permitted.

These files may later feed an in-game Credits screen, store-page disclosure, README, installer notices or shipped text files.

Do not hand-edit generated sections in a way that diverges from `legal/third-party.json`.

## Workflow when an agent introduces something external

```text
Agent wants external dependency/resource
        |
        v
Identify source + terms
        |
        v
Create/update third-party registry entry
        |
        +-- ambiguous? --> human escalation / blocked
        |
        v
Integrate resource
        |
        v
Run legal registry validation
        |
        v
Update generated notices/credits
        |
        v
PR reports provenance + license impact
```

For asset packs, cross-reference the legal registry ID from the relevant `art-source/sources/` manifest.

For runtime assets, maintain a traceable path back to the source/legal ID.

## AI-specific rules

AI use needs provenance just like conventional middleware/content.

Track when relevant:

- model/provider name;
- exact model/version or stable identifier when known;
- runtime/provider;
- model/service license or terms link;
- local vs cloud use;
- whether outputs are transient runtime dialogue or retained/shipped content;
- any attribution/disclosure requirement known at review time;
- commercial-use or output-use uncertainty;
- platform/store disclosure obligations separately from copyright/license attribution.

Do not conflate:

- model license;
- API/service terms;
- generated output provenance;
- Steam/platform AI disclosure;
- player-facing credits.

They may create different obligations.

## Mixamo / animation rule

Treat animation libraries as third-party resources even when no ordinary credit is required.

Record:

- provider/source;
- acquisition/use date;
- applicable terms/source evidence;
- whether raw source may be redistributed;
- which normalized clips/characters derive from it.

This keeps animation provenance auditable even after conversion to GLB or another runtime format.

## Music / SFX rule

For each retained external audio track/effect, record:

- title/identifier;
- author/provider;
- source page;
- license/terms;
- exact required credit line;
- whether editing/looping is permitted or unclear;
- whether standalone redistribution is restricted;
- usage location in the game.

Do not rely on a downloaded filename as proof of rights.

## Software dependency rule

Whenever an agent adds a package/library/SDK/runtime:

1. record it in the dependency manager as normal;
2. ensure its license can be identified;
3. register it in `legal/third-party.json` when it is a direct project dependency or otherwise needs explicit project-level tracking;
4. preserve required license/copyright notices;
5. do not add dependencies with unresolved commercial/distribution implications merely for convenience.

A future automated scanner may assist with transitive dependencies, but automated scanners do not replace human/agent review of unusual licenses.

## PR requirements

Any PR adding or materially changing an external resource should state:

- third-party registry ID(s);
- what was added/removed/updated;
- whether attribution is required;
- whether release is currently allowed;
- any unresolved legal/provenance question;
- where the resource is used.

If the PR introduces external files/dependencies but claims `Third-party impact: none`, reviewers should treat that as suspicious and verify.

## CI policy

The repository should maintain a lightweight, deterministic validator that checks at minimum:

- registry JSON is valid;
- IDs are unique;
- required fields exist;
- `approved` + `releaseAllowed` records do not contain unresolved core permission states;
- attribution-required records include credit text or a documented reason the wording is generated elsewhere;
- usage references are structurally valid;
- generated notices can be regenerated without error.

CI is a guardrail, not legal interpretation.

## Blocking conditions

A resource is **not release-ready** when any material condition is unresolved, including:

- unknown source;
- unknown license/terms;
- commercial use unclear;
- modification unclear when modification is required;
- redistribution unclear when redistribution is required;
- required credit text lost;
- AI-processing restriction potentially conflicts with intended workflow;
- source/creator cannot be traced;
- purchased/custom terms have not been reviewed sufficiently for intended use.

Prototype experiments may temporarily use `reviewStatus: pending` resources only when they are clearly isolated and cannot accidentally be presented as release-ready.

## Human escalation

This system is record-keeping and risk control, not legal advice.

The human owner decides whether to accept/replace/seek advice on ambiguous licenses or terms. Agents must surface uncertainty rather than producing a confident legal conclusion from incomplete evidence.

## Definition of done

Licensing/attribution governance is working when:

- a new contributor/agent can trace every external production resource;
- required credits can be generated without searching old chats/browser history;
- removal/replacement of a resource can identify its derived files;
- release review can distinguish approved, pending and blocked third-party inputs;
- legal uncertainty appears as an explicit blocker, not a hidden assumption.
