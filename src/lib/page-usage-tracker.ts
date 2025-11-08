// Utilidad para rastrear el uso de páginas y ordenar el dashboard según la utilidad

export interface PageUsage {
  path: string;
  visits: number;
  lastVisit: number;
}

const USAGE_STORAGE_KEY = 'page_usage_stats';

// Obtener estadísticas de uso de páginas
export function getPageUsageStats(): Record<string, PageUsage> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(USAGE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading page usage stats:', error);
  }
  
  return {};
}

// Registrar una visita a una página
export function trackPageVisit(path: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stats = getPageUsageStats();
    const now = Date.now();
    
    if (stats[path]) {
      stats[path] = {
        path,
        visits: stats[path].visits + 1,
        lastVisit: now
      };
    } else {
      stats[path] = {
        path,
        visits: 1,
        lastVisit: now
      };
    }
    
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error tracking page visit:', error);
  }
}

// Obtener el orden de utilidad de las tarjetas del dashboard
export function getUtilityOrder(cardIds: string[], cardHrefs: Record<string, string>): string[] {
  const stats = getPageUsageStats();
  
  // Crear un mapa de utilidad para cada tarjeta
  const utilityMap = cardIds.map(cardId => {
    const href = cardHrefs[cardId];
    const usage = stats[href] || { visits: 0, lastVisit: 0 };
    
    // Calcular score de utilidad: más visitas = más útil
    // También considerar la última visita (más reciente = más relevante)
    const daysSinceLastVisit = usage.lastVisit 
      ? (Date.now() - usage.lastVisit) / (1000 * 60 * 60 * 24)
      : Infinity;
    
    // Score: visitas * factor de recencia (páginas visitadas recientemente tienen bonus)
    const recencyFactor = daysSinceLastVisit < 7 ? 1.5 : daysSinceLastVisit < 30 ? 1.2 : 1.0;
    const utilityScore = usage.visits * recencyFactor;
    
    return {
      cardId,
      utilityScore,
      visits: usage.visits,
      lastVisit: usage.lastVisit
    };
  });
  
  // Ordenar por utilidad (mayor score primero)
  utilityMap.sort((a, b) => {
    // Si una tiene visitas y la otra no, la que tiene visitas va primero
    if (a.visits > 0 && b.visits === 0) return -1;
    if (a.visits === 0 && b.visits > 0) return 1;
    
    // Si ambas tienen visitas, ordenar por score
    if (a.utilityScore !== b.utilityScore) {
      return b.utilityScore - a.utilityScore;
    }
    
    // Si tienen el mismo score, ordenar por última visita (más reciente primero)
    return b.lastVisit - a.lastVisit;
  });
  
  return utilityMap.map(item => item.cardId);
}

// Limpiar estadísticas antiguas (opcional)
export function cleanOldStats(daysToKeep: number = 90): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stats = getPageUsageStats();
    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    const cleaned: Record<string, PageUsage> = {};
    Object.entries(stats).forEach(([path, usage]) => {
      if (usage.lastVisit > cutoff) {
        cleaned[path] = usage;
      }
    });
    
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(cleaned));
  } catch (error) {
    console.error('Error cleaning old stats:', error);
  }
}

