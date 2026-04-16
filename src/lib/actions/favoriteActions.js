'use server';

import connectToDatabase from '../mongodb';
import Favorite from '../models/Favorite';
import { verifyToken } from '../auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function toggleFavorite(fictionId) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();

    const existing = await Favorite.findOne({ userId: session.id, fictionId });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      revalidatePath(`/novel/${fictionId}`);
      return { favorited: false };
    } else {
      await Favorite.create({ userId: session.id, fictionId });
      revalidatePath(`/novel/${fictionId}`);
      return { favorited: true };
    }
  } catch (error) {
    console.error('toggleFavorite error:', error);
    return { error: 'Failed to update favorites' };
  }
}

export async function getFavoriteStatus(fictionId) {
  const session = await getSession();
  if (!session) return { favorited: false };

  try {
    await connectToDatabase();
    const existing = await Favorite.findOne({ userId: session.id, fictionId });
    return { favorited: !!existing };
  } catch (error) {
    return { favorited: false };
  }
}

export async function getUserFavorites(userId) {
  try {
    await connectToDatabase();
    const favorites = await Favorite.find({ userId })
      .populate('fictionId')
      .lean();
    
    return { 
      favorites: favorites.map(f => ({
        ...f.fictionId,
        _id: f.fictionId._id.toString(),
        authorId: f.fictionId.authorId.toString()
      })) 
    };
  } catch (error) {
    return { error: 'Failed to fetch favorites' };
  }
}
