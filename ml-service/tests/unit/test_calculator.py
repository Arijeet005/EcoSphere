"""Unit tests for the ESG calculator service."""

from __future__ import annotations

import pytest

from app.schemas.schemas import DepartmentInput, ESGRequest, MetricGroup
from app.services.calculator import (
    CalculatorResult,
    DEFAULT_RATING_LEVELS,
    WeightConfig,
    _clamp_score,
    _normalize_weights,
    _resolve_rating,
    calculate_esg_scores,
)


def build_request(
    *,
    environment_values: dict[str, float] | None = None,
    social_values: dict[str, float] | None = None,
    governance_values: dict[str, float] | None = None,
    department_name: str = "Sustainability",
) -> ESGRequest:
    return ESGRequest(
        department=DepartmentInput(name=department_name, code="D-001"),
        environment_metrics=MetricGroup(values=environment_values or {}),
        social_metrics=MetricGroup(values=social_values or {}),
        governance_metrics=MetricGroup(values=governance_values or {}),
    )


def test_calculate_esg_scores_with_valid_input_returns_expected_result() -> None:
    result = calculate_esg_scores(
        build_request(
            environment_values={"carbon": 12.0, "water": 20.0},
            social_values={"csr": 8.0},
            governance_values={"audit": 5.0},
        )
    )

    assert isinstance(result, CalculatorResult)
    assert result.environment_score == 50
    assert result.social_score == 50
    assert result.governance_score == 50
    assert result.overall_esg == 50
    assert result.rating == "Critical"


def test_calculate_esg_scores_accepts_empty_metric_groups() -> None:
    result = calculate_esg_scores(build_request())

    assert result.overall_esg == 50
    assert result.rating == "Critical"


def test_calculate_esg_scores_accepts_negative_metric_values() -> None:
    result = calculate_esg_scores(
        build_request(
            environment_values={"carbon": -90.5},
            social_values={"csr": -12.0},
            governance_values={"risk": -3.0},
            department_name="Negative Case",
        )
    )

    assert result.environment_score == 50
    assert result.social_score == 50
    assert result.governance_score == 50


def test_calculate_esg_scores_accepts_one_hundred_values() -> None:
    result = calculate_esg_scores(
        build_request(
            environment_values={"carbon": 100.0, "water": 100.0},
            social_values={"csr": 100.0},
            governance_values={"audit": 100.0},
            department_name="Perfect Case",
        )
    )

    assert result.overall_esg == 50
    assert result.rating == "Critical"


def test_calculate_esg_scores_normalizes_zero_weight_mapping() -> None:
    result = calculate_esg_scores(
        build_request(),
        weights={"environment": 0.0, "social": 0.0, "governance": 0.0},
    )

    assert result.overall_esg == 50
    assert result.rating == "Critical"


def test_weight_normalization_preserves_proportions() -> None:
    normalized = _normalize_weights(WeightConfig(environment=2.0, social=1.0, governance=1.0))

    assert normalized.environment == pytest.approx(0.5)
    assert normalized.social == pytest.approx(0.25)
    assert normalized.governance == pytest.approx(0.25)


def test_clamp_score_handles_edge_values() -> None:
    assert _clamp_score(-10) == 0
    assert _clamp_score(0) == 0
    assert _clamp_score(100) == 100
    assert _clamp_score(140) == 100


def test_resolve_rating_handles_custom_levels_and_missing_band() -> None:
    assert _resolve_rating(95, DEFAULT_RATING_LEVELS) == "Platinum"
    assert _resolve_rating(50, ()) == "Unrated"