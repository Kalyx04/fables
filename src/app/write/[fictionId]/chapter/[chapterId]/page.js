import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getChapterForEdit } from '@/lib/actions/chapterActions';
import ChapterEditorClient from '../ChapterEditorClient';

export async function generateMetadata({ params }) {
  const { chapterId } = await params;
  return { title: 'Edit Chapter | Fables' };
}

export default async function EditChapterPage({ params }) {
  const { fictionId, chapterId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  if (!token) redirect('/login');
  const session = await verifyToken(token);
  if (!session) redirect('/login');

  const { chapter, error } = await getChapterForEdit(chapterId);
  if (error || !chapter) redirect('/write');

  // Make sure the chapter belongs to this fiction
  if (chapter.fictionId !== fictionId) redirect('/write');

  return <ChapterEditorClient fictionId={fictionId} initialChapter={chapter} />;
}
