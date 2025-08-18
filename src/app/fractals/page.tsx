'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import Navigation from '@/components/layout/Navigation';
import { Package, Search } from 'lucide-react';
import Image from 'next/image';

interface FarmingItem {
  id: number;
  name: string;
  beforeCount: number;
  afterCount: number;
  difference: number;
  valueEach?: number;
  valueTotal?: number;
  category: string;
  percentage?: number;
  dropRate?: number;
  icon?: string;
  currentPrice?: number;
}

interface GW2Item {
  id: number;
  name: string;
  icon: string;
}

interface GW2Price {
  id: number;
  sells?: {
    unit_price: number;
  };
}

export default function FarmingTrackerPage() {
  const { t, lang } = useI18n();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [itemDetails, setItemDetails] = useState<Record<number, { icon: string; currentPrice: number; name: string }>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeSection, setActiveSection] = useState<'fractal' | 'initiate' | 'adept' | 'expert'>('initiate');

  const farmingData: FarmingItem[] = useMemo(() => [
    // Fractales
    { id: 69862, name: 'Pristine Fractal Relic', beforeCount: 23547, afterCount: 25797, difference: 2250, category: 'fractals', icon: '', currentPrice: 0 },
    { id: 73248, name: 'Stabilizing Matrix', beforeCount: 20550, afterCount: 22528, difference: 1978, valueEach: 3898, valueTotal: 7710244, category: 'fractals' },
    { id: 70438, name: 'Fractal Encryption Key', beforeCount: 413, afterCount: 3122, difference: 2709, category: 'fractals' },
    { id: 49426, name: '+3 Agony Infusion', beforeCount: 68, afterCount: 175, difference: 107, valueEach: 869, valueTotal: 92983, category: 'fractals' },
    { id: 49429, name: '+6 Agony Infusion', beforeCount: 24, afterCount: 56, difference: 32, valueEach: 7879, valueTotal: 252128, category: 'fractals' },
    { id: 49432, name: '+9 Agony Infusion', beforeCount: 1167, afterCount: 1184, difference: 17, valueEach: 58985, valueTotal: 1002745, category: 'fractals' },
    { id: 49424, name: '+1 Agony Infusion', beforeCount: 558, afterCount: 7308, difference: 6750, valueEach: 47, valueTotal: 317250, category: 'fractals' },
    
    // Materiales de alto valor
    { id: 19976, name: 'Mystic Coin', beforeCount: 28822, afterCount: 29073, difference: 251, valueEach: 21241, valueTotal: 5331491, category: 'materials' },
    { id: 19721, name: 'Glob of Ectoplasm', beforeCount: 9964, afterCount: 10417, difference: 453, valueEach: 3608, valueTotal: 1634424, category: 'materials' },
    { id: 46738, name: 'Deldrimor Steel Ingot', beforeCount: 305, afterCount: 361, difference: 56, valueEach: 41899, valueTotal: 2346344, category: 'materials' },
    { id: 46739, name: 'Elonian Leather Square', beforeCount: 189, afterCount: 242, difference: 53, valueEach: 24699, valueTotal: 1309047, category: 'materials' },
    { id: 46741, name: 'Bolt of Damask', beforeCount: 178, afterCount: 250, difference: 72, valueEach: 12500, valueTotal: 900000, category: 'materials' },
    { id: 73034, name: 'Vial of Linseed Oil', beforeCount: 176, afterCount: 228, difference: 52, valueEach: 4616, valueTotal: 240032, category: 'materials' },
    
    // Items de fractales
    { id: 71315, name: 'Prototype Alchemical Precipitate', beforeCount: 0, afterCount: 374, difference: 374, category: 'fractal-items' },
    { id: 72796, name: 'Beta Alchemical Precipitate', beforeCount: 0, afterCount: 112, difference: 112, category: 'fractal-items' },
    { id: 73398, name: 'Refined Alchemical Precipitate', beforeCount: 0, afterCount: 54, difference: 54, category: 'fractal-items' },
    { id: 71428, name: 'Resonating Sliver', beforeCount: 1510, afterCount: 10510, difference: 9000, valueEach: 5, valueTotal: 45000, category: 'fractal-items' },
    
    // Equipamiento de fractales
    { id: 70638, name: 'Gold Fractal Warhorn', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-gear' },
    { id: 70785, name: 'Gold Fractal Staff', beforeCount: 0, afterCount: 4, difference: 4, category: 'fractal-gear' },
    { id: 71164, name: 'Gold Fractal Rifle', beforeCount: 0, afterCount: 9, difference: 9, category: 'fractal-gear' },
    { id: 71232, name: 'Gold Fractal Focus', beforeCount: 0, afterCount: 3, difference: 3, category: 'fractal-gear' },
    { id: 71670, name: 'Gold Fractal Hammer', beforeCount: 0, afterCount: 3, difference: 3, category: 'fractal-gear' },
    { id: 72165, name: 'Gold Fractal Short Bow', beforeCount: 0, afterCount: 4, difference: 4, category: 'fractal-gear' },
    { id: 72542, name: 'Gold Fractal Shield', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-gear' },
    { id: 73091, name: 'Gold Fractal Greatsword', beforeCount: 0, afterCount: 5, difference: 5, category: 'fractal-gear' },
    { id: 73269, name: 'Gold Fractal Longbow', beforeCount: 0, afterCount: 3, difference: 3, category: 'fractal-gear' },
    { id: 74760, name: 'Gold Fractal Speargun', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-gear' },
    { id: 74862, name: 'Gold Fractal Pistol', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-gear' },
    { id: 75830, name: 'Gold Fractal Harpoon', beforeCount: 2, afterCount: 3, difference: 1, category: 'fractal-gear' },
    { id: 76257, name: 'Gold Fractal Sword', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-gear' },
    { id: 76598, name: 'Gold Fractal Scepter', beforeCount: 0, afterCount: 3, difference: 3, category: 'fractal-gear' },
    { id: 76974, name: 'Gold Fractal Torch', beforeCount: 0, afterCount: 8, difference: 8, category: 'fractal-gear' },
    { id: 77196, name: 'Gold Fractal Trident', beforeCount: 0, afterCount: 4, difference: 4, category: 'fractal-gear' },
    
    // Pociónes y herramientas
    { id: 71659, name: 'Large Mist Offensive Potion', beforeCount: 3, afterCount: 43, difference: 40, category: 'consumables' },
    { id: 73070, name: 'Mist Offensive Potion', beforeCount: 0, afterCount: 85, difference: 85, category: 'consumables' },
    { id: 74185, name: 'Mist Mobility Potion', beforeCount: 0, afterCount: 76, difference: 76, category: 'consumables' },
    { id: 75427, name: 'Large Mist Mobility Potion', beforeCount: 0, afterCount: 41, difference: 41, category: 'consumables' },
    { id: 74426, name: 'Mist Defensive Potion', beforeCount: 0, afterCount: 91, difference: 91, category: 'consumables' },
    { id: 76150, name: 'Large Mist Defensive Potion', beforeCount: 0, afterCount: 37, difference: 37, category: 'consumables' },
    { id: 73481, name: 'Ascended Salvage Kit', beforeCount: 1, afterCount: 10, difference: 9, category: 'tools' },
    { id: 79105, name: 'Ascended Salvage Kit', beforeCount: 0, afterCount: 22, difference: 22, category: 'tools' },
    { id: 75284, name: 'Ascended Salvage Tool', beforeCount: 2, afterCount: 210, difference: 208, category: 'tools' },
       
    // Otros items
    { id: 20323, name: 'Unidentified Dye', beforeCount: 537, afterCount: 685, difference: 148, valueEach: 464, valueTotal: 68672, category: 'other' },
    { id: 68325, name: 'Chest of Black Lion Goods', beforeCount: 111, afterCount: 287, difference: 176, category: 'other' },
    { id: 72936, name: 'Golden Fractal Relic', beforeCount: 170, afterCount: 193, difference: 23, category: 'other' },
    
    // Items adicionales del CSV
    { id: 39224, name: 'Durmand\'s Pen', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    { id: 39225, name: 'Golden Relic of Rin', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 39228, name: 'Halfmad\'s Mug', beforeCount: 1, afterCount: 7, difference: 6, category: 'other' },
    { id: 39227, name: 'Appleseller\'s Lucky Cog', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 39229, name: 'Marriner\'s Flask', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 39231, name: 'Fierceshot\'s Arrowhead', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 39232, name: 'Magister\'s Field Journal', beforeCount: 7, afterCount: 15, difference: 8, category: 'other' },
    { id: 39233, name: 'Althea\'s Ashes', beforeCount: 7, afterCount: 10, difference: 3, category: 'other' },
    { id: 39234, name: 'Plague Idol', beforeCount: 2, afterCount: 5, difference: 3, category: 'other' },
    { id: 39235, name: 'Matriarch\'s Quill', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 39236, name: 'Zinn\'s Data Crystal', beforeCount: 2, afterCount: 5, difference: 3, category: 'other' },
    { id: 39237, name: 'Experiment ZX-27115', beforeCount: 2, afterCount: 3, difference: 1, category: 'other' },
    { id: 39238, name: 'Imperial Chef Yileng\'s Golden Spoon', beforeCount: 1, afterCount: 5, difference: 4, category: 'other' },
    { id: 39239, name: 'Gargoyle Skull', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 39243, name: 'Ancient Mursaat Token', beforeCount: 1, afterCount: 3, difference: 2, category: 'other' },
    { id: 39546, name: 'Preserved Red Iris Flower', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 39547, name: 'Kurzick Bauble', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 39550, name: 'Warmaster\'s Family Heirloom', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    { id: 39551, name: 'Totem of the Gorilla', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 39554, name: 'Fledgling Charm', beforeCount: 1, afterCount: 9, difference: 8, category: 'other' },
    { id: 39555, name: 'Anton\'s Secret', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 3925, name: 'Passiflora Karkinata', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 39559, name: 'Ancient Karka Carapace', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 39562, name: 'Molten Ore', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 39563, name: 'Big Mama\'s Tooth', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 43766, name: 'Tome of Knowledge', beforeCount: 11293, afterCount: 11508, difference: 215, category: 'other' },
    
    // Weapon Chests
    { id: 45182, name: 'Occam\'s Weapon Chest', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 45183, name: 'Grizzlemouth\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45184, name: 'Mathilde\'s Weapon Chest', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 45185, name: 'Theodosus\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45186, name: 'Hronk\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45188, name: 'Stonecleaver\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45189, name: 'Zojja\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45190, name: 'Chorben\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45191, name: 'Coalforge\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45192, name: 'Soros\'s Weapon Chest', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 45193, name: 'Leftpaw\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45194, name: 'Angchu Weapon Chest', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 45195, name: 'Beigarth\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45196, name: 'Zintl Weapon Chest', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 45197, name: 'Tonn\'s Weapon Chest', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    
    // Infused Rings
    { id: 49277, name: 'Endless Fractal Tonic', beforeCount: 1, afterCount: 2, difference: 1, category: 'other' },
    { id: 49394, name: 'Royal Signet of Doric (Infused)', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 49395, name: 'Lost Seal of Usoku (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49398, name: 'Rurik\'s Royal Signet Ring (Infused)', beforeCount: 1, afterCount: 6, difference: 5, category: 'other' },
    { id: 49399, name: 'Adelbern\'s Royal Signet Ring (Infused)', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    { id: 49400, name: 'Ouroboros Loop (Infused)', beforeCount: 0, afterCount: 9, difference: 9, category: 'other' },
    { id: 49401, name: 'Khilbron\'s Phylactery (Infused)', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 49402, name: 'Crystalline Band (Infused)', beforeCount: 2, afterCount: 4, difference: 2, category: 'other' },
    { id: 49403, name: 'Ring of Red Death (Infused)', beforeCount: 4, afterCount: 7, difference: 3, category: 'other' },
    { id: 49404, name: 'Vassar\'s Band (Infused)', beforeCount: 0, afterCount: 7, difference: 7, category: 'other' },
    { id: 49405, name: 'Ralena\'s Band (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 49406, name: 'Vine of the Pale Tree (Infused)', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    { id: 49407, name: 'Bagh Nakh (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49408, name: 'Mellaggan\'s Whorl (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 49409, name: 'Seal of the Khan-Ur (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49412, name: 'Lunaria, Circle of the Moon (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 49413, name: 'Solaria, Circle of the Sun (Infused)', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 49414, name: 'Druid\'s Circle (Infused)', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    { id: 49415, name: 'Healing Signet (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49416, name: 'Ettinband (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49417, name: 'Ossa Family Signet Ring (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49418, name: 'Barbed Signet (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49419, name: 'Palawa Joko\'s Finger Cuff (Infused)', beforeCount: 1, afterCount: 6, difference: 5, category: 'other' },
    { id: 49420, name: 'Lucce Seal (Infused)', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    { id: 49421, name: 'Purge Signet (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49422, name: 'Band of the Brotherhood (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49423, name: 'Cirque of Arah (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    
    // Armor Chests
    { id: 64164, name: 'Malicious Chest of Leggings', beforeCount: 9, afterCount: 11, difference: 2, category: 'other' },
    { id: 64165, name: 'Healer\'s Chest of Leggings', beforeCount: 5, afterCount: 6, difference: 1, category: 'other' },
    { id: 64166, name: 'Defender\'s Chest of Shoulders', beforeCount: 16, afterCount: 18, difference: 2, category: 'other' },
    { id: 64167, name: 'Healer\'s Chest of Coats', beforeCount: 3, afterCount: 4, difference: 1, category: 'other' },
    { id: 64168, name: 'Defender\'s Chest of Leggings', beforeCount: 12, afterCount: 15, difference: 3, category: 'other' },
    { id: 64169, name: 'Assaulter\'s Chest of Leggings', beforeCount: 5, afterCount: 9, difference: 4, category: 'other' },
    { id: 64170, name: 'Healer\'s Chest of Gloves', beforeCount: 7, afterCount: 10, difference: 3, category: 'other' },
    { id: 64171, name: 'Malicious Chest of Gloves', beforeCount: 10, afterCount: 14, difference: 4, category: 'other' },
    { id: 64172, name: 'Assaulter\'s Chest of Gloves', beforeCount: 14, afterCount: 16, difference: 2, category: 'other' },
    { id: 64173, name: 'Defender\'s Chest of Gloves', beforeCount: 21, afterCount: 22, difference: 1, category: 'other' },
    { id: 64174, name: 'Defender\'s Chest of Boots', beforeCount: 15, afterCount: 17, difference: 2, category: 'other' },
    { id: 64175, name: 'Assaulter\'s Chest of Boots', beforeCount: 8, afterCount: 10, difference: 2, category: 'other' },
    { id: 64176, name: 'Malicious Chest of Boots', beforeCount: 11, afterCount: 14, difference: 3, category: 'other' },
    { id: 64177, name: 'Assaulter\'s Chest of Shoulders', beforeCount: 6, afterCount: 7, difference: 1, category: 'other' },
    { id: 64178, name: 'Healer\'s Chest of Boots', beforeCount: 8, afterCount: 13, difference: 5, category: 'other' },
    { id: 64179, name: 'Malicious Chest of Coats', beforeCount: 6, afterCount: 10, difference: 4, category: 'other' },
    { id: 64180, name: 'Assaulter\'s Chest of Helms', beforeCount: 8, afterCount: 9, difference: 1, category: 'other' },
    { id: 64181, name: 'Defender\'s Chest of Helms', beforeCount: 8, afterCount: 10, difference: 2, category: 'other' },
    { id: 64183, name: 'Malicious Chest of Helms', beforeCount: 8, afterCount: 12, difference: 4, category: 'other' },
    { id: 64184, name: 'Healer\'s Chest of Shoulders', beforeCount: 18, afterCount: 19, difference: 1, category: 'other' },
    { id: 64185, name: 'Malicious Chest of Shoulders', beforeCount: 11, afterCount: 13, difference: 2, category: 'other' },
    { id: 64186, name: 'Assaulter\'s Chest of Coats', beforeCount: 12, afterCount: 15, difference: 3, category: 'other' },
    { id: 64187, name: 'Defender\'s Chest of Coats', beforeCount: 4, afterCount: 7, difference: 3, category: 'other' },
    ], []);

  // Datos específicos para cada cofre de fractales
  const dungeonChestData: FarmingItem[] = useMemo(() => [
   
    { id: 69862, name: 'Pristine Fractal Relic', beforeCount: 30431, afterCount: 32681, difference: 2250, category: 'fractal-relics' },
    { id: 73248, name: 'Stabilizing Matrix', beforeCount: 30036, afterCount: 32112, difference: 2076, category: 'fractal-materials' },
    { id: 49424, name: '+1 Agony Infusion', beforeCount: 12636, afterCount: 17136, difference: 4500, category: 'fractal-materials' },
    { id: 71428, name: 'Resonating Sliver', beforeCount: 2830, afterCount: 5080, difference: 2250, category: 'fractal-items' },
    { id: 70438, name: 'Fractal Encryption Key', beforeCount: 612, afterCount: 3271, difference: 2659, category: 'fractal-materials' },
    
    // Anillos infundidos del CSV expanded_gad.7365.csv
    { id: 37074, name: 'Khilbron\'s Phylactery', beforeCount: 0, afterCount: 6, difference: 6, category: 'infused-rings' },
    { id: 37075, name: 'Crystalline Band', beforeCount: 2, afterCount: 13, difference: 11, category: 'infused-rings' },
    { id: 37076, name: 'Royal Signet of Doric', beforeCount: 0, afterCount: 5, difference: 5, category: 'infused-rings' },
    { id: 37077, name: 'Ralena\'s Band', beforeCount: 0, afterCount: 13, difference: 13, category: 'infused-rings' },
    { id: 37078, name: 'Lunaria, Circle of the Moon', beforeCount: 0, afterCount: 7, difference: 7, category: 'infused-rings' },
    { id: 37079, name: 'Adelbern\'s Royal Signet Ring', beforeCount: 0, afterCount: 5, difference: 5, category: 'infused-rings' },
    { id: 37080, name: 'Vine of the Pale Tree', beforeCount: 1, afterCount: 16, difference: 15, category: 'infused-rings' },
    { id: 37082, name: 'Mellaggan\'s Whorl', beforeCount: 0, afterCount: 7, difference: 7, category: 'infused-rings' },
    { id: 37085, name: 'Ouroboros Loop', beforeCount: 0, afterCount: 4, difference: 4, category: 'infused-rings' },
    { id: 37086, name: 'Ring of Red Death', beforeCount: 2, afterCount: 10, difference: 8, category: 'infused-rings' },
    { id: 37087, name: 'Vassar\'s Band', beforeCount: 0, afterCount: 7, difference: 7, category: 'infused-rings' },
    { id: 37088, name: 'Solaria, Circle of the Sun', beforeCount: 0, afterCount: 6, difference: 6, category: 'infused-rings' },
    { id: 37089, name: 'Lost Seal of Usoku', beforeCount: 0, afterCount: 7, difference: 7, category: 'infused-rings' },
    { id: 37090, name: 'Rurik\'s Royal Signet Ring', beforeCount: 0, afterCount: 5, difference: 5, category: 'infused-rings' },
    { id: 37091, name: 'Seal of the Khan-Ur', beforeCount: 0, afterCount: 5, difference: 5, category: 'infused-rings' },
    { id: 37092, name: 'Bagh Nakh', beforeCount: 1, afterCount: 5, difference: 4, category: 'infused-rings' },
    { id: 39596, name: 'Druid\'s Circle', beforeCount: 0, afterCount: 3, difference: 3, category: 'infused-rings' },
    { id: 39597, name: 'Healing Signet', beforeCount: 0, afterCount: 6, difference: 6, category: 'infused-rings' },
    { id: 39600, name: 'Ettinband', beforeCount: 0, afterCount: 3, difference: 3, category: 'infused-rings' },
    { id: 39601, name: 'Ossa Family Signet Ring', beforeCount: 1, afterCount: 17, difference: 16, category: 'infused-rings' },
    { id: 39604, name: 'Barbed Signet', beforeCount: 0, afterCount: 4, difference: 4, category: 'infused-rings' },
    { id: 39605, name: 'Palawa Joko\'s Finger Cuff', beforeCount: 1, afterCount: 5, difference: 4, category: 'infused-rings' },
    { id: 39608, name: 'Lucce Seal', beforeCount: 0, afterCount: 4, difference: 4, category: 'infused-rings' },
    { id: 39609, name: 'Purge Signet', beforeCount: 0, afterCount: 7, difference: 7, category: 'infused-rings' },
    { id: 39612, name: 'Band of the Brotherhood', beforeCount: 0, afterCount: 8, difference: 8, category: 'infused-rings' },
    { id: 39613, name: 'Cirque of Arah', beforeCount: 0, afterCount: 2, difference: 2, category: 'infused-rings' },
    
    // Otros items
    { id: 43766, name: 'Tome of Knowledge', beforeCount: 11887, afterCount: 11934, difference: 47, category: 'consumables' },
    { id: 64176, name: 'Malicious Chest of Boots', beforeCount: 16, afterCount: 17, difference: 1, category: 'armor-chests' },
    { id: 64185, name: 'Malicious Chest of Shoulders', beforeCount: 16, afterCount: 17, difference: 1, category: 'armor-chests' },
  ], []);

  const raidChestData: FarmingItem[] = useMemo(() => [
    // Datos para Cofre de Avezado de los Fractales (T2) - Datos reales del CSV    
    // Cofre principal y base para cálculos
    { id: 69862, name: 'Pristine Fractal Relic', beforeCount: 28169, afterCount: 30419, difference: 2250, category: 'fractal-relics' },
    
    // Materiales de fractales - cantidades reales del CSV
    { id: 73248, name: 'Stabilizing Matrix', beforeCount: 26846, afterCount: 28809, difference: 1963, category: 'fractal-materials' },
    { id: 70438, name: 'Fractal Encryption Key', beforeCount: 616, afterCount: 3332, difference: 2716, category: 'fractal-materials' },
    { id: 49424, name: '+1 Agony Infusion', beforeCount: 8028, afterCount: 12528, difference: 4500, category: 'fractal-materials' },
    { id: 49426, name: '+3 Agony Infusion', beforeCount: 200, afterCount: 234, difference: 34, category: 'fractal-materials' },
    { id: 49429, name: '+6 Agony Infusion', beforeCount: 69, afterCount: 87, difference: 18, category: 'fractal-materials' },
    { id: 71428, name: 'Resonating Sliver', beforeCount: 2830, afterCount: 7330, difference: 4500, category: 'fractal-items' },
    
    // Materiales de alto valor - cantidades reales del CSV
    { id: 19976, name: 'Mystic Coin', beforeCount: 29222, afterCount: 29279, difference: 57, category: 'materials' },
    { id: 19721, name: 'Glob of Ectoplasm', beforeCount: 103, afterCount: 189, difference: 86, category: 'materials' },
    { id: 46738, name: 'Deldrimor Steel Ingot', beforeCount: 388, afterCount: 396, difference: 8, category: 'materials' },
    { id: 46739, name: 'Elonian Leather Square', beforeCount: 262, afterCount: 268, difference: 6, category: 'materials' },
    { id: 46741, name: 'Bolt of Damask', beforeCount: 273, afterCount: 279, difference: 6, category: 'materials' },
    { id: 73034, name: 'Vial of Linseed Oil', beforeCount: 261, afterCount: 272, difference: 11, category: 'materials' },
    
    // Anillos infundidos - cantidades reales del CSV
    { id: 37074, name: 'Khilbron\'s Phylactery', beforeCount: 0, afterCount: 6, difference: 6, category: 'infused-rings' },
    { id: 37075, name: 'Crystalline Band', beforeCount: 2, afterCount: 7, difference: 5, category: 'infused-rings' },
    { id: 37076, name: 'Royal Signet of Doric', beforeCount: 0, afterCount: 1, difference: 1, category: 'infused-rings' },
    { id: 37077, name: 'Ralena\'s Band', beforeCount: 0, afterCount: 4, difference: 4, category: 'infused-rings' },
    { id: 37078, name: 'Lunaria, Circle of the Moon', beforeCount: 0, afterCount: 3, difference: 3, category: 'infused-rings' },
    { id: 37079, name: 'Adelbern\'s Royal Signet Ring', beforeCount: 0, afterCount: 2, difference: 2, category: 'infused-rings' },
    { id: 37080, name: 'Vine of the Pale Tree', beforeCount: 1, afterCount: 4, difference: 3, category: 'infused-rings' },
    { id: 37082, name: 'Mellaggan\'s Whorl', beforeCount: 0, afterCount: 6, difference: 6, category: 'infused-rings' },
    { id: 37085, name: 'Ouroboros Loop', beforeCount: 0, afterCount: 2, difference: 2, category: 'infused-rings' },
    { id: 37086, name: 'Ring of Red Death', beforeCount: 2, afterCount: 9, difference: 7, category: 'infused-rings' },
    { id: 37087, name: 'Vassar\'s Band', beforeCount: 0, afterCount: 4, difference: 4, category: 'infused-rings' },
    { id: 37088, name: 'Solaria, Circle of the Moon', beforeCount: 0, afterCount: 4, difference: 4, category: 'infused-rings' },
    { id: 37089, name: 'Lost Seal of Usoku', beforeCount: 0, afterCount: 4, difference: 4, category: 'infused-rings' },
    { id: 37090, name: 'Rurik\'s Royal Signet Ring', beforeCount: 0, afterCount: 5, difference: 5, category: 'infused-rings' },
    { id: 37091, name: 'Seal of the Khan-Ur', beforeCount: 0, afterCount: 4, difference: 4, category: 'infused-rings' },
    { id: 37092, name: 'Bagh Nakh', beforeCount: 1, afterCount: 4, difference: 3, category: 'infused-rings' },
    { id: 39596, name: 'Druid\'s Circle', beforeCount: 0, afterCount: 3, difference: 3, category: 'infused-rings' },
    { id: 39597, name: 'Healing Signet', beforeCount: 0, afterCount: 5, difference: 5, category: 'infused-rings' },
    { id: 39600, name: 'Ettinband', beforeCount: 0, afterCount: 5, difference: 5, category: 'infused-rings' },
    { id: 39601, name: 'Ossa Family Signet Ring', beforeCount: 1, afterCount: 5, difference: 4, category: 'infused-rings' },
    { id: 39604, name: 'Barbed Signet', beforeCount: 0, afterCount: 5, difference: 5, category: 'infused-rings' },
    { id: 39605, name: 'Palawa Joko\'s Finger Cuff', beforeCount: 1, afterCount: 4, difference: 3, category: 'infused-rings' },
    { id: 39608, name: 'Lucce Seal', beforeCount: 0, afterCount: 8, difference: 8, category: 'infused-rings' },
    { id: 39609, name: 'Purge Signet', beforeCount: 0, afterCount: 7, difference: 7, category: 'infused-rings' },
    { id: 39612, name: 'Band of the Brotherhood', beforeCount: 0, afterCount: 8, difference: 8, category: 'infused-rings' },
    { id: 39613, name: 'Cirque of Arah', beforeCount: 0, afterCount: 5, difference: 5, category: 'infused-rings' },
    
    // Otros items - cantidades reales del CSV
    { id: 43766, name: 'Tome of Knowledge', beforeCount: 11771, afterCount: 11887, difference: 116, category: 'consumables' },
    
    // Weapon Chests - cantidades reales del CSV
    { id: 45182, name: 'Occam\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45185, name: 'Theodosus\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45187, name: 'Ebonmane\'s Weapon Chest', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 45188, name: 'Stonecleaver\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45189, name: 'Zojja\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45193, name: 'Leftpaw\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45194, name: 'Angchu Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45195, name: 'Beigarth\'s Weapon Chest', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    
    // Fractal Weapons - cantidades reales del CSV
    { id: 49257, name: 'Fractal Axe', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-weapons' },
    { id: 49258, name: 'Fractal Longbow', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-weapons' },
    { id: 49259, name: 'Fractal Short Bow', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-weapons' },
    { id: 49260, name: 'Fractal Dagger', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-weapons' },
    { id: 49261, name: 'Fractal Focus', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-weapons' },
    { id: 49262, name: 'Fractal Greatsword', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-weapons' },
    { id: 49263, name: 'Fractal Hammer', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-weapons' },
    { id: 49264, name: 'Fractal Mace', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-weapons' },
    { id: 49265, name: 'Fractal Pistol', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-weapons' },
    { id: 49267, name: 'Fractal Scepter', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-weapons' },
    { id: 49268, name: 'Fractal Shield', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-weapons' },
    { id: 49269, name: 'Fractal Harpoon', beforeCount: 0, afterCount: 3, difference: 3, category: 'fractal-weapons' },
    { id: 49270, name: 'Fractal Speargun', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-weapons' },
    { id: 49272, name: 'Fractal Sword', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-weapons' },
    { id: 49273, name: 'Fractal Torch', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-weapons' },
    { id: 49274, name: 'Fractal Trident', beforeCount: 0, afterCount: 3, difference: 3, category: 'fractal-weapons' },
    { id: 49275, name: 'Fractal Warhorn', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-weapons' },
    
    // Anillos infundidos (versión avanzada) - cantidades reales del CSV
    { id: 49394, name: 'Royal Signet of Doric (Infused)', beforeCount: 0, afterCount: 8, difference: 8, category: 'other' },
    { id: 49395, name: 'Lost Seal of Usoku (Infused)', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    { id: 49398, name: 'Rurik\'s Royal Signet Ring (Infused)', beforeCount: 1, afterCount: 4, difference: 3, category: 'other' },
    { id: 49399, name: 'Adelbern\'s Royal Signet Ring (Infused)', beforeCount: 0, afterCount: 7, difference: 7, category: 'other' },
    { id: 49400, name: 'Ouroboros Loop (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 49401, name: 'Khilbron\'s Phylactery (Infused)', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 49402, name: 'Crystalline Band (Infused)', beforeCount: 2, afterCount: 8, difference: 6, category: 'other' },
    { id: 49403, name: 'Ring of Red Death (Infused)', beforeCount: 4, afterCount: 7, difference: 3, category: 'other' },
    { id: 49404, name: 'Vassar\'s Band (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 49405, name: 'Ralena\'s Band (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49406, name: 'Vine of the Pale Tree (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49407, name: 'Bagh Nakh (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 49408, name: 'Mellaggan\'s Whorl (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49409, name: 'Seal of the Khan-Ur (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49412, name: 'Lunaria, Circle of the Moon (Infused)', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    { id: 49413, name: 'Solaria, Circle of the Sun (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49414, name: 'Druid\'s Circle (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49415, name: 'Healing Signet (Infused)', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 49416, name: 'Ettinband (Infused)', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    { id: 49417, name: 'Ossa Family Signet Ring (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 49418, name: 'Barbed Signet (Infused)', beforeCount: 0, afterCount: 7, difference: 7, category: 'other' },
    { id: 49419, name: 'Palawa Joko\'s Finger Cuff (Infused)', beforeCount: 1, afterCount: 8, difference: 7, category: 'other' },
    { id: 49420, name: 'Lucce Seal (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 49421, name: 'Purge Signet (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49422, name: 'Band of the Brotherhood (Infused)', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 49423, name: 'Cirque of Arah (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    
    // Armor Chests - cantidades reales del CSV
    { id: 64164, name: 'Malicious Chest of Leggings', beforeCount: 11, afterCount: 12, difference: 1, category: 'other' },
    { id: 64165, name: 'Healer\'s Chest of Leggings', beforeCount: 7, afterCount: 8, difference: 1, category: 'other' },
    { id: 64166, name: 'Defender\'s Chest of Shoulders', beforeCount: 20, afterCount: 21, difference: 1, category: 'other' },
    { id: 64170, name: 'Healer\'s Chest of Gloves', beforeCount: 14, afterCount: 17, difference: 3, category: 'other' },
    { id: 64171, name: 'Malicious Chest of Gloves', beforeCount: 16, afterCount: 17, difference: 1, category: 'other' },
    { id: 64173, name: 'Defender\'s Chest of Gloves', beforeCount: 24, afterCount: 26, difference: 2, category: 'other' },
    { id: 64174, name: 'Defender\'s Chest of Boots', beforeCount: 17, afterCount: 18, difference: 1, category: 'other' },
    { id: 64175, name: 'Assaulter\'s Chest of Boots', beforeCount: 11, afterCount: 12, difference: 1, category: 'other' },
    { id: 64177, name: 'Assaulter\'s Chest of Shoulders', beforeCount: 8, afterCount: 11, difference: 3, category: 'other' },
    { id: 64182, name: 'Healer\'s Chest of Helms', beforeCount: 11, afterCount: 12, difference: 1, category: 'other' },
    { id: 64184, name: 'Healer\'s Chest of Shoulders', beforeCount: 20, afterCount: 24, difference: 4, category: 'other' },
    
    // Otros items - cantidades reales del CSV
    { id: 68325, name: 'Chest of Black Lion Goods', beforeCount: 351, afterCount: 384, difference: 33, category: 'other' },
    
    // Items de fractales - cantidades reales del CSV
    { id: 71315, name: 'Prototype Alchemical Precipitate', beforeCount: 0, afterCount: 351, difference: 351, category: 'fractal-items' },
    { id: 72796, name: 'Beta Alchemical Precipitate', beforeCount: 0, afterCount: 150, difference: 150, category: 'fractal-items' },
    
    // Potiones de Mist - cantidades reales del CSV
    { id: 73070, name: 'Mist Offensive Potion', beforeCount: 0, afterCount: 126, difference: 126, category: 'consumables' },
    { id: 74185, name: 'Mist Mobility Potion', beforeCount: 0, afterCount: 121, difference: 121, category: 'consumables' },
    { id: 74426, name: 'Mist Defensive Potion', beforeCount: 0, afterCount: 121, difference: 121, category: 'consumables' },
    
    // Herramientas - cantidades reales del CSV
    { id: 75284, name: 'Ascended Salvage Tool', beforeCount: 1, afterCount: 22, difference: 21, category: 'tools' },
  ], []);

  const strikeChestData: FarmingItem[] = useMemo(() => [
    // Datos para Cofre de Experto de los Fractales (T3) - Datos reales del CSV    
    // Cofre principal y base para cálculos
    { id: 69862, name: 'Pristine Fractal Relic', beforeCount: 25919, afterCount: 28169, difference: 2250, category: 'fractal-relics' },
    
    // Materiales de fractales - cantidades reales del CSV
    { id: 73248, name: 'Stabilizing Matrix', beforeCount: 23738, afterCount: 25789, difference: 2051, category: 'fractal-materials' },
    { id: 70438, name: 'Fractal Encryption Key', beforeCount: 429, afterCount: 3115, difference: 2686, category: 'fractal-materials' },
    { id: 49424, name: '+1 Agony Infusion', beforeCount: 1278, afterCount: 8028, difference: 6750, category: 'fractal-materials' },
    { id: 49426, name: '+3 Agony Infusion', beforeCount: 175, afterCount: 200, difference: 25, category: 'fractal-materials' },
    { id: 49429, name: '+6 Agony Infusion', beforeCount: 56, afterCount: 69, difference: 13, category: 'fractal-materials' },
    { id: 49432, name: '+9 Agony Infusion', beforeCount: 1212, afterCount: 1223, difference: 11, category: 'fractal-materials' },
    { id: 71428, name: 'Resonating Sliver', beforeCount: 2830, afterCount: 9580, difference: 6750, category: 'fractal-items' },
    
    // Materiales de alto valor - cantidades reales del CSV
    { id: 19976, name: 'Mystic Coin', beforeCount: 29092, afterCount: 29222, difference: 130, category: 'materials' },
    { id: 19721, name: 'Glob of Ectoplasm', beforeCount: 360, afterCount: 585, difference: 225, category: 'materials' },
    { id: 46738, name: 'Deldrimor Steel Ingot', beforeCount: 361, afterCount: 388, difference: 27, category: 'materials' },
    { id: 46739, name: 'Elonian Leather Square', beforeCount: 242, afterCount: 262, difference: 20, category: 'materials' },
    { id: 46741, name: 'Bolt of Damask', beforeCount: 250, afterCount: 273, difference: 23, category: 'materials' },
    { id: 73034, name: 'Vial of Linseed Oil', beforeCount: 228, afterCount: 261, difference: 33, category: 'materials' },
    
    // Items de fractales - cantidades reales del CSV
    { id: 71315, name: 'Prototype Alchemical Precipitate', beforeCount: 0, afterCount: 177, difference: 177, category: 'fractal-items' },
    { id: 72796, name: 'Beta Alchemical Precipitate', beforeCount: 0, afterCount: 82, difference: 82, category: 'fractal-items' },
    { id: 73398, name: 'Refined Alchemical Precipitate', beforeCount: 0, afterCount: 29, difference: 29, category: 'fractal-items' },
    
    // Equipamiento de fractales - cantidades reales del CSV
    { id: 73380, name: 'Gold Fractal Axe', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-gear' },
    { id: 71164, name: 'Gold Fractal Rifle', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-gear' },
    { id: 71232, name: 'Gold Fractal Focus', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-gear' },
    { id: 71670, name: 'Gold Fractal Hammer', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-gear' },
    { id: 72165, name: 'Gold Fractal Short Bow', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-gear' },
    { id: 76257, name: 'Gold Fractal Sword', beforeCount: 0, afterCount: 3, difference: 3, category: 'fractal-gear' },
    { id: 76598, name: 'Gold Fractal Scepter', beforeCount: 0, afterCount: 3, difference: 3, category: 'fractal-gear' },
    { id: 76974, name: 'Gold Fractal Torch', beforeCount: 0, afterCount: 2, difference: 2, category: 'fractal-gear' },
    { id: 77196, name: 'Gold Fractal Trident', beforeCount: 0, afterCount: 1, difference: 1, category: 'fractal-gear' },
    
    // Potiones de Mist - cantidades reales del CSV
    { id: 71659, name: 'Large Mist Offensive Potion', beforeCount: 3, afterCount: 20, difference: 17, category: 'consumables' },
    { id: 73070, name: 'Mist Offensive Potion', beforeCount: 0, afterCount: 36, difference: 36, category: 'consumables' },
    { id: 74185, name: 'Mist Mobility Potion', beforeCount: 0, afterCount: 48, difference: 48, category: 'consumables' },
    { id: 75427, name: 'Large Mist Mobility Potion', beforeCount: 0, afterCount: 20, difference: 20, category: 'consumables' },
    { id: 74426, name: 'Mist Defensive Potion', beforeCount: 0, afterCount: 59, difference: 59, category: 'consumables' },
    { id: 76150, name: 'Large Mist Defensive Potion', beforeCount: 0, afterCount: 23, difference: 23, category: 'consumables' },
    
    // Herramientas - cantidades reales del CSV
    { id: 73481, name: 'Ascended Salvage Kit', beforeCount: 9, afterCount: 11, difference: 2, category: 'tools' },
    { id: 79105, name: 'Ascended Salvage Kit', beforeCount: 24, afterCount: 38, difference: 14, category: 'tools' },
    { id: 75284, name: 'Ascended Salvage Tool', beforeCount: 1, afterCount: 115, difference: 114, category: 'tools' },
    
    // Otros items - cantidades reales del CSV
    { id: 20323, name: 'Unidentified Dye', beforeCount: 685, afterCount: 754, difference: 69, category: 'other' },
    { id: 68325, name: 'Chest of Black Lion Goods', beforeCount: 287, afterCount: 351, difference: 64, category: 'other' },
    { id: 72936, name: 'Golden Fractal Relic', beforeCount: 248, afterCount: 258, difference: 10, category: 'other' },
    
    // Items adicionales del CSV
    { id: 39228, name: 'Halfmad\'s Mug', beforeCount: 1, afterCount: 2, difference: 1, category: 'other' },
    { id: 39229, name: 'Appleseller\'s Lucky Cog', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 39230, name: 'Marriner\'s Flask', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 39232, name: 'Magister\'s Field Journal', beforeCount: 7, afterCount: 10, difference: 3, category: 'other' },
    { id: 39234, name: 'Plague Idol', beforeCount: 2, afterCount: 3, difference: 1, category: 'other' },
    { id: 39235, name: 'Matriarch\'s Quill', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 39237, name: 'Experiment ZX-27115', beforeCount: 2, afterCount: 3, difference: 1, category: 'other' },
    { id: 39238, name: 'Imperial Chef Yileng\'s Golden Spoon', beforeCount: 1, afterCount: 4, difference: 3, category: 'other' },
    { id: 39239, name: 'Gargoyle Skull', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 39243, name: 'Ancient Mursaat Token', beforeCount: 1, afterCount: 2, difference: 1, category: 'other' },
    { id: 39546, name: 'Preserved Red Iris Flower', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 39547, name: 'Kurzick Bauble', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 39550, name: 'Warmaster\'s Family Heirloom', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    { id: 39555, name: 'Anton\'s Secret', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 39558, name: 'Passiflora Karkinata', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 39559, name: 'Ancient Karka Carapace', beforeCount: 0, afterCount: 2, difference: 2, category: 'other' },
    { id: 39562, name: 'Molten Ore', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 39563, name: 'Big Mama\'s Tooth', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 43766, name: 'Tome of Knowledge', beforeCount: 11607, afterCount: 11771, difference: 164, category: 'consumables' },
    
    // Weapon Chests - cantidades reales del CSV
    { id: 45183, name: 'Grizzlemouth\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45185, name: 'Theodosus\'s Weapon Chest', beforeCount: 1, afterCount: 3, difference: 2, category: 'other' },
    { id: 45187, name: 'Ebonmane\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45191, name: 'Coalforge\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45195, name: 'Beigarth\'s Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 45196, name: 'Zintl Weapon Chest', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    
    // Anillos infundidos (versión avanzada) - cantidades reales del CSV
    { id: 49394, name: 'Royal Signet of Doric (Infused)', beforeCount: 0, afterCount: 7, difference: 7, category: 'other' },
    { id: 49395, name: 'Lost Seal of Usoku (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49398, name: 'Rurik\'s Royal Signet Ring (Infused)', beforeCount: 1, afterCount: 9, difference: 8, category: 'other' },
    { id: 49399, name: 'Adelbern\'s Royal Signet Ring (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49400, name: 'Ouroboros Loop (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49401, name: 'Khilbron\'s Phylactery (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49402, name: 'Crystalline Band (Infused)', beforeCount: 2, afterCount: 6, difference: 4, category: 'other' },
    { id: 49403, name: 'Ring of Red Death (Infused)', beforeCount: 4, afterCount: 9, difference: 5, category: 'other' },
    { id: 49404, name: 'Vassar\'s Band (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49405, name: 'Ralena\'s Band (Infused)', beforeCount: 0, afterCount: 7, difference: 7, category: 'other' },
    { id: 49406, name: 'Vine of the Pale Tree (Infused)', beforeCount: 0, afterCount: 7, difference: 7, category: 'other' },
    { id: 49407, name: 'Bagh Nakh (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49408, name: 'Mellaggan\'s Whorl (Infused)', beforeCount: 0, afterCount: 7, difference: 7, category: 'other' },
    { id: 49409, name: 'Seal of the Khan-Ur (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49412, name: 'Lunaria, Circle of the Moon (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49413, name: 'Solaria, Circle of the Sun (Infused)', beforeCount: 1, afterCount: 9, difference: 8, category: 'other' },
    { id: 49415, name: 'Healing Signet (Infused)', beforeCount: 0, afterCount: 7, difference: 7, category: 'other' },
    { id: 49416, name: 'Ettinband (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 49417, name: 'Ossa Family Signet Ring (Infused)', beforeCount: 1, afterCount: 6, difference: 5, category: 'other' },
    { id: 49418, name: 'Barbed Signet (Infused)', beforeCount: 0, afterCount: 6, difference: 6, category: 'other' },
    { id: 49419, name: 'Palawa Joko\'s Finger Cuff (Infused)', beforeCount: 1, afterCount: 5, difference: 4, category: 'other' },
    { id: 49420, name: 'Lucce Seal (Infused)', beforeCount: 0, afterCount: 4, difference: 4, category: 'other' },
    { id: 49421, name: 'Purge Signet (Infused)', beforeCount: 0, afterCount: 5, difference: 5, category: 'other' },
    { id: 49422, name: 'Band of the Brotherhood (Infused)', beforeCount: 0, afterCount: 1, difference: 1, category: 'other' },
    { id: 49423, name: 'Cirque of Arah (Infused)', beforeCount: 0, afterCount: 3, difference: 3, category: 'other' },
    
    // Armor Chests - cantidades reales del CSV
    { id: 64165, name: 'Healer\'s Chest of Leggings', beforeCount: 6, afterCount: 7, difference: 1, category: 'other' },
    { id: 64166, name: 'Defender\'s Chest of Shoulders', beforeCount: 18, afterCount: 20, difference: 2, category: 'other' },
    { id: 64168, name: 'Defender\'s Chest of Leggings', beforeCount: 15, afterCount: 16, difference: 1, category: 'other' },
    { id: 64170, name: 'Healer\'s Chest of Gloves', beforeCount: 10, afterCount: 14, difference: 4, category: 'other' },
    { id: 64171, name: 'Malicious Chest of Gloves', beforeCount: 14, afterCount: 16, difference: 2, category: 'other' },
    { id: 64172, name: 'Assaulter\'s Chest of Gloves', beforeCount: 16, afterCount: 17, difference: 1, category: 'other' },
    { id: 64173, name: 'Defender\'s Chest of Gloves', beforeCount: 22, afterCount: 24, difference: 2, category: 'other' },
    { id: 64175, name: 'Assaulter\'s Chest of Boots', beforeCount: 10, afterCount: 11, difference: 1, category: 'other' },
    { id: 64176, name: 'Malicious Chest of Boots', beforeCount: 14, afterCount: 16, difference: 2, category: 'other' },
    { id: 64177, name: 'Assaulter\'s Chest of Shoulders', beforeCount: 7, afterCount: 8, difference: 1, category: 'other' },
    { id: 64178, name: 'Healer\'s Chest of Boots', beforeCount: 13, afterCount: 14, difference: 1, category: 'other' },
    { id: 64179, name: 'Malicious Chest of Coats', beforeCount: 10, afterCount: 11, difference: 1, category: 'other' },
    { id: 64180, name: 'Assaulter\'s Chest of Helms', beforeCount: 9, afterCount: 10, difference: 1, category: 'other' },
    { id: 64181, name: 'Defender\'s Chest of Helms', beforeCount: 10, afterCount: 11, difference: 1, category: 'other' },
    { id: 64182, name: 'Healer\'s Chest of Helms', beforeCount: 8, afterCount: 11, difference: 3, category: 'other' },
    { id: 64184, name: 'Healer\'s Chest of Shoulders', beforeCount: 19, afterCount: 20, difference: 1, category: 'other' },
    { id: 64185, name: 'Malicious Chest of Shoulders', beforeCount: 13, afterCount: 16, difference: 3, category: 'other' },
  ], []);

  // Calcular estadísticas para cada cofre
  const dungeonChestStats = useMemo(() => {
    const totalItems = dungeonChestData.reduce((sum, item) => sum + Math.max(0, item.difference), 0);
    
    // Calcular valor total usando precios actuales
    const totalValue = dungeonChestData.reduce((sum, item) => {
      if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
        return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
      }
      return sum;
    }, 0);
    
    // Cada Pristine Fractal Relic = 1 cofre abierto
    const estimatedChests = 2250; // Base fija basada en Pristine Fractal Relics
    const avgGoldPerChest = totalValue / estimatedChests;
    
    // Calcular porcentajes y drop rates para cada item
    const itemsWithStats = dungeonChestData.map(item => ({
      ...item,
      percentage: totalItems > 0 ? (Math.max(0, item.difference) / totalItems) * 100 : 0,
      dropRate: estimatedChests > 0 ? (Math.max(0, item.difference) / estimatedChests) : 0
    }));

    return {
      totalItems,
      totalValue,
      estimatedChests,
      avgGoldPerChest,
      itemsWithStats,
      uniqueItemTypes: dungeonChestData.filter(item => item.difference > 0).length
    };
  }, [dungeonChestData, itemDetails]);

  const raidChestStats = useMemo(() => {
    const totalItems = raidChestData.reduce((sum, item) => sum + Math.max(0, item.difference), 0);
    
    // Calcular valor total usando precios actuales
    const totalValue = raidChestData.reduce((sum, item) => {
      if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
        return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
      }
      return sum;
    }, 0);
    
    // Cada Pristine Fractal Relic = 1 cofre abierto
    const estimatedChests = 2250; // Base fija basada en Pristine Fractal Relics
    const avgGoldPerChest = totalValue / estimatedChests;
    
    // Calcular porcentajes y drop rates para cada item
    const itemsWithStats = raidChestData.map(item => ({
      ...item,
      percentage: totalItems > 0 ? (Math.max(0, item.difference) / totalItems) * 100 : 0,
      dropRate: estimatedChests > 0 ? (Math.max(0, item.difference) / estimatedChests) : 0
    }));

    return {
      totalItems,
      totalValue,
      estimatedChests,
      avgGoldPerChest,
      itemsWithStats,
      uniqueItemTypes: raidChestData.filter(item => item.difference > 0).length
    };
  }, [raidChestData, itemDetails]);

  const strikeChestStats = useMemo(() => {
    const totalItems = strikeChestData.reduce((sum, item) => sum + Math.max(0, item.difference), 0);
    
    // Calcular valor total usando precios actuales
    const totalValue = strikeChestData.reduce((sum, item) => {
      if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
        return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
      }
      return sum;
    }, 0);
    
    // Cada Pristine Fractal Relic = 1 cofre abierto
    const estimatedChests = 2250; // Base fija basada en Pristine Fractal Relics
    const avgGoldPerChest = totalValue / estimatedChests;
    
    // Calcular porcentajes y drop rates para cada item
    const itemsWithStats = strikeChestData.map(item => ({
      ...item,
      percentage: totalItems > 0 ? (Math.max(0, item.difference) / totalItems) * 100 : 0,
      dropRate: estimatedChests > 0 ? (Math.max(0, item.difference) / estimatedChests) : 0
    }));

    return {
      totalItems,
      totalValue,
      estimatedChests,
      avgGoldPerChest,
      itemsWithStats,
      uniqueItemTypes: strikeChestData.filter(item => item.difference > 0).length
    };
  }, [strikeChestData, itemDetails]);

  // Cargar detalles de los items (iconos y precios actuales)
  const fetchItemDetails = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener todos los IDs de todas las secciones
      const allItemIds = [
        ...farmingData.map(item => item.id),
        ...dungeonChestData.map(item => item.id),
        ...raidChestData.map(item => item.id),
        ...strikeChestData.map(item => item.id)
      ].filter(id => id > 0);
      
      // Eliminar duplicados
      const uniqueItemIds = [...new Set(allItemIds)];
      
      if (uniqueItemIds.length === 0) {
        setLoading(false);
        return;
      }

      // Obtener detalles de los items
      const itemsResponse = await fetch(`https://api.guildwars2.com/v2/items?ids=${uniqueItemIds.join(',')}&lang=${lang}`);
      const items = await itemsResponse.json();

      // Obtener precios actuales
      const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${uniqueItemIds.join(',')}`);
      const prices = await pricesResponse.json();

      const details: Record<number, { icon: string; currentPrice: number; name: string }> = {};
      
      items.forEach((item: GW2Item) => {
        const price = prices.find((p: GW2Price) => p.id === item.id);
        details[item.id] = {
          icon: item.icon,
          currentPrice: price?.sells?.unit_price || 0,
          name: item.name
        };
      });

      setItemDetails(details);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      setLoading(false);
    }
  }, [farmingData, dungeonChestData, raidChestData, strikeChestData, lang]);

  useEffect(() => {
    fetchItemDetails();
  }, [fetchItemDetails]);

  // Actualización automática cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchItemDetails();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [fetchItemDetails]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalItems = farmingData.reduce((sum, item) => sum + Math.max(0, item.difference), 0);
    
    // Calcular valor total usando precios actuales
    const totalValue = farmingData.reduce((sum, item) => {
      if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
        return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
      }
      return sum;
    }, 0);
    
    // Cada Pristine Fractal Relic = 1 cofre abierto
    const estimatedChests = 2250; // Base fija basada en Pristine Fractal Relics
    const avgGoldPerChest = totalValue / estimatedChests;
    
    // Calcular porcentajes y drop rates para cada item
    const itemsWithStats = farmingData.map(item => ({
      ...item,
      percentage: totalItems > 0 ? (Math.max(0, item.difference) / totalItems) * 100 : 0,
      dropRate: estimatedChests > 0 ? (Math.max(0, item.difference) / estimatedChests) : 0
    }));

    return {
      totalItems,
      totalValue,
      estimatedChests,
      avgGoldPerChest,
      itemsWithStats,
      uniqueItemTypes: farmingData.filter(item => item.difference > 0).length
    };
  }, [farmingData, itemDetails]);





  const formatGoldSilverCopper = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemainder = copper % 100;
    return `${gold}g ${silver}s ${copperRemainder}c`;
  };

  // Filtrar y ordenar items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = stats.itemsWithStats.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Ordenar items
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'difference':
          aValue = a.difference;
          bValue = b.difference;
          break;
        case 'currentPrice':
          aValue = itemDetails[a.id]?.currentPrice || 0;
          bValue = itemDetails[b.id]?.currentPrice || 0;
          break;
        case 'totalValue':
          aValue = (itemDetails[a.id]?.currentPrice || 0) * Math.max(0, a.difference);
          bValue = (itemDetails[b.id]?.currentPrice || 0) * Math.max(0, b.difference);
          break;
        case 'percentage':
          aValue = a.percentage || 0;
          bValue = b.percentage || 0;
          break;
        case 'dropRate':
          aValue = a.dropRate || 0;
          bValue = b.dropRate || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return sorted;
  }, [stats.itemsWithStats, searchTerm, sortBy, sortOrder, itemDetails]);

  // Función para manejar el ordenamiento por columna
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Componente de encabezado ordenable
  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <th 
      className="text-center p-3 text-gray-200 font-semibold cursor-pointer hover:bg-gray-700/60 transition-all duration-200 select-none group"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{children}</span>
        <div className="flex flex-col text-xs">
          {sortBy === column ? (
            sortOrder === 'asc' ? (
              <span className="text-blue-400 font-bold">↑</span>
            ) : (
              <span className="text-blue-400 font-bold">↓</span>
            )
          ) : (
            <div className="flex flex-col text-gray-500 group-hover:text-gray-300 transition-colors">
              <span className="opacity-60">↑</span>
              <span className="opacity-60">↓</span>
            </div>
          )}
        </div>
      </div>
    </th>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
                 <div className="text-center mb-8">
           <h1 className="text-4xl font-bold text-white mb-4">
             {t('farmingTracker.title')}
           </h1>
           <p className="text-gray-300 text-lg">
             {t('farmingTracker.subtitle')}
           </p>
                  </div>
 
         {/* Section Navigation */}
         <div className="flex justify-center mb-8">
           <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-2 shadow-2xl">
             <div className="flex space-x-2">
               <button
                 onClick={() => setActiveSection('initiate')}
                 className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                   activeSection === 'initiate'
                     ? 'bg-green-600 text-white shadow-lg'
                     : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                 }`}
               >
                 {t('farmingTracker.sections.initiate')}
               </button>
               <button
                 onClick={() => setActiveSection('adept')}
                 className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                   activeSection === 'adept'
                     ? 'bg-purple-600 text-white shadow-lg'
                     : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                 }`}
               >
                 {t('farmingTracker.sections.adept')}
               </button>
               <button
                 onClick={() => setActiveSection('expert')}
                 className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                   activeSection === 'expert'
                     ? 'bg-orange-600 text-white shadow-lg'
                     : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                 }`}
               >
                 {t('farmingTracker.sections.expert')}
               </button>
               <button
                 onClick={() => setActiveSection('fractal')}
                 className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                   activeSection === 'fractal'
                     ? 'bg-blue-600 text-white shadow-lg'
                     : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                 }`}
               >
                 {t('farmingTracker.sections.fractal')}
               </button>
             </div>
           </div>
         </div>
 
                  {/* Content based on active section */}
         
                   {/* Initiate Section (T1) */}
         {activeSection === 'initiate' && (
           <>
             {/* Stats Overview */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.totalValueGained')}</h3>
                 <div className="text-3xl font-bold text-green-400">
                   {formatGoldSilverCopper(dungeonChestStats.totalValue)}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.totalValueGained')}</p>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.itemsGained')}</h3>
                 <div className="text-3xl font-bold text-blue-400">
                   {dungeonChestStats.totalItems.toLocaleString()}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.totalAmount')}</p>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.chestsOpened')}</h3>
                 <div className="text-3xl font-bold text-purple-400">
                   {dungeonChestStats.estimatedChests.toLocaleString()}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.basedOnRelics')}</p>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.avgGoldPerChest')}</h3>
                 <div className="text-3xl font-bold text-yellow-400">
                   {formatGoldSilverCopper(Math.round(dungeonChestStats.avgGoldPerChest))}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.avgValuePerChest')}</p>
               </div>
             </div>

             {/* Search and Update */}
             <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl mb-8">
               <div className="flex flex-col md:flex-row gap-4 items-center">
                 {/* Search */}
                 <div className="flex-1">
                   <div className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                     <input
                       type="text"
                       placeholder={t('farmingTracker.search.placeholder')}
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                     />
                   </div>
                 </div>
                 
                 {/* Update Button and Last Update Info */}
                 <div className="flex flex-col items-end gap-2">
                   <button
                     onClick={fetchItemDetails}
                     disabled={loading}
                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                   >
                     {loading ? (
                       <>
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         {t('farmingTracker.search.updating')}
                       </>
                     ) : (
                       <>
                         <Package className="w-4 h-4" />
                         {t('farmingTracker.search.updatePrices')}
                       </>
                     )}
                   </button>
                   <div className="text-xs text-gray-400" suppressHydrationWarning={true}>
                     {t('farmingTracker.search.lastUpdate')}: {lastUpdate.toLocaleTimeString()}
                   </div>
                 </div>
               </div>
             </div>

             {/* Items Table */}
             <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-gray-700">
                 <h2 className="text-2xl font-bold text-white flex items-center">
                   <Package className="w-6 h-6 mr-3 text-green-400" />
                   Contenedor de Items Ganados - Análisis de Box Opening
                 </h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="border-b border-gray-700 bg-gray-800/60">
                       <th className="text-left p-3 text-gray-200 font-semibold cursor-pointer hover:bg-gray-700/60 transition-colors select-none" onClick={() => handleSort('name')}>
                         <div className="flex items-center gap-2">
                           {t('farmingTracker.table.headers.item')}
                           <div className="flex flex-col text-xs text-gray-500">
                             {sortBy === 'name' ? (
                               sortOrder === 'asc' ? (
                                 <span className="text-blue-400">↑</span>
                               ) : (
                                 <span className="text-blue-400">↓</span>
                               )
                             ) : (
                               <>
                                 <span>↑</span>
                                 <span>↓</span>
                               </>
                             )}
                           </div>
                         </div>
                       </th>
                       <SortableHeader column="difference">{t('farmingTracker.table.headers.quantityObtained')}</SortableHeader>
                       <SortableHeader column="currentPrice">{t('farmingTracker.table.headers.currentPrice')}</SortableHeader>
                       <SortableHeader column="totalValue">{t('farmingTracker.table.headers.totalValueGained')}</SortableHeader>
                       <SortableHeader column="percentage">{t('farmingTracker.table.headers.dropPercentage')}</SortableHeader>
                       <SortableHeader column="dropRate">{t('farmingTracker.table.headers.dropRatePerChest')}</SortableHeader>
                     </tr>
                   </thead>
                   <tbody>
                     {dungeonChestStats.itemsWithStats
                       .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                       .map((item, index) => (
                         <tr key={`${item.id}-${index}`} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                           <td className="p-3 text-white">
                             <div className="flex items-center gap-3">
                               {item.id > 0 && itemDetails[item.id]?.icon ? (
                                 <Image
                                   src={itemDetails[item.id].icon}
                                   alt={item.name}
                                   width={32}
                                   height={32}
                                   className="rounded"
                                 />
                               ) : (
                                 <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                                   <span className="text-xs text-gray-400">?</span>
                                 </div>
                               )}
                               <div>
                                 <div className="font-medium">{itemDetails[item.id]?.name || item.name}</div>
                               </div>
                             </div>
                           </td>
                           <td className="p-3 text-center">
                             <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                               item.difference > 0 
                                 ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                 : item.difference < 0
                                 ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                 : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                             }`}>
                               {item.difference > 0 ? '+' : ''}{item.difference.toLocaleString()}
                             </span>
                           </td>
                           <td className="p-3 text-center">
                             {item.id > 0 && itemDetails[item.id]?.currentPrice ? (
                               <div className="text-green-400 font-semibold">
                                 {formatGoldSilverCopper(itemDetails[item.id].currentPrice)}
                               </div>
                             ) : (
                               <span className="text-gray-500">-</span>
                             )}
                           </td>
                           <td className="p-3 text-center">
                             {item.id > 0 && itemDetails[item.id]?.currentPrice ? (
                               <div className="text-green-400 font-semibold">
                                 {formatGoldSilverCopper(itemDetails[item.id].currentPrice * Math.max(0, item.difference))}
                               </div>
                             ) : (
                               <span className="text-gray-500">-</span>
                             )}
                           </td>
                           <td className="p-3 text-center text-gray-300">
                             {item.percentage?.toFixed(2)}%
                           </td>
                           <td className="p-3 text-center text-gray-300">
                             {item.dropRate?.toFixed(2)}
                           </td>
                         </tr>
                       ))}
                   </tbody>
                 </table>
               </div>
               
               {/* Summary */}
               <div className="p-6 bg-gray-800/60 border-t border-gray-700">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                   <div>
                     <div className="text-2xl font-bold text-blue-400">
                       {dungeonChestStats.itemsWithStats.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).length}
                     </div>
                     <div className="text-gray-300 text-sm">{t('farmingTracker.summary.itemsShown')}</div>
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-green-400">
                       {formatGoldSilverCopper(dungeonChestStats.itemsWithStats.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).reduce((sum, item) => {
                         if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
                           return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
                         }
                         return sum;
                       }, 0))}
                     </div>
                     <div className="text-gray-300 text-sm">{t('farmingTracker.summary.totalValueFiltered')}</div>
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-yellow-400">
                       {formatGoldSilverCopper(Math.round(dungeonChestStats.itemsWithStats.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).reduce((sum, item) => {
                         if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
                           return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
                         }
                         return sum;
                       }, 0) / dungeonChestStats.estimatedChests))}
                     </div>
                     <div className="text-sm text-gray-300">{t('farmingTracker.summary.avgValuePerChest')}</div>
                   </div>
                 </div>
               </div>
             </div>
           </>
         )}

         {/* Adept Section (T2) */}
         {activeSection === 'adept' && (
           <>
             {/* Stats Overview */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.totalValueGained')}</h3>
                 <div className="text-3xl font-bold text-green-400">
                   {formatGoldSilverCopper(raidChestStats.totalValue)}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.totalValueGained')}</p>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.itemsGained')}</h3>
                 <div className="text-3xl font-bold text-blue-400">
                   {raidChestStats.totalItems.toLocaleString()}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.totalAmount')}</p>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.chestsOpened')}</h3>
                 <div className="text-3xl font-bold text-purple-400">
                   {raidChestStats.estimatedChests.toLocaleString()}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.basedOnRelics')}</p>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.avgGoldPerChest')}</h3>
                 <div className="text-3xl font-bold text-yellow-400">
                   {formatGoldSilverCopper(Math.round(raidChestStats.avgGoldPerChest))}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.avgValuePerChest')}</p>
               </div>
             </div>

             {/* Search and Update */}
             <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl mb-8">
               <div className="flex flex-col md:flex-row gap-4 items-center">
                 {/* Search */}
                 <div className="flex-1">
                   <div className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                     <input
                       type="text"
                       placeholder={t('farmingTracker.search.placeholder')}
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                     />
                   </div>
                 </div>
                 
                 {/* Update Button and Last Update Info */}
                 <div className="flex flex-col items-end gap-2">
                   <button
                     onClick={fetchItemDetails}
                     disabled={loading}
                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                   >
                     {loading ? (
                       <>
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         {t('farmingTracker.search.updating')}
                       </>
                     ) : (
                       <>
                         <Package className="w-4 h-4" />
                         {t('farmingTracker.search.updatePrices')}
                       </>
                     )}
                   </button>
                   <div className="text-xs text-gray-400" suppressHydrationWarning={true}>
                     {t('farmingTracker.search.lastUpdate')}: {lastUpdate.toLocaleTimeString()}
                   </div>
                 </div>
               </div>
             </div>

             {/* Items Table */}
             <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-gray-700">
                 <h2 className="text-2xl font-bold text-white flex items-center">
                   <Package className="w-6 h-6 mr-3 text-green-400" />
                   Contenedor de Items Ganados - Análisis de Box Opening
                 </h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="border-b border-gray-700 bg-gray-800/60">
                       <th className="text-left p-3 text-gray-200 font-semibold cursor-pointer hover:bg-gray-700/60 transition-colors select-none" onClick={() => handleSort('name')}>
                         <div className="flex items-center gap-2">
                           {t('farmingTracker.table.headers.item')}
                           <div className="flex flex-col text-xs text-gray-500">
                             {sortBy === 'name' ? (
                               sortOrder === 'asc' ? (
                                 <span className="text-blue-400">↑</span>
                               ) : (
                                 <span className="text-blue-400">↓</span>
                               )
                             ) : (
                               <>
                                 <span>↑</span>
                                 <span>↓</span>
                               </>
                             )}
                           </div>
                         </div>
                       </th>
                       <SortableHeader column="difference">{t('farmingTracker.table.headers.quantityObtained')}</SortableHeader>
                       <SortableHeader column="currentPrice">{t('farmingTracker.table.headers.currentPrice')}</SortableHeader>
                       <SortableHeader column="totalValue">{t('farmingTracker.table.headers.totalValueGained')}</SortableHeader>
                       <SortableHeader column="percentage">{t('farmingTracker.table.headers.dropPercentage')}</SortableHeader>
                       <SortableHeader column="dropRate">{t('farmingTracker.table.headers.dropRatePerChest')}</SortableHeader>
                     </tr>
                   </thead>
                   <tbody>
                     {raidChestStats.itemsWithStats
                       .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                       .map((item, index) => (
                         <tr key={`${item.id}-${index}`} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                           <td className="p-3 text-white">
                             <div className="flex items-center gap-3">
                               {item.id > 0 && itemDetails[item.id]?.icon ? (
                                 <Image
                                   src={itemDetails[item.id].icon}
                                   alt={item.name}
                                   width={32}
                                   height={32}
                                   className="rounded"
                                 />
                               ) : (
                                 <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                                   <span className="text-xs text-gray-400">?</span>
                                 </div>
                               )}
                               <div>
                                 <div className="font-medium">{itemDetails[item.id]?.name || item.name}</div>
                               </div>
                             </div>
                           </td>
                           <td className="p-3 text-center">
                             <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                               item.difference > 0 
                                 ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                 : item.difference < 0
                                 ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                 : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                             }`}>
                               {item.difference > 0 ? '+' : ''}{item.difference.toLocaleString()}
                             </span>
                           </td>
                           <td className="p-3 text-center">
                             {item.id > 0 && itemDetails[item.id]?.currentPrice ? (
                               <div className="text-green-400 font-semibold">
                                 {formatGoldSilverCopper(itemDetails[item.id].currentPrice)}
                               </div>
                             ) : (
                               <span className="text-gray-500">-</span>
                             )}
                           </td>
                           <td className="p-3 text-center">
                             {item.id > 0 && itemDetails[item.id]?.currentPrice ? (
                               <div className="text-green-400 font-semibold">
                                 {formatGoldSilverCopper(itemDetails[item.id].currentPrice * Math.max(0, item.difference))}
                               </div>
                             ) : (
                               <span className="text-gray-500">-</span>
                             )}
                           </td>
                           <td className="p-3 text-center text-gray-300">
                             {item.percentage?.toFixed(2)}%
                           </td>
                           <td className="p-3 text-center text-gray-300">
                             {item.dropRate?.toFixed(2)}
                           </td>
                         </tr>
                       ))}
                   </tbody>
                 </table>
               </div>
               
               {/* Summary */}
               <div className="p-6 bg-gray-800/60 border-t border-gray-700">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                   <div>
                     <div className="text-2xl font-bold text-blue-400">
                       {raidChestStats.itemsWithStats.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).length}
                     </div>
                     <div className="text-gray-300 text-sm">{t('farmingTracker.summary.itemsShown')}</div>
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-green-400">
                       {formatGoldSilverCopper(raidChestStats.itemsWithStats.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).reduce((sum, item) => {
                         if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
                           return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
                         }
                         return sum;
                       }, 0))}
                     </div>
                     <div className="text-gray-300 text-sm">{t('farmingTracker.summary.totalValueFiltered')}</div>
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-yellow-400">
                       {formatGoldSilverCopper(Math.round(raidChestStats.itemsWithStats.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).reduce((sum, item) => {
                         if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
                           return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
                         }
                         return sum;
                       }, 0) / raidChestStats.estimatedChests))}
                     </div>
                     <div className="text-sm text-gray-300">{t('farmingTracker.summary.avgValuePerChest')}</div>
                   </div>
                 </div>
               </div>
             </div>
           </>
         )}

         {/* Expert Section (T3) */}
         {activeSection === 'expert' && (
           <>
             {/* Stats Overview */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.totalValueGained')}</h3>
                 <div className="text-3xl font-bold text-green-400">
                   {formatGoldSilverCopper(strikeChestStats.totalValue)}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.totalValueGained')}</p>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.itemsGained')}</h3>
                 <div className="text-3xl font-bold text-blue-400">
                   {strikeChestStats.totalItems.toLocaleString()}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.totalAmount')}</p>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.chestsOpened')}</h3>
                 <div className="text-3xl font-bold text-purple-400">
                   {strikeChestStats.estimatedChests.toLocaleString()}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.basedOnRelics')}</p>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
                 <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.avgGoldPerChest')}</h3>
                 <div className="text-3xl font-bold text-yellow-400">
                   {formatGoldSilverCopper(Math.round(strikeChestStats.avgGoldPerChest))}
                 </div>
                 <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.avgValuePerChest')}</p>
               </div>
             </div>

             {/* Search and Update */}
             <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl mb-8">
               <div className="flex flex-col md:flex-row gap-4 items-center">
                 {/* Search */}
                 <div className="flex-1">
                   <div className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                     <input
                       type="text"
                       placeholder={t('farmingTracker.search.placeholder')}
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                     />
                   </div>
                 </div>
                 
                 {/* Update Button and Last Update Info */}
                 <div className="flex flex-col items-end gap-2">
                   <button
                     onClick={fetchItemDetails}
                     disabled={loading}
                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                   >
                     {loading ? (
                       <>
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         {t('farmingTracker.search.updating')}
                       </>
                     ) : (
                       <>
                         <Package className="w-4 h-4" />
                         {t('farmingTracker.search.updatePrices')}
                       </>
                     )}
                   </button>
                   <div className="text-xs text-gray-400" suppressHydrationWarning={true}>
                     {t('farmingTracker.search.lastUpdate')}: {lastUpdate.toLocaleTimeString()}
                   </div>
                 </div>
               </div>
             </div>

             {/* Items Table */}
             <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-gray-700">
                 <h2 className="text-2xl font-bold text-white flex items-center">
                   <Package className="w-6 h-6 mr-3 text-green-400" />
                   Contenedor de Items Ganados - Análisis de Box Opening
                 </h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="border-b border-gray-700 bg-gray-800/60">
                       <th className="text-left p-3 text-gray-200 font-semibold cursor-pointer hover:bg-gray-700/60 transition-colors select-none" onClick={() => handleSort('name')}>
                         <div className="flex items-center gap-2">
                           {t('farmingTracker.table.headers.item')}
                           <div className="flex flex-col text-xs text-gray-500">
                             {sortBy === 'name' ? (
                               sortOrder === 'asc' ? (
                                 <span className="text-blue-400">↑</span>
                               ) : (
                                 <span className="text-blue-400">↓</span>
                               )
                             ) : (
                               <>
                                 <span>↑</span>
                                 <span>↓</span>
                               </>
                             )}
                           </div>
                         </div>
                       </th>
                       <SortableHeader column="difference">{t('farmingTracker.table.headers.quantityObtained')}</SortableHeader>
                       <SortableHeader column="currentPrice">{t('farmingTracker.table.headers.currentPrice')}</SortableHeader>
                       <SortableHeader column="totalValue">{t('farmingTracker.table.headers.totalValueGained')}</SortableHeader>
                       <SortableHeader column="percentage">{t('farmingTracker.table.headers.dropPercentage')}</SortableHeader>
                       <SortableHeader column="dropRate">{t('farmingTracker.table.headers.dropRatePerChest')}</SortableHeader>
                     </tr>
                   </thead>
                   <tbody>
                     {strikeChestStats.itemsWithStats
                       .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                       .map((item, index) => (
                         <tr key={`${item.id}-${index}`} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                           <td className="p-3 text-white">
                             <div className="flex items-center gap-3">
                               {item.id > 0 && itemDetails[item.id]?.icon ? (
                                 <Image
                                   src={itemDetails[item.id].icon}
                                   alt={item.name}
                                   width={32}
                                   height={32}
                                   className="rounded"
                                 />
                               ) : (
                                 <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                                   <span className="text-xs text-gray-400">?</span>
                                 </div>
                               )}
                               <div>
                                 <div className="font-medium">{itemDetails[item.id]?.name || item.name}</div>
                               </div>
                             </div>
                           </td>
                           <td className="p-3 text-center">
                             <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                               item.difference > 0 
                                 ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                 : item.difference < 0
                                 ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                 : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                             }`}>
                               {item.difference > 0 ? '+' : ''}{item.difference.toLocaleString()}
                             </span>
                           </td>
                           <td className="p-3 text-center">
                             {item.id > 0 && itemDetails[item.id]?.currentPrice ? (
                               <div className="text-green-400 font-semibold">
                                 {formatGoldSilverCopper(itemDetails[item.id].currentPrice)}
                               </div>
                             ) : (
                               <span className="text-gray-500">-</span>
                             )}
                           </td>
                           <td className="p-3 text-center">
                             {item.id > 0 && itemDetails[item.id]?.currentPrice ? (
                               <div className="text-green-400 font-semibold">
                                 {formatGoldSilverCopper(itemDetails[item.id].currentPrice * Math.max(0, item.difference))}
                               </div>
                             ) : (
                               <span className="text-gray-500">-</span>
                             )}
                           </td>
                           <td className="p-3 text-center text-gray-300">
                             {item.percentage?.toFixed(2)}%
                           </td>
                           <td className="p-3 text-center text-gray-300">
                             {item.dropRate?.toFixed(2)}
                           </td>
                         </tr>
                       ))}
                   </tbody>
                 </table>
               </div>
               
               {/* Summary */}
               <div className="p-6 bg-gray-800/60 border-t border-gray-700">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                   <div>
                     <div className="text-2xl font-bold text-blue-400">
                       {strikeChestStats.itemsWithStats.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).length}
                     </div>
                     <div className="text-gray-300 text-sm">{t('farmingTracker.summary.itemsShown')}</div>
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-green-400">
                       {formatGoldSilverCopper(strikeChestStats.itemsWithStats.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).reduce((sum, item) => {
                         if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
                           return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
                         }
                         return sum;
                       }, 0))}
                     </div>
                     <div className="text-gray-300 text-sm">{t('farmingTracker.summary.totalValueFiltered')}</div>
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-yellow-400">
                       {formatGoldSilverCopper(Math.round(strikeChestStats.itemsWithStats.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).reduce((sum, item) => {
                         if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
                           return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
                         }
                         return sum;
                       }, 0) / strikeChestStats.estimatedChests))}
                     </div>
                     <div className="text-sm text-gray-300">{t('farmingTracker.summary.avgValuePerChest')}</div>
                   </div>
                 </div>
               </div>
             </div>
           </>
         )}

         {/* Fractal Section (T4) - Master's Chest */}
         {activeSection === 'fractal' && (
           <>
             {/* Stats Overview */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.totalValueGained')}</h3>
            <div className="text-3xl font-bold text-green-400">
              {formatGoldSilverCopper(stats.totalValue)}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {t('farmingTracker.stats.totalValueGained')}
            </p>
          </div>
          
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.itemsGained')}</h3>
            <div className="text-3xl font-bold text-blue-400">
              {stats.totalItems.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.totalAmount')}</p>
          </div>
          
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.chestsOpened')}</h3>
            <div className="text-3xl font-bold text-purple-400">
              {stats.estimatedChests.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.basedOnRelics')}</p>
          </div>
          
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('farmingTracker.stats.avgGoldPerChest')}</h3>
            <div className="text-3xl font-bold text-yellow-400">
              {formatGoldSilverCopper(Math.round(stats.avgGoldPerChest))}
            </div>
            <p className="text-sm text-gray-400 mt-2">{t('farmingTracker.stats.avgValuePerChest')}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('farmingTracker.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Update Button and Last Update Info */}
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={fetchItemDetails}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <div className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}>
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  )}
                </div>
                {loading ? t('farmingTracker.search.updating') : t('farmingTracker.search.updatePrices')}
              </button>
              <div className="text-xs text-gray-400" suppressHydrationWarning={true}>
                {t('farmingTracker.search.lastUpdate')}: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Items Container */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Package className="w-6 h-6 mr-3 text-blue-400" />
              Contenedor de Items Ganados - Análisis de Box Opening
            </h2>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-400 mt-2">{t('farmingTracker.search.loading')}</p>
              </div>
            )}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800/60">
                  <th className="text-left p-3 text-gray-200 font-semibold cursor-pointer hover:bg-gray-700/60 transition-colors select-none" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2">
                      {t('farmingTracker.table.headers.item')}
                      <div className="flex flex-col text-xs text-gray-500">
                        {sortBy === 'name' ? (
                          sortOrder === 'asc' ? (
                            <span className="text-blue-400">↑</span>
                          ) : (
                            <span className="text-blue-400">↓</span>
                          )
                        ) : (
                          <>
                            <span>↑</span>
                            <span>↓</span>
                          </>
                        )}
                      </div>
                    </div>
                  </th>
                  <SortableHeader column="difference">{t('farmingTracker.table.headers.quantityObtained')}</SortableHeader>
                  <SortableHeader column="currentPrice">{t('farmingTracker.table.headers.currentPrice')}</SortableHeader>
                  <SortableHeader column="totalValue">{t('farmingTracker.table.headers.totalValueGained')}</SortableHeader>
                  <SortableHeader column="percentage">{t('farmingTracker.table.headers.dropPercentage')}</SortableHeader>
                  <SortableHeader column="dropRate">{t('farmingTracker.table.headers.dropRatePerChest')}</SortableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedItems.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="p-3 text-white">
                      <div className="flex items-center gap-3">
                        {item.id > 0 && itemDetails[item.id]?.icon ? (
                          <Image 
                            src={itemDetails[item.id].icon} 
                            alt={itemDetails[item.id]?.name || item.name}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">?</span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{itemDetails[item.id]?.name || item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        item.difference > 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : item.difference < 0
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {item.difference > 0 ? '+' : ''}{item.difference.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {item.id > 0 && itemDetails[item.id]?.currentPrice ? (
                        <div className="text-green-400 font-semibold">
                          {formatGoldSilverCopper(itemDetails[item.id].currentPrice)}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {item.id > 0 && itemDetails[item.id]?.currentPrice ? (
                        <div className="text-green-400 font-semibold">
                          {formatGoldSilverCopper(itemDetails[item.id].currentPrice * Math.max(0, item.difference))}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center text-gray-300">
                      {item.percentage?.toFixed(2)}%
                    </td>
                    <td className="p-3 text-center text-gray-300">
                      {item.dropRate?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary */}
          <div className="p-6 bg-gray-800/60 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{filteredAndSortedItems.length}</div>
                <div className="text-gray-300 text-sm">{t('farmingTracker.summary.itemsShown')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {formatGoldSilverCopper(filteredAndSortedItems.reduce((sum, item) => {
                    if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
                      return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
                    }
                    return sum;
                  }, 0))}
                </div>
                <div className="text-gray-300 text-sm">{t('farmingTracker.summary.totalValueFiltered')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {formatGoldSilverCopper(Math.round(filteredAndSortedItems.reduce((sum, item) => {
                    if (item.id > 0 && itemDetails[item.id]?.currentPrice) {
                      return sum + (itemDetails[item.id].currentPrice * Math.max(0, item.difference));
                    }
                    return sum;
                  }, 0) / stats.estimatedChests))}
                </div>
                <div className="text-sm text-gray-300">{t('farmingTracker.summary.avgValuePerChest')}</div>
              </div>
            </div>
          </div>
        </div>
           </>
         )}
       </main>
     </div>
   );
 }