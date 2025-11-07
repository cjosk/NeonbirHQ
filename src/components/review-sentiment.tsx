"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { NeonReview } from "@/types/dashboard";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ReviewSentimentProps {
  reviews: NeonReview[];
}

export function ReviewSentiment({ reviews }: ReviewSentimentProps) {
  const totals = reviews.reduce(
    (acc, review) => {
      acc[review.sentiment] += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const totalCount = reviews.length || 1;
  const percentages = {
    positive: Math.round((totals.positive / totalCount) * 100),
    neutral: Math.round((totals.neutral / totalCount) * 100),
    negative: Math.round((totals.negative / totalCount) * 100)
  };

  const data = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [totals.positive, totals.neutral, totals.negative],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
        borderWidth: 0
      }
    ]
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-white">Reputation Pulse</h2>
        <p className="text-sm text-slate-400">
          Aggregated review sentiment from Google, Şikayetvar, Facebook, and Instagram.
        </p>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Doughnut data={data} options={{ cutout: "70%" }} />
        <ul className="space-y-3">
          {Object.entries(percentages).map(([label, value]) => (
            <li key={label} className="flex items-center justify-between text-sm text-slate-300">
              <span className="capitalize">{label}</span>
              <span className="font-semibold text-white">{value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
