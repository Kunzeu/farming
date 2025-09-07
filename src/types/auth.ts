export interface User {
  id: string;
  email: string;
  username: string;
  password?: string; // Opcional para compatibilidad
  role?: 'user' | 'admin' | 'moderator'; // Opcional para compatibilidad
  createdAt?: Date; // Opcional para compatibilidad
  updatedAt?: Date; // Opcional para compatibilidad
  isActive?: boolean; // Opcional para compatibilidad
  joinDate?: string; // Para compatibilidad con el contexto actual
  lastLogin?: string; // Para compatibilidad con el contexto actual
  preferences?: UserPreferences; // Para compatibilidad con el contexto actual
  isAdmin?: boolean; // Para compatibilidad con el contexto actual
  discordId?: string; // Discord ID for OAuth authentication
}

export interface UserPreferences {
  theme?: 'dark' | 'light' | 'auto';
  language?: 'es' | 'en';
  notifications?: {
    priceAlerts: boolean;
    eventReminders: boolean;
    buildUpdates: boolean;
  };
  favoriteItems?: string[];
  favoriteRoutes?: string[];
  dashboard?: {
    layout?: 'grid' | 'list';
    cardOrder?: string[];
    hiddenCards?: string[];
    cardSizes?: Record<string, 'small' | 'medium' | 'large'>;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  invalidationMessage: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: Date;
} 