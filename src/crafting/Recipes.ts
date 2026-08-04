/**
 * Crafting Recipes
 */

import type { ItemId } from '../items/ItemTypes.js';

export interface CraftingRecipe {
  output: { itemId: ItemId; count: number };
  ingredients: Partial<Record<ItemId, number>>;
  category: 'basic' | 'tools' | 'building' | 'advanced';
}

export const RECIPES: CraftingRecipe[] = [
  // Basic - Planks from wood
  {
    output: { itemId: 'planks', count: 4 },
    ingredients: { wood_oak: 1 },
    category: 'basic',
  },
  {
    output: { itemId: 'planks', count: 4 },
    ingredients: { wood_pine: 1 },
    category: 'basic',
  },
  // Sticks
  {
    output: { itemId: 'stick', count: 4 },
    ingredients: { planks: 2 },
    category: 'basic',
  },
  // Wooden Tools
  {
    output: { itemId: 'wooden_pickaxe', count: 1 },
    ingredients: { planks: 3, stick: 2 },
    category: 'tools',
  },
  {
    output: { itemId: 'wooden_axe', count: 1 },
    ingredients: { planks: 3, stick: 2 },
    category: 'tools',
  },
  {
    output: { itemId: 'wooden_shovel', count: 1 },
    ingredients: { planks: 1, stick: 2 },
    category: 'tools',
  },
  {
    output: { itemId: 'wooden_sword', count: 1 },
    ingredients: { planks: 2, stick: 1 },
    category: 'tools',
  },
  // Stone Tools
  {
    output: { itemId: 'stone_pickaxe', count: 1 },
    ingredients: { cobblestone: 3, stick: 2 },
    category: 'tools',
  },
  {
    output: { itemId: 'stone_axe', count: 1 },
    ingredients: { cobblestone: 3, stick: 2 },
    category: 'tools',
  },
  {
    output: { itemId: 'stone_shovel', count: 1 },
    ingredients: { cobblestone: 1, stick: 2 },
    category: 'tools',
  },
  {
    output: { itemId: 'stone_sword', count: 1 },
    ingredients: { cobblestone: 2, stick: 1 },
    category: 'tools',
  },
  // Iron Tools
  {
    output: { itemId: 'iron_pickaxe', count: 1 },
    ingredients: { iron_ore: 3, stick: 2 },
    category: 'advanced',
  },
  {
    output: { itemId: 'iron_axe', count: 1 },
    ingredients: { iron_ore: 3, stick: 2 },
    category: 'advanced',
  },
  {
    output: { itemId: 'iron_shovel', count: 1 },
    ingredients: { iron_ore: 1, stick: 2 },
    category: 'advanced',
  },
  {
    output: { itemId: 'iron_sword', count: 1 },
    ingredients: { iron_ore: 2, stick: 1 },
    category: 'advanced',
  },
  // Building
  {
    output: { itemId: 'bricks', count: 4 },
    ingredients: { cobblestone: 4 },
    category: 'building',
  },
  {
    output: { itemId: 'glass', count: 4 },
    ingredients: { sand: 4 },
    category: 'building',
  },
  {
    output: { itemId: 'torch', count: 4 },
    ingredients: { coal: 1, stick: 1 },
    category: 'building',
  },
  // Special
  {
    output: { itemId: 'crafting_table', count: 1 },
    ingredients: { planks: 4 },
    category: 'basic',
  },
  {
    output: { itemId: 'chest', count: 1 },
    ingredients: { planks: 8 },
    category: 'basic',
  },
];

export function canCraft(recipe: CraftingRecipe, inventory: Record<string, number>): boolean {
  for (const [ingredientId, requiredCount] of Object.entries(recipe.ingredients)) {
    const available = inventory[ingredientId] || 0;
    if (available < requiredCount) {
      return false;
    }
  }
  return true;
}

export function craft(recipe: CraftingRecipe, inventory: Record<string, number>): Record<string, number> | null {
  if (!canCraft(recipe, inventory)) {
    return null;
  }
  
  const newInventory = { ...inventory };
  for (const [ingredientId, requiredCount] of Object.entries(recipe.ingredients)) {
    newInventory[ingredientId] -= requiredCount;
    if (newInventory[ingredientId] <= 0) {
      delete newInventory[ingredientId];
    }
  }
  
  const outputId = recipe.output.itemId;
  newInventory[outputId] = (newInventory[outputId] || 0) + recipe.output.count;
  
  return newInventory;
}

export function getRecipesByCategory(category: string): CraftingRecipe[] {
  return RECIPES.filter(r => r.category === category);
}

export function getAllRecipes(): CraftingRecipe[] {
  return RECIPES;
}
