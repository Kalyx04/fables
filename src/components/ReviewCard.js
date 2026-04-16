'use client';

import { useState, useTransition } from 'react';
import styles from './ReviewCard.module.css';
import StarRating from './StarRating';
import { addReply, getReplies } from '@/lib/actions/reviewActions';

export default function ReviewCard({ review, currentUser }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState(review.replies || []);
  const [isPending, startTransition] = useTransition();

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    startTransition(async () => {
      const res = await addReply({ reviewId: review._id, content: replyContent.trim() });
      if (!res.error) {
        setReplyContent('');
        setShowReplyForm(false);
        // Refresh replies
        const updated = await getReplies(review._id);
        if (updated.replies) setReplies(updated.replies);
      }
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.profileCol}>
        {review.userId.avatarUrl ? (
          <img src={review.userId.avatarUrl} alt={review.userId.username} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{review.userId.username[0]}</div>
        )}
      </div>

      <div className={styles.contentCol}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <span className={styles.username}>{review.userId.username}</span>
            <span className={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          {review.rating && <StarRating rating={review.rating} readOnly />}
        </div>

        {review.title && <h4 className={styles.title}>{review.title}</h4>}
        <p className={styles.text}>{review.content}</p>

        <div className={styles.actions}>
          <button 
            className={styles.replyBtn} 
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Reply
          </button>
        </div>

        {showReplyForm && (
          <form className={styles.replyForm} onSubmit={handleReplySubmit}>
            <textarea 
              placeholder="Write a reply..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              disabled={isPending}
            />
            <button type="submit" disabled={isPending}>
              {isPending ? 'Posting...' : 'Post Reply'}
            </button>
          </form>
        )}

        {replies.length > 0 && (
          <div className={styles.repliesList}>
            {replies.map(reply => (
              <div key={reply._id} className={styles.replyItem}>
                <span className={styles.replyUser}>{reply.userId.username}</span>
                <p>{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
