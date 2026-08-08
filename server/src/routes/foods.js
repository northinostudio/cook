import { Router } from 'express';
import CustomFood from '../models/CustomFood.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const foods = await CustomFood.find({ user: req.userId }).sort({ createdAt: 1 });
    res.json({ foods });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, seconds } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return res.status(400).json({ error: 'seconds must be a positive number' });
    }
    const food = await CustomFood.create({ user: req.userId, name: name.trim(), seconds });
    res.status(201).json({ food });
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { name, seconds } = req.body ?? {};
    const patch = {};
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) return res.status(400).json({ error: 'name must be non-empty' });
      patch.name = name.trim();
    }
    if (seconds !== undefined) {
      if (!Number.isFinite(seconds) || seconds <= 0) {
        return res.status(400).json({ error: 'seconds must be a positive number' });
      }
      patch.seconds = seconds;
    }
    const food = await CustomFood.findOneAndUpdate({ _id: req.params.id, user: req.userId }, patch, { new: true });
    if (!food) return res.status(404).json({ error: 'Food not found' });
    res.json({ food });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const result = await CustomFood.deleteOne({ _id: req.params.id, user: req.userId });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Food not found' });
    res.status(204).end();
  })
);

export default router;
