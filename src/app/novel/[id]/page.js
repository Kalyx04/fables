import styles from "./novel.module.css";
import Link from 'next/link';

export default async function NovelPage({ params }) {
  // Await the params properly for Next.js App Router dynamic routes
  const { id } = await params;
  
  // Dummy data based on standard web novel structure
  const novel = {
    id: id,
    title: "The Shadow's Heir",
    author: "A. Void",
    genre: "Fantasy",
    rating: "4.8",
    status: "Ongoing",
    chaptersCount: 124,
    views: "2.1M",
    synopsis: "In a world where light is a luxury, the shadows hold power. Born without a single trace of incandescence, Kael was cast out by the radiant lords. Little do they know, the absence of light is not weakness—it is the domain of the Ancients. As the Sun-King's forces spread their blinding tyranny, Kael must harness the void to protect what little remains of the dusk.",
    chapters: Array.from({ length: 15 }, (_, i) => ({
      num: i + 1,
      title: `The Awakening Part ${i + 1}`,
      date: `Oct ${20 - i}, 2026`
    })).reverse() // Simple dummy chapters
  };

  return (
    <div className={styles.page}>
      {/* Novel Header Info */}
      <section className={styles.headerSection}>
        <div className={`container ${styles.headerLayout}`}>
          <div className={styles.coverHolder}>
            <div className={styles.coverPlaceholder}>
              <span>{novel.title.charAt(0)}</span>
            </div>
          </div>
          
          <div className={styles.infoCol}>
            <div className={styles.titleArea}>
              <h1 className={styles.title}>{novel.title}</h1>
              <p className={styles.author}>by <span className={styles.authorName}>{novel.author}</span></p>
            </div>
            
            <div className={styles.metaRow}>
              <div className={styles.metaBadge}>{novel.genre}</div>
              <div className={styles.metaItem}><strong>★ {novel.rating}</strong> Rating</div>
              <div className={styles.metaItem}><strong>{novel.views}</strong> Views</div>
              <div className={styles.metaItem}><strong>{novel.status}</strong></div>
            </div>

            <div className={styles.synopsisArea}>
              <h3>Synopsis</h3>
              <p className={styles.synopsis}>{novel.synopsis}</p>
            </div>
            
            <div className={styles.actions}>
              <Link href={`/read/${novel.id}/1`} className={styles.primaryBtn}>Read First Chapter</Link>
              <button className={styles.secondaryBtn}>Bookmark</button>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Table of Contents */}
      <section className={styles.tocSection}>
        <div className={`container`}>
          <div className={styles.tocHeader}>
            <h2>Table of Contents</h2>
            <span className={styles.chapterCount}>{novel.chaptersCount} Chapters</span>
          </div>
          
          <div className={styles.chapterList}>
            {novel.chapters.map((ch) => (
              <Link href={`/read/${novel.id}/${ch.num}`} key={ch.num} className={styles.chapterRow}>
                <div className={styles.chapLeft}>
                  <span className={styles.chapNum}>Chapter {ch.num}</span>
                  <span className={styles.chapTitle}>{ch.title}</span>
                </div>
                <div className={styles.chapRight}>
                  <span className={styles.chapDate}>{ch.date}</span>
                </div>
              </Link>
            ))}
            
            <div className={styles.loadMore}>
              <button className={styles.outlineBtn}>Load more chapters</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
