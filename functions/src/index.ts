import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import axios from "axios";
import { neonSeoAudit } from "./modules/seo-audit";
import { neonKeywordSync } from "./modules/keyword-sync";
import { neonReputationSync } from "./modules/reputation-sync";
import { computeScores } from "./modules/scorecard";
import { neonWeeklyReport } from "./modules/weekly-report";
export { nextApp } from "./next-app";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const scheduledDailyScan = functions.pubsub.schedule("every day 05:00")
  .timeZone("Europe/Istanbul")
  .onRun(async () => {
    const userSnapshots = await db.collection("users").get();

    await Promise.all(
      userSnapshots.docs.map(async (userDoc) => {
        const websites = await userDoc.ref.collection("websites").get();
        await Promise.all(
          websites.docs.map(async (websiteDoc) => {
            const websiteData = websiteDoc.data();
            const domain = websiteData.meta?.domain;
            if (!domain) {
              functions.logger.warn("Website missing domain", websiteDoc.id);
              return;
            }

            const [seoIssues, keywordResults, reputationResults] = await Promise.all([
              neonSeoAudit(domain),
              neonKeywordSync(domain),
              neonReputationSync(domain)
            ]);

            const scores = await computeScores({
              userId: userDoc.id,
              websiteId: websiteDoc.id,
              seoIssues,
              keywordResults,
              reputationResults
            });

            await Promise.all(
              seoIssues.issues.map((issue) =>
                websiteDoc.ref
                  .collection("seo_audit")
                  .doc(issue.id)
                  .set(
                    {
                      ...issue,
                      timestamp: admin.firestore.FieldValue.serverTimestamp()
                    },
                    { merge: true }
                  )
              )
            );

            await Promise.all(
              keywordResults.keywords.map((keyword) =>
                websiteDoc.ref
                  .collection("keywords")
                  .doc(keyword.id)
                  .set({ ...keyword }, { merge: true })
              )
            );

            await Promise.all(
              reputationResults.reviews.map((review) =>
                websiteDoc.ref
                  .collection("reviews")
                  .doc(review.id)
                  .set({ ...review }, { merge: true })
              )
            );

            await websiteDoc.ref.set(
              {
                scores,
                meta: {
                  ...(websiteData.meta ?? {}),
                  lastScan: admin.firestore.FieldValue.serverTimestamp(),
                  totalScore: scores.totalScore
                }
              },
              { merge: true }
            );

            const pythonIngestUrl = functions.params.instance.get("PYTHON_API_URL") ?? process.env.PYTHON_API_URL;
            if (pythonIngestUrl) {
              await axios.post(`${pythonIngestUrl}/ingest`, {
                userId: userDoc.id,
                websiteId: websiteDoc.id,
                seoIssues,
                keywordResults,
                reputationResults
              });
            }
          })
        );
      })
    );

    return null;
  });

export const generateAiSuggestions = functions.firestore
  .document("users/{userId}/websites/{websiteId}")
  .onWrite(async (change, context) => {
    const data = change.after.data();
    if (!data?.scores) return;

    const pythonApiUrl = functions.params.instance.get("PYTHON_API_URL") ?? process.env.PYTHON_API_URL;
    if (!pythonApiUrl) {
      functions.logger.warn("Python API URL not configured");
      return;
    }

    const response = await axios.post(`${pythonApiUrl}/seo_recommendations`, {
      userId: context.params.userId,
      websiteId: context.params.websiteId,
      scores: data.scores
    });

    const suggestions: string[] = response.data?.suggestions ?? [];

    await Promise.all(
      suggestions.map((message) =>
        db
          .collection("users")
          .doc(context.params.userId)
          .collection("websites")
          .doc(context.params.websiteId)
          .collection("suggestions")
          .add({
            message,
            type: "AI",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          })
      )
    );
  });

export const weeklyDigest = functions.pubsub.schedule("every sunday 07:00")
  .timeZone("Europe/Istanbul")
  .onRun(() => neonWeeklyReport());

export const onNewNegativeReview = functions.firestore
  .document("users/{userId}/websites/{websiteId}/reviews/{reviewId}")
  .onCreate(async (snapshot, context) => {
    const review = snapshot.data();
    if (review.sentiment !== "negative") {
      return;
    }

    const pythonApiUrl = functions.params.instance.get("PYTHON_API_URL") ?? process.env.PYTHON_API_URL;
    if (!pythonApiUrl) {
      return;
    }

    await axios.post(`${pythonApiUrl}/alert`, {
      userId: context.params.userId,
      websiteId: context.params.websiteId,
      review
    });
  });
