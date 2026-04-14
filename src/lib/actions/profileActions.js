'use server';

import connectToDatabase from '../mongodb';
import User from '../models/User';
import { verifyToken } from '../auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Fetches a user's profile by their username.
 * Returns public-facing information.
 */
export async function getUserProfile(username) {
  try {
    const decodedUsername = decodeURIComponent(username);
    await connectToDatabase();
    
    // Use lean() for quicker execution since we only need the JSON object
    const user = await User.findOne({ username: decodedUsername }).lean();

    
    if (!user) {
      return { error: 'User not found' };
    }

    // Omit sensitive information like passwords and emails
    const { password_hash, email, ...publicProfile } = user;
    
    // Ensure _id is stringified for Next.js serialization
    publicProfile._id = publicProfile._id.toString();

    return { user: publicProfile };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { error: 'Failed to fetch user profile' };
  }
}

/**
 * Updates the logged-in user's profile.
 */
export async function updateUserProfile(formData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fables_session')?.value;
    
    if (!token) {
      return { error: 'Not authenticated' };
    }

    const session = await verifyToken(token);
    if (!session || !session.id) {
      return { error: 'Invalid session' };
    }

    await connectToDatabase();

    const allowedFields = ['bio', 'birthDate', 'gender', 'location', 'avatarUrl', 'bannerUrl', 'website'];
    const updateData = {};

    for (const field of allowedFields) {
      const value = formData.get(field);
      if (value !== null) {
        updateData[field] = value;
      }
    }

    // Special handling for birthDate if it's empty
    if (updateData.birthDate === '') {
      updateData.birthDate = null;
    }

    console.log('===============================');
    console.log('UPDATING PROFILE FOR SESSION ID:', session.id);
    console.log('DATA TO SAVE:', updateData);
    console.log('===============================');

    const updatedUser = await User.findByIdAndUpdate(
      session.id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).lean();

    console.log('RESULTING DOCUMENT:', updatedUser);
    console.log('===============================');

    if (!updatedUser) {
      return { error: 'User not found' };
    }

    revalidatePath('/profile/[username]', 'page');
    revalidatePath('/settings/profile');

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: 'Failed to update profile' };
  }
}
