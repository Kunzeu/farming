// Hook para usar el servicio de base de datos
import { useEffect, useState } from 'react';
import { getDbService, FarmItem, User } from '@/lib/database-switch';

export function useDatabase() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbService, setDbService] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        const service = await getDbService();
        await service.init?.(); // Inicializar si tiene método init
        setDbService(service);
        setIsReady(true);
      } catch (error) {
        console.error('Error inicializando base de datos:', error);
      }
    };

    initDb();
  }, []);

  return { dbService, isReady };
}

export type { FarmItem, User }; 