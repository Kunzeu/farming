import Image from 'next/image';
import { Clock } from 'lucide-react';

type GW2IconType = 'time' | 'gold' | 'spirit-shard' | 'karma' | 'fractal-relic' | 'volatile-magic' | 'unbound-magic' | 'rift-essence' | 'mystic-clover' | 'imperial-favor';

interface GW2IconProps {
  type: GW2IconType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconConfig = {
  gold: {
    src: '/images/expansions/Gold.webp',
    alt: 'Oro de Guild Wars 2'
  },
  'spirit-shard': {
    src: '/images/expansions/Spirit_Shard.webp',
    alt: 'Spirit Shard de Guild Wars 2'
  },
  karma: {
    src: '/images/expansions/karma.webp',
    alt: 'Karma de Guild Wars 2'
  },
  'fractal-relic': {
    src: '/images/expansions/fractal-relic.webp',
    alt: 'Fractal Relic de Guild Wars 2'
  },
  'volatile-magic': {
    src: '/images/expansions/volatile-magic.webp',
    alt: 'Volatile Magic de Guild Wars 2'
  },
  'unbound-magic': {
    src: '/images/expansions/unbound-magic.webp',
    alt: 'Unbound Magic de Guild Wars 2'
  },
  'rift-essence': {
    src: '/images/expansions/rift-essence.webp',
    alt: 'Rift Essence de Guild Wars 2'
  },
  'mystic-clover': {
    src: '/images/expansions/mystic-clover.webp',
    alt: 'Mystic Clover de Guild Wars 2'
  },
  'imperial-favor': {
    src: '/images/expansions/Imperial_Favor.webp',
    alt: 'Imperial Favor de Guild Wars 2'
  }
};

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export default function GW2Icon({ type, size = 'md', className = '' }: GW2IconProps) {
  const sizeClass = sizeClasses[size];

  // Para el tiempo, usar el icono de Lucide
  if (type === 'time') {
    return (
      <Clock className={`${sizeClass} text-blue-400 ${className}`} />
    );
  }

  // Para oro, spirit shards e imperial favor, usar las imágenes oficiales
  const config = iconConfig[type];
  return (
    <Image
      src={config.src}
      alt={config.alt}
      width={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
      height={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
      className={`${sizeClass} ${className}`}
    />
  );
} 