# EcoSphere ML Service

Standalone FastAPI microservice scaffold for the EcoSphere ESG Management Platform.

This repository currently contains **architecture scaffolding only**:

- No scoring logic
- No anomaly logic
- No business rules

It is structured for modular growth, clean separation of concerns, and future ML model integration.

## Tech Baseline

- Python 3.12
- FastAPI
- Pydantic / Pydantic Settings
- Structured logging support
- Unit test structure with pytest

## Quick Start

1. Create and activate a Python 3.12 virtual environment.
2. Install dependencies:

	```bash
	pip install -r requirements.txt
	```

3. Run the service (once the app entrypoint is implemented):

	```bash
	uvicorn app.main:app --reload --port 8000
	```

## Folder Structure

```text
ml-service/
├─ .env.example
├─ README.md
├─ requirements.txt
├─ app/
│  ├─ __init__.py
│  ├─ main.py
│  ├─ api/
│  │  ├─ __init__.py
│  │  └─ v1/
│  │     ├─ __init__.py
│  │     ├─ router.py
│  │     └─ endpoints/
│  │        ├─ __init__.py
│  │        ├─ health.py
│  │        ├─ scoring.py
│  │        └─ anomaly.py
│  ├─ core/
│  │  ├─ __init__.py
│  │  ├─ config.py
│  │  ├─ logging.py
│  │  └─ exceptions.py
│  ├─ dependencies/
│  │  └─ __init__.py
│  ├─ ml/
│  │  ├─ __init__.py
│  │  ├─ artifacts/
│  │  │  └─ .gitkeep
│  │  ├─ features/
│  │  │  ├─ __init__.py
│  │  │  └─ preprocess.py
│  │  ├─ models/
│  │  │  ├─ __init__.py
│  │  │  ├─ loader.py
│  │  │  └─ registry.py
│  │  └─ pipelines/
│  │     ├─ __init__.py
│  │     ├─ anomaly_pipeline.py
│  │     └─ scoring_pipeline.py
│  ├─ repositories/
│  │  └─ __init__.py
│  ├─ schemas/
│  │  ├─ __init__.py
│  │  ├─ common.py
│  │  ├─ health.py
│  │  ├─ scoring.py
│  │  └─ anomaly.py
│  ├─ services/
│  │  ├─ __init__.py
│  │  ├─ scoring_service.py
│  │  └─ anomaly_service.py
│  └─ utils/
│     ├─ __init__.py
│     ├─ constants.py
│     └─ types.py
└─ tests/
	├─ __init__.py
	├─ conftest.py
	└─ unit/
		├─ __init__.py
		├─ test_health.py
		├─ test_scoring_service.py
		└─ test_anomaly_service.py
```

## Purpose of Every File

- `.env.example`: template for environment variables used by the ML service.
- `README.md`: service documentation, setup instructions, and architecture notes.
- `requirements.txt`: pinned Python dependencies for runtime and unit testing.

- `app/__init__.py`: marks `app` as a Python package.
- `app/main.py`: FastAPI application entrypoint (app initialization and startup wiring).

- `app/api/__init__.py`: package marker for API layer.
- `app/api/v1/__init__.py`: package marker for versioned API (`v1`).
- `app/api/v1/router.py`: central API router aggregator for `v1` endpoints.

- `app/api/v1/endpoints/__init__.py`: package marker for endpoint modules.
- `app/api/v1/endpoints/health.py`: health/readiness endpoint declarations.
- `app/api/v1/endpoints/scoring.py`: scoring endpoint declarations (no logic yet).
- `app/api/v1/endpoints/anomaly.py`: anomaly endpoint declarations (no logic yet).

- `app/core/__init__.py`: package marker for core infrastructure.
- `app/core/config.py`: centralized settings/configuration loading.
- `app/core/logging.py`: logging configuration setup (formatters/handlers/levels).
- `app/core/exceptions.py`: shared custom exception classes and handlers.

- `app/dependencies/__init__.py`: dependency-injection helpers container.

- `app/ml/__init__.py`: package marker for ML domain.
- `app/ml/artifacts/.gitkeep`: preserves empty model-artifacts directory in git.

- `app/ml/features/__init__.py`: package marker for feature engineering modules.
- `app/ml/features/preprocess.py`: placeholder for preprocessing/feature transforms.

- `app/ml/models/__init__.py`: package marker for model registry/loader modules.
- `app/ml/models/loader.py`: placeholder for model loading logic.
- `app/ml/models/registry.py`: placeholder for model registration/version mapping.

- `app/ml/pipelines/__init__.py`: package marker for ML pipeline modules.
- `app/ml/pipelines/anomaly_pipeline.py`: placeholder anomaly inference pipeline.
- `app/ml/pipelines/scoring_pipeline.py`: placeholder scoring inference pipeline.

- `app/repositories/__init__.py`: placeholder package for data access abstractions (if needed later).

- `app/schemas/__init__.py`: package marker for request/response schemas.
- `app/schemas/common.py`: shared schema components and base models.
- `app/schemas/health.py`: health endpoint request/response schemas.
- `app/schemas/scoring.py`: scoring endpoint request/response schemas.
- `app/schemas/anomaly.py`: anomaly endpoint request/response schemas.

- `app/services/__init__.py`: package marker for service-layer modules.
- `app/services/scoring_service.py`: orchestrates scoring use-cases (placeholder).
- `app/services/anomaly_service.py`: orchestrates anomaly use-cases (placeholder).

- `app/utils/__init__.py`: package marker for utility helpers.
- `app/utils/constants.py`: shared constants placeholder.
- `app/utils/types.py`: shared custom typing aliases/protocols placeholder.

- `tests/__init__.py`: marks tests as a package.
- `tests/conftest.py`: shared pytest fixtures and test configuration.
- `tests/unit/__init__.py`: unit test package marker.
- `tests/unit/test_health.py`: unit tests for health endpoint behavior.
- `tests/unit/test_scoring_service.py`: unit tests for scoring service layer.
- `tests/unit/test_anomaly_service.py`: unit tests for anomaly service layer.

## Current Status

- Folder structure created
- Files scaffolded
- Business/scoring logic intentionally not implemented yet
