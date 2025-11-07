# NeonCheck NLP Microservice

FastAPI microservice that powers the NeonCheck AI recommendation engine.

## Endpoints
- `GET /health` — readiness probe for Cloud Run.
- `POST /analyze_review` — returns a sentiment label for supplied review text.
- `POST /seo_recommendations` — generates actionable suggestions using scores payload.
- `POST /alert` — forwards negative review alerts to downstream webhooks (Telegram/WhatsApp bots).

## Local Development
```bash
poetry install
poetry run uvicorn app.main:app --reload --port 8000
```

Set the following environment variables for production deployments:
- `OPENAI_API_KEY`
- `TELEGRAM_WEBHOOK_URL`

The service is designed for containerization:
```bash
docker build -t neoncheck-nlp .
```
