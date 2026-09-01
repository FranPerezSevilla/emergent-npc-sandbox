---
name: Third-party resource / license review
description: Register or review software, AI models/services, assets, animation, audio, fonts, stock media or other external resources.
title: "Third-party — "
labels: []
assignees: []
---

## Goal

What external resource do we want to adopt/change/remove, and why is it needed?

## Suggested owner

`licensing-attribution-steward` for registry/review work.

The technical owner of the resource remains responsible for integration facts (for example `ai-npc-systems-engineer` for an AI model or `technical-art-director` for an asset pack).

## Read first

- `AGENTS.md`
- `docs/10-licensing-attribution.md`
- `legal/README.md`
- relevant technical/design docs for the resource

## Resource identity

- Proposed registry ID:
- Type:
- Name:
- Creator/provider:
- Version/model identifier/acquisition date:
- Source URL:
- License/terms name:
- License/terms URL:

## Intended use

- Where/how will it be used?
- Shipped with the game, build-time only, cloud runtime, local runtime, or retained generated content?
- Will it be modified/converted?
- Will source/binary/content be redistributed?
- Will an AI agent/tool process the source/content?

## Known obligations / permissions

- Commercial use: allowed/prohibited/unclear/not_applicable
- Modification: allowed/prohibited/unclear/not_applicable
- Redistribution: allowed/restricted/prohibited/unclear/not_applicable
- AI processing: allowed/prohibited/unclear/not_applicable
- Attribution required: yes/no/unclear
- Exact required credit text:
- Other NOTICE/disclosure obligations:

Do not infer missing permissions from `free`, `royalty-free`, `open`, public availability or prior familiarity.

## Evidence

List source pages, LICENSE/NOTICE files, terms snapshots or other verifiable evidence.

- 

## Human escalation needed?

- [ ] No material ambiguity found
- [ ] Yes — describe the question without pretending to resolve it:

## Required changes

- [ ] Add/update `legal/third-party.json`
- [ ] Preserve license/notice evidence if appropriate
- [ ] Regenerate `legal/ATTRIBUTIONS.md`
- [ ] Regenerate `legal/THIRD_PARTY_NOTICES.md`
- [ ] Cross-reference asset/source manifests when applicable
- [ ] Update/remove derived usage paths when replacing/removing a resource

## Validation

- [ ] `python3 tools/legal/validate_third_party.py`
- [ ] `python3 tools/legal/generate_notices.py --check`

## Acceptance criteria

1. Resource identity/provenance is traceable.
2. Uncertainty is explicit rather than guessed.
3. Required credit/notice wording is preserved.
4. `reviewStatus` and `releaseAllowed` reflect current knowledge.
5. Usage locations/components are recorded.
6. Generated notices are synchronized.
7. Any material legal/commercial ambiguity is escalated to the human owner.
