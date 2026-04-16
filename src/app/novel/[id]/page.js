import styles from "./novel.module.css";
import Link from 'next/link';
import { getPublicFiction } from '@/lib/actions/fictionActions';
import { getChapters } from '@/lib/actions/chapterActions';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import { getFavoriteStatus } from '@/lib/actions/favoriteActions';
import StarRating from '@/components/StarRating';
import FictionReviewForm from '@/components/FictionReviewForm';
import ReviewSection from '@/components/ReviewSection';

export default async function NovelPage({ params }) {
  const { id } = await params;
  
  // 1. Fetch current session to check for authorship
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  const session = token ? await verifyToken(token) : null;

  // 2. Fetch fiction and chapters in parallel
  const [fictionRes, chaptersRes, favoriteRes] = await Promise.all([
    getPublicFiction(id),
    getChapters(id, false), // Default to reader chapters (published only)
    getFavoriteStatus(id)
  ]);

  if (fictionRes.error || !fictionRes.fiction) {
    return notFound();
  }

  const fiction = fictionRes.fiction;
  const isAuthor = session && session.id === fiction.authorId._id;
  
  // 3. If author, fetch all chapters including drafts
  let chapters = chaptersRes.chapters || [];
  if (isAuthor) {
    const authorChaptersRes = await getChapters(id, true);
    chapters = authorChaptersRes.chapters || [];
  }

  const formatDate = (date) => {
    if (!date) return '---';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className={styles.page}>
      {/* Novel Header Info */}
      <section className={styles.headerSection}>
        <div className={`container ${styles.headerLayout}`}>
          <div className={styles.coverHolder}>
            <div className={styles.coverPlaceholder}>
              {fiction.coverUrl ? (
                <img src={fiction.coverUrl} alt={fiction.title} />
              ) : (
                <span>{fiction.title.charAt(0)}</span>
              )}
            </div>
          </div>
          
          <div className={styles.infoCol}>
            <div className={styles.titleArea}>
              <h1 className={styles.title}>{fiction.title}</h1>
              <p className={styles.author}>by <span className={styles.authorName}>{fiction.authorId.username}</span></p>
            </div>
            
            <div className={styles.metaRow}>
              {fiction.genres?.map(genre => (
                <div key={genre} className={styles.metaBadge}>{genre}</div>
              ))}
              <div className={styles.metaItem}>
                <strong>
                  <StarRating rating={Math.round(fiction.stats?.rating || 0)} readOnly />
                </strong> 
                {fiction.stats?.rating || '0.0'} ({fiction.stats?.ratingCount || 0} reviews)
              </div>
              <div className={styles.metaItem}><strong>{fiction.stats?.views?.toLocaleString() || '0'}</strong> Views</div>
              <div className={styles.metaItem}><strong style={{ textTransform: 'capitalize' }}>{fiction.status}</strong></div>
            </div>

            <div className={styles.synopsisArea}>
              <h3>Synopsis</h3>
              <p className={styles.synopsis}>{fiction.synopsis || "No synopsis available."}</p>
            </div>
            
            <div className={styles.actions}>
              {chapters.length > 0 && chapters.some(c => c.publishedContent) ? (
                <Link href={`/read/${fiction._id}/${chapters.find(c => c.publishedContent).order}`} className={styles.primaryBtn}>
                  Read First Chapter
                </Link>
              ) : (
                <button className={styles.primaryBtn} disabled>COMING SOON</button>
              )}
              {isAuthor && (
                <Link href={`/write/${fiction._id}/chapter/new`} className={styles.secondaryBtn}>
                  Add Chapter
                </Link>
              )}
              {!isAuthor && session && (
                <FavoriteButton fictionId={fiction._id} initialFavorited={favoriteRes.favorited} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Table of Contents */}
      <section className={styles.tocSection}>
        <div className={`container`}>
          <div className={styles.tocHeader}>
            <h2>Table of Contents</h2>
            <span className={styles.chapterCount}>{fiction.chapterCount} Chapters</span>
          </div>
          
          <div className={styles.chapterList}>
            {chapters.length > 0 ? (
              chapters.map((ch) => {
                const isPublished = !!ch.publishedContent;
                const isModified = isPublished && JSON.stringify(ch.content) !== JSON.stringify(ch.publishedContent);
                
                return (
                  <div key={ch._id} className={styles.chapterRow}>
                    <div className={styles.chapLeft}>
                      <span className={styles.chapNum}>CH {ch.order}</span>
                      {isPublished ? (
                        <Link href={`/read/${fiction._id}/${ch.order}`} className={styles.chapTitle}>
                          {ch.publishedTitle || ch.title}
                        </Link>
                      ) : (
                        <span className={styles.chapTitle} style={{ color: 'var(--text-secondary)' }}>
                          {ch.title} (Draft)
                        </span>
                      )}
                      
                      {isAuthor && (
                        <>
                          {!isPublished && <span className={`${styles.statusBadge} ${styles.statusDraft}`}>Draft</span>}
                          {isPublished && !isModified && <span className={`${styles.statusBadge} ${styles.statusPublished}`}>Published</span>}
                          {isModified && <span className={`${styles.statusBadge} ${styles.statusModified}`}>Modified</span>}
                        </>
                      )}
                    </div>
                    
                    <div className={styles.chapRight} style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                      <span className={styles.chapDate}>{formatDate(ch.lastPublishedAt || ch.updatedAt)}</span>
                      {isAuthor && (
                        <Link href={`/write/${fiction._id}/chapter/${ch._id}`} className={styles.editLink}>
                          Edit
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <h3>Coming Soon</h3>
                <p>The author hasn't shared any chapters yet. Stay tuned!</p>
              </div>
            )}
            
            {chapters.length > 20 && (
              <div className={styles.loadMore}>
                <button className={styles.outlineBtn}>Load more chapters</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={styles.reviewsSection}>
        <div className="container">
          <FictionReviewForm fictionId={id} />
          <ReviewSection fictionId={id} type="fiction" currentUser={session} />
        </div>
      </section>
    </div>
  );
}

