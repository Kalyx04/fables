import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      maxlength: 2000,
      default: '',
    },
    birthDate: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other'],
      default: 'Prefer not to say',
    },
    location: {
      type: String,
      maxlength: 100,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    stats: {
      fictions: { type: Number, default: 0 },
      reviews: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      reputation: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// In development, delete the cached model before redefining it.
// This ensures schema changes (like adding new fields) take effect
// immediately without needing a full server restart.
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model('User', UserSchema);
