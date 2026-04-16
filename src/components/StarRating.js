'use client';

import { useState } from 'react';
import styles from './StarRating.module.css';

export default function StarRating({ rating, setRating, readOnly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={styles.starBtn}
          onClick={() => !readOnly && setRating(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          disabled={readOnly}
        >
          <span className={(hover || rating) >= star ? styles.filled : styles.empty}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
