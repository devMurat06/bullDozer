/**
 * Terrain Generation - Procedural terrain for three distinct islands
 */

import { BLOCKS, type BlockId } from '../blocks/BlockTypes';

export type IslandType = 'verdant' | 'ashen' | 'celestial';

export interface IslandConfig {
  type: IslandType;
  name: string;
  seaLevel: number;
  baseHeight: number;
  heightVariation: number;
  surfaceBlocks: BlockId[];
  subsurfaceBlocks: BlockId[];
  caveDensity: number;
  oreDeposits: OreDeposit[];
}

export interface OreDeposit {
  blockId: BlockId;
  minY: number;
  maxY: number;
  chance: number;
  clusterSize: [number, number];
}

const VERDANT_CONFIG: IslandConfig = {
  type: 'verdant',
  name: 'Verdant Isle',
  seaLevel: 32,
  baseHeight: 35,
  heightVariation: 15,
  surfaceBlocks: ['grass', 'dirt', 'sand'],
  subsurfaceBlocks: ['stone', 'dirt'],
  caveDensity: 0.08,
  oreDeposits: [
    { blockId: 'coal_ore', minY: 10, maxY: 40, chance: 0.02, clusterSize: [4, 8] },
    { blockId: 'copper_ore', minY: 20, maxY: 50, chance: 0.015, clusterSize: [3, 6] },
    { blockId: 'iron_ore', minY: 10, maxY: 35, chance: 0.012, clusterSize: [3, 5] },
  ],
};

const ASHEN_CONFIG: IslandConfig = {
  type: 'ashen',
  name: 'Ashen Isle',
  seaLevel: 32,
  baseHeight: 45,
  heightVariation: 25,
  surfaceBlocks: ['volcanic_rock', 'ash', 'sand'],
  subsurfaceBlocks: ['volcanic_rock', 'stone'],
  caveDensity: 0.12,
  oreDeposits: [
    { blockId: 'coal_ore', minY: 15, maxY: 50, chance: 0.025, clusterSize: [5, 10] },
    { blockId: 'iron_ore', minY: 10, maxY: 40, chance: 0.018, clusterSize: [4, 7] },
    { blockId: 'gold_ore', minY: 5, maxY: 25, chance: 0.01, clusterSize: [2, 4] },
    { blockId: 'diamond_ore', minY: 5, maxY: 20, chance: 0.005, clusterSize: [1, 3] },
  ],
};

const CELESTIAL_CONFIG: IslandConfig = {
  type: 'celestial',
  name: 'Celestial Isle',
  seaLevel: 32,
  baseHeight: 40,
  heightVariation: 20,
  surfaceBlocks: ['frozen_grass', 'snow', 'packed_ice'],
  subsurfaceBlocks: ['stone', 'packed_ice'],
  caveDensity: 0.06,
  oreDeposits: [
    { blockId: 'crystal_ore', minY: 15, maxY: 55, chance: 0.02, clusterSize: [3, 6] },
    { blockId: 'ancient_stone', minY: 5, maxY: 30, chance: 0.008, clusterSize: [2, 4] },
    { blockId: 'diamond_ore', minY: 5, maxY: 25, chance: 0.01, clusterSize: [2, 4] },
  ],
};

export const ISLAND_CONFIGS: Record<IslandType, IslandConfig> = {
  verdant: VERDANT_CONFIG,
  ashen: ASHEN_CONFIG,
  celestial: CELESTIAL_CONFIG,
};

// Simplex-like noise implementation
class Noise {
  private permutation: number[];
  
  constructor(seed: number) {
    this.permutation = [];
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    
    // Shuffle based on seed
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    
    for (let i = 0; i < 512; i++) {
      this.permutation[i] = p[i & 255];
    }
  }
  
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }
  
  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const A = this.permutation[X] + Y;
    const B = this.permutation[X + 1] + Y;
    
    return this.lerp(
      this.lerp(this.grad(this.permutation[A], x, y), this.grad(this.permutation[B], x - 1, y), u),
      this.lerp(this.grad(this.permutation[A + 1], x, y - 1), this.grad(this.permutation[B + 1], x - 1, y - 1), u),
      v
    );
  }
  
  octaveNoise(x: number, y: number, octaves: number, persistence: number): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }
    
    return total / maxValue;
  }
}

export class TerrainGenerator {
  private noise: Noise;
  private config: IslandConfig;
  
  constructor(islandType: IslandType, seed: number) {
    this.config = ISLAND_CONFIGS[islandType];
    this.noise = new Noise(seed);
  }
  
  getHeight(worldX: number, worldZ: number): number {
    const scale = 0.02;
    const baseHeight = this.config.baseHeight;
    const variation = this.config.heightVariation;
    
    const noiseValue = this.noise.octaveNoise(worldX * scale, worldZ * scale, 4, 0.5);
    const height = baseHeight + noiseValue * variation;
    
    return Math.max(this.config.seaLevel - 5, Math.floor(height));
  }
  
  getBlockAt(worldX: number, worldY: number, worldZ: number): BlockId {
    const height = this.getHeight(worldX, worldZ);
    
    // Bedrock at bottom
    if (worldY <= 0) return 'bedrock';
    
    // Water below sea level
    if (worldY < this.config.seaLevel && worldY > height) {
      return 'water';
    }
    
    // Surface blocks
    if (worldY === height) {
      if (height < this.config.seaLevel + 2) {
        return 'sand';
      }
      return this.config.surfaceBlocks[0];
    }
    
    // Subsurface
    if (worldY > height - 4 && worldY < height) {
      if (this.config.type === 'verdant') {
        return worldY > height - 2 ? 'dirt' : 'stone';
      }
      return this.config.subsurfaceBlocks[0];
    }
    
    // Deep stone
    if (worldY <= height) {
      return 'stone';
    }
    
    // Air above ground
    return 'air';
  }
  
  generateChunk(chunkX: number, chunkZ: number, chunkSize: number): BlockId[][][] {
    const blocks: BlockId[][][] = [];
    
    for (let y = 0; y < 64; y++) {
      blocks[y] = [];
      for (let x = 0; x < chunkSize; x++) {
        blocks[y][x] = [];
        for (let z = 0; z < chunkSize; z++) {
          const worldX = chunkX * chunkSize + x;
          const worldZ = chunkZ * chunkSize + z;
          blocks[y][x][z] = this.getBlockAt(worldX, y, worldZ);
        }
      }
    }
    
    // Generate caves
    this.generateCaves(blocks, chunkX, chunkZ, chunkSize);
    
    // Generate ores
    this.generateOres(blocks, chunkX, chunkZ, chunkSize);
    
    return blocks;
  }
  
  private generateCaves(blocks: BlockId[][][], chunkX: number, chunkZ: number, chunkSize: number): void {
    const density = this.config.caveDensity;
    
    for (let x = 0; x < chunkSize; x++) {
      for (let y = 10; y < 50; y++) {
        for (let z = 0; z < chunkSize; z++) {
          const worldX = chunkX * chunkSize + x;
          const worldZ = chunkZ * chunkSize + z;
          
          const caveNoise = this.noise.octaveNoise(worldX * 0.05, y * 0.05, 2, 0.5);
          if (caveNoise > 1 - density) {
            blocks[y][x][z] = 'air';
          }
        }
      }
    }
  }
  
  private generateOres(blocks: BlockId[][][], chunkX: number, chunkZ: number, chunkSize: number): void {
    for (const deposit of this.config.oreDeposits) {
      const attempts = Math.floor(chunkSize * chunkSize * 0.1);
      
      for (let i = 0; i < attempts; i++) {
        if (Math.random() > deposit.chance) continue;
        
        const cx = Math.floor(Math.random() * chunkSize);
        const cy = Math.floor(deposit.minY + Math.random() * (deposit.maxY - deposit.minY));
        const cz = Math.floor(Math.random() * chunkSize);
        
        const [minSize, maxSize] = deposit.clusterSize;
        const size = Math.floor(minSize + Math.random() * (maxSize - minSize));
        
        for (let dx = -size; dx <= size; dx++) {
          for (let dy = -size; dy <= size; dy++) {
            for (let dz = -size; dz <= size; dz++) {
              if (dx * dx + dy * dy + dz * dz > size * size) continue;
              
              const bx = cx + dx;
              const by = cy + dy;
              const bz = cz + dz;
              
              if (bx >= 0 && bx < chunkSize && by >= 0 && by < 64 && bz >= 0 && bz < chunkSize) {
                if (blocks[by][bx][bz] === 'stone') {
                  blocks[by][bx][bz] = deposit.blockId;
                }
              }
            }
          }
        }
      }
    }
  }
}

export function createTerrainGenerator(islandType: IslandType, seed: number): TerrainGenerator {
  return new TerrainGenerator(islandType, seed);
}
