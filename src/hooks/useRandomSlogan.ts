import { getRandomSlogan } from '@/components/ui/Slogan';

// Hook para obtener un slogan aleatorio para metadatos
export function useRandomSlogan() {
  return getRandomSlogan();
}

// Función para generar metadatos con slogan aleatorio
export function generateRandomMetadata() {
  const randomSlogan = getRandomSlogan();
  
  return {
    description: `${randomSlogan} - Your platform to optimize farming in Guild Wars 2`,
    openGraph: {
      description: `${randomSlogan} - Your platform to optimize farming in Guild Wars 2`,
    },
    twitter: {
      description: `${randomSlogan} - Your platform to optimize farming in Guild Wars 2`,
    }
  };
}
