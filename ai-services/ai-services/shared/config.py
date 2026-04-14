"""Common configuration values used across both AI microservices.

Configuration is sourced from environment variables. If `python-dotenv` is
installed, a `.env` file located next to `docker-compose.yml` (the parent folder
of this `shared/` directory) is loaded automatically.
"""

from __future__ import annotations

import os
from pathlib import Path

try:
	from dotenv import load_dotenv  # type: ignore
except Exception:  # pragma: no cover
	load_dotenv = None


_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
if load_dotenv is not None and _ENV_PATH.exists():
	load_dotenv(dotenv_path=_ENV_PATH)


def _get_float(name: str, default: float) -> float:
	raw = os.getenv(name)
	if raw is None or raw.strip() == "":
		return default
	try:
		return float(raw)
	except ValueError:
		return default


def _get_int(name: str, default: int) -> int:
	raw = os.getenv(name)
	if raw is None or raw.strip() == "":
		return default
	try:
		return int(raw)
	except ValueError:
		return default

# ML Model name used by similarity service
# all-MiniLM-L6-v2 is a lightweight but accurate sentence transformer
MODEL_NAME = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")

# Similarity threshold — if score is above this, feature is considered duplicate
SIMILARITY_THRESHOLD = _get_float("SIMILARITY_THRESHOLD", 0.75)

# Azure AI Language (Text Analytics) settings (used by sentiment service)
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT", "").strip()
AZURE_KEY = os.getenv("AZURE_KEY", "").strip()

# Service ports
SIMILARITY_SERVICE_PORT = _get_int("SIMILARITY_SERVICE_PORT", 8000)
SENTIMENT_SERVICE_PORT = _get_int("SENTIMENT_SERVICE_PORT", 8001)
