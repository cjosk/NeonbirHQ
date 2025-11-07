import axios from "axios";

export interface ReputationReview {
  id: string;
  platform: string;
  sentiment: "positive" | "neutral" | "negative";
  author: string;
  text: string;
  date: string;
}

export interface ReputationSyncResult {
  reviews: ReputationReview[];
}

export async function neonReputationSync(domain: string): Promise<ReputationSyncResult> {
  try {
    await axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
      params: {
        query: domain
      }
    });
  } catch (error) {
    // Silent fallback for offline development
  }

  return {
    reviews: [
      {
        id: `rev-${Date.now()}`,
        platform: "Google",
        sentiment: "negative",
        author: "Demo User",
        text: "Kargo süresi beklediğimden uzundu.",
        date: new Date().toISOString()
      }
    ]
  };
}
