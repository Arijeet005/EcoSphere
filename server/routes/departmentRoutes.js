import express from 'express';
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

export default router;
