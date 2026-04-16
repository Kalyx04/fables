'use client';

import { useState, useEffect } from 'react';
import { getReviews, getReplies } from '@/lib/actions/reviewActions';
import ReviewCard from './ReviewCard';
import styles from './ReviewSection.module.css';

export default function ReviewSection({ fictionId, chapterId, type = 'fiction', currentUser }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      const query = { fictionId, type };
      if (chapterId) query.chapterId = chapterId;
      else query.chapterId = { $exists: false };

      const res = await getReviews(query);
      if (res.reviews) {
        // Fetch replies for each review
        const reviewsWithReplies = await Promise.all(res.reviews.map(async (rev) => {
          const replyRes = await getReplies(rev._id);
          return { ...rev, replies: replyRes.replies || [] };
        }));
        setReviews(reviewsWithReplies);
      }
      setLoading(false);
    }
    loadReviews();
  }, [fictionId, chapterId, type]);

  if (loading) return <div className={styles.loading}>Loading reviews...</div>;

  return (
    <div className={styles.section}>
      <h3 className={styles.count}>{reviews.length} {type === 'chapter' ? 'Chapter Comments' : 'Reviews'}</h3>
      <div className={styles.list}>
        {reviews.length > 0 ? (
          reviews.map(rev => (
            <ReviewCard key={rev._id} review={rev} currentUser={currentUser} />
          ))
        ) : (
          <div className={styles.empty}>Be the first to share your thoughts!</div>
        )}
      </div>
    </div>
  );
}
