import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brand}>
          <h2 className={styles.logo}>Fables.</h2>
          <p className={styles.tagline}>Where stories come alive.</p>
        </div>
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h3>Platform</h3>
            <Link href="/browse">Browse</Link>
            <Link href="/write">Write</Link>
            <Link href="/about">About Us</Link>
          </div>
          <div className={styles.linkGroup}>
            <h3>Legal</h3>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Fables.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
