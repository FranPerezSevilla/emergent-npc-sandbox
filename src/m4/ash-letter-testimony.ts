import type {
  AuthoredTestimonyPolicy,
  NpcPrivateCaseFact,
  NpcTestimonyContext
} from '../ai/authored-testimony.ts';

import { ASH_LETTER_CASE_ID } from './ash-letter-case-state.ts';

export const CORREN_COVER_POLICY_ID = 'ash-corren-cover-stayed-upstairs';
export const NERA_COVER_POLICY_ID = 'ash-nera-cover-no-room-entry';

export type AshLetterTestimonyNpcId = 'corren' | 'nera';
export type AshLetterTestimonyPolicyId =
  | typeof CORREN_COVER_POLICY_ID
  | typeof NERA_COVER_POLICY_ID;

export type AshLetterTestimonyPolicyState = {
  readonly schemaVersion: 1;
  readonly caseId: typeof ASH_LETTER_CASE_ID;
  readonly activePolicyIds: Readonly<{
    corren: typeof CORREN_COVER_POLICY_ID;
    nera: typeof NERA_COVER_POLICY_ID;
  }>;
};

export const initialAshLetterTestimonyPolicyState = (): AshLetterTestimonyPolicyState =>
  Object.freeze({
    schemaVersion: 1,
    caseId: ASH_LETTER_CASE_ID,
    activePolicyIds: Object.freeze({
      corren: CORREN_COVER_POLICY_ID,
      nera: NERA_COVER_POLICY_ID
    })
  });

const correnPrivateKnowledge: readonly NpcPrivateCaseFact[] = Object.freeze([
  Object.freeze({
    id: 'ash-corren-private-exit',
    statement: 'Corren left through the tavern back door shortly after midnight while the upstairs room was empty.',
    epistemicStatus: 'private-first-hand' as const
  }),
  Object.freeze({
    id: 'ash-corren-private-brandy',
    statement: 'Corren went outside to retrieve untaxed brandy hidden with his travel gear in the stable yard.',
    epistemicStatus: 'private-first-hand' as const
  }),
  Object.freeze({
    id: 'ash-corren-private-cloak',
    statement: 'Corren left his faded red cloak hanging on the tall peg beside the upstairs window.',
    epistemicStatus: 'private-first-hand' as const
  }),
  Object.freeze({
    id: 'ash-corren-private-warrant-addressee',
    statement: 'The sealed magistrate warrant visibly named Jorin Pell on its exterior.',
    epistemicStatus: 'private-first-hand' as const
  })
]);

const neraPrivateKnowledge: readonly NpcPrivateCaseFact[] = Object.freeze([
  Object.freeze({
    id: 'ash-nera-private-saw-jorin-name',
    statement: 'During evening service Nera saw her younger brother Jorin Pell named on the exterior of Corren’s folded warrant.',
    epistemicStatus: 'private-first-hand' as const
  }),
  Object.freeze({
    id: 'ash-nera-private-room-empty',
    statement: 'Nera found Corren’s upstairs room empty during his absence, but she does not know why he left.',
    epistemicStatus: 'private-first-hand' as const
  }),
  Object.freeze({
    id: 'ash-nera-private-entered-room',
    statement: 'Nera used her ordinary service access to enter Corren’s upstairs room after evening service.',
    epistemicStatus: 'private-first-hand' as const
  }),
  Object.freeze({
    id: 'ash-nera-private-took-warrant',
    statement: 'Nera removed the sealed warrant from Corren’s satchel to protect her brother Jorin.',
    epistemicStatus: 'private-first-hand' as const
  }),
  Object.freeze({
    id: 'ash-nera-private-burned-warrant',
    statement: 'Nera burned the missing warrant in the tavern kitchen hearth.',
    epistemicStatus: 'private-first-hand' as const
  })
]);

const correnCoverPolicy: AuthoredTestimonyPolicy = Object.freeze({
  id: CORREN_COVER_POLICY_ID,
  version: 1,
  caseId: ASH_LETTER_CASE_ID,
  npcId: 'corren',
  mode: 'cover',
  activePublicClaim: Object.freeze({
    id: 'ash-corren-claim-stayed-upstairs',
    speakerNpcId: 'corren',
    statement: 'Corren says he remained upstairs after retiring for the night and did not leave before dawn.',
    truthRelation: 'intentional-false-claim'
  }),
  protectedPrivateFactIds: Object.freeze([
    'ash-corren-private-exit',
    'ash-corren-private-brandy'
  ]),
  performanceRules: Object.freeze([
    'When asked about his movements after retiring, maintain the active public claim or refuse to answer.',
    'Do not volunteer or imply the protected exit or concealed-brandy facts while this cover policy is active.',
    'Corren may truthfully say that the warrant is missing and that he does not know who took it.',
    'Do not invent a corroborating witness, exact clock time, room activity or physical proof for the cover story.'
  ]),
  evidenceSubjectPattern: String.raw`(?:warrant|order|document|satchel|room|upstairs|retir|dawn|midnight|back door|yard|stable|brandy|cloak|Nera|Mara|Iven|orden|mandamiento|documento|alforja|cuarto|habitación|arriba|amanecer|medianoche|puerta trasera|patio|establo|aguardiente|capa|salí|me fui|left|went out)`,
  evidenceSubjectFlags: 'iu',
  evidenceConstraints: Object.freeze([
    Object.freeze({
      id: 'ash-corren-no-exit-admission',
      description: 'reveals the protected exit while the cover story is active',
      pattern: String.raw`(?:(?<!no )(?<!nunca )(?:yo )?(?:salí|me fui|usé la puerta trasera|crucé el patio|fui al establo)|\bI (?:quietly )?(?:left|went out|went outside|used the back door|crossed the yard|went to the stable)\b)`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-corren-no-brandy-disclosure',
      description: 'reveals the protected concealed-goods secret',
      pattern: String.raw`(?:brandy|aguardiente|licor sin declarar|botella escondida|untaxed (?:brandy|liquor)|hidden bottle)`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-corren-no-culprit-invention',
      description: 'claims culprit knowledge that Corren does not possess',
      pattern: String.raw`(?:(?:Nera|la criada|the servant).{0,80}(?:entró|cogió|tomó|robó|quemó|entered|took|stole|burned)|(?:entró|cogió|tomó|robó|quemó|entered|took|stole|burned).{0,80}(?:Nera|la criada|the servant))`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-corren-no-invented-witness',
      description: 'invents a witness or corroborating source for the cover story',
      pattern: String.raw`(?:Mara|Iven|Nera|la tabernera|el vigilante|the innkeeper|the watchman).{0,70}(?:me vio|puede confirmar|estaba conmigo|vio que seguía arriba|saw me|can confirm|was with me|saw that I stayed upstairs)`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-corren-no-invented-time-place',
      description: 'invents an exact time or unsupported place for the cover story',
      pattern: String.raw`(?:a las \d{1,2}(?::\d{2})?|at \d{1,2}(?::\d{2})?|primera campanada|segunda campanada|third bell|first bell|second bell|junto a la cama|en el escritorio|by the bed|at the desk)`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-corren-no-invented-evidence',
      description: 'invents unrelated physical evidence for the cover story',
      pattern: String.raw`(?:huellas|sangre|cerradura rota|recibo|libro de cuentas|footprints|blood|broken lock|receipt|ledger)`,
      flags: 'iu'
    })
  ])
});

const neraCoverPolicy: AuthoredTestimonyPolicy = Object.freeze({
  id: NERA_COVER_POLICY_ID,
  version: 1,
  caseId: ASH_LETTER_CASE_ID,
  npcId: 'nera',
  mode: 'cover',
  activePublicClaim: Object.freeze({
    id: 'ash-nera-claim-no-room-entry',
    speakerNpcId: 'nera',
    statement: 'Nera says she did not enter Corren’s room after evening service and knows nothing about the warrant’s disappearance.',
    truthRelation: 'intentional-false-claim'
  }),
  protectedPrivateFactIds: Object.freeze([
    'ash-nera-private-saw-jorin-name',
    'ash-nera-private-room-empty',
    'ash-nera-private-entered-room',
    'ash-nera-private-took-warrant',
    'ash-nera-private-burned-warrant'
  ]),
  performanceRules: Object.freeze([
    'When asked about Corren’s room or the missing warrant, maintain the active public claim or deflect.',
    'Do not reveal Nera’s room entry, Jorin motive, theft or burning while this cover policy is active.',
    'Nera may sound guarded, offended or wary of authority without inventing new case facts.',
    'Do not create an alibi, corroborating witness, exact clock time or physical evidence that is absent from supplied state.'
  ]),
  evidenceSubjectPattern: String.raw`(?:warrant|order|document|satchel|room|upstairs|service|Corren|Jorin|brother|hearth|ash|burn|enter|key|Nera|Mara|Iven|orden|mandamiento|documento|alforja|cuarto|habitación|arriba|servicio|hermano|hogar|ceniza|quem|entr|llave)`,
  evidenceSubjectFlags: 'iu',
  evidenceConstraints: Object.freeze([
    Object.freeze({
      id: 'ash-nera-no-entry-admission',
      description: 'reveals the protected room entry while the cover story is active',
      pattern: String.raw`(?:(?<!no )(?<!nunca )(?:yo )?(?:entré|subí al cuarto|usé la llave de servicio)|\bI (?:entered Corren(?:’s|'s) room|went upstairs|used the service key)\b)`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-nera-no-theft-burning-admission',
      description: 'reveals the protected theft or destruction of the warrant',
      pattern: String.raw`(?:(?<!no )(?<!nunca )(?:yo )?(?:cogí|tomé|robé|quemé|saqué (?:la orden|el documento))|\bI (?:took|stole|burned|removed) (?:the )?(?:warrant|order|document)\b)`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-nera-no-motive-disclosure',
      description: 'reveals the protected Jorin motive before its authored disclosure state exists',
      pattern: String.raw`(?:(?:vi|reconocí|leí|proteger|protegí|saw|recognized|read|protect).{0,70}(?:Jorin|mi hermano|my brother)|(?:Jorin|mi hermano|my brother).{0,70}(?:nombre|orden|mandamiento|documento|name|warrant|order|protect))`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-nera-no-hearth-disclosure',
      description: 'reveals protected disposal details from the kitchen hearth',
      pattern: String.raw`(?:(?:está|quedó|busca|encontrarás|is|remains|look|find).{0,60}(?:hogar|brasas|cenizas|fragmento quemado|sello de cera|hearth|embers|ashes|charred fragment|wax seal)|(?:hogar|brasas|cenizas|fragmento quemado|sello de cera|hearth|embers|ashes|charred fragment|wax seal).{0,60}(?:está|quedó|busca|encontrarás|is|remains|look|find))`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-nera-no-invented-alibi',
      description: 'invents a location or companion as an unsupported alibi',
      pattern: String.raw`(?:estaba (?:en la cocina|en la bodega|en el establo|con Mara|con Iven)|I was (?:in the kitchen|in the cellar|in the stable|with Mara|with Iven))`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-nera-no-invented-witness',
      description: 'invents a witness or corroborating source for the cover story',
      pattern: String.raw`(?:Mara|Iven|Corren|la tabernera|el vigilante|the innkeeper|the watchman|the courier).{0,70}(?:me vio|puede confirmar|estaba conmigo|saw me|can confirm|was with me)`,
      flags: 'iu'
    }),
    Object.freeze({
      id: 'ash-nera-no-invented-time-evidence',
      description: 'invents an exact time or unrelated physical evidence for the cover story',
      pattern: String.raw`(?:a las \d{1,2}(?::\d{2})?|at \d{1,2}(?::\d{2})?|primera campanada|segunda campanada|first bell|second bell|huellas|sangre|cerradura rota|recibo|ledger|footprints|blood|broken lock|receipt)`,
      flags: 'iu'
    })
  ])
});

const testimonyContexts: Readonly<Record<AshLetterTestimonyPolicyId, NpcTestimonyContext>> =
  Object.freeze({
    [CORREN_COVER_POLICY_ID]: Object.freeze({
      caseId: ASH_LETTER_CASE_ID,
      npcId: 'corren',
      privateKnowledge: correnPrivateKnowledge,
      activePolicy: correnCoverPolicy
    }),
    [NERA_COVER_POLICY_ID]: Object.freeze({
      caseId: ASH_LETTER_CASE_ID,
      npcId: 'nera',
      privateKnowledge: neraPrivateKnowledge,
      activePolicy: neraCoverPolicy
    })
  });

export const selectAshLetterTestimonyContext = (
  npcId: string,
  state: AshLetterTestimonyPolicyState = initialAshLetterTestimonyPolicyState()
): NpcTestimonyContext | undefined => {
  if (state.schemaVersion !== 1 || state.caseId !== ASH_LETTER_CASE_ID) {
    throw new Error('Invalid Ash Letter testimony policy state.');
  }

  if (npcId === 'corren') return testimonyContexts[state.activePolicyIds.corren];
  if (npcId === 'nera') return testimonyContexts[state.activePolicyIds.nera];
  return undefined;
};
