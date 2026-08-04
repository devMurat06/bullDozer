/**
 * Settings - Game settings management with persistence
 */

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  mouseSensitivity: number;
  renderDistance: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 70,
  musicVolume: 50,
  sfxVolume: 70,
  mouseSensitivity: 5,
  renderDistance: 4,
};

const SETTINGS_KEY = 'bulldozer_settings';

let currentSettings: GameSettings = { ...DEFAULT_SETTINGS };

export function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      currentSettings = { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
    currentSettings = { ...DEFAULT_SETTINGS };
  }
  return currentSettings;
}

export function saveSettings(settings: GameSettings): void {
  try {
    currentSettings = settings;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function getSettings(): GameSettings {
  return { ...currentSettings };
}

export function updateSetting<K extends keyof GameSettings>(key: K, value: GameSettings[K]): void {
  currentSettings[key] = value;
  saveSettings(currentSettings);
}

export function resetSettings(): void {
  currentSettings = { ...DEFAULT_SETTINGS };
  saveSettings(currentSettings);
}
