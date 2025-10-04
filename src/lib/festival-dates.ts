// Configuración de fechas de festivales
// Se pueden actualizar desde variables de entorno en producción

export interface FestivalDate {
  startDate: string;
  endDate: string;
  startDateFormatted: string;
  endDateFormatted: string;
}

export interface FestivalEvent {
  nameKey: string;
  path: string;
  color: string;
}

export const festivalDates: Record<string, FestivalDate> = {
  lunar: {
    startDate: '2025-01-28',
    endDate: '2025-02-18',
    startDateFormatted: 'January',
    endDateFormatted: 'February'
  },
  'dragon-bash': {
    startDate: '2025-06-17',
    endDate: '2025-07-08',
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
    startDate: '2025-10-07',
    endDate: '2025-11-04',
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

// Configuración de eventos de festivales con sus propiedades
export const festivalEvents: FestivalEvent[] = [
  {
    nameKey: 'festival.fourWinds',
    path: '/festivals/four-winds',
    color: 'from-green-600 to-cyan-600',
  },
  {
    nameKey: 'festival.halloween',
    path: '/festivals/halloween',
    color: 'from-orange-600 to-orange-700',
  },
  {
    nameKey: 'festival.lunarNewYear',
    path: '/festivals/lunar-new-year',
    color: 'from-red-600 to-yellow-500',
  },
  {
    nameKey: 'festival.dragonBash',
    path: '/festivals/dragon-bash',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    nameKey: 'festival.wintersday',
    path: '/festivals/wintersday',
    color: 'from-sky-600 to-cyan-500',
  },
];

// Función para obtener eventos activos basados en las fechas
export const getActiveFestivalEvents = (): Array<FestivalEvent & { start: Date; end: Date }> => {
  const now = new Date();
  const activeEvents: Array<FestivalEvent & { start: Date; end: Date }> = [];

  festivalEvents.forEach(event => {
    const festivalKey = event.nameKey.replace('festival.', '');
    const dates = festivalDates[festivalKey];
    
    if (dates) {
      const start = new Date(dates.startDate);
      const end = new Date(dates.endDate);
      
      if (now >= start && now <= end) {
        activeEvents.push({
          ...event,
          start,
          end
        });
      }
    }
  });

  return activeEvents;
}; 