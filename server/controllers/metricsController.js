import prisma from '../config/db.js';
import { logAuditEntry } from '../middleware/auditLogger.js';

export const getMetrics = async (req, res, next) => {
  try {
    const metrics = await prisma.esgMetric.findMany({
      include: { department: true, submittedBy: { select: { id: true, name: true, role: true } } },
      orderBy: { date: 'desc' },
    });
    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
};

export const createMetric = async (req, res, next) => {
  try {
    const metric = await prisma.esgMetric.create({
      data: {
        ...req.body,
        value: Number(req.body.value),
        departmentId: Number(req.body.departmentId),
        submittedById: req.user.id,
      },
    });

    await logAuditEntry({
      action: 'CREATE',
      entity: 'EsgMetric',
      entityId: metric.id,
      performedById: req.user.id,
      oldValue: null,
      newValue: metric,
    });

    res.status(201).json({ success: true, data: metric });
  } catch (error) {
    next(error);
  }
};

export const updateMetric = async (req, res, next) => {
  try {
    const existingMetric = await prisma.esgMetric.findUnique({ where: { id: Number(req.params.id) } });
    const metric = await prisma.esgMetric.update({
      where: { id: Number(req.params.id) },
      data: {
        ...req.body,
        value: req.body.value ? Number(req.body.value) : undefined,
      },
    });

    await logAuditEntry({
      action: 'UPDATE',
      entity: 'EsgMetric',
      entityId: metric.id,
      performedById: req.user.id,
      oldValue: existingMetric,
      newValue: metric,
    });

    res.json({ success: true, data: metric });
  } catch (error) {
    next(error);
  }
};

export const deleteMetric = async (req, res, next) => {
  try {
    await prisma.esgMetric.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: 'Metric deleted' });
  } catch (error) {
    next(error);
  }
};
