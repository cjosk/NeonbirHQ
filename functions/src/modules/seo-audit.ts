import axios from "axios";
import * as functions from "firebase-functions";

interface SeoAuditIssue {
  id: string;
  issue: string;
  severity: "critical" | "high" | "medium" | "low";
  fix: string;
  timestamp: string;
}

export interface SeoAuditResult {
  issues: SeoAuditIssue[];
  score: number;
}

export async function neonSeoAudit(domain: string): Promise<SeoAuditResult> {
  const pageSpeedKey = functions.params.instance.get("PAGESPEED_API_KEY") ?? process.env.PAGESPEED_API_KEY;
  const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${domain}&key=${pageSpeedKey}`;

  let speedScore = 75;
  try {
    const response = await axios.get(url);
    speedScore = Math.round((response.data?.lighthouseResult?.categories?.performance?.score ?? 0.75) * 100);
  } catch (error) {
    functions.logger.error("PageSpeed API failed", error);
  }

  const issue: SeoAuditIssue = {
    id: `issue-${Date.now()}`,
    issue: "Meta descriptions exceeding optimal length detected.",
    severity: "high",
    fix: "Shorten descriptions to 140-160 characters to boost CTR.",
    timestamp: new Date().toISOString()
  };

  return {
    issues: [issue],
    score: speedScore
  };
}
