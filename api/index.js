// Vercel serverless entrypoint. This one function handles the entire
// /api/* subtree — vercel.json rewrites every /api/:path* request here
// with the full original path intact, and the Express app inside handles
// its own routing exactly as it does locally. (The alternative — a
// [...path].js dynamic catch-all filename relying on Vercel's automatic
// file-based routing — did not reliably match multi-segment paths in
// testing, so this uses an explicit rewrite instead.) Static frontend
// assets (dist/) are served by Vercel directly, not by this function.
import app, { errorHandler } from '../server/src/app.js';

app.use(errorHandler);

export default app;
