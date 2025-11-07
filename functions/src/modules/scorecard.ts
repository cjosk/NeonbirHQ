import { SeoAuditResult } from "./seo-audit";
import { KeywordSyncResult } from "./keyword-sync";
import { ReputationSyncResult } from "./reputation-sync";

interface ComputeScoresArgs {
  userId: string;
  websiteId: string;
  seoIssues: SeoAuditResult;
  keywordResults: KeywordSyncResult;
  reputationResults: ReputationSyncResult;
}

export async function computeScores({ seoIssues, reputationResults }: ComputeScoresArgs) {
  const seoScore = seoIssues.score;
  const negativeCount = reputationResults.reviews.filter((review) => review.sentiment === "negative").length;
  const reputationScore = Math.max(40, 90 - negativeCount * 5);
  const speedScore = seoIssues.score;
  const engagementScore = 70;
  const totalScore = Math.round(
    seoScore * 0.3 +
      speedScore * 0.2 +
      reputationScore * 0.3 +
      engagementScore * 0.2
  );

  return {
    seoScore,
    speedScore,
    reputationScore,
    engagementScore,
    totalScore
  };
}
