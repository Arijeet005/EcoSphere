"""Environmental scoring service.

This module contains business-rule orchestration only.
It does not expose API routes and does not depend on FastAPI.
"""

from app.schemas.schemas import EnvironmentalInput, EnvironmentalResult
from app.services import rules
from app.services._shared import average_score


def calculate_environmental_score(payload: EnvironmentalInput) -> EnvironmentalResult:
    """Calculate the environmental score from environmental rule components.

    The service currently invokes rule functions from ``rules.py`` and computes an
    average across environmental dimensions only.
    """
    # Payload is accepted as an explicit contract for clean architecture boundaries.
    # Rule functions currently use placeholder internals and are parameterless.
    _ = payload

    carbon = rules.carbon_score()
    water = rules.water_score()
    electricity = rules.electricity_score()
    renewable = rules.renewable_score()

    environmental_score = average_score(carbon, water, electricity, renewable)

    return EnvironmentalResult(
        carbon_score=carbon,
        water_score=water,
        electricity_score=electricity,
        renewable_score=renewable,
        environmental_score=environmental_score,
    )


__all__ = ["calculate_environmental_score"]
