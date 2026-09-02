from pathlib import Path

path = Path('src/main.ts')
text = path.read_text()
propagation = """import {
  MARA_TO_IVEN_TRANSFER_ID,
  PLAYER_RED_TRAVELER_EXIT_CLAIM_ID,
  loadM3State,
  propagatedBeliefsForNpc,
  recordPlayerRedTravelerClaimToMara,
  resetM3State,
  saveM3State,
  transferPlayerClaimFromMaraToIven
} from './ai/propagation-state.ts';
import {
  M1_OPENROUTER_MODEL_ID,
  OpenRouterInferenceProvider
} from './ai/openrouter-inference-provider.ts';
"""
ordered = """import {
  M1_OPENROUTER_MODEL_ID,
  OpenRouterInferenceProvider
} from './ai/openrouter-inference-provider.ts';
import {
  MARA_TO_IVEN_TRANSFER_ID,
  PLAYER_RED_TRAVELER_EXIT_CLAIM_ID,
  loadM3State,
  propagatedBeliefsForNpc,
  recordPlayerRedTravelerClaimToMara,
  resetM3State,
  saveM3State,
  transferPlayerClaimFromMaraToIven
} from './ai/propagation-state.ts';
"""
if propagation not in text:
    raise SystemExit('expected M3/OpenRouter import block not found')
path.write_text(text.replace(propagation, ordered, 1))
