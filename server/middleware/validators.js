import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('role').optional().isIn(['MANAGER', 'EMPLOYEE']).withMessage('Role must be MANAGER or EMPLOYEE.'),
  body('departmentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Department must be a valid ID.'),
];

export const validateLogin = [
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

export const validateMetric = [
  body('type').isIn(['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE']).withMessage('Invalid metric type.'),
  body('name').trim().notEmpty().withMessage('Metric name is required.'),
  body('value').isFloat({ min: 0 }).withMessage('Metric value must be a non-negative number.'),
  body('unit').trim().notEmpty().withMessage('Unit is required.'),
  body('departmentId').isInt({ min: 1 }).withMessage('A valid department is required.'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  next();
};
