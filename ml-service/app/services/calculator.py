"""ESG calculator orchestration service.

This module is pure Python and contains no API/FastAPI code.
It combines environmental, social, and governance service outputs into a
single weighted ESG result.
"""

from dataclasses import dataclass
from typing import Mapping, Sequence

from app.schemas.schemas import ESGRequest, EnvironmentalInput, GovernanceInput, SocialInput
from app.services.environmental import calculate_environmental_score
from app.services.governance import calculate_governance_score
from app.services.social import calculate_social_score


@dataclass(frozen=True)
class WeightConfig:
    environment: float = 0.40
    social: float = 0.30
    governance: float = 0.30


@dataclass(frozen=True)
class RatingLevel:
    label: str
    min_score: int
    max_score: int


@dataclass(frozen=True)
class CalculatorResult:
    environment_score: int
    social_score: int
    governance_score: int
    overall_esg: int
    rating: str


DEFAULT_WEIGHTS = WeightConfig()

DEFAULT_RATING_LEVELS: tuple[RatingLevel, ...] = (
    RatingLevel(label="Platinum", min_score=90, max_score=100),
    RatingLevel(label="Gold", min_score=80, max_score=89),
    RatingLevel(label="Silver", min_score=70, max_score=79),
    RatingLevel(label="Bronze", min_score=60, max_score=69),
    RatingLevel(label="Critical", min_score=0, max_score=59),
)


def _clamp_score(value: int) -> int:
    """Return score constrained to the inclusive 0..100 range."""
    if value < 0:
        return 0
    if value > 100:
        return 100
    return int(value)


def _normalize_weights(weights: WeightConfig) -> WeightConfig:
    """Normalize a weight config so final proportions sum to 1.0."""
    total = weights.environment + weights.social + weights.governance
    if total <= 0:
        return DEFAULT_WEIGHTS
    return WeightConfig(
        environment=weights.environment / total,
        social=weights.social / total,
        governance=weights.governance / total,
    )


def _resolve_rating(score: int, rating_levels: Sequence[RatingLevel]) -> str:
    """Resolve the rating label for a score from configured rating bands."""
    bounded_score = _clamp_score(score)
    for level in rating_levels:
        if level.min_score <= bounded_score <= level.max_score:
            return level.label
    return "Unrated"


def _weight_config_from_mapping(weight_overrides: Mapping[str, float]) -> WeightConfig:
    """Build a typed WeightConfig from optional mapping overrides."""
    return WeightConfig(
        environment=weight_overrides.get("environment", DEFAULT_WEIGHTS.environment),
        social=weight_overrides.get("social", DEFAULT_WEIGHTS.social),
        governance=weight_overrides.get("governance", DEFAULT_WEIGHTS.governance),
    )


def calculate_esg_scores(
    payload: ESGRequest,
    weights: WeightConfig | Mapping[str, float] | None = None,
    rating_levels: Sequence[RatingLevel] | None = None,
) -> CalculatorResult:
    """Calculate weighted ESG result using configurable weights and ratings.

    Default weights:
    - Environment: 40%
    - Social: 30%
    - Governance: 30%
    """
    env_result = calculate_environmental_score(
        EnvironmentalInput(
            department=payload.department,
            environment_metrics=payload.environment_metrics,
        )
    )
    social_result = calculate_social_score(
        SocialInput(
            department=payload.department,
            social_metrics=payload.social_metrics,
        )
    )
    gov_result = calculate_governance_score(
        GovernanceInput(
            department=payload.department,
            governance_metrics=payload.governance_metrics,
        )
    )

    if weights is None:
        resolved_weights = DEFAULT_WEIGHTS
    elif isinstance(weights, WeightConfig):
        resolved_weights = weights
    else:
        resolved_weights = _weight_config_from_mapping(weights)

    normalized_weights = _normalize_weights(resolved_weights)

    overall_esg = _clamp_score(
        int(
            round(
                (env_result.environmental_score * normalized_weights.environment)
                + (social_result.social_score * normalized_weights.social)
                + (gov_result.governance_score * normalized_weights.governance)
            )
        )
    )

    resolved_rating_levels = tuple(rating_levels) if rating_levels is not None else DEFAULT_RATING_LEVELS
    rating = _resolve_rating(overall_esg, resolved_rating_levels)

    return CalculatorResult(
        environment_score=env_result.environmental_score,
        social_score=social_result.social_score,
        governance_score=gov_result.governance_score,
        overall_esg=overall_esg,
        rating=rating,
    )


__all__ = [
    "WeightConfig",
    "RatingLevel",
    "CalculatorResult",
    "DEFAULT_WEIGHTS",
    "DEFAULT_RATING_LEVELS",
    "calculate_esg_scores",
]
