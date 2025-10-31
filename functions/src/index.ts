import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const helloNeon = functions.https.onRequest((req, res) => {
  const serverTime = admin.firestore.Timestamp.now().toDate().toISOString();
  res.status(200).send({ message: "NeonCheck Functions are running", serverTime });
});
