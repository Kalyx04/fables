'use client';

import { useState, useTransition, useEffect } from 'react';
import styles from './ProfileClient.module.css';
import Link from 'next/link';
import { getPublicUserFictions } from '@/lib/actions/fictionActions';
import { getPublicUserReviews } from '@/lib/actions/reviewActions';
import { getUserFavorites } from '@/lib/actions/favoriteActions';

export default function ProfileClient({ userId, username, isOwner }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ fictions: [], reviews: [], favorites: [] });
  const [loadedTabs, setLoadedTabs] = useState({ overview: true, fictions: false, reviews: false, favorites: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTabData() {
      if (loadedTabs[activeTab]) return;
      
      setLoading(true);
      try {
        if (activeTab === 'fictions') {
          const res = await getPublicUserFictions(userId);
          setData(prev => ({ ...prev, fictions: res.fictions || [] }));
        } else if (activeTab === 'reviews') {
          const res = await getPublicUserReviews(userId);
          setData(prev => ({ ...prev, reviews: res.reviews || [] }));
        } else if (activeTab === 'favorites') {
          const res = await getUserFavorites(userId);
          setData(prev => ({ ...prev, favorites: res.favorites || [] }));
        }
        setLoadedTabs(prev => ({ ...prev, [activeTab]: true }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTabData();
  }, [activeTab, userId, loadedTabs]);

  const renderFictions = (list) => (
    <div className={styles.grid}>
      {list.length > 0 ? list.map(f => (
        <Link href={`/novel/${f._id}`} key={f._id} className={styles.fictionCard}>
          <div className={styles.cardCover}>
            {f.coverUrl ? <img src={f.coverUrl} alt={f.title} /> : <div className={styles.placeholder}>{f.title[0]}</div>}
          </div>
          <div className={styles.cardInfo}>
            <h4>{f.title}</h4>
            <p>{f.status}</p>
          </div>
        </Link>
      )) : (
        <div className={styles.emptyState}>No fictions found.</div>
      )}
    </div>
  );

  return (
    <div className={styles.mainContent}>
      <div className={styles.tabs}>
        {['overview', 'fictions', 'reviews', 'favorites'].map(tab => (
          <button 
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.glassCard}>
            {activeTab === 'overview' && (
              <div className={styles.emptyState}>
                <h3>Overview</h3>
                <p>Recent activity will appear here.</p>
              </div>
            )}
            {activeTab === 'fictions' && renderFictions(data.fictions)}
            {activeTab === 'favorites' && renderFictions(data.favorites)}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsList}>
                {data.reviews.length > 0 ? data.reviews.map(r => (
                  <div key={r._id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <strong>{r.title || 'Untitled Review'}</strong>
                      <span className={styles.rating}>★ {r.rating || '?'}</span>
                    </div>
                    <p className={styles.reviewContent}>{r.content}</p>
                    <Link href={`/novel/${r.fictionId}`} className={styles.reviewLink}>View Novel</Link>
                  </div>
                )) : (
                  <div className={styles.emptyState}>No reviews written yet.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
