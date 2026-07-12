import prisma from '../config/db.js';
import { logAuditEntry } from '../middleware/auditLogger.js';

export const getComplianceItems = async (req, res, next) => {
  try {
    const items = await prisma.complianceItem.findMany({
      include: { department: true },
      orderBy: { dueDate: 'asc' },
    });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const createComplianceItem = async (req, res, next) => {
  try {
    const item = await prisma.complianceItem.create({
      data: {
        ...req.body,
        dueDate: new Date(req.body.dueDate),
        departmentId: Number(req.body.departmentId),
      },
    });

    await logAuditEntry({
      action: 'CREATE',
      entity: 'ComplianceItem',
      entityId: item.id,
      performedById: req.user.id,
      oldValue: null,
      newValue: item,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateComplianceItem = async (req, res, next) => {
  try {
    const existingItem = await prisma.complianceItem.findUnique({ where: { id: Number(req.params.id) } });
    const item = await prisma.complianceItem.update({
      where: { id: Number(req.params.id) },
      data: {
        ...req.body,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
      },
    });

    await logAuditEntry({
      action: 'UPDATE',
      entity: 'ComplianceItem',
      entityId: item.id,
      performedById: req.user.id,
      oldValue: existingItem,
      newValue: item,
    });

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteComplianceItem = async (req, res, next) => {
  try {
    await prisma.complianceItem.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: 'Compliance item deleted' });
  } catch (error) {
    next(error);
  }
};
