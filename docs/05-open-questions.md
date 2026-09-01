# Open Questions

These are intentionally unresolved. Agents should not silently choose permanent answers unless an implementation experiment requires a provisional choice.

## Game identity

- Final genre: investigation, social RPG or pure sandbox?
- Setting: medieval/fantasy, contemporary, other?
- Is there a fixed protagonist or player-created role?
- Is lying by the player a central explicit mechanic or simply an emergent capability?

## NPC simulation

- Which relationship dimensions are actually needed?
- How should characters decide whether to lie?
- Should lies be proposed by the LLM or primarily driven by deterministic motives/rules?
- How often should NPC-to-NPC conversations be simulated?
- Do off-screen interactions require LLM inference, or can many be deterministic/summarized?

## Memory

- How are important memories scored?
- When are memories compressed/forgotten?
- Is vector retrieval needed, or will structured tags be enough at prototype scale?

## Inference

- Best local model for Spanish/English character dialogue at acceptable latency?
- Minimum supported hardware?
- Context budget target?
- Quantization target?
- llama.cpp direct integration vs local sidecar process for shipping?

## UX

- Fully typed input only?
- Optional suggested prompts for accessibility?
- How should players inspect what they themselves have learned without turning the game into a quest log?
- Should there be a notebook/evidence board in an investigation version?

## Visuals

Current preferred visual north star is now documented in `docs/07-visual-direction.md`:

- first-person;
- stylized low-poly;
- gothic-expressionist / melancholic / theatrical;
- tall, narrow, subtly crooked architecture;
- cold/desaturated exterior vs warm intimate interior;
- strong NPC silhouettes and body acting;
- commodity asset geometry transformed through composition, proportions, materials and lighting.

This direction is **provisional but intentional**. Agents should test it rather than silently replace it with generic medieval low-poly.

Still unresolved:

- exact setting/lore justification for the architectural style;
- exact production palette and color values after the first style target;
- exact shader treatment (standard URP vs custom stylized Shader Graph);
- modular character production pipeline;
- how much facial animation is worth adding beyond head/body gestures;
- first-person interaction distance and camera/framing details;
- which base asset libraries survive after the style target and which should be replaced;
- how distorted architecture can become before first-person navigation/readability suffers;
- whether the final game should remain predominantly dusk/night or support a broader day/night range;
- whether the 2D/2.5D fallback is ever needed if 3D production cost is too high.

The first style-target experiment should answer the acceptance questions in `docs/07-visual-direction.md` before expanding visual scope.

## Commercial / platform

- Steam first?
- Bundle local model with the game or download on first run?
- Offer model quality presets?
- Optional cloud quality mode?
- AI-generated content moderation/platform compliance strategy?
