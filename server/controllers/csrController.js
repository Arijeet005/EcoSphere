import prisma from '../config/db.js';

export const getCsrActivities = async (req, res, next) => {
  try {
    const activities = await prisma.csrActivity.findMany({
      include: { participant: { select: { id: true, name: true, role: true } } },
      orderBy: { date: 'desc' },
    });
    res.json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};

export const createCsrActivity = async (req, res, next) => {
  try {
    const activity = await prisma.csrActivity.create({
      data: {
        ...req.body,
        participantId: Number(req.body.participantId),
        hoursSpent: Number(req.body.hoursSpent),
      },
    });
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

export const updateCsrActivity = async (req, res, next) => {
  try {
    const activity = await prisma.csrActivity.update({
      where: { id: Number(req.params.id) },
      data: {
        ...req.body,
        participantId: req.body.participantId ? Number(req.body.participantId) : undefined,
        hoursSpent: req.body.hoursSpent ? Number(req.body.hoursSpent) : undefined,
      },
    });
    res.json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

export const deleteCsrActivity = async (req, res, next) => {
  try {
    await prisma.csrActivity.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: 'CSR activity deleted' });
  } catch (error) {
    next(error);
  }
};
