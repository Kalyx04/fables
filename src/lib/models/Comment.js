import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    fictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fiction',
      required: true,
    },
    selectedText: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    paragraphIndex: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Comment;
}

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
