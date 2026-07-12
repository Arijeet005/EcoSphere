"""Unit tests for the FastAPI application entrypoint."""

from __future__ import annotations

from app.main import app


def test_root_endpoint_returns_service_identity(client) -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "EcoSphere ML Service is running",
        "status": "ok",
    }


def test_health_endpoint_returns_healthy_state(client) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "eco-sphere-ml-service",
    }


def test_calculate_esg_endpoint_returns_final_json(client, valid_esg_request) -> None:
    response = client.post("/calculate-esg", json=valid_esg_request.model_dump())

    assert response.status_code == 200
    body = response.json()
    assert body["scores"] == {
        "environment_score": 50,
        "social_score": 50,
        "governance_score": 50,
        "overall_esg": 50,
    }
    assert body["rating"] == "Critical"
    assert body["recommendations"] == []
    assert body["validation_errors"] == []


def test_calculate_esg_endpoint_accepts_empty_metric_values(client, empty_metrics_request) -> None:
    response = client.post("/calculate-esg", json=empty_metrics_request.model_dump())

    assert response.status_code == 200
    assert response.json()["scores"]["overall_esg"] == 50


def test_calculate_esg_endpoint_accepts_negative_metric_values(client, negative_metrics_request) -> None:
    response = client.post("/calculate-esg", json=negative_metrics_request.model_dump())

    assert response.status_code == 200
    assert response.json()["scores"]["environment_score"] == 50


def test_calculate_esg_endpoint_accepts_one_hundred_metric_values(client, full_value_request) -> None:
    response = client.post("/calculate-esg", json=full_value_request.model_dump())

    assert response.status_code == 200
    assert response.json()["scores"]["social_score"] == 50


def test_calculate_esg_endpoint_rejects_missing_required_fields(client) -> None:
    response = client.post("/calculate-esg", json={})

    assert response.status_code == 422
    body = response.json()
    assert body["message"] == "Request validation failed"
    assert body["detail"]


def test_calculate_esg_endpoint_rejects_empty_department_name(client) -> None:
    response = client.post(
        "/calculate-esg",
        json={
            "department": {"name": "", "code": "ESG-01"},
            "environment_metrics": {"values": {}},
            "social_metrics": {"values": {}},
            "governance_metrics": {"values": {}},
        },
    )

    assert response.status_code == 422


def test_fastapi_app_is_configured() -> None:
    assert app.title == "EcoSphere ML Service"
    assert app.version == "1.0.0"