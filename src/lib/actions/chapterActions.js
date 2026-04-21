'use server';

import connectToDatabase from '../mongodb';
import Chapter from '../models/Chapter';
import Fiction from '../models/Fiction';
import { verifyToken } from '../auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fables_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Extracts plain text from a Tiptap JSON document for word count.
 */
function extractText(doc) {
  if (!doc || !doc.content) return '';
  return doc.content
    .map((node) => {
      if (node.type === 'text') return node.text || '';
      if (node.content) return extractText(node);
      return '';
    })
    .join(' ');
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Creates a new draft chapter or updates an existing one.
 */
export async function saveChapter({ fictionId, chapterId, title, content }) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();

    // Verify the fiction belongs to this user
    const fiction = await Fiction.findOne({ _id: fictionId, authorId: session.id });
    if (!fiction) return { error: 'Fiction not found or unauthorized' };

    const plainText = extractText(content);
    const wordCount = countWords(plainText);

    let chapter;

    if (chapterId) {
      // Update existing chapter
      chapter = await Chapter.findOneAndUpdate(
        { _id: chapterId, authorId: session.id },
        { $set: { title, content, wordCount } },
        { returnDocument: 'after' }
      ).lean();

      if (!chapter) return { error: 'Chapter not found or unauthorized' };
    } else {
      // Create new chapter — determine order
      const chapterCount = await Chapter.countDocuments({ fictionId });

      chapter = await Chapter.create({
        fictionId,
        authorId: session.id,
        title: title || 'Untitled Chapter',
        content,
        wordCount,
        order: chapterCount + 1,
        status: 'draft',
      });

      // Update fiction's chapter count
      await Fiction.findByIdAndUpdate(fictionId, { $inc: { chapterCount: 1 } });
    }

    revalidatePath('/write');

    return { chapterId: chapter._id.toString() };
  } catch (error) {
    console.error('saveChapter error:', error);
    return { error: 'Failed to save chapter' };
  }
}

/**
 * Fetches a chapter's data for loading into the editor.
 */
export async function getChapterForEdit(chapterId) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();

    const chapter = await Chapter.findOne({
      _id: chapterId,
      authorId: session.id,
    }).lean();

    if (!chapter) return { error: 'Chapter not found' };

    return {
      chapter: {
        ...chapter,
        _id: chapter._id.toString(),
        fictionId: chapter.fictionId.toString(),
        authorId: chapter.authorId.toString(),
      },
    };
  } catch (error) {
    console.error('getChapterForEdit error:', error);
    return { error: 'Failed to fetch chapter' };
  }
}

/**
 * Publishes a chapter (flips status from draft to published).
 */
export async function publishChapter(chapterId) {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  try {
    await connectToDatabase();

    // Find the chapter to get current working title and content
    const currentChapter = await Chapter.findOne({ _id: chapterId, authorId: session.id });
    if (!currentChapter) return { error: 'Chapter not found or unauthorized' };

    const chapter = await Chapter.findOneAndUpdate(
      { _id: chapterId, authorId: session.id },
      { 
        $set: { 
          status: 'published',
          publishedTitle: currentChapter.title,
          publishedContent: currentChapter.content,
          lastPublishedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    ).lean();

    revalidatePath('/write');
    revalidatePath(`/novel/${currentChapter.fictionId}`);

    return { success: true };
  } catch (error) {
    console.error('publishChapter error:', error);
    return { error: 'Failed to publish chapter' };
  }
}

/**
 * Fetches chapters for a fiction.
 * If isAuthor is true, returns all chapters with draft info.
 * If false, returns only published chapters with published content.
 */
export async function getChapters(fictionId, isAuthor = false) {
  try {
    await connectToDatabase();

    let query = { fictionId };
    if (!isAuthor) {
      query.publishedContent = { $ne: null };
    }

    const chapters = await Chapter.find(query)
      .sort({ order: 1 })
      .lean();

    return {
      chapters: chapters.map((ch) => ({
        ...ch,
        _id: ch._id.toString(),
        fictionId: ch.fictionId.toString(),
        authorId: ch.authorId.toString(),
      })),
    };
  } catch (error) {
    console.error('getChapters error:', error);
    return { error: 'Failed to fetch chapters' };
  }
}

/**
 * Fetches a published chapter by fictionId and order for the reader.
 */
export async function getChapterForRead(fictionId, order) {
  try {
    await connectToDatabase();

    const chapterOrder = parseInt(order);

    const chapter = await Chapter.findOne({
      fictionId,
      order: chapterOrder,
      publishedContent: { $ne: null }
    }).lean();

    if (!chapter) return { error: 'Chapter not found' };

    // Increment fiction view count
    await Fiction.findByIdAndUpdate(fictionId, { $inc: { 'stats.views': 1 } });

    const fiction = await Fiction.findById(fictionId, 'title').lean();

    return {
      chapter: {
        ...chapter,
        _id: chapter._id.toString(),
        fictionId: chapter.fictionId.toString(),
        authorId: chapter.authorId.toString(),
      },
      fictionTitle: fiction?.title || 'Unknown Fiction'
    };
  } catch (error) {
    console.error('getChapterForRead error:', error);
    return { error: 'Failed to fetch chapter' };
  }
}


