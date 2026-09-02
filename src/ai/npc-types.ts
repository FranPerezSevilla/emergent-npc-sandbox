export type NpcEmotion = 'neutral' | 'guarded' | 'nervous' | 'irritated' | 'warm' | 'confused';

export type NpcGesture = 'none' | 'look_away' | 'fold_arms' | 'lean_in' | 'shake_head';

export type NpcIntent = 'continue' | 'end_conversation';

export type NpcResponseV1 = {
  schemaVersion: 1;
  dialogue: string;
  emotion: NpcEmotion;
  gesture: NpcGesture;
  intent: NpcIntent;
};

export type CompetenceLevel = 'none' | 'basic' | 'competent' | 'expert';

export type NpcCompetenceProfile = {
  literacy: CompetenceLevel;
  arithmetic: CompetenceLevel;
  localHistory: CompetenceLevel;
  tavernTrade: CompetenceLevel;
  medicine: CompetenceLevel;
  advancedMathematics: CompetenceLevel;
  programming: CompetenceLevel;
  modernTechnology: CompetenceLevel;
};

export type HearsayStance = 'receptive' | 'neutral' | 'skeptical';
export type ConflictStance = 'reconsider' | 'balanced' | 'defend_own_view';
export type DisclosureStyle = 'open' | 'selective';

export type NpcSocialPolicy = {
  hearsayStance: HearsayStance;
  conflictStance: ConflictStance;
  disclosureStyle: DisclosureStyle;
};

export type NpcKnownFact = {
  id: string;
  statement: string;
};

export type NpcProfile = {
  id: string;
  version: number;
  name: string;
  role: string;
  setting: string;
  personality: string[];
  goals: string[];
  fears: string[];
  speechStyle: string[];
  boundaries: string[];
  competence: NpcCompetenceProfile;
  socialPolicy: NpcSocialPolicy;
  knownFacts: NpcKnownFact[];
};

export type ConversationTurn = {
  speaker: 'player' | 'npc';
  text: string;
};
