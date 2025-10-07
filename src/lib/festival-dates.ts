// Configuración de fechas de festivales
// Se pueden actualizar desde variables de entorno en producción

export interface FestivalDate {
  startDate: string;
  endDate: string;
  startDateFormatted: string;
  endDateFormatted: string;
  startTime?: string; // Hora de inicio en formato HH:MM (opcional)
  endTime?: string;   // Hora de fin en formato HH:MM (opcional)
  timezone?: string;  // Zona horaria (por defecto 'UTC')
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
    endDateFormatted: 'February',
    startTime: '11:00', // 11:00 AM Colombia (UTC-5)
    endTime: '11:00',
    timezone: 'America/Bogota'
  },
  'dragon-bash': {
    startDate: '2025-06-17',
    endDate: '2025-07-08',
    startDateFormatted: 'June',
    endDateFormatted: 'July',
    startTime: '11:00', // 11:00 AM Colombia (UTC-5)
    endTime: '11:00',
    timezone: 'America/Bogota'
  },
  'four-winds': {
    startDate: '2025-08-05',
    endDate: '2025-08-26',
    startDateFormatted: 'August',
    endDateFormatted: 'August',
    startTime: '11:00', // 11:00 AM Colombia (UTC-5)
    endTime: '11:00',
    timezone: 'America/Bogota'
  },
  halloween: {
    startDate: '2025-10-07',
    endDate: '2025-11-04',
    startDateFormatted: 'October',
    endDateFormatted: 'November',
    startTime: '11:00', // 11:00 AM Colombia (UTC-5)
    endTime: '11:00',
    timezone: 'America/Bogota'
  },
  wintersday: {
    startDate: '2025-12-16',
    endDate: '2026-01-06',
    startDateFormatted: 'December',
    endDateFormatted: 'January',
    startTime: '11:00', // 11:00 AM Colombia (UTC-5)
    endTime: '11:00',
    timezone: 'America/Bogota'
  }
};

// Función para crear una fecha con hora específica
const createDateTime = (date: string, time?: string, timezone: string = 'UTC'): Date => {
  if (!time) {
    return new Date(date);
  }
  
  // Crear fecha con hora específica en la zona horaria indicada
  const dateTimeString = `${date}T${time}:00`;
  
  if (timezone === 'UTC') {
    return new Date(dateTimeString + 'Z');
  } else {
    // Para zonas horarias específicas, crear en UTC y luego ajustar
    // Colombia es UTC-5, así que 11:00 AM Colombia = 16:00 UTC
    const tempDate = new Date(dateTimeString + 'Z');
    
    if (timezone === 'America/Bogota') {
      // Colombia está en UTC-5, así que restamos 5 horas para obtener la hora local
      return new Date(tempDate.getTime() - (5 * 60 * 60 * 1000));
    }
    
    // Para otras zonas horarias, usar Intl.DateTimeFormat
    return new Date(dateTimeString);
  }
};

// Función para obtener el estado actual del festival
export const getFestivalStatus = (
  startDate: string, 
  endDate: string, 
  startTime?: string, 
  endTime?: string, 
  timezone: string = 'UTC'
): 'active' | 'upcoming' | 'ended' => {
  const now = new Date();
  const start = createDateTime(startDate, startTime, timezone);
  const end = createDateTime(endDate, endTime, timezone);
  
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

// Función para obtener eventos activos basados en las fechas y horas
export const getActiveFestivalEvents = (): Array<FestivalEvent & { start: Date; end: Date }> => {
  const now = new Date();
  const activeEvents: Array<FestivalEvent & { start: Date; end: Date }> = [];

  festivalEvents.forEach(event => {
    const festivalKey = event.nameKey.replace('festival.', '');
    const dates = festivalDates[festivalKey];
    
    if (dates) {
      const start = createDateTime(
        dates.startDate, 
        dates.startTime, 
        dates.timezone || 'UTC'
      );
      const end = createDateTime(
        dates.endDate, 
        dates.endTime, 
        dates.timezone || 'UTC'
      );
      
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

// Función de conveniencia para obtener el estado de un festival específico
export const getFestivalStatusByName = (festivalName: string): 'active' | 'upcoming' | 'ended' | null => {
  const dates = festivalDates[festivalName];
  
  if (!dates) {
    return null;
  }
  
  return getFestivalStatus(
    dates.startDate,
    dates.endDate,
    dates.startTime,
    dates.endTime,
    dates.timezone
  );
};

// Función para obtener el tiempo restante hasta el inicio de un festival
export const getTimeUntilFestivalStart = (festivalName: string): { days: number; hours: number; minutes: number } | null => {
  const dates = festivalDates[festivalName];
  
  if (!dates) {
    return null;
  }
  
  const now = new Date();
  const start = createDateTime(
    dates.startDate, 
    dates.startTime, 
    dates.timezone || 'UTC'
  );
  
  if (now >= start) {
    return { days: 0, hours: 0, minutes: 0 };
  }
  
  const diffMs = start.getTime() - now.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
}; 