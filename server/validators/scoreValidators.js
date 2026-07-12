import { param } from 'express-validator';
import prisma from '../config/db.js';

export const validateScoreDepartmentParam = [
  param('departmentId')
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
