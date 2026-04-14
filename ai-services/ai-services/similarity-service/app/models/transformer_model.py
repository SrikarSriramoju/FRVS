# ─────────────────────────────────────────────
# similarity-service/app/models/transformer_model.py
# Loads the ML model ONCE when service starts
# Reused for every request → fast performance
# ─────────────────────────────────────────────

from __future__ import annotations

from functools import lru_cache

from sentence_transformers import SentenceTransformer
from shared.config import MODEL_NAME
from shared.logging import get_logger

logger = get_logger(__name__)

@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    """Lazily loads and caches the sentence-transformer model."""
    logger.info(f"Loading ML model: {MODEL_NAME} ...")
    model = SentenceTransformer(MODEL_NAME)
    logger.info("ML model loaded successfully!")
    return model
