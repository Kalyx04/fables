import mongoose from 'mongoose';

const GENRES = [
  'Fantasy', 'Sci-Fi', 'Romance', 'Horror', 'Mystery',
  'Thriller', 'Cultivation', 'Isekai', 'LitRPG', 'Historical',
  'Slice of Life', 'Action', 'Adventure', 'Comedy',
];

const FictionSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    synopsis: {
      type: String,
      maxlength: 5000,
      default: '',
    },
    coverUrl: {
      type: String,
      default: '',
    },
    genres: {
      type: [{ type: String, enum: GENRES }],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      validate: [(val) => val.length <= 10, 'Maximum 10 tags allowed'],
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'hiatus', 'draft'],
      default: 'ongoing',
    },
    chapterCount: {
      type: Number,
      default: 0,
    },
    stats: {
      views: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      favorites: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      ratingCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Fiction;
}

export default mongoose.models.Fiction || mongoose.model('Fiction', FictionSchema);
