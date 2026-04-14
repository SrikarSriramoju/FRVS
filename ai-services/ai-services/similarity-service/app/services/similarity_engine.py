# ─────────────────────────────────────────────
# similarity-service/app/services/similarity_engine.py
# THE BRAIN of the similarity service
# Converts text → vectors → computes similarity scores
# ─────────────────────────────────────────────

from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from app.models.transformer_model import get_model
from app.schemas.similarity_schema import SimilarityRequest, SimilarityResponse, SimilarityResult
from app.utils.text_utils import clean_text, format_score
from shared.logging import get_logger

logger = get_logger(__name__)


def compute_similarity(data: SimilarityRequest) -> SimilarityResponse:
    """
    Main function — compares new feature against all existing features.

    HOW IT WORKS (Step by step):
    ─────────────────────────────
    Step 1: Clean all text (remove extra spaces, lowercase)
    Step 2: Convert text into vectors (embeddings) using ML model
            - "Dark Mode" → [0.12, 0.45, 0.89, ...] (384 numbers)
            - "Night Theme" → [0.11, 0.44, 0.87, ...]
            Similar meanings → similar vectors
    Step 3: Calculate cosine similarity between new feature and each existing one
            - Score range: 0.0 (not similar) to 1.0 (exactly same)
    Step 4: Return all scores sorted by highest similarity first

    Example:
        Input:  new_feature = "Dark Mode"
                existing = ["Night Theme", "Export PDF", "Dark UI"]
        Output: [
            {"feature_id": 10, "title": "Dark UI",    "score": 0.91},
            {"feature_id": 45, "title": "Night Theme", "score": 0.87},
            {"feature_id": 78, "title": "Export PDF",  "score": 0.12}
        ]
    """

    # If no existing features, nothing to compare
    if not data.existing_features:
        logger.info("No existing features to compare. Returning empty result.")
        return SimilarityResponse(results=[])

    model = get_model()

    # Step 1: Clean text
    new_text = clean_text(data.new_feature)
    existing_texts = [clean_text(f.title) for f in data.existing_features]

    logger.info(f"Computing similarity for: '{new_text}' against {len(existing_texts)} features")

    # Step 2: Convert text → embeddings (vectors)
    # model.encode() converts a sentence into a list of numbers
    # that represent its MEANING
    new_embedding = model.encode([new_text])                # Shape: (1, 384)
    existing_embeddings = model.encode(existing_texts)      # Shape: (N, 384)

    # Step 3: Compute cosine similarity
    # cosine_similarity measures the angle between two vectors
    # Small angle = similar meaning → high score
    scores = cosine_similarity(new_embedding, existing_embeddings)[0]
    # scores is now an array like: [0.91, 0.12, 0.87]

    # Step 4: Build results list
    results = []
    for i, feature in enumerate(data.existing_features):
        results.append(SimilarityResult(
            feature_id=feature.feature_id,
            title=feature.title,
            score=format_score(scores[i])
        ))

    # Sort by score descending (highest similarity first)
    results.sort(key=lambda x: x.score, reverse=True)

    logger.info(f"Top match: feature_id={results[0].feature_id}, score={results[0].score}")

    return SimilarityResponse(results=results)
