"""Exception handler registration for the EcoSphere ML service."""

from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def register_exception_handlers(app: FastAPI, logger: logging.Logger) -> None:
	"""Register service-wide FastAPI exception handlers."""

	@app.exception_handler(RequestValidationError)
	async def validation_exception_handler(
		request: Request,
		exc: RequestValidationError,
	) -> JSONResponse:
		logger.warning("validation_error path=%s errors=%s", request.url.path, exc.errors())
		return JSONResponse(
			status_code=422,
			content={
				"detail": exc.errors(),
				"message": "Request validation failed",
			},
		)

	@app.exception_handler(HTTPException)
	async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
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
	async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
		logger.exception("unhandled_error path=%s", request.url.path)
		return JSONResponse(
			status_code=500,
			content={"detail": "Internal server error"},
		)


__all__ = ["register_exception_handlers"]
