"""Logging configuration helpers for the EcoSphere ML service."""

from __future__ import annotations

from logging.config import dictConfig


LOGGING_CONFIG: dict[str, object] = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s %(levelname)s %(name)s %(message)s",
        },
    },
    "handlers": {
        "default": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        },
    },
    "root": {
        "handlers": ["default"],
        "level": "INFO",
    },
}


def configure_logging() -> None:
    """Install the project logging configuration."""
    dictConfig(LOGGING_CONFIG)


__all__ = ["LOGGING_CONFIG", "configure_logging"]
