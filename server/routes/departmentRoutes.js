import express from 'express';
<<<<<<< HEAD
import prisma from '../config/db.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (_req, res, next) => {
  try {
    const departments = await prisma.department.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const department = await prisma.department.create({ data: { name: req.body.name } });
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const department = await prisma.department.update({
      where: { id: Number(req.params.id) },
      data: { name: req.body.name },
    });
    res.json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await prisma.department.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: 'Department deleted' });
  } catch (error) {
    next(error);
  }
});
=======
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
>>>>>>> b0514b66e92ad0566c63987828ebefd224fdc116

export default router;
