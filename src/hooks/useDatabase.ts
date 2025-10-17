// Hook para usar el servicio de base de datos
import { useEffect, useState } from 'react';
import { dbClientService, FarmItem, User } from '@/lib/database-client';

export function useDatabase() {
  const [dbService, setDbService] = useState(dbClientService);
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        console.log('Initializing database service...');
        await dbClientService.init?.(); // Inicializar si tiene método init
        setDbService(dbClientService);
        setIsReady(true);
        console.log('Database service initialized successfully');
      } catch (error) {
        console.error('Error inicializando base de datos:', error);
        setIsReady(false);
      }
    };

    initDb();
  }, []);

  console.log('useDatabase - dbService:', !!dbService, 'isReady:', isReady);
  return { dbService, isReady };
}

export type { FarmItem, User }; 