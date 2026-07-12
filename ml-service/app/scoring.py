def calculate_esg_score(environmental, social, governance):
    """Calculate a weighted ESG score from three pillar values.

    This is intentionally simple and transparent so it can be explained clearly in a
    hackathon demo. The coefficients reflect a common prioritization where environmental
    impact is weighted most heavily, followed by social and governance factors.

    We keep the logic as a pure function so it is easy to test and easy to replace later
    with a more advanced model if the project evolves.
    """

    environmental_weight = 0.4
    social_weight = 0.3
    governance_weight = 0.3

    weighted_score = (
        (environmental * environmental_weight)
        + (social * social_weight)
        + (governance * governance_weight)
    )

    return weighted_score
