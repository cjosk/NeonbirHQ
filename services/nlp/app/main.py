from __future__ import annotations

from datetime import datetime
from typing import List

import httpx
from fastapi import FastAPI, HTTPException

app = FastAPI(title="NeonCheck AI NLP Service", version="0.1.0")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.post("/analyze_review")
async def analyze_review(payload: dict) -> dict[str, str]:
    text = payload.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    label = "neutral"
    lowered = text.lower()
    if any(token in lowered for token in ["kötü", "gecikti", "sorun"]):
        label = "negative"
    elif any(token in lowered for token in ["mükemmel", "harika", "teşekkür"]):
        label = "positive"

    return {"sentiment": label}


@app.post("/seo_recommendations")
async def seo_recommendations(payload: dict) -> dict[str, List[str]]:
    scores = payload.get("scores", {})
    total_score = scores.get("totalScore", 0)

    suggestions = [
        "Meta açıklamalarınızı 140-160 karakter aralığında tutarak TO oranını artırın.",
        "Blog içeriklerinde 'rgb neon tabela' varyasyonlarına yer verin."
    ]

    if total_score < 70:
        suggestions.append("Ana sayfa için LCP optimizasyonu yapın; görsel sıkıştırma uygulayın.")

    return {"suggestions": suggestions}


@app.post("/alert")
async def alert(payload: dict) -> dict[str, str]:
    webhook_url = payload.get("webhook")
    review = payload.get("review", {})
    if webhook_url:
        async with httpx.AsyncClient() as client:
            await client.post(webhook_url, json={"text": f"Yeni negatif yorum: {review.get('text')}"})
    return {"status": "queued"}


@app.post("/ingest")
async def ingest(payload: dict) -> dict[str, str]:
    # Placeholder endpoint for Firebase Functions to stream audit payloads.
    _ = payload
    return {"status": "received"}
