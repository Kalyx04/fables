import styles from "./read.module.css";
import Link from 'next/link';

export default async function ReadPage({ params }) {
  const { id, chapter } = await params;
  
  // Dummy content
  const novelTitle = "The Shadow's Heir";
  const chapterNumber = parseInt(chapter);
  
  // Generate some dummy paragraphs for reading
  const generateText = () => {
    return Array(10).fill(0).map((_, i) => (
      <p key={i}>
        The silence in the grand hall was absolute, save for the rhythmic dripping of water from a cracked gargoyle high above. Kael stood at the precipice of the sunken throne, his breath pluming in the frigid air. For seventeen years, the Sun-King had forbidden any entrance to the deep vaults. They said the darkness here was alive. They said it hungered. But as Kael raised his hand, the shadows didn't attack; they curled around his fingers like eager hounds greeting a long-lost master. He felt a thrumming resonance in his chest, a stark contrast to the hollow emptiness he had carried since birth. The void wasn't an absence. It was a presence. And it was angry.
      </p>
    ));
  };

  return (
    <div className={styles.page}>
      
      {/* Top Reading Navigation */}
      <div className={styles.readNav}>
        <div className={`container ${styles.navContainer}`}>
          <Link href={`/novel/${id}`} className={styles.backLink}>
            &larr; Back to Novel
          </Link>
          <div className={styles.novelTitle}>{novelTitle}</div>
          <div className={styles.settingsBtn}>Settings (Aa)</div>
        </div>
      </div>

      {/* Reading Content */}
      <article className={styles.article}>
        <header className={styles.chapterHeader}>
          <h1>Chapter {chapterNumber}: The Awakening</h1>
        </header>

        <div className={styles.content}>
          {generateText()}
        </div>
      </article>

      {/* Bottom Navigation */}
      <div className={styles.bottomNav}>
        <div className={`container ${styles.bottomNavContainer}`}>
          {chapterNumber > 1 ? (
            <Link href={`/read/${id}/${chapterNumber - 1}`} className={styles.navBtn}>
              &larr; Previous
            </Link>
          ) : (
            <div className={styles.navBtnDisabled}>&larr; Previous</div>
          )}
          
          <Link href={`/novel/${id}`} className={styles.tocBtn}>
            Table of Contents
          </Link>

          <Link href={`/read/${id}/${chapterNumber + 1}`} className={styles.navBtn}>
            Next &rarr;
          </Link>
        </div>
      </div>

    </div>
  );
}
