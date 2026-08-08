import mongoose from 'mongoose';

// A user's correction to a built-in preset's default time. The built-in
// list itself (src/data/presetFoods.js) stays fixed — this is the delta.
const presetOverrideSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    foodId: { type: String, required: true },
    seconds: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

presetOverrideSchema.index({ user: 1, foodId: 1 }, { unique: true });

export default mongoose.model('PresetOverride', presetOverrideSchema);
