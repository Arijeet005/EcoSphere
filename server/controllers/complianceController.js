import prisma from '../config/db.js';
import { logAuditEntry } from '../middleware/auditLogger.js';

const includeIssueRelations = {
  department: { select: { id: true, name: true } },
  owner: { select: { id: true, name: true, email: true, role: true } },
};

const toOptionalNumber = (value) => (value === undefined || value === null || value === '' ? undefined : Number(value));

const withOverdueFlag = (issue) => ({
  ...issue,
  isOverdue: issue.status === 'OPEN' && new Date(issue.dueDate) < new Date(),
});

const normalizeIssueData = (body, { isCreate = false } = {}) => {
  const data = {
    title: body.title ? body.title.trim() : undefined,
    description: body.description === undefined ? undefined : body.description?.trim() || null,
    departmentId: body.departmentId === undefined ? undefined : Number(body.departmentId),
    ownerId: body.ownerId === undefined ? undefined : Number(body.ownerId),
    severity: body.severity?.toUpperCase(),
    status: body.status?.toUpperCase(),
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
  };

  if (data.status === 'CLOSED') {
    data.isResolved = true;
    data.resolvedAt = body.resolvedAt ? new Date(body.resolvedAt) : new Date();
  } else if (data.status === 'OPEN') {
    data.isResolved = false;
    data.resolvedAt = null;
  }

  if (!isCreate) {
    return data;
  }

  return {
    ...data,
    status: data.status || 'OPEN',
  };
};

export const getComplianceIssues = async (req, res, next) => {
  try {
    const ownerId = toOptionalNumber(req.query.ownerId);
    const departmentId = toOptionalNumber(req.query.departmentId);
    const status = req.query.status?.toUpperCase();

    const issues = await prisma.complianceIssue.findMany({
      where: {
        ...(ownerId ? { ownerId } : {}),
        ...(departmentId ? { departmentId } : {}),
        ...(status ? { status } : {}),
      },
      include: includeIssueRelations,
      orderBy: { dueDate: 'asc' },
    });

    return res.json({ success: true, data: issues.map(withOverdueFlag) });
  } catch (error) {
    return next(error);
  }
};

export const getComplianceIssueById = async (req, res, next) => {
  try {
    const issue = await prisma.complianceIssue.findUnique({
      where: { id: Number(req.params.id) },
      include: includeIssueRelations,
    });

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Compliance issue not found.' });
    }

    return res.json({ success: true, data: withOverdueFlag(issue) });
  } catch (error) {
    return next(error);
  }
};

export const createComplianceIssue = async (req, res, next) => {
  try {
    if (!req.body.title?.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    if (!req.body.departmentId) {
      return res.status(400).json({ success: false, message: 'departmentId is required.' });
    }

    if (!req.body.ownerId || !req.body.dueDate) {
      return res.status(400).json({ success: false, message: 'ownerId and dueDate are required.' });
    }

    const issue = await prisma.complianceIssue.create({
      data: normalizeIssueData(req.body, { isCreate: true }),
      include: includeIssueRelations,
    });

    await logAuditEntry({
      action: 'CREATE',
      entity: 'ComplianceIssue',
      entityId: issue.id,
      performedById: req.user.id,
      oldValue: null,
      newValue: issue,
    });

    return res.status(201).json({ success: true, data: withOverdueFlag(issue) });
  } catch (error) {
    return next(error);
  }
};

export const updateComplianceIssue = async (req, res, next) => {
  try {
    const existingIssue = await prisma.complianceIssue.findUnique({ where: { id: Number(req.params.id) } });

    if (!existingIssue) {
      return res.status(404).json({ success: false, message: 'Compliance issue not found.' });
    }

    const issue = await prisma.complianceIssue.update({
      where: { id: Number(req.params.id) },
      data: normalizeIssueData(req.body),
      include: includeIssueRelations,
    });

    await logAuditEntry({
      action: 'UPDATE',
      entity: 'ComplianceIssue',
      entityId: issue.id,
      performedById: req.user.id,
      oldValue: existingIssue,
      newValue: issue,
    });

    return res.json({ success: true, data: withOverdueFlag(issue) });
  } catch (error) {
    return next(error);
  }
};

export const deleteComplianceIssue = async (req, res, next) => {
  try {
    const existingIssue = await prisma.complianceIssue.findUnique({ where: { id: Number(req.params.id) } });

    if (!existingIssue) {
      return res.status(404).json({ success: false, message: 'Compliance issue not found.' });
    }

    await prisma.complianceIssue.delete({ where: { id: Number(req.params.id) } });

    await logAuditEntry({
      action: 'DELETE',
      entity: 'ComplianceIssue',
      entityId: existingIssue.id,
      performedById: req.user.id,
      oldValue: existingIssue,
      newValue: null,
    });

    return res.json({ success: true, message: 'Compliance issue deleted.' });
  } catch (error) {
    return next(error);
  }
};

export const getOverdueComplianceIssues = async (req, res, next) => {
  try {
    const issues = await prisma.complianceIssue.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: 'OPEN',
      },
      include: includeIssueRelations,
      orderBy: { dueDate: 'asc' },
    });

    return res.json({ success: true, data: issues.map(withOverdueFlag) });
  } catch (error) {
    return next(error);
  }
};
