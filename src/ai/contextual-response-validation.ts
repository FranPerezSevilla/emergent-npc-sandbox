import type { ConversationTurn, NpcResponseV1 } from './npc-types.ts';
import type { Belief } from './world-state.ts';
import { topicTermsForFactId } from './world-state.ts';

const followUpCue = /\b(?:rumor|rumour|rumorea|rumorea|dicen|dijo|dijeron|cont[oó]|contaron|qu[ié]n|who|who told|what did|eso|that)\b/i;

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const mentionsAny = (text: string, terms: readonly string[]): boolean => {
  const normalized = normalize(text);
  return terms.some((term) => normalized.includes(normalize(term)));
};

const relevantConflictFactIds = (
  playerUtterance: string,
  recentConversation: readonly ConversationTurn[],
  beliefs: readonly Belief[]
): readonly string[] => {
  const beliefsByFact = new Map<string, Belief[]>();
  for (const belief of beliefs) {
    const group = beliefsByFact.get(belief.aboutFactId) ?? [];
    group.push(belief);
    beliefsByFact.set(belief.aboutFactId, group);
  }

  const directText = playerUtterance;
  const recentText = recentConversation.slice(-4).map((turn) => turn.text).join(' ');
  const isFollowUp = followUpCue.test(playerUtterance);

  return [...beliefsByFact.entries()]
    .filter(([, group]) => group.length > 1)
    .filter(([factId]) => {
      const terms = topicTermsForFactId(factId);
      if (terms.length === 0) return false;
      return mentionsAny(directText, terms) || (isFollowUp && mentionsAny(recentText, terms));
    })
    .map(([factId]) => factId);
};

export const validateContextualNpcResponse = (
  playerUtterance: string,
  recentConversation: readonly ConversationTurn[],
  beliefs: readonly Belief[],
  response: NpcResponseV1
): string[] => {
  const errors: string[] = [];
  const relevantFactIds = new Set(relevantConflictFactIds(playerUtterance, recentConversation, beliefs));

  for (const belief of beliefs) {
    if (!relevantFactIds.has(belief.aboutFactId)) continue;
    if (belief.provenance.kind !== 'hearsay' || !belief.provenance.immediateSourceLabel) continue;

    if (!normalize(response.dialogue).includes(normalize(belief.provenance.immediateSourceLabel))) {
      errors.push(
        `relevant conflicting hearsay must name immediate source ${belief.provenance.immediateSourceLabel}`
      );
    }
  }

  return errors;
};
