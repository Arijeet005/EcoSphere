"""Rule-based recommendation service.

This module stays purely deterministic. It converts low score signals into
plain-language recommendations without using any AI model.
"""

from __future__ import annotations

from typing import Iterable


LOW_SCORE_THRESHOLD: int = 40


def _extend_unique(recommendations: list[str], items: Iterable[str]) -> None:
    """Append items to a recommendation list while preserving order and uniqueness."""
    for item in items:
        if item not in recommendations:
            recommendations.append(item)


def environmental_recommendations(
    *,
    carbon_score: int | None = None,
    water_score: int | None = None,
    electricity_score: int | None = None,
    renewable_score: int | None = None,
    threshold: int = LOW_SCORE_THRESHOLD,
) -> list[str]:
    """Return environmental recommendations for low score components."""
    recommendations: list[str] = []

    if carbon_score is not None and carbon_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Install LED lighting",
                "Use renewable energy",
                "Reduce diesel use",
            ),
        )

    if water_score is not None and water_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Fix water leaks",
                "Reuse process water",
                "Install low-flow fixtures",
            ),
        )

    if electricity_score is not None and electricity_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Audit electricity usage",
                "Upgrade to efficient equipment",
                "Shift consumption away from peak hours",
            ),
        )

    if renewable_score is not None and renewable_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Increase solar or wind adoption",
                "Sign green power agreements",
                "Expand onsite renewable capacity",
            ),
        )

    return recommendations


def social_recommendations(
    *,
    csr_score: int | None = None,
    participation_score: int | None = None,
    training_score: int | None = None,
    diversity_score: int | None = None,
    threshold: int = LOW_SCORE_THRESHOLD,
) -> list[str]:
    """Return social recommendations for low score components."""
    recommendations: list[str] = []

    if csr_score is not None and csr_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Increase CSR events",
                "Run employee awareness campaigns",
                "Launch volunteer programs",
            ),
        )

    if participation_score is not None and participation_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Improve employee engagement drives",
                "Recognize community participation",
                "Simplify sign-up for social programs",
            ),
        )

    if training_score is not None and training_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Increase training completion targets",
                "Schedule regular skill workshops",
                "Track learning progress by team",
            ),
        )

    if diversity_score is not None and diversity_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Strengthen inclusive hiring pipelines",
                "Review promotion equity",
                "Expand inclusion initiatives",
            ),
        )

    return recommendations


def governance_recommendations(
    *,
    audit_score: int | None = None,
    policy_score: int | None = None,
    compliance_score: int | None = None,
    risk_score: int | None = None,
    threshold: int = LOW_SCORE_THRESHOLD,
) -> list[str]:
    """Return governance recommendations for low score components."""
    recommendations: list[str] = []

    if audit_score is not None and audit_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Close audit findings faster",
                "Run internal audits more often",
                "Track repeat observations",
            ),
        )

    if policy_score is not None and policy_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Update and document policies",
                "Improve policy rollout coverage",
                "Require policy acknowledgment training",
            ),
        )

    if compliance_score is not None and compliance_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Prioritize compliance issue closure",
                "Assign clear remediation owners",
                "Monitor recurring compliance gaps",
            ),
        )

    if risk_score is not None and risk_score <= threshold:
        _extend_unique(
            recommendations,
            (
                "Strengthen monitoring and controls",
                "Review risk mitigation actions",
                "Increase oversight for high-risk areas",
            ),
        )

    return recommendations


def generate_recommendations(
    *,
    carbon_score: int | None = None,
    water_score: int | None = None,
    electricity_score: int | None = None,
    renewable_score: int | None = None,
    csr_score: int | None = None,
    participation_score: int | None = None,
    training_score: int | None = None,
    diversity_score: int | None = None,
    audit_score: int | None = None,
    policy_score: int | None = None,
    compliance_score: int | None = None,
    risk_score: int | None = None,
    threshold: int = LOW_SCORE_THRESHOLD,
) -> list[str]:
    """Return a combined, de-duplicated recommendation list."""
    recommendations: list[str] = []

    _extend_unique(
        recommendations,
        environmental_recommendations(
            carbon_score=carbon_score,
            water_score=water_score,
            electricity_score=electricity_score,
            renewable_score=renewable_score,
            threshold=threshold,
        ),
    )
    _extend_unique(
        recommendations,
        social_recommendations(
            csr_score=csr_score,
            participation_score=participation_score,
            training_score=training_score,
            diversity_score=diversity_score,
            threshold=threshold,
        ),
    )
    _extend_unique(
        recommendations,
        governance_recommendations(
            audit_score=audit_score,
            policy_score=policy_score,
            compliance_score=compliance_score,
            risk_score=risk_score,
            threshold=threshold,
        ),
    )

    return recommendations


__all__ = [
    "LOW_SCORE_THRESHOLD",
    "environmental_recommendations",
    "social_recommendations",
    "governance_recommendations",
    "generate_recommendations",
]