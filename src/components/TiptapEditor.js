'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
// import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback } from 'react';
import styles from './TiptapEditor.module.css';

const TOOLBAR_ITEMS = [
  { label: 'B', action: (e) => e.chain().focus().toggleBold().run(), isActive: (e) => e.isActive('bold'), title: 'Bold' },
  { label: 'I', action: (e) => e.chain().focus().toggleItalic().run(), isActive: (e) => e.isActive('italic'), title: 'Italic', italic: true },
  { label: 'U', action: (e) => e.chain().focus().toggleUnderline().run(), isActive: (e) => e.isActive('underline'), title: 'Underline', underline: true },
  { label: 'S', action: (e) => e.chain().focus().toggleStrike().run(), isActive: (e) => e.isActive('strike'), title: 'Strikethrough', strike: true },
];

export default function TiptapEditor({ initialContent, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,  
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({
        placeholder: 'Begin your story here… let the words flow.',
      }),
    ],
    content: initialContent || null,
    editorProps: {
      attributes: {
        class: styles.editorContent,
        spellcheck: 'true',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getJSON());
      }
    },
  });

  // Update content if initialContent changes (e.g., loading an existing chapter)
  useEffect(() => {
    if (editor && initialContent && !editor.isFocused) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  if (!editor) return null;

  return (
    <div className={styles.wrapper}>
      {/* Floating Bubble Menu — appears on text selection */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }}>
        <div className={styles.bubbleMenu}>
          {TOOLBAR_ITEMS.map((item) => (
            <button
              key={item.title}
              onMouseDown={(e) => {
                e.preventDefault();
                item.action(editor);
              }}
              className={`${styles.bubbleBtn} ${item.isActive(editor) ? styles.active : ''}`}
              title={item.title}
              style={{
                fontStyle: item.italic ? 'italic' : 'normal',
                textDecoration: item.underline ? 'underline' : item.strike ? 'line-through' : 'none',
                fontWeight: item.label === 'B' ? 700 : 400,
              }}
            >
              {item.label}
            </button>
          ))}
          <div className={styles.bubbleDivider} />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={`${styles.bubbleBtn} ${editor.isActive('heading', { level: 1 }) ? styles.active : ''}`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={`${styles.bubbleBtn} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBlockquote().run();
            }}
            className={`${styles.bubbleBtn} ${editor.isActive('blockquote') ? styles.active : ''}`}
            title="Quote"
          >
            ❝
          </button>
        </div>
      </BubbleMenu>

      {/* Main Editor Surface */}
      <EditorContent editor={editor} />
    </div>
  );
}
