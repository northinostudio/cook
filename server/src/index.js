import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import foodsRoutes from './routes/foods.js';
import overridesRoutes from './routes/overrides.js';
import groceriesRoutes from './routes/groceries.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', '..', 'dist');

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

// In production this server also hosts the built frontend, so the whole
// app is one deployable service reachable from any device at one URL.
app.use(express.static(DIST_DIR));
app.get(/^(?!\/api).*/, (req, res, next) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'), (err) => {
    if (err) next();
  });
});

// Central error handler — every route is wrapped in asyncHandler, so
// rejected promises land here instead of hanging the request.
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.publicMessage || 'Something went wrong' });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('[server] failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
