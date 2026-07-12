"""Unit tests for the rule functions in app.services.rules."""

from __future__ import annotations

import pytest

from app.services import rules


@pytest.mark.parametrize(
    "function_name",
    [
        "carbon_score",
        "water_score",
        "electricity_score",
        "renewable_score",
        "csr_score",
        "participation_score",
        "training_score",
        "diversity_score",
        "audit_score",
        "policy_score",
        "compliance_issue_score",
        "risk_score",
    ],
)
def test_every_scoring_function_returns_placeholder_score(function_name: str) -> None:
    score_function = getattr(rules, function_name)
    score = score_function()

    assert isinstance(score, int)
    assert score == rules.DEFAULT_PLACEHOLDER_SCORE
    assert rules.MIN_SCORE <= score <= rules.MAX_SCORE


@pytest.mark.parametrize(
    "function_name",
    [
        "carbon_score",
        "water_score",
        "electricity_score",
        "renewable_score",
        "csr_score",
        "participation_score",
        "training_score",
        "diversity_score",
        "audit_score",
        "policy_score",
        "compliance_issue_score",
        "risk_score",
    ],
)
def test_every_scoring_function_is_stable_for_repeated_calls(function_name: str) -> None:
    score_function = getattr(rules, function_name)

    assert score_function() == score_function()