/* ========================================
   UI Module — HUD, bildirimler, toolbar
   Terraforming, ada göstergesi
   ======================================== */

const UI = {
    taskListEl: null, scoreEl: null, buildingsEl: null,
    notificationEl: null, notificationIcon: null, notificationText: null,
    toolbarEl: null, toolbarItemsEl: null, stonesEl: null, islandNameEl: null,
    dayPhaseEl: null, weatherEl: null,
    invWoodEl: null, invStoneEl: null, invFishEl: null,
    notificationTimer: null,
    buildMode: false, selectedObject: null,
    terraformMode: null,

    init() {
        this.taskListEl = document.getElementById('task-list');
        this.scoreEl = document.getElementById('score-value');
        this.buildingsEl = document.getElementById('buildings-count');
        this.stonesEl = document.getElementById('stones-count');
        this.islandNameEl = document.getElementById('island-name');
        this.notificationEl = document.getElementById('notification');
        this.notificationIcon = document.getElementById('notification-icon');
        this.notificationText = document.getElementById('notification-text');
        this.toolbarEl = document.getElementById('build-toolbar');
        this.toolbarItemsEl = document.getElementById('toolbar-items');
        this.dayPhaseEl = document.getElementById('day-phase-icon');
        this.weatherEl = document.getElementById('weather-icon');
        this.invWoodEl = document.getElementById('inv-wood');
        this.invStoneEl = document.getElementById('inv-stone');
        this.invFishEl = document.getElementById('inv-fish');

        window.addEventListener('keydown', (e) => {
            if (Story.active) return;
            if (e.key.toLowerCase() === 'b') this.toggleBuildMode();
            if (e.key === 'Escape' && this.buildMode) this.toggleBuildMode();
            // Terraforming kısayolları
            if (e.key === '1' && this.buildMode) this.setTerraformMode('dig');
            if (e.key === '2' && this.buildMode) this.setTerraformMode('fill');
            if (e.key === '3' && this.buildMode) { this.terraformMode = null; }
        });

        const canvas = document.getElementById('game-canvas');
        canvas.addEventListener('click', (e) => this.onCanvasClick(e));
    },

    update() {
        this.updateTaskList();
        this.updateScore();
        this.updateIslandName();
    },

    updateTaskList() {
        if (!this.taskListEl) return;
        let html = '';
        Tasks.taskList.forEach((task, i) => {
            let cls = 'locked', checkContent = '';
            if (task.completed) { cls = 'completed'; checkContent = '✓'; }
            else if (i === Tasks.currentTaskIndex) {
                cls = 'active';
                checkContent = `${Math.min(100, Math.floor((task.progress / task.target) * 100))}%`;
            }
            html += `<div class="task-item ${cls}">
                <div class="task-check">${checkContent}</div>
                <div><span>${task.icon} ${task.title}</span>
                ${cls === 'active' ? `<br><small style="font-size:6px;opacity:0.7">${task.description}</small>` : ''}</div>
            </div>`;
        });
        if (Tasks.allCompleted() && !Tasks.allIslandsCompleted()) {
            html += `<div class="task-item active" style="border-left-color:#ffd700;background:rgba(255,215,0,0.1)">
                <div class="task-check">⛵</div>
                <div><span>Salaya bin, yeni adaya git!</span></div>
            </div>`;
        } else if (Tasks.allIslandsCompleted()) {
            html += `<div class="task-item active" style="border-left-color:#ffd700;background:rgba(255,215,0,0.1)">
                <div class="task-check">🏆</div>
                <div><span>🎉 Tüm adalar tamamlandı!</span></div>
            </div>`;
        }
        this.taskListEl.innerHTML = html;
    },

    updateScore() {
        if (this.scoreEl) this.scoreEl.textContent = Tasks.score;
        if (this.buildingsEl) this.buildingsEl.textContent = Tasks.buildingsPlaced;
        if (this.stonesEl) this.stonesEl.textContent = World.stones;
    },

    updateIslandName() {
        if (this.islandNameEl) {
            this.islandNameEl.textContent = World.getCurrentIsland().name;
        }
        // Gündüz/gece ikonu
        if (this.dayPhaseEl) {
            const phase = Game.dayPhase;
            const icons = { night: '🌙', dawn: '🌅', day: '☀️', dusk: '🌇' };
            this.dayPhaseEl.textContent = icons[phase] || '☀️';
        }
        // Hava durumu ikonu
        if (this.weatherEl) {
            const wIcons = { clear: '☀️', rain: '🌧️', snow: '❄️', ash: '🌫️' };
            this.weatherEl.textContent = wIcons[Game.weather] || '☀️';
        }
        // Envanter
        if (this.invWoodEl) this.invWoodEl.textContent = World.inventory.wood || 0;
        if (this.invStoneEl) this.invStoneEl.textContent = World.inventory.stone_item || 0;
        if (this.invFishEl) this.invFishEl.textContent = World.inventory.fish || 0;
    },

    showNotification(icon, message) {
        if (!this.notificationEl) return;
        this.notificationIcon.textContent = icon;
        this.notificationText.textContent = message;
        this.notificationEl.classList.remove('hidden');
        this.notificationEl.classList.add('show');
        if (this.notificationTimer) clearTimeout(this.notificationTimer);
        this.notificationTimer = setTimeout(() => {
            this.notificationEl.classList.remove('show');
            setTimeout(() => this.notificationEl.classList.add('hidden'), 500);
        }, 3000);
    },

    toggleBuildMode() {
        this.buildMode = !this.buildMode;
        this.terraformMode = null;
        if (this.buildMode) {
            this.toolbarEl.classList.remove('hidden');
            this.updateToolbar();
        } else {
            this.toolbarEl.classList.add('hidden');
            this.selectedObject = null;
        }
    },

    setTerraformMode(mode) {
        this.terraformMode = (this.terraformMode === mode) ? null : mode;
        this.selectedObject = null;
        this.updateToolbar();
    },

    updateToolbar() {
        if (!this.toolbarItemsEl) return;
        let html = '';

        // Terraforming araçları
        html += `<div class="toolbar-item ${this.terraformMode === 'dig' ? 'selected' : ''}"
                      onclick="UI.setTerraformMode('dig')" title="⛏️ Kazma (3 katlı) [1]">
            <span class="toolbar-item-icon">⛏️</span>
            <span class="toolbar-item-label">Kaz (1💎)</span>
        </div>`;
        html += `<div class="toolbar-item ${this.terraformMode === 'fill' ? 'selected' : ''}"
                      onclick="UI.setTerraformMode('fill')" title="🪨 Dolgu (3 katlı) [2]">
            <span class="toolbar-item-icon">🪨</span>
            <span class="toolbar-item-label">Doldur (1💎)</span>
        </div>`;
        html += '<div style="width:2px;background:rgba(255,255,255,0.1);margin:0 4px"></div>';

        // Nesne araçları
        const allTypes = Object.keys(GameObjects.definitions);
        allTypes.forEach(type => {
            if (type === 'raft') return; // Raft elle yerleştirilmez
            const def = GameObjects.definitions[type];
            const unlocked = Tasks.unlockedObjects.has(type);
            const selected = this.selectedObject === type && !this.terraformMode;
            html += `<div class="toolbar-item ${unlocked ? (selected ? 'selected' : '') : 'locked'}"
                          onclick="${unlocked ? `UI.selectObject('${type}')` : ''}" title="${def.name}">
                <span class="toolbar-item-icon">${def.icon}</span>
                <span class="toolbar-item-label">${unlocked ? '' : '🔒'}</span>
            </div>`;
        });
        this.toolbarItemsEl.innerHTML = html;
    },

    selectObject(type) {
        this.terraformMode = null;
        this.selectedObject = (this.selectedObject === type) ? null : type;
        this.updateToolbar();
    },

    onCanvasClick(e) {
        if (!this.buildMode || Story.active) return;
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        const tileX = Math.floor((mouseX + Game.camera.x) / World.TILE_SIZE);
        const tileY = Math.floor((mouseY + Game.camera.y) / World.TILE_SIZE);

        // Terraforming
        if (this.terraformMode) {
            const success = World.terraform(tileX, tileY, this.terraformMode);
            if (success) {
                const msg = this.terraformMode === 'dig' ? '⛏️ Toprak kazıldı!' : '🪨 Alan dolduruldu!';
                this.showNotification(this.terraformMode === 'dig' ? '⛏️' : '🪨', msg);
                this.updateScore();
            } else {
                this.showNotification('❌', World.stones < 1 ? 'Yeterli taş yok!' : 'Buraya uygulanamaz!');
            }
            return;
        }

        // Nesne yerleştirme
        if (this.selectedObject) {
            if (World.isWalkable(tileX, tileY)) {
                World.placeObject({ type: this.selectedObject, x: tileX, y: tileY });
                Tasks.buildingsPlaced++;
                Tasks.score += 10;
                this.updateScore();
                this.showNotification('✅', `${GameObjects.definitions[this.selectedObject].name} yerleştirildi!`);
            }
        }
    },

    renderBuildCursor(ctx, camera) {
        if (!this.buildMode || (!this.selectedObject && !this.terraformMode)) return;
        if (!Game.mouseX && Game.mouseX !== 0) return;

        const canvas = document.getElementById('game-canvas');
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = Game.mouseX * scaleX;
        const my = Game.mouseY * scaleY;
        const tileX = Math.floor((mx + camera.x) / World.TILE_SIZE);
        const tileY = Math.floor((my + camera.y) / World.TILE_SIZE);
        const screenX = tileX * World.TILE_SIZE - camera.x;
        const screenY = tileY * World.TILE_SIZE - camera.y;

        let valid = false;
        const currentTile = World.getTileAt(tileX, tileY);
        if (this.terraformMode === 'dig') {
            // 3 katmanlı: herhangi bir yürünebilir tile veya shallow kazılabilir
            const diggable = World.isWalkable(tileX, tileY) || currentTile === World.TILES.SHALLOW;
            valid = diggable && World.stones >= 1 && currentTile !== World.TILES.LAVA;
        } else if (this.terraformMode === 'fill') {
            // 3 katmanlı: su, sığ su, kum/kar/buz/kül doldurulabilir
            const fillable = currentTile !== World.TILES.DEEP_WATER && currentTile !== World.TILES.LAVA;
            valid = fillable && World.stones >= 1;
        } else {
            valid = World.isWalkable(tileX, tileY);
        }

        ctx.fillStyle = valid ? 'rgba(80,255,128,0.2)' : 'rgba(255,80,80,0.2)';
        ctx.fillRect(screenX, screenY, World.TILE_SIZE, World.TILE_SIZE);
        ctx.strokeStyle = valid ? '#50ff80' : '#ff5050';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(screenX, screenY, World.TILE_SIZE, World.TILE_SIZE);
        ctx.setLineDash([]);

        if (valid && this.selectedObject && !this.terraformMode) {
            ctx.globalAlpha = 0.5;
            GameObjects.drawObject(ctx, this.selectedObject, screenX, screenY);
            ctx.globalAlpha = 1;
        }
    }
};
