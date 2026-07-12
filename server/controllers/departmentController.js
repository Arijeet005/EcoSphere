import prisma from '../config/db.js';

export const getDepartments = async (req, res, next) => {
    try {
        const departments = await prisma.department.findMany({
            orderBy: { name: 'asc' },
        });
        res.json({ success: true, data: departments });
    } catch (error) {
        next(error);
    }
};

export const getDepartmentById = async (req, res, next) => {
    try {
        const department = await prisma.department.findUnique({
            where: { id: Number(req.params.id) },
        });

        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found.' });
        }

        return res.json({ success: true, data: department });
    } catch (error) {
        return next(error);
    }
};

export const createDepartment = async (req, res, next) => {
    try {
        const department = await prisma.department.create({
            data: {
                name: req.body.name.trim(),
            },
        });

        res.status(201).json({ success: true, data: department });
    } catch (error) {
        if (error?.code === 'P2002') {
            return res.status(409).json({ success: false, message: 'Department name already exists.' });
        }
        return next(error);
    }
};

export const updateDepartment = async (req, res, next) => {
    try {
        const department = await prisma.department.update({
            where: { id: Number(req.params.id) },
            data: {
                name: req.body.name.trim(),
            },
        });

        res.json({ success: true, data: department });
    } catch (error) {
        if (error?.code === 'P2002') {
            return res.status(409).json({ success: false, message: 'Department name already exists.' });
        }
        return next(error);
    }
};

export const deleteDepartment = async (req, res, next) => {
    try {
        await prisma.department.delete({
            where: { id: Number(req.params.id) },
        });

        res.json({ success: true, message: 'Department deleted.' });
    } catch (error) {
        return next(error);
    }
};
