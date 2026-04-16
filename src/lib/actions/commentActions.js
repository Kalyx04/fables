'use server';

import connectToDatabase from '../mongodb';
import Comment from '../models/Comment';
import User from '../models/User';
import { verifyToken } from '../auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function addInlineComment({ fictionId, chapterId, selectedText, paragraphIndex, content }) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();

    const comment = await Comment.create({
      userId: session.id,
      fictionId,
      chapterId,
      selectedText,
      paragraphIndex,
      content
    });

    // Increment user's comment count
    await User.findByIdAndUpdate(session.id, { $inc: { 'stats.comments': 1 } });

    revalidatePath(`/read/${fictionId}/${chapterId}`);

    return { success: true, commentId: comment._id.toString() };
  } catch (error) {
    console.error('addInlineComment error:', error);
    return { error: 'Failed to post comment' };
  }
}

export async function getChapterComments(chapterId) {
  try {
    await connectToDatabase();
    const comments = await Comment.find({ chapterId })
      .populate('userId', 'username avatarUrl')
      .sort({ createdAt: 1 })
      .lean();

    return {
      comments: comments.map(c => ({
        ...c,
        _id: c._id.toString(),
        fictionId: c.fictionId.toString(),
        chapterId: c.chapterId.toString(),
        userId: {
          ...c.userId,
          _id: c.userId._id.toString()
        }
      }))
    };
  } catch (error) {
    console.error('getChapterComments error:', error);
    return { error: 'Failed to fetch comments' };
  }
}
