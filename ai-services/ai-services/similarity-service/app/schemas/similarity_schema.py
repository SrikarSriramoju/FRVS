# ─────────────────────────────────────────────
# similarity-service/app/schemas/similarity_schema.py
# Defines the shape of input (request) and output (response)
# This ensures backend sends correct data format
# ─────────────────────────────────────────────

from pydantic import BaseModel
from typing import List


class FeatureItem(BaseModel):
    """
    Represents one existing feature from the database.
    Backend sends feature_id + title so we can return
    which specific feature is similar.
    """
    feature_id: str
    title: str


class SimilarityRequest(BaseModel):
    """
    What backend sends to us when a new feature is submitted.

    Example request from Spring Boot:
    {
        "new_feature": "Dark Mode",
        "existing_features": [
            {"feature_id": 10, "title": "Night theme"},
            {"feature_id": 12, "title": "Export PDF"}
        ]
    }
    """
    new_feature: str
    existing_features: List[FeatureItem]


class SimilarityResult(BaseModel):
    """
    One result item — which feature is similar and by how much.
    """
    feature_id: str
    title: str
    score: float


class SimilarityResponse(BaseModel):
    """
    Full response we send back to Spring Boot backend.

    Example response:
    {
        "results": [
            {"feature_id": 10, "title": "Night theme", "score": 0.91},
            {"feature_id": 12, "title": "Export PDF", "score": 0.12}
        ]
    }
    """
    results: List[SimilarityResult]
