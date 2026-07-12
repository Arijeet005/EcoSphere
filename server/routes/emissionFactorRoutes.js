import express from 'express';
import {
    createEmissionFactor,
    deleteEmissionFactor,
    getEmissionFactorById,
    listEmissionFactors,
    updateEmissionFactor,
} from '../controllers/emissionFactorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { handleValidationErrors } from '../middleware/validators.js';
import {
    validateEmissionFactorCreate,
    validateEmissionFactorIdParam,
    validateEmissionFactorUpdate,
} from '../validators/environmentValidators.js';

const router = express.Router();

router.get('/', protect, listEmissionFactors);
router.get('/:id', protect, validateEmissionFactorIdParam, handleValidationErrors, getEmissionFactorById);
router.post('/', protect, authorizeRole('MANAGER'), validateEmissionFactorCreate, handleValidationErrors, createEmissionFactor);
router.put(
    '/:id',
    protect,
    authorizeRole('MANAGER'),
    validateEmissionFactorIdParam,
    validateEmissionFactorUpdate,
    handleValidationErrors,
    updateEmissionFactor,
);
router.delete('/:id', protect, authorizeRole('MANAGER'), validateEmissionFactorIdParam, handleValidationErrors, deleteEmissionFactor);

export default router;
