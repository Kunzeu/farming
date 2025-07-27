// Usar siempre PostgreSQL via API
export async function getDbService() {
  const { dbClientService } = await import('./database-client');
  return dbClientService;
}

// Re-exportar los tipos
export type { FarmItem, User } from './database-client'; 