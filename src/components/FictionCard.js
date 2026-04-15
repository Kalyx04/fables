import Link from 'next/link';
import styles from './FictionCard.module.css';

const STATUS_LABELS = {
  ongoing: 'Ongoing',
  completed: 'Completed',
  hiatus: 'Hiatus',
  draft: 'Draft',
};

const STATUS_COLORS = {
  ongoing: '#4ade80',
  completed: '#60a5fa',
  hiatus: '#f59e0b',
  draft: '#9ca3af',
};

export default function FictionCard({ fiction }) {
  const lastUpdated = new Date(fiction.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={styles.card}>
      {/* Cover Image */}
      <div className={styles.cover}>
        {fiction.coverUrl ? (
          <img src={fiction.coverUrl} alt={`${fiction.title} cover`} className={styles.coverImg} />
        ) : (
          <div className={styles.coverPlaceholder}>
            <span>{fiction.title.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.top}>
          <div
            className={styles.statusBadge}
            style={{ color: STATUS_COLORS[fiction.status] }}
          >
            {STATUS_LABELS[fiction.status]}
          </div>
          <h3 className={styles.title}>{fiction.title}</h3>
          {fiction.synopsis && (
            <p className={styles.synopsis}>{fiction.synopsis}</p>
          )}
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <strong>{fiction.chapterCount}</strong> Chapters
          </span>
          <span className={styles.metaDot}>·</span>
          <span className={styles.metaItem}>Updated {lastUpdated}</span>
        </div>

        <div className={styles.actions}>
          <Link
            href={`/write/${fiction._id}/chapter/new`}
            className={styles.primaryBtn}
          >
            + New Chapter
          </Link>
          <Link
            href={`/novel/${fiction._id}`}
            className={styles.secondaryBtn}
          >
            View Story
          </Link>
        </div>
      </div>
    </div>
  );
}
