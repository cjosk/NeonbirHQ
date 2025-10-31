"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { NeonKeyword } from "@/types/dashboard";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface KeywordTrendsProps {
  keywords: NeonKeyword[];
}

export function KeywordTrends({ keywords }: KeywordTrendsProps) {
  const labels =
    keywords[0]?.trend.map((point) => point.dateLabel ?? new Date(point.date ?? Date.now()).toLocaleDateString()) ?? [];
  const datasets = keywords.map((keyword) => ({
    label: keyword.keyword,
    data: keyword.trend.map((point) => point.position),
    borderColor: keyword.accent,
    tension: 0.35,
    fill: false
  }));

  const data = { labels, datasets };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#CBD5F5"
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `#${context.parsed.y} position`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#94A3B8" },
        grid: { color: "rgba(148, 163, 184, 0.1)" }
      },
      y: {
        reverse: true,
        ticks: { color: "#94A3B8" },
        grid: { color: "rgba(148, 163, 184, 0.1)" }
      }
    }
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-white">Keyword Momentum</h2>
        <p className="text-sm text-slate-400">
          SERP rankings tracked daily via Search Console with AI recommendations.
        </p>
      </header>
      <div className="mt-6">
        <Line data={data} options={options} />
      </div>
    </article>
  );
}
