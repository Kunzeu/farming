'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '@/types/auth';


// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  invalidationMessage: null,
};

// Tipos de acciones
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'REFRESH_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        invalidationMessage: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        invalidationMessage: null,
      };
    case 'REFRESH_USER':
      return {
        ...state,
        user: action.payload,
        invalidationMessage: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
        invalidationMessage: null,
      };
    default:
      return state;
  }
}

// Contexto
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginWithDiscord: (code: string) => Promise<void>;
  loginWithPatreon: (code: string) => Promise<void>;
  linkPatreon: (code: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hasPermission: (role: 'admin' | 'moderator' | 'user') => boolean;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider interno que usa hooks
function AuthProviderInternal({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();
  const lastInteractionRef = useRef<number>(Date.now());

  // Verificar token al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('gw2_token');
      const userData = localStorage.getItem('gw2_user');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token },
          });
        } catch {
          localStorage.removeItem('gw2_token');
          localStorage.removeItem('gw2_user');
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  // Función de login
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Create user object
      const user: User = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        isActive: data.user.isActive,
        joinDate: data.user.createdAt ? (typeof data.user.createdAt === 'string' ? data.user.createdAt : data.user.createdAt.toISOString()) : new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isAdmin: data.user.role === 'admin',
        preferences: data.user.preferences
      };

      // Use the JWT token from the server response
      const token = data.token;

      // Guardar en localStorage
      localStorage.setItem('gw2_token', token);
      localStorage.setItem('gw2_user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });

    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Authentication error',
      });
    }
  }, []);

  // Función de registro
  const register = useCallback(async (credentials: RegisterCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Llamar a la API de registro real
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Crear objeto de usuario
      const user: User = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        isActive: data.user.isActive,
        joinDate: data.user.createdAt ? (typeof data.user.createdAt === 'string' ? data.user.createdAt : data.user.createdAt.toISOString()) : new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isAdmin: data.user.role === 'admin',
        preferences: {
          theme: 'dark',
          language: 'es',
          notifications: {
            priceAlerts: true,
            eventReminders: true,
            buildUpdates: false
          }
        }
      };

      // Usar el JWT token real del servidor
      const token = data.token;

      // Guardar en localStorage
      localStorage.setItem('gw2_token', token);
      localStorage.setItem('gw2_user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      // Limpiar localStorage en caso de error
      localStorage.removeItem('gw2_token');
      localStorage.removeItem('gw2_user');
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Registration error',
      });
    }
  }, []);

  // Función de logout
  const logout = useCallback(() => {
    localStorage.removeItem('gw2_token');
    localStorage.removeItem('gw2_user');
    dispatch({ type: 'AUTH_LOGOUT' });
    
    // Redirigir a la página principal
    router.push('/');
  }, [router]);

  // Función de login/registro con Patreon
  const loginWithPatreon = useCallback(async (code: string) => {
    dispatch({ type: 'AUTH_START' });

    try {
      console.log('Starting Patreon login with code:', code.substring(0, 10) + '...');
      
      // Intercambiar el código por un token de acceso
      const tokenResponse = await fetch('/api/auth/patreon/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error('Patreon token error:', errorData);
        throw new Error(errorData.error || 'Error al obtener token de Patreon');
      }

      const { access_token } = await tokenResponse.json();
      console.log('Patreon token obtained successfully');

      // Obtener información del usuario de Patreon y su membresía
      const identityResponse = await fetch('/api/auth/patreon/identity', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!identityResponse.ok) {
        const errorData = await identityResponse.text();
        console.error('Patreon identity error:', errorData);
        throw new Error('Error al obtener información del usuario');
      }

      const patreonData = await identityResponse.json();
      const patreonUser = patreonData.data;
      const included = patreonData.included || [];
      
      console.log('Patreon user info obtained:', { 
        id: patreonUser.id, 
        email: patreonUser.attributes.email,
        full_name: patreonUser.attributes.full_name 
      });

      // Extraer información de la membresía
      let patreonStatus = null;
      let patreonTier = null;
      
      // Buscar la membresía activa
      const membership = included.find((item: any) => item.type === 'member');
      if (membership && membership.attributes) {
        patreonStatus = membership.attributes.patron_status;
        
        // Buscar el tier
        const tierRelationship = membership.relationships?.currently_entitled_tiers?.data?.[0];
        if (tierRelationship) {
          const tier = included.find((item: any) => 
            item.type === 'tier' && item.id === tierRelationship.id
          );
          if (tier) {
            patreonTier = tier.attributes.title;
          }
        }
      }

      // Buscar o crear usuario en la base de datos
      const { getDbService } = await import('@/lib/database-switch');
      const dbService = await getDbService();

      // Buscar usuario existente por Patreon ID
      console.log('Searching for user with Patreon ID:', patreonUser.id);
      let dbUser = await dbService.getUserByPatreonId(patreonUser.id);

      if (!dbUser) {
        console.log('User not found, creating new user...');
        // Crear nuevo usuario
        const createdUser = await dbService.createUser({
          email: patreonUser.attributes.email,
          username: patreonUser.attributes.vanity || patreonUser.attributes.full_name || `patreon_${patreonUser.id}`,
          patreonId: patreonUser.id,
          patreonTier: patreonTier,
          patreonStatus: patreonStatus,
          role: 'user',
          isActive: true,
        });
        
        console.log('User created successfully:', createdUser.id);
        dbUser = createdUser;
      } else {
        console.log('Existing user found:', dbUser.id);
        // Actualizar información de Patreon
        dbUser = await dbService.updateUser(dbUser.id, {
          patreonTier: patreonTier,
          patreonStatus: patreonStatus,
        });
      }

      if (!dbUser) {
        throw new Error('Error al crear/obtener usuario de Patreon');
      }

      // Crear objeto de usuario para el contexto
      const user: User = {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        isActive: dbUser.isActive,
        joinDate: dbUser.createdAt?.toISOString() || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isAdmin: dbUser.role === 'admin',
        patreonId: patreonUser.id,
        patreonTier: patreonTier,
        patreonStatus: patreonStatus,
        preferences: {
          theme: 'dark',
          language: 'es',
          notifications: {
            priceAlerts: true,
            eventReminders: true,
            buildUpdates: false
          }
        }
      };

      // Generar token JWT (similar al login con Discord)
      const token = 'temp_patreon_token_' + Date.now();

      // Guardar en localStorage
      localStorage.setItem('gw2_token', token);
      localStorage.setItem('gw2_user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });

    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Patreon authentication error',
      });
    }
  }, []);

  // Función para vincular cuenta de Patreon a usuario existente
  const linkPatreon = useCallback(async (code: string) => {
    if (!state.user) {
      throw new Error('Debes iniciar sesión primero');
    }

    try {
      console.log('Linking Patreon account with code:', code.substring(0, 10) + '...');
      
      // Intercambiar el código por un token de acceso
      const tokenResponse = await fetch('/api/auth/patreon/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error('Patreon token error:', errorData);
        throw new Error(errorData.error || 'Error al obtener token de Patreon');
      }

      const { access_token } = await tokenResponse.json();
      console.log('Patreon token obtained successfully');

      // Obtener información del usuario de Patreon
      const identityResponse = await fetch('/api/auth/patreon/identity', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!identityResponse.ok) {
        const errorData = await identityResponse.text();
        console.error('Patreon identity error:', errorData);
        throw new Error('Error al obtener información del usuario');
      }

      const patreonData = await identityResponse.json();
      const patreonUser = patreonData.data;
      const included = patreonData.included || [];
      
      console.log('Patreon user info obtained for linking:', { 
        id: patreonUser.id, 
        email: patreonUser.attributes.email 
      });

      // Extraer información de la membresía
      let patreonStatus = null;
      let patreonTier = null;
      
      const membership = included.find((item: any) => item.type === 'member');
      if (membership && membership.attributes) {
        patreonStatus = membership.attributes.patron_status;
        
        const tierRelationship = membership.relationships?.currently_entitled_tiers?.data?.[0];
        if (tierRelationship) {
          const tier = included.find((item: any) => 
            item.type === 'tier' && item.id === tierRelationship.id
          );
          if (tier) {
            patreonTier = tier.attributes.title;
          }
        }
      }

      // Actualizar usuario actual con información de Patreon
      await updateUser({
        patreonId: patreonUser.id,
        patreonTier: patreonTier,
        patreonStatus: patreonStatus,
      });

      console.log('Patreon account linked successfully');

    } catch (error) {
      console.error('Error linking Patreon:', error);
      throw error;
    }
  }, [state.user, updateUser]);

  // Función de login con Discord
  const loginWithDiscord = useCallback(async (code: string) => {
    dispatch({ type: 'AUTH_START' });

    try {
      console.log('Starting Discord login with code:', code.substring(0, 10) + '...');
      
      // Intercambiar el código por un token de acceso
      const tokenResponse = await fetch('/api/auth/discord/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error('Discord token error:', errorData);
        throw new Error(errorData.error || 'Error al obtener token de Discord');
      }

      const { access_token } = await tokenResponse.json();
      console.log('Discord token obtained successfully');

      // Obtener información del usuario de Discord
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.text();
        console.error('Discord user info error:', errorData);
        throw new Error('Error al obtener información del usuario');
      }

      const discordUser = await userResponse.json();
      console.log('Discord user info obtained:', { id: discordUser.id, username: discordUser.username, email: discordUser.email });
  

      // Buscar o crear usuario en la base de datos
      const { getDbService } = await import('@/lib/database-switch');
      const dbService = await getDbService();

      // Buscar usuario existente por Discord ID
      console.log('Searching for user with Discord ID:', discordUser.id);
      let dbUser = await dbService.getUserByDiscordId(discordUser.id);
      

      if (!dbUser) {
        console.log('User not found, creating new user...');
        // Crear nuevo usuario
        const createdUser = await dbService.createUser({
          email: discordUser.email,
          username: discordUser.username,
          discordId: discordUser.id,
          role: 'user',
          isActive: true,
        });
        
        console.log('User created successfully:', createdUser.id);
        // Usar el usuario recién creado
        dbUser = createdUser;
      } else {
        console.log('Existing user found:', dbUser.id);
      }

      if (!dbUser) {
        throw new Error('Error al crear/obtener usuario de Discord');
      }

      // Crear objeto de usuario para el contexto
      const user: User = {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        isActive: dbUser.isActive,
        joinDate: dbUser.createdAt?.toISOString() || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isAdmin: dbUser.role === 'admin',
        discordId: discordUser.id,
        preferences: {
          theme: 'dark',
          language: 'es',
          notifications: {
            priceAlerts: true,
            eventReminders: true,
            buildUpdates: false
          }
        }
      };

      // Para Discord login, también necesitaríamos generar un token JWT real
      // Por ahora, usamos un token temporal
      const token = 'temp_discord_token_' + Date.now();

      // Guardar en localStorage
      localStorage.setItem('gw2_token', token);
      localStorage.setItem('gw2_user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });

    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Discord authentication error',
      });
    }
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Función para verificar permisos
  const hasPermission = useCallback((role: 'admin' | 'moderator' | 'user'): boolean => {
    if (!state.user) return false;
    
    // Admin tiene todos los permisos
    if (state.user.role === 'admin') return true;
    
    // Moderator tiene permisos de moderator y user
    if (state.user.role === 'moderator') {
      return role === 'moderator' || role === 'user';
    }
    
    // User solo tiene permisos de user
    if (state.user.role === 'user') {
      return role === 'user';
    }
    
    return false;
  }, [state.user]);

  // Función para actualizar usuario
  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return;

    try {
      const { getDbService } = await import('@/lib/database-switch');
      const dbService = await getDbService();

      // Actualizar en la base de datos
      const updatedUser = await dbService.updateUser(state.user.id, updates);

      // Actualizar en el contexto
      const newUser = {
        ...state.user,
        ...updatedUser
      };

      // Guardar en localStorage
      localStorage.setItem('gw2_user', JSON.stringify(newUser));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: newUser, token: state.token || '' }
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [state.user, state.token]);

  // Función para refrescar datos del usuario desde la base de datos
  const refreshUserData = useCallback(async () => {
    if (!state.user) return;

    try {
      const response = await fetch(`/api/users/${state.user.id}?full=true`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        }
      });

      if (!response.ok) {
        // Si el usuario no existe o fue desactivado, hacer logout
        if (response.status === 404 || response.status === 403) {
          localStorage.removeItem('gw2_token');
          localStorage.removeItem('gw2_user');
          dispatch({ type: 'AUTH_LOGOUT' });
          return;
        }
        throw new Error('Failed to refresh user data');
      }

      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safeUser } = data;
      
      const refreshedUser: User = {
        ...state.user,
        email: safeUser.email,
        username: safeUser.username,
        role: safeUser.role,
        isActive: safeUser.isActive,
        discordId: safeUser.discordId,
        gw2ApiKey: safeUser.gw2ApiKey,
        patreonId: safeUser.patreonId,
        patreonTier: safeUser.patreonTier,
        patreonStatus: safeUser.patreonStatus,
        preferences: safeUser.preferences,
        isAdmin: safeUser.role === 'admin',
        joinDate: state.user.joinDate,
        lastLogin: state.user.lastLogin,
      };

      // Actualizar localStorage
      localStorage.setItem('gw2_user', JSON.stringify(refreshedUser));

      // Verificar si el usuario fue desactivado
      const wasActive = state.user.isActive;
      const nowActive = refreshedUser.isActive;

      // Solo hacer logout si el usuario fue desactivado
      if (wasActive && !nowActive) {
        localStorage.removeItem('gw2_token');
        localStorage.removeItem('gw2_user');
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }

      // Actualizar el contexto con los nuevos datos (incluso si cambió el rol)
      dispatch({
        type: 'REFRESH_USER',
        payload: refreshedUser
      });
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }, [state.user]);

  // Verificar y refrescar datos del usuario periódicamente
  useEffect(() => {
    if (!state.isAuthenticated || !state.user) return;

    // Verificar cada 30 segundos si los datos del usuario han cambiado
    const interval = setInterval(() => {
      refreshUserData();
    }, 30000);

    // Verificar cuando el usuario vuelve a la pestaña (onFocus)
    const handleFocus = () => {
      refreshUserData();
    };

    // Verificar cuando hay interacción del usuario (cualquier click o tecla)
    const handleUserInteraction = () => {
      // Debounce: solo ejecutar una vez cada 5 segundos
      const now = Date.now();
      if (now - lastInteractionRef.current > 5000) {
        lastInteractionRef.current = now;
        refreshUserData();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [state.isAuthenticated, state.user, refreshUserData]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    loginWithDiscord,
    loginWithPatreon,
    linkPatreon,
    logout,
    clearError,
    hasPermission,
    updateUser,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Provider público que maneja hidratación
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Verificar si estamos en el cliente
  const isClient = typeof window !== 'undefined';

  if (!isClient) {
    // En el servidor, renderizar sin contexto
    return <>{children}</>;
  }

  // En el cliente, renderizar con contexto completo
  return <AuthProviderInternal>{children}</AuthProviderInternal>;
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Si no hay contexto (servidor), devolver estado inicial
    if (typeof window === 'undefined') {
      return {
        ...initialState,
        login: async () => {},
        register: async () => {},
        loginWithDiscord: async () => {},
        loginWithPatreon: async () => {},
        linkPatreon: async () => {},
        logout: () => {},
        clearError: () => {},
        hasPermission: () => false,
        updateUser: async () => {},
        refreshUserData: async () => {},
      };
    }
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 