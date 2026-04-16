import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
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
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      // Optional: presence means it's a chapter review, absence means it's a main fiction review
    },
    type: {
      type: String,
      enum: ['fiction', 'chapter'],
      default: 'fiction',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      // Optional for chapters, usually required for fictions
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Review;
}

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
