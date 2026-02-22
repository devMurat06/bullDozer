/* ========================================
   Game Engine — Ana oyun döngüsü
   Audio, video, gündüz/gece, hava durumu
   ======================================== */

const Game = {
    canvas: null, ctx: null,
    camera: { x: 0, y: 0, width: 0, height: 0 },
    lastTime: 0, running: false,
    mouseX: 0, mouseY: 0,

    // === Müzik & Ses ===
    bgMusic: null,
    musicStarted: false,

    // === Gündüz/Gece Döngüsü ===
    timeOfDay: 0.3,     // 0=gece, 0.25=şafak, 0.5=öğle, 0.75=gün batımı, 1=gece
    daySpeed: 0.008,    // ~2 dk tam döngü
    dayPhase: 'day',    // 'night','dawn','day','dusk'

    // === Hava Durumu ===
    weather: 'clear',
    weatherParticles: [],
    weatherTimer: 0,
    weatherDuration: 0,

    // === Enerji/sağlık ===
    energy: 100,
    maxEnergy: 100,
    energyRegenTimer: 0,

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        // Müzik
        this.bgMusic = document.getElementById('bg-music');

        // Modülleri başlat
        World.init();
        GameObjects.init();
        Player.init();
        Tasks.init();
        UI.init();
        Story.init();

        // Start screen
        const startBtn = document.getElementById('start-btn');
        const startScreen = document.getElementById('start-screen');
        startBtn.addEventListener('click', () => {
            startScreen.classList.add('fade-out');
            setTimeout(() => {
                startScreen.style.display = 'none';
                this.start();
                this.startMusic();
                Story.onIslandArrival(0);
            }, 800);
        });
    },

    startMusic() {
        if (this.bgMusic && !this.musicStarted) {
            this.bgMusic.volume = 0.4;
            this.bgMusic.play().catch(() => {
                // Autoplay engellendiyse, ilk tıklamada başlat
                document.addEventListener('click', () => {
                    if (!this.musicStarted) {
                        this.bgMusic.play();
                        this.musicStarted = true;
                    }
                }, { once: true });
            });
            this.musicStarted = true;
        }
    },

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.camera.width = this.canvas.width;
        this.camera.height = this.canvas.height;
        this.ctx.imageSmoothingEnabled = false;
    },

    start() {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    },

    loop(timestamp) {
        if (!this.running) return;
        const dt = Math.min(timestamp - this.lastTime, 100);
        this.lastTime = timestamp;
        this.update(dt);
        this.render();
        requestAnimationFrame((t) => this.loop(t));
    },

    update(dt) {
        World.update(dt);

        // Geçiş videosu kontrol
        const transitioning = World.updateTransition(dt);

        if (!transitioning) {
            Player.update(dt);
            Tasks.update();
            this.updateDayNight(dt);
            this.updateWeather(dt);
            this.updateEnergy(dt);
        }
        Story.update(dt);
        UI.update();
        if (!transitioning) this.updateCamera();
    },

    // === Gündüz/Gece Döngüsü ===
    updateDayNight(dt) {
        this.timeOfDay += this.daySpeed * (dt / 1000);
        if (this.timeOfDay >= 1) this.timeOfDay -= 1;

        if (this.timeOfDay < 0.2) this.dayPhase = 'night';
        else if (this.timeOfDay < 0.3) this.dayPhase = 'dawn';
        else if (this.timeOfDay < 0.7) this.dayPhase = 'day';
        else if (this.timeOfDay < 0.8) this.dayPhase = 'dusk';
        else this.dayPhase = 'night';
    },

    getDayAlpha() {
        const t = this.timeOfDay;
        if (t < 0.2) return 0.55;          // gece
        if (t < 0.3) return 0.55 - (t - 0.2) * 5.5; // şafak (0.55 → 0)
        if (t < 0.7) return 0;              // gündüz
        if (t < 0.8) return (t - 0.7) * 5.5;  // gün batımı (0 → 0.55)
        return 0.55;                         // gece
    },

    getDayTint() {
        const t = this.timeOfDay;
        if (t < 0.2) return { r: 10, g: 15, b: 50 };     // gece mavisi
        if (t < 0.25) return { r: 60, g: 30, b: 20 };     // kızıl şafak
        if (t < 0.3) return { r: 40, g: 30, b: 10 };      // altın şafak
        if (t < 0.7) return { r: 0, g: 0, b: 0 };         // net gündüz
        if (t < 0.75) return { r: 50, g: 25, b: 5 };      // altın gün batımı
        if (t < 0.8) return { r: 40, g: 15, b: 30 };      // mor gün batımı
        return { r: 10, g: 15, b: 50 };                    // gece
    },

    // === Hava Durumu ===
    updateWeather(dt) {
        this.weatherTimer += dt;

        // Yeni hava durumu başlat (~30 saniyede bir değişim)
        if (this.weatherTimer >= this.weatherDuration) {
            this.weatherTimer = 0;
            const biome = World.getCurrentBiome();
            const rand = Math.random();

            if (biome === 'winter') {
                this.weather = rand < 0.3 ? 'clear' : 'snow';
            } else if (biome === 'volcanic') {
                this.weather = rand < 0.4 ? 'clear' : rand < 0.7 ? 'ash' : 'clear';
            } else {
                this.weather = rand < 0.5 ? 'clear' : 'rain';
            }
            this.weatherDuration = 15000 + Math.random() * 20000;
        }

        // Partikülleri güncelle
        this.updateWeatherParticles(dt);
    },

    updateWeatherParticles(dt) {
        if (this.weather === 'clear') {
            this.weatherParticles = [];
            return;
        }

        // Yeni partikül ekle
        const w = this.canvas.width;
        const h = this.canvas.height;
        const rate = this.weather === 'snow' ? 2 : this.weather === 'ash' ? 1 : 4;

        for (let i = 0; i < rate; i++) {
            this.weatherParticles.push({
                x: Math.random() * w,
                y: -10,
                speed: this.weather === 'snow' ? (1 + Math.random() * 2) : (4 + Math.random() * 4),
                size: this.weather === 'snow' ? (2 + Math.random() * 3) : (1 + Math.random()),
                drift: this.weather === 'snow' ? (Math.random() - 0.5) * 0.5 : (Math.random() - 0.5) * 0.3,
                opacity: 0.3 + Math.random() * 0.5,
            });
        }

        // Güncelle
        for (let i = this.weatherParticles.length - 1; i >= 0; i--) {
            const p = this.weatherParticles[i];
            p.y += p.speed;
            p.x += p.drift;
            if (p.y > h + 10) this.weatherParticles.splice(i, 1);
        }

        // Maks partikül
        if (this.weatherParticles.length > 300) {
            this.weatherParticles.splice(0, this.weatherParticles.length - 300);
        }
    },

    // === Enerji ===
    updateEnergy(dt) {
        this.energyRegenTimer += dt;
        if (this.energyRegenTimer >= 2000) {
            if (!Player.moving) {
                this.energy = Math.min(this.maxEnergy, this.energy + 5);
            }
            this.energyRegenTimer = 0;
        }
        // Hareket enerji tüketir
        if (Player.moving) {
            this.energy = Math.max(0, this.energy - dt * 0.003);
        }
    },

    useEnergy(amount) {
        if (this.energy >= amount) {
            this.energy -= amount;
            return true;
        }
        return false;
    },

    updateCamera() {
        const T = World.TILE_SIZE;
        const targetX = Player.x * T - this.camera.width / 2 + T / 2;
        const targetY = Player.y * T - this.camera.height / 2 + T / 2;
        this.camera.x += (targetX - this.camera.x) * 0.08;
        this.camera.y += (targetY - this.camera.y) * 0.08;
        const mapW = World.MAP_WIDTH * T;
        const mapH = World.MAP_HEIGHT * T;
        this.camera.x = Math.max(0, Math.min(this.camera.x, mapW - this.camera.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, mapH - this.camera.height));
    },

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = '#001830';
        ctx.fillRect(0, 0, w, h);

        World.render(ctx, this.camera);
        World.renderFog(ctx, this.camera); // Fog of war
        this.renderObjectsSorted(ctx);
        UI.renderBuildCursor(ctx, this.camera);

        // Gündüz/gece overlay
        this.renderDayNight(ctx, w, h);

        // Hava durumu
        this.renderWeather(ctx, w, h);

        // Ambient vignette
        this.renderAmbient(ctx);

        // Enerji barı
        this.renderEnergyBar(ctx);

        // Minimap
        this.renderMinimap(ctx);

        // Ada geçiş efekti
        World.renderTransition(ctx, w, h);

        // Hikaye diyalogu (en üstte)
        Story.render(ctx, w, h);
    },

    renderDayNight(ctx, w, h) {
        const alpha = this.getDayAlpha();
        if (alpha <= 0) return;

        const tint = this.getDayTint();
        ctx.fillStyle = `rgba(${tint.r},${tint.g},${tint.b},${alpha})`;
        ctx.fillRect(0, 0, w, h);

        // Gece yıldızları
        if (this.dayPhase === 'night') {
            ctx.fillStyle = 'rgba(255,255,220,0.6)';
            const seed = 42;
            for (let i = 0; i < 30; i++) {
                const sx = ((seed * (i + 1) * 137) % w);
                const sy = ((seed * (i + 1) * 89) % (h * 0.5));
                const twinkle = Math.sin(Date.now() * 0.003 + i) * 0.3 + 0.7;
                ctx.globalAlpha = twinkle * 0.6;
                ctx.beginPath();
                ctx.arc(sx, sy, 1 + (i % 2), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    },

    renderWeather(ctx, w, h) {
        if (this.weather === 'clear' || this.weatherParticles.length === 0) return;

        for (const p of this.weatherParticles) {
            if (this.weather === 'rain') {
                ctx.strokeStyle = `rgba(150,190,255,${p.opacity})`;
                ctx.lineWidth = p.size;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + 1, p.y + 8);
                ctx.stroke();
            } else if (this.weather === 'snow') {
                ctx.fillStyle = `rgba(240,245,255,${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.weather === 'ash') {
                ctx.fillStyle = `rgba(120,110,100,${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    },

    renderEnergyBar(ctx) {
        const dpr = window.devicePixelRatio || 1;
        const barW = 160 * dpr;
        const barH = 12 * dpr;
        const barX = this.canvas.width / 2 - barW / 2;
        const barY = this.canvas.height - 50 * dpr;

        // Arkaplan
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.roundRect(barX - 2 * dpr, barY - 2 * dpr, barW + 4 * dpr, barH + 4 * dpr, 4 * dpr);
        ctx.fill();

        // Enerji doluluk
        const pct = this.energy / this.maxEnergy;
        const green = Math.floor(pct * 200 + 55);
        const red = Math.floor((1 - pct) * 200 + 55);
        ctx.fillStyle = `rgb(${red},${green},80)`;
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW * pct, barH, 3 * dpr);
        ctx.fill();

        // Simge + metin
        ctx.fillStyle = '#fff';
        ctx.font = `${7 * dpr}px "Press Start 2P", monospace`;
        ctx.fillText(`⚡ ${Math.floor(this.energy)}`, barX + 4 * dpr, barY + barH - 3 * dpr);
    },

    renderMinimap(ctx) {
        const dpr = window.devicePixelRatio || 1;
        const mmW = 120 * dpr;
        const mmH = 88 * dpr;
        const mmX = this.canvas.width - mmW - 16 * dpr;
        const mmY = this.canvas.height - mmH - 60 * dpr;
        const tileW = mmW / World.MAP_WIDTH;
        const tileH = mmH / World.MAP_HEIGHT;

        // Çerçeve
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.beginPath();
        ctx.roundRect(mmX - 3 * dpr, mmY - 3 * dpr, mmW + 6 * dpr, mmH + 6 * dpr, 4 * dpr);
        ctx.fill();
        ctx.strokeStyle = 'rgba(80,200,255,0.6)';
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        ctx.roundRect(mmX - 3 * dpr, mmY - 3 * dpr, mmW + 6 * dpr, mmH + 6 * dpr, 4 * dpr);
        ctx.stroke();

        // Fog of war minimap renkleri
        const mmColors = {
            0: '#004488', 1: '#006699', 2: '#22aacc',
            3: '#d0b870', 4: '#44aa33', 5: '#228822',
            6: '#bb2200', 7: '#444444', 8: '#777770',
            9: '#dde0e8', 10: '#88bbdd', 11: '#558855',
        };

        for (let y = 0; y < World.MAP_HEIGHT; y++) {
            for (let x = 0; x < World.MAP_WIDTH; x++) {
                const tile = World.map[y][x];
                // Fog check — keşfedilmemiş alan karanlık
                const explored = World.fogMap && World.fogMap[y] && World.fogMap[y][x];
                if (!explored) {
                    ctx.fillStyle = 'rgba(15,20,35,0.9)';
                } else {
                    ctx.fillStyle = mmColors[tile] || '#333';
                }
                ctx.fillRect(mmX + x * tileW, mmY + y * tileH, tileW + 0.5, tileH + 0.5);
            }
        }

        // Oyuncu noktası (yanıp sönen)
        if (Math.floor(Date.now() / 300) % 2 === 0) {
            ctx.fillStyle = '#ff3333';
        } else {
            ctx.fillStyle = '#ffaa33';
        }
        ctx.beginPath();
        ctx.arc(
            mmX + Player.x * tileW + tileW / 2,
            mmY + Player.y * tileH + tileH / 2,
            3 * dpr, 0, Math.PI * 2
        );
        ctx.fill();

        // Nesneler (küçük noktalar)
        ctx.fillStyle = 'rgba(255,215,0,0.6)';
        for (const obj of World.placedObjects) {
            ctx.fillRect(mmX + obj.x * tileW, mmY + obj.y * tileH, tileW, tileH);
        }
    },

    renderObjectsSorted(ctx) {
        const entities = [];
        for (const obj of World.placedObjects) {
            entities.push({ type: 'object', data: obj, y: obj.y });
        }
        entities.push({ type: 'player', y: Player.getTileY() });
        entities.sort((a, b) => a.y - b.y);

        for (const e of entities) {
            if (e.type === 'player') {
                Player.render(ctx, this.camera);
            } else {
                const screenX = e.data.x * World.TILE_SIZE - this.camera.x;
                const screenY = e.data.y * World.TILE_SIZE - this.camera.y;
                if (this.isOnScreen(screenX, screenY)) {
                    GameObjects.drawObject(ctx, e.data.type, screenX, screenY);
                }
            }
        }
    },

    isOnScreen(sx, sy) {
        const m = World.TILE_SIZE * 3;
        return sx > -m && sx < this.camera.width + m && sy > -m && sy < this.camera.height + m;
    },

    renderAmbient(ctx) {
        const w = this.canvas.width, h = this.canvas.height;
        const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.4, w / 2, h / 2, Math.max(w, h) * 0.7);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, 'rgba(0,10,30,0.3)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
    }
};

window.addEventListener('DOMContentLoaded', () => Game.init());
