"use client";

import { motion } from "framer-motion";
import { NeonScores } from "@/types/dashboard";
import { NeonScoreDial } from "./score-dial";

interface ScoreCardsProps {
  scores: NeonScores | null;
}

const cards: Array<{ key: keyof NeonScores; label: string; description: string }> = [
  { key: "seoScore", label: "SEO Score", description: "Technical health across on-page audits" },
  { key: "speedScore", label: "Speed Score", description: "PageSpeed Insights weighted" },
  { key: "reputationScore", label: "Reputation", description: "Sentiment across review platforms" },
  { key: "engagementScore", label: "Engagement", description: "Social and audience signals" },
  { key: "totalScore", label: "Neonbir Score", description: "Weighted digital health" }
];

export function ScoreCards({ scores }: ScoreCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ key, label, description }, index) => {
        const value = scores?.[key] ?? 0;
        return (
          <motion.article
            key={key}
            className="gradient-border rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
                <p className="text-3xl font-bold text-white">{Math.round(value)}</p>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
              </div>
              <NeonScoreDial score={value} />
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
