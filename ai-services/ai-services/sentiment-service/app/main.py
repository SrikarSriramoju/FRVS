# ─────────────────────────────────────────────
# sentiment-service/app/main.py
# Entry point of the Sentiment Service
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
#   cd sentiment-service
#   python -m uvicorn app.main:app ...
PROJECT_ROOT = _find_project_root()
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI

from app.routes.sentiment import router

app = FastAPI(
    title="FRVS Sentiment Service",
    description="Analyzes sentiment of user comments using Azure Text Analytics",
    version="1.0.0"
)

# Register routes
app.include_router(router)


# Health check — backend calls this to verify service is alive
@app.get("/health")
def health_check():
    return {"status": "Sentiment Service is running"}
