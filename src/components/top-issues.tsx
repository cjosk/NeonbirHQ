"use client";

import { NeonIssue } from "@/types/dashboard";
import { motion } from "framer-motion";
import { severityColor } from "@/lib/severity-color";

interface TopIssuesProps {
  issues: NeonIssue[];
}

export function TopIssues({ issues }: TopIssuesProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-white">Top SEO Issues</h2>
        <p className="text-sm text-slate-400">
          Prioritized findings from the daily Firebase Function audits.
        </p>
      </header>
      <div className="mt-6 space-y-4">
        {issues.map((issue, index) => (
          <motion.div
            key={issue.id}
            className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <span className={`text-xs font-semibold uppercase tracking-wide ${severityColor(issue.severity)}`}>
              {issue.severity}
            </span>
            <p className="mt-1 font-medium text-white">{issue.issue}</p>
            <p className="mt-2 text-sm text-slate-400">{issue.fix}</p>
            <p className="mt-2 text-xs text-slate-500">
              Logged {new Date(issue.timestamp).toLocaleString()}
            </p>
          </motion.div>
        ))}
        {issues.length === 0 && (
          <p className="text-sm text-slate-500">Great job! The latest crawl found no critical blockers.</p>
        )}
      </div>
    </article>
  );
}
