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

Current hypothesis: stylized low-poly first-person.

Unresolved:

- exact art style;
- setting palette;
- modular character production pipeline;
- facial animation vs head/body gestures only;
- first-person interaction distance and framing.

## Commercial / platform

- Steam first?
- Bundle local model with the game or download on first run?
- Offer model quality presets?
- Optional cloud quality mode?
- AI-generated content moderation/platform compliance strategy?
