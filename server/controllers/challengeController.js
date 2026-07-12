import prisma from '../config/db.js';

const includeChallengeRelations = {
  department: { select: { id: true, name: true } },
  category: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true, email: true } },
  _count: { select: { challengeParticipations: true } },
};

const allowedTransitions = {
  DRAFT: ['ACTIVE', 'ARCHIVED'],
  ACTIVE: ['UNDER_REVIEW', 'ARCHIVED'],
  UNDER_REVIEW: ['COMPLETED', 'ARCHIVED'],
  COMPLETED: ['ARCHIVED'],
  CLOSED: ['ARCHIVED'],
  ARCHIVED: [],
};

const toOptionalNumber = (value) => (value === undefined || value === null || value === '' ? undefined : Number(value));
const toOptionalBoolean = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  return String(value).toLowerCase() === 'true';
};

const normalizeChallengeData = (body, userId) => ({
  title: body.title ? body.title.trim() : undefined,
  description: body.description === undefined ? undefined : body.description?.trim() || null,
  departmentId: body.departmentId === undefined ? undefined : toOptionalNumber(body.departmentId) ?? null,
  categoryId: body.categoryId === undefined ? undefined : toOptionalNumber(body.categoryId) ?? null,
  startDate: body.startDate ? new Date(body.startDate) : undefined,
  endDate: body.endDate ? new Date(body.endDate) : undefined,
  status: body.status,
  evidenceRequired: toOptionalBoolean(body.evidenceRequired),
  xpReward: body.xpReward === undefined ? undefined : Number(body.xpReward),
  createdById: userId,
});

export const getChallenges = async (req, res, next) => {
  try {
    const where = {
      ...(req.query.departmentId ? { departmentId: Number(req.query.departmentId) } : {}),
      ...(req.query.status ? { status: req.query.status.toUpperCase() } : {}),
    };

    const challenges = await prisma.challenge.findMany({
      where,
      include: includeChallengeRelations,
      orderBy: { startDate: 'desc' },
    });

    return res.json({ success: true, data: challenges });
  } catch (error) {
    return next(error);
  }
};

export const getChallengeById = async (req, res, next) => {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id: Number(req.params.id) },
      include: includeChallengeRelations,
    });

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }

    return res.json({ success: true, data: challenge });
  } catch (error) {
    return next(error);
  }
};

export const createChallenge = async (req, res, next) => {
  try {
    const challenge = await prisma.challenge.create({
      data: normalizeChallengeData(req.body, req.user.id),
      include: includeChallengeRelations,
    });

    return res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    return next(error);
  }
};

export const updateChallenge = async (req, res, next) => {
  try {
    const data = normalizeChallengeData(req.body, undefined);
    delete data.createdById;
    delete data.status;

    const challenge = await prisma.challenge.update({
      where: { id: Number(req.params.id) },
      data,
      include: includeChallengeRelations,
    });

    return res.json({ success: true, data: challenge });
  } catch (error) {
    return next(error);
  }
};

export const updateChallengeStatus = async (req, res, next) => {
  try {
    const challenge = await prisma.challenge.findUnique({ where: { id: Number(req.params.id) } });

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }

    const nextStatus = req.body.status.toUpperCase();
    const currentStatus = challenge.status;
    const validNextStatuses = allowedTransitions[currentStatus] ?? [];

    if (nextStatus !== currentStatus && !validNextStatuses.includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition challenge from ${currentStatus} to ${nextStatus}.`,
      });
    }

    const updatedChallenge = await prisma.challenge.update({
      where: { id: challenge.id },
      data: { status: nextStatus },
      include: includeChallengeRelations,
    });

    return res.json({ success: true, data: updatedChallenge });
  } catch (error) {
    return next(error);
  }
};

export const deleteChallenge = async (req, res, next) => {
  try {
    await prisma.challenge.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true, message: 'Challenge deleted.' });
  } catch (error) {
    return next(error);
  }
};
