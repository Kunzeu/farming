'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDatabase } from '@/hooks/useDatabase';

export function useRoleCheck() {
  const { user, isAuthenticated } = useAuth();
  const { dbService } = useDatabase();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user || !dbService) {
      return;
    }

    const checkRole = async () => {
      try {
        // Verificar que el usuario aún esté autenticado antes de hacer la consulta
        if (!localStorage.getItem('gw2_token') || !localStorage.getItem('gw2_user')) {
          return;
        }

        const currentUser = await dbService.getUserById(user.id);
        
        if (!currentUser) {
          // El usuario fue eliminado, limpiar localStorage y redirigir al login
          localStorage.removeItem('gw2_token');
          localStorage.removeItem('gw2_user');
          window.location.href = '/';
          return;
        }

        // Verificar si el rol cambió
        if (currentUser.role !== user.role) {
          // Actualizar el localStorage con el nuevo rol
          const updatedUser = { ...user, role: currentUser.role };
          localStorage.setItem('gw2_user', JSON.stringify(updatedUser));
          
          // Recargar la página para aplicar el nuevo rol
          window.location.reload();
          return;
        }

        // Verificar si el estado activo cambió
        if (currentUser.isActive !== user.isActive) {
          if (!currentUser.isActive) {
            // Usuario desactivado, redirigir al login
            window.location.href = '/';
            return;
          } else {
            // Usuario reactivado, actualizar localStorage
            const updatedUser = { ...user, isActive: currentUser.isActive };
            localStorage.setItem('gw2_user', JSON.stringify(updatedUser));
            window.location.reload();
            return;
          }
        }
      } catch {
        // No hacer nada en caso de error, mantener la sesión actual
      }
    };

    // Verificar inmediatamente al montar
    checkRole();

    // Configurar intervalo de 30 segundos
    intervalRef.current = setInterval(checkRole, 30000);

    // Limpiar intervalo al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, user, dbService]);

  // También verificar cuando la ventana vuelve a estar activa
  useEffect(() => {
    if (!isAuthenticated || !user || !dbService) {
      return;
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Verificar rol cuando la ventana vuelve a estar activa
                const checkRole = async () => {
          try {
            // Verificar que el usuario aún esté autenticado
            if (!localStorage.getItem('gw2_token') || !localStorage.getItem('gw2_user')) {
              return;
            }

            const currentUser = await dbService.getUserById(user.id);
            if (!currentUser) {
              localStorage.removeItem('gw2_token');
              localStorage.removeItem('gw2_user');
              window.location.href = '/';
            } else if (currentUser.role !== user.role || currentUser.isActive !== user.isActive) {
              window.location.reload();
            }
                     } catch {
             // No hacer nada en caso de error
           }
        };
        checkRole();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, user, dbService]);
} 