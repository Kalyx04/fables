import { getUserProfile } from '@/lib/actions/profileActions';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import ProfileClient from './ProfileClient';

export default async function ProfilePage({ params }) {
  const { username } = await params;

  // Fetch the public profile
  const { user, error } = await getUserProfile(username);

  // console.log(user);

  if (error || !user) {
    notFound();
  }

  // Check if current user owns this profile
  let isOwner = false;
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  
  if (token) {
    const session = await verifyToken(token);
    if (session && session.username === user.username) {
      isOwner = true;
    }
  }

  // Format Dates
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  const birthDate = user.birthDate 
    ? new Date(user.birthDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Not specified';

  return (
    <div className={styles.container}>
      {/* Banner */}
      <div className={styles.bannerContainer}>
        {user.bannerUrl ? (
          <img src={user.bannerUrl} alt={`${user.username}'s banner`} className={styles.bannerImage} />
        ) : (
          <div className={styles.bannerPlaceholder} />
        )}

        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={`${user.username}'s avatar`} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className={styles.headerInfo}>
            <h1 className={styles.username}>{user.username}</h1>
            <p className={styles.joinDate}>Joined {joinDate}</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className={styles.mainLayout}>
        
        {/* Sidebar Details */}
        <aside className={styles.sidebar}>
          <div className={styles.glassCard}>
            <h2 className={styles.sectionTitle}>About</h2>
            {user.bio ? (
              <p className={styles.bioText}>{user.bio}</p>
            ) : (
              <p className={styles.bioText} style={{ color: '#888', fontStyle: 'italic' }}>
                This user hasn't written a bio yet.
              </p>
            )}

            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>{user.location || 'Unknown'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Gender</span>
                <span className={styles.detailValue}>{user.gender || 'Not specified'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Birthday</span>
                <span className={styles.detailValue}>{birthDate}</span>
              </div>
              {user.website && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Website</span>
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className={styles.detailValue} style={{textDecoration: 'underline'}}>
                    Link
                  </a>
                </div>
              )}
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>{user.stats?.fictions || 0}</div>
                <div className={styles.statLabel}>Fictions</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>{user.stats?.reviews || 0}</div>
                <div className={styles.statLabel}>Reviews</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>{user.stats?.comments || 0}</div>
                <div className={styles.statLabel}>Comments</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>{user.stats?.reputation || 0}</div>
                <div className={styles.statLabel}>Reputation</div>
              </div>
            </div>

            {isOwner && (
              <Link href="/settings/profile" className={styles.editButton}>
                Edit Profile
              </Link>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <ProfileClient 
          userId={user._id} 
          username={user.username} 
          isOwner={isOwner} 
        />
      </div>
    </div>
  );
}
