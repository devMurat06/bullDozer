/**
 * UI Manager - Handles all game UI elements
 */

import type { Game } from '../core/Game';
import { gameWorld } from '../core/GameWorld';
import { getAllRecipes, canCraft } from '../crafting/Recipes';
import { ITEMS } from '../items/ItemTypes';
import { getSettings, updateSetting } from '../settings/Settings';

export class UIManager {
  private game: Game;
  
  constructor(game: Game) {
    this.game = game;
    this.setupEventListeners();
    this.updateHotbar();
    this.updateHealth();
    this.updateObjectives();
    this.updateIslandIndicator();
    this.loadSettingsToUI();
  }
  
  private setupEventListeners(): void {
    document.getElementById('btn-new-game')?.addEventListener('click', () => {
      this.game.startNewGame();
    });
    
    document.getElementById('btn-continue')?.addEventListener('click', async () => {
      await this.game.continueGame();
    });
    
    document.getElementById('btn-settings')?.addEventListener('click', () => {
      this.showSettings();
    });
    
    document.getElementById('btn-how-to-play')?.addEventListener('click', () => {
      this.showHowToPlay();
    });
    
    document.getElementById('btn-resume')?.addEventListener('click', () => {
      this.game.togglePause();
    });
    
    document.getElementById('btn-save')?.addEventListener('click', async () => {
      await this.game.saveGame();
    });
    
    document.getElementById('btn-settings-pause')?.addEventListener('click', () => {
      this.showSettings();
    });
    
    document.getElementById('btn-main-menu')?.addEventListener('click', () => {
      this.returnToMainMenu();
    });
    
    document.getElementById('btn-close-inventory')?.addEventListener('click', () => {
      gameWorld.isInventoryOpen = false;
      document.getElementById('inventory-screen')?.classList.remove('visible');
      const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
      if (canvas) canvas.requestPointerLock();
    });
    
    document.getElementById('btn-close-settings')?.addEventListener('click', () => {
      this.hideSettings();
    });
    
    document.getElementById('slider-master-volume')?.addEventListener('input', (e) => {
      updateSetting('masterVolume', parseInt((e.target as HTMLInputElement).value));
    });
    
    document.getElementById('slider-music-volume')?.addEventListener('input', (e) => {
      updateSetting('musicVolume', parseInt((e.target as HTMLInputElement).value));
    });
    
    document.getElementById('slider-sfx-volume')?.addEventListener('input', (e) => {
      updateSetting('sfxVolume', parseInt((e.target as HTMLInputElement).value));
    });
    
    document.getElementById('slider-mouse-sensitivity')?.addEventListener('input', (e) => {
      updateSetting('mouseSensitivity', parseInt((e.target as HTMLInputElement).value));
    });
    
    document.getElementById('slider-render-distance')?.addEventListener('input', (e) => {
      updateSetting('renderDistance', parseInt((e.target as HTMLInputElement).value));
    });
  }
  
  setContinueAvailable(available: boolean): void {
    const btn = document.getElementById('btn-continue') as HTMLButtonElement;
    if (btn) btn.disabled = !available;
  }
  
  updateHealth(): void {
    const healthBar = document.getElementById('health-bar');
    const healthText = document.getElementById('health-text');
    if (healthBar && healthText) {
      const pct = (gameWorld.player.health / gameWorld.player.maxHealth) * 100;
      healthBar.style.width = `${pct}%`;
      healthText.textContent = `❤️ ${Math.floor(gameWorld.player.health)}/${gameWorld.player.maxHealth}`;
    }
  }
  
  updateHotbar(): void {
    const hotbarEl = document.getElementById('hotbar');
    if (!hotbarEl) return;
    hotbarEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const slotEl = document.createElement('div');
      slotEl.className = 'hotbar-slot';
      if (i === gameWorld.selectedHotbarSlot) slotEl.classList.add('selected');
      
      const keyEl = document.createElement('span');
      keyEl.className = 'hotbar-key';
      keyEl.textContent = `${i + 1}`;
      slotEl.appendChild(keyEl);
      
      const slotIndex = gameWorld.hotbar[i];
      if (slotIndex !== -1 && slotIndex < gameWorld.inventory.length) {
        const item = gameWorld.inventory[slotIndex];
        if (item) {
          const itemData = ITEMS[item.itemId as keyof typeof ITEMS];
          if (itemData) {
            const iconEl = document.createElement('span');
            iconEl.textContent = itemData.icon || '📦';
            slotEl.appendChild(iconEl);
            if (item.count > 1) {
              const countEl = document.createElement('span');
              countEl.className = 'hotbar-count';
              countEl.textContent = `${item.count}`;
              slotEl.appendChild(countEl);
            }
          }
        }
      }
      slotEl.addEventListener('click', () => {
        gameWorld.selectHotbarSlot(i);
        this.updateHotbar();
      });
      hotbarEl.appendChild(slotEl);
    }
  }
  
  updateInventory(): void {
    const gridEl = document.getElementById('inventory-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';
    for (let i = 0; i < Math.max(gameWorld.inventory.length, 32); i++) {
      const slotEl = document.createElement('div');
      slotEl.className = 'inv-slot';
      const item = gameWorld.inventory[i];
      if (item) {
        const itemData = ITEMS[item.itemId as keyof typeof ITEMS];
        if (itemData) {
          const iconEl = document.createElement('span');
          iconEl.className = 'inv-icon';
          iconEl.textContent = itemData.icon || '📦';
          slotEl.appendChild(iconEl);
          if (item.count > 1) {
            const countEl = document.createElement('span');
            countEl.className = 'inv-count';
            countEl.textContent = `${item.count}`;
            slotEl.appendChild(countEl);
          }
        }
      }
      slotEl.addEventListener('click', () => {
        const slotIndex = gameWorld.hotbar[gameWorld.selectedHotbarSlot];
        if (slotIndex === i) {
          gameWorld.hotbar[gameWorld.selectedHotbarSlot] = -1;
        } else {
          gameWorld.hotbar[gameWorld.selectedHotbarSlot] = i;
        }
        this.updateHotbar();
        this.updateInventory();
      });
      gridEl.appendChild(slotEl);
    }
    this.updateCraftingList();
  }
  
  private updateCraftingList(): void {
    const listEl = document.getElementById('crafting-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    const recipes = getAllRecipes();
    const inventoryCounts: Record<string, number> = {};
    for (const item of gameWorld.inventory) {
      inventoryCounts[item.itemId] = (inventoryCounts[item.itemId] || 0) + item.count;
    }
    for (const recipe of recipes) {
      const itemEl = document.createElement('div');
      itemEl.className = 'crafting-item';
      const outputItem = ITEMS[recipe.output.itemId as keyof typeof ITEMS];
      const canMake = canCraft(recipe, inventoryCounts);
      if (canMake) itemEl.classList.add('can-craft');
      const nameEl = document.createElement('div');
      nameEl.className = 'crafting-name';
      nameEl.textContent = `${outputItem?.icon || '📦'} ${outputItem?.name || 'Unknown'}`;
      itemEl.appendChild(nameEl);
      const materialsEl = document.createElement('div');
      materialsEl.className = 'crafting-materials';
      const materials = Object.entries(recipe.ingredients)
        .map(([id, count]) => {
          const item = ITEMS[id as keyof typeof ITEMS];
          return `${item?.icon || '📦'}${count}`;
        })
        .join(' ');
      materialsEl.textContent = materials;
      itemEl.appendChild(materialsEl);
      itemEl.addEventListener('click', () => {
        if (canMake) {
          this.showNotification(`Crafted ${outputItem?.name}!`, 'success');
        } else {
          this.showNotification('Not enough materials!', 'error');
        }
      });
      listEl.appendChild(itemEl);
    }
  }
  
  updateObjectives(): void {
    const listEl = document.getElementById('objectives-list');
    if (!listEl) return;
    const objectives = [
      { id: 'gather_wood', text: 'Gather your first wood' },
      { id: 'craft_tool', text: 'Craft a tool' },
      { id: 'build_shelter', text: 'Build a shelter' },
      { id: 'find_cave', text: 'Discover a cave' },
      { id: 'mine_ore', text: 'Mine your first ore' },
      { id: 'reach_ashen', text: 'Reach Ashen Isle' },
      { id: 'reach_celestial', text: 'Reach Celestial Isle' },
    ];
    listEl.innerHTML = '';
    for (const obj of objectives) {
      const el = document.createElement('div');
      el.className = 'objective-item';
      if (gameWorld.isObjectiveCompleted(obj.id)) el.classList.add('completed');
      el.textContent = (gameWorld.isObjectiveCompleted(obj.id) ? '✓ ' : '') + obj.text;
      listEl.appendChild(el);
    }
  }
  
  updateIslandIndicator(): void {
    const islandName = document.getElementById('island-name');
    if (islandName) {
      const islandNames: Record<string, string> = {
        verdant: '🏝️ Verdant Isle',
        ashen: '🌋 Ashen Isle',
        celestial: '✨ Celestial Isle',
      };
      islandName.textContent = islandNames[gameWorld.world.currentIsland] || 'Unknown';
    }
  }
  
  updateTimeDisplay(): void {
    const timeDisplay = document.getElementById('time-display');
    if (!timeDisplay) return;
    const time = gameWorld.world.timeOfDay;
    let phase = 'Morning';
    let icon = '☀️';
    if (time < 0.2) { phase = 'Night'; icon = '🌙'; }
    else if (time < 0.3) { phase = 'Dawn'; icon = '🌅'; }
    else if (time < 0.7) { phase = 'Day'; icon = '☀️'; }
    else if (time < 0.8) { phase = 'Dusk'; icon = '🌇'; }
    else { phase = 'Night'; icon = '🌙'; }
    timeDisplay.textContent = `${icon} Day ${gameWorld.world.day} - ${phase}`;
  }
  
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const container = document.getElementById('notifications');
    if (!container) return;
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
  
  private showSettings(): void {
    const panel = document.getElementById('settings-panel');
    if (panel) panel.classList.add('visible');
  }
  
  private hideSettings(): void {
    const panel = document.getElementById('settings-panel');
    if (panel) panel.classList.remove('visible');
  }
  
  private loadSettingsToUI(): void {
    const settings = getSettings();
    const masterSlider = document.getElementById('slider-master-volume') as HTMLInputElement;
    const musicSlider = document.getElementById('slider-music-volume') as HTMLInputElement;
    const sfxSlider = document.getElementById('slider-sfx-volume') as HTMLInputElement;
    const mouseSlider = document.getElementById('slider-mouse-sensitivity') as HTMLInputElement;
    const renderSlider = document.getElementById('slider-render-distance') as HTMLInputElement;
    if (masterSlider) masterSlider.value = String(settings.masterVolume);
    if (musicSlider) musicSlider.value = String(settings.musicVolume);
    if (sfxSlider) sfxSlider.value = String(settings.sfxVolume);
    if (mouseSlider) mouseSlider.value = String(settings.mouseSensitivity);
    if (renderSlider) renderSlider.value = String(settings.renderDistance);
  }
  
  private showHowToPlay(): void {
    this.showNotification('WASD: Move | Mouse: Look | Space: Jump | E: Inventory | ESC: Pause', 'info');
  }
  
  private returnToMainMenu(): void {
    gameWorld.isPaused = false;
    const pauseMenu = document.getElementById('pause-menu');
    const mainMenu = document.getElementById('main-menu');
    const hud = document.getElementById('hud');
    if (pauseMenu) pauseMenu.classList.remove('visible');
    if (hud) hud.classList.remove('visible');
    if (mainMenu) mainMenu.classList.add('visible');
    document.exitPointerLock();
  }
}
