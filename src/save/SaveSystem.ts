/**
 * Save System - Persistent game state using IndexedDB
 */

export interface GameState {
  player: {
    position: { x: number; y: number; z: number };
    health: number;
    maxHealth: number;
    inventory: InventorySlot[];
    hotbar: number[];
    selectedSlot: number;
  };
  world: {
    currentIsland: number;
    modifiedBlocks: Record<string, string>;
    timeOfDay: number;
    day: number;
  };
  objectives: {
    completed: string[];
  };
  settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    mouseSensitivity: number;
    renderDistance: number;
  };
  metadata: {
    saveTime: number;
    playTime: number;
  };
}

export interface InventorySlot {
  itemId: string;
  count: number;
  durability?: number;
}

const DB_NAME = 'bullDozer';
const DB_VERSION = 1;
const STORE_NAME = 'gameState';

let db: IDBDatabase | null = null;

export async function initDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveGame(state: GameState): Promise<void> {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(state, 'save');
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function loadGame(): Promise<GameState | null> {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('save');
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function hasSaveGame(): Promise<boolean> {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve(false);
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('save');
    
    request.onsuccess = () => {
      resolve(!!request.result);
    };
    request.onerror = () => resolve(false);
  });
}

export async function deleteSaveGame(): Promise<void> {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete('save');
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function createDefaultState(): GameState {
  return {
    player: {
      position: { x: 0, y: 50, z: 0 },
      health: 100,
      maxHealth: 100,
      inventory: [],
      hotbar: Array(9).fill(-1),
      selectedSlot: 0,
    },
    world: {
      currentIsland: 0,
      modifiedBlocks: {},
      timeOfDay: 0.25,
      day: 1,
    },
    objectives: {
      completed: [],
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
