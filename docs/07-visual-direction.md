# Visual Direction — Gothic Expressionist Low-Poly

This document is the current **visual north star** for the prototype and any art-facing agent work.

It is intentionally specific enough to prevent the project from drifting into generic medieval low-poly, while still leaving room to iterate after the first playable experiment.

## Core visual thesis

Target a **stylized first-person low-poly world with gothic-expressionist, melancholic and theatrical qualities**.

Key feelings:

- crooked;
- tall and narrow;
- melancholic;
- theatrical;
- whimsical but eerie;
- cold outside / warm inside;
- low detail, strong silhouettes;
- slightly uncanny rather than cute or realistic.

`Corpse Bride` / gothic stop-motion is a **mood and shape-language reference only**, not a target for direct imitation. Agents must not copy distinctive characters, costumes, props, sets or exact palettes from a specific copyrighted work. Translate the inspiration into original rules: distorted proportions, asymmetry, melancholy, theatrical posing, strong silhouette and expressionist architecture.

## Why this direction fits the game

The game is about secrets, partial truths, tense conversations and NPCs who appear to have an inner life.

The visual world should therefore feel:

- intimate rather than epic;
- authored rather than procedural;
- slightly strange even before anything supernatural happens;
- visually simple enough for a solo/very small team;
- strong enough that bought/free low-poly geometry does not determine the game's identity.

The desired contrast is:

> Modest geometry, unexpectedly alive characters.

## Non-goals

Do not target:

- realistic PBR humans;
- AAA medieval realism;
- generic bright/saturated low-poly fantasy;
- chibi proportions;
- highly detailed hand-painted textures everywhere;
- complex facial rigs, mocap or production lip sync for the prototype;
- direct visual imitation of a single film/studio/artist.

## 1. Shape language: distorted proportions

### Buildings

Buildings should rarely feel like clean boxes.

Prefer:

- tall, narrow proportions;
- exaggerated vertical roofs;
- slight facade lean or taper;
- imperfect symmetry;
- narrow/tall doors;
- small vertical windows;
- long chimneys;
- irregular rooflines;
- compressed, narrow streets.

Useful starting transformation from a generic modular building:

```text
normal building:
- stable rectangle
- moderate roof
- symmetrical openings

project treatment:
- ~5–15% vertical exaggeration
- roof height pushed significantly
- facade or upper floors subtly tapered / offset
- doors narrower and taller
- windows varied in height/placement
```

The exact percentages are not rules. The rule is that the silhouette should remain recognizable as part of this world even with flat black materials.

### Do not over-distort everything

The world must remain readable and traversable in first person.

Suggested hierarchy:

- key architecture: strongly stylized;
- ordinary architecture: moderately stylized;
- props: selectively stylized;
- navigation-critical geometry: clear and functional.

If every edge is crooked and every object screams for attention, the style becomes noise.

## 2. Silhouette before surface detail

Before adding texture detail, ask whether the object works as a silhouette.

High-value silhouette features:

- pointed roofs;
- long chimneys;
- curved/inclined lamps;
- hanging signs;
- thin fences;
- skeletal tree branches;
- asymmetric upper floors;
- distinctive NPC body shapes.

Agents should prefer modifying scale, proportions and modular composition before adding surface detail.

## 3. Environment props

Generic low-poly props are acceptable as source geometry, but they should be selected/composed to reinforce the world.

Prefer:

- slightly narrow chairs/tables;
- uneven furniture silhouettes;
- tall candle holders;
- curved or hanging signs;
- irregular fences;
- long vertical clutter rather than chunky colorful clutter;
- props that make interiors feel occupied by specific people.

Avoid filling rooms with props simply because an asset pack contains them.

Props should help tell social stories: who lives here, what they do, who has recently been here, what is hidden, what people gather around.

## 4. Vegetation

Vegetation should lean toward **skeletal / graphic silhouettes**, not cheerful round low-poly blobs.

Prefer:

- tall, thin trunks;
- sparse canopies;
- angular or finger-like branches;
- visible negative space;
- windswept or leaning shapes;
- desaturated foliage.

Use round/full trees only where deliberate contrast is useful.

## 5. NPC visual language

NPCs are the highest-value custom art target because conversation is the core mechanic.

### Priority

Spend originality budget roughly in this order:

1. NPC silhouette / head / face language;
2. materials and palette;
3. lighting and staging;
4. landmark architecture;
5. generic environment props.

### Character proportions

Prefer caricature with melancholy rather than comedy.

Candidate traits:

- elongated or triangular faces;
- pronounced noses;
- smaller expressive eyes rather than huge anime/chibi eyes;
- strong chin/jaw variation;
- thin or distinctive necks;
- slightly exaggerated hands;
- posture that communicates personality;
- clothing shapes dominated by clean vertical masses.

Avoid making every NPC share one exaggerated body shape. Each important NPC should be identifiable by silhouette at a distance.

Examples of role-based silhouette thinking:

```text
Tavern keeper
- compact torso
- strong forearms / hands
- high hair mass or bun
- forward/protective posture

Blacksmith
- top-heavy silhouette
- wide shoulders
- short neck
- heavy apron mass

Priest / scholar
- tall and narrow
- longer neck/limbs
- slightly curved posture
- strong vertical clothing shape
```

These are examples, not locked characters.

## 6. Character expression: body first

For the prototype, do not depend on complex facial animation.

Use a finite vocabulary of body/head reactions:

- neutral;
- look away;
- glance back;
- cross arms;
- lean in;
- step back;
- point;
- dismissive hand gesture;
- nervous fidget;
- angry posture;
- walk away;
- return to current activity.

The LLM may select semantic emotion/gesture tokens, but animation playback remains deterministic game presentation.

The visual goal is not perfect acting. It is to make generated dialogue feel physically situated in a person.

## 7. Conversation framing

Do not replace the world with a giant dialogue window.

Preferred first-person presentation:

- NPC remains physically in front of the player;
- camera remains grounded in the scene;
- NPC can move gaze/body while inference runs;
- dialogue text is visually subordinate to the person;
- player text input is minimal;
- environment remains visible where practical.

Conversation should feel like approaching a person in a place, not opening a chatbot UI.

## 8. Palette philosophy

Exact color values remain open until a style target is built, but preserve the following relationship.

### Exterior

Bias toward:

- blue-grey;
- desaturated green;
- muted charcoal;
- subtle purple;
- dark wood;
- restrained saturation.

### Interior

Bias toward:

- amber;
- dirty warm yellow;
- muted orange;
- dark wine red;
- warm wood.

Core relationship:

> Outside is cold, distant and strange. Inside is warmer and intimate, but can become claustrophobic or threatening.

Avoid the default low-poly fantasy combination of saturated green grass + bright red roofs + clean blue sky unless intentionally breaking the established mood.

## 9. Lighting and atmosphere

Lighting is part of the game's identity, not polish added at the end.

Preferred ingredients:

- long or directional shadows;
- restrained fog / atmospheric depth;
- warm window and interior pools of light;
- colder ambient exterior;
- strong readable faces/silhouettes during conversation;
- selective darkness rather than uniformly low exposure.

Possible recurring mood target:

- late afternoon / dusk / night;
- narrow streets;
- lit windows;
- silhouettes crossing in the distance;
- audible conversations/activity behind doors.

Do not make darkness harm interaction readability.

## 10. Materials and shader strategy

External asset-pack materials must not define the final look.

Preferred approach:

- simple shared material system;
- restrained specular response;
- avoid shiny/plastic low-poly surfaces;
- optional subtle lighting bands / stylized shading;
- AO/contact depth used carefully;
- desaturation/grade controlled centrally;
- small controlled per-object/per-vertex color variation where useful.

The prototype may use standard URP materials initially. A custom Shader Graph treatment should be introduced only when needed for the visual style target, not before the core conversation loop works.

## 11. Asset strategy: assets as raw material

The project may use libraries/packs aggressively to reduce production cost.

Current practical candidates:

- Unity Starter Assets for first-person controller;
- Quaternius-style modular medieval/fantasy geometry;
- Poly Pizza for individually licensed low-poly models;
- Mixamo-style humanoid animation libraries;
- ProBuilder for reshaping/combining geometry inside Unity.

These are **replaceable production aids, not art-direction dependencies**.

Rule:

> Buy/download geometry. Author the composition, proportions, palette, materials, lighting and character identity.

Do not create scenes by dragging complete recognizable asset-pack prefabs into place unchanged if the scene is intended as a final visual target.

Use modular packs as LEGO:

```text
wall module
+ roof module scaled vertically
+ custom/modified doorway
+ offset upper floor
+ reused window with altered proportions
+ project material
+ project lighting
= authored building
```

## 12. Rough originality budget

A useful production heuristic, not a strict metric:

| Area | External source acceptable | Project-authored emphasis |
|---|---:|---:|
| Generic props | very high | low |
| Generic animations | very high | low |
| Nature base meshes | high | low/moderate |
| Buildings | moderate/high | composition + deformation |
| NPC base bodies | high | silhouette/head/materials |
| NPC faces/heads | low/moderate | high |
| Materials/shader language | low | high |
| Lighting | none | very high |
| Scene composition | none | very high |

The intent is not to hit percentages. It is to spend custom effort where players will perceive identity most strongly.

## 13. First visual style target

Do **not** art-direct an entire village before the core interaction proves itself.

The first polished style target should be only:

- one short crooked street;
- one tavern exterior/interior;
- two neighboring house facades;
- 2–3 representative NPCs;
- exterior cold lighting;
- warm tavern lighting;
- one short conversation staged in first person.

This target answers:

1. Does the world immediately avoid the generic low-poly medieval look?
2. Are the distorted proportions attractive rather than comedic?
3. Do NPCs remain readable at conversation distance?
4. Does cold-outside / warm-inside lighting work?
5. Can commodity assets be transformed enough through composition/materials/proportions?
6. Does the visual presentation make the AI conversation feel more alive?

Do not expand art scope until these questions have been answered.

## 14. Ten visual rules for agents

Any agent producing or selecting final-target visual content should follow these rules:

1. **Silhouette first.** Do not solve weak shapes with texture detail.
2. **Push verticality.** Buildings, roofs and selected props should feel taller/narrower than generic fantasy assets.
3. **Use asymmetry deliberately.** Avoid perfectly mirrored facades and streets.
4. **Keep readability.** Distortion must never break first-person navigation/interactions.
5. **Cold outside, warm inside.** Preserve this relationship unless a scene deliberately subverts it.
6. **Desaturate by default.** Bright saturation requires a gameplay/narrative reason.
7. **NPC identity beats environment detail.** Spend effort on characters the player talks to.
8. **Body acting before facial complexity.** Use pose, gaze and finite gestures for the prototype.
9. **Never ship the asset-pack look unchanged.** Recompose/reproportion/rematerial key visible assets.
10. **Originalize the grammar, not a copyrighted reference.** Keep the gothic-expressionist principles; do not reproduce distinctive designs from a specific film/artist.

## Status

This is the current preferred visual direction, not an immutable final art bible.

Agents may make small reversible implementation choices to test it. Significant deviations (for example switching to realistic graphics, bright cartoon fantasy, third person, or a different core shape language) should be documented as an explicit experiment or design decision rather than silently introduced.
