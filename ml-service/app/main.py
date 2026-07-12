"""FastAPI application entrypoint for the EcoSphere ML service."""

from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.schemas.schemas import (
	ESGRequest,
	ESGResponse,
	EnvironmentalInput,
	EnvironmentalResult,
	GovernanceInput,
	GovernanceResult,
	ScoreBreakdown,
	SocialInput,
	SocialResult,
)
from app.services.calculator import calculate_esg_scores
from app.services.environmental import calculate_environmental_score
from app.services.governance import calculate_governance_score
from app.services.recommendations import generate_recommendations
from app.services.social import calculate_social_score


class RootResponse(BaseModel):
	message: str = Field(..., description="Service welcome message")
	status: str = Field(..., description="Service status")


class HealthResponse(BaseModel):
	status: str = Field(..., description="Health state")
	service: str = Field(..., description="Service name")


configure_logging()
logger = logging.getLogger("ecosphere.ml_service")


@asynccontextmanager
async def lifespan(app: FastAPI):
	logger.info("Starting EcoSphere ML service")
	yield
	logger.info("Stopping EcoSphere ML service")


app = FastAPI(
	title="EcoSphere ML Service",
	version="1.0.0",
	description="Rule-based ESG scoring and recommendation service.",
	lifespan=lifespan,
)

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=False,
	allow_methods=["*"],
	allow_headers=["*"],
)

register_exception_handlers(app, logger)


@app.middleware("http")
async def log_requests(request: Request, call_next):
	start_time = time.perf_counter()
	logger.info("request_started method=%s path=%s", request.method, request.url.path)
	try:
		response = await call_next(request)
	except Exception:
		logger.exception("request_failed method=%s path=%s", request.method, request.url.path)
		raise

	duration_ms = (time.perf_counter() - start_time) * 1000
	logger.info(
		"request_completed method=%s path=%s status_code=%s duration_ms=%.2f",
		request.method,
		request.url.path,
		response.status_code,
		duration_ms,
	)
	return response


def _build_domain_results(
	payload: ESGRequest,
) -> tuple[EnvironmentalResult, SocialResult, GovernanceResult]:
	"""Return the domain service outputs used by the ESG endpoint."""
	environmental_result = calculate_environmental_score(
		EnvironmentalInput(
			department=payload.department,
			environment_metrics=payload.environment_metrics,
		)
	)
	social_result = calculate_social_score(
		SocialInput(
			department=payload.department,
			social_metrics=payload.social_metrics,
		)
	)
	governance_result = calculate_governance_score(
		GovernanceInput(
			department=payload.department,
			governance_metrics=payload.governance_metrics,
		)
	)
	return environmental_result, social_result, governance_result


@app.get("/", response_model=RootResponse)
async def root() -> RootResponse:
	"""Return a lightweight service identity payload."""
	return RootResponse(message="EcoSphere ML Service is running", status="ok")


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
	"""Return service health without touching external systems."""
	return HealthResponse(status="healthy", service="eco-sphere-ml-service")


@app.post("/calculate-esg", response_model=ESGResponse)
async def calculate_esg(payload: ESGRequest) -> ESGResponse:
	"""Calculate ESG scores and return rule-based recommendations."""
	try:
		environmental_result, social_result, governance_result = _build_domain_results(payload)
		calculator_result = calculate_esg_scores(payload)
		recommendations = generate_recommendations(
			carbon_score=environmental_result.carbon_score,
			water_score=environmental_result.water_score,
			electricity_score=environmental_result.electricity_score,
			renewable_score=environmental_result.renewable_score,
			csr_score=social_result.csr_score,
			participation_score=social_result.participation_score,
			training_score=social_result.training_score,
			diversity_score=social_result.diversity_score,
			audit_score=governance_result.audit_score,
			policy_score=governance_result.policy_score,
			compliance_score=governance_result.compliance_score,
			risk_score=governance_result.risk_score,
		)
	except Exception:
		logger.exception("esg_calculation_failed department=%s", payload.department.name)
		raise

	return ESGResponse(
		scores=ScoreBreakdown(
			environment_score=calculator_result.environment_score,
			social_score=calculator_result.social_score,
			governance_score=calculator_result.governance_score,
			overall_esg=calculator_result.overall_esg,
		),
		rating=calculator_result.rating,
		recommendations=recommendations,
		validation_errors=[],
	)


__all__ = ["app"]
