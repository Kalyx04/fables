'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ReaderUI.module.css';
import { addInlineComment, getChapterComments } from '@/lib/actions/commentActions';

export default function ReaderUI({ fictionId, chapterId, children, userId }) {
  const [selectedText, setSelectedText] = useState('');
  const [paraIndex, setParaIndex] = useState(-1);
  const [popoverPos, setPopoverPos] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const contentRef = useRef(null);

  // Load comments on mount
  useEffect(() => {
    async function loadComments() {
      const res = await getChapterComments(chapterId);
      if (res.comments) setComments(res.comments);
    }
    loadComments();
  }, [chapterId]);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && text.length > 2 && text.length < 500) {
      // Find which paragraph it's in
      let node = selection.anchorNode;
      while (node && node.nodeName !== 'P') {
        node = node.parentNode;
      }

      if (node && node.nodeName === 'P' && contentRef.current.contains(node)) {
        const paragraphs = Array.from(contentRef.current.querySelectorAll('p'));
        const index = paragraphs.indexOf(node);
        
        if (index !== -1) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          setSelectedText(text);
          setParaIndex(index);
          setPopoverPos({
            top: rect.top + window.scrollY - 40,
            left: rect.left + window.scrollX + (rect.width / 2)
          });
        }
      }
    } else {
      if (!showCommentInput) {
        setPopoverPos(null);
        setSelectedText('');
      }
    }
  }, [showCommentInput]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  const handleSaveComment = async () => {
    if (!commentText.trim()) return;

    const res = await addInlineComment({
      fictionId,
      chapterId,
      selectedText,
      paragraphIndex: paraIndex,
      content: commentText.trim()
    });

    if (!res.error) {
      // Refresh local comments
      const updated = await getChapterComments(chapterId);
      if (updated.comments) setComments(updated.comments);
      
      // Cleanup
      setShowCommentInput(false);
      setPopoverPos(null);
      setCommentText('');
      window.getSelection().removeAllRanges();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className={styles.readerWrapper} ref={contentRef}>
      {children}

      {/* Popover Button */}
      {popoverPos && !showCommentInput && (
        <button 
          className={styles.commentTrig}
          style={{ top: popoverPos.top, left: popoverPos.left }}
          onClick={() => setShowCommentInput(true)}
        >
          💬 Comment
        </button>
      )}

      {/* Comment Input Modal/Overlay */}
      {showCommentInput && (
        <div className={styles.overlay} onClick={() => setShowCommentInput(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h4>Comment on selection</h4>
            <blockquote className={styles.quote}>"{selectedText}"</blockquote>
            <textarea 
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="What's your thought on this line?"
              autoFocus
            />
            <div className={styles.modalActions}>
              <button onClick={() => setShowCommentInput(false)}>Cancel</button>
              <button onClick={handleSaveComment} className={styles.primary}>Post</button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Markers (simplified for MVP: show a bubble next to paragraphs with comments) */}
      {comments.map((comment, i) => {
        // We can't easily find the position again perfectly without complex refs, 
        // so we'll just show them in a sidebar or grouped by paragraph.
        return null; // For now
      })}
      
      {/* Side Panel for comments (Desktop only ideally) */}
      <div className={styles.sideComments}>
        {comments.length > 0 && <h4>Comments ({comments.length})</h4>}
        {comments.map(c => (
          <div key={c._id} className={styles.sideItem}>
            <span className={styles.user}>{c.userId.username}</span>
            <blockquote className={styles.cite}>"{c.selectedText}"</blockquote>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
