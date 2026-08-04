/**
 * bullDozer - Main Entry Point
 */

import { Game } from './core/Game';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.init();
});
