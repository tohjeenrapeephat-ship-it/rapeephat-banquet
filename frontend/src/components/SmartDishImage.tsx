import React, { useState, useEffect } from 'react';
import { getAutoTrimmedImageUrl } from '../utils/imageTrimHelper.js';

interface SmartDishImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const SmartDishImage: React.FC<SmartDishImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  ...rest
}) => {
  const [cleanSrc, setCleanSrc] = useState<string>(src);

  useEffect(() => {
    let isMounted = true;
    if (!src) return;

    // Fast initial set
    setCleanSrc(src);

    // Process auto-trim for any solid borders in background
    getAutoTrimmedImageUrl(src)
      .then((trimmedUrl) => {
        if (isMounted && trimmedUrl) {
          setCleanSrc(trimmedUrl);
        }
      })
      .catch(() => {
        // Keep initial src on failure
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <img
      src={cleanSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        if (fallbackSrc && cleanSrc !== fallbackSrc) {
          setCleanSrc(fallbackSrc);
        }
        if (rest.onError) {
          rest.onError(e);
        }
      }}
      {...rest}
    />
  );
};
