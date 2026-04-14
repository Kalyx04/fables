import { getUserProfile } from '@/lib/actions/profileActions';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SettingsForm from './SettingsForm';
import styles from './settings.module.css';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const session = await verifyToken(token);
  if (!session) {
    redirect('/login');
  }

  const { user, error } = await getUserProfile(session.username);

  if (error || !user) {
    redirect('/');
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Profile</h1>
      <SettingsForm user={user} />
    </div>
  );
}
