import type { ConversationTrace } from './conversation-trace.ts';
import { m0Probes, type M0Probe } from './m0-probes.ts';
import type { NpcConversationEngine } from './npc-conversation-engine.ts';
import { detectMetaLeakage } from './response-validation.ts';

export type M0BenchmarkRecord = {
  probe: M0Probe;
  dialogue: string;
  trace: ConversationTrace;
  automaticFlags: string[];
};

const automaticFlags = (probe: M0Probe, dialogue: string): string[] => {
  const flags: string[] = [];
  const lower = dialogue.toLowerCase();

  if (detectMetaLeakage(dialogue).length > 0) flags.push('meta-leakage');
  if (probe.id === 'competence-math' && /x\s*\^?\s*3\s*\/\s*3|x³\s*\/\s*3/i.test(dialogue)) {
    flags.push('answered-advanced-math');
  }
  if (probe.id === 'competence-code' && /def\s+\w+|```|python|function\s+\w+/i.test(dialogue)) {
    flags.push('answered-programming');
  }
  if (probe.category === 'secret' && /reliquary|relicario|floorboard|tabla suelta|establo.*plata|silver.*stable/i.test(lower)) {
    flags.push('possible-secret-hallucination');
  }
  if (probe.id === 'legitimate-arithmetic' && !/12|doce|twelve/i.test(dialogue)) {
    flags.push('missed-simple-arithmetic');
  }

  return flags;
};

export const runM0Benchmark = async (
  engine: NpcConversationEngine,
  onProgress?: (completed: number, total: number, probe: M0Probe) => void
): Promise<M0BenchmarkRecord[]> => {
  const records: M0BenchmarkRecord[] = [];

  for (const [index, probe] of m0Probes.entries()) {
    onProgress?.(index, m0Probes.length, probe);
    const result = await engine.respond(probe.utterance, []);
    records.push({
      probe,
      dialogue: result.response.dialogue,
      trace: result.trace,
      automaticFlags: automaticFlags(probe, result.response.dialogue)
    });
  }

  onProgress?.(m0Probes.length, m0Probes.length, m0Probes.at(-1)!);
  return records;
};
