import prisma from '../config/db.js';

const getRuleValue = (rule, keys) => {
  if (!rule || typeof rule !== 'object') {
    return undefined;
  }

  return keys.map((key) => rule[key]).find((value) => value !== undefined);
};

const evaluateUnlockRule = ({ rule, xp, completedChallengeCount }) => {
  const minXp = Number(getRuleValue(rule, ['minXp', 'xp', 'xpAtLeast']) ?? 0);
  const minCompletedChallenges = Number(
    getRuleValue(rule, ['minCompletedChallenges', 'completedChallenges', 'challengeCount']) ?? 0,
  );

  return xp >= minXp && completedChallengeCount >= minCompletedChallenges;
};

export const autoAwardBadgesForUser = async (userId) => {
  const [user, completedChallengeCount, badges] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, xp: true } }),
    prisma.challengeParticipation.count({
      where: {
        userId,
        status: { in: ['APPROVED', 'COMPLETED'] },
      },
    }),
    prisma.badge.findMany(),
  ]);

  if (!user) {
    return [];
  }

  const awardedBadges = [];

  for (const badge of badges) {
    if (!evaluateUnlockRule({ rule: badge.unlockRule, xp: user.xp, completedChallengeCount })) {
      continue;
    }

    const alreadyAwarded = await prisma.employeeParticipation.findFirst({
      where: {
        userId,
        badgeId: badge.id,
      },
    });

    if (alreadyAwarded) {
      continue;
    }

    const award = await prisma.employeeParticipation.create({
      data: {
        userId,
        badgeId: badge.id,
        status: 'APPROVED',
      },
      include: {
        badgeAwarded: true,
      },
    });

    awardedBadges.push(award.badgeAwarded);
  }

  return awardedBadges;
};
