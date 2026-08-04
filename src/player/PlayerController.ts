/**
 * Player Controller - First-person movement and camera control
 */

import * as THREE from 'three';
import { gameWorld } from '../core/GameWorld';

export class PlayerController {
  private camera: THREE.PerspectiveCamera;
  private canvas: HTMLCanvasElement;
  
  public velocity = new THREE.Vector3();
  public direction = new THREE.Vector3();
  
  private moveForward: boolean = false;
  private moveBackward: boolean = false;
  private moveLeft: boolean = false;
  private moveRight: boolean = false;
  private canJump: boolean = false;
  private isSprinting: boolean = false;
  
  private readonly WALK_SPEED = 5.0;
  private readonly SPRINT_SPEED = 8.0;
  private readonly JUMP_FORCE = 10.0;
  private readonly GRAVITY = 25.0;
  private readonly PLAYER_HEIGHT = 1.7;
  private readonly PLAYER_RADIUS = 0.3;
  
  constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.canvas = canvas;
    
    this.setupControls();
    this.setPosition(0, 60, 0);
  }
  
  private setupControls(): void {
    // Keyboard controls
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));
    
    // Mouse controls
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mouseup', (e) => this.onMouseUp(e));
    
    // Pointer lock
    this.canvas.addEventListener('click', () => {
      if (!gameWorld.isPaused && !gameWorld.isInventoryOpen) {
        this.canvas.requestPointerLock();
      }
    });
    
    document.addEventListener('pointerlockchange', () => {
      // Handle pointer lock state change
    });
  }
  
  private onKeyDown(event: KeyboardEvent): void {
    if (gameWorld.isInventoryOpen) return;
    
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      case 'Space':
        if (this.canJump) {
          this.velocity.y = this.JUMP_FORCE;
          this.canJump = false;
        }
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = true;
        break;
      case 'KeyE':
        gameWorld.isInventoryOpen = !gameWorld.isInventoryOpen;
        if (gameWorld.isInventoryOpen) {
          document.exitPointerLock();
        } else {
          this.canvas.requestPointerLock();
        }
        break;
      case 'Escape':
        if (gameWorld.isInventoryOpen) {
          gameWorld.isInventoryOpen = false;
          this.canvas.requestPointerLock();
        }
        break;
      case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4': case 'Digit5':
      case 'Digit6': case 'Digit7': case 'Digit8': case 'Digit9':
        const slot = parseInt(event.code.replace('Digit', '')) - 1;
        gameWorld.selectHotbarSlot(slot);
        break;
    }
  }
  
  private onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = false;
        break;
    }
  }
  
  private onMouseMove(event: MouseEvent): void {
    if (document.pointerLockElement !== this.canvas) return;
    if (gameWorld.isPaused || gameWorld.isInventoryOpen) return;
    
    const sensitivity = 0.002;
    
    // Yaw (left/right)
    this.camera.rotation.y -= event.movementX * sensitivity;
    
    // Pitch (up/down)
    this.camera.rotation.x -= event.movementY * sensitivity;
    this.camera.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.camera.rotation.x)
    );
    
    // Update game world rotation
    gameWorld.player.rotation.yaw = this.camera.rotation.y;
    gameWorld.player.rotation.pitch = this.camera.rotation.x;
  }
  
  private onMouseDown(event: MouseEvent): void {
    if (document.pointerLockElement !== this.canvas) return;
    if (gameWorld.isPaused || gameWorld.isInventoryOpen) return;
    
    // Left click - mine/attack
    if (event.button === 0) {
      // Mining handled by VoxelWorld
    }
    // Right click - place block
    else if (event.button === 2) {
      // Block placement handled by VoxelWorld
    }
  }
  
  private onMouseUp(event: MouseEvent): void {
    // Handle mouse up if needed
  }
  
  setPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
    gameWorld.player.position = { x, y, z };
  }
  
  update(deltaTime: number): void {
    const dt = deltaTime / 1000;
    
    // Apply gravity
    this.velocity.y -= this.GRAVITY * dt;
    
    // Calculate movement direction
    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();
    
    // Get movement speed
    const speed = this.isSprinting ? this.SPRINT_SPEED : this.WALK_SPEED;
    
    // Move player
    if (this.moveForward || this.moveBackward) {
      this.velocity.z = -this.direction.z * speed;
    } else {
      this.velocity.z = 0;
    }
    
    if (this.moveLeft || this.moveRight) {
      this.velocity.x = this.direction.x * speed;
    } else {
      this.velocity.x = 0;
    }
    
    // Apply movement relative to camera direction
    const yaw = this.camera.rotation.y;
    const sinYaw = Math.sin(yaw);
    const cosYaw = Math.cos(yaw);
    
    const deltaX = (this.velocity.x * cosYaw - this.velocity.z * sinYaw) * dt;
    const deltaZ = (this.velocity.x * sinYaw + this.velocity.z * cosYaw) * dt;
    
    // Simple collision check - just floor for now
    const newY = this.camera.position.y + this.velocity.y * dt;
    const groundLevel = this.getGroundLevel(
      this.camera.position.x + deltaX,
      this.camera.position.z + deltaZ
    );
    
    if (newY < groundLevel + this.PLAYER_HEIGHT) {
      this.camera.position.y = groundLevel + this.PLAYER_HEIGHT;
      this.velocity.y = 0;
      this.canJump = true;
    } else {
      this.camera.position.y = newY;
    }
    
    this.camera.position.x += deltaX;
    this.camera.position.z += deltaZ;
    
    // Update game world position
    gameWorld.player.position = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
    };
    gameWorld.player.velocity = {
      x: this.velocity.x,
      y: this.velocity.y,
      z: this.velocity.z,
    };
    gameWorld.player.onGround = this.canJump;
    gameWorld.player.isSprinting = this.isSprinting;
  }
  
  private getGroundLevel(x: number, z: number): number {
    // Simple ground level estimation based on noise
    // In a full implementation, this would query the voxel world
    const scale = 0.02;
    const baseHeight = 35;
    const variation = 15;
    
    // Simplified noise function
    const noise = Math.sin(x * scale) * Math.cos(z * scale) * 0.5 +
                  Math.sin(x * scale * 2 + z * scale * 2) * 0.25;
    
    return baseHeight + noise * variation;
  }
}
