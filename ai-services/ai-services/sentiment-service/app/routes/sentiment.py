# ─────────────────────────────────────────────
# sentiment-service/app/routes/sentiment.py
# API Layer — receives requests from Spring Boot backend
# ─────────────────────────────────────────────

from fastapi import APIRouter, HTTPException
from app.schemas.sentiment_schema import SentimentRequest, SentimentResponse
from app.services.azure_client import analyze_sentiment
from app.utils.text_utils import clean_text
from shared.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()


@router.post("/sentiment", response_model=SentimentResponse)
def get_sentiment(data: SentimentRequest) -> SentimentResponse:
    """
    POST /sentiment

    Called by Spring Boot backend (AIService.java) when:
    - A user submits a comment on a feature

    Request from backend (example):
    {
        "comment_id": 55,
        "text": "This feature is amazing!"
    }

    Response to backend (example):
    {
        "comment_id": 55,
        "sentiment": "POSITIVE",
        "confidence": 0.92
    }

    Flow:
    Spring Boot → POST /sentiment → azure_client.py → Azure API → response
    Backend stores result in sentiments table:
        sentiments (comment_id, sentiment, confidence_score)
    """
    try:
        logger.info(f"Received sentiment request for comment_id: {data.comment_id}")

        # Clean the text before sending to Azure
        cleaned_text = clean_text(data.text)

        if not cleaned_text:
            logger.warning("Empty text received. Returning NEUTRAL.")
            return SentimentResponse(
                comment_id=data.comment_id,
                sentiment="NEUTRAL",
                confidence=0.0,
                positive=0.0,
                neutral=1.0,
                negative=0.0,
            )

        # Call Azure Text Analytics API
        result = analyze_sentiment(cleaned_text)

        logger.info(f"Sentiment result: {result['sentiment']} ({result['confidence']})")

        return SentimentResponse(
            comment_id=data.comment_id,
            sentiment=result["sentiment"],
            confidence=result["confidence"],
            positive=result.get("positive", 0.0),
            neutral=result.get("neutral", 0.0),
            negative=result.get("negative", 0.0),
        )

    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Sentiment analysis failed: {str(e)}")
