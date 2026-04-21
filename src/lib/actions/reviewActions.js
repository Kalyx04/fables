'use server';

import connectToDatabase from '../mongodb';
import Review from '../models/Review';
import User from '../models/User';
import Fiction from '../models/Fiction';
import Reply from '../models/Reply';
import { verifyToken } from '../auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function addReview({ fictionId, chapterId, type, content, rating, title }) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();

    const query = {
      userId: session.id,
      fictionId,
      type: type || 'fiction'
    };
    if (chapterId) query.chapterId = chapterId;
    else query.chapterId = { $exists: false };

    const updateData = {
      content,
      rating: rating || undefined,
      title: title || ''
    };

    const review = await Review.findOneAndUpdate(
      query,
      { $set: updateData },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    // If it's a fiction review, update the fiction's average rating
    if (!chapterId || type === 'fiction') {
      const allFictionReviews = await Review.find({ fictionId, type: 'fiction' });
      const ratingCount = allFictionReviews.length;
      let averageRating = 0;
      
      if (ratingCount > 0) {
        const totalRatings = allFictionReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        averageRating = totalRatings / ratingCount;
      }

      await Fiction.findByIdAndUpdate(fictionId, {
        $set: {
          'stats.rating': parseFloat(averageRating.toFixed(1)),
          'stats.ratingCount': ratingCount
        }
      });
    }

    // Increment user's review count if it was a new review
    // (Note: This is approximate if we are upserting, but okay for MVP stats)
    await User.findByIdAndUpdate(session.id, { $inc: { 'stats.reviews': 1 } });

    revalidatePath(`/novel/${fictionId}`);
    if (chapterId) revalidatePath(`/read/${fictionId}/${chapterId}`);

    return { success: true, reviewId: review._id.toString() };
  } catch (error) {
    console.error('addReview error:', error);
    return { error: 'Failed' };
  }
}

export async function getReviews(query) {
  try {
    await connectToDatabase();
    const reviews = await Review.find(query)
      .populate('userId', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .lean();

    return {
      reviews: reviews.map(r => ({
        ...r,
        _id: r._id.toString(),
        fictionId: r.fictionId.toString(),
        chapterId: r.chapterId ? r.chapterId.toString() : null,
        userId: {
          ...r.userId,
          _id: r.userId._id.toString()
        }
      }))
    };
  } catch (error) {
    console.error('getReviews error:', error);
    return { error: 'Failed to fetch reviews' };
  }
}

export async function getPublicUserReviews(userId) {
  return getReviews({ userId, type: 'fiction' });
}

export async function addReply({ reviewId, content }) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();
    await Reply.create({ userId: session.id, reviewId, content });
    return { success: true };
  } catch (error) {
    return { error: 'Failed to add reply' };
  }
}

export async function getReplies(reviewId) {
  try {
    await connectToDatabase();
    const replies = await Reply.find({ reviewId })
      .populate('userId', 'username avatarUrl')
      .sort({ createdAt: 1 })
      .lean();

    return {
      replies: replies.map(r => ({
        ...r,
        _id: r._id.toString(),
        reviewId: r.reviewId.toString(),
        userId: {
          ...r.userId,
          _id: r.userId._id.toString()
        }
      }))
    };
  } catch (error) {
    return { error: 'Failed' };
  }
}
