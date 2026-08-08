import mongoose from 'mongoose';

// Cached across invocations so a warm serverless instance (Vercel) reuses
// the same connection instead of opening a new one per request; local dev
// just connects once and keeps it. Callers must await this before touching
// any model — relying on Mongoose's default command buffering instead (i.e.
// firing the connect and letting queries queue) means a slow/failed connect
// silently eats the whole request as a ~10s "buffering timed out" error
// with no useful detail, which is exactly what happened here.
let connectingPromise = null;

export function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (connectingPromise) return connectingPromise;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    return Promise.reject(new Error('MONGO_URI is not set'));
  }
  mongoose.set('strictQuery', true);
  connectingPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false,
    })
    .then((m) => {
      console.log('[db] connected to MongoDB');
      return m;
    })
    .catch((err) => {
      connectingPromise = null; // allow a retry on the next request/cold start
      throw err;
    });
  return connectingPromise;
}
