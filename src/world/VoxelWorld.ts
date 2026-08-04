/**
 * Voxel World - Chunk-based voxel world rendering and management
 */

import * as THREE from 'three';
import type { BlockId } from '../blocks/BlockTypes';
import { BLOCKS } from '../blocks/BlockTypes';
import type { IslandType } from '../terrain/TerrainGenerator';
import { TerrainGenerator } from '../terrain/TerrainGenerator';

const CHUNK_SIZE = 16;
const RENDER_DISTANCE = 4;

export class VoxelWorld {
  private scene: THREE.Scene;
  private chunks: Map<string, THREE.Mesh>;
  private blockData: Map<string, BlockId>;
  private terrainGenerator: TerrainGenerator | null = null;
  private currentIsland: IslandType = 'verdant';
  
  private materials: Record<string, THREE.MeshLambertMaterial> = {};
  private geometries: Record<string, THREE.BoxGeometry> = {};
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.chunks = new Map();
    this.blockData = new Map();
    
    this.setupMaterials();
    this.setupGeometries();
    this.setupLighting();
  }
  
  private setupMaterials(): void {
    const colors: Record<string, string> = {
      grass: '#5dbb63',
      dirt: '#8b5a2b',
      stone: '#7a7a7a',
      sand: '#e6d8a3',
      water: '#3399ff',
      wood_oak: '#6b4423',
      leaves_oak: '#228b22',
      snow: '#fffafa',
      ice: '#aaddff',
      volcanic_rock: '#3a3a3a',
      ash: '#8a8a8a',
      lava: '#ff4500',
      coal_ore: '#3a3a3a',
      iron_ore: '#a67c52',
      gold_ore: '#ffd700',
      diamond_ore: '#5dade2',
      crystal_ore: '#c77dff',
      ancient_stone: '#6a4a8a',
      planks: '#a0825a',
      bricks: '#a0522d',
      glass: '#e0f8ff',
    };
    
    for (const [blockId, color] of Object.entries(colors)) {
      this.materials[blockId] = new THREE.MeshLambertMaterial({ 
        color,
        transparent: blockId === 'water' || blockId === 'glass' || blockId === 'ice',
        opacity: blockId === 'water' ? 0.7 : blockId === 'glass' ? 0.5 : 1,
      });
    }
  }
  
  private setupGeometries(): void {
    // Shared geometry for all blocks
    const baseGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometries['default'] = baseGeometry;
  }
  
  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(100, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    this.scene.add(sunLight);
    
    // Hemisphere light for sky/ground color variation
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x5dbb63, 0.4);
    this.scene.add(hemiLight);
  }
  
  generateInitialChunks(islandType: IslandType, seed: number): void {
    this.currentIsland = islandType;
    this.terrainGenerator = new TerrainGenerator(islandType, seed);
    
    // Clear existing chunks
    this.clearChunks();
    
    // Generate initial chunks around spawn
    const centerChunkX = 0;
    const centerChunkZ = 0;
    
    for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
      for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
        const chunkX = centerChunkX + dx;
        const chunkZ = centerChunkZ + dz;
        this.generateChunk(chunkX, chunkZ);
      }
    }
  }
  
  private clearChunks(): void {
    for (const mesh of this.chunks.values()) {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
    this.chunks.clear();
    this.blockData.clear();
  }
  
  private generateChunk(chunkX: number, chunkZ: number): void {
    const chunkKey = `${chunkX},${chunkZ}`;
    if (this.chunks.has(chunkKey)) return;
    
    if (!this.terrainGenerator) return;
    
    const chunkBlocks = this.terrainGenerator.generateChunk(chunkX, chunkZ, CHUNK_SIZE);
    
    // Create merged geometry for the chunk
    const geometries: THREE.BoxGeometry[] = [];
    const materialIndices: number[] = [];
    const materials: THREE.Material[] = [];
    const materialMap = new Map<string, number>();
    
    let materialIndex = 0;
    
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {
          const blockId = chunkBlocks[y][x][z];
          
          if (blockId === 'air' || blockId === 'water') continue;
          
          const worldX = chunkX * CHUNK_SIZE + x;
          const worldY = y;
          const worldZ = chunkZ * CHUNK_SIZE + z;
          
          // Store block data
          this.blockData.set(`${worldX},${worldY},${worldZ}`, blockId);
          
          // Only render visible faces (simple culling)
          if (!this.isVisible(worldX, worldY, worldZ)) continue;
          
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          geometry.translate(worldX, worldY, worldZ);
          
          // Get or create material
          let matIndex = materialMap.get(blockId);
          if (matIndex === undefined) {
            const material = this.getMaterialForBlock(blockId);
            if (material) {
              materials.push(material);
              matIndex = materialIndex++;
              materialMap.set(blockId, matIndex);
            }
          }
          
          if (matIndex !== undefined) {
            geometries.push(geometry);
            materialIndices.push(matIndex);
          }
        }
      }
    }
    
    if (geometries.length > 0) {
      // Merge geometries
      const mergedGeometry = this.mergeGeometries(geometries);
      
      // Create mesh with multi-material
      const chunkMesh = new THREE.Mesh(mergedGeometry, materials);
      chunkMesh.castShadow = true;
      chunkMesh.receiveShadow = true;
      
      this.scene.add(chunkMesh);
      this.chunks.set(chunkKey, chunkMesh);
    }
  }
  
  private isVisible(x: number, y: number, z: number): boolean {
    // Check if any face is exposed to air or transparent block
    const neighbors = [
      [x + 1, y, z], [x - 1, y, z],
      [x, y + 1, z], [x, y - 1, z],
      [x, y, z + 1], [x, y, z - 1],
    ];
    
    for (const [nx, ny, nz] of neighbors) {
      const neighborBlock = this.getBlock(nx, ny, nz);
      if (neighborBlock === 'air' || neighborBlock === 'water' || 
          BLOCKS[neighborBlock]?.transparent) {
        return true;
      }
    }
    
    return false;
  }
  
  private getMaterialForBlock(blockId: BlockId): THREE.Material | null {
    return this.materials[blockId] || this.materials['stone'] || null;
  }
  
  private mergeGeometries(geometries: THREE.BoxGeometry[]): THREE.BufferGeometry {
    // Simple merge - just return the first geometry for now
    // A full implementation would use BufferGeometryUtils.mergeGeometries
    if (geometries.length === 0) {
      return new THREE.BufferGeometry();
    }
    if (geometries.length === 1) {
      return geometries[0];
    }
    
    // For multiple geometries, we'll create a simple merged version
    // This is a simplified approach that works without BufferGeometryUtils
    const merged = new THREE.BufferGeometry();
    const positions: number[] = [];
    
    for (const geom of geometries) {
      const posAttr = geom.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        positions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      }
    }
    
    merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    merged.computeVertexNormals();
    
    return merged;
  }
  
  getBlock(x: number, y: number, z: number): BlockId {
    return this.blockData.get(`${x},${y},${z}`) || 'air';
  }
  
  setBlock(x: number, y: number, z: number, blockId: BlockId): void {
    this.blockData.set(`${x},${y},${z}`, blockId);
    // In a full implementation, we would update the chunk mesh here
  }
  
  getModifiedBlocks(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of this.blockData.entries()) {
      result[key] = value;
    }
    return result;
  }
  
  update(deltaTime: number): void {
    // Update sun position based on time of day
    // This is handled in Game.ts via gameWorld.world.timeOfDay
  }
}
