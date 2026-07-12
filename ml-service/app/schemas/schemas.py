from typing import Dict, Optional

from pydantic import BaseModel, ConfigDict, Field


class DepartmentInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(..., min_length=1, description="Department name")
    code: Optional[str] = Field(default=None, description="Optional department code")


class MetricGroup(BaseModel):
    model_config = ConfigDict(extra="forbid")

    values: Dict[str, float] = Field(
        default_factory=dict,
        description="Metric name to numeric value mapping",
    )


class ESGRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    department: DepartmentInput
    environment_metrics: MetricGroup
    social_metrics: MetricGroup
    governance_metrics: MetricGroup


class EnvironmentalInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    department: DepartmentInput
    environment_metrics: MetricGroup


class SocialInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    department: DepartmentInput
    social_metrics: MetricGroup


class GovernanceInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    department: DepartmentInput
    governance_metrics: MetricGroup


class ValidationErrorItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    field: str = Field(..., description="Field path that failed validation")
    message: str = Field(..., description="Validation error message")
    code: Optional[str] = Field(default=None, description="Optional error code")


class ScoreBreakdown(BaseModel):
    model_config = ConfigDict(extra="forbid")

    environment_score: int
    social_score: int
    governance_score: int
    overall_esg: int


class ESGResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    scores: ScoreBreakdown
    rating: str
    recommendations: list[str] = Field(default_factory=list)
    validation_errors: list[ValidationErrorItem] = Field(default_factory=list)


class EnvironmentalResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    carbon_score: int
    water_score: int
    electricity_score: int
    renewable_score: int
    environmental_score: int


class SocialResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    csr_score: int
    participation_score: int
    training_score: int
    diversity_score: int
    social_score: int


class GovernanceResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    audit_score: int
    policy_score: int
    compliance_score: int
    risk_score: int
    governance_score: int


__all__ = [
    "DepartmentInput",
    "MetricGroup",
    "ESGRequest",
    "EnvironmentalInput",
    "SocialInput",
    "GovernanceInput",
    "ValidationErrorItem",
    "ScoreBreakdown",
    "ESGResponse",
    "EnvironmentalResult",
    "SocialResult",
    "GovernanceResult",
]
