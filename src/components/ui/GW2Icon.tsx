import Image from 'next/image';
import { Clock } from 'lucide-react';

type GW2IconType = 'gold' | 'spirit-shard' | 'imperial-favor' | 'silver' | 'copper' | 'time';

interface GW2IconProps {
  type: GW2IconType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconConfig = {
  gold: {
    src: '/images/expansions/Gold.png',
    alt: 'Oro de Guild Wars 2'
  },
  silver: {
    src: '/images/expansions/Silver.png',
    alt: 'Plata de Guild Wars 2'
  },
  copper: {
    src: '/images/expansions/Copper.png',
    alt: 'Cobre de Guild Wars 2'
  },
  'spirit-shard': {
    src: '/images/expansions/Spirit_Shard.png',
    alt: 'Spirit Shard de Guild Wars 2'
  },
  'imperial-favor': {
    src: '/images/expansions/Imperial_Favor.png',
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