/**
 * Audio Engine - Procedural sound effects using Web Audio API
 */

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  constructor() {
    this.init();
  }
  
  private init(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Master gain
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.7;
      
      // Music gain
      this.musicGain = this.audioContext.createGain();
      this.musicGain.connect(this.masterGain);
      this.musicGain.gain.value = 0.5;
      
      // SFX gain
      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.connect(this.masterGain);
      this.sfxGain.gain.value = 0.7;
    } catch (e) {
      console.warn('Web Audio API not available:', e);
    }
  }
  
  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = volume / 100;
    }
  }
  
  setMusicVolume(volume: number): void {
    if (this.musicGain) {
      this.musicGain.gain.value = volume / 100;
    }
  }
  
  setSfxVolume(volume: number): void {
    if (this.sfxGain) {
      this.sfxGain.gain.value = volume / 100;
    }
  }
  
  playMine(blockType: string = 'stone'): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(this.sfxGain);
    
    // Different sounds for different block types
    switch (blockType) {
      case 'wood':
        oscillator.frequency.value = 200;
        oscillator.type = 'square';
        break;
      case 'stone':
        oscillator.frequency.value = 100;
        oscillator.type = 'sawtooth';
        break;
      case 'dirt':
        oscillator.frequency.value = 150;
        oscillator.type = 'triangle';
        break;
      default:
        oscillator.frequency.value = 120;
        oscillator.type = 'sine';
    }
    
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
  
  playPlace(): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(this.sfxGain);
    
    oscillator.frequency.value = 300;
    oscillator.type = 'sine';
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }
  
  playHit(): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(this.sfxGain);
    
    oscillator.frequency.value = 400;
    oscillator.type = 'sawtooth';
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
  
  playPickup(): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(this.sfxGain);
    
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
    oscillator.type = 'sine';
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }
  
  playUIClick(): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(this.sfxGain);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.03);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.03);
  }
  
  playJump(): void {
    if (!this.audioContext || !this.sfxGain) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(this.sfxGain);
    
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(300, this.audioContext.currentTime + 0.1);
    oscillator.type = 'sine';
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }
  
  resume(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}
