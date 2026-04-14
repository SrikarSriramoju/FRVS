# ─────────────────────────────────────────────
# sentiment-service/app/services/azure_client.py
# Connects to Azure Text Analytics API
# Sends comment text → gets sentiment result back
# ─────────────────────────────────────────────

from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

from shared.config import AZURE_ENDPOINT, AZURE_KEY
from shared.logging import get_logger

logger = get_logger(__name__)


def get_azure_client() -> TextAnalyticsClient:
    """
    Creates and returns an Azure Text Analytics client.
    Uses endpoint and key from shared/config.py
    """
    credential = AzureKeyCredential(AZURE_KEY)
    client = TextAnalyticsClient(
        endpoint=AZURE_ENDPOINT,
        credential=credential
    )
    return client


def analyze_sentiment(text: str) -> dict:
    """
    Sends text to Azure Text Analytics API and gets sentiment result.

    HOW IT WORKS:
    ─────────────
    Step 1: Send comment text to Azure
    Step 2: Azure AI reads the text and decides:
            - Is it POSITIVE? ("This feature is amazing!")
            - Is it NEGATIVE? ("This is terrible!")
            - Is it NEUTRAL?  ("The feature exists.")
    Step 3: Azure returns scores for each category
    Step 4: We pick the highest score as the final sentiment

    Example:
        Input:  "This feature is absolutely amazing!"
        Azure returns:
            positive:  0.95
            neutral:   0.03
            negative:  0.02
        Output: { "sentiment": "POSITIVE", "confidence": 0.95 }

    Azure docs: https://learn.microsoft.com/en-us/azure/ai-services/language-service/sentiment-opinion-mining/
    """
    try:
        client = get_azure_client()

        # Send text to Azure — must be a list
        logger.info(f"Sending text to Azure for sentiment analysis...")
        response = client.analyze_sentiment(documents=[text])

        # Get first result (we only sent one document)
        result = response[0]

        if result.is_error:
            logger.error(f"Azure returned error: {result.error}")
            # Fallback to NEUTRAL if Azure fails
            return {
                "sentiment": "NEUTRAL",
                "confidence": 0.0,
                "positive": 0.0,
                "neutral": 1.0,
                "negative": 0.0,
            }

        # Azure returns sentiment as "positive", "neutral", "negative"
        # We convert to uppercase to match our DB ENUM
        sentiment = result.sentiment.upper()

        scores = result.confidence_scores
        positive = round(scores.positive, 4)
        neutral = round(scores.neutral, 4)
        negative = round(scores.negative, 4)

        # Confidence of the chosen label
        if sentiment == "POSITIVE":
            confidence = positive
        elif sentiment == "NEGATIVE":
            confidence = negative
        else:
            confidence = neutral

        logger.info(
            f"Azure result: sentiment={sentiment}, confidence={confidence}, "
            f"scores=(pos={positive}, neu={neutral}, neg={negative})"
        )
        return {
            "sentiment": sentiment,
            "confidence": confidence,
            "positive": positive,
            "neutral": neutral,
            "negative": negative,
        }

    except Exception as e:
        logger.error(f"Azure API error: {str(e)}")
        # Return NEUTRAL as safe fallback if Azure call fails
        return {
            "sentiment": "NEUTRAL",
            "confidence": 0.0,
            "positive": 0.0,
            "neutral": 1.0,
            "negative": 0.0,
        }
