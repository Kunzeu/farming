'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '@/types/auth';

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
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
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
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
      // Autenticar con la base de datos
      const { getDbService } = await import('@/lib/database-switch');
      const dbService = await getDbService();

      // Buscar usuario por email
      const dbUser = await dbService.getUserByEmail(credentials.email);
      
      if (dbUser && dbUser.password === credentials.password && dbUser.isActive) {
        // Usuario encontrado en la base de datos
        const user: User = {
          id: dbUser.id,
          username: dbUser.username,
          email: dbUser.email,
          role: dbUser.role,
          isActive: dbUser.isActive,
          joinDate: dbUser.createdAt?.toISOString(),
          lastLogin: new Date().toISOString(),
          isAdmin: dbUser.role === 'admin',
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

        const token = 'jwt_token_' + Date.now();

        // Guardar en localStorage
        localStorage.setItem('gw2_token', token);
        localStorage.setItem('gw2_user', JSON.stringify(user));

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        });

        return;
      }

      // Si no se encuentra el usuario o credenciales incorrectas
      throw new Error('Credenciales inválidas');

    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Error de autenticación',
      });
    }
  }, []);

  // Función de registro
  const register = useCallback(async (credentials: RegisterCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Simulación de API - en producción esto sería una llamada real
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validación básica
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (credentials.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
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
        password: credentials.password,
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
        payload: error instanceof Error ? error.message : 'Error de registro',
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
      // Intercambiar el código por un token de acceso
      const tokenResponse = await fetch('/api/auth/discord/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Error al obtener token de Discord');
      }

      const { access_token } = await tokenResponse.json();

      // Obtener información del usuario de Discord
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Error al obtener información del usuario');
      }

      const discordUser = await userResponse.json();
      console.log('Discord user data:', discordUser);

      // Buscar o crear usuario en la base de datos
      const { getDbService } = await import('@/lib/database-switch');
      const dbService = await getDbService();

      // Buscar usuario existente por Discord ID
      let dbUser = await dbService.getUserByDiscordId(discordUser.id);
      console.log('Existing user found:', dbUser);

      if (!dbUser) {
        console.log('Creating new user with Discord ID:', discordUser.id);
        // Crear nuevo usuario
        const createdUser = await dbService.createUser({
          email: discordUser.email,
          username: discordUser.username,
          discordId: discordUser.id,
          role: 'user',
          isActive: true,
        });
        
        console.log('User created successfully:', createdUser);
        // Usar el usuario recién creado
        dbUser = createdUser;
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
        payload: error instanceof Error ? error.message : 'Error de autenticación con Discord',
      });
    }
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    loginWithDiscord,
    logout,
    clearError,
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
      };
    }
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 