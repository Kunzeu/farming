// Configuración de fechas de festivales
// Se pueden actualizar desde variables de entorno en producción

export interface FestivalDate {
  startDate: string;
  endDate: string;
  startDateFormatted: string;
  endDateFormatted: string;
}

export const festivalDates: Record<string, FestivalDate> = {
  lunar: {
    startDate: '2025-01-28',
    endDate: '2025-02-18',
    startDateFormatted: 'January',
    endDateFormatted: 'February'
  },
  'dragon-bash': {
    startDate: '2025-06-24',
    endDate: '2025-07-15',
    startDateFormatted: 'June',
    endDateFormatted: 'July'
  },
  'four-winds': {
    startDate: '2025-08-05',
    endDate: '2025-08-26',
    startDateFormatted: 'August',
    endDateFormatted: 'August'
  },
  halloween: {
    startDate: '2025-10-21',
    endDate: '2025-11-11',
    startDateFormatted: 'October',
    endDateFormatted: 'November'
  },
  wintersday: {
    startDate: '2025-12-16',
    endDate: '2026-01-06',
    startDateFormatted: 'December',
    endDateFormatted: 'January'
  }
};

// Función para obtener el estado actual del festival
export const getFestivalStatus = (startDate: string, endDate: string): 'active' | 'upcoming' | 'ended' => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now >= start && now <= end) {
    return 'active';
  } else if (now < start) {
    return 'upcoming';
  } else {
    return 'ended';
  }
};

// Función para formatear fechas en formato legible
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('es-ES', { month: 'long' });
  const endMonth = end.toLocaleDateString('es-ES', { month: 'long' });
  
  if (startMonth === endMonth) {
    return startMonth;
  }
  
  return `${startMonth} - ${endMonth}`;
}; 