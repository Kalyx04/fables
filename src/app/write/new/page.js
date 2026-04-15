'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createFiction } from '@/lib/actions/fictionActions';
import ImageUploader from '@/app/settings/profile/ImageUploader';
import styles from './new.module.css';

const GENRES = [
  'Fantasy', 'Sci-Fi', 'Romance', 'Horror', 'Mystery',
  'Thriller', 'Cultivation', 'Isekai', 'LitRPG', 'Historical',
  'Slice of Life', 'Action', 'Adventure', 'Comedy',
];

export default function NewFictionPage() {
  const router = useRouter();
  const [coverUrl, setCoverUrl] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [status, setStatus] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setStatus(null);

    const formData = new FormData(e.target);
    formData.set('coverUrl', coverUrl);
    selectedGenres.forEach((g) => formData.append('genres', g));

    const result = await createFiction(formData);

    if (result?.error) {
      setStatus({ type: 'error', message: result.error });
      setIsPending(false);
    } else {
      // Redirect immediately to the new chapter editor
      router.push(`/write/${result.fictionId}/chapter/new`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>← Back</button>
        <h1 className={styles.title}>Create New Fiction</h1>
        <p className={styles.subtitle}>Set up your story's identity before you start writing.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {status && (
          <div className={`${styles.message} ${styles.error}`}>{status.message}</div>
        )}

        <div className={styles.layout}>
          {/* Cover Upload — left column */}
          <div className={styles.coverColumn}>
            <ImageUploader
              label="Cover Image"
              value={coverUrl}
              onChange={setCoverUrl}
              folder="fables/covers"
              placeholder="https://example.com/cover.jpg"
            />
            {!coverUrl && (
              <div className={styles.coverPlaceholder}>
                <span>No Cover Yet</span>
              </div>
            )}
          </div>

          {/* Details — right column */}
          <div className={styles.detailsColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Title <span className={styles.required}>*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                className={styles.input}
                placeholder="The name of your story"
                maxLength={200}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="synopsis" className={styles.label}>Synopsis</label>
              <textarea
                id="synopsis"
                name="synopsis"
                className={styles.textarea}
                placeholder="A brief description of your story — entice your readers!"
                maxLength={5000}
                rows={5}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Genres</label>
              <div className={styles.genreGrid}>
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`${styles.genrePill} ${selectedGenres.includes(genre) ? styles.selected : ''}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tags" className={styles.label}>Tags <span className={styles.hint}>(comma-separated, max 10)</span></label>
              <input
                type="text"
                id="tags"
                name="tags"
                className={styles.input}
                placeholder="magic, dragons, adventure, slow-burn..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status" className={styles.label}>Status</label>
              <select id="status" name="status" className={styles.select}>
                <option value="ongoing">Ongoing</option>
                <option value="draft">Draft (Private)</option>
                <option value="hiatus">Hiatus</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Fiction & Start Writing →'}
          </button>
        </div>
      </form>
    </div>
  );
}
