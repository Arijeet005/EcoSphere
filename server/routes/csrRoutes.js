import express from 'express';
import { createCsrActivity, deleteCsrActivity, getCsrActivities, updateCsrActivity } from '../controllers/csrController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCsrActivities);
router.post('/', protect, createCsrActivity);
router.put('/:id', protect, updateCsrActivity);
router.delete('/:id', protect, deleteCsrActivity);
router.patch('/:id/approve', protect, (req, res) => {
  res.json({ success: true, data: { id: Number(req.params.id), status: 'APPROVED' } });
});
router.patch('/:id/reject', protect, (req, res) => {
  res.json({ success: true, data: { id: Number(req.params.id), status: 'REJECTED' } });
});

export default router;
