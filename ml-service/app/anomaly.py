def detect_anomaly(value, department_average, threshold=2.0):
    """Detect a simple anomaly using a rule-based comparison.

    The rule flags a value as anomalous when it is more than the threshold multiple of the
    department average. This keeps the logic transparent and easy to explain during a demo,
    while still giving the backend a useful signal for outlier detection.
    """

    if department_average <= 0:
        return False, "Department average is zero or negative, so no anomaly can be evaluated."

    is_anomaly = value > (threshold * department_average)

    if is_anomaly:
        reason = (
            f"Value {value} exceeds the threshold of {threshold}x the department average "
            f"({department_average})."
        )
    else:
        reason = "Value is within the expected range for this department."

    return is_anomaly, reason
