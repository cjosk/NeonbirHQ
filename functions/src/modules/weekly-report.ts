import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import axios from "axios";

export async function neonWeeklyReport() {
  const db = admin.firestore();
  const users = await db.collection("users").get();
  const sendGridKey = functions.params.instance.get("SENDGRID_API_KEY") ?? process.env.SENDGRID_API_KEY;

  await Promise.all(
    users.docs.map(async (userDoc) => {
      const profile = userDoc.data().profile;
      if (!profile?.email || !sendGridKey) {
        return;
      }

      const websites = await userDoc.ref.collection("websites").get();
      const snapshots = await Promise.all(
        websites.docs.map(async (websiteDoc) => {
          const scoresSnap = await websiteDoc.ref.collection("meta").doc("scores").get();
          return { id: websiteDoc.id, scores: scoresSnap.data() };
        })
      );

      const html = `
        <h1>NeonCheck AI Haftalık Raporu</h1>
        ${snapshots
          .map(
            (snapshot) => `
              <section>
                <h2>${snapshot.id}</h2>
                <p>Neonbir Skoru: ${snapshot.scores?.totalScore ?? "-"}</p>
                <p>SEO: ${snapshot.scores?.seoScore ?? "-"}</p>
                <p>Reputation: ${snapshot.scores?.reputationScore ?? "-"}</p>
              </section>
            `
          )
          .join("")}
      `;

      await axios.post(
        "https://api.sendgrid.com/v3/mail/send",
        {
          personalizations: [
            {
              to: [{ email: profile.email }]
            }
          ],
          from: { email: "reports@neonbirr.com", name: "NeonCheck AI" },
          subject: "Haftalık NeonCheck Özeti",
          content: [{ type: "text/html", value: html }]
        },
        {
          headers: {
            Authorization: `Bearer ${sendGridKey}`
          }
        }
      );
    })
  );
}
