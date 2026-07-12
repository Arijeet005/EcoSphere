/**
 * Evaluate badge unlocks against a simple, extensible rule format.
 * The implementation is intentionally rule-based rather than ML-based because it is
 * deterministic, transparent, and appropriate for a compliance-adjacent feature where
 * auditability matters more than probabilistic inference.
 *
 * @param {{xp?: number, completedChallenges?: number, [key: string]: any}} user
 * @param {Array<{id: number, unlockRule?: {type?: string, threshold?: number}}>} badges
 * @returns {number[]}
 */
export const evaluateBadgeUnlock = (user = {}, badges = []) => {
  if (!user || typeof user !== 'object') {
    throw new Error('User must be an object.');
  }

  if (!Array.isArray(badges)) {
    throw new Error('Badges must be an array.');
  }

  const unlockedBadgeIds = [];

  badges.forEach((badge) => {
    const rule = badge?.unlockRule;
    if (!rule || typeof rule !== 'object') {
      throw new Error(`Badge ${badge?.id ?? 'unknown'} has an invalid unlockRule.`);
    }

    const ruleType = rule.type;
    const threshold = Number(rule.threshold);

    if (!['XP', 'CHALLENGES_COMPLETED'].includes(ruleType)) {
      throw new Error(`Unsupported badge rule type: ${ruleType}`);
    }

    if (!Number.isFinite(threshold)) {
      throw new Error(`Badge ${badge?.id ?? 'unknown'} has a non-numeric threshold.`);
    }

    if (ruleType === 'XP' && Number(user.xp) >= threshold) {
      unlockedBadgeIds.push(badge.id);
    }

    if (ruleType === 'CHALLENGES_COMPLETED' && Number(user.completedChallenges) >= threshold) {
      unlockedBadgeIds.push(badge.id);
    }
  });

  return unlockedBadgeIds;
};
