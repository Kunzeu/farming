'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImgProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export default function OptimizedImg({
  src,
  alt,
  width = 64,
  height = 64,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85
}: OptimizedImgProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-400 ${className}`}
        style={{ width, height }}
      >
        <span className="text-xs">Sin imagen</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      quality={quality}
      className={className}
      onError={() => setImageError(true)}
      loading={priority ? undefined : 'lazy'}
      style={{
        objectFit: 'cover',
        width: '100%',
        height: '100%'
      }}
    />
  );
}
