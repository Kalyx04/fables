import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  const dummyNovels = [
    { id: 1, title: "The Shadow's Heir", author: "A. Void", genre: "Fantasy", rating: "4.8" },
    { id: 2, title: "Neon Gods", author: "X. Cyber", genre: "Sci-Fi", rating: "4.9" },
    { id: 3, title: "A Dance with Time", author: "C. Chronos", genre: "Romance", rating: "4.6" },
    { id: 4, title: "Silent Echoes", author: "M. Whisper", genre: "Mystery", rating: "4.7" },
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={styles.heroTitle}>
            Discover worlds beyond imagination.
          </h1>
          <p className={styles.heroSubtitle}>
            Fables is the premier platform to read incredible web novels and write your own epic sagas. Join thousands of readers and authors today.
          </p>
          <div className={styles.heroActions}>
            <Link href="/browse" className={styles.primaryBtn}>Start Reading</Link>
            <Link href="/write" className={styles.secondaryBtn}>Start Writing</Link>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className={styles.section}>
        <div className={`container`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Trending Fables</h2>
            <Link href="/browse" className={styles.viewAll}>View all &rarr;</Link>
          </div>
          
          <div className={styles.grid}>
            {dummyNovels.map((novel) => (
              <Link href={`/novel/${novel.id}`} key={novel.id} className={styles.card}>
                <div className={styles.cardImageHolder}>
                  <div className={styles.cardPlaceholder}>
                    <span>{novel.title.charAt(0)}</span>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{novel.title}</h3>
                  <p className={styles.cardAuthor}>by {novel.author}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.badge}>{novel.genre}</span>
                    <span className={styles.rating}>★ {novel.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className={`${styles.section} ${styles.darkBg}`}>
        <div className={`container ${styles.featureContainer}`}>
          <div className={styles.featureText}>
            <h2>Crafted for Storytellers.</h2>
            <p>Our minimalist reading interface removes distractions so you can get lost in the story. Our powerful writing tools make drafting your next chapter a breeze.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
