# NeonCheck AI Platform

NeonCheck AI is a SaaS platform tailored for **Neonbirr.com** that unifies SEO health auditing, keyword intelligence, and reputation monitoring into a single realtime dashboard backed by Firebase.

## Repository Structure

```
.
├── src/                # Next.js 14 App Router frontend with Tailwind + Framer Motion
├── public/             # Static assets served by Next.js / Firebase Hosting
├── functions/          # Firebase Functions (Node.js 20) for crawlers, schedulers, and messaging
├── services/
│   └── nlp/            # FastAPI microservice for sentiment + AI recommendations
├── firestore.rules     # Firestore security rules scoped per-user
├── firebase.json       # Firebase Hosting + Functions configuration
└── .firebaserc         # Default Firebase project alias
```

### Frontend (Next.js)
- **Realtime dashboard** showing SEO, speed, reputation, and engagement scores.
- Hooks for **Firestore listeners** using Firebase Web SDK.
- Components built with **TailwindCSS**, **Framer Motion**, and **Chart.js** visualizations.
- Mock data bootstrapping to aid local development before live Firestore data exists.

### Backend Functions (functions)
- Scheduled **daily scans** to orchestrate PageSpeed, SERP, and review scrapers.
- **AI suggestion trigger** whenever scores update, posting to the Python service.
- **Weekly SendGrid digest** emails.
- **Negative review alerts** that forward events to downstream channels.

### NLP Service (services/nlp)
- **FastAPI** endpoints for review sentiment, SEO recommendations, and alert fan-out.
- Designed for deployment on **Google Cloud Run** with Poetry-based dependency management.

## Local Development
1. Install dependencies once: `npm install` (root) and `npm --prefix functions install`.
2. Use the [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite) to run Functions + Firestore locally.
3. Set environment variables using `.env` files (see `.env.example`).
4. Launch the FastAPI service with `uvicorn app.main:app --reload --port 8000`.
5. Start the Next.js app with `npm run dev`.

## Deployment Overview
- **Firebase Hosting** serves the Next.js build with SSR proxied through the `nextApp` function.
- **Firebase Scheduler** triggers the cron-based audits and weekly reports.
- **Google Cloud Run** hosts the Python NLP container.

## Build & Deploy Workflow
1. Build the Next.js app and sync the assets into the Firebase Functions bundle with `npm run build` (runs `next build`, copies `.next` + `public` into `functions/`).
2. Compile TypeScript Cloud Functions with `npm run build:functions`.
3. Deploy everything with `firebase deploy`. The `firebase.json` predeploy hook runs the two build steps automatically so Hosting always points rewrites at the latest Next.js output and Functions ship compiled JavaScript.

This repository delivers a production-ready foundation to expand each module with deeper integrations such as full SERP analytics, robust scraping pipelines, and advanced AI insights.
