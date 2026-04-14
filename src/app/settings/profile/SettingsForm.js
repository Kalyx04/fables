'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from '@/lib/actions/profileActions';
import ImageUploader from './ImageUploader';
import styles from './settings.module.css';

export default function SettingsForm({ user }) {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // Controlled state for image URLs so the ImageUploader can update them
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(user?.bannerUrl || '');

  const formattedDate = user?.birthDate 
    ? new Date(user.birthDate).toISOString().split('T')[0]
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setStatus(null);
    
    const formData = new FormData(e.target);
    
    // Override the URL fields with our controlled state (handles both upload and paste)
    formData.set('avatarUrl', avatarUrl);
    formData.set('bannerUrl', bannerUrl);
    
    const result = await updateUserProfile(formData);
    
    if (result?.error) {
      setStatus({ type: 'error', message: result.error });
      setIsPending(false);
    } else {
      setStatus({ type: 'success', message: 'Profile updated! Redirecting...' });
      setTimeout(() => {
        router.push(`/profile/${user.username}`);
        router.refresh();
      }, 800);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {status && (
        <div className={`${styles.message} ${status.type === 'error' ? styles.error : styles.success}`}>
          {status.message}
        </div>
      )}

      {/* Banner Upload */}
      <ImageUploader
        label="Profile Banner"
        value={bannerUrl}
        onChange={setBannerUrl}
        folder="fables/banners"
        placeholder="https://example.com/banner.png"
      />

      {/* Avatar Upload */}
      <ImageUploader
        label="Profile Picture"
        value={avatarUrl}
        onChange={setAvatarUrl}
        folder="fables/avatars"
        placeholder="https://example.com/avatar.png"
      />

      <div className={styles.formGroup}>
        <label htmlFor="bio" className={styles.label}>Bio</label>
        <textarea 
          id="bio" 
          name="bio" 
          className={styles.textarea} 
          defaultValue={user?.bio || ''}
          placeholder="Tell everyone a little bit about yourself..."
          maxLength={2000}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>Location</label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            className={styles.input} 
            defaultValue={user?.location || ''}
            placeholder="City, Country"
            maxLength={100}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="website" className={styles.label}>Website</label>
          <input 
            type="url" 
            id="website" 
            name="website" 
            className={styles.input} 
            defaultValue={user?.website || ''}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="gender" className={styles.label}>Gender</label>
          <select 
            id="gender" 
            name="gender" 
            className={styles.select}
            defaultValue={user?.gender || 'Prefer not to say'}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="birthDate" className={styles.label}>Birthday</label>
          <input 
            type="date" 
            id="birthDate" 
            name="birthDate" 
            className={styles.input} 
            defaultValue={formattedDate}
          />
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
