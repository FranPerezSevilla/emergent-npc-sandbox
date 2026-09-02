export type BeliefConfidence = 'low' | 'medium' | 'high';

export type BeliefProvenance = {
  kind: 'first-hand' | 'inference' | 'hearsay';
  description: string;
  immediateSourceLabel?: string;
};

export type WorldFact = {
  readonly id: string;
  readonly statement: string;
  readonly topicTerms?: readonly string[];
};

export type Belief = {
  readonly id: string;
  readonly ownerNpcId: string;
  readonly aboutFactId: string;
  readonly statement: string;
  readonly confidence: BeliefConfidence;
  readonly provenance: BeliefProvenance;
};

export const redTravelerExitFact: WorldFact = Object.freeze({
  id: 'world-fact-red-traveler-exit',
  statement: 'The traveler in the faded red cloak left the tavern through the back door after midnight and returned before dawn.',
  topicTerms: Object.freeze([
    'red traveler',
    'red-cloaked traveler',
    'red cloak',
    'traveler',
    'viajero',
    'capa roja',
    'de rojo',
    'rojo'
  ])
});

const worldFacts: readonly WorldFact[] = Object.freeze([redTravelerExitFact]);

export const topicTermsForFactId = (factId: string): readonly string[] =>
  worldFacts.find((fact) => fact.id === factId)?.topicTerms ?? [];

export const m1Beliefs: readonly Belief[] = Object.freeze([
  Object.freeze({
    id: 'belief-mara-red-traveler-left',
    ownerNpcId: 'mara',
    aboutFactId: redTravelerExitFact.id,
    statement: 'Mara believes the red-cloaked traveler probably left through the back door after midnight.',
    confidence: 'medium',
    provenance: Object.freeze({
      kind: 'first-hand',
      description: 'Mara heard the back door open and footsteps cross the yard after midnight, but did not see who made them.'
    })
  }),
  Object.freeze({
    id: 'belief-iven-red-traveler-stayed',
    ownerNpcId: 'iven',
    aboutFactId: redTravelerExitFact.id,
    statement: 'Iven believes the red-cloaked traveler stayed in the upstairs room all night.',
    confidence: 'high',
    provenance: Object.freeze({
      kind: 'inference',
      description: 'During his patrol Iven saw a red-cloth silhouette at the upstairs window after midnight and assumed it was the traveler.'
    })
  })
]);

export const beliefsForNpc = (npcId: string): readonly Belief[] =>
  m1Beliefs.filter((belief) => belief.ownerNpcId === npcId);
