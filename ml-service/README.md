# EcoSphere ML Service

This microservice provides lightweight ESG scoring and anomaly detection for the main EcoSphere platform.

## What it does

- POST /score: accepts environmental, social, and governance values and returns a weighted ESG score.
- POST /anomaly-check: accepts a value, department average, and metric type and returns whether the value looks anomalous.
- GET /health: returns a simple health status payload.

## Run locally

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the service:

```bash
uvicorn app.main:app --reload --port 8000
```

The service is intentionally stateless and does not connect to the database. All persistence remains in the main Express + PostgreSQL backend.
