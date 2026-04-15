import { getUserFictions } from '@/lib/actions/fictionActions';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import FictionCard from '@/components/FictionCard';
import styles from './write.module.css';

export const metadata = {
  title: 'Write | Fables',
  description: 'Manage your fictions and write new chapters on Fables.',
};

export default async function WriteDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  if (!token) redirect('/login');

  const session = await verifyToken(token);
  if (!session) redirect('/login');

  const { fictions, error } = await getUserFictions();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Writer's Desk</h1>
          <p className={styles.subtitle}>
            {fictions?.length
              ? `You have ${fictions.length} active fiction${fictions.length !== 1 ? 's' : ''}.`
              : 'Start your first story today.'}
          </p>
        </div>
        <Link href="/write/new" className={styles.newBtn}>
          + Create New Fiction
        </Link>
      </div>

      {/* Fictions List */}
      {error ? (
        <div className={styles.errorState}>{error}</div>
      ) : fictions?.length ? (
        <div className={styles.fictionsList}>
          {fictions.map((fiction) => (
            <FictionCard key={fiction._id} fiction={fiction} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✦</div>
          <h2 className={styles.emptyTitle}>Your story begins here</h2>
          <p className={styles.emptyText}>
            Every great fiction starts with a single idea. Create your first fiction and bring your world to life.
          </p>
          <Link href="/write/new" className={styles.newBtn}>
            Create My First Fiction
          </Link>
        </div>
      )}
    </div>
  );
}
