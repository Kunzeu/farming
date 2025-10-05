'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { validatePasswordStrength } from '@/lib/password-utils';


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
  logout: () => void;
  clearError: () => void;
  hasPermission: (role: 'admin' | 'moderator' | 'user') => boolean;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider interno que usa hooks
function AuthProviderInternal({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

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

      const token = 'jwt_token_' + Date.now();

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
      // Simulación de API - en producción esto sería una llamada real
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Basic validation
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(credentials.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }

      // Verificar si es el primer usuario para hacerlo admin
      const { getDbService: getDbServiceForCheck } = await import('@/lib/database-switch');
      const dbServiceForCheck = await getDbServiceForCheck();
      const existingUsers = await dbServiceForCheck.getAllUsers();
      
      const isFirstUser = existingUsers.length === 0;
      
      // Primero crear en base de datos para validar duplicados
      const { getDbService } = await import('@/lib/database-switch');
      const dbService = await getDbService();
      
      const createdUser = await dbService.createUser({
        email: credentials.email,
        username: credentials.username,
        password: credentials.password, // Will be hashed server-side
        role: isFirstUser ? 'admin' : 'user',
        isActive: true
      });

      // Solo si la creación fue exitosa, proceder con el login
      const mockUser: User = {
        ...createdUser,
        joinDate: createdUser.createdAt?.toISOString() || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          language: 'es',
          notifications: {
            priceAlerts: true,
            eventReminders: true,
            buildUpdates: false
          }
        },
        isAdmin: createdUser.role === 'admin'
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Guardar en localStorage solo después de éxito en BD
      localStorage.setItem('gw2_token', mockToken);
      localStorage.setItem('gw2_user', JSON.stringify(mockUser));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: mockUser, token: mockToken },
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

      const token = 'discord_jwt_token_' + Date.now();

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

  const value: AuthContextType = {
    ...state,
    login,
    register,
    loginWithDiscord,
    logout,
    clearError,
    hasPermission,
    updateUser,
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
        logout: () => {},
        clearError: () => {},
        hasPermission: () => false,
        updateUser: async () => {},
      };
    }
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 