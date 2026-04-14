# ─────────────────────────────────────────────
# similarity-service/app/utils/text_utils.py
# Helper functions for cleaning and preparing text
# before feeding it to the ML model
# ─────────────────────────────────────────────

def clean_text(text: str) -> str:
    """
    Cleans and normalizes input text before encoding.
    
    Steps:
    1. Strip leading/trailing whitespace
    2. Convert to lowercase
    3. Remove extra spaces
    
    Example:
        Input:  "  Add DARK Mode  "
        Output: "add dark mode"
    """
    if not text:
        return ""
    text = text.strip()
    text = text.lower()
    text = " ".join(text.split())  # Remove extra spaces
    return text


def format_score(score: float) -> float:
    """
    Rounds similarity score to 4 decimal places.
    
    Example:
        Input:  0.912345678
        Output: 0.9123
    """
    return round(float(score), 4)
