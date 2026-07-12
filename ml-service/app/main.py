"""FastAPI application entrypoint for the EcoSphere ML service."""

from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager
from logging.config import dictConfig

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from app.schemas.schemas import ESGRequest, ESGResponse, ScoreBreakdown, ValidationErrorItem
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


LOGGING_CONFIG: dict[str, object] = {
	"version": 1,
	"disable_existing_loggers": False,
	"formatters": {
		"default": {
			"format": "%(asctime)s %(levelname)s %(name)s %(message)s",
		},
	},
	"handlers": {
		"default": {
			"class": "logging.StreamHandler",
			"formatter": "default",
		},
	},
	"root": {
		"handlers": ["default"],
		"level": "INFO",
	},
}


dictConfig(LOGGING_CONFIG)
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
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
	logger.warning("validation_error path=%s errors=%s", request.url.path, exc.errors())
	return JSONResponse(
		status_code=422,
		content={
			"detail": exc.errors(),
			"message": "Request validation failed",
		},
	)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
	logger.warning(
		"http_exception path=%s status_code=%s detail=%s",
		request.url.path,
		exc.status_code,
		exc.detail,
	)
	return JSONResponse(
		status_code=exc.status_code,
		content={"detail": exc.detail},
	)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
	logger.exception("unhandled_error path=%s", request.url.path)
	return JSONResponse(
		status_code=500,
		content={"detail": "Internal server error"},
	)


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
		environmental_result = calculate_environmental_score(
			environment_payload := payload.model_copy(update={})
		)
		social_result = calculate_social_score(
			social_payload := payload.model_copy(update={})
		)
		governance_result = calculate_governance_score(
			governance_payload := payload.model_copy(update={})
		)
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
	except HTTPException:
		raise
	except Exception as exc:
		logger.exception("esg_calculation_failed department=%s", payload.department.name)
		raise HTTPException(status_code=500, detail="ESG calculation failed") from exc

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
