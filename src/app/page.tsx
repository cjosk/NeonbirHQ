"use client";

import { motion } from "framer-motion";
import { ScoreCards } from "@/components/score-cards";
import { KeywordTrends } from "@/components/keyword-trends";
import { ReviewSentiment } from "@/components/review-sentiment";
import { SuggestionsList } from "@/components/suggestions-list";
import { TopIssues } from "@/components/top-issues";
import { useNeoncheckRealtime } from "@/lib/use-neoncheck-realtime";

export default function Page() {
  const { scores, keywords, reviews, suggestions, issues } = useNeoncheckRealtime();

  return (
    <motion.main
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <header className="flex flex-col gap-4">
        <motion.h1 className="text-3xl font-semibold tracking-tight">
          NeonCheck AI Intelligence Dashboard
        </motion.h1>
        <p className="text-slate-400">
          Monitor SEO health, keyword momentum, and brand reputation with realtime insights synced from
          Firebase.
        </p>
      </header>

      <ScoreCards scores={scores} />

      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <KeywordTrends keywords={keywords} />
        <ReviewSentiment reviews={reviews} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <TopIssues issues={issues} />
        <SuggestionsList suggestions={suggestions} />
      </section>
    </motion.main>
  );
}
