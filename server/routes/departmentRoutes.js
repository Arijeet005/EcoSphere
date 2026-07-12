import express from 'express';
import {
    createDepartment,
    deleteDepartment,
    getDepartmentById,
    getDepartments,
    updateDepartment,
} from '../controllers/departmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { handleValidationErrors } from '../middleware/validators.js';
import {
    validateDepartmentCreate,
    validateDepartmentIdParam,
    validateDepartmentUpdate,
} from '../validators/departmentValidators.js';

const router = express.Router();

router.get('/', protect, getDepartments);
router.get('/:id', protect, validateDepartmentIdParam, handleValidationErrors, getDepartmentById);
router.post('/', protect, authorizeRole('MANAGER'), validateDepartmentCreate, handleValidationErrors, createDepartment);
router.put(
    '/:id',
    protect,
    authorizeRole('MANAGER'),
    validateDepartmentIdParam,
    validateDepartmentUpdate,
    handleValidationErrors,
    updateDepartment,
);
router.delete('/:id', protect, authorizeRole('MANAGER'), validateDepartmentIdParam, handleValidationErrors, deleteDepartment);

export default router;
