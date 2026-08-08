import { Router } from 'express';
import GroceryTrip from '../models/GroceryTrip.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.use(requireAuth);

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function loadOwnTrip(req, res) {
  const trip = await GroceryTrip.findOne({ _id: req.params.id, user: req.userId });
  if (!trip) {
    res.status(404).json({ error: 'List not found' });
    return null;
  }
  return trip;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const trips = await GroceryTrip.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ trips });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name } = req.body ?? {};
    const trip = await GroceryTrip.create({ user: req.userId, name: name?.trim() || todayLabel(), items: [] });
    res.status(201).json({ trip });
  })
);

router.post(
  '/:id/duplicate',
  asyncHandler(async (req, res) => {
    const source = await loadOwnTrip(req, res);
    if (!source) return;
    const trip = await GroceryTrip.create({
      user: req.userId,
      name: todayLabel(),
      items: source.items.map((it) => ({ name: it.name, price: it.price, bought: false })),
    });
    res.status(201).json({ trip });
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { name } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name must be non-empty' });
    }
    const trip = await GroceryTrip.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name: name.trim() },
      { new: true }
    );
    if (!trip) return res.status(404).json({ error: 'List not found' });
    res.json({ trip });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const result = await GroceryTrip.deleteOne({ _id: req.params.id, user: req.userId });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'List not found' });
    res.status(204).end();
  })
);

router.post(
  '/:id/items',
  asyncHandler(async (req, res) => {
    const { name, price } = req.body ?? {};
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    const trip = await loadOwnTrip(req, res);
    if (!trip) return;
    trip.items.push({ name: name.trim(), price: Number.isFinite(price) ? price : 0, bought: false });
    await trip.save();
    res.status(201).json({ trip });
  })
);

router.patch(
  '/:id/items/:itemId',
  asyncHandler(async (req, res) => {
    const trip = await loadOwnTrip(req, res);
    if (!trip) return;
    const item = trip.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const { name, price, bought } = req.body ?? {};
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) return res.status(400).json({ error: 'name must be non-empty' });
      item.name = name.trim();
    }
    if (price !== undefined) {
      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({ error: 'price must be a non-negative number' });
      }
      item.price = price;
    }
    if (bought !== undefined) {
      item.bought = Boolean(bought);
    }
    await trip.save();
    res.json({ trip });
  })
);

router.delete(
  '/:id/items/:itemId',
  asyncHandler(async (req, res) => {
    const trip = await loadOwnTrip(req, res);
    if (!trip) return;
    const item = trip.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.deleteOne();
    await trip.save();
    res.json({ trip });
  })
);

export default router;
