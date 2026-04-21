'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ReaderContext = createContext();

export function useReader() {
  return useContext(ReaderContext);
}

export function ReaderProvider({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'dark', // light, dark, sepia
    fontFamily: 'serif', // serif, sans, mono
    fontSize: 1.25, // rem
    readingMode: 'vertical', // vertical, horizontal
  });

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('fables_reader_settings');
    if (saved) {
      try {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error('Failed to parse reader settings', e);
      }
    }
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('fables_reader_settings', JSON.stringify(settings));
    }
  }, [settings, isMounted]);

  // Apply CSS variables to the document body for global theming
  useEffect(() => {
    if (!isMounted) return;

    const root = document.body;
    
    // Fonts
    const fontFamilies = {
      serif: 'Georgia, "Times New Roman", Times, serif',
      sans: 'Inter, Arial, sans-serif',
      mono: 'Courier New, Courier, monospace'
    };
    root.style.setProperty('--reader-font', fontFamilies[settings.fontFamily]);
    root.style.setProperty('--reader-size', `${settings.fontSize}rem`);
    
    // Themes
    const themes = {
      light: { bg: '#FFFFFF', color: '#111111' },
      dark: { bg: '#121212', color: '#E0E0E0' },
      sepia: { bg: '#FBF0D9', color: '#5E4B3C' }
    };
    root.style.setProperty('--reader-bg', themes[settings.theme].bg);
    root.style.setProperty('--reader-color', themes[settings.theme].color);

    // Add a class for horizontal mode if needed
    if (settings.readingMode === 'horizontal') {
      root.classList.add('reader-horizontal');
    } else {
      root.classList.remove('reader-horizontal');
    }

    return () => {
      // Cleanup when unmounting (e.g. leaving the read page)
      root.style.removeProperty('--reader-font');
      root.style.removeProperty('--reader-size');
      root.style.removeProperty('--reader-bg');
      root.style.removeProperty('--reader-color');
      root.classList.remove('reader-horizontal');
    };
  }, [settings, isMounted]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const value = {
    settings,
    updateSetting,
    isMounted,
  };

  return (
    <ReaderContext.Provider value={value}>
      {children}
    </ReaderContext.Provider>
  );
}
