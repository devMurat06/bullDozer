/**
 * Game State - Central state management
 */

import type { GameState, InventorySlot } from '../save/SaveSystem';
import type { IslandType } from '../terrain/TerrainGenerator';

export interface PlayerState {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  rotation: { yaw: number; pitch: number };
  health: number;
  maxHealth: number;
  onGround: boolean;
  isSprinting: boolean;
}

export interface WorldState {
  currentIsland: IslandType;
  modifiedBlocks: Map<string, string>;
  timeOfDay: number;
  day: number;
  seed: number;
}

export class GameWorld {
  public player: PlayerState = {
    position: { x: 0, y: 50, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    rotation: { yaw: 0, pitch: 0 },
    health: 100,
    maxHealth: 100,
    onGround: false,
    isSprinting: false,
  };
  
  public world: WorldState = {
    currentIsland: 'verdant',
    modifiedBlocks: new Map(),
    timeOfDay: 0.25,
    day: 1,
    seed: Math.floor(Math.random() * 10000),
  };
  
  public inventory: InventorySlot[] = [];
  public hotbar: number[] = Array(9).fill(-1);
  public selectedHotbarSlot: number = 0;
  public completedObjectives: Set<string> = new Set();
  
  public isPaused: boolean = false;
  public isInventoryOpen: boolean = false;
  
  // Give starter items
  giveStarterItems(): void {
    this.addItem('wooden_pickaxe', 1);
    this.addItem('wooden_axe', 1);
    this.addItem('stick', 8);
    this.selectHotbarSlot(0);
  }
  
  addItem(itemId: string, count: number): void {
    // Try to stack with existing
    for (const slot of this.inventory) {
      if (slot && slot.itemId === itemId && slot.count < 64) {
        const space = 64 - slot.count;
        const toAdd = Math.min(count, space);
        slot.count += toAdd;
        count -= toAdd;
        if (count <= 0) return;
      }
    }
    
    // Add new slots
    while (count > 0) {
      const toAdd = Math.min(count, 64);
      this.inventory.push({ itemId, count: toAdd });
      count -= toAdd;
    }
  }
  
  removeItem(itemId: string, count: number): boolean {
    let remaining = count;
    
    for (let i = this.inventory.length - 1; i >= 0; i--) {
      const slot = this.inventory[i];
      if (slot && slot.itemId === itemId) {
        if (slot.count <= remaining) {
          remaining -= slot.count;
          this.inventory.splice(i, 1);
        } else {
          slot.count -= remaining;
          remaining = 0;
        }
        if (remaining <= 0) return true;
      }
    }
    
    return remaining <= 0;
  }
  
  hasItem(itemId: string, count: number): boolean {
    let total = 0;
    for (const slot of this.inventory) {
      if (slot && slot.itemId === itemId) {
        total += slot.count;
      }
    }
    return total >= count;
  }
  
  getItemSlot(itemIndex: number): InventorySlot | undefined {
    return this.inventory[itemIndex];
  }
  
  selectHotbarSlot(slot: number): void {
    if (slot >= 0 && slot < 9) {
      this.selectedHotbarSlot = slot;
    }
  }
  
  getSelectedItemId(): string | null {
    const slotIndex = this.hotbar[this.selectedHotbarSlot];
    if (slotIndex === -1 || slotIndex >= this.inventory.length) return null;
    return this.inventory[slotIndex]?.itemId || null;
  }
  
  completeObjective(objectiveId: string): void {
    this.completedObjectives.add(objectiveId);
  }
  
  isObjectiveCompleted(objectiveId: string): boolean {
    return this.completedObjectives.has(objectiveId);
  }
  
  exportToSaveState(): GameState {
    return {
      player: {
        position: this.player.position,
        health: this.player.health,
        maxHealth: this.player.maxHealth,
        inventory: this.inventory,
        hotbar: [...this.hotbar],
        selectedSlot: this.selectedHotbarSlot,
      },
      world: {
        currentIsland: this.world.currentIsland === 'verdant' ? 0 : this.world.currentIsland === 'ashen' ? 1 : 2,
        modifiedBlocks: Object.fromEntries(this.world.modifiedBlocks),
        timeOfDay: this.world.timeOfDay,
        day: this.world.day,
      },
      objectives: {
        completed: Array.from(this.completedObjectives),
      },
      settings: {
        masterVolume: 70,
        musicVolume: 50,
        sfxVolume: 70,
        mouseSensitivity: 5,
        renderDistance: 4,
      },
      metadata: {
        saveTime: Date.now(),
        playTime: 0,
      },
    };
  }
  
  importFromSaveState(state: GameState): void {
    this.player.position = state.player.position;
    this.player.health = state.player.health;
    this.player.maxHealth = state.player.maxHealth;
    this.inventory = state.player.inventory;
    this.hotbar = state.player.hotbar;
    this.selectedHotbarSlot = state.player.selectedSlot;
    
    const islandIndex = state.world.currentIsland;
    this.world.currentIsland = islandIndex === 0 ? 'verdant' : islandIndex === 1 ? 'ashen' : 'celestial';
    this.world.modifiedBlocks = new Map(Object.entries(state.world.modifiedBlocks));
    this.world.timeOfDay = state.world.timeOfDay;
    this.world.day = state.world.day;
    
    this.completedObjectives = new Set(state.objectives.completed);
  }
}

// Singleton instance
export const gameWorld = new GameWorld();
