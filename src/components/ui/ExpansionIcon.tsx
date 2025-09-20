import React, { useState } from 'react';
import Image from 'next/image';

interface ExpansionIconProps {
  expansion: 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw';
  showName?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'card';
}

const expansionData = {
  core: {
    name: 'Core Game',
    color: 'bg-blue-600',
    textColor: 'text-blue-300',
    icon: '/images/expansions/core.webp',
    fallbackIcon: '⚔️'
  },
  hot: {
    name: 'Heart of Thorns',
    color: 'bg-blue-700',
    textColor: 'text-blue-300',
    icon: '/images/expansions/hot.webp',
    fallbackIcon: '🌿'
  },
  pof: {
    name: 'Path of Fire',
    color: 'bg-blue-800',
    textColor: 'text-blue-300',
    icon: '/images/expansions/pof.webp',
    fallbackIcon: '🔥'
  },
  eod: {
    name: 'End of Dragons',
    color: 'bg-blue-600',
    textColor: 'text-blue-300',
    icon: '/images/expansions/eod.webp',
    fallbackIcon: '🐉'
  },
  soto: {
    name: 'Secrets of the Obscure',
    color: 'bg-blue-700',
    textColor: 'text-blue-300',
    icon: '/images/expansions/soto.webp',
    fallbackIcon: '✨'
  },
  jw: {
    name: 'Janthir Wilds',
    color: 'bg-blue-800',
    textColor: 'text-blue-300',
    icon: '/images/expansions/jw.webp',
    fallbackIcon: '🏔️'
  }
};

export default function ExpansionIcon({ expansion, showName = false, size = 'md', variant = 'default' }: ExpansionIconProps) {
  // Validar que expansion sea válido, si no, usar 'core' por defecto
  const validExpansion = expansion && expansionData[expansion] ? expansion : 'core';
  const data = expansionData[validExpansion];
  
  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  const imageSizes = {
    xs: 20,
    sm: 32,
    md: 40,
    lg: 56
  };

  const [imageError, setImageError] = useState(false);

  // Estilos según la variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'bg-transparent p-0';
      case 'card':
        return 'bg-gray-700 p-1 rounded-md';
      default:
        return 'bg-gray-800 p-1 rounded-lg';
    }
  };

  // Contenedor de imagen según la variante
  const getImageContainerStyles = () => {
    switch (variant) {
      case 'compact':
        return 'w-full h-full flex items-center justify-center';
      case 'card':
        return 'w-full h-full flex items-center justify-center bg-gray-700 rounded-md';
      default:
        return 'w-full h-full flex items-center justify-center bg-gray-800 rounded-lg';
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <div className={`${sizeClasses[size]} flex items-center justify-center ${getVariantStyles()}`}>
        {!imageError ? (
          <div className={getImageContainerStyles()}>
            <Image
              src={data.icon}
              alt={data.name}
              width={imageSizes[size]}
              height={imageSizes[size]}
              className="object-contain w-full h-full"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className={`${data.color} w-full h-full rounded-lg flex items-center justify-center text-white font-bold`}>
            <span className="text-sm">
              {data.fallbackIcon}
            </span>
          </div>
        )}
      </div>

      {showName && (
        <span className={`${data.textColor} font-medium text-sm`}>
          {data.name}
        </span>
      )}
    </div>
  );
} 