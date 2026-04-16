'use client';

import { useState, useTransition } from 'react';
import { addReview } from '@/lib/actions/reviewActions';
import StarRating from './StarRating';
import styles from './FictionReviewForm.module.css';

export default function FictionReviewForm({ fictionId, initialReview }) {
  const [title, setTitle] = useState(initialReview?.title || '');
  const [content, setContent] = useState(initialReview?.content || '');
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || rating === 0 || !title.trim()) {
      alert("Please provide a title, rating, and content.");
      return;
    }

    startTransition(async () => {
      const res = await addReview({
        fictionId,
        type: 'fiction',
        title: title.trim(),
        content: content.trim(),
        rating
      });

      if (res.error) {
        setMsg('Error: ' + res.error);
      } else {
        setMsg('Review posted/updated!');
        setTimeout(() => setMsg(''), 3000);
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.topRow}>
          <input 
            type="text"
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review Title..."
            disabled={isPending}
          />
          <StarRating rating={rating} setRating={setRating} />
        </div>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you like or dislike about this book?"
          className={styles.textarea}
          disabled={isPending}
        />
        
        <div className={styles.footer}>
          {msg && <span className={styles.msg}>{msg}</span>}
          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? 'Saving...' : 'Post Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
