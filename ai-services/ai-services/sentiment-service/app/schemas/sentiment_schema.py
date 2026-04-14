# ─────────────────────────────────────────────
# sentiment-service/app/schemas/sentiment_schema.py
# Defines input (request) and output (response) format
# ─────────────────────────────────────────────

from pydantic import BaseModel


class SentimentRequest(BaseModel):
    """
    What backend sends when a user submits a comment.

    Example request from Spring Boot:
    {
        "comment_id": 55,
        "text": "This feature is amazing!"
    }
    """
    comment_id: str
    text: str


class SentimentResponse(BaseModel):
    """
    What we send back to Spring Boot backend.
    Backend stores this in the sentiments table.

    Example response:
    {
        "comment_id": 55,
        "sentiment": "POSITIVE",
        "confidence": 0.92
    }

    Matches DB schema:
    sentiments (comment_id, sentiment ENUM, confidence_score FLOAT)
    """
    comment_id: str
    sentiment: str          # "POSITIVE", "NEUTRAL", or "NEGATIVE" (overall)
    confidence: float       # confidence of the overall sentiment (0.0 to 1.0)
    positive: float         # confidence score for POSITIVE
    neutral: float          # confidence score for NEUTRAL
    negative: float         # confidence score for NEGATIVE
