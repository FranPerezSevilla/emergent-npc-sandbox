import type { ConversationTrace, InferenceAttemptTrace } from './conversation-trace.ts';
import { deriveSocialDialogueDecision } from './dialogue-metabehavior.ts';
import type { DialogueIntentRequest, SocialDialogueDecision } from './dialogue-metabehavior.ts';
import { validateEvidenceFidelity } from './evidence-fidelity.ts';
import type { InferenceLoadProgress, InferenceProvider } from './inference.ts';
import type { NpcSocialContext } from './memory-state.ts';
import type { ConversationTurn, NpcProfile, NpcResponseV1 } from './npc-types.ts';
import { buildNpcMessages } from './prompt.ts';
import { validateNpcResponse } from './response-validation.ts';
import type { Belief } from './world-state.ts';

export type NpcConversationResult = {
  response: NpcResponseV1;
  trace: ConversationTrace;
};

const likelySpanish = (text: string): boolean =>
  /[¿¡áéíóúñ]|\b(?:hola|qué|que|cómo|como|dime|sabes|eres|tienes|puedes|por qué|dónde|quién)\b/i.test(text);

const fallbackResponse = (profile: NpcProfile, playerUtterance: string, providerFailed: boolean): NpcResponseV1 => ({
  schemaVersion: 1,
  dialogue: likelySpanish(playerUtterance)
    ? providerFailed
      ? `${profile.name} pierde el hilo un instante y niega con la cabeza. «Repítelo.»`
      : `${profile.name} frunce el ceño. «No sé de qué estás hablando.»`
    : providerFailed
      ? `${profile.name} loses the thread for a moment and shakes their head. “Say that again.”`
      : `${profile.name} frowns. “I have no idea what you are talking about.”`,
  emotion: 'confused',
  gesture: 'shake_head',
  intent: 'continue'
});

const sensitiveErrorKey = /(authorization|cookie|token|api[-_]?key|secret|credential)/i;

const summarizeErrorValue = (value: unknown, depth = 0): unknown => {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message
    };
  }

  if (depth >= 2) return '[nested]';

  if (Array.isArray(value)) {
    return value.slice(0, 6).map((item) => summarizeErrorValue(item, depth + 1));
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .filter(([key]) => !sensitiveErrorKey.test(key))
      .slice(0, 12)
      .map(([key, item]) => [key, summarizeErrorValue(item, depth + 1)] as const);
    return Object.fromEntries(entries);
  }

  return String(value);
};

const safeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return `${error.name}: ${error.message}`.slice(0, 500);

  try {
    const serialized = JSON.stringify(summarizeErrorValue(error));
    if (serialized && serialized !== '{}') return serialized.slice(0, 500);
  } catch {
    // Fall through to the string representation if a provider throws an unserializable object.
  }

  return String(error).slice(0, 500);
};

export class NpcConversationEngine {
  readonly provider: InferenceProvider;
  readonly profile: NpcProfile;
  readonly beliefs: readonly Belief[];

  constructor(provider: InferenceProvider, profile: NpcProfile, beliefs: readonly Belief[] = []) {
    const foreignBelief = beliefs.find((belief) => belief.ownerNpcId !== profile.id);
    if (foreignBelief) {
      throw new Error(`Belief ${foreignBelief.id} belongs to ${foreignBelief.ownerNpcId}, not ${profile.id}.`);
    }

    this.provider = provider;
    this.profile = profile;
    this.beliefs = Object.freeze([...beliefs]);
  }

  async initialize(onProgress?: (progress: InferenceLoadProgress) => void): Promise<void> {
    if (this.provider.initialize) await this.provider.initialize(onProgress);
  }

  async respond(
    playerUtterance: string,
    recentConversation: ConversationTurn[],
    socialContext?: NpcSocialContext,
    dialogueIntent?: DialogueIntentRequest
  ): Promise<NpcConversationResult> {
    const foreignMemory = socialContext?.memories.find((memory) => memory.ownerNpcId !== this.profile.id);
    if (foreignMemory) {
      throw new Error(`Memory ${foreignMemory.id} belongs to ${foreignMemory.ownerNpcId}, not ${this.profile.id}.`);
    }
    if (socialContext && socialContext.relationship.npcId !== this.profile.id) {
      throw new Error(
        `Relationship state belongs to ${socialContext.relationship.npcId}, not ${this.profile.id}.`
      );
    }

    const socialDialogueDecision = deriveSocialDialogueDecision(
      this.profile,
      this.beliefs,
      dialogueIntent,
      socialContext?.relationship.trust ?? 0
    );
    const startedAt = performance.now();
    const attempts: InferenceAttemptTrace[] = [];
    let retryReason: string | undefined;
    let providerFailed = false;

    for (const attempt of [1, 2] as const) {
      const messages = buildNpcMessages(
        this.profile,
        playerUtterance,
        recentConversation,
        retryReason,
        this.beliefs,
        socialContext?.memories ?? [],
        socialContext?.relationship,
        socialDialogueDecision
      );

      try {
        const result = await this.provider.generate({
          messages,
          maxTokens: 180,
          temperature: attempt === 1 ? 0.55 : 0.35
        });
        const responseValidation = validateNpcResponse(result.text);
        const evidenceErrors = responseValidation.ok
          ? validateEvidenceFidelity(responseValidation.response.dialogue, this.beliefs, socialDialogueDecision)
          : [];
        const validationErrors = [...responseValidation.errors, ...evidenceErrors];
        attempts.push({
          attempt,
          latencyMs: result.latencyMs,
          rawText: result.text,
          validationErrors
        });

        if (responseValidation.ok && evidenceErrors.length === 0) {
          const trace = this.makeTrace(
            playerUtterance,
            recentConversation,
            socialContext,
            socialDialogueDecision,
            attempts,
            attempt === 1 ? 'model' : 'retry',
            responseValidation.response,
            performance.now() - startedAt
          );
          return { response: responseValidation.response, trace };
        }

        retryReason = validationErrors.join('; ').slice(0, 400);
      } catch (error) {
        providerFailed = true;
        attempts.push({
          attempt,
          latencyMs: performance.now() - startedAt,
          providerError: safeErrorMessage(error),
          validationErrors: []
        });
        break;
      }
    }

    const response = fallbackResponse(this.profile, playerUtterance, providerFailed);
    const trace = this.makeTrace(
      playerUtterance,
      recentConversation,
      socialContext,
      socialDialogueDecision,
      attempts,
      'fallback',
      response,
      performance.now() - startedAt
    );
    return { response, trace };
  }

  private makeTrace(
    playerUtterance: string,
    recentConversation: ConversationTurn[],
    socialContext: NpcSocialContext | undefined,
    socialDialogueDecision: SocialDialogueDecision,
    attempts: InferenceAttemptTrace[],
    finalSource: ConversationTrace['finalSource'],
    finalResponse: NpcResponseV1,
    totalLatencyMs: number
  ): ConversationTrace {
    return {
      traceId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      npcId: this.profile.id,
      npcProfileVersion: this.profile.version,
      playerUtterance,
      permittedFactIds: this.profile.knownFacts.map((fact) => fact.id),
      selectedBeliefIds: this.beliefs.map((belief) => belief.id),
      selectedMemoryIds: socialContext?.memories.map((memory) => memory.id) ?? [],
      relationshipSnapshot: socialContext ? { trust: socialContext.relationship.trust } : undefined,
      socialDialogueDecision,
      recentTurnCount: recentConversation.length,
      providerId: this.provider.providerId,
      modelId: this.provider.modelId,
      attempts,
      finalSource,
      finalResponse,
      totalLatencyMs: Math.round(totalLatencyMs)
    };
  }
}
