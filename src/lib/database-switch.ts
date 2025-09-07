// Usar PostgreSQL via API (Supabase)
export async function getDbService() {
  const { dbClientService } = await import('./database-client');
  return dbClientService;
}
 
// Re-exportar los tipos
export type { FarmItem, User } from './database-client'; 