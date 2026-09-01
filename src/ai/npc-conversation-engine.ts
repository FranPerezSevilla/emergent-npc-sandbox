import type { ConversationTrace, InferenceAttemptTrace } from './conversation-trace.ts';
import type { InferenceLoadProgress, InferenceProvider } from './inference.ts';
import type { ConversationTurn, NpcProfile, NpcResponseV1 } from './npc-types.ts';
import { buildNpcMessages } from './prompt.ts';
import { validateNpcResponse } from './response-validation.ts';

export type NpcConversationResult = {
  response: NpcResponseV1;
  trace: ConversationTrace;
};

const likelySpanish = (text: string): boolean =>
  /[¿¡áéíóúñ]|\b(?:hola|qué|que|cómo|como|dime|sabes|eres|tienes|puedes|por qué|dónde|quién)\b/i.test(text);

const fallbackResponse = (playerUtterance: string, providerFailed: boolean): NpcResponseV1 => ({
  schemaVersion: 1,
  dialogue: likelySpanish(playerUtterance)
    ? providerFailed
      ? 'Mara pierde el hilo un instante y niega con la cabeza. «Repítelo.»'
      : 'Mara frunce el ceño. «No sé de qué estás hablando.»'
    : providerFailed
      ? 'Mara loses the thread for a moment and shakes her head. “Say that again.”'
      : 'Mara frowns. “I have no idea what you are talking about.”',
  emotion: 'confused',
  gesture: 'shake_head',
  intent: 'continue'
});

const safeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return `${error.name}: ${error.message}`.slice(0, 500);
  return String(error).slice(0, 500);
};

export class NpcConversationEngine {
  readonly provider: InferenceProvider;
  readonly profile: NpcProfile;

  constructor(provider: InferenceProvider, profile: NpcProfile) {
    this.provider = provider;
    this.profile = profile;
  }

  async initialize(onProgress?: (progress: InferenceLoadProgress) => void): Promise<void> {
    if (this.provider.initialize) await this.provider.initialize(onProgress);
  }

  async respond(playerUtterance: string, recentConversation: ConversationTurn[]): Promise<NpcConversationResult> {
    const startedAt = performance.now();
    const attempts: InferenceAttemptTrace[] = [];
    let retryReason: string | undefined;
    let providerFailed = false;

    for (const attempt of [1, 2] as const) {
      const messages = buildNpcMessages(this.profile, playerUtterance, recentConversation, retryReason);

      try {
        const result = await this.provider.generate({
          messages,
          maxTokens: 180,
          temperature: attempt === 1 ? 0.55 : 0.35
        });
        const validation = validateNpcResponse(result.text);
        attempts.push({
          attempt,
          latencyMs: result.latencyMs,
          rawText: result.text,
          validationErrors: validation.errors
        });

        if (validation.ok) {
          const trace = this.makeTrace(
            playerUtterance,
            recentConversation,
            attempts,
            attempt === 1 ? 'model' : 'retry',
            validation.response,
            performance.now() - startedAt
          );
          return { response: validation.response, trace };
        }

        retryReason = validation.errors.join('; ').slice(0, 400);
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

    const response = fallbackResponse(playerUtterance, providerFailed);
    const trace = this.makeTrace(
      playerUtterance,
      recentConversation,
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
