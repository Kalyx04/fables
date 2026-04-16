import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fiction',
      required: true,
    },
  },
  { timestamps: true }
);

// Unique compound index to prevent duplicate favorites
FavoriteSchema.index({ userId: 1, fictionId: 1 }, { unique: true });

if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Favorite;
}

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
