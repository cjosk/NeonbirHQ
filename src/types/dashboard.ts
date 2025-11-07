export interface NeonScores {
  seoScore: number;
  speedScore: number;
  reputationScore: number;
  engagementScore: number;
  totalScore: number;
}

export interface NeonKeywordTrendPoint {
  dateLabel: string;
  position: number;
  date?: string;
}

export interface NeonKeyword {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  accent: string;
  trend: NeonKeywordTrendPoint[];
}

export interface NeonReview {
  id: string;
  platform: string;
  sentiment: "positive" | "neutral" | "negative";
  author: string;
  text: string;
  date: string;
}

export interface NeonSuggestion {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

export interface NeonIssue {
  id: string;
  issue: string;
  severity: "critical" | "high" | "medium" | "low";
  fix: string;
  timestamp: string;
}
