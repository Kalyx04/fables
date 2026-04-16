import styles from "./browse.module.css";
import Link from "next/link";
import { getFictions } from "@/lib/actions/fictionActions";

export default async function Browse({ searchParams }) {
  const queryParams = await searchParams;

  // Normalize parameters to strings (Next.js 15 can provide arrays)
  const searchQuery = Array.isArray(queryParams.q) ? queryParams.q[0] : (queryParams.q || "");
  const currentGenre = Array.isArray(queryParams.genre) ? queryParams.genre[0] : (queryParams.genre || "All");

  const categories = ["All", "Action", "Fantasy", "Sci-Fi", "Romance", "Mystery", "Horror", "Adventure"];

  const { fictions, error } = await getFictions({
    genre: currentGenre,
    q: searchQuery
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Directory</h1>
          <p className={styles.subtitle}>Explore our extensive collection of fables.</p>

          <form action="/browse" method="GET" className={styles.searchBar}>
            {currentGenre !== 'All' && <input type="hidden" name="genre" value={currentGenre} />}
            <input
              type="text"
              name="q"
              placeholder="Search by title or synopsis..."
              className={styles.searchInput}
              defaultValue={searchQuery}
            />
            <button type="submit" className={styles.searchIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>
      </header>


      <div className={`container ${styles.layout}`}>
        {/* Filters Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h3>Genres</h3>
            <ul className={styles.filterList}>
              {categories.map((cat) => {
                const isActive = currentGenre === cat;
                return (
                  <li key={cat}>
                    <Link
                      href={{
                        pathname: '/browse',
                        query: {
                          ...(cat !== 'All' ? { genre: cat } : {}),
                          ...(searchQuery ? { q: searchQuery } : {})
                        }
                      }}
                      className={isActive ? styles.activeFilter : styles.filterBtn}
                    >
                      {cat}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <main className={styles.mainContent}>
          {fictions && fictions.length > 0 ? (
            <div className={styles.grid}>
              {fictions.map((novel) => (
                <Link href={`/novel/${novel._id}`} key={novel._id} className={styles.card}>
                  <div className={styles.cardImageHolder}>
                    {novel.coverUrl ? (
                      <img src={novel.coverUrl} alt={novel.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      <span>{novel.title.charAt(0)}</span>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{novel.title}</h3>
                      <span className={styles.rating}>★ {novel.stats?.rating || '0.0'}</span>
                    </div>
                    <p className={styles.cardAuthor}>by {novel.authorId?.username || 'Anonymous'}</p>

                    <div className={styles.cardDetails}>
                      {novel.genres?.[0] && <span className={styles.badge}>{novel.genres[0]}</span>}
                      <span className={styles.infoText}>{novel.chapterCount || 0} Chapters</span>
                      <span className={styles.infoText} style={{ textTransform: 'capitalize' }}>{novel.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2>No fables found</h2>
              <p>
                We couldn't find any fables matching
                {searchQuery && <strong> "{searchQuery}"</strong>}
                {searchQuery && currentGenre !== 'All' && ' in '}
                {currentGenre !== 'All' && <strong>{currentGenre}</strong>}
                {!searchQuery && currentGenre === 'All' && ' your search'}
                .
              </p>
              <Link href="/browse" className={styles.clearBtn}>
                Clear all filters
              </Link>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

