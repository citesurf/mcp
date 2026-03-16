export interface Brand {
  id: string;
  name: string;
  website: string;
  type: "PERSON" | "PRODUCT" | "COMPANY" | "SHOP";
  category: string | null;
  description: string | null;
  language: string;
  createdAt: string;
  visibilityScore: number;
  mentionRate: number;
  scoreChange: number;
  probeCount: number;
  scanActive: boolean;
  lastScanAt: string | null;
}

export interface BrandDetail extends Brand {
  fixedPrompts: string[];
  competitors: Competitor[];
  averagePosition: number | null;
  shareOfVoice: number;
  caveatRate: number;
  avgFirstMentionOffset: number;
  sentimentDistribution: SentimentDistribution;
  topCitedDomains: CitedDomain[];
  platformBreakdown: PlatformScore[];
  scanCount: number;
}

export interface BrandCreateResult {
  id: string;
  name: string;
}

export interface BrandUpdateResult {
  id: string;
  name: string;
  website: string;
  type: "PERSON" | "PRODUCT" | "COMPANY" | "SHOP";
  category: string | null;
  description: string | null;
  language: string;
  prompts: string[];
  updatedAt: string;
}

export interface Competitor {
  name: string;
  website: string | null;
  mentionCount: number;
}

export interface CitedDomain {
  domain: string;
  count: number;
}

export interface PlatformScore {
  platform: "CHATGPT" | "CLAUDE" | "PERPLEXITY" | "GEMINI";
  score: number;
  mentionRate: number;
  probeCount: number;
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface ScanSummary {
  id: string;
  createdAt: string;
  visibilityScore: number;
  mentionRate: number;
  averagePosition: number | null;
  platformScores: PlatformScores;
  sentimentDistribution: SentimentDistribution;
  topCompetitors: { name: string; mentions: number }[];
  topCitedDomains: CitedDomain[];
  probeCount: number;
  shareOfVoice: number;
  caveatRate: number;
  avgFirstMentionOffset: number;
}

export interface PlatformScores {
  CHATGPT: number;
  CLAUDE: number;
  PERPLEXITY: number;
  GEMINI: number;
}

export interface ScanDetail extends ScanSummary {
  probes: Probe[];
  siteAudit?: SiteAudit;
}

export interface Probe {
  id: string;
  promptText: string;
  isFixed: boolean;
  persona: { name: string } | null;
  platforms: Record<string, PlatformResult>;
}

export interface PlatformResult {
  mentioned: boolean;
  position: number | null;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | null;
  sentimentScore: number | null;
  contextType: "RECOMMENDATION" | "COMPARISON" | "WARNING" | "NEUTRAL" | null;
  recommendationStrength: "STRONG" | "MODERATE" | "WEAK" | null;
  competitorsMentioned: string[] | null;
  response: string | null;
  citations: { domain: string; url: string; position: number }[] | null;
}

export interface ScanListResult {
  scans: ScanSummary[];
  hasMore: boolean;
  offset: number;
  pageSize: number;
  total: number;
}

export interface ScanTriggerResult {
  brandId: string;
  creditsUsed: number;
  creditsRemaining: number;
  status: string;
}

export interface TrendPoint {
  date: string;
  visibilityScore: number;
  mentionRate: number;
  averagePosition: number | null;
  CHATGPT: number;
  CLAUDE: number;
  PERPLEXITY: number;
  GEMINI: number;
}

export interface TrendsResult {
  trends: TrendPoint[];
  range: number;
}

export interface PromptScanResult {
  id: string;
  platform: string;
  mentioned: boolean;
  position: number | null;
  sentiment: string | null;
  sentimentScore: number | null;
  contextType: string | null;
  recommendationStrength: string | null;
  competitorsMentioned: string[] | null;
  response: string | null;
  createdAt: string;
}

export interface PromptEntry {
  id: string;
  text: string;
  isFixed: boolean;
  persona: { name: string } | null;
  scans: PromptScanResult[];
  stats: {
    totalScans: number;
    mentionRate: number;
    avgPosition: number | null;
    platformBreakdown: Record<
      string,
      {
        mentioned: boolean;
        position: number | null;
        sentiment: string | null;
      }
    >;
  };
  totalResults: number;
  hasMore: boolean;
}

export interface PromptsResult {
  prompts: PromptEntry[];
  count: number;
  platformFilter: string;
  hasMore: boolean;
  offset: number;
  pageSize: number;
}

export interface PersonaPrompt {
  id: string;
  text: string;
  scans: {
    id: string;
    platform: string;
    mentioned: boolean;
    position: number | null;
    sentiment: string | null;
    contextType: string | null;
    recommendationStrength: string | null;
    response: string | null;
    createdAt: string;
  }[];
  totalResults: number;
  hasMore: boolean;
}

export interface PersonaEntry {
  id: string;
  name: string;
  description: string;
  prompts: PersonaPrompt[];
}

export interface PersonasResult {
  personas: PersonaEntry[];
  hasMore: boolean;
  offset: number;
  pageSize: number;
}

export interface Insight {
  id: string;
  brandId: string;
  type:
    | "VISIBILITY"
    | "SENTIMENT"
    | "POSITIONING"
    | "COMPETITION"
    | "OPPORTUNITY";
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  action: string;
  confidence: "HIGH" | "MEDIUM" | "LOW" | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  improvement: Record<string, unknown> | null;
}

export interface InsightsResult {
  insights: Insight[];
  hasMore: boolean;
  offset: number;
  pageSize: number;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export interface SiteAudit {
  checkedAt: string;
  robotsTxt: {
    found: boolean;
    allowsGPTBot: boolean;
    allowsClaudeBot: boolean;
    allowsPerplexityBot: boolean;
    allowsGoogleExtended: boolean;
  };
  llmsTxt: {
    found: boolean;
    valid: boolean | null;
    contentLength: number | null;
  };
  schema: {
    found: boolean;
    types: string[];
  };
  sitemap: {
    found: boolean;
    urlCount: number | null;
    lastmod: string | null;
  };
  openGraph: {
    found: boolean;
    hasTitle: boolean;
    hasDescription: boolean;
    hasImage: boolean;
    hasUrl: boolean;
    hasType: boolean;
  };
}

export interface ReportPrompt {
  text: string;
  category: "Fixed" | "Dynamic";
  personaName?: string;
  mentionRate: number;
  totalResponses: number;
  mentions: number;
  platformResults: Record<
    string,
    {
      mentioned: boolean;
      position: number | null;
      sentiment: string | null;
    }
  >;
}

export interface Report {
  brandName: string;
  website?: string;
  description?: string;
  language?: string;
  prompts: ReportPrompt[];
  summary: {
    visibilityScore: number;
    mentionRate: number;
    averagePosition: number | null;
    totalScans: number;
    scoreChange: number;
    shareOfVoice: number;
    caveatRate: number;
    avgFirstMentionOffset: number;
  };
  platformScores: PlatformScores;
  sentimentDistribution: SentimentDistribution;
  contextDistribution: {
    RECOMMENDATION: number;
    COMPARISON: number;
    WARNING: number;
    NEUTRAL: number;
  };
  competitors: { name: string; mentionCount: number }[];
  citedDomains: CitedDomain[];
  trends: {
    date: string;
    visibilityScore: number;
    mentionRate: number;
    platformScores: PlatformScores;
  }[];
  siteAudit: SiteAudit | null;
  auditIssues?: string[];
  insights: {
    type: string;
    priority: string;
    title: string;
    description: string;
    action: string;
  }[];
}

export interface AccountInfo {
  plan: "TRIAL" | "PLUS" | "MAX";
  paymentStatus: "NONE" | "ACTIVE" | "FAILED" | "CANCELLED";
  brandCount: number;
  brandLimit: number;
  creditBalance: number;
}

export interface ApiResponse<T> {
  data: T;
}
