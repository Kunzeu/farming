'use client';

import { useState, useEffect } from 'react';

const slogans = [
  "Passion for gold",
  "Gold - Today and tomorrow", 
  "Gold is my passion",
  "True Farming Saves Your Time",
  "We use real data, not like others",
  "The art of True Farming",
  "All you need is True Farming",
  "Real Farming? It must be like True Data",
  "Don't Say Fast, Say True",
  "The gold don't wait people",
  "My Doctor Says 'A good farmer is a true farmer",
  "600g/h? We show you that doesn't exist!"
];

interface SloganProps {
  variant?: 'random' | 'rotating' | 'static';
  sloganIndex?: number;
  className?: string;
  showOnLoad?: boolean;
}

export default function Slogan({ 
  variant = 'random', 
  sloganIndex = 0, 
  className = '',
  showOnLoad = true
}: SloganProps) {
  const [currentSlogan, setCurrentSlogan] = useState('');
  const [isVisible, setIsVisible] = useState(showOnLoad);

  useEffect(() => {
    if (variant === 'random') {
      // Selecciona un slogan aleatorio al cargar
      const randomIndex = Math.floor(Math.random() * slogans.length);
      setCurrentSlogan(slogans[randomIndex]);
    } else if (variant === 'static') {
      setCurrentSlogan(slogans[sloganIndex % slogans.length]);
    } else if (variant === 'rotating') {
      setCurrentSlogan(slogans[0]);
    }
  }, [variant, sloganIndex]);

  useEffect(() => {
    if (variant === 'rotating') {
      const interval = setInterval(() => {
        setCurrentSlogan(prevSlogan => {
          const currentIndex = slogans.indexOf(prevSlogan);
          const nextIndex = (currentIndex + 1) % slogans.length;
          return slogans[nextIndex];
        });
      }, 4000); // Cambia cada 4 segundos

      return () => clearInterval(interval);
    }
  }, [variant]);

  if (!isVisible) return null;

  return (
    <div className={`slogan-container ${className}`}>
      <p className="transition-all duration-500 ease-in-out animate-fade-in">
        {currentSlogan}
      </p>
    </div>
  );
}

// Función para obtener un slogan aleatorio (para metadatos)
export function getRandomSlogan(): string {
  return slogans[Math.floor(Math.random() * slogans.length)];
}

// Función para obtener un slogan específico por índice
export function getSloganByIndex(index: number): string {
  return slogans[index % slogans.length];
}

// Exportar todos los slogans para uso externo
export { slogans };
