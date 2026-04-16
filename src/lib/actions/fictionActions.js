'use server';

import connectToDatabase from '../mongodb';
import Fiction from '../models/Fiction';
import User from '../models/User';
import { verifyToken } from '../auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Creates a new fiction for the logged-in user.
 */
export async function createFiction(formData) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const title = formData.get('title')?.trim();
  if (!title) return { error: 'Title is required' };

  const synopsis = formData.get('synopsis') || '';
  const coverUrl = formData.get('coverUrl') || '';
  const genres = formData.getAll('genres');
  const tagsRaw = formData.get('tags') || '';
  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 10);
  const status = formData.get('status') || 'ongoing';

  try {
    await connectToDatabase();

    const fiction = await Fiction.create({
      authorId: session.id,
      title,
      synopsis,
      coverUrl,
      genres,
      tags,
      status,
    });

    // Increment user's fiction count
    await User.findByIdAndUpdate(session.id, { $inc: { 'stats.fictions': 1 } });

    revalidatePath('/write');
    revalidatePath(`/profile/${session.username}`);

    return { fictionId: fiction._id.toString() };
  } catch (error) {
    console.error('createFiction error:', error);
    return { error: 'Failed to create fiction' };
  }
}

/**
 * Fetches all fictions authored by the logged-in user.
 */
export async function getUserFictions() {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();

    const fictions = await Fiction.find({ authorId: session.id })
      .sort({ updatedAt: -1 })
      .lean();

    return {
      fictions: fictions.map((f) => ({
        ...f,
        _id: f._id.toString(),
        authorId: f.authorId.toString(),
      })),
    };
  } catch (error) {
    console.error('getUserFictions error:', error);
    return { error: 'Failed to fetch fictions' };
  }
}

/**
 * Fetches fictions authored by a specific user for their public profile.
 */
export async function getPublicUserFictions(authorId) {
  try {
    await connectToDatabase();
    const fictions = await Fiction.find({ authorId, status: { $ne: 'draft' } })
      .sort({ updatedAt: -1 })
      .lean();

    return {
      fictions: fictions.map((f) => ({
        ...f,
        _id: f._id.toString(),
        authorId: f.authorId.toString(),
      })),
    };
  } catch (error) {
    console.error('getPublicUserFictions error:', error);
    return { error: 'Failed' };
  }
}

/**
 * Fetches a single fiction by ID (verifies ownership).
 */
export async function getFiction(fictionId) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();

    const fiction = await Fiction.findOne({
      _id: fictionId,
      authorId: session.id,
    }).lean();

    if (!fiction) return { error: 'Fiction not found' };

    return {
      fiction: {
        ...fiction,
        _id: fiction._id.toString(),
        authorId: fiction.authorId.toString(),
      },
    };
  } catch (error) {
    console.error('getFiction error:', error);
    return { error: 'Failed to fetch fiction' };
  }
}

/**
 * Fetches a single fiction by ID for public viewing.
 */
export async function getPublicFiction(fictionId) {
  try {
    await connectToDatabase();

    const fiction = await Fiction.findById(fictionId)
      .populate('authorId', 'username')
      .lean();

    if (!fiction) return { error: 'Fiction not found' };

    return {
      fiction: {
        ...fiction,
        _id: fiction._id.toString(),
        authorId: {
          ...fiction.authorId,
          _id: fiction.authorId._id.toString(),
        },
      },
    };
  } catch (error) {
    console.error('getPublicFiction error:', error);
    return { error: 'Failed to fetch fiction' };
  }
}

/**
 * Fetches fictions for the browse page with filtering and search.
 */
export async function getFictions({ genre, q }) {
  try {
    await connectToDatabase();

    // Ensure parameters are strings (Next.js 15 searchParams can be arrays)
    const genreStr = Array.isArray(genre) ? genre[0] : genre;
    const searchStr = Array.isArray(q) ? q[0] : q;

    let query = { status: { $ne: 'draft' } };

    if (genreStr && genreStr !== 'All') {
      query.genres = genreStr;
    }

    if (searchStr) {
      query.$or = [
        { title: { $regex: searchStr, $options: 'i' } },
        { synopsis: { $regex: searchStr, $options: 'i' } }
      ];
    }

    const fictions = await Fiction.find(query)
      .populate('authorId', 'username')
      .sort({ updatedAt: -1 })
      .lean();

    return {
      fictions: fictions.map((f) => ({
        ...f,
        _id: f._id.toString(),
        authorId: f.authorId ? {
          ...f.authorId,
          _id: f.authorId._id.toString(),
        } : null,
      })),
    };
  } catch (error) {

    console.error('getFictions error:', error);
    return { error: 'Failed to fetch fictions' };
  }
}


