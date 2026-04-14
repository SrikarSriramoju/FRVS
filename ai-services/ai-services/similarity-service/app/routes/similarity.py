# ─────────────────────────────────────────────
# similarity-service/app/routes/similarity.py
# API Layer — receives requests from Spring Boot backend
# Think of this like a @RestController in Spring Boot
# ─────────────────────────────────────────────

from fastapi import APIRouter, HTTPException
from app.schemas.similarity_schema import SimilarityRequest, SimilarityResponse
from app.services.similarity_engine import compute_similarity
from shared.logging import get_logger

logger = get_logger(__name__)

# APIRouter groups related endpoints
router = APIRouter()


@router.post("/similarity", response_model=SimilarityResponse)
def get_similarity(data: SimilarityRequest) -> SimilarityResponse:
    """
    POST /similarity

    Called by Spring Boot backend (AIService.java) when:
    - A new feature is submitted by a user

    Request from backend (example):
    {
        "new_feature": "Dark Mode",
        "existing_features": [
            {"feature_id": 10, "title": "Night theme"},
            {"feature_id": 12, "title": "Export PDF"}
        ]
    }

    Response to backend (example):
    {
        "results": [
            {"feature_id": 10, "title": "Night theme", "score": 0.91},
            {"feature_id": 12, "title": "Export PDF",  "score": 0.12}
        ]
    }

    Backend then stores results in similarity_mapping table.
    """
    try:
        logger.info(f"Received similarity request for: '{data.new_feature}'")
        result = compute_similarity(data)
        logger.info("Similarity computed successfully")
        return result

    except Exception as e:
        logger.error(f"Error computing similarity: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Similarity computation failed: {str(e)}")
