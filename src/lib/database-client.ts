// Cliente para API de base de datos (funciona en browser)
export interface FarmItem {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  estimatedGold: string;
  expansion: 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw';
  selected: boolean;
  createdAt: Date;
  updatedAt: Date;
  map?: string;
  requirements?: string[];
  tags?: string[];
  waypoints?: Array<{
    name: string;
    coordinates: [number, number];
    description: string;
  }>;
  type: 'farm' | 'route';
}

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
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
    console.log('✅ Database client ready');
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

  async createFarm(farm: Omit<FarmItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<FarmItem> {
    const response = await fetch('/api/farms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(farm),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create farm');
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
      throw new Error('Failed to update farm');
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
      throw new Error('Failed to delete farm');
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

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
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
}

export const dbClientService = new DatabaseClientService(); 