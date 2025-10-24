// Datos de fallback para cuando la API de GW2 esté deshabilitada
// Estos datos se usarán como backup para mantener la funcionalidad de la aplicación

// Función helper para crear items con propiedades completas
function createFallbackItem(id: number, name: string, icon: string, rarity: string = "Rare", level: number = 80) {
  return {
    id,
    name,
    description: "Used in crafting.",
    icon,
    rarity,
    type: "CraftingMaterial",
    level,
    vendor_value: 0,
    chat_link: "[&AgH8XQEA]"
  };
}

export const FALLBACK_ITEMS = {
  // Gift of Jade Mastery
  giftOfJadeMastery: {
    id: 96033,
    name: "Gift of Jade Mastery",
    description: "Used in the creation of legendary weapons.",
    icon: "https://wiki.guildwars2.com/images/a/a1/Gift_of_Jade_Mastery.png",
    rarity: "Legendary",
    type: "CraftingMaterial",
    level: 80,
    vendor_value: 0,
    chat_link: "[&AgH8XQEA]"
  },

  // Gift of Mastery
  giftOfMastery: {
    id: 19674,
    name: "Gift of Mastery",
    description: "Used in the creation of legendary weapons.",
    icon: "https://wiki.guildwars2.com/images/2/21/Gift_of_Mastery.png",
    rarity: "Legendary",
    type: "CraftingMaterial",
    level: 80,
    vendor_value: 0,
    chat_link: "[&AgH8XQEA]"
  },

  // Orrian Jewelry Box
  orrianJewelryBox: {
    id: 39088,
    name: "Orrian Jewelry Box",
    description: "A mysterious box found in the depths of Orr.",
    icon: "https://wiki.guildwars2.com/images/f/f2/Lost_Orrian_Jewelry_Box.png",
    rarity: "Rare",
    type: "Container",
    level: 80,
    vendor_value: 0,
    chat_link: "[&AgH8XQEA]"
  },

  // Materiales básicos
  ectoplasm: createFallbackItem(19721, "Glob of Ectoplasm", "https://wiki.guildwars2.com/images/9/9b/Glob_of_Ectoplasm.png", "Rare"),
  mysticCoin: createFallbackItem(19976, "Mystic Coin", "https://wiki.guildwars2.com/images/b/b5/Mystic_Coin.png", "Rare"),
  obsidianShard: createFallbackItem(19925, "Obsidian Shard", "https://wiki.guildwars2.com/images/f/f1/Obsidian_Shard.png", "Rare"),
  spiritShard: createFallbackItem(69910, "Spirit Shard", "https://wiki.guildwars2.com/images/6/63/Spirit_Shard.png", "Rare"),
  mysticClover: createFallbackItem(19675, "Mystic Clover", "https://wiki.guildwars2.com/images/7/7c/Mystic_Clover.png", "Legendary"),

  // Materiales T6
  t6Bone: createFallbackItem(24358, "Ancient Bone", "https://wiki.guildwars2.com/images/5/50/Ancient_Bone.png", "Exotic"),
  t6Totem: createFallbackItem(24300, "Elaborate Totem", "https://wiki.guildwars2.com/images/0/0a/Elaborate_Totem.png", "Exotic"),
  t6Blood: createFallbackItem(24295, "Vial of Powerful Blood", "https://wiki.guildwars2.com/images/5/5e/Vial_of_Powerful_Blood.png", "Exotic"),
  t6Dust: createFallbackItem(24277, "Pile of Crystalline Dust", "https://wiki.guildwars2.com/images/3/3a/Pile_of_Crystalline_Dust.png", "Exotic"),
  t6Claw: createFallbackItem(24351, "Vicious Claw", "https://wiki.guildwars2.com/images/f/f6/Vicious_Claw.png", "Exotic"),
  t6Fang: createFallbackItem(24357, "Vicious Fang", "https://wiki.guildwars2.com/images/a/a0/Vicious_Fang.png", "Exotic"),
  t6Venom: createFallbackItem(24283, "Powerful Venom Sac", "https://wiki.guildwars2.com/images/7/7a/Powerful_Venom_Sac.png", "Exotic"),
  t6Scale: createFallbackItem(24289, "Armored Scale", "https://wiki.guildwars2.com/images/a/a8/Armored_Scale.png", "Exotic"),

  // Materiales T5
  t5Blood: createFallbackItem(24294, "Vial of Potent Blood", "https://wiki.guildwars2.com/images/4/49/Vial_of_Potent_Blood.png", "Rare"),
  t5Bone: createFallbackItem(24341, "Large Bone", "https://wiki.guildwars2.com/images/0/0c/Large_Bone.png", "Rare"),
  t5Claw: createFallbackItem(24350, "Large Claw", "https://wiki.guildwars2.com/images/c/ca/Large_Claw.png", "Rare"),
  t5Scale: createFallbackItem(24356, "Large Scale", "https://wiki.guildwars2.com/images/f/f4/Large_Scale.png", "Rare"),
  t5Fang: createFallbackItem(24288, "Large Fang", "https://wiki.guildwars2.com/images/4/4c/Large_Fang.png", "Rare"),
  t5Totem: createFallbackItem(24299, "Intricate Totem", "https://wiki.guildwars2.com/images/3/37/Intricate_Totem.png", "Rare"),
  t5Venom: createFallbackItem(24282, "Potent Venom Sac", "https://wiki.guildwars2.com/images/9/9a/Potent_Venom_Sac.png", "Rare"),
  t5Dust: createFallbackItem(24276, "Pile of Incandescent Dust", "https://wiki.guildwars2.com/images/3/35/Pile_of_Incandescent_Dust.png", "Rare"),

  // Materiales T4
  t4Blood: createFallbackItem(24293, "Vial of Thick Blood", "https://wiki.guildwars2.com/images/0/0a/Vial_of_Thick_Blood.png", "Fine"),
  t4Bone: createFallbackItem(24345, "Heavy Bone", "https://wiki.guildwars2.com/images/0/01/Heavy_Bone.png", "Fine"),
  t4Claw: createFallbackItem(24348, "Sharp Claw", "https://wiki.guildwars2.com/images/c/c1/Sharp_Claw.png", "Fine"),
  t4Dust: createFallbackItem(24275, "Pile of Luminous Dust", "https://wiki.guildwars2.com/images/9/99/Pile_of_Luminous_Dust.png", "Fine"),
  t4Fang: createFallbackItem(24355, "Sharp Fang", "https://wiki.guildwars2.com/images/9/90/Sharp_Fang.png", "Fine"),
  t4Scale: createFallbackItem(24287, "Smooth Scale", "https://wiki.guildwars2.com/images/d/db/Smooth_Scale.png", "Fine"),
  t4Totem: createFallbackItem(24363, "Engraved Totem", "https://wiki.guildwars2.com/images/1/18/Engraved_Totem.png", "Fine"),
  t4Venom: createFallbackItem(24281, "Full Venom Sac", "https://wiki.guildwars2.com/images/c/ca/Full_Venom_Sac.png", "Fine"),

  // Materiales T3
  t3Blood: createFallbackItem(24292, "Vial of Blood", "https://wiki.guildwars2.com/images/9/9e/Vial_of_Blood.png", "Fine"),
  t3Bone: createFallbackItem(24344, "Bone", "https://wiki.guildwars2.com/images/2/2c/Bone.png", "Fine"),
  t3Claw: createFallbackItem(24349, "Claw", "https://wiki.guildwars2.com/images/4/47/Claw.png", "Fine"),
  t3Dust: createFallbackItem(24274, "Pile of Radiant Dust", "https://wiki.guildwars2.com/images/c/ce/Pile_of_Radiant_Dust.png", "Fine"),
  t3Fang: createFallbackItem(24354, "Fang", "https://wiki.guildwars2.com/images/c/c3/Fang.png", "Fine"),
  t3Scale: createFallbackItem(24286, "Scale", "https://wiki.guildwars2.com/images/4/4a/Scale.png", "Fine"),
  t3Totem: createFallbackItem(24298, "Totem", "https://wiki.guildwars2.com/images/5/5a/Totem.png", "Fine"),
  t3Venom: createFallbackItem(24280, "Venom Sac", "https://wiki.guildwars2.com/images/2/20/Venom_Sac.png", "Fine"),

  // Materiales específicos de Jade Mastery
  gloryShards: createFallbackItem(70820, "Shard of Glory", "https://wiki.guildwars2.com/images/0/0d/Shard_of_Glory.png", "Rare"),
  battleMemories: createFallbackItem(71581, "Memory of Battle", "https://wiki.guildwars2.com/images/c/c7/Memory_of_Battle.png", "Rare"),
  stabilizingMatrices: createFallbackItem(73248, "Stabilizing Matrices", "https://wiki.guildwars2.com/images/4/41/Stabilizing_Matrix.png", "Rare"),
  adventureTale: createFallbackItem(96151, "Tale of Adventure", "https://wiki.guildwars2.com/images/c/c5/Tale_of_Adventure.png", "Rare"),
  lanternInsignia: createFallbackItem(97790, "Lamplighter's Badge", "https://wiki.guildwars2.com/images/b/b6/Lamplighter%27s_Badge.png", "Rare"),
  supremePaper: createFallbackItem(71148, "Sheet of Premium Paper", "https://wiki.guildwars2.com/images/e/e6/Sheet_of_Premium_Paper.png", "Rare"),
  deldrimorIngot: createFallbackItem(46738, "Deldrimor Steel Ingot", "https://wiki.guildwars2.com/images/2/22/Deldrimor_Steel_Ingot.png", "Rare"),
  spiritualWood: createFallbackItem(46736, "Spiritwood Plank", "https://wiki.guildwars2.com/images/8/8e/Spiritwood_Plank.png", "Rare"),
  thermocatalyticReagents: createFallbackItem(46747, "Thermocatalytic Reagents", "https://wiki.guildwars2.com/images/5/53/Thermocatalytic_Reagent.png", "Rare"),
  pureJadeFragments: createFallbackItem(97102, "Chunk of Pure Jade", "https://wiki.guildwars2.com/images/e/e2/Chunk_of_Pure_Jade.png", "Rare"),
  jadeRunicStones: createFallbackItem(96722, "Jade Runestone", "https://wiki.guildwars2.com/images/f/f8/Jade_Runestone.png", "Rare"),
  ancientGrayAmber: createFallbackItem(96347, "Chunk of Ancient Ambergris", "https://wiki.guildwars2.com/images/2/25/Chunk_of_Ancient_Ambergris.png", "Rare"),
  ancientInvocationStones: createFallbackItem(96978, "Antique Summoning Stones", "https://wiki.guildwars2.com/images/f/f6/Antique_Summoning_Stone.png", "Rare"),
  dragonMagnetiteStone: createFallbackItem(92687, "Amalgamated Draconic Lodestone", "https://wiki.guildwars2.com/images/2/2c/Amalgamated_Draconic_Lodestone.png", "Rare"),

  // Materiales del vendedor
  giftOfCantha: createFallbackItem(97096, "Gift of Cantha", "https://wiki.guildwars2.com/images/1/1a/Gift_of_Cantha.png", "Legendary"),
  jadeEmpressBlessing: createFallbackItem(97829, "Blessing of the Jade Empress", "https://wiki.guildwars2.com/images/0/0c/Blessing_of_the_Jade_Empress.png", "Rare"),
  exoticLuckEssence: createFallbackItem(45178, "Exotic Essence of Luck", "https://wiki.guildwars2.com/images/f/fe/Exotic_Essence_of_Luck.png", "Exotic"),
  hematiteShard: createFallbackItem(20797, "Bloodstone Shard", "https://wiki.guildwars2.com/images/e/e7/Bloodstone_Shard.png", "Rare"),
  darkEnergyBall: createFallbackItem(71994, "Ball of Dark Energy", "https://wiki.guildwars2.com/images/6/67/Ball_of_Dark_Energy.png", "Rare"),
  researchNotes: createFallbackItem(96052, "Research Notes", "https://wiki.guildwars2.com/images/a/a1/Research_Note.png", "Rare"),
  giftOfBattle: createFallbackItem(19678, "Gift of Battle", "https://wiki.guildwars2.com/images/2/25/Gift_of_Battle.png", "Legendary"),
  giftOfExploration: createFallbackItem(19677, "Gift of Exploration", "https://wiki.guildwars2.com/images/d/d3/Gift_of_Exploration.png", "Legendary"),

  // Items de Orrian Jewelry Box
  dropOfLiquidKarma: createFallbackItem(36448, "Drop of Liquid Karma", "https://wiki.guildwars2.com/images/1/14/Drip_of_Liquid_Karma.png", "Fine"),
  tasteOfLiquidKarma: createFallbackItem(36451, "Taste of Liquid Karma", "https://wiki.guildwars2.com/images/2/24/Taste_of_Liquid_Karma.png", "Fine"),
  vialOfLiquidKarma: createFallbackItem(36456, "Vial of Liquid Karma", "https://wiki.guildwars2.com/images/f/f6/Vial_of_Liquid_Karma.png", "Fine"),
  swigOfLiquidKarma: createFallbackItem(36457, "Swig of Liquid Karma", "https://wiki.guildwars2.com/images/d/d4/Swig_of_Liquid_Karma.png", "Fine"),
  unidentifiableObject: createFallbackItem(39223, "Unidentifiable Object", "https://wiki.guildwars2.com/images/9/9f/Unidentifiable_Object.png", "Fine"),
  chargedLodestone: createFallbackItem(24305, "Charged Lodestone", "https://wiki.guildwars2.com/images/2/2f/Charged_Lodestone.png", "Rare"),
  crystalLodestone: createFallbackItem(24330, "Crystal Lodestone", "https://wiki.guildwars2.com/images/5/5c/Crystal_Lodestone.png", "Rare"),
  destroyerLodestone: createFallbackItem(24325, "Destroyer Lodestone", "https://wiki.guildwars2.com/images/f/f8/Destroyer_Lodestone.png", "Rare"),
  glacialLodestone: createFallbackItem(24320, "Glacial Lodestone", "https://wiki.guildwars2.com/images/4/47/Glacial_Lodestone.png", "Rare"),
  corruptedLodestone: createFallbackItem(24340, "Corrupted Lodestone", "https://wiki.guildwars2.com/images/c/c9/Corrupted_Lodestone.png", "Rare"),
  moltenLodestone: createFallbackItem(24315, "Molten Lodestone", "https://wiki.guildwars2.com/images/b/b1/Molten_Lodestone.png", "Rare"),
  onyxLodestone: createFallbackItem(24310, "Onyx Lodestone", "https://wiki.guildwars2.com/images/7/70/Onyx_Lodestone.png", "Rare"),
  pileOfPutridEssence: createFallbackItem(24335, "Pile of Putrid Essence", "https://wiki.guildwars2.com/images/e/e9/Pile_of_Putrid_Essence.png", "Rare"),
  miniRisenPriestOfBalthazar: createFallbackItem(39090, "Mini Risen Priest of Balthazar", "https://wiki.guildwars2.com/images/a/ac/Mini_Risen_Priest_of_Balthazar.png", "Rare"),
  warmPotion: createFallbackItem(35750, "Warm Potion", "https://wiki.guildwars2.com/images/e/e3/Potent_Potion_of_Destroyer_Slaying.png", "Fine"),
  chargedPotion: createFallbackItem(35749, "Charged Potion", "https://wiki.guildwars2.com/images/c/c9/Potent_Potion_of_Centaur_Slaying.png", "Fine"),
  coldPotion: createFallbackItem(35747, "Cold Potion", "https://wiki.guildwars2.com/images/3/35/Potent_Potion_of_Ice_Brood_Slaying.png", "Fine"),
  hardPotion: createFallbackItem(35748, "Hard Potion", "https://wiki.guildwars2.com/images/thumb/4/49/Potent_Potion_of_Ogre_Slaying.png/40px-Potent_Potion_of_Ogre_Slaying.png", "Fine"),

  item8868: createFallbackItem(8868, "Potent Potion of Sons of Svanir Slaying", "https://wiki.guildwars2.com/images/2/25/Potent_Potion_of_Sons_of_Svanir_Slaying.png", "Basic"),
  item13436: createFallbackItem(13436, "Emerald Mithril Earring", "https://wiki.guildwars2.com/images/6/6d/Emerald_Mithril_Earring.png", "Fine"),
  item13437: createFallbackItem(13437, "Beryl Mithril Earring", "https://wiki.guildwars2.com/images/6/62/Beryl_Mithril_Earring.png", "Fine"),
  item13435: createFallbackItem(13435, "Chrysocola Mithril Earring", "https://wiki.guildwars2.com/images/c/c6/Chrysocola_Mithril_Earring.png", "Fine"),
  item13438: createFallbackItem(13438, "Sapphire Mithril Earring", "https://wiki.guildwars2.com/images/b/b5/Sapphire_Mithril_Earring.png", "Rare"),
  item104934: createFallbackItem(104934, "Peer Reviewed Research", "https://wiki.guildwars2.com/images/9/9c/Peer_Reviewed_Research.png", "Rare"),
  item104934B: createFallbackItem(104934, "Peer Reviewed Research", "https://wiki.guildwars2.com/images/9/9c/Peer_Reviewed_Research.png", "Rare"),

};

// Función para detectar si estamos en modo offline/fallback
export function isOfflineMode(): boolean {
  // Verificar si hay errores de red o si la API no responde
  return typeof window !== 'undefined' && (
    !navigator.onLine || 
    localStorage.getItem('gw2-api-offline') === 'true'
  );
}

// Función para marcar la API como offline
export function setApiOffline(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gw2-api-offline', 'true');
  }
}

// Función para marcar la API como online
export function setApiOnline(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gw2-api-offline');
  }
}