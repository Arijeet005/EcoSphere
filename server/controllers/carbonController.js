import prisma from '../config/db.js';
import { calculateManualEmission, parseDateRange } from '../services/carbonService.js';

export const createCarbonTransaction = async (req, res, next) => {
    try {
        const departmentId = Number(req.body.departmentId);

        if (req.user.role === 'EMPLOYEE' && req.user.departmentId !== departmentId) {
            return res.status(403).json({
                success: false,
                message: 'Employees can only submit carbon transactions for their own department.',
            });
        }

        const emissionFactor = await prisma.emissionFactor.findUnique({
            where: { id: Number(req.body.emissionFactorId) },
        });

        if (!emissionFactor) {
            return res.status(404).json({ success: false, message: 'Emission factor not found.' });
        }

        const calculatedEmission = calculateManualEmission(req.body.quantity, emissionFactor.co2PerUnit);

        const transaction = await prisma.carbonTransaction.create({
            data: {
                departmentId,
                emissionFactorId: Number(req.body.emissionFactorId),
                quantity: Number(req.body.quantity),
                calculatedEmission,
                source: 'MANUAL',
                createdById: req.user.userId,
            },
            include: {
                emissionFactor: true,
                department: true,
            },
        });

        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

export const listCarbonTransactions = async (req, res, next) => {
    try {
        const where = {};

        if (req.user.role === 'EMPLOYEE') {
            where.departmentId = req.user.departmentId;
        } else if (req.query.departmentId) {
            where.departmentId = Number(req.query.departmentId);
        }

        if (req.query.dateRange) {
            const parsedRange = parseDateRange(req.query.dateRange);
            if (!parsedRange) {
                return res.status(400).json({
                    success: false,
                    message: 'dateRange must use start,end format (YYYY-MM-DD,YYYY-MM-DD).',
                });
            }

            where.date = {
                gte: parsedRange.start,
                lte: parsedRange.end,
            };
        }

        const transactions = await prisma.carbonTransaction.findMany({
            where,
            include: {
                emissionFactor: true,
                department: true,
            },
            orderBy: { date: 'desc' },
        });

        res.json({ success: true, data: transactions });
    } catch (error) {
        next(error);
    }
};

export const getDepartmentCarbonSummary = async (req, res, next) => {
    try {
        const departmentId = Number(req.params.departmentId);

        if (req.user.role === 'EMPLOYEE' && req.user.departmentId !== departmentId) {
            return res.status(403).json({
                success: false,
                message: 'Employees can only view carbon summary for their own department.',
            });
        }

        const [department, aggregate] = await Promise.all([
            prisma.department.findUnique({ where: { id: departmentId } }),
            prisma.carbonTransaction.aggregate({
                where: { departmentId },
                _sum: { calculatedEmission: true },
                _count: { _all: true },
            }),
        ]);

        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found.' });
        }

        return res.json({
            success: true,
            data: {
                departmentId,
                departmentName: department.name,
                totalEmission: aggregate._sum.calculatedEmission ?? 0,
                transactionCount: aggregate._count._all,
            },
        });
    } catch (error) {
        return next(error);
    }
};
