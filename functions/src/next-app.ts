import { join } from "node:path";
import next from "next";
import * as functions from "firebase-functions";

const server = next({
  dev: false,
  conf: {
    distDir: join(__dirname, "..", ".next"),
  },
});

const handle = server.getRequestHandler();
const serverReady = server.prepare();

export const nextApp = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    try {
      await serverReady;
      await handle(req, res);
    } catch (error) {
      console.error("Next.js SSR error", error);
      res.status(500).send("Internal Server Error");
    }
  });
