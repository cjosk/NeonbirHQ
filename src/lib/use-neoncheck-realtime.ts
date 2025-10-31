"use client";

import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { firestore } from "./firebase";
import { NeonIssue, NeonKeyword, NeonReview, NeonScores, NeonSuggestion } from "@/types/dashboard";
import { defaultMockState } from "./mock-state";

interface NeoncheckRealtimeState {
  scores: NeonScores | null;
  keywords: NeonKeyword[];
  reviews: NeonReview[];
  suggestions: NeonSuggestion[];
  issues: NeonIssue[];
}

export function useNeoncheckRealtime(userId: string = "demo-user", websiteId: string = "demo-site") {
  const [state, setState] = useState<NeoncheckRealtimeState>(defaultMockState);

  useEffect(() => {
    const websiteRef = doc(firestore, "users", userId, "websites", websiteId);
    const keywordsRef = collection(firestore, "users", userId, "websites", websiteId, "keywords");
    const reviewsRef = collection(firestore, "users", userId, "websites", websiteId, "reviews");
    const suggestionsRef = collection(firestore, "users", userId, "websites", websiteId, "suggestions");
    const issuesRef = collection(firestore, "users", userId, "websites", websiteId, "seo_audit");

    const unsubscribers = [
      onSnapshot(websiteRef, (snapshot) => {
        const data = snapshot.data() as { scores?: NeonScores } | undefined;
        setState((prev) => ({ ...prev, scores: data?.scores ?? prev.scores }));
      }),
      onSnapshot(keywordsRef, (snapshot) => {
        const data = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<NeonKeyword, "id">),
          trend: (docSnapshot.data()?.trend ?? []).map((point: any) => ({
            dateLabel:
              point.dateLabel ??
              new Date(point.date ?? Date.now()).toLocaleDateString("tr-TR", {
                month: "short",
                day: "numeric"
              }),
            date: point.date,
            position: point.position
          }))
        }));
        setState((prev) => ({ ...prev, keywords: data.length ? data : prev.keywords }));
      }),
      onSnapshot(reviewsRef, (snapshot) => {
        const data = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<NeonReview, "id">)
        }));
        setState((prev) => ({ ...prev, reviews: data.length ? data : prev.reviews }));
      }),
      onSnapshot(suggestionsRef, (snapshot) => {
        const data = snapshot.docs.map((docSnapshot) => {
          const payload = docSnapshot.data() as Omit<NeonSuggestion, "id" | "createdAt"> & {
            createdAt?: { toDate?: () => Date } | string;
          };
          const createdAtValue =
            typeof payload.createdAt === "string"
              ? payload.createdAt
              : payload.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString();

          return {
            id: docSnapshot.id,
            ...payload,
            createdAt: createdAtValue
          } as NeonSuggestion;
        });
        setState((prev) => ({ ...prev, suggestions: data.length ? data : prev.suggestions }));
      }),
      onSnapshot(issuesRef, (snapshot) => {
        const data = snapshot.docs.map((docSnapshot) => {
          const payload = docSnapshot.data() as Omit<NeonIssue, "id" | "timestamp"> & {
            timestamp?: { toDate?: () => Date } | string;
          };

          let timestamp: string;
          if (typeof payload.timestamp === "string" || !payload.timestamp) {
            timestamp = (payload.timestamp as string) ?? new Date().toISOString();
          } else {
            timestamp = payload.timestamp.toDate?.()?.toISOString() ?? new Date().toISOString();
          }

          return {
            id: docSnapshot.id,
            ...payload,
            timestamp
          } as NeonIssue;
        });
        setState((prev) => ({ ...prev, issues: data.length ? data : prev.issues }));
      })
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [userId, websiteId]);

  return useMemo(() => state, [state]);
}
