'use server';

import connectToDatabase from '../mongodb';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUpAction(prevState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!username || !email || !password) {
    return { error: 'All fields are required.' };
  }

  try {
    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return { error: 'Username or email already in use.' };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password_hash
    });

    // Create session token
    const token = await signToken({
      id: newUser._id.toString(),
      username: newUser.username
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('fables_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'An error occurred during signup.' };
  }

  redirect('/');
}

export async function loginAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'All fields are required.' };
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return { error: 'Invalid email or password.' };
    }

    // Create session token
    const token = await signToken({
      id: user._id.toString(),
      username: user.username
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('fables_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An error occurred during login.' };
  }

  redirect('/');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('fables_session');
  redirect('/');
}
