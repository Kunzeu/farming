'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDatabase } from '@/hooks/useDatabase';

export function useRoleCheck() {
  const { user, isAuthenticated } = useAuth();
  const { dbService } = useDatabase();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingChange = useRef(false);

  const checkRole = async () => {
    // Evitar múltiples verificaciones simultáneas
    if (isProcessingChange.current || !user) {
      return;
    }

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

      // Obtener el usuario actual del localStorage para comparar
      const storedUserStr = localStorage.getItem('gw2_user');
      const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
      
      // Verificar si el rol cambió comparando con localStorage
      if (storedUser && currentUser.role !== storedUser.role) {
        isProcessingChange.current = true;
        
        // Actualizar el localStorage con el nuevo rol
        const updatedUser = { ...storedUser, role: currentUser.role };
        localStorage.setItem('gw2_user', JSON.stringify(updatedUser));
        
        // Recargar la página para aplicar el nuevo rol
        window.location.reload();
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
          // Usuario reactivado, actualizar localStorage
          const updatedUser = { ...storedUser, isActive: currentUser.isActive };
          localStorage.setItem('gw2_user', JSON.stringify(updatedUser));
          window.location.reload();
          return;
        }
      }
    } catch (error) {
      // No hacer nada en caso de error, mantener la sesión actual
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user || !dbService) {
      return;
    }

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
      if (!document.hidden && !isProcessingChange.current) {
        // Solo verificar si no se está procesando un cambio
        checkRole();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, user, dbService]);
} 