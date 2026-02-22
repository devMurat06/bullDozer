/* ========================================
   Player Module - Karakter yönetimi
   Hareket, animasyon, çarpışma, etkileşim
   ======================================== */

const Player = {
    x: 0, y: 0,
    width: 40, height: 48,
    speed: 3.5,
    direction: 'down',
    moving: false,

    animFrame: 0, animTimer: 0, animSpeed: 150,

    keys: { up: false, down: false, left: false, right: false },

    totalSteps: 0,
    lastTileX: 0, lastTileY: 0,
    tilesExplored: new Set(),

    init() {
        this.x = Math.floor(World.MAP_WIDTH / 2);
        this.y = Math.floor(World.MAP_HEIGHT / 2);
        this.lastTileX = Math.floor(this.x);
        this.lastTileY = Math.floor(this.y);
        this.tilesExplored.add(`${this.lastTileX},${this.lastTileY}`);

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    },

    onKeyDown(e) {
        // Diyalog aktifse hareket etme
        if (Story.active) return;

        switch (e.key.toLowerCase()) {
            case 'w': case 'arrowup': this.keys.up = true; break;
            case 's': case 'arrowdown': this.keys.down = true; break;
            case 'a': case 'arrowleft': this.keys.left = true; break;
            case 'd': case 'arrowright': this.keys.right = true; break;
            case 'e': this.interact(); break;
            case 'f': this.harvest(); break;  // Kaynak toplama
        }
    },

    onKeyUp(e) {
        switch (e.key.toLowerCase()) {
            case 'w': case 'arrowup': this.keys.up = false; break;
            case 's': case 'arrowdown': this.keys.down = false; break;
            case 'a': case 'arrowleft': this.keys.left = false; break;
            case 'd': case 'arrowright': this.keys.right = false; break;
        }
    },

    interact() {
        if (Story.active || World.transitioning) return;

        // Sala yakınında mı?
        if (World.isNearRaft(this.getTileX(), this.getTileY())) {
            // Sonraki adaya git (döngüsel: 0→1→2→0)
            const nextIsland = (World.currentIslandIndex + 1) % World.islands.length;
            World.startTransition(nextIsland);
            // Yeni ada görevlerini yükle
            setTimeout(() => {
                Tasks.loadIslandTasks(nextIsland);
            }, 900);
        }
    },

    // Kaynak toplama (F tuşu)
    harvest() {
        if (Story.active || World.transitioning) return;
        const px = this.getTileX();
        const py = this.getTileY();

        // Etraftaki 3x3 alanda nesne ara
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const result = World.harvestAt(px + dx, py + dy);
                if (result) {
                    if (result.error) {
                        UI.showNotification('⚡', result.error);
                    } else {
                        UI.showNotification('🎒', result.message);
                    }
                    return;
                }
            }
        }
    },

    update(dt) {
        if (Story.active || World.transitioning) {
            this.moving = false;
            // Tuşları sıfırla (sıkışma önleme)
            this.keys = { up: false, down: false, left: false, right: false };
            return;
        }

        const dtSec = dt / 1000;
        let dx = 0, dy = 0;

        if (this.keys.up) { dy = -1; this.direction = 'up'; }
        if (this.keys.down) { dy = 1; this.direction = 'down'; }
        if (this.keys.left) { dx = -1; this.direction = 'left'; }
        if (this.keys.right) { dx = 1; this.direction = 'right'; }

        if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
        this.moving = (dx !== 0 || dy !== 0);

        if (this.moving) {
            // Buzul adasında %50 daha hızlı!
            let currentSpeed = this.speed;
            if (World.getCurrentBiome() === World.BIOMES.WINTER) {
                currentSpeed = this.speed * 1.5;
            }

            const newX = this.x + dx * currentSpeed * dtSec;
            const newY = this.y + dy * currentSpeed * dtSec;
            const margin = 0.15;

            if (dx !== 0) {
                const checkX = dx > 0 ? Math.floor(newX + 1 - margin) : Math.floor(newX + margin);
                const checkY1 = Math.floor(this.y + margin);
                const checkY2 = Math.floor(this.y + 1 - margin);
                if (World.isWalkable(checkX, checkY1) && World.isWalkable(checkX, checkY2)) {
                    this.x = newX;
                }
            }
            if (dy !== 0) {
                const checkY = dy > 0 ? Math.floor(newY + 1 - margin) : Math.floor(newY + margin);
                const checkX1 = Math.floor(this.x + margin);
                const checkX2 = Math.floor(this.x + 1 - margin);
                if (World.isWalkable(checkX1, checkY) && World.isWalkable(checkX2, checkY)) {
                    this.y = newY;
                }
            }

            this.animTimer += dt;
            if (this.animTimer >= this.animSpeed) {
                this.animFrame = (this.animFrame + 1) % 4;
                this.animTimer = 0;
            }

            const curTileX = Math.floor(this.x);
            const curTileY = Math.floor(this.y);
            if (curTileX !== this.lastTileX || curTileY !== this.lastTileY) {
                this.totalSteps++;
                this.tilesExplored.add(`${curTileX},${curTileY}`);
                this.lastTileX = curTileX;
                this.lastTileY = curTileY;
            }
        } else {
            this.animFrame = 0;
            this.animTimer = 0;
        }
    },

    render(ctx, camera) {
        const T = World.TILE_SIZE;
        const screenX = this.x * T - camera.x;
        const screenY = this.y * T - camera.y;

        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(screenX + T / 2, screenY + T - 2, T * 0.35, T * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();

        this.drawCharacter(ctx, screenX, screenY, T);

        // Sala yakınındaysa ipucu göster
        if (World.isNearRaft(this.getTileX(), this.getTileY()) && !World.transitioning) {
            ctx.fillStyle = 'rgba(255,215,0,0.9)';
            ctx.font = '9px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('⛵ E ile yolculuk et', screenX + T / 2, screenY - 12);
            ctx.textAlign = 'left';
        }

        // Yakında toplanabilir nesne varsa ipucu
        const nearObj = this.findNearbyHarvestable();
        if (nearObj && !World.transitioning) {
            const objSX = nearObj.x * T - camera.x;
            const objSY = nearObj.y * T - camera.y;
            ctx.fillStyle = 'rgba(100,255,150,0.8)';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('F: Topla', objSX + T / 2, objSY - 4);
            ctx.textAlign = 'left';
        }
    },

    findNearbyHarvestable() {
        const px = this.getTileX();
        const py = this.getTileY();
        const harvestable = ['palm_tree', 'palm_small', 'bush', 'pine_tree', 'lava_rock', 'ice_crystal', 'coral'];
        for (const obj of World.placedObjects) {
            if (Math.abs(obj.x - px) <= 1 && Math.abs(obj.y - py) <= 1 && harvestable.includes(obj.type)) {
                return obj;
            }
        }
        return null;
    },

    drawCharacter(ctx, sx, sy, size) {
        const bounce = this.moving ? Math.sin(this.animFrame * Math.PI / 2) * 2 : 0;
        const offsetY = -bounce;
        const w = size * 0.7;
        const h = size * 0.9;
        const cx = sx + (size - w) / 2;
        const cy = sy + (size - h) / 2 + offsetY;

        const legOffset = this.moving ? Math.sin(this.animFrame * Math.PI / 2) * 4 : 0;
        ctx.fillStyle = '#6b4226';
        ctx.fillRect(cx + w * 0.15, cy + h * 0.78 + legOffset, w * 0.25, h * 0.22);
        ctx.fillRect(cx + w * 0.6, cy + h * 0.78 - legOffset, w * 0.25, h * 0.22);

        ctx.fillStyle = '#2255aa';
        ctx.fillRect(cx + w * 0.1, cy + h * 0.4, w * 0.8, h * 0.42);
        ctx.fillRect(cx + w * 0.15, cy + h * 0.25, w * 0.15, h * 0.2);
        ctx.fillRect(cx + w * 0.7, cy + h * 0.25, w * 0.15, h * 0.2);

        ctx.fillStyle = '#cc3333';
        ctx.fillRect(cx + w * 0.1, cy + h * 0.22, w * 0.8, h * 0.25);
        ctx.fillStyle = '#aa2222';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(cx + w * 0.2 + i * w * 0.22, cy + h * 0.26, w * 0.1, h * 0.08);
        }

        const armSwing = this.moving ? Math.sin(this.animFrame * Math.PI / 2) * 3 : 0;
        if (this.direction !== 'up') {
            ctx.fillStyle = '#cc3333';
            ctx.fillRect(cx - w * 0.05, cy + h * 0.25 + armSwing, w * 0.18, h * 0.2);
            ctx.fillStyle = '#f5c5a0';
            ctx.fillRect(cx - w * 0.05, cy + h * 0.42 + armSwing, w * 0.15, h * 0.08);
            ctx.fillStyle = '#cc3333';
            ctx.fillRect(cx + w * 0.87, cy + h * 0.25 - armSwing, w * 0.18, h * 0.2);
            ctx.fillStyle = '#f5c5a0';
            ctx.fillRect(cx + w * 0.87, cy + h * 0.42 - armSwing, w * 0.15, h * 0.08);
        }

        ctx.fillStyle = '#f5c5a0';
        const headW = w * 0.6, headH = h * 0.25;
        const headX = cx + (w - headW) / 2, headY = cy + h * 0.02;
        ctx.fillRect(headX, headY, headW, headH);

        if (this.direction !== 'up') {
            ctx.fillStyle = '#222';
            const eyeX1 = this.direction === 'left' ? 0.15 : this.direction === 'right' ? 0.4 : 0.25;
            const eyeX2 = this.direction === 'left' ? 0.45 : this.direction === 'right' ? 0.7 : 0.6;
            ctx.fillRect(headX + headW * eyeX1, headY + headH * 0.45, 3, 3);
            ctx.fillRect(headX + headW * eyeX2, headY + headH * 0.45, 3, 3);
        }

        ctx.fillStyle = '#ffd700';
        ctx.fillRect(headX - 2, headY - headH * 0.35, headW + 4, headH * 0.5);
        ctx.fillStyle = '#e8c200';
        ctx.fillRect(headX - 4, headY - headH * 0.05, headW + 8, headH * 0.15);
        ctx.fillStyle = '#cc9900';
        ctx.fillRect(headX + headW * 0.45, headY - headH * 0.35, 2, headH * 0.45);
    },

    getTileX() { return Math.floor(this.x); },
    getTileY() { return Math.floor(this.y); }
};
