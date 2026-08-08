import { Router } from 'express';
import PresetOverride from '../models/PresetOverride.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const overrides = await PresetOverride.find({ user: req.userId });
    const map = Object.fromEntries(overrides.map((o) => [o.foodId, o.seconds]));
    res.json({ overrides: map });
  })
);

router.put(
  '/:foodId',
  asyncHandler(async (req, res) => {
    const { seconds } = req.body ?? {};
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return res.status(400).json({ error: 'seconds must be a positive number' });
    }
    const override = await PresetOverride.findOneAndUpdate(
      { user: req.userId, foodId: req.params.foodId },
      { seconds },
      { new: true, upsert: true }
    );
    res.json({ foodId: override.foodId, seconds: override.seconds });
  })
);

router.delete(
  '/:foodId',
  asyncHandler(async (req, res) => {
    await PresetOverride.deleteOne({ user: req.userId, foodId: req.params.foodId });
    res.status(204).end();
  })
);

export default router;
