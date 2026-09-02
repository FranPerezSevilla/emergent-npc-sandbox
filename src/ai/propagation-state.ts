import type { StringStorage } from './memory-state.ts';
import type { Belief } from './world-state.ts';
import { redTravelerExitFact } from './world-state.ts';

export type ClaimCredibility = 'unverified' | 'plausible';

export type ClaimedStatement = {
  readonly id: string;
  readonly aboutFactId: string;
  readonly statement: string;
  readonly originalSpeakerId: string;
  readonly recipientNpcId: string;
  readonly credibility: ClaimCredibility;
  readonly provenanceChain: readonly string[];
  readonly createdAt: string;
};

export type InformationTransfer = {
  readonly id: string;
  readonly claimId: string;
  readonly fromNpcId: string;
  readonly toNpcId: string;
  readonly provenanceChain: readonly string[];
  readonly occurredAt: string;
};

export type M3State = {
  readonly schemaVersion: 1;
  readonly claims: readonly ClaimedStatement[];
  readonly transfers: readonly InformationTransfer[];
};

export const M3_STORAGE_KEY = 'emergent-npc-sandbox.m3-state-v1';
export const PLAYER_RED_TRAVELER_EXIT_CLAIM_ID = 'claim-player-saw-red-traveler-leave';
export const MARA_TO_IVEN_TRANSFER_ID = 'transfer-mara-to-iven-red-traveler-claim';
export const MARA_PLAYER_CLAIM_BELIEF_ID = 'belief-mara-player-claimed-red-traveler-left';
export const IVEN_PROPAGATED_CLAIM_BELIEF_ID = 'belief-iven-heard-player-claimed-red-traveler-left';

export const emptyM3State = (): M3State => ({
  schemaVersion: 1,
  claims: [],
  transfers: []
});

export const recordPlayerRedTravelerClaimToMara = (state: M3State, createdAt: string): M3State => {
  if (state.claims.some((claim) => claim.id === PLAYER_RED_TRAVELER_EXIT_CLAIM_ID)) return state;

  const claim: ClaimedStatement = {
    id: PLAYER_RED_TRAVELER_EXIT_CLAIM_ID,
    aboutFactId: redTravelerExitFact.id,
    statement: 'The player claims they personally saw the red-cloaked traveler leave through the tavern back door after midnight.',
    originalSpeakerId: 'player',
    recipientNpcId: 'mara',
    credibility: 'unverified',
    provenanceChain: ['player -> Mara'],
    createdAt
  };

  return {
    schemaVersion: 1,
    claims: [...state.claims, claim],
    transfers: state.transfers
  };
};

export const transferPlayerClaimFromMaraToIven = (state: M3State, occurredAt: string): M3State => {
  if (state.transfers.some((transfer) => transfer.id === MARA_TO_IVEN_TRANSFER_ID)) return state;

  const claim = state.claims.find((candidate) => candidate.id === PLAYER_RED_TRAVELER_EXIT_CLAIM_ID);
  if (!claim || claim.recipientNpcId !== 'mara') return state;

  const transfer: InformationTransfer = {
    id: MARA_TO_IVEN_TRANSFER_ID,
    claimId: claim.id,
    fromNpcId: 'mara',
    toNpcId: 'iven',
    provenanceChain: [...claim.provenanceChain, 'Mara -> Iven'],
    occurredAt
  };

  return {
    schemaVersion: 1,
    claims: state.claims,
    transfers: [...state.transfers, transfer]
  };
};

export const propagatedBeliefsForNpc = (state: M3State, npcId: string): readonly Belief[] => {
  const claim = state.claims.find((candidate) => candidate.id === PLAYER_RED_TRAVELER_EXIT_CLAIM_ID);
  if (!claim) return [];

  if (npcId === 'mara') {
    return [
      {
        id: MARA_PLAYER_CLAIM_BELIEF_ID,
        ownerNpcId: 'mara',
        aboutFactId: claim.aboutFactId,
        statement: 'Mara has heard the player claim they personally saw the red-cloaked traveler leave through the back door after midnight.',
        confidence: 'medium',
        provenance: {
          kind: 'hearsay',
          immediateSourceId: 'player',
          description: 'The player told Mara this directly. Mara did not witness the claimed event herself.'
        }
      }
    ];
  }

  if (npcId === 'iven') {
    const transferred = state.transfers.some(
      (transfer) => transfer.id === MARA_TO_IVEN_TRANSFER_ID && transfer.claimId === claim.id
    );
    if (!transferred) return [];

    return [
      {
        id: IVEN_PROPAGATED_CLAIM_BELIEF_ID,
        ownerNpcId: 'iven',
        aboutFactId: claim.aboutFactId,
        statement: 'Iven has heard from Mara that the player claims to have personally seen the red-cloaked traveler leave through the back door after midnight.',
        confidence: 'medium',
        provenance: {
          kind: 'hearsay',
          immediateSourceId: 'mara',
          description: 'Mara relayed the player\'s claim to Iven. Iven did not witness the claimed departure and knows this is second-hand information.'
        }
      }
    ];
  }

  return [];
};

const isClaim = (value: unknown): value is ClaimedStatement => {
  if (typeof value !== 'object' || value === null) return false;
  const claim = value as Partial<ClaimedStatement>;
  return (
    typeof claim.id === 'string' &&
    typeof claim.aboutFactId === 'string' &&
    typeof claim.statement === 'string' &&
    typeof claim.originalSpeakerId === 'string' &&
    typeof claim.recipientNpcId === 'string' &&
    (claim.credibility === 'unverified' || claim.credibility === 'plausible') &&
    Array.isArray(claim.provenanceChain) &&
    claim.provenanceChain.every((step) => typeof step === 'string') &&
    typeof claim.createdAt === 'string'
  );
};

const isTransfer = (value: unknown): value is InformationTransfer => {
  if (typeof value !== 'object' || value === null) return false;
  const transfer = value as Partial<InformationTransfer>;
  return (
    typeof transfer.id === 'string' &&
    typeof transfer.claimId === 'string' &&
    typeof transfer.fromNpcId === 'string' &&
    typeof transfer.toNpcId === 'string' &&
    Array.isArray(transfer.provenanceChain) &&
    transfer.provenanceChain.every((step) => typeof step === 'string') &&
    typeof transfer.occurredAt === 'string'
  );
};

export const loadM3State = (storage: StringStorage): M3State => {
  const raw = storage.getItem(M3_STORAGE_KEY);
  if (!raw) return emptyM3State();

  try {
    const value = JSON.parse(raw) as { schemaVersion?: unknown; claims?: unknown; transfers?: unknown };
    if (
      value.schemaVersion !== 1 ||
      !Array.isArray(value.claims) ||
      !value.claims.every(isClaim) ||
      !Array.isArray(value.transfers) ||
      !value.transfers.every(isTransfer)
    ) {
      return emptyM3State();
    }

    return { schemaVersion: 1, claims: value.claims, transfers: value.transfers };
  } catch {
    return emptyM3State();
  }
};

export const saveM3State = (storage: StringStorage, state: M3State): void => {
  storage.setItem(M3_STORAGE_KEY, JSON.stringify(state));
};

export const resetM3State = (storage: StringStorage): M3State => {
  storage.removeItem(M3_STORAGE_KEY);
  return emptyM3State();
};
