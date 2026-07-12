import prisma from '../config/db.js';

export const logAuditEntry = async ({ action, entity, entityId, performedById, oldValue, newValue }) => {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        performedById,
        oldValue,
        newValue,
      },
    });
  } catch (error) {
    console.error('Audit log failed:', error);
  }
};
