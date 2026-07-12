import { body, param } from 'express-validator';
import prisma from '../config/db.js';

export const validateDepartmentIdParam = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Department id must be a positive integer.')
        .bail()
        .custom(async (value) => {
            const found = await prisma.department.findUnique({ where: { id: Number(value) } });
            if (!found) {
                throw new Error('Department not found.');
            }
            return true;
        }),
];

export const validateDepartmentCreate = [
    body('name').trim().notEmpty().withMessage('Department name is required.'),
];

export const validateDepartmentUpdate = [
    body('name').trim().notEmpty().withMessage('Department name is required.'),
];
