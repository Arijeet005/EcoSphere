import { body, param, query } from 'express-validator';
import prisma from '../config/db.js';

export const validateEmissionFactorCreate = [
  body('name').trim().notEmpty().withMessage('Emission factor name is required.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
  body('unit').trim().notEmpty().withMessage('Unit is required.'),
  body('co2PerUnit').isFloat({ gt: 0 }).withMessage('co2PerUnit must be a positive number.'),
];

export const validateEmissionFactorUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Emission factor name cannot be empty.'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty.'),
  body('unit').optional().trim().notEmpty().withMessage('Unit cannot be empty.'),
  body('co2PerUnit').optional().isFloat({ gt: 0 }).withMessage('co2PerUnit must be a positive number.'),
];

export const validateEmissionFactorIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Emission factor id must be a positive integer.')
    .bail()
    .custom(async (value) => {
      const found = await prisma.emissionFactor.findUnique({ where: { id: Number(value) } });
      if (!found) {
        throw new Error('Emission factor not found.');
      }
      return true;
    }),
];

export const validateCarbonCreate = [
  body('departmentId')
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
  body('emissionFactorId')
    .isInt({ min: 1 })
    .withMessage('Emission factor id must be a positive integer.')
    .bail()
    .custom(async (value) => {
      const found = await prisma.emissionFactor.findUnique({ where: { id: Number(value) } });
      if (!found) {
        throw new Error('Emission factor not found.');
      }
      return true;
    }),
  body('quantity').isFloat({ gt: 0 }).withMessage('Quantity must be a positive number.'),
];

export const validateCarbonListQuery = [
  query('departmentId').optional().isInt({ min: 1 }).withMessage('departmentId must be a positive integer.'),
  query('dateRange')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/)
    .withMessage('dateRange must use start,end format (YYYY-MM-DD,YYYY-MM-DD).'),
];

export const validateDepartmentSummaryParam = [
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
