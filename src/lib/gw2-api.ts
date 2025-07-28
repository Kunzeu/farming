import axios from 'axios';
import { GW2Item, GW2Price, GW2World, GW2Event, GW2Build, GW2Recipe } from '@/types/gw2';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Cliente axios configurado para GW2 API
const gw2Api = axios.create({
  baseURL: GW2_API_BASE,
  timeout: 10000,
});

// Funciones para obtener datos de items
export async function getItem(id: number): Promise<GW2Item> {
  try {
    const response = await gw2Api.get<GW2Item>(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    throw error;
  }
}

export async function getItems(ids: number[]): Promise<GW2Item[]> {
  try {
    const response = await gw2Api.get<GW2Item[]>(`/items?ids=${ids.join(',')}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

// Funciones para obtener precios del Trading Post
export async function getItemPrice(id: number): Promise<GW2Price> {
  try {
    const response = await gw2Api.get<GW2Price>(`/commerce/prices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching price for item ${id}:`, error);
    throw error;
  }
}

export async function getItemPrices(ids: number[]): Promise<GW2Price[]> {
  try {
    const response = await gw2Api.get<GW2Price[]>(`/commerce/prices?ids=${ids.join(',')}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

// Funciones para obtener información de mundos
export async function getWorlds(): Promise<GW2World[]> {
  try {
    const response = await gw2Api.get<GW2World[]>('/worlds?ids=all');
    return response.data;
  } catch (error) {
    console.error('Error fetching worlds:', error);
    throw error;
  }
}

export async function getWorld(id: number): Promise<GW2World> {
  try {
    const response = await gw2Api.get<GW2World>(`/worlds/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching world ${id}:`, error);
    throw error;
  }
}

// Funciones para obtener eventos mundiales
export async function getWorldEvents(): Promise<GW2Event[]> {
  try {
    const response = await gw2Api.get<GW2Event[]>('/events?world=1001&map_id=15');
    return response.data;
  } catch (error) {
    console.error('Error fetching world events:', error);
    throw error;
  }
}

// Funciones para obtener builds
export async function getBuilds(): Promise<GW2Build[]> {
  try {
    const response = await gw2Api.get<GW2Build[]>(`/build`);
    return response.data;
  } catch (error) {
    console.error('Error fetching builds:', error);
    throw error;
  }
}

// Funciones para obtener recetas
export async function getRecipe(id: number): Promise<GW2Recipe> {
  try {
    const response = await gw2Api.get<GW2Recipe>(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    throw error;
  }
}

export async function getRecipes(ids: number[]): Promise<GW2Recipe[]> {
  try {
    const response = await gw2Api.get<GW2Recipe[]>(`/recipes?ids=${ids.join(',')}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

// Función para buscar items por nombre
export async function searchItems(query: string): Promise<GW2Item[]> {
  try {
    // Primero obtenemos todos los IDs de items
    const allItemsResponse = await gw2Api.get<number[]>('/items');
    const allItemIds = allItemsResponse.data;
    
    // Limitamos a los primeros 100 para evitar sobrecarga
    const limitedIds = allItemIds.slice(0, 100);
    
    // Obtenemos los items
    const items = await getItems(limitedIds);
    
    // Filtramos por nombre
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
}

// Función para obtener items populares para farming
export async function getPopularFarmingItems(): Promise<GW2Item[]> {
  // IDs de items populares para farming
  const popularItemIds = [
    19721, // Orichalcum Ore
    19724, // Ancient Wood Log
    19725, // Elder Wood Log
    19726, // Hard Wood Log
    19727, // Seasoned Wood Log
    19728, // Soft Wood Log
    19729, // Green Wood Log
    19730, // Iron Ore
    19731, // Platinum Ore
    19732, // Gold Ore
    19733, // Silver Ore
    19734, // Copper Ore
    19735, // Mithril Ore
    19736, // Orichalcum Ore
    19737, // Rich Platinum Ore
    19738, // Rich Iron Ore
    19739, // Rich Gold Ore
    19740, // Rich Silver Ore
    19741, // Rich Copper Ore
    19742, // Rich Mithril Ore
  ];
  
  try {
    return await getItems(popularItemIds);
  } catch (error) {
    console.error('Error fetching popular farming items:', error);
    throw error;
  }
}

// Función para calcular el margen de ganancia
export function calculateProfitMargin(buyPrice: number, sellPrice: number): number {
  if (buyPrice === 0) return 0;
  return ((sellPrice - buyPrice) / buyPrice) * 100;
}

// Función para formatear precios en oro, plata y cobre
export function formatPrice(copper: number): string {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const copperRemaining = copper % 100;
  
  let result = '';
  if (gold > 0) result += `${gold}g `;
  if (silver > 0) result += `${silver}s `;
  if (copperRemaining > 0) result += `${copperRemaining}c`;
  
  return result.trim();
} 