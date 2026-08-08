import mongoose from 'mongoose';

const customFoodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    seconds: { type: Number, required: true, min: 1 },
    category: { type: String, default: 'Custom' },
  },
  { timestamps: true }
);

export default mongoose.model('CustomFood', customFoodSchema);
