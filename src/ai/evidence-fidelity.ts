import { validateAuthoredTestimonyFidelity } from './authored-testimony.ts';
import type { NpcTestimonyContext } from './authored-testimony.ts';
import type { SocialDialogueDecision } from './dialogue-metabehavior.ts';
import type { Belief, BeliefConfidence } from './world-state.ts';

const consensusPatterns: RegExp[] = [
  /\bunos y otros\b/i,
  /\bpor el barrio\b/i,
  /\b(?:la gente|todo el mundo|todos) (?:dice|dicen|cuenta|cuentan|repite|repiten)\b/i,
  /\beveryone (?:says|keeps saying|is saying)\b/i,
  /\bpeople (?:say|keep saying|are saying)\b/i,
  /\baround town\b/i,
  /\bthe whole town\b/i
];

const unsupportedExclusivityPatterns: RegExp[] = [
  /\bno he hablado con nadie más\b/i,
  /\bnadie más me (?:lo )?(?:dijo|contó)\b/i,
  /\bno me lo dijo nadie más\b/i,
  /\bno one else (?:told|said)\b/i,
  /\bi (?:haven't|have not) spoken to anyone else\b/i
];

const directPlayerSourcePatterns: RegExp[] = [
  /\b(?:tú|usted|vos)\s+(?:me\s+)?(?:lo\s+)?(?:dijiste|contaste)\b/i,
  /\bme\s+(?:lo\s+)?(?:dijiste|contaste)\b/i,
  /\byou told me\b/i,
  /\byou said (?:that )?to me\b/i
];

const explicitWitnessCountPatterns: RegExp[] = [
  /\b\d+\s+(?:personas|testigos)\b/i,
  /\b(?:dos|tres|cuatro|cinco)\s+(?:personas|testigos)\b/i,
  /\b\d+\s+(?:people|witnesses)\b/i,
  /\b(?:two|three|four|five)\s+(?:people|witnesses)\b/i
];

const inferenceEyewitnessUpgradePatterns: RegExp[] = [
  /\bvi (?:al|a el) (?:viajero|hombre)\b/i,
  /\blo vi (?:salir|irse|entrar|volver)\b/i,
  /\bi saw (?:the )?(?:traveler|man)\b/i,
  /\bi saw him (?:leave|go|enter|return)\b/i
];

const certaintyUpgradePatterns: RegExp[] = [
  /\bsin duda\b/i,
  /\bno hay duda\b/i,
  /\bte lo juro\b/i,
  /\bestoy (?:completamente |totalmente )?segur[oa]\b/i,
  /\bdefinitely\b/i,
  /\bwithout a doubt\b/i,
  /\bi(?:'m| am) (?:absolutely |completely )?sure\b/i,
  /\bi know for certain\b/i
];

const sourceContextPatterns: RegExp[] = [
  /\b(?:anoche|ayer|esta mañana|esta noche|hace un rato|aquí(?: mismo)?|delante de la barra|en la barra|en la taberna).{0,90}\b(?:me (?:lo )?(?:dijiste|contaste|dijo|contó)|(?:mara|iven|él|ella) me (?:lo )?(?:dijo|contó))\b/i,
  /\b(?:me (?:lo )?(?:dijiste|contaste|dijo|contó)|(?:mara|iven|él|ella) me (?:lo )?(?:dijo|contó)).{0,90}\b(?:anoche|ayer|esta mañana|esta noche|hace un rato|aquí(?: mismo)?|delante de la barra|en la barra|en la taberna)\b/i,
  /\b(?:last night|yesterday|this morning|tonight|earlier today|here(?: at the bar)?|at the bar|in the tavern).{0,90}\b(?:you told me|(?:mara|iven|he|she) told me)\b/i,
  /\b(?:you told me|(?:mara|iven|he|she) told me).{0,90}\b(?:last night|yesterday|this morning|tonight|earlier today|here(?: at the bar)?|at the bar|in the tavern)\b/i
];

const rankConfidence = (confidence: BeliefConfidence): number =>
  confidence === 'high' ? 3 : confidence === 'medium' ? 2 : 1;

const relevantBeliefsForDecision = (
  beliefs: readonly Belief[],
  decision: SocialDialogueDecision
): readonly Belief[] => {
  const selected = new Set(decision.relevantBeliefIds);
  return beliefs.filter((belief) => selected.has(belief.id));
};

const matchesAny = (dialogue: string, patterns: readonly RegExp[]): boolean =>
  patterns.some((pattern) => pattern.test(dialogue));

export const validateEvidenceFidelity = (
  dialogue: string,
  beliefs: readonly Belief[],
  decision: SocialDialogueDecision,
  testimonyContext?: NpcTestimonyContext
): string[] => {
  const errors = testimonyContext
    ? validateAuthoredTestimonyFidelity(dialogue, testimonyContext)
    : [];

  if (decision.focus === 'free' || decision.stance === 'none_available') return errors;

  const relevantBeliefs = relevantBeliefsForDecision(beliefs, decision);
  if (relevantBeliefs.length === 0) return errors;

  const hearsay = relevantBeliefs.filter((belief) => belief.provenance.kind === 'hearsay');

  if ((decision.focus === 'hearsay' || decision.focus === 'source') && hearsay.length > 0) {
    if (decision.immediateSourceIds.length <= 1 && matchesAny(dialogue, consensusPatterns)) {
      errors.push('evidence fidelity: dialogue invents additional sources or social consensus not present in structured provenance');
    }
    if (matchesAny(dialogue, explicitWitnessCountPatterns)) {
      errors.push('evidence fidelity: dialogue invents a witness/source count not present in structured provenance');
    }
    if (matchesAny(dialogue, sourceContextPatterns)) {
      errors.push('evidence fidelity: dialogue invents when or where the source conversation occurred');
    }
    if (matchesAny(dialogue, unsupportedExclusivityPatterns)) {
      errors.push('evidence fidelity: dialogue invents source exclusivity not represented in structured provenance');
    }
    if (!decision.immediateSourceIds.includes('player') && matchesAny(dialogue, directPlayerSourcePatterns)) {
      errors.push('evidence fidelity: dialogue flattens hearsay into a direct player-to-NPC conversation');
    }
  }

  if (
    decision.focus === 'own_evidence' &&
    relevantBeliefs.every((belief) => belief.provenance.kind === 'inference') &&
    matchesAny(dialogue, inferenceEyewitnessUpgradePatterns)
  ) {
    errors.push('evidence fidelity: dialogue upgrades an inference into direct eyewitness identification');
  }

  const strongestConfidence = Math.max(...relevantBeliefs.map((belief) => rankConfidence(belief.confidence)));
  const explicitlyUncertain = /\b(?:no estoy segur[oa]|no puedo jurarlo|no lo sé con certeza|not sure|cannot be certain|can't be certain)\b/i.test(dialogue);
  if (strongestConfidence < rankConfidence('high') && !explicitlyUncertain && matchesAny(dialogue, certaintyUpgradePatterns)) {
    errors.push('evidence fidelity: dialogue upgrades structured confidence beyond the supplied evidence');
  }

  return errors;
};
