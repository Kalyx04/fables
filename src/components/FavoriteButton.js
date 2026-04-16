'use client';

import { useState, useTransition } from 'react';
import { toggleFavorite } from '@/lib/actions/favoriteActions';
import styles from './FavoriteButton.module.css';

export default function FavoriteButton({ fictionId, initialFavorited }) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleFavorite(fictionId);
      if (result.error) {
        alert(result.error);
        return;
      }
      setIsFavorited(result.favorited);
    });
  };

  return (
    <button 
      onClick={handleToggle} 
      className={`${styles.favBtn} ${isFavorited ? styles.active : ''}`}
      disabled={isPending}
      title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill={isFavorited ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      {isFavorited ? "Favorited" : "Favorite"}
    </button>
  );
}
