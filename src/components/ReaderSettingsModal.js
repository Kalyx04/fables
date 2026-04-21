'use client';

import React from 'react';
import { useReader } from './ReaderProvider';
import styles from './ReaderSettingsModal.module.css';

export default function ReaderSettingsModal({ isOpen, onClose }) {
  const { settings, updateSetting, isMounted } = useReader();

  if (!isMounted) return null;

  const handleSizeChange = (increment) => {
    let newSize = settings.fontSize + increment;
    if (newSize < 0.75) newSize = 0.75;
    if (newSize > 2.5) newSize = 2.5;
    updateSetting('fontSize', newSize);
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Reader Settings</h3>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        {/* Font Family */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Typography</div>
          <div className={styles.controlsRow}>
            <button 
              className={`${styles.btn} ${settings.fontFamily === 'serif' ? styles.active : ''}`}
              onClick={() => updateSetting('fontFamily', 'serif')}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Serif
            </button>
            <button 
              className={`${styles.btn} ${settings.fontFamily === 'sans' ? styles.active : ''}`}
              onClick={() => updateSetting('fontFamily', 'sans')}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              Sans
            </button>
            <button 
              className={`${styles.btn} ${settings.fontFamily === 'mono' ? styles.active : ''}`}
              onClick={() => updateSetting('fontFamily', 'mono')}
              style={{ fontFamily: 'Courier, monospace' }}
            >
              Mono
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Font Size</div>
          <div className={styles.fontSizeControls}>
            <button className={styles.sizeBtn} onClick={() => handleSizeChange(-0.1)}>A-</button>
            <div className={styles.sizeDisplay}>{Math.round(settings.fontSize * 100)}%</div>
            <button className={styles.sizeBtn} onClick={() => handleSizeChange(0.1)}>A+</button>
          </div>
        </div>

        {/* Theme/Colors */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Background</div>
          <div className={styles.swatchRow}>
            <button 
              className={`${styles.swatch} ${styles.swatchLight} ${settings.theme === 'light' ? styles.active : ''}`}
              onClick={() => updateSetting('theme', 'light')}
              title="Light"
            />
            <button 
              className={`${styles.swatch} ${styles.swatchSepia} ${settings.theme === 'sepia' ? styles.active : ''}`}
              onClick={() => updateSetting('theme', 'sepia')}
              title="Sepia"
            />
            <button 
              className={`${styles.swatch} ${styles.swatchDark} ${settings.theme === 'dark' ? styles.active : ''}`}
              onClick={() => updateSetting('theme', 'dark')}
              title="Dark"
            />
          </div>
        </div>

        {/* Reading Mode */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Paging Mode</div>
          <div className={styles.controlsRow}>
            <button 
              className={`${styles.btn} ${settings.readingMode === 'vertical' ? styles.active : ''}`}
              onClick={() => updateSetting('readingMode', 'vertical')}
            >
              Vertical Scroll
            </button>
            <button 
              className={`${styles.btn} ${settings.readingMode === 'horizontal' ? styles.active : ''}`}
              onClick={() => updateSetting('readingMode', 'horizontal')}
            >
              Horizontal Pages
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
