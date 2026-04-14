# ─────────────────────────────────────────────
# similarity-service/app/main.py
# Entry point of the Similarity Service
# Think of this like FrvsApplication.java in Spring Boot
# ─────────────────────────────────────────────

from __future__ import annotations

import sys
from pathlib import Path


def _find_project_root() -> Path:
    """Find the nearest parent directory that contains `shared/`."""
    start = Path(__file__).resolve().parent
    for candidate in (start, *start.parents):
        if (candidate / "shared").is_dir():
            return candidate
    return start


# Allow importing the sibling `shared/` package when running locally via:
#   cd similarity-service
#   python -m uvicorn app.main:app ...
PROJECT_ROOT = _find_project_root()
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI

from app.routes.similarity import router
from app.models.transformer_model import get_model
from shared.logging import get_logger

logger = get_logger(__name__)

# Create FastAPI app instance
app = FastAPI(
    title="FRVS Similarity Service",
    description="Detects similar feature requests using ML (Sentence Transformers)",
    version="1.0.0"
)


@app.on_event("startup")
def _warm_up_model() -> None:
    # Load the model during startup so the first request isn't delayed.
    get_model()
    logger.info("Similarity model warmed up")

# Register routes — connects /similarity endpoint to our router
app.include_router(router)


# Health check endpoint
# Backend can call GET /health to check if this service is running
@app.get("/health")
def health_check():
    return {"status": "Similarity Service is running"}
