// Servicio de base de datos local usando IndexedDB
export interface FarmItem {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  estimatedGold?: string; // Mantener para compatibilidad hacia atrás
  estimatedSpirit?: string; // Mantener para compatibilidad hacia atrás
  estimatedRewards: {
    gold?: string;
    spiritShards?: string;
    imperialFavor?: string;
    experience?: string;
    laurels?: string;
    otherCurrency?: string;
  };
  expansion: ('core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw')[]; // Cambiar a array para múltiples expansiones
  isSolo: boolean;
  requiresSquad: boolean;
  waypoint?: string;
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
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string; // ID del usuario que creó el farm
  createdByUsername?: string; // Username del creador (para mostrar)
  order?: number; // Orden de visualización (menor número = más arriba)
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
  gw2ApiKey?: string; // Guild Wars 2 API key
}

class DatabaseService {
  private dbName = 'gw2FarmingHubDB';
  private version = 3; // Incrementar versión para agregar discordId
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crear object store para farms
        if (!db.objectStoreNames.contains('farms')) {
          const farmsStore = db.createObjectStore('farms', { keyPath: 'id' });
          farmsStore.createIndex('expansion', 'expansion', { unique: false });
          farmsStore.createIndex('type', 'type', { unique: false });
        }

        // Crear object store para usuarios
        if (!db.objectStoreNames.contains('users')) {
          const usersStore = db.createObjectStore('users', { keyPath: 'id' });
          usersStore.createIndex('email', 'email', { unique: true });
          usersStore.createIndex('username', 'username', { unique: true });
          usersStore.createIndex('role', 'role', { unique: false });
          usersStore.createIndex('discordId', 'discordId', { unique: true });
        }
      };
    });
  }

  // Métodos para farms
  async getAllFarms(): Promise<FarmItem[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['farms'], 'readonly');
      const store = transaction.objectStore('farms');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const farms = request.result.map((farm: FarmItem) => ({
          ...farm,
          createdAt: new Date(farm.createdAt),
          updatedAt: new Date(farm.updatedAt)
        }));
        resolve(farms);
      };
    });
  }

  async createFarm(farm: Omit<FarmItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['farms'], 'readwrite');
      const store = transaction.objectStore('farms');
      
      const newFarm: FarmItem = {
        ...farm,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const request = store.add(newFarm);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async updateFarm(farm: FarmItem): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['farms'], 'readwrite');
      const store = transaction.objectStore('farms');
      
      const updatedFarm = {
        ...farm,
        updatedAt: new Date()
      };

      const request = store.put(updatedFarm);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteFarm(id: string): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['farms'], 'readwrite');
      const store = transaction.objectStore('farms');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async resetDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.dbName);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async migrateDifficultyToExpansion(): Promise<void> {
    const farms = await this.getAllFarms();
    for (const farm of farms) {
      if ((farm as FarmItem & { difficulty?: string }).difficulty) {
        const difficulty = (farm as FarmItem & { difficulty?: string }).difficulty;
        let expansion = 'core';
        
        switch (difficulty) {
          case 'easy':
            expansion = 'core';
            break;
          case 'medium':
            expansion = 'hot';
            break;
          case 'hard':
            expansion = 'pof';
            break;
        }
        
        await this.updateFarm({ ...farm, expansion: [expansion] as FarmItem['expansion'] });
      }
    }
  }

  // Métodos para usuarios
  async getAllUsers(): Promise<User[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const users = request.result.map((user: User) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }));
        resolve(users);
      };
    });
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      
      const newUser: User = {
        ...user,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const request = store.add(newUser);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async updateUser(user: User): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      
      const updatedUser = {
        ...user,
        updatedAt: new Date()
      };

      const request = store.put(updatedUser);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');
      const request = index.get(email);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const user = request.result;
        if (user) {
          resolve({
            ...user,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          });
        } else {
          resolve(null);
        }
      };
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('username');
      const request = index.get(username);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const user = request.result;
        if (user) {
          resolve({
            ...user,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          });
        } else {
          resolve(null);
        }
      };
    });
  }

  async getUserByDiscordId(discordId: string): Promise<User | null> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('discordId');
      const request = index.get(discordId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const user = request.result;
        if (user) {
          resolve({
            ...user,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          });
        } else {
          resolve(null);
        }
      };
    });
  }
}

export const dbService = new DatabaseService(); 