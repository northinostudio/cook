// Local/self-hosted entrypoint (dev, Docker, Fly/Railway/etc). Not used on
// Vercel — there, api/[...path].js exports the same app.js directly and
// Vercel's own static hosting serves dist/ instead of this Express static
// block.
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import app, { errorHandler } from './app.js';
import { connectDB } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', '..', 'dist');

app.use(express.static(DIST_DIR));
app.get(/^(?!\/api).*/, (req, res, next) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'), (err) => {
    if (err) next();
  });
});
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('[server] failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
