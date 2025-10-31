"use client";

import { useMemo } from "react";

interface NeonScoreDialProps {
  score: number;
}

export function NeonScoreDial({ score }: NeonScoreDialProps) {
  const strokeDasharray = useMemo(() => {
    const clamped = Math.max(0, Math.min(100, score));
    const progress = (clamped / 100) * 283; // circumference of circle r=45
    return `${progress} 283`;
  }, [score]);

  return (
    <svg viewBox="0 0 120 120" className="h-20 w-20">
      <defs>
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF00FF" />
          <stop offset="50%" stopColor="#7F00FF" />
          <stop offset="100%" stopColor="#00D1FF" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="45" stroke="#1f2937" strokeWidth="12" fill="transparent" />
      <circle
        cx="60"
        cy="60"
        r="45"
        stroke="url(#neonGradient)"
        strokeWidth="12"
        fill="transparent"
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="68" textAnchor="middle" className="fill-white text-xl font-semibold">
        {Math.round(score)}
      </text>
    </svg>
  );
}
