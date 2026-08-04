/**
 * Main Game Class - Orchestrates all game systems
 */

import * as THREE from 'three';
import { gameWorld } from './GameWorld';
import { initDB, saveGame, loadGame, hasSaveGame, createDefaultState } from '../save/SaveSystem';
import { loadSettings, getSettings, updateSetting } from '../settings/Settings';
import { PlayerController } from '../player/PlayerController';
import { VoxelWorld } from '../world/VoxelWorld';
import { UIManager } from '../ui/UIManager';
import { AudioEngine } from '../audio/AudioEngine';
import { Objectives } from '../utils/Objectives';

export class Game {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  
  private playerController: PlayerController | null = null;
  private voxelWorld: VoxelWorld | null = null;
  private uiManager: UIManager | null = null;
  private audioEngine: AudioEngine | null = null;
  
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private loadingProgress: number = 0;
  
  constructor() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    this.setupRenderer();
    this.setupEventListeners();
  }
  
  private setupRenderer(): void {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x87ceeb);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  
  private setupEventListeners(): void {
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  async init(): Promise<void> {
    // Show loading screen
    this.updateLoadingProgress(10, 'Initializing database...');
    
    try {
      await initDB();
    } catch (e) {
      console.warn('Database initialization failed:', e);
    }
    
    this.updateLoadingProgress(30, 'Loading settings...');
    loadSettings();
    
    this.updateLoadingProgress(50, 'Creating world...');
    this.voxelWorld = new VoxelWorld(this.scene);
    
    this.updateLoadingProgress(60, 'Setting up player...');
    this.playerController = new PlayerController(this.camera, this.canvas);
    
    this.updateLoadingProgress(70, 'Initializing UI...');
    this.uiManager = new UIManager(this);
    
    this.updateLoadingProgress(80, 'Loading audio...');
    this.audioEngine = new AudioEngine();
    
    this.updateLoadingProgress(90, 'Finalizing...');
    
    // Check for saved game
    const hasSave = await hasSaveGame();
    if (this.uiManager) {
      this.uiManager.setContinueAvailable(hasSave);
    }
    
    this.updateLoadingProgress(100, 'Ready!');
    
    // Hide loading screen after short delay
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
      
      // Show main menu
      const mainMenu = document.getElementById('main-menu');
      if (mainMenu) {
        mainMenu.classList.add('visible');
      }
    }, 500);
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate();
  }
  
  private updateLoadingProgress(progress: number, text: string): void {
    this.loadingProgress = progress;
    const bar = document.getElementById('loading-bar');
    const textEl = document.getElementById('loading-text');
    if (bar) bar.style.width = `${progress}%`;
    if (textEl) textEl.textContent = text;
  }
  
  startNewGame(): void {
    // Reset game world
    gameWorld.inventory = [];
    gameWorld.hotbar = Array(9).fill(-1);
    gameWorld.selectedHotbarSlot = 0;
    gameWorld.completedObjectives = new Set();
    gameWorld.world.currentIsland = 'verdant';
    gameWorld.world.modifiedBlocks = new Map();
    gameWorld.world.timeOfDay = 0.25;
    gameWorld.world.day = 1;
    gameWorld.player.health = 100;
    gameWorld.player.position = { x: 0, y: 60, z: 0 };
    gameWorld.player.velocity = { x: 0, y: 0, z: 0 };
    gameWorld.player.rotation = { yaw: 0, pitch: 0 };
    
    // Generate initial chunks
    if (this.voxelWorld) {
      this.voxelWorld.generateInitialChunks('verdant', gameWorld.world.seed);
    }
    
    // Give starter items
    gameWorld.giveStarterItems();
    
    // Set initial objectives
    Objectives.checkAll();
    
    // Update UI
    if (this.uiManager) {
      this.uiManager.updateHealth();
      this.uiManager.updateHotbar();
      this.uiManager.updateObjectives();
      this.uiManager.updateIslandIndicator();
    }
    
    // Hide menu, show HUD
    this.hideMenu();
    this.showHUD();
    
    // Lock pointer
    this.canvas.requestPointerLock();
  }
  
  async continueGame(): Promise<void> {
    const savedState = await loadGame();
    if (savedState) {
      gameWorld.importFromSaveState(savedState);
      
      // Regenerate world with modified blocks
      if (this.voxelWorld) {
        this.voxelWorld.generateInitialChunks(
          gameWorld.world.currentIsland,
          gameWorld.world.seed
        );
        // Apply modified blocks
        for (const [key, blockId] of gameWorld.world.modifiedBlocks) {
          const [x, y, z] = key.split(',').map(Number);
          this.voxelWorld.setBlock(x, y, z, blockId as any);
        }
      }
      
      // Restore player position
      if (this.playerController) {
        this.playerController.setPosition(
          gameWorld.player.position.x,
          gameWorld.player.position.y,
          gameWorld.player.position.z
        );
      }
      
      // Update UI
      if (this.uiManager) {
        this.uiManager.updateHealth();
        this.uiManager.updateHotbar();
        this.uiManager.updateInventory();
        this.uiManager.updateObjectives();
        this.uiManager.updateIslandIndicator();
      }
      
      // Hide menu, show HUD
      this.hideMenu();
      this.showHUD();
      
      // Lock pointer
      this.canvas.requestPointerLock();
    }
  }
  
  async saveGame(): Promise<void> {
    if (!this.voxelWorld) return;
    
    const state = gameWorld.exportToSaveState();
    state.world.modifiedBlocks = {};
    
    // Collect modified blocks from voxel world
    const modifiedBlocks = this.voxelWorld.getModifiedBlocks();
    state.world.modifiedBlocks = modifiedBlocks;
    
    await saveGame(state);
    
    if (this.uiManager) {
      this.uiManager.showNotification('Game Saved!', 'success');
    }
  }
  
  private hideMenu(): void {
    const mainMenu = document.getElementById('main-menu');
    const pauseMenu = document.getElementById('pause-menu');
    if (mainMenu) mainMenu.classList.remove('visible');
    if (pauseMenu) pauseMenu.classList.remove('visible');
  }
  
  private showHUD(): void {
    const hud = document.getElementById('hud');
    if (hud) hud.classList.add('visible');
  }
  
  togglePause(): void {
    gameWorld.isPaused = !gameWorld.isPaused;
    
    const pauseMenu = document.getElementById('pause-menu');
    if (pauseMenu) {
      if (gameWorld.isPaused) {
        pauseMenu.classList.add('visible');
        document.exitPointerLock();
      } else {
        pauseMenu.classList.remove('visible');
        this.canvas.requestPointerLock();
      }
    }
  }
  
  private onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }
  
  private animate(): void {
    if (!this.isRunning) return;
    
    requestAnimationFrame(() => this.animate());
    
    const currentTime = performance.now();
    const deltaTime = Math.min(currentTime - this.lastTime, 100);
    this.lastTime = currentTime;
    
    if (!gameWorld.isPaused && !gameWorld.isInventoryOpen) {
      // Update player
      if (this.playerController) {
        this.playerController.update(deltaTime);
      }
      
      // Update world
      if (this.voxelWorld) {
        this.voxelWorld.update(deltaTime);
      }
      
      // Update day/night cycle
      gameWorld.world.timeOfDay += deltaTime / 60000; // ~2 minutes per day
      if (gameWorld.world.timeOfDay >= 1) {
        gameWorld.world.timeOfDay -= 1;
        gameWorld.world.day++;
      }
      
      if (this.uiManager) {
        this.uiManager.updateTimeDisplay();
      }
    }
    
    // Render
    this.render();
  }
  
  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }
  
  getScene(): THREE.Scene {
    return this.scene;
  }
  
  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
  
  getVoxelWorld(): VoxelWorld | null {
    return this.voxelWorld;
  }
  
  getPlayerController(): PlayerController | null {
    return this.playerController;
  }
  
  getUIManager(): UIManager | null {
    return this.uiManager;
  }
}
