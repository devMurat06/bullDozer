/**
 * Item Types - All items in the game
 */

export type ItemId =
  // Resources
  | 'dirt' | 'cobblestone' | 'sand' | 'snowball' | 'ash' | 'volcanic_rock'
  | 'wood_oak' | 'wood_pine' | 'stick' | 'apple'
  | 'coal' | 'copper_ingot' | 'iron_ore' | 'gold_ore' | 'diamond'
  | 'crystal_shard' | 'ancient_fragment'
  | 'brick' | 'glass_block'
  // Tools
  | 'wooden_pickaxe' | 'stone_pickaxe' | 'iron_pickaxe' | 'diamond_pickaxe'
  | 'wooden_axe' | 'stone_axe' | 'iron_axe' | 'diamond_axe'
  | 'wooden_shovel' | 'stone_shovel' | 'iron_shovel' | 'diamond_shovel'
  | 'wooden_sword' | 'stone_sword' | 'iron_sword' | 'diamond_sword'
  // Materials
  | 'planks' | 'bricks' | 'glass' | 'torch'
  // Special
  | 'crafting_table' | 'chest'
  // Food
  | 'cooked_meat' | 'bread';

export interface ItemData {
  id: ItemId;
  name: string;
  icon: string;
  stackSize: number;
  category: 'resource' | 'tool' | 'weapon' | 'material' | 'food' | 'special';
  durability?: number;
  toolType?: 'pickaxe' | 'axe' | 'shovel' | 'sword';
  miningSpeed?: Record<string, number>;
  damage?: number;
  foodValue?: number;
}

export const ITEMS: Record<ItemId, ItemData> = {
  // Resources
  dirt: { id: 'dirt', name: 'Dirt', icon: '🟫', stackSize: 64, category: 'resource' },
  cobblestone: { id: 'cobblestone', name: 'Cobblestone', icon: '🪨', stackSize: 64, category: 'resource' },
  sand: { id: 'sand', name: 'Sand', icon: '🏖️', stackSize: 64, category: 'resource' },
  snowball: { id: 'snowball', name: 'Snowball', icon: '⚪', stackSize: 16, category: 'resource' },
  ash: { id: 'ash', name: 'Ash', icon: '🌫️', stackSize: 64, category: 'resource' },
  volcanic_rock: { id: 'volcanic_rock', name: 'Volcanic Rock', icon: '🌑', stackSize: 64, category: 'resource' },
  
  wood_oak: { id: 'wood_oak', name: 'Oak Log', icon: '🪵', stackSize: 64, category: 'resource' },
  wood_pine: { id: 'wood_pine', name: 'Pine Log', icon: '🌲', stackSize: 64, category: 'resource' },
  stick: { id: 'stick', name: 'Stick', icon: '🥢', stackSize: 64, category: 'resource' },
  apple: { id: 'apple', name: 'Apple', icon: '🍎', stackSize: 64, category: 'food', foodValue: 4 },
  
  coal: { id: 'coal', name: 'Coal', icon: '⚫', stackSize: 64, category: 'resource' },
  copper_ingot: { id: 'copper_ingot', name: 'Copper Ingot', icon: '🥉', stackSize: 64, category: 'resource' },
  iron_ore: { id: 'iron_ore', name: 'Iron Ore', icon: '🔶', stackSize: 64, category: 'resource' },
  gold_ore: { id: 'gold_ore', name: 'Gold Ore', icon: '🥇', stackSize: 64, category: 'resource' },
  diamond: { id: 'diamond', name: 'Diamond', icon: '💎', stackSize: 64, category: 'resource' },
  crystal_shard: { id: 'crystal_shard', name: 'Crystal Shard', icon: '💠', stackSize: 64, category: 'resource' },
  ancient_fragment: { id: 'ancient_fragment', name: 'Ancient Fragment', icon: '🔮', stackSize: 64, category: 'resource' },
  
  brick: { id: 'brick', name: 'Brick', icon: '🧱', stackSize: 64, category: 'material' },
  glass_block: { id: 'glass_block', name: 'Glass Block', icon: '🪟', stackSize: 64, category: 'material' },
  
  // Tools - Wooden
  wooden_pickaxe: { 
    id: 'wooden_pickaxe', name: 'Wooden Pickaxe', icon: '⛏️', stackSize: 1, category: 'tool',
    durability: 60, toolType: 'pickaxe',
    miningSpeed: { stone: 2, ore: 2 }
  },
  wooden_axe: { 
    id: 'wooden_axe', name: 'Wooden Axe', icon: '🪓', stackSize: 1, category: 'tool',
    durability: 60, toolType: 'axe',
    miningSpeed: { wood: 2 }
  },
  wooden_shovel: { 
    id: 'wooden_shovel', name: 'Wooden Shovel', icon: ' shovel', stackSize: 1, category: 'tool',
    durability: 60, toolType: 'shovel',
    miningSpeed: { dirt: 2, sand: 2, snow: 2 }
  },
  wooden_sword: { 
    id: 'wooden_sword', name: 'Wooden Sword', icon: '🗡️', stackSize: 1, category: 'weapon',
    durability: 60, toolType: 'sword', damage: 4
  },
  
  // Tools - Stone
  stone_pickaxe: { 
    id: 'stone_pickaxe', name: 'Stone Pickaxe', icon: '⛏️', stackSize: 1, category: 'tool',
    durability: 132, toolType: 'pickaxe',
    miningSpeed: { stone: 4, ore: 4 }
  },
  stone_axe: { 
    id: 'stone_axe', name: 'Stone Axe', icon: '🪓', stackSize: 1, category: 'tool',
    durability: 132, toolType: 'axe',
    miningSpeed: { wood: 4 }
  },
  stone_shovel: { 
    id: 'stone_shovel', name: 'Stone Shovel', icon: '🥄', stackSize: 1, category: 'tool',
    durability: 132, toolType: 'shovel',
    miningSpeed: { dirt: 4, sand: 4, snow: 4 }
  },
  stone_sword: { 
    id: 'stone_sword', name: 'Stone Sword', icon: '🗡️', stackSize: 1, category: 'weapon',
    durability: 132, toolType: 'sword', damage: 5
  },
  
  // Tools - Iron
  iron_pickaxe: { 
    id: 'iron_pickaxe', name: 'Iron Pickaxe', icon: '⛏️', stackSize: 1, category: 'tool',
    durability: 251, toolType: 'pickaxe',
    miningSpeed: { stone: 6, ore: 6 }
  },
  iron_axe: { 
    id: 'iron_axe', name: 'Iron Axe', icon: '🪓', stackSize: 1, category: 'tool',
    durability: 251, toolType: 'axe',
    miningSpeed: { wood: 6 }
  },
  iron_shovel: { 
    id: 'iron_shovel', name: 'Iron Shovel', icon: '🥄', stackSize: 1, category: 'tool',
    durability: 251, toolType: 'shovel',
    miningSpeed: { dirt: 6, sand: 6, snow: 6 }
  },
  iron_sword: { 
    id: 'iron_sword', name: 'Iron Sword', icon: '🗡️', stackSize: 1, category: 'weapon',
    durability: 251, toolType: 'sword', damage: 6
  },
  
  // Tools - Diamond
  diamond_pickaxe: { 
    id: 'diamond_pickaxe', name: 'Diamond Pickaxe', icon: '⛏️', stackSize: 1, category: 'tool',
    durability: 1562, toolType: 'pickaxe',
    miningSpeed: { stone: 8, ore: 8 }
  },
  diamond_axe: { 
    id: 'diamond_axe', name: 'Diamond Axe', icon: '🪓', stackSize: 1, category: 'tool',
    durability: 1562, toolType: 'axe',
    miningSpeed: { wood: 8 }
  },
  diamond_shovel: { 
    id: 'diamond_shovel', name: 'Diamond Shovel', icon: '🥄', stackSize: 1, category: 'tool',
    durability: 1562, toolType: 'shovel',
    miningSpeed: { dirt: 8, sand: 8, snow: 8 }
  },
  diamond_sword: { 
    id: 'diamond_sword', name: 'Diamond Sword', icon: '🗡️', stackSize: 1, category: 'weapon',
    durability: 1562, toolType: 'sword', damage: 7
  },
  
  // Materials
  planks: { id: 'planks', name: 'Wood Planks', icon: '🪵', stackSize: 64, category: 'material' },
  bricks: { id: 'bricks', name: 'Bricks', icon: '🧱', stackSize: 64, category: 'material' },
  glass: { id: 'glass', name: 'Glass', icon: '🪟', stackSize: 64, category: 'material' },
  torch: { id: 'torch', name: 'Torch', icon: '🔦', stackSize: 64, category: 'material' },
  
  // Special
  crafting_table: { id: 'crafting_table', name: 'Crafting Table', icon: '🔨', stackSize: 64, category: 'special' },
  chest: { id: 'chest', name: 'Chest', icon: '📦', stackSize: 64, category: 'special' },
  
  // Food
  cooked_meat: { id: 'cooked_meat', name: 'Cooked Meat', icon: '🍖', stackSize: 64, category: 'food', foodValue: 8 },
  bread: { id: 'bread', name: 'Bread', icon: '🍞', stackSize: 64, category: 'food', foodValue: 5 },
};

export const ALL_ITEM_IDS = Object.keys(ITEMS) as ItemId[];

export function getItem(id: ItemId): ItemData {
  return ITEMS[id];
}

export function isTool(itemId: string): boolean {
  return ITEMS[itemId as ItemId]?.category === 'tool';
}

export function isWeapon(itemId: string): boolean {
  return ITEMS[itemId as ItemId]?.category === 'weapon';
}
