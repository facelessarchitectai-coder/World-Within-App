export interface Phase1Data {
  identityType: string;
  identityTypeDefinition: string;
  neverBe: string;
  notSay: string;
  notRepresent: string;
  refuse: string;
  emotionalSignature: string;
  dominantRole: string;
  supportingRoles: string[];
  roleDefinition: string;
  supportingBehavior: string;
}

export interface Phase2Data {
  worldDirection: string;
  worldDirectionDefinition: string;
  whatExists: string;
  whatNotBelong: string;
  whatRepeats: string;
  whatBreaks: string;
  ruleCheck: string;
  spaceTypes: string[];
  emotionalTone: string;
  emotionalToneDefinition: string;
}

export interface Phase3Data {
  baseDirection: string;
  visualProperties: {
    colorBehavior: string;
    tone: string;
    stylingDirection: string;
    energy: string;
  };
  pinterestSearch: string;
  referenceCollection: {
    savedImages: string;
    groupedImages: string;
    outliersRemoved: string;
  };
  patternExtraction: {
    lightingBehavior: string;
    colorBehavior: string;
    environmentType: string;
    composition: string;
    emotionalFeel: string;
  };
  ownershipRule: boolean;
  transformation: {
    lighting: string;
    color: string;
    environment: string;
    composition: string;
    meaning: string;
  };
  styling: {
    wears: string;
    notWears: string;
    signatureElements: string;
  };
}

export interface Phase4Data {
  pov: {
    type: 'Inside' | 'Observing' | '';
    definition: string;
  };
  framing: string;
  lens: {
    primary: 'Close' | 'Wide' | '';
    secondary: 'Close' | 'Wide' | '';
    definition: string;
  };
  movement: {
    type: 'Still' | 'Floating' | 'Kinetic' | 'Unstable' | 'Cinematic' | '';
    definition: string;
  };
}

export interface Phase5Data {
  selectedPatterns: string[];
  mainDefinition: string;
  character: string;
  transformation: string;
  structure: string;
  tone: string;
  fivePostRule: string;
}

export interface Phase6Data {
  evolutionType: 'Character' | 'World' | 'Patterns' | '';
  evolutionDefinition: string;
  discoveryDefinition: string;
  connectionDefinition: string;
}

export interface Phase7Data {
  mirror: string;
  reveal: string;
  system: string;
}

export interface Phase8Data {
  loopCount: number;
  define: string;
  create: string;
  test: {
    matchesIdentity: boolean;
    matchesWorld: boolean;
    matchesVisualLanguage: boolean;
    matchesTone: boolean;
    matchesStructure: boolean;
  };
  refine: string;
}

export interface Phase9Data {
  messaging: string;
  conversion: string;
  structure: string;
  movement: 'Attention' | 'Engagement' | 'Understanding' | 'Decision' | '';
  dmFlow: {
    diagnose: string;
    segment: string;
    reframe: string;
    offer: string;
    close: string;
  };
}

export interface Phase10Data {
  botRole: string;
  botAccess: string;
}

export interface SystemState {
  userId: string;
  currentPhase: number;
  completed: boolean;
  initialized?: boolean;
  intentReviewed?: boolean;
  introStart?: boolean;
  introBelief?: boolean;
  phase1?: Phase1Data;
  phase2?: Phase2Data;
  phase3?: Phase3Data;
  phase4?: Phase4Data;
  phase5?: Phase5Data;
  phase6?: Phase6Data;
  phase7?: Phase7Data;
  phase8?: Phase8Data;
  phase9?: Phase9Data;
  phase10?: Phase10Data;
  updatedAt: string;
}

export const PHASES = [
  "System Start",
  "Core Belief",
  "Intent Layers",
  "Phase 1: Identity",
  "Phase 2: World",
  "Phase 3: Visual System",
  "Phase 4: Visual Behavior",
  "Phase 5: Pattern System",
  "Phase 6: Narrative Engine",
  "Phase 7: System Structure",
  "Phase 8: Creation Loop",
  "Phase 9: Conversion System",
  "Phase 10: Control System"
];
