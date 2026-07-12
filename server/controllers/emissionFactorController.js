import prisma from '../config/db.js';

export const listEmissionFactors = async (req, res, next) => {
    try {
        const where = req.query.category ? { category: req.query.category } : {};

        const factors = await prisma.emissionFactor.findMany({
            where,
            orderBy: { name: 'asc' },
        });

        res.json({ success: true, data: factors });
    } catch (error) {
        next(error);
    }
};

export const getEmissionFactorById = async (req, res, next) => {
    try {
        const factor = await prisma.emissionFactor.findUnique({
            where: { id: Number(req.params.id) },
        });

        if (!factor) {
            return res.status(404).json({ success: false, message: 'Emission factor not found.' });
        }

        return res.json({ success: true, data: factor });
    } catch (error) {
        return next(error);
    }
};

export const createEmissionFactor = async (req, res, next) => {
    try {
        const factor = await prisma.emissionFactor.create({
            data: {
                name: req.body.name.trim(),
                category: req.body.category.trim(),
                unit: req.body.unit.trim(),
                co2PerUnit: Number(req.body.co2PerUnit),
                createdById: req.user.userId,
            },
        });

        res.status(201).json({ success: true, data: factor });
    } catch (error) {
        next(error);
    }
};

export const updateEmissionFactor = async (req, res, next) => {
    try {
        const factor = await prisma.emissionFactor.update({
            where: { id: Number(req.params.id) },
            data: {
                name: req.body.name ? req.body.name.trim() : undefined,
                category: req.body.category ? req.body.category.trim() : undefined,
                unit: req.body.unit ? req.body.unit.trim() : undefined,
                co2PerUnit: req.body.co2PerUnit ? Number(req.body.co2PerUnit) : undefined,
            },
        });

        res.json({ success: true, data: factor });
    } catch (error) {
        next(error);
    }
};

export const deleteEmissionFactor = async (req, res, next) => {
    try {
        await prisma.emissionFactor.delete({
            where: { id: Number(req.params.id) },
        });

        res.json({ success: true, message: 'Emission factor deleted.' });
    } catch (error) {
        next(error);
    }
};
