export type ResearchNotesSortField =
  | 'craftingLevel'
  | 'level'
  | 'notes'
  | 'buyPrice'
  | 'sellPrice'
  | 'craftingCost'
  | 'pricePerNote';

export interface ResearchNotesCraftingItem {
  id?: number;
  name: string;
  level: number | string;
  notes: number;
  buyPrice?: string;
  sellPrice?: string;
  craftingCost?: string;
}

export interface ResearchNotesItemMeta {
  icon?: string;
  rarity?: string;
}

const CRAFTING_LEVELS: Record<number, number> = {
  8868: 325,
  13436: 300,
  13437: 300,
  13435: 300,
  13438: 325,
  104934: 0,
  104934.1: 0,
};

export function getCraftingLevel(itemId: number): number {
  return CRAFTING_LEVELS[itemId] ?? 0;
}

export function getRarityColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'junk':
      return 'text-gray-400';
    case 'basic':
      return 'text-gray-300';
    case 'fine':
      return 'text-blue-400';
    case 'masterwork':
      return 'text-green-400';
    case 'rare':
      return 'text-yellow-400';
    case 'exotic':
      return 'text-orange-400';
    case 'ascended':
      return 'text-purple-400';
    case 'legendary':
      return 'text-yellow-300';
    default:
      return 'text-white';
  }
}

export function parsePriceCopper(price?: string): number {
  if (!price) return 0;
  const gold = price.match(/(\d+)g/);
  const silver = price.match(/(\d+)s/);
  const copper = price.match(/(\d+)c/);
  if (gold || silver || copper) {
    return (
      parseInt(gold?.[1] || '0', 10) * 10000 +
      parseInt(silver?.[1] || '0', 10) * 100 +
      parseInt(copper?.[1] || '0', 10)
    );
  }
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
}

export function getPricePerNoteCopper(item: ResearchNotesCraftingItem): number | null {
  if (!item.craftingCost || !item.notes) return null;
  return Math.round(parsePriceCopper(item.craftingCost) / item.notes);
}

export function getCraftingDisciplineIcon(itemId?: number): 'artificer' | 'jeweler' | null {
  if (itemId === 8868) return 'artificer';
  if (itemId === 104934 || itemId === 104934.1) return null;
  if (itemId) return 'jeweler';
  return null;
}

export function getCraftingLevelDisplay(itemId?: number): string {
  const level = itemId ? getCraftingLevel(itemId) : -1;
  return level >= 0 ? String(level) : '-';
}
