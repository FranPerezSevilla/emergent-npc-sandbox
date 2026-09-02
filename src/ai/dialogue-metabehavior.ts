import type { NpcProfile } from './npc-types.ts';
import type { Belief } from './world-state.ts';

export type DialogueIntent =
  | 'free_text'
  | 'ask_observation'
  | 'ask_rumor'
  | 'ask_source'
  | 'challenge';

export type DialogueIntentRequest = {
  readonly intent: DialogueIntent;
  readonly topicFactId?: string;
};

export type SocialDialogueFocus =
  | 'free'
  | 'own_evidence'
  | 'hearsay'
  | 'source'
  | 'belief_conflict';

export type SocialDialogueStance =
  | 'neutral'
  | 'discount'
  | 'defend_own_view'
  | 'reconsider'
  | 'balanced'
  | 'withhold'
  | 'none_available';

export type SocialDialogueDecision = {
  readonly intent: DialogueIntent;
  readonly topicFactId?: string;
  readonly focus: SocialDialogueFocus;
  readonly stance: SocialDialogueStance;
  readonly relevantBeliefIds: readonly string[];
  readonly immediateSourceIds: readonly string[];
  readonly rationale: string;
};

const beliefsForTopic = (beliefs: readonly Belief[], topicFactId?: string): readonly Belief[] =>
  topicFactId ? beliefs.filter((belief) => belief.aboutFactId === topicFactId) : [];

const immediateSources = (beliefs: readonly Belief[]): readonly string[] =>
  [...new Set(beliefs.flatMap((belief) => belief.provenance.immediateSourceId ?? []))];

const noInformationDecision = (
  request: DialogueIntentRequest,
  focus: SocialDialogueFocus,
  rationale: string
): SocialDialogueDecision => ({
  intent: request.intent,
  topicFactId: request.topicFactId,
  focus,
  stance: 'none_available',
  relevantBeliefIds: [],
  immediateSourceIds: [],
  rationale
});

export const deriveSocialDialogueDecision = (
  profile: NpcProfile,
  beliefs: readonly Belief[],
  request?: DialogueIntentRequest,
  relationshipTrust = 0
): SocialDialogueDecision => {
  const resolvedRequest: DialogueIntentRequest = request ?? { intent: 'free_text' };

  if (resolvedRequest.intent === 'free_text') {
    return {
      intent: 'free_text',
      topicFactId: resolvedRequest.topicFactId,
      focus: 'free',
      stance: 'neutral',
      relevantBeliefIds: [],
      immediateSourceIds: [],
      rationale: 'Free-form speech does not force the NPC to surface every available belief.'
    };
  }

  const topicBeliefs = beliefsForTopic(beliefs, resolvedRequest.topicFactId);
  const hearsay = topicBeliefs.filter((belief) => belief.provenance.kind === 'hearsay');
  const ownEvidence = topicBeliefs.filter((belief) => belief.provenance.kind !== 'hearsay');

  if (resolvedRequest.intent === 'ask_observation') {
    if (ownEvidence.length === 0) {
      return noInformationDecision(
        resolvedRequest,
        'own_evidence',
        'The player explicitly asked what the NPC observed, but no non-hearsay belief is available for this topic.'
      );
    }

    return {
      intent: resolvedRequest.intent,
      topicFactId: resolvedRequest.topicFactId,
      focus: 'own_evidence',
      stance: 'neutral',
      relevantBeliefIds: ownEvidence.map((belief) => belief.id),
      immediateSourceIds: [],
      rationale: 'Answer from the NPC\'s own observation or inference; unrelated hearsay may be omitted.'
    };
  }

  if (resolvedRequest.intent === 'ask_rumor') {
    if (hearsay.length === 0) {
      return noInformationDecision(
        resolvedRequest,
        'hearsay',
        'The player explicitly asked for hearsay, but the NPC has no hearsay belief for this topic.'
      );
    }

    const withhold = profile.socialPolicy.disclosureStyle === 'selective' && relationshipTrust < 0;
    const stance: SocialDialogueStance = withhold
      ? 'withhold'
      : profile.socialPolicy.hearsayStance === 'skeptical'
        ? 'discount'
        : 'neutral';

    return {
      intent: resolvedRequest.intent,
      topicFactId: resolvedRequest.topicFactId,
      focus: 'hearsay',
      stance,
      relevantBeliefIds: hearsay.map((belief) => belief.id),
      immediateSourceIds: immediateSources(hearsay),
      rationale: withhold
        ? 'The NPC knows hearsay but their selective disclosure policy and negative trust permit deflection.'
        : 'The player explicitly asked what the NPC has heard; surface or dismiss hearsay according to the NPC social policy.'
    };
  }

  if (resolvedRequest.intent === 'ask_source') {
    if (hearsay.length === 0) {
      return noInformationDecision(
        resolvedRequest,
        'source',
        'The player explicitly asked for a source, but no sourced hearsay is available for this topic.'
      );
    }

    const withhold = profile.socialPolicy.disclosureStyle === 'selective' && relationshipTrust < 0;
    return {
      intent: resolvedRequest.intent,
      topicFactId: resolvedRequest.topicFactId,
      focus: 'source',
      stance: withhold ? 'withhold' : 'neutral',
      relevantBeliefIds: hearsay.map((belief) => belief.id),
      immediateSourceIds: immediateSources(hearsay),
      rationale: withhold
        ? 'The NPC knows the source but negative trust permits refusing to identify it.'
        : 'Answer who immediately relayed the hearsay while preserving the provenance chain.'
    };
  }

  if (topicBeliefs.length === 0) {
    return noInformationDecision(
      resolvedRequest,
      'belief_conflict',
      'The player challenged the NPC on a topic for which no structured belief is available.'
    );
  }

  const stance: SocialDialogueStance =
    profile.socialPolicy.conflictStance === 'defend_own_view'
      ? 'defend_own_view'
      : profile.socialPolicy.conflictStance === 'reconsider'
        ? 'reconsider'
        : 'balanced';

  return {
    intent: resolvedRequest.intent,
    topicFactId: resolvedRequest.topicFactId,
    focus: 'belief_conflict',
    stance,
    relevantBeliefIds: topicBeliefs.map((belief) => belief.id),
    immediateSourceIds: immediateSources(hearsay),
    rationale: 'The player challenged the NPC; respond according to the explicit conflict stance without changing authoritative beliefs.'
  };
};
