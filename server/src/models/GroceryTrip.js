import mongoose from 'mongoose';

const groceryItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0, default: 0 },
  bought: { type: Boolean, default: false },
});

const groceryTripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    items: [groceryItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model('GroceryTrip', groceryTripSchema);
