'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { saveChapter, publishChapter } from '@/lib/actions/chapterActions';
import styles from './editor.module.css';

// Dynamically import the Tiptap editor to avoid SSR issues
const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), {
  ssr: false,
  loading: () => <div className={styles.editorLoading}>Loading editor...</div>,
});

const AUTOSAVE_DELAY = 30000; // 30 seconds

export default function ChapterEditorClient({ fictionId, initialChapter }) {
  const router = useRouter();
  const [chapterId, setChapterId] = useState(initialChapter?._id || null);
  const [title, setTitle] = useState(initialChapter?.title || '');
  const [content, setContent] = useState(initialChapter?.content || null);
  const [wordCount, setWordCount] = useState(initialChapter?.wordCount || 0);
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'saved', 'error'
  const [isPublished, setIsPublished] = useState(initialChapter?.status === 'published');
  const [isPublishing, setIsPublishing] = useState(false);
  const autosaveTimer = useRef(null);
  const contentRef = useRef(content);

  const handleSave = useCallback(async (silent = false) => {
    if (!silent) setSaveStatus('saving');
    else setSaveStatus('saving');

    const result = await saveChapter({
      fictionId,
      chapterId,
      title,
      content: contentRef.current,
    });

    if (result?.error) {
      setSaveStatus('error');
    } else {
      setSaveStatus('saved');
      if (!chapterId && result.chapterId) {
        setChapterId(result.chapterId);
        // Update URL without reload so the page reflects the new chapter ID
        window.history.replaceState(
          {},
          '',
          `/write/${fictionId}/chapter/${result.chapterId}`
        );
      }
      // Clear "saved" message after 3s
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [fictionId, chapterId, title]);

  const handleContentChange = useCallback((json) => {
    contentRef.current = json;
    // Count words from Tiptap JSON
    const text = JSON.stringify(json);
    const words = text.replace(/"text":"/g, ' ').replace(/[^a-zA-Z\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    // Reset autosave timer
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => handleSave(true), AUTOSAVE_DELAY);
  }, [handleSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  const handlePublish = async () => {
    // Save first, then publish
    setIsPublishing(true);
    const savedResult = await saveChapter({ fictionId, chapterId, title, content: contentRef.current });
    const idToPublish = savedResult?.chapterId || chapterId;

    if (!idToPublish) {
      setIsPublishing(false);
      return;
    }

    const result = await publishChapter(idToPublish);
    if (!result?.error) {
      setIsPublished(true);
    }
    setIsPublishing(false);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Sticky Top Bar */}
      <header className={styles.topBar}>
        <button onClick={() => router.push('/write')} className={styles.backBtn}>
          ← My Desk
        </button>

        <div className={styles.saveStatus}>
          {saveStatus === 'saving' && <span className={styles.statusSaving}>Saving…</span>}
          {saveStatus === 'saved' && <span className={styles.statusSaved}>✓ Saved</span>}
          {saveStatus === 'error' && <span className={styles.statusError}>Save failed</span>}
        </div>

        <div className={styles.topActions}>
          <button
            onClick={() => handleSave(false)}
            className={styles.saveDraftBtn}
            disabled={saveStatus === 'saving'}
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            className={styles.publishBtn}
            disabled={isPublishing}
          >
            {isPublished 
              ? (isPublishing ? 'Updating...' : 'Update Published') 
              : (isPublishing ? 'Publishing...' : 'Publish')}
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <main className={styles.editorBody}>
        {/* Chapter Title */}
        <input
          type="text"
          className={styles.chapterTitle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Chapter title…"
        />

        <div className={styles.divider} />

        {/* Tiptap Editor */}
        <TiptapEditor
          initialContent={content}
          onChange={handleContentChange}
        />
      </main>

      {/* Footer Word Count */}
      <footer className={styles.footer}>
        <span>{wordCount.toLocaleString()} words</span>
        {isPublished && <span className={styles.publishedBadge}>Published</span>}
      </footer>
    </div>
  );
}
