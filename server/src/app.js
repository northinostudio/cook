import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import foodsRoutes from './routes/foods.js';
import overridesRoutes from './routes/overrides.js';
import groceriesRoutes from './routes/groceries.js';

// Kick off the DB connection as soon as this module loads. We don't await
// it here — Mongoose buffers model operations until the connection opens,
// so requests that arrive first just wait briefly instead of failing. This
// runs on every cold start (local process boot, or a fresh Vercel instance)
// and is a no-op on an already-connected/connecting instance.
connectDB().catch((err) => console.error('[db] connection failed:', err.message));

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodsRoutes);
app.use('/api/overrides', overridesRoutes);
app.use('/api/groceries', groceriesRoutes);

// Not attached here — callers (local index.js, the Vercel function) may
// register more routes after importing `app` (e.g. static file serving),
// and error-handling middleware only works correctly as the very last
// thing registered. Each entrypoint calls `app.use(errorHandler)` itself,
// after its own setup, as the final line before listening/exporting.
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.publicMessage || 'Something went wrong' });
}

export default app;
