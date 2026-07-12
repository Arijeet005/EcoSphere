import express from 'express';
import { approveParticipation, createParticipation, listParticipations } from '../controllers/csrController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, listParticipations);
router.post('/', protect, createParticipation);
router.put('/:id/approve', protect, authorizeRole('MANAGER'), approveParticipation);

export default router;
