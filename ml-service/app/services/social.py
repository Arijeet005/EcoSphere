"""Social scoring service.

This module contains business-rule orchestration only.
It does not expose API routes and does not depend on FastAPI.
"""

from app.schemas.schemas import SocialInput, SocialResult
from app.services import rules


def _average_score(*scores: int) -> int:
    """Return the rounded integer average for a non-empty list of scores."""
    if not scores:
        return 0
    return int(round(sum(scores) / len(scores)))


def calculate_social_score(payload: SocialInput) -> SocialResult:
    """Calculate social score from social rule components only."""
    # Payload is accepted as an explicit service boundary contract.
    # Rule internals are intentionally placeholder implementations for now.
    _ = payload

    csr = rules.csr_score()
    participation = rules.participation_score()
    training = rules.training_score()
    diversity = rules.diversity_score()

    social_score = _average_score(csr, participation, training, diversity)

    return SocialResult(
        csr_score=csr,
        participation_score=participation,
        training_score=training,
        diversity_score=diversity,
        social_score=social_score,
    )


__all__ = ["calculate_social_score"]
