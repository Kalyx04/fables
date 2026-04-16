'use client';

import { useState, useTransition } from 'react';
import { addReview } from '@/lib/actions/reviewActions';
import styles from './ChapterReviewForm.module.css';

export default function ChapterReviewForm({ fictionId, chapterId }) {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await addReview({
        fictionId,
        chapterId,
        type: 'chapter',
        content: content.trim()
      });

      if (res.error) {
        setMsg('Error: ' + res.error);
      } else {
        setMsg('Review posted!');
        setContent('');
        setTimeout(() => setMsg(''), 3000);
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you think of this chapter?"
          className={styles.textarea}
          disabled={isPending}
        />
        <div className={styles.footer}>
          {msg && <span className={styles.msg}>{msg}</span>}
          <button type="submit" className={styles.submitBtn} disabled={isPending || !content.trim()}>
            {isPending ? 'Posting...' : 'Post Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
