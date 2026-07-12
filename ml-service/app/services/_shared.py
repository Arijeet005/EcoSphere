"""Shared helpers for service-layer calculations."""

from __future__ import annotations


def average_score(*scores: int) -> int:
    """Return the rounded integer average for a non-empty list of scores."""
    if not scores:
        return 0
    return int(round(sum(scores) / len(scores)))


__all__ = ["average_score"]