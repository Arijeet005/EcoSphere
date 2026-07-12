"""Shared pytest fixtures for the EcoSphere ML service tests."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


ML_SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(ML_SERVICE_ROOT) not in sys.path:
	sys.path.insert(0, str(ML_SERVICE_ROOT))


from app.main import app  # noqa: E402
from app.schemas.schemas import DepartmentInput, ESGRequest, MetricGroup  # noqa: E402


@pytest.fixture()
def client() -> TestClient:
	return TestClient(app)


@pytest.fixture()
def valid_esg_request() -> ESGRequest:
	return ESGRequest(
		department=DepartmentInput(name="Sustainability", code="ESG-01"),
		environment_metrics=MetricGroup(values={"carbon": 12.5, "water": 7.0, "energy": 80.0}),
		social_metrics=MetricGroup(values={"csr": 10.0, "training": 25.0}),
		governance_metrics=MetricGroup(values={"audit": 3.0, "risk": 8.0}),
	)


@pytest.fixture()
def empty_metrics_request() -> ESGRequest:
	return ESGRequest(
		department=DepartmentInput(name="Operations", code=None),
		environment_metrics=MetricGroup(values={}),
		social_metrics=MetricGroup(values={}),
		governance_metrics=MetricGroup(values={}),
	)


@pytest.fixture()
def negative_metrics_request() -> ESGRequest:
	return ESGRequest(
		department=DepartmentInput(name="Facilities", code="NEG-1"),
		environment_metrics=MetricGroup(values={"carbon": -12.0, "water": -3.5}),
		social_metrics=MetricGroup(values={"csr": -1.0}),
		governance_metrics=MetricGroup(values={"audit": -8.0}),
	)


@pytest.fixture()
def full_value_request() -> ESGRequest:
	return ESGRequest(
		department=DepartmentInput(name="All Values", code="MAX-1"),
		environment_metrics=MetricGroup(values={"carbon": 100.0, "water": 100.0}),
		social_metrics=MetricGroup(values={"csr": 100.0, "training": 100.0}),
		governance_metrics=MetricGroup(values={"audit": 100.0, "risk": 100.0}),
	)
