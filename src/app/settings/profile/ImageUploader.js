'use client';

import { CldUploadWidget } from 'next-cloudinary';
import styles from './settings.module.css';

/**
 * A reusable image uploader component that uses Cloudinary's signed upload widget.
 * @param {string} label - Label shown above the input
 * @param {string} value - Current URL value
 * @param {function} onChange - Callback when a new URL is set (either via upload or paste)
 * @param {string} folder - Cloudinary folder to upload to (e.g. 'fables/avatars')
 * @param {string} placeholder - Placeholder text for the URL input
 */
export default function ImageUploader({ label, value, onChange, folder, placeholder }) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>

      {/* Live Preview */}
      {value && (
        <div className={styles.imagePreview}>
          <img src={value} alt="preview" className={styles.previewImg} />
        </div>
      )}

      {/* Cloudinary Upload Widget Button */}
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          folder: folder,
          maxFiles: 1,
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          maxFileSize: 5000000, // 5MB
        }}
        onSuccess={(result) => {
          const url = result?.info?.secure_url;
          if (url) onChange(url);
        }}
      >
        {({ open }) => (
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => open()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Image
          </button>
        )}
      </CldUploadWidget>

      {/* URL paste fallback */}
      <div className={styles.urlFallback}>
        <span className={styles.orDivider}>or paste a URL</span>
        <input
          type="url"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
