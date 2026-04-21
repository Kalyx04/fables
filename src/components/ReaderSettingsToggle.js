'use client';

import React, { useState } from 'react';
import ReaderSettingsModal from './ReaderSettingsModal';

export default function ReaderSettingsToggle({ className }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={className} onClick={() => setIsOpen(true)}>
        Settings (Aa)
      </div>
      <ReaderSettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
