import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getFiction } from '@/lib/actions/fictionActions';
import ChapterEditorClient from '../ChapterEditorClient';

export async function generateMetadata({ params }) {
  const { fictionId } = await params;
  return { title: 'New Chapter | Fables' };
}

export default async function NewChapterPage({ params }) {
  const { fictionId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  if (!token) redirect('/login');
  const session = await verifyToken(token);
  if (!session) redirect('/login');

  // Verify this user owns the fiction
  const { fiction, error } = await getFiction(fictionId);
  if (error || !fiction) redirect('/write');

  return <ChapterEditorClient fictionId={fictionId} initialChapter={null} />;
}
