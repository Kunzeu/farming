// Cliente para API de base de datos (funciona en browser)
export interface FarmItem {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  estimatedRewards: {
    gold?: string;
    spiritShards?: string;
    karma?: string;
    fractalRelics?: string;
    volatileMagic?: string;
    unboundMagic?: string;
    riftEssences?: string;
    mysticClovers?: string;
    imperialFavor?: string;
  };
  expansion: ('core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw')[];
  isSolo: boolean;
  requiresSquad: boolean;
  waypoint?: string;
  selected: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string; // ID del usuario que creó el farm
  createdByUsername?: string; // Username del creador (para mostrar)
  // Campos para compatibilidad hacia atrás
  estimatedGold?: string;
  estimatedSpirit?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  password?: string; // Opcional para usuarios de Discord
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  discordId?: string; // ID de Discord para autenticación OAuth
  preferences?: {
    theme?: 'dark' | 'light' | 'auto';
    language?: 'es' | 'en';
    notifications?: {
      priceAlerts: boolean;
      eventReminders: boolean;
      buildUpdates: boolean;
    };
  };
}

class DatabaseClientService {
  async init(): Promise<void> {
    // No need to initialize anything for HTTP client

  }

  // Farm methods
  async getAllFarms(): Promise<FarmItem[]> {
    const response = await fetch('/api/farms');
    if (!response.ok) {
      throw new Error('Failed to fetch farms');
    }
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((farm: any) => ({
      ...farm,
      createdAt: new Date(farm.createdAt),
      updatedAt: new Date(farm.updatedAt)
    }));
  }

  async createFarm(farm: Omit<FarmItem, 'id' | 'createdAt' | 'updatedAt'> & { createdByRole: string }): Promise<FarmItem> {
    const response = await fetch('/api/farms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(farm),
    });
    
    if (!response.ok) {
      let errorMessage = 'Unknown error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.details || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        // Si no se puede parsear como JSON, usar el texto de la respuesta
        const errorText = await response.text();
        errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
      }
      console.error('Error creating farm:', errorMessage);
      throw new Error(`Failed to create farm: ${errorMessage}`);
    }
    
    const data = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  async updateFarm(id: string, updates: Partial<FarmItem>): Promise<FarmItem> {
    
    
    const response = await fetch(`/api/farms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    
    
    if (!response.ok) {
      const errorData = await response.text();
      
      throw new Error(`Failed to update farm: ${response.status} - ${errorData}`);
    }
    
    const data = await response.json();
    
    
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  async deleteFarm(id: string): Promise<void> {
    
    
    const response = await fetch(`/api/farms/${id}`, {
      method: 'DELETE',
    });
    
    
    
    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error(`Failed to delete farm: ${response.status} ${errorText}`);
    }
    
    
  }

  // User methods
  async getAllUsers(): Promise<User[]> {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    }));
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 409) {
        // Error de conflicto - email o username duplicado
        throw new Error(errorData.error || 'Email o username ya existe');
      }
      throw new Error(errorData.error || 'Failed to create user');
    }
    
    const data = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    const data = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  async deleteUser(id: string): Promise<{ farmsDeleted: number; farmsPreserved: number; userRole: string }> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    
    const data = await response.json();
    return {
      farmsDeleted: data.farmsDeleted || 0,
      farmsPreserved: data.farmsPreserved || 0,
      userRole: data.userRole || 'unknown'
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch user');
    }
    
    const data = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const response = await fetch(`/api/users?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch user');
    }
    
    const data = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  async getUserByDiscordId(discordId: string): Promise<User | null> {
    const response = await fetch(`/api/users?discordId=${encodeURIComponent(discordId)}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch user');
    }
    
    const data = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch user by ID');
    }
    
    const data = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  async invalidateUserSession(userId: string, reason: string): Promise<void> {
    const response = await fetch(`/api/users/${userId}/invalidate-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to invalidate user session');
    }
  }
}

export const dbClientService = new DatabaseClientService(); 