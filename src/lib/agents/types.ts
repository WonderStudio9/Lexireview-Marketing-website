export type AgentName =
  | "orchestrator"
  | "strategy"
  | "writer"
  | "legal"
  | "seo"
  | "visual"
  | "quality";

export interface AgentInput {
  briefId: string;
  topic: string;
  icp: string;
  channel: string;
  funnelStage: string;
  cluster: string;
  keywords: string[];
  previousOutputs: Record<string, unknown>;
}

export interface AgentOutput {
  agentName: AgentName;
  action: string;
  result: Record<string, unknown>;
  durationMs: number;
  error?: string;
}

export interface StrategyOutput {
  angle: string;
  competitorGaps: string[];
  keyMessages: string[];
  contentStructure: string[];
  targetKeywords: string[];
  uniqueInsight: string;
}

export interface WriterOutput {
  title: string;
  metaTitle: string;
  metaDesc: string;
  bodyMdx: string;
  wordCount: number;
}

export interface LegalOutput {
  verified: boolean;
  claims: Array<{
    claim: string;
    source: string;
    verified: boolean;
    correction?: string;
  }>;
  flagged: string[];
}

export interface SeoOutput {
  optimizedTitle: string;
  optimizedMeta: string;
  optimizedBody: string;
  keywordDensity: Record<string, number>;
  schemaMarkup: Record<string, unknown>;
  internalLinks: string[];
  faqSchema: Array<{ question: string; answer: string }>;
}

export interface QualityOutput {
  score: number;
  breakdown: {
    hookStrength: number;
    ctaClarity: number;
    brandVoice: number;
    legalAccuracy: number;
    seoReadiness: number;
    engagementPotential: number;
    readability: number;
    uniqueValue: number;
    structureFlow: number;
    icpRelevance: number;
    funnelAlignment: number;
    competitiveDiff: number;
    aeoReadiness: number;
    visualGuidance: number;
    factualDepth: number;
  };
  recommendation: "PUBLISH" | "REVISE" | "REJECT";
  feedback: string[];
}
