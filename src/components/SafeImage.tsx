'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { isGoogleDriveImageUrl } from '@/lib/sheets';

export const PLACEHOLDER_IMAGE = '/placeholder-kebaya.svg';

/**
 * Inline, dependency-free final fallback. Used only if the local SVG itself
 * fails (e.g. it was not copied into a custom deployment).
 */
const INLINE_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0%" stop-color="#fdf6f0"/><stop offset="100%" stop-color="#efd3c2"/>` +
      `</linearGradient></defs>` +
      `<rect width="800" height="1000" fill="url(#g)"/>` +
      `<text x="400" y="500" text-anchor="middle" font-family="Georgia,serif" font-size="40" fill="#8c4a55">Kebaya Kini</text>` +
      `<text x="400" y="548" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="18" letter-spacing="4" fill="#b76e79">FOTO SEGERA HADIR</text>` +
      `</svg>`
  );

type SafeImageProps = Omit<ImageProps, 'src' | 'onError' | 'onLoad'> & {
  /** Source may be null/undefined or an empty string from the CMS. */
  src?: string | null;
  /** Optional custom fallback (defaults to the branded placeholder). */
  fallbackSrc?: string;
  /** Called after the original source fails, before the fallback is applied. */
  onError?: () => void;
  /** Called once a source successfully loads. */
  onLoad?: () => void;
};

/**
 * Drop-in replacement for next/image that survives broken / restricted
 * Google Drive links, empty CMS cells, and unsupported hosts.
 *
 * - Keeps a single stateful source so `fill`, `sizes`, and layout props work.
 * - Automatically uses `unoptimized` for Drive/Google/data URLs.
 * - Falls back to `public/placeholder-kebaya.svg`, then an inline SVG.
 */
export default function SafeImage({
  src,
  fallbackSrc = PLACEHOLDER_IMAGE,
  alt,
  unoptimized,
  onError,
  onLoad,
  ...props
}: SafeImageProps) {
  const initialSrc = useMemo(() => {
    const value = typeof src === 'string' ? src.trim() : '';
    return value || fallbackSrc;
  }, [src, fallbackSrc]);

  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  // Reset whenever the incoming source or the selected slide changes.
  useEffect(() => {
    setCurrentSrc(initialSrc);
  }, [initialSrc]);

  const shouldUnoptimize =
    unoptimized ??
    (isGoogleDriveImageUrl(currentSrc) ||
      currentSrc.startsWith('data:') ||
      currentSrc.endsWith('.svg'));

  const handleError = () => {
    onError?.();

    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    if (currentSrc !== INLINE_FALLBACK) {
      setCurrentSrc(INLINE_FALLBACK);
    }
  };

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt || 'Kebaya Kini'}
      unoptimized={shouldUnoptimize}
      onError={handleError}
      onLoad={onLoad}
    />
  );
}
