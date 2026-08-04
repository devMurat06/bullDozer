/**
 * Objectives System - Tracks and updates player objectives
 */

import { gameWorld } from '../core/GameWorld';

export const Objectives = {
  checkAll(): void {
    this.checkGatherWood();
    this.checkCraftTool();
    this.checkBuildShelter();
    this.checkFindCave();
    this.checkMineOre();
  },
  
  checkGatherWood(): void {
    if (!gameWorld.isObjectiveCompleted('gather_wood')) {
      if (gameWorld.hasItem('wood_oak', 1) || gameWorld.hasItem('wood_pine', 1)) {
        gameWorld.completeObjective('gather_wood');
      }
    }
  },
  
  checkCraftTool(): void {
    if (!gameWorld.isObjectiveCompleted('craft_tool')) {
      const tools = ['wooden_pickaxe', 'wooden_axe', 'wooden_shovel', 'stone_pickaxe', 'stone_axe'];
      for (const tool of tools) {
        if (gameWorld.hasItem(tool, 1)) {
          gameWorld.completeObjective('craft_tool');
          break;
        }
      }
    }
  },
  
  checkBuildShelter(): void {
    // This would require tracking placed blocks
    // Simplified for now
  },
  
  checkFindCave(): void {
    // Would require checking if player is in a cave
    // Simplified for now
  },
  
  checkMineOre(): void {
    if (!gameWorld.isObjectiveCompleted('mine_ore')) {
      const ores = ['coal', 'copper_ingot', 'iron_ore', 'gold_ore', 'diamond'];
      for (const ore of ores) {
        if (gameWorld.hasItem(ore, 1)) {
          gameWorld.completeObjective('mine_ore');
          break;
        }
      }
    }
  },
};
