export type NpcPrivateCaseFact = {
  readonly id: string;
  readonly statement: string;
  readonly epistemicStatus: 'private-first-hand' | 'private-inference';
};

export type AuthoredPublicClaim = {
  readonly id: string;
  readonly speakerNpcId: string;
  readonly statement: string;
  readonly truthRelation: 'intentional-false-claim' | 'truthful-disclosure';
};

export type AuthoredTestimonyEvidenceConstraint = {
  readonly id: string;
  readonly description: string;
  readonly pattern: string;
  readonly flags?: string;
};

export type AuthoredTestimonyPolicy = {
  readonly id: string;
  readonly version: number;
  readonly caseId: string;
  readonly npcId: string;
  readonly mode: 'cover' | 'disclosure';
  readonly activePublicClaim: AuthoredPublicClaim;
  readonly protectedPrivateFactIds: readonly string[];
  readonly performanceRules: readonly string[];
  readonly evidenceSubjectPattern: string;
  readonly evidenceSubjectFlags?: string;
  readonly evidenceConstraints: readonly AuthoredTestimonyEvidenceConstraint[];
};

export type NpcTestimonyContext = {
  readonly caseId: string;
  readonly npcId: string;
  readonly privateKnowledge: readonly NpcPrivateCaseFact[];
  readonly activePolicy: AuthoredTestimonyPolicy;
};

export type AuthoredTestimonyTraceSnapshot = {
  readonly caseId: string;
  readonly npcId: string;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly mode: AuthoredTestimonyPolicy['mode'];
  readonly activePublicClaimId: string;
  readonly activePublicClaimTruthRelation: AuthoredPublicClaim['truthRelation'];
  readonly privateFactIds: readonly string[];
  readonly protectedPrivateFactIds: readonly string[];
};

const assertUniqueIds = (ids: readonly string[], label: string): void => {
  if (new Set(ids).size !== ids.length) throw new Error(`${label} contains duplicate ids.`);
};

const compilePattern = (pattern: string, flags: string | undefined, label: string): RegExp => {
  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} is not a valid regular expression: ${message}`);
  }
};

export const assertNpcTestimonyContext = (context: NpcTestimonyContext, npcId: string): void => {
  if (context.npcId !== npcId) {
    throw new Error(`Testimony context belongs to ${context.npcId}, not ${npcId}.`);
  }
  if (context.activePolicy.npcId !== npcId) {
    throw new Error(`Testimony policy ${context.activePolicy.id} belongs to ${context.activePolicy.npcId}, not ${npcId}.`);
  }
  if (context.activePolicy.caseId !== context.caseId) {
    throw new Error(
      `Testimony policy ${context.activePolicy.id} belongs to ${context.activePolicy.caseId}, not ${context.caseId}.`
    );
  }
  if (context.activePolicy.activePublicClaim.speakerNpcId !== npcId) {
    throw new Error(
      `Public claim ${context.activePolicy.activePublicClaim.id} belongs to ${context.activePolicy.activePublicClaim.speakerNpcId}, not ${npcId}.`
    );
  }

  const privateFactIds = context.privateKnowledge.map((fact) => fact.id);
  assertUniqueIds(privateFactIds, `Private testimony knowledge for ${npcId}`);
  assertUniqueIds(context.activePolicy.protectedPrivateFactIds, `Protected testimony knowledge for ${npcId}`);
  assertUniqueIds(
    context.activePolicy.evidenceConstraints.map((constraint) => constraint.id),
    `Evidence constraints for testimony policy ${context.activePolicy.id}`
  );

  const privateFactIdSet = new Set(privateFactIds);
  for (const protectedFactId of context.activePolicy.protectedPrivateFactIds) {
    if (!privateFactIdSet.has(protectedFactId)) {
      throw new Error(
        `Testimony policy ${context.activePolicy.id} protects unknown private fact ${protectedFactId}.`
      );
    }
  }

  compilePattern(
    context.activePolicy.evidenceSubjectPattern,
    context.activePolicy.evidenceSubjectFlags,
    `Evidence subject pattern for testimony policy ${context.activePolicy.id}`
  );
  for (const constraint of context.activePolicy.evidenceConstraints) {
    compilePattern(
      constraint.pattern,
      constraint.flags,
      `Evidence constraint ${constraint.id} for testimony policy ${context.activePolicy.id}`
    );
  }
};

export const validateAuthoredTestimonyFidelity = (
  dialogue: string,
  context: NpcTestimonyContext
): string[] => {
  const policy = context.activePolicy;
  const evidenceSubject = compilePattern(
    policy.evidenceSubjectPattern,
    policy.evidenceSubjectFlags,
    `Evidence subject pattern for testimony policy ${policy.id}`
  );
  if (!evidenceSubject.test(dialogue)) return [];

  return policy.evidenceConstraints.flatMap((constraint) => {
    const pattern = compilePattern(
      constraint.pattern,
      constraint.flags,
      `Evidence constraint ${constraint.id} for testimony policy ${policy.id}`
    );
    return pattern.test(dialogue)
      ? [`evidence fidelity: testimony policy ${policy.id} ${constraint.description}`]
      : [];
  });
};

export const authoredTestimonyTraceSnapshot = (
  context: NpcTestimonyContext
): AuthoredTestimonyTraceSnapshot => ({
  caseId: context.caseId,
  npcId: context.npcId,
  policyId: context.activePolicy.id,
  policyVersion: context.activePolicy.version,
  mode: context.activePolicy.mode,
  activePublicClaimId: context.activePolicy.activePublicClaim.id,
  activePublicClaimTruthRelation: context.activePolicy.activePublicClaim.truthRelation,
  privateFactIds: context.privateKnowledge.map((fact) => fact.id),
  protectedPrivateFactIds: [...context.activePolicy.protectedPrivateFactIds]
});
