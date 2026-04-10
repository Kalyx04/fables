import Link from 'next/link';
import styles from './Navbar.module.css';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logoutAction } from '@/lib/actions/authActions';

export default async function Navbar() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('fables_session')?.value;
  let user = null;

  if (sessionToken) {
    user = await verifyToken(sessionToken);
  }

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          Fables.
        </Link>
        <div className={styles.links}>
          <Link href="/browse" className={styles.navLink}>Browse</Link>
          <Link href="/write" className={styles.navLink}>Write</Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/profile" className={styles.navLink}>{user.username}</Link>
              <form action={logoutAction}>
                <button type="submit" className={styles.navLinkBtn}>Logout</button>
              </form>
            </div>
          ) : (
            <Link href="/login" className={styles.navLinkBtn}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
