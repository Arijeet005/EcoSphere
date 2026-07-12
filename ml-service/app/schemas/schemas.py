from typing import Dict, List, Optional

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


class ValidationErrorItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    field: str = Field(..., description="Field path that failed validation")
    message: str = Field(..., description="Validation error message")
    code: Optional[str] = Field(default=None, description="Optional error code")


class ScoreBreakdown(BaseModel):
    model_config = ConfigDict(extra="forbid")

    environment_score: float
    social_score: float
    governance_score: float
    overall_esg: float


class ESGResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    scores: ScoreBreakdown
    rating: str
    recommendations: List[str] = Field(default_factory=list)
    validation_errors: List[ValidationErrorItem] = Field(default_factory=list)


__all__ = [
    "DepartmentInput",
    "MetricGroup",
    "ESGRequest",
    "ValidationErrorItem",
    "ScoreBreakdown",
    "ESGResponse",
]
