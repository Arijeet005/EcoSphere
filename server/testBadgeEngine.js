import { evaluateBadgeUnlock } from './services/badgeEngine.js';

const user = {
  xp: 600,
  completedChallenges: 3,
};

const badges = [
  { id: 1, unlockRule: { type: 'XP', threshold: 500 } },
  { id: 2, unlockRule: { type: 'CHALLENGES_COMPLETED', threshold: 5 } },
];

console.log('Unlocked badge IDs:', evaluateBadgeUnlock(user, badges));
