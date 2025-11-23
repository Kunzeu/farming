'use client';

import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDatabase } from '@/hooks/useDatabase';

// Singleton para evitar múltiples intervals activos
let globalIntervalRef: NodeJS.Timeout | null = null;
let globalVisibilityTimeout: NodeJS.Timeout | null = null;
let lastVisibilityCheck = 0;
let lastRoleCheck = 0;
let isGloballyProcessing = false;
let activeInstances = 0;

// Cache en memoria para evitar llamadas innecesarias
const CACHE_DURATION = 600000; // 10 minutos de caché

export function useRoleCheck() {
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const { dbService } = useDatabase();

  const checkRole = useCallback(async () => {
    // Evitar múltiples verificaciones simultáneas usando flag global
    if (isGloballyProcessing || !user) {
      return;
    }

    // Verificar caché primero - no hacer petición si es reciente
    const now = Date.now();
    if (now - lastRoleCheck < CACHE_DURATION) {
      // Caché aún válido, no hacer petición
      return;
    }

    isGloballyProcessing = true;
    
    try {
      // Verificar que el usuario aún esté autenticado antes de hacer la consulta
      if (!localStorage.getItem('gw2_token') || !localStorage.getItem('gw2_user')) {
        isGloballyProcessing = false;
        return;
      }

      // Usar summary ligero en lugar de descargar el usuario completo
      const resp = await fetch(`/api/users/${user.id}/summary`, { cache: 'no-store' });
      if (!resp.ok) {
        isGloballyProcessing = false;
        return;
      }
      const summary = await resp.json();
      const currentUser = { role: summary.role as string, isActive: Boolean(summary.isActive) };
      
      // Actualizar timestamp de última verificación exitosa
      lastRoleCheck = Date.now();
      
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
        // Actualizar el contexto sin recargar la página - refreshUserData actualizará localStorage
        await refreshUserData();
        
        // Resetear el flag después de un breve delay
        setTimeout(() => {
          isGloballyProcessing = false;
        }, 1000);
        return;
      }

      // Verificar si el estado activo cambió
      if (storedUser && currentUser.isActive !== storedUser.isActive) {
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
            isGloballyProcessing = false;
          }, 1000);
          return;
        }
      }
      
      // Todo OK, resetear flag
      isGloballyProcessing = false;
    } catch {
      // No hacer nada en caso de error, mantener la sesión actual
      isGloballyProcessing = false;
    }
  }, [user, refreshUserData]);

  useEffect(() => {
    if (!isAuthenticated || !user || !dbService) {
      return;
    }

    // Incrementar contador de instancias activas
    activeInstances++;

    // Solo ejecutar checkRole y crear interval si es la primera instancia
    if (activeInstances === 1) {
      // Verificar solo si no hay caché reciente (evitar petición innecesaria al montar)
      const now = Date.now();
      if (now - lastRoleCheck >= CACHE_DURATION) {
        checkRole();
      }

      // Configurar intervalo de 15 minutos solo una vez (reducir de 5 a 15 minutos)
      if (!globalIntervalRef) {
        globalIntervalRef = setInterval(checkRole, 900000); // 15 minutos
      }
    }

    // Limpiar al desmontar
    return () => {
      activeInstances--;
      
      // Solo limpiar el interval cuando no queden instancias activas
      if (activeInstances === 0 && globalIntervalRef) {
        clearInterval(globalIntervalRef);
        globalIntervalRef = null;
      }
    };
  }, [isAuthenticated, user, dbService, checkRole]);

  // También verificar cuando la ventana vuelve a estar activa (con debouncing agresivo)
  // Solo registrar el listener una vez usando el contador de instancias
  useEffect(() => {
    if (!isAuthenticated || !user || !dbService) {
      return;
    }

    const VISIBILITY_DEBOUNCE_MS = 300000; // 5 minutos mínimo entre llamadas (aumentado de 1 min)

    const handleVisibilityChange = () => {
      if (document.hidden || isGloballyProcessing) {
        return;
      }

      const now = Date.now();
      // Usar el mismo caché que checkRole para máxima eficiencia
      if (now - lastRoleCheck < CACHE_DURATION) {
        return; // Caché aún válido
      }
      
      if (now - lastVisibilityCheck < VISIBILITY_DEBOUNCE_MS) {
        return; // Ignorar si fue hace menos de 5 minutos
      }

      if (globalVisibilityTimeout) {
        clearTimeout(globalVisibilityTimeout);
      }

      globalVisibilityTimeout = setTimeout(() => {
        lastVisibilityCheck = Date.now();
        checkRole();
      }, 3000); // Esperar 3 segundos después de volver a estar visible (aumentado de 2s)
    };

    // Solo añadir listener si es la primera instancia
    if (activeInstances === 1) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      // Solo remover listener si es la última instancia
      if (activeInstances === 0) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (globalVisibilityTimeout) {
          clearTimeout(globalVisibilityTimeout);
          globalVisibilityTimeout = null;
        }
      }
    };
  }, [isAuthenticated, user, dbService, checkRole]);
} 