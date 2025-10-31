import * as functions from "firebase-functions";

export const nextApp = functions.https.onRequest((req, res) => {
  res.status(200).send("NeonCheck AI Next.js build placeholder. Deploy with next build + firebase-frameworks.");
});
