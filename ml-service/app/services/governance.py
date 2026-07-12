"""Governance scoring service.

This module contains business-rule orchestration only.
It does not expose API routes and does not depend on FastAPI.
"""

from app.schemas.schemas import GovernanceInput, GovernanceResult
from app.services import rules
from app.services._shared import average_score


def calculate_governance_score(payload: GovernanceInput) -> GovernanceResult:
    """Calculate governance score from governance rule components only."""
    # Payload is accepted as an explicit service boundary contract.
    # Rule internals are intentionally placeholder implementations for now.
    _ = payload

    audit = rules.audit_score()
    policy = rules.policy_score()
    compliance = rules.compliance_issue_score()
    risk = rules.risk_score()

    governance_score = average_score(audit, policy, compliance, risk)

    return GovernanceResult(
        audit_score=audit,
        policy_score=policy,
        compliance_score=compliance,
        risk_score=risk,
        governance_score=governance_score,
    )


__all__ = ["calculate_governance_score"]
