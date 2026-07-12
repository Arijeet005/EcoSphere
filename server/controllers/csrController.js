import prisma from '../config/db.js';

const includeActivityRelations = {
  department: { select: { id: true, name: true } },
  _count: { select: { employeeParticipations: true } },
};

const includeParticipationRelations = {
  user: { select: { id: true, name: true, email: true, role: true, points: true } },
  csrActivity: { select: { id: true, title: true, evidenceRequired: true, pointsValue: true } },
};

const toOptionalNumber = (value) => (value === undefined || value === null || value === '' ? undefined : Number(value));
const toOptionalBoolean = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  return String(value).toLowerCase() === 'true';
};

export const getCsrActivities = async (req, res, next) => {
  try {
    const where = {};
    const departmentId = toOptionalNumber(req.query.departmentId);

    if (departmentId) {
      where.departmentId = departmentId;
    }

    const activities = await prisma.cSRActivity.findMany({
      where,
      include: includeActivityRelations,
      orderBy: { activityDate: 'desc' },
    });

    res.json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};

export const getCsrActivityById = async (req, res, next) => {
  try {
    const activity = await prisma.cSRActivity.findUnique({
      where: { id: Number(req.params.id) },
      include: includeActivityRelations,
    });

    if (!activity) {
      return res.status(404).json({ success: false, message: 'CSR activity not found.' });
    }

    return res.json({ success: true, data: activity });
  } catch (error) {
    return next(error);
  }
};

export const createCsrActivity = async (req, res, next) => {
  try {
    if (!req.body.title?.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    const activity = await prisma.cSRActivity.create({
      data: {
        title: req.body.title.trim(),
        description: req.body.description?.trim() || null,
        departmentId: toOptionalNumber(req.body.departmentId),
        activityDate: req.body.activityDate ? new Date(req.body.activityDate) : undefined,
        hoursSpent: req.body.hoursSpent === undefined ? undefined : Number(req.body.hoursSpent),
        evidenceRequired: toOptionalBoolean(req.body.evidenceRequired),
        pointsValue: req.body.pointsValue === undefined ? undefined : Number(req.body.pointsValue),
      },
      include: includeActivityRelations,
    });

    return res.status(201).json({ success: true, data: activity });
  } catch (error) {
    return next(error);
  }
};

export const updateCsrActivity = async (req, res, next) => {
  try {
    const activity = await prisma.cSRActivity.update({
      where: { id: Number(req.params.id) },
      data: {
        title: req.body.title ? req.body.title.trim() : undefined,
        description: req.body.description === undefined ? undefined : req.body.description?.trim() || null,
        departmentId: req.body.departmentId === undefined ? undefined : toOptionalNumber(req.body.departmentId) ?? null,
        activityDate: req.body.activityDate ? new Date(req.body.activityDate) : undefined,
        hoursSpent: req.body.hoursSpent === undefined ? undefined : Number(req.body.hoursSpent),
        evidenceRequired: toOptionalBoolean(req.body.evidenceRequired),
        pointsValue: req.body.pointsValue === undefined ? undefined : Number(req.body.pointsValue),
      },
      include: includeActivityRelations,
    });

    return res.json({ success: true, data: activity });
  } catch (error) {
    return next(error);
  }
};

export const deleteCsrActivity = async (req, res, next) => {
  try {
    await prisma.cSRActivity.delete({ where: { id: Number(req.params.id) } });
    return res.json({ success: true, message: 'CSR activity deleted.' });
  } catch (error) {
    return next(error);
  }
};

export const listParticipations = async (req, res, next) => {
  try {
    const employeeId = toOptionalNumber(req.query.employeeId || req.query.userId);
    const csrActivityId = toOptionalNumber(req.query.activityId || req.query.csrActivityId);
    const status = req.query.status?.toUpperCase();

    const where = {
      ...(employeeId ? { userId: employeeId } : {}),
      ...(csrActivityId ? { csrActivityId } : {}),
      ...(status ? { status } : {}),
    };

    const participations = await prisma.employeeParticipation.findMany({
      where,
      include: includeParticipationRelations,
      orderBy: { participatedAt: 'desc' },
    });

    return res.json({ success: true, data: participations });
  } catch (error) {
    return next(error);
  }
};

export const createParticipation = async (req, res, next) => {
  try {
    const csrActivityId = toOptionalNumber(req.body.csrActivityId || req.body.activityId);

    if (!csrActivityId) {
      return res.status(400).json({ success: false, message: 'csrActivityId is required.' });
    }

    const activity = await prisma.cSRActivity.findUnique({ where: { id: csrActivityId } });

    if (!activity) {
      return res.status(404).json({ success: false, message: 'CSR activity not found.' });
    }

    const proofUrl = req.body.proofUrl?.trim() || null;
    const evidenceRequiredByConfig = process.env.CSR_EVIDENCE_REQUIRED === 'true';

    if ((activity.evidenceRequired || evidenceRequiredByConfig) && !proofUrl) {
      return res.status(400).json({ success: false, message: 'proofUrl is required for this activity.' });
    }

    const participation = await prisma.employeeParticipation.create({
      data: {
        userId: req.user.id,
        csrActivityId,
        proofUrl,
        status: 'PENDING',
      },
      include: includeParticipationRelations,
    });

    return res.status(201).json({ success: true, data: participation });
  } catch (error) {
    return next(error);
  }
};

export const approveParticipation = async (req, res, next) => {
  try {
    const requestedStatus = req.body.status?.toUpperCase();
    const status = requestedStatus || (req.body.approved === false ? 'REJECTED' : 'APPROVED');

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be APPROVED or REJECTED.' });
    }

    const participationId = Number(req.params.id);

    const participation = await prisma.employeeParticipation.findUnique({
      where: { id: participationId },
      include: { csrActivity: true },
    });

    if (!participation) {
      return res.status(404).json({ success: false, message: 'Participation not found.' });
    }

    const nextPoints = status === 'APPROVED'
      ? Number(req.body.pointsEarned ?? participation.csrActivity?.pointsValue ?? 0)
      : 0;

    if (nextPoints < 0) {
      return res.status(400).json({ success: false, message: 'pointsEarned cannot be negative.' });
    }

    const previousApprovedPoints = participation.status === 'APPROVED' ? participation.pointsEarned : 0;
    const pointsDelta = nextPoints - previousApprovedPoints;

    const [updatedParticipation] = await prisma.$transaction([
      prisma.employeeParticipation.update({
        where: { id: participationId },
        data: {
          status,
          pointsEarned: nextPoints,
        },
        include: includeParticipationRelations,
      }),
      prisma.user.update({
        where: { id: participation.userId },
        data: { points: { increment: pointsDelta } },
      }),
    ]);

    return res.json({ success: true, data: updatedParticipation });
  } catch (error) {
    return next(error);
  }
};
