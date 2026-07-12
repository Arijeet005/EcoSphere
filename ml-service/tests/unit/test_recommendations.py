"""Unit tests for the rule-based recommendation engine."""

from __future__ import annotations

from app.services.recommendations import (
    environmental_recommendations,
    generate_recommendations,
    governance_recommendations,
    social_recommendations,
)


def test_environmental_recommendations_for_low_carbon_score() -> None:
    recommendations = environmental_recommendations(carbon_score=0)

    assert recommendations == [
        "Install LED lighting",
        "Use renewable energy",
        "Reduce diesel use",
    ]


def test_social_recommendations_for_low_csr_score() -> None:
    recommendations = social_recommendations(csr_score=0)

    assert recommendations == [
        "Increase CSR events",
        "Run employee awareness campaigns",
        "Launch volunteer programs",
    ]


def test_governance_recommendations_for_low_audit_score() -> None:
    recommendations = governance_recommendations(audit_score=0)

    assert recommendations == [
        "Close audit findings faster",
        "Run internal audits more often",
        "Track repeat observations",
    ]


def test_generate_recommendations_deduplicates_and_combines_low_scores() -> None:
    recommendations = generate_recommendations(
        carbon_score=0,
        csr_score=0,
        audit_score=0,
        risk_score=0,
    )

    assert "Install LED lighting" in recommendations
    assert "Increase CSR events" in recommendations
    assert "Close audit findings faster" in recommendations
    assert "Strengthen monitoring and controls" in recommendations
    assert len(recommendations) == len(set(recommendations))


def test_generate_recommendations_returns_empty_list_for_high_scores() -> None:
    recommendations = generate_recommendations(
        carbon_score=100,
        csr_score=100,
        audit_score=100,
        risk_score=100,
    )

    assert recommendations == []