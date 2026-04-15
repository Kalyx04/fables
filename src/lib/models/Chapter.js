import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema(
  {
    fictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fiction',
      required: true,
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 300,
      default: 'Untitled Chapter',
    },
    // Tiptap JSON document stored as a flexible Mixed object
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedTitle: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null,
    },
    publishedContent: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    lastPublishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Chapter;
}

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
