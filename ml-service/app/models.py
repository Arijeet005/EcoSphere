from pydantic import BaseModel, Field


class MetricsInput(BaseModel):
    """Input payload for ESG scoring.

    The service receives three numeric metrics that represent the three ESG pillars.
    These values are intentionally simple and stateless so they can be used in a demo
    or later replaced with a more advanced model without changing the API shape.
    """

    environmental: float = Field(..., description="Environmental score / metric")
    social: float = Field(..., description="Social score / metric")
    governance: float = Field(..., description="Governance score / metric")


class ScoreOutput(BaseModel):
    """Output payload with the final weighted ESG score."""

    esg_score: float = Field(..., description="Weighted ESG score")


class AnomalyInput(BaseModel):
    """Input payload for anomaly detection.

    The rule compares a current metric value against the department average.
    """

    value: float = Field(..., description="Current metric value")
    departmentAverage: float = Field(..., description="Average value for the department")
    metricType: str = Field(..., description="Name of the metric being checked")


class AnomalyOutput(BaseModel):
    """Output payload describing whether an anomaly was detected."""

    isAnomaly: bool = Field(..., description="Whether the value exceeds the threshold")
    reason: str = Field(..., description="Human-readable explanation")
