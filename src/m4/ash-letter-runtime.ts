import { correnProfile } from '../ai/corren.ts';
import type { InferenceProvider } from '../ai/inference.ts';
import { ivenProfile } from '../ai/iven.ts';
import { maraProfile } from '../ai/mara.ts';
import { neraProfile } from '../ai/nera.ts';
import { NpcConversationEngine } from '../ai/npc-conversation-engine.ts';
import type { NpcProfile } from '../ai/npc-types.ts';
import type { Belief } from '../ai/world-state.ts';

import { selectAshLetterTestimonyContext } from './ash-letter-testimony.ts';

export const ashLetterRuntimeProfiles: readonly NpcProfile[] = Object.freeze([
  maraProfile,
  ivenProfile,
  correnProfile,
  neraProfile
]);

export const createAshLetterRuntimeEngine = (
  provider: InferenceProvider,
  profile: NpcProfile,
  beliefs: readonly Belief[] = []
): NpcConversationEngine => {
  const testimonyContext = selectAshLetterTestimonyContext(profile.id);
  if (!testimonyContext) return new NpcConversationEngine(provider, profile, beliefs);

  return new NpcConversationEngine(provider, profile, beliefs, { testimonyContext });
};
