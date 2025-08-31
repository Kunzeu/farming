// Hook para usar el servicio de base de datos
import { useEffect, useState } from 'react';
import { dbClientService, FarmItem, User } from '@/lib/database-client';

export function useDatabase() {
  const [dbService, setDbService] = useState(dbClientService);
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        await dbClientService.init?.(); // Inicializar si tiene método init
        setDbService(dbClientService);
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