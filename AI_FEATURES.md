# AI features for EcoSphere

## ESG scoring engine

The default department score uses a 40/30/30 weighting across environmental, social, and governance sub-scores. This matches the business workflow described in the challenge spec because environmental performance is the primary operational signal for carbon-led sustainability initiatives, while social participation and governance compliance remain important but secondary for the MVP.

The score is computed as:

$$
\text{totalScore} = 0.4 \times \text{environmental} + 0.3 \times \text{social} + 0.3 \times \text{governance}
$$

### How sub-scores are derived

- Environmental score: normalized from carbon transactions, with a simple reduction formula based on total calculated emissions.
- Social score: derived from approved participation over total participation records.
- Governance score: derived from resolved compliance issues over total compliance issues.

These are deterministic and audit-friendly, which makes them appropriate for a compliance-adjacent workflow.

## Badge auto-award rules

Badge unlocks are evaluated with a simple rule-based engine. Each badge can carry a rule such as:

- XP threshold (for example, unlock when user.xp >= 500)
- Completed challenge count threshold (for example, unlock when user.completedChallenges >= 5)

This is intentionally rule-based rather than ML-based because the feature needs to be deterministic, explainable, and appropriate for audit-focused compliance scenarios.

## Current limitations

- Overall score uses a simple average across departments and does not yet account for employee counts or department size.
- Sub-score normalization is intentionally lightweight for MVP and can be refined once richer operational data is available.

## Persistence model

These services are pure computation helpers. They do not write to the database directly; persistence stays in backend controllers and route handlers.
