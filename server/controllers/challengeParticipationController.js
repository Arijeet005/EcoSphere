import prisma from '../config/db.js';
import { autoAwardBadgesForUser } from '../services/gamificationService.js';

const includeParticipationRelations = {
  challenge: { select: { id: true, title: true, status: true, evidenceRequired: true, xpReward: true } },
  user: { select: { id: true, name: true, email: true, role: true, departmentId: true, xp: true } },
};

const toReviewStatus = (body) => {
  if (body.status) {
    return body.status.toUpperCase();
  }

  if (body.approved === false || body.approved === 'false') {
    return 'REJECTED';
  }

  return 'APPROVED';
};

export const listChallengeParticipations = async (req, res, next) => {
  try {
    const where = {
      ...(req.query.challengeId ? { challengeId: Number(req.query.challengeId) } : {}),
      ...(req.query.userId ? { userId: Number(req.query.userId) } : {}),
      ...(req.query.status ? { status: req.query.status.toUpperCase() } : {}),
    };

    if (req.user.role === 'EMPLOYEE') {
      where.userId = req.user.id;
    }

    const participations = await prisma.challengeParticipation.findMany({
      where,
      include: includeParticipationRelations,
      orderBy: { joinedAt: 'desc' },
    });

    return res.json({ success: true, data: participations });
  } catch (error) {
    return next(error);
  }
};

export const joinChallenge = async (req, res, next) => {
  try {
    const challenge = await prisma.challenge.findUnique({ where: { id: Number(req.params.challengeId) } });

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }

    if (challenge.status !== 'ACTIVE') {
      return res.status(400).json({ success: false, message: 'Only active challenges can be joined.' });
    }

    if (challenge.departmentId && challenge.departmentId !== req.user.departmentId) {
      return res.status(403).json({ success: false, message: 'This challenge belongs to another department.' });
    }

    const participation = await prisma.challengeParticipation.upsert({
      where: {
        challengeId_userId: {
          challengeId: challenge.id,
          userId: req.user.id,
        },
      },
      update: {},
      create: {
        challengeId: challenge.id,
        userId: req.user.id,
        status: 'JOINED',
      },
      include: includeParticipationRelations,
    });

    return res.status(201).json({ success: true, data: participation });
  } catch (error) {
    return next(error);
  }
};

export const submitChallengeProgress = async (req, res, next) => {
  try {
    const participation = await prisma.challengeParticipation.findUnique({
      where: { id: Number(req.params.id) },
      include: { challenge: true },
    });

    if (!participation) {
      return res.status(404).json({ success: false, message: 'Challenge participation not found.' });
    }

    if (participation.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only submit your own challenge progress.' });
    }

    const evidenceUrl = req.body.evidenceUrl?.trim() || participation.evidenceUrl || null;

    if (participation.challenge.evidenceRequired && !evidenceUrl) {
      return res.status(400).json({ success: false, message: 'evidenceUrl is required for this challenge.' });
    }

    const updatedParticipation = await prisma.challengeParticipation.update({
      where: { id: participation.id },
      data: {
        progressValue: req.body.progressValue === undefined ? participation.progressValue : Number(req.body.progressValue),
        evidenceUrl,
        submissionNote: req.body.submissionNote === undefined ? undefined : req.body.submissionNote?.trim() || null,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      include: includeParticipationRelations,
    });

    return res.json({ success: true, data: updatedParticipation });
  } catch (error) {
    return next(error);
  }
};

export const reviewChallengeParticipation = async (req, res, next) => {
  try {
    const status = toReviewStatus(req.body);

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be APPROVED or REJECTED.' });
    }

    const participation = await prisma.challengeParticipation.findUnique({
      where: { id: Number(req.params.id) },
      include: { challenge: true },
    });

    if (!participation) {
      return res.status(404).json({ success: false, message: 'Challenge participation not found.' });
    }

    if (status === 'APPROVED' && participation.challenge.evidenceRequired && !participation.evidenceUrl) {
      return res.status(400).json({ success: false, message: 'Evidence is required before approval.' });
    }

    const nextXp = status === 'APPROVED' ? Number(req.body.xpAwarded ?? participation.challenge.xpReward ?? 0) : 0;

    if (nextXp < 0) {
      return res.status(400).json({ success: false, message: 'xpAwarded cannot be negative.' });
    }

    const previousApprovedXp = participation.status === 'APPROVED' ? participation.xpAwarded : 0;
    const xpDelta = nextXp - previousApprovedXp;

    const [updatedParticipation] = await prisma.$transaction([
      prisma.challengeParticipation.update({
        where: { id: participation.id },
        data: {
          status,
          xpAwarded: nextXp,
          reviewedAt: new Date(),
          reviewedById: req.user.id,
          completedAt: status === 'APPROVED' ? new Date() : null,
        },
        include: includeParticipationRelations,
      }),
      prisma.user.update({
        where: { id: participation.userId },
        data: { xp: { increment: xpDelta } },
      }),
    ]);

    const awardedBadges = xpDelta > 0 ? await autoAwardBadgesForUser(participation.userId) : [];

    return res.json({
      success: true,
      data: {
        ...updatedParticipation,
        awardedBadges,
      },
    });
  } catch (error) {
    return next(error);
  }
};
