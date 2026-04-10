import styles from "./browse.module.css";
import Link from "next/link";

export default function Browse() {
  const categories = ["All", "Action", "Fantasy", "Sci-Fi", "Romance", "Mystery"];
  
  const dummyNovels = [
    { id: 1, title: "The Shadow's Heir", author: "A. Void", genre: "Fantasy", rating: "4.8", status: "Ongoing", chapters: 124 },
    { id: 2, title: "Neon Gods", author: "X. Cyber", genre: "Sci-Fi", rating: "4.9", status: "Completed", chapters: 302 },
    { id: 3, title: "A Dance with Time", author: "C. Chronos", genre: "Romance", rating: "4.6", status: "Ongoing", chapters: 45 },
    { id: 4, title: "Silent Echoes", author: "M. Whisper", genre: "Mystery", rating: "4.7", status: "Ongoing", chapters: 89 },
    { id: 5, title: "Sword of the Ancients", author: "R. Blade", genre: "Action", rating: "4.5", status: "Completed", chapters: 420 },
    { id: 6, title: "Crystal Skies", author: "E. Cloud", genre: "Fantasy", rating: "4.8", status: "Ongoing", chapters: 56 },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Directory</h1>
          <p className={styles.subtitle}>Explore our extensive collection of fables.</p>
        </div>
      </header>

      <div className={`container ${styles.layout}`}>
        {/* Filters Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h3>Genres</h3>
            <ul className={styles.filterList}>
              {categories.map((cat) => (
                <li key={cat}>
                  <button className={cat === 'All' ? styles.activeFilter : styles.filterBtn}>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <main className={styles.mainContent}>
          <div className={styles.grid}>
            {dummyNovels.map((novel) => (
              <Link href={`/novel/${novel.id}`} key={novel.id} className={styles.card}>
                <div className={styles.cardImageHolder}>
                  <span>{novel.title.charAt(0)}</span>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{novel.title}</h3>
                    <span className={styles.rating}>★ {novel.rating}</span>
                  </div>
                  <p className={styles.cardAuthor}>by {novel.author}</p>
                  
                  <div className={styles.cardDetails}>
                    <span className={styles.badge}>{novel.genre}</span>
                    <span className={styles.infoText}>{novel.chapters} Chapters</span>
                    <span className={styles.infoText}>{novel.status}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
