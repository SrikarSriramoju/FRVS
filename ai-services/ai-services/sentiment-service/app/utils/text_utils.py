# ─────────────────────────────────────────────
# sentiment-service/app/utils/text_utils.py
# Helper functions for cleaning comment text
# before sending to Azure
# ─────────────────────────────────────────────

def clean_text(text: str) -> str:
    """
    Cleans comment text before sending to Azure API.

    Steps:
    1. Strip whitespace
    2. Remove extra spaces

    We do NOT lowercase here because Azure needs
    original casing for better accuracy.

    Example:
        Input:  "  This feature is AMAZING!!!  "
        Output: "This feature is AMAZING!!!"
    """
    if not text:
        return ""
    text = text.strip()
    text = " ".join(text.split())
    return text
