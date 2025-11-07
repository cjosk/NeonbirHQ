import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { nextApp } from "./next-app";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const helloNeon = functions.https.onRequest((req, res) => {
  const serverTime = admin.firestore.Timestamp.now().toDate().toISOString();
  res.status(200).send({ message: "NeonCheck Functions are running", serverTime });
});

export { nextApp };

export * from "./modules/seo-audit";
export * from "./modules/keyword-sync";
export * from "./modules/reputation-sync";
export * from "./modules/scorecard";
export * from "./modules/weekly-report";
