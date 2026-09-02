import type { StringStorage } from '../ai/memory-state.ts';

export const ASH_LETTER_CASE_ID = 'm4-ash-letter';
export const ASH_LETTER_CASE_VERSION = 1;
export const M4_ASH_LETTER_STORAGE_KEY = 'emergent-npc-sandbox.m4-ash-letter-state-v1';

export type AshLetterTruthFact = {
  readonly id: string;
  readonly statement: string;
};

export type AshLetterPrivateTruth = {
  readonly caseId: typeof ASH_LETTER_CASE_ID;
  readonly culpritNpcId: 'nera';
  readonly facts: readonly AshLetterTruthFact[];
};

export const ashLetterPrivateTruth: AshLetterPrivateTruth = Object.freeze({
  caseId: ASH_LETTER_CASE_ID,
  culpritNpcId: 'nera',
  facts: Object.freeze([
    Object.freeze({
      id: 'ash-truth-warrant-named-jorin',
      statement: 'The sealed magistrate warrant carried by Corren visibly named Jorin Pell on its exterior.'
    }),
    Object.freeze({
      id: 'ash-truth-corren-left-after-midnight',
      statement: 'Corren left through the tavern back door shortly after midnight to retrieve untaxed brandy from his travel gear.'
    }),
    Object.freeze({
      id: 'ash-truth-window-shape-was-cloak',
      statement: 'The red shape Iven saw at the upstairs window was Corren’s faded red cloak hanging on the tall peg beside the window.'
    }),
    Object.freeze({
      id: 'ash-truth-nera-entered-room',
      statement: 'During Corren’s absence, Nera used her ordinary service access to enter Corren’s upstairs room.'
    }),
    Object.freeze({
      id: 'ash-truth-nera-took-warrant',
      statement: 'Nera removed the sealed warrant from Corren’s satchel to protect her brother Jorin.'
    }),
    Object.freeze({
      id: 'ash-truth-nera-burned-warrant',
      statement: 'Nera burned the missing warrant in the tavern kitchen hearth.'
    })
  ])
});

export type AshLetterEvidenceId =
  | 'ash-e1-back-door-sound'
  | 'ash-e2-red-window-observation'
  | 'ash-e3-cloak-by-window'
  | 'ash-e4-burned-warrant-fragment'
  | 'ash-e5-corren-brandy-secret';

export type AshLetterEvidenceKind = 'social-testimony' | 'physical-inspection' | 'social-admission';

export type AshLetterEvidenceDirectness =
  | 'first-hand-observation'
  | 'observation-plus-inference'
  | 'physical'
  | 'admission';

export type AshLetterEvidenceAtom = {
  readonly id: AshLetterEvidenceId;
  readonly label: string;
  readonly kind: AshLetterEvidenceKind;
  readonly statement: string;
  readonly provenance: {
    readonly sourceType: 'npc' | 'inspection';
    readonly sourceId: string;
    readonly directness: AshLetterEvidenceDirectness;
  };
};

export const ashLetterEvidenceRegistry: Readonly<Record<AshLetterEvidenceId, AshLetterEvidenceAtom>> =
  Object.freeze({
    'ash-e1-back-door-sound': Object.freeze({
      id: 'ash-e1-back-door-sound',
      label: 'Back-door sound',
      kind: 'social-testimony',
      statement: 'Mara heard the back door open shortly after midnight and heard footsteps cross the yard, but she did not see who made them.',
      provenance: Object.freeze({
        sourceType: 'npc',
        sourceId: 'mara',
        directness: 'first-hand-observation'
      })
    }),
    'ash-e2-red-window-observation': Object.freeze({
      id: 'ash-e2-red-window-observation',
      label: 'Red-window observation',
      kind: 'social-testimony',
      statement: 'Iven saw a person-like red shape at the upstairs window after midnight and inferred that it was Corren.',
      provenance: Object.freeze({
        sourceType: 'npc',
        sourceId: 'iven',
        directness: 'observation-plus-inference'
      })
    }),
    'ash-e3-cloak-by-window': Object.freeze({
      id: 'ash-e3-cloak-by-window',
      label: 'Cloak by the upstairs window',
      kind: 'physical-inspection',
      statement: 'Corren’s faded red cloak hangs on a tall peg immediately beside the upstairs window and can plausibly resemble the red silhouette Iven described from the lane.',
      provenance: Object.freeze({
        sourceType: 'inspection',
        sourceId: 'upstairs-window-peg',
        directness: 'physical'
      })
    }),
    'ash-e4-burned-warrant-fragment': Object.freeze({
      id: 'ash-e4-burned-warrant-fragment',
      label: 'Burned magistrate fragment',
      kind: 'physical-inspection',
      statement: 'The kitchen hearth contains a charred folded-paper fragment, part of a magistrate wax seal and the surviving exterior text “…PELL”.',
      provenance: Object.freeze({
        sourceType: 'inspection',
        sourceId: 'kitchen-hearth',
        directness: 'physical'
      })
    }),
    'ash-e5-corren-brandy-secret': Object.freeze({
      id: 'ash-e5-corren-brandy-secret',
      label: 'Corren’s stable secret',
      kind: 'social-admission',
      statement: 'Corren admits that he left after midnight to retrieve untaxed brandy hidden with his travel gear, explaining why he lied about remaining upstairs.',
      provenance: Object.freeze({
        sourceType: 'npc',
        sourceId: 'corren',
        directness: 'admission'
      })
    })
  });

const ashLetterEvidenceIds = Object.freeze(Object.keys(ashLetterEvidenceRegistry) as AshLetterEvidenceId[]);
const ashLetterEvidenceIdSet = new Set<string>(ashLetterEvidenceIds);

export const isAshLetterEvidenceId = (value: unknown): value is AshLetterEvidenceId =>
  typeof value === 'string' && ashLetterEvidenceIdSet.has(value);

export type M4CaseState = {
  readonly schemaVersion: 1;
  readonly caseId: typeof ASH_LETTER_CASE_ID;
  readonly discoveredEvidenceIds: readonly AshLetterEvidenceId[];
};

export const emptyM4CaseState = (): M4CaseState => ({
  schemaVersion: 1,
  caseId: ASH_LETTER_CASE_ID,
  discoveredEvidenceIds: []
});

export const discoverEvidence = (state: M4CaseState, evidenceId: AshLetterEvidenceId): M4CaseState => {
  if (!isAshLetterEvidenceId(evidenceId)) {
    throw new Error(`Unknown Ash Letter evidence id: ${String(evidenceId)}`);
  }
  if (state.discoveredEvidenceIds.includes(evidenceId)) return state;

  return {
    schemaVersion: 1,
    caseId: ASH_LETTER_CASE_ID,
    discoveredEvidenceIds: [...state.discoveredEvidenceIds, evidenceId]
  };
};

export const discoveredEvidenceForState = (state: M4CaseState): readonly AshLetterEvidenceAtom[] =>
  state.discoveredEvidenceIds.map((id) => ashLetterEvidenceRegistry[id]);

const isM4CaseState = (value: unknown): value is M4CaseState => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<M4CaseState>;
  if (candidate.schemaVersion !== 1 || candidate.caseId !== ASH_LETTER_CASE_ID) return false;
  if (!Array.isArray(candidate.discoveredEvidenceIds)) return false;
  if (!candidate.discoveredEvidenceIds.every(isAshLetterEvidenceId)) return false;
  return new Set(candidate.discoveredEvidenceIds).size === candidate.discoveredEvidenceIds.length;
};

export const loadM4CaseState = (storage: StringStorage): M4CaseState => {
  const raw = storage.getItem(M4_ASH_LETTER_STORAGE_KEY);
  if (!raw) return emptyM4CaseState();

  try {
    const value: unknown = JSON.parse(raw);
    if (!isM4CaseState(value)) return emptyM4CaseState();
    return {
      schemaVersion: 1,
      caseId: ASH_LETTER_CASE_ID,
      discoveredEvidenceIds: [...value.discoveredEvidenceIds]
    };
  } catch {
    return emptyM4CaseState();
  }
};

export const saveM4CaseState = (storage: StringStorage, state: M4CaseState): void => {
  storage.setItem(M4_ASH_LETTER_STORAGE_KEY, JSON.stringify(state));
};

export const resetM4CaseState = (storage: StringStorage): M4CaseState => {
  storage.removeItem(M4_ASH_LETTER_STORAGE_KEY);
  return emptyM4CaseState();
};
