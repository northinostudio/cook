// Vercel serverless entrypoint. The filename "[...path].js" is Vercel's
// catch-all dynamic route — every request under /api/* (any depth) is
// forwarded to this one function with the full original path intact, and
// the Express app inside handles its own routing exactly as it does
// locally. Static frontend assets (dist/) are served by Vercel directly,
// not by this function.
import app, { errorHandler } from '../server/src/app.js';

app.use(errorHandler);

export default app;
