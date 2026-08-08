import mongoose from 'mongoose';

// Cached across invocations so a warm serverless instance (Vercel) reuses
// the same connection instead of opening a new one per request; local dev
// just connects once and keeps it.
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
    .connect(uri)
    .then(() => {
      console.log('[db] connected to MongoDB');
    })
    .catch((err) => {
      connectingPromise = null; // allow a retry on the next request/cold start
      throw err;
    });
  return connectingPromise;
}
