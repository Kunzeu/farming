'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDatabase } from '@/hooks/useDatabase';

export function useRoleCheck() {
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const { dbService } = useDatabase();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingChange = useRef(false);

  const checkRole = useCallback(async () => {
    // Evitar múltiples verificaciones simultáneas
    if (isProcessingChange.current || !user) {
      return;
    }

    try {
      // Verificar que el usuario aún esté autenticado antes de hacer la consulta
      if (!localStorage.getItem('gw2_token') || !localStorage.getItem('gw2_user')) {
        return;
      }

      // Usar summary ligero en lugar de descargar el usuario completo
      const resp = await fetch(`/api/users/${user.id}/summary`, { cache: 'no-store' });
      if (!resp.ok) return;
      const summary = await resp.json();
      const currentUser = { role: summary.role as string, isActive: Boolean(summary.isActive) };
      
      if (!currentUser) {
        // El usuario fue eliminado, limpiar localStorage y redirigir al login
        localStorage.removeItem('gw2_token');
        localStorage.removeItem('gw2_user');
        window.location.href = '/';
        return;
      }

      // Obtener el usuario actual del localStorage para comparar
      const storedUserStr = localStorage.getItem('gw2_user');
      const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
      
      // Verificar si el rol cambió comparando con localStorage
      if (storedUser && currentUser.role !== storedUser.role) {
        isProcessingChange.current = true;
        
        // Actualizar el contexto sin recargar la página - refreshUserData actualizará localStorage
        await refreshUserData();
        
        // Resetear el flag después de un breve delay
        setTimeout(() => {
          isProcessingChange.current = false;
        }, 1000);
        return;
      }

      // Verificar si el estado activo cambió
      if (storedUser && currentUser.isActive !== storedUser.isActive) {
        isProcessingChange.current = true;
        
        if (!currentUser.isActive) {
          // Usuario desactivado, redirigir al login
          localStorage.removeItem('gw2_token');
          localStorage.removeItem('gw2_user');
          window.location.href = '/';
          return;
        } else {
          // Usuario reactivado, actualizar el contexto
          await refreshUserData();
          
          // Resetear el flag después de un breve delay
          setTimeout(() => {
            isProcessingChange.current = false;
          }, 1000);
          return;
        }
      }
    } catch {
      // No hacer nada en caso de error, mantener la sesión actual
    }
  }, [user, dbService, refreshUserData]);

  useEffect(() => {
    if (!isAuthenticated || !user || !dbService) {
      return;
    }

    // Verificar inmediatamente al montar
    checkRole();

    // Configurar intervalo de 60 segundos
    intervalRef.current = setInterval(checkRole, 60000);

    // Limpiar intervalo al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, user, dbService, checkRole]);

  // También verificar cuando la ventana vuelve a estar activa
  useEffect(() => {
    if (!isAuthenticated || !user || !dbService) {
      return;
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && !isProcessingChange.current) {
        // Solo verificar si no se está procesando un cambio
        checkRole();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, user, dbService, checkRole]);
} 