from fastapi import FastAPI, HTTPException
from app.models import AnomalyInput, AnomalyOutput, MetricsInput, ScoreOutput
from app.scoring import calculate_esg_score
from app.anomaly import detect_anomaly

# FastAPI entrypoint for the ML microservice.
# The service is intentionally stateless: it receives inputs from the caller and returns
# computed results without touching the database.
app = FastAPI(title="EcoSphere ML Service", version="1.0.0")


@app.get("/health")
def health_check():
    """Simple health check endpoint for local development and deployment checks."""
    return {"status": "ok"}


@app.post("/score", response_model=ScoreOutput)
def score_metrics(payload: MetricsInput):
    """Return a weighted ESG score from three pillar metrics.

    This endpoint is intentionally lightweight so it can be used directly by the Express
    backend for demo purposes or future integration into reporting workflows.
    """
    try:
        score = calculate_esg_score(
            environmental=payload.environmental,
            social=payload.social,
            governance=payload.governance,
        )
        return ScoreOutput(esg_score=score)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/anomaly-check", response_model=AnomalyOutput)
def anomaly_check(payload: AnomalyInput):
    """Return a simple anomaly flag for a metric value compared to a department average."""
    try:
        is_anomaly, reason = detect_anomaly(
            value=payload.value,
            department_average=payload.departmentAverage,
            threshold=2.0,
        )
        return AnomalyOutput(isAnomaly=is_anomaly, reason=reason)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
