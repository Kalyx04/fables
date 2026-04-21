import styles from "./read.module.css";
import Link from 'next/link';
import { getChapterForRead } from '@/lib/actions/chapterActions';
import ChapterContent from '@/components/ChapterContent';
import { notFound } from 'next/navigation';
import ReaderUI from '@/components/ReaderUI';
import ChapterReviewForm from '@/components/ChapterReviewForm';
import ReviewSection from '@/components/ReviewSection';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { ReaderProvider } from '@/components/ReaderProvider';
import ReaderSettingsToggle from '@/components/ReaderSettingsToggle';

export default async function ReadPage({ params }) {
  const { id, chapter } = await params;
  
  const result = await getChapterForRead(id, chapter);
  
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  const session = token ? await verifyToken(token) : null;
  
  if (result.error || !result.chapter) {
    return notFound();
  }

  const { chapter: chapterData, fictionTitle } = result;
  
  return (
    <ReaderProvider>
      <div className={styles.page}>
        
        {/* Top Reading Navigation */}
        <div className={styles.readNav}>
          <div className={`container ${styles.navContainer}`}>
            <Link href={`/novel/${id}`} className={styles.backLink}>
              &larr; Back to Novel
            </Link>
            <div className={styles.novelTitle}>{fictionTitle}</div>
            <ReaderSettingsToggle className={styles.settingsBtn} />
          </div>
        </div>

        {/* Reading Content */}
        <article className={styles.article}>
          <header className={styles.chapterHeader}>
            <h1>Chapter {chapterData.order}: {chapterData.publishedTitle || chapterData.title}</h1>
          </header>

          <div className={styles.readingContainer}>
            <ReaderUI fictionId={id} chapterId={chapterData._id} userId={session?.id}>
              <ChapterContent content={chapterData.publishedContent} />
            </ReaderUI>
          </div>

          {/* Chapter Reviews */}
          <div className="container">
            <ChapterReviewForm fictionId={id} chapterId={chapterData._id} />
            <ReviewSection fictionId={id} chapterId={chapterData._id} type="chapter" currentUser={session} />
          </div>
        </article>

        {/* Bottom Navigation */}
        <div className={styles.bottomNav}>
          <div className={`container ${styles.bottomNavContainer}`}>
            {chapterData.order > 1 ? (
              <Link href={`/read/${id}/${chapterData.order - 1}`} className={styles.navBtn}>
                &larr; Previous
              </Link>
            ) : (
              <div className={styles.navBtnDisabled}>&larr; Previous</div>
            )}
            
            <Link href={`/novel/${id}`} className={styles.tocBtn}>
              Table of Contents
            </Link>

            <Link href={`/read/${id}/${chapterData.order + 1}`} className={styles.navBtn}>
              Next &rarr;
            </Link>
          </div>
        </div>

      </div>
    </ReaderProvider>
  );
}

