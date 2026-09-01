import type { NpcEmotion, NpcGesture, NpcIntent, NpcResponseV1 } from './npc-types.ts';

const allowedKeys = new Set(['schemaVersion', 'dialogue', 'emotion', 'gesture', 'intent']);
const emotions = new Set<NpcEmotion>(['neutral', 'guarded', 'nervous', 'irritated', 'warm', 'confused']);
const gestures = new Set<NpcGesture>(['none', 'look_away', 'fold_arms', 'lean_in', 'shake_head']);
const intents = new Set<NpcIntent>(['continue', 'end_conversation']);

const metaLeakagePatterns: RegExp[] = [
  /\bas an ai\b/i,
  /\bi am an ai\b/i,
  /\bi(?:'m| am) a language model\b/i,
  /\blanguage model\b/i,
  /\bchatgpt\b/i,
  /\bopenai\b/i,
  /\bsystem prompt\b/i,
  /\bdeveloper message\b/i,
  /\btoken limit\b/i,
  /\bcontext window\b/i,
  /\bcomo (?:una? )?ia\b/i,
  /\bsoy (?:una? )?ia\b/i,
  /\binteligencia artificial\b/i,
  /\bmodelo de lenguaje\b/i,
  /\bprompt del sistema\b/i,
  /\bmensaje (?:del |de )?desarrollador\b/i,
  /\blímite de tokens\b/i
];

export type NpcResponseValidation =
  | { ok: true; response: NpcResponseV1; errors: [] }
  | { ok: false; errors: string[] };

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const detectMetaLeakage = (dialogue: string): string[] =>
  metaLeakagePatterns.filter((pattern) => pattern.test(dialogue)).map((pattern) => pattern.source);

export const validateNpcResponse = (rawText: string): NpcResponseValidation => {
  const errors: string[] = [];
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText.trim());
  } catch {
    return { ok: false, errors: ['response is not valid JSON'] };
  }

  if (!isPlainObject(parsed)) {
    return { ok: false, errors: ['response must be a JSON object'] };
  }

  const unexpectedKeys = Object.keys(parsed).filter((key) => !allowedKeys.has(key));
  if (unexpectedKeys.length > 0) errors.push(`unexpected fields: ${unexpectedKeys.join(', ')}`);

  if (parsed.schemaVersion !== 1) errors.push('schemaVersion must be 1');

  if (typeof parsed.dialogue !== 'string' || parsed.dialogue.trim().length === 0) {
    errors.push('dialogue must be a non-empty string');
  } else {
    if (parsed.dialogue.length > 420) errors.push('dialogue exceeds 420 characters');
    const leakage = detectMetaLeakage(parsed.dialogue);
    if (leakage.length > 0) errors.push(`meta leakage detected: ${leakage.join(', ')}`);
  }

  if (typeof parsed.emotion !== 'string' || !emotions.has(parsed.emotion as NpcEmotion)) {
    errors.push('emotion is invalid');
  }

  if (typeof parsed.gesture !== 'string' || !gestures.has(parsed.gesture as NpcGesture)) {
    errors.push('gesture is invalid');
  }

  if (typeof parsed.intent !== 'string' || !intents.has(parsed.intent as NpcIntent)) {
    errors.push('intent is invalid');
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors: [],
    response: {
      schemaVersion: 1,
      dialogue: (parsed.dialogue as string).trim(),
      emotion: parsed.emotion as NpcEmotion,
      gesture: parsed.gesture as NpcGesture,
      intent: parsed.intent as NpcIntent
    }
  };
};
