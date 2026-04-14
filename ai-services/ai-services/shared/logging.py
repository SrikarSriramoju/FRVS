# ─────────────────────────────────────────────
# shared/logging.py
# Common logging setup used by both services
# ─────────────────────────────────────────────

import logging

def get_logger(name: str) -> logging.Logger:
    """
    Returns a configured logger for the given module name.
    Usage: logger = get_logger(__name__)
    """
    logger = logging.getLogger(name)

    if not logger.handlers:
        logger.setLevel(logging.INFO)

        # Console handler — prints logs to terminal
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)

        # Format: [INFO] similarity_engine - Computing similarity...
        formatter = logging.Formatter(
            "[%(levelname)s] %(name)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger
