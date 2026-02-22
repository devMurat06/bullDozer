/* ========================================
   World Module - Multi-Island System
   Çoklu ada, biome'lar, terraforming
   ======================================== */

const World = {
    TILE_SIZE: 48,
    MAP_WIDTH: 30,
    MAP_HEIGHT: 22,

    // Tile türleri
    TILES: {
        DEEP_WATER: 0,
        WATER: 1,
        SHALLOW: 2,
        SAND: 3,
        GRASS: 4,
        DARK_GRASS: 5,
        LAVA: 6,
        VOLCANIC_ROCK: 7,
        ASH: 8,
        SNOW: 9,
        ICE: 10,
        FROZEN_GRASS: 11,
    },

    // Biome tanımları
    BIOMES: {
        TROPICAL: 'tropical',
        VOLCANIC: 'volcanic',
        WINTER: 'winter',
    },

    // Tile renkleri — biome başına
    TILE_COLORS: {
        // Ortak su
        0: ['#0066aa', '#0055aa', '#0077bb'],
        1: ['#0099cc', '#0088bb', '#00aadd'],
        2: ['#33bbdd', '#44ccee', '#22aacc'],
        // Tropik
        3: ['#f0d890', '#e8d080', '#f5dfa0'],
        4: ['#55bb44', '#44aa33', '#66cc55'],
        5: ['#338833', '#227722', '#449944'],
        // Volkanik
        6: ['#cc3300', '#ff4400', '#aa2200'],
        7: ['#555555', '#444444', '#666666'],
        8: ['#888880', '#777770', '#999990'],
        // Kış
        9: ['#e8eef5', '#dde5f0', '#f0f4fa'],
        10: ['#aaddff', '#88ccff', '#bbddff'],
        11: ['#6b9b6b', '#5a8a5a', '#7cac7c'],
    },

    // === Çoklu Ada Sistemi ===
    islands: [],
    currentIslandIndex: 0,

    // Aktif harita verisi
    map: [],
    placedObjects: [],
    fogMap: [],   // Fog of war (keşif sisi)

    // Animasyon
    waterFrame: 0,
    waterTimer: 0,

    // Geçiş durumları
    transitioning: false,
    transitionAlpha: 0,
    transitionTarget: -1,
    transitionPhase: 'none',
    transitionVideo: null,  // Video element
    transitionVideoPlaying: false,

    // Terraforming kaynakları
    stones: 0,

    // Envanter
    inventory: {
        wood: 0,
        stone_item: 0,
        fish: 0,
    },

    init() {
        this.transitionVideo = document.getElementById('transition-video-volkan');
        this.transitionVideoBuzul = document.getElementById('transition-video-buzul');
        this.createAllIslands();
        this.loadIsland(0);
        this.initFogMap();
    },

    createAllIslands() {
        this.islands = [
            {
                name: '🏝️ Cennet Adası',
                biome: this.BIOMES.TROPICAL,
                map: [],
                placedObjects: [],
                completed: false,
                raftPosition: { x: 23, y: 14 },
            },
            {
                name: '🌋 Volkan Adası',
                biome: this.BIOMES.VOLCANIC,
                map: [],
                placedObjects: [],
                completed: false,
                raftPosition: { x: 23, y: 14 },
            },
            {
                name: '❄️ Buzul Adası',
                biome: this.BIOMES.WINTER,
                map: [],
                placedObjects: [],
                completed: false,
                raftPosition: { x: 23, y: 14 },  // Buzul'dan Cennet'e dönüş
            },
        ];

        // Her ada için harita oluştur
        this.islands.forEach((island, i) => {
            island.map = this.generateIslandMap(island.biome, i);
        });
    },

    generateIslandMap(biome, seed) {
        const W = this.MAP_WIDTH;
        const H = this.MAP_HEIGHT;
        const map = [];
        const cx = W / 2;
        const cy = H / 2;

        // Biome'a göre tile eşleştirme
        let landTiles;
        switch (biome) {
            case this.BIOMES.VOLCANIC:
                landTiles = {
                    core: this.TILES.VOLCANIC_ROCK,
                    mid: this.TILES.ASH,
                    edge: this.TILES.SAND,
                };
                break;
            case this.BIOMES.WINTER:
                landTiles = {
                    core: this.TILES.FROZEN_GRASS,
                    mid: this.TILES.SNOW,
                    edge: this.TILES.ICE,
                };
                break;
            default:
                landTiles = {
                    core: this.TILES.DARK_GRASS,
                    mid: this.TILES.GRASS,
                    edge: this.TILES.SAND,
                };
        }

        for (let y = 0; y < H; y++) {
            map[y] = [];
            for (let x = 0; x < W; x++) {
                const dx = (x - cx) / (W * 0.35);
                const dy = (y - cy) / (H * 0.35);
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Her ada için farklı gürültü
                const s = seed * 17 + 3;
                const noise = Math.sin(x * 0.8 + s) * 0.08 +
                    Math.cos(y * 1.1 + s * 0.7) * 0.06 +
                    Math.sin((x + y) * 0.5 + s * 0.3) * 0.05;
                const d = dist + noise;

                // Cennet adası daha büyük toprak
                const islandSize = (biome === this.BIOMES.TROPICAL) ? 1.25 : 1.0;
                const adjD = d / islandSize;

                if (adjD < 0.4) {
                    map[y][x] = landTiles.core;
                } else if (adjD < 0.6) {
                    map[y][x] = landTiles.mid;
                } else if (adjD < 0.72) {
                    map[y][x] = landTiles.edge;
                } else if (adjD < 0.82) {
                    map[y][x] = this.TILES.SHALLOW;
                } else if (d < 0.95) {
                    map[y][x] = this.TILES.WATER;
                } else {
                    map[y][x] = this.TILES.DEEP_WATER;
                }
            }
        }

        // Volkanik ada — merkez ÜSTÜNE lav ekle (oyuncu merkeze spawn olduğu için üstte)
        if (biome === this.BIOMES.VOLCANIC) {
            const lavaCX = Math.floor(cx);
            const lavaCY = Math.floor(cy) - 3; // Merkezin üstüne
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const lx = lavaCX + dx;
                    const ly = lavaCY + dy;
                    if (lx >= 0 && lx < W && ly >= 0 && ly < H) {
                        if (Math.abs(dx) + Math.abs(dy) <= 1) {
                            map[ly][lx] = this.TILES.LAVA;
                        }
                    }
                }
            }
        }

        return map;
    },

    loadIsland(index) {
        if (index < 0 || index >= this.islands.length) return;
        const island = this.islands[index];
        this.currentIslandIndex = index;
        this.map = island.map;
        this.placedObjects = island.placedObjects;
        this.fogMap = island.fogMap || [];
        if (!this.fogMap.length) this.initFogMap();
    },

    // Ada geçişi başlat
    startTransition(targetIndex) {
        if (this.transitioning || targetIndex === this.currentIslandIndex) return;
        if (targetIndex < 0 || targetIndex >= this.islands.length) return;

        this.transitioning = true;
        this.transitionTarget = targetIndex;
        this.transitionPhase = 'fadeOut';
        this.transitionAlpha = 0;

        // Geçiş videosunu seç ve başlat
        let videoEl = null;
        if (this.currentIslandIndex === 0 && targetIndex === 1) {
            videoEl = this.transitionVideo; // Cennet → Volkan
        } else if (this.currentIslandIndex === 1 && targetIndex === 2) {
            videoEl = this.transitionVideoBuzul; // Volkan → Buzul
        }

        if (videoEl) {
            this.transitionVideoPlaying = true;
            this.activeVideoEl = videoEl;
            videoEl.currentTime = 0;
            videoEl.style.display = 'block';
            // Müziği kapat
            if (Game.bgMusic) Game.bgMusic.volume = 0;
            videoEl.play().catch(() => { });
        }
    },

    // Geçiş animasyonunu güncelle
    updateTransition(dt) {
        if (!this.transitioning) return false;

        const speed = dt / 800; // ~0.8s geçiş

        if (this.transitionPhase === 'fadeOut') {
            this.transitionAlpha = Math.min(1, this.transitionAlpha + speed);
            if (this.transitionAlpha >= 1) {
                // Ada değiştir
                this.saveCurrentIsland();
                this.loadIsland(this.transitionTarget);
                // Güvenli spawn noktası bul
                const spawn = this.findSafeSpawn();
                Player.x = spawn.x;
                Player.y = spawn.y;
                Player.tilesExplored = new Set();
                Player.totalSteps = 0;
                Player.lastTileX = spawn.x;
                Player.lastTileY = spawn.y;
                this.transitionPhase = 'fadeIn';

                // Hikaye tetikle
                Story.onIslandArrival(this.transitionTarget);
            }
        } else if (this.transitionPhase === 'fadeIn') {
            this.transitionAlpha = Math.max(0, this.transitionAlpha - speed);
            if (this.transitionAlpha <= 0) {
                this.transitioning = false;
                this.transitionPhase = 'none';
                this.transitionTarget = -1;
            }
        }

        return this.transitioning;
    },

    saveCurrentIsland() {
        const island = this.islands[this.currentIslandIndex];
        island.map = this.map;
        island.placedObjects = this.placedObjects;
        island.fogMap = this.fogMap;
    },

    // Mevcut biome
    getCurrentBiome() {
        return this.islands[this.currentIslandIndex].biome;
    },

    getCurrentIsland() {
        return this.islands[this.currentIslandIndex];
    },

    // Tile yürünebilirlik
    isWalkable(tileX, tileY) {
        if (tileX < 0 || tileX >= this.MAP_WIDTH || tileY < 0 || tileY >= this.MAP_HEIGHT) return false;
        const tile = this.map[tileY][tileX];
        // Su ve lav hariç her şey yürünebilir
        return tile !== this.TILES.DEEP_WATER && tile !== this.TILES.WATER &&
            tile !== this.TILES.SHALLOW && tile !== this.TILES.LAVA;
    },

    // Güvenli spawn noktası bul
    findSafeSpawn() {
        const cx = Math.floor(this.MAP_WIDTH / 2);
        const cy = Math.floor(this.MAP_HEIGHT / 2);
        // Merkez yürünebilirse orada spawn ol
        if (this.isWalkable(cx, cy)) return { x: cx, y: cy };
        // Değilse spiral şeklinde ara
        for (let r = 1; r < 10; r++) {
            for (let dx = -r; dx <= r; dx++) {
                for (let dy = -r; dy <= r; dy++) {
                    if (this.isWalkable(cx + dx, cy + dy)) return { x: cx + dx, y: cy + dy };
                }
            }
        }
        return { x: cx, y: cy + 2 };
    },

    // === Terraforming (3 Katmanlı) ===
    // Kazma zinciri: core → mid → edge → su (veya volkanik: core → mid → edge, su yok)
    // Dolgu zinciri: su → edge → mid → core
    terraform(tileX, tileY, mode) {
        if (tileX < 0 || tileX >= this.MAP_WIDTH || tileY < 0 || tileY >= this.MAP_HEIGHT) return false;

        const tile = this.map[tileY][tileX];
        const biome = this.getCurrentBiome();

        if (mode === 'dig') {
            if (this.stones < 1) return false;

            // 3 katlı kazma — biome'a özel
            if (biome === this.BIOMES.TROPICAL) {
                if (tile === this.TILES.DARK_GRASS || tile === this.TILES.GRASS) {
                    this.map[tileY][tileX] = this.TILES.SAND; // 1. kat
                } else if (tile === this.TILES.SAND) {
                    this.map[tileY][tileX] = this.TILES.SHALLOW; // 2. kat
                } else if (tile === this.TILES.SHALLOW) {
                    this.map[tileY][tileX] = this.TILES.WATER; // 3. kat — su!
                } else return false;
            } else if (biome === this.BIOMES.VOLCANIC) {
                // Volkanik: kazınca su ÇIKMAZ!
                if (tile === this.TILES.VOLCANIC_ROCK) {
                    this.map[tileY][tileX] = this.TILES.ASH; // 1. kat
                } else if (tile === this.TILES.ASH) {
                    this.map[tileY][tileX] = this.TILES.SAND; // 2. kat
                } else if (tile === this.TILES.SAND) {
                    this.map[tileY][tileX] = this.TILES.ASH; // 3. kat — tekrar kül, su yok!
                } else return false;
            } else if (biome === this.BIOMES.WINTER) {
                if (tile === this.TILES.FROZEN_GRASS) {
                    this.map[tileY][tileX] = this.TILES.SNOW; // 1. kat
                } else if (tile === this.TILES.SNOW) {
                    this.map[tileY][tileX] = this.TILES.ICE; // 2. kat
                } else if (tile === this.TILES.ICE) {
                    this.map[tileY][tileX] = this.TILES.SHALLOW; // 3. kat — su
                } else return false;
            }
            this.stones--;
            return true;

        } else if (mode === 'fill') {
            if (this.stones < 1) return false;

            // 3 katlı doldurma — biome'a özel
            if (biome === this.BIOMES.TROPICAL) {
                if (tile === this.TILES.WATER || tile === this.TILES.SHALLOW) {
                    this.map[tileY][tileX] = this.TILES.SAND; // 1. kat
                } else if (tile === this.TILES.SAND) {
                    this.map[tileY][tileX] = this.TILES.GRASS; // 2. kat
                } else if (tile === this.TILES.GRASS) {
                    this.map[tileY][tileX] = this.TILES.DARK_GRASS; // 3. kat — tam toprak!
                } else return false;
            } else if (biome === this.BIOMES.VOLCANIC) {
                if (tile === this.TILES.SHALLOW || tile === this.TILES.WATER) {
                    this.map[tileY][tileX] = this.TILES.SAND; // 1. kat
                } else if (tile === this.TILES.SAND) {
                    this.map[tileY][tileX] = this.TILES.ASH; // 2. kat
                } else if (tile === this.TILES.ASH) {
                    this.map[tileY][tileX] = this.TILES.VOLCANIC_ROCK; // 3. kat
                } else return false;
            } else if (biome === this.BIOMES.WINTER) {
                if (tile === this.TILES.WATER || tile === this.TILES.SHALLOW) {
                    this.map[tileY][tileX] = this.TILES.ICE; // 1. kat
                } else if (tile === this.TILES.ICE) {
                    this.map[tileY][tileX] = this.TILES.SNOW; // 2. kat
                } else if (tile === this.TILES.SNOW) {
                    this.map[tileY][tileX] = this.TILES.FROZEN_GRASS; // 3. kat
                } else return false;
            }
            this.stones--;
            return true;
        }
        return false;
    },

    // Sala pozisyonunu kontrol et
    isNearRaft(playerTileX, playerTileY) {
        const island = this.getCurrentIsland();
        if (!island.raftPosition) return false;
        const dx = Math.abs(playerTileX - island.raftPosition.x);
        const dy = Math.abs(playerTileY - island.raftPosition.y);
        return dx <= 1 && dy <= 1;
    },

    // Render
    render(ctx, camera) {
        const T = this.TILE_SIZE;
        const startX = Math.max(0, Math.floor(camera.x / T));
        const startY = Math.max(0, Math.floor(camera.y / T));
        const endX = Math.min(this.MAP_WIDTH, Math.ceil((camera.x + camera.width) / T));
        const endY = Math.min(this.MAP_HEIGHT, Math.ceil((camera.y + camera.height) / T));

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = this.map[y][x];
                const screenX = x * T - camera.x;
                const screenY = y * T - camera.y;
                this.drawTile(ctx, tile, screenX, screenY, x, y);
            }
        }
    },

    drawTile(ctx, tile, sx, sy, tx, ty) {
        const T = this.TILE_SIZE;
        const colors = this.TILE_COLORS[tile];
        if (!colors) return;

        const colorIdx = (tx + ty + this.waterFrame) % colors.length;
        const isWater = tile <= 2;
        const isLava = tile === this.TILES.LAVA;

        ctx.fillStyle = (isWater || isLava) ? colors[colorIdx] : colors[(tx + ty) % colors.length];
        ctx.fillRect(sx, sy, T, T);

        // Su dalgası
        if (isWater) {
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1;
            const offset = (this.waterFrame * 4 + tx * 8 + ty * 5) % 20;
            for (let i = 0; i < 3; i++) {
                const wy = sy + 8 + i * 14 + (offset % 14);
                ctx.beginPath();
                ctx.moveTo(sx + 4, wy);
                ctx.quadraticCurveTo(sx + T / 2, wy - 3 + Math.sin(tx + this.waterFrame * 0.3) * 2, sx + T - 4, wy);
                ctx.stroke();
            }
        }

        // Lav parıltısı
        if (isLava) {
            ctx.fillStyle = `rgba(255,200,0,${0.2 + Math.sin(this.waterFrame + tx) * 0.1})`;
            ctx.fillRect(sx + 4, sy + 4, T - 8, T - 8);
            ctx.fillStyle = 'rgba(255,100,0,0.3)';
            const lx = sx + ((tx * 13 + this.waterFrame * 7) % (T - 8)) + 4;
            const ly = sy + ((ty * 17 + this.waterFrame * 5) % (T - 10)) + 4;
            ctx.beginPath();
            ctx.arc(lx, ly, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Kum dokusu
        if (tile === this.TILES.SAND) {
            ctx.fillStyle = 'rgba(200,180,120,0.3)';
            const seed = tx * 31 + ty * 17;
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(sx + ((seed * (i + 1) * 7) % (T - 4)) + 2, sy + ((seed * (i + 1) * 13) % (T - 4)) + 2, 2, 2);
            }
        }

        // Çim/Kar/Kül dokusu
        if (tile === this.TILES.GRASS || tile === this.TILES.DARK_GRASS ||
            tile === this.TILES.FROZEN_GRASS) {
            const isDark = tile === this.TILES.DARK_GRASS;
            const isFrozen = tile === this.TILES.FROZEN_GRASS;
            ctx.fillStyle = isDark ? 'rgba(0,80,0,0.3)' : isFrozen ? 'rgba(100,180,100,0.2)' : 'rgba(100,200,80,0.2)';
            const seed = tx * 23 + ty * 37;
            for (let i = 0; i < 5; i++) {
                ctx.fillRect(sx + ((seed * (i + 1) * 11) % (T - 4)) + 2, sy + ((seed * (i + 1) * 7) % (T - 6)) + 2, 1, 4);
            }
        }

        // Kar dokusu
        if (tile === this.TILES.SNOW) {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            const seed = tx * 19 + ty * 29;
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc(sx + ((seed * (i + 1) * 7) % (T - 4)) + 2, sy + ((seed * (i + 1) * 11) % (T - 4)) + 2, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Volkanik kaya
        if (tile === this.TILES.VOLCANIC_ROCK || tile === this.TILES.ASH) {
            ctx.fillStyle = tile === this.TILES.VOLCANIC_ROCK ? 'rgba(40,40,40,0.3)' : 'rgba(100,100,90,0.2)';
            const seed = tx * 29 + ty * 13;
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(sx + ((seed * (i + 1) * 7) % (T - 6)) + 3, sy + ((seed * (i + 1) * 11) % (T - 6)) + 3, 3, 2);
            }
        }

        // Buz
        if (tile === this.TILES.ICE) {
            ctx.strokeStyle = 'rgba(255,255,255,0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx + 5, sy + T * 0.3);
            ctx.lineTo(sx + T - 5, sy + T * 0.7);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(sx + T * 0.6, sy + 5);
            ctx.lineTo(sx + T * 0.3, sy + T - 5);
            ctx.stroke();
        }

        // Grid
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(sx, sy, T, T);
    },

    // Geçiş efektini render et (video destekli)
    renderTransition(ctx, w, h) {
        if (!this.transitioning && this.transitionAlpha <= 0) return;

        // Video oynatılıyorsa sadece siyah overlay göster (video HTML üzerinde)
        if (this.transitionVideoPlaying) {
            ctx.fillStyle = 'rgba(0,0,0,0.9)';
            ctx.fillRect(0, 0, w, h);
            return;
        }

        ctx.fillStyle = `rgba(0,0,0,${this.transitionAlpha})`;
        ctx.fillRect(0, 0, w, h);

        if (this.transitionAlpha > 0.5 && !this.transitionVideoPlaying) {
            const targetIsland = this.islands[this.transitionTarget >= 0 ? this.transitionTarget : this.currentIslandIndex];
            ctx.fillStyle = `rgba(255,255,255,${(this.transitionAlpha - 0.5) * 2})`;
            ctx.font = '24px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('⛵ Yolculuk...', w / 2, h / 2 - 20);
            ctx.font = '14px "Press Start 2P", monospace';
            ctx.fillText(targetIsland.name, w / 2, h / 2 + 20);
            ctx.textAlign = 'left';
        }
    },

    update(dt) {
        this.waterTimer += dt;
        if (this.waterTimer > 400) {
            this.waterFrame = (this.waterFrame + 1) % 3;
            this.waterTimer = 0;
        }

        // Video bittiğinde geçişi tamamla + müziği aç
        if (this.transitionVideoPlaying && this.activeVideoEl) {
            if (this.activeVideoEl.ended || this.activeVideoEl.paused) {
                this.transitionVideoPlaying = false;
                this.activeVideoEl.style.display = 'none';
                this.activeVideoEl = null;
                // Müziği geri aç
                if (Game.bgMusic) Game.bgMusic.volume = 0.4;
            }
        }

        // Fog of war güncelle
        this.revealFog(Player.getTileX(), Player.getTileY(), 4);
    },

    // === Fog of War ===
    initFogMap() {
        this.fogMap = [];
        for (let y = 0; y < this.MAP_HEIGHT; y++) {
            this.fogMap[y] = [];
            for (let x = 0; x < this.MAP_WIDTH; x++) {
                this.fogMap[y][x] = false;
            }
        }
        // Başlangıç noktası çevresini aç
        const cx = Math.floor(this.MAP_WIDTH / 2);
        const cy = Math.floor(this.MAP_HEIGHT / 2);
        this.revealFog(cx, cy, 5);
    },

    revealFog(centerX, centerY, radius) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= radius) {
                    const x = centerX + dx;
                    const y = centerY + dy;
                    if (x >= 0 && x < this.MAP_WIDTH && y >= 0 && y < this.MAP_HEIGHT) {
                        this.fogMap[y][x] = true;
                    }
                }
            }
        }
    },

    renderFog(ctx, camera) {
        const T = this.TILE_SIZE;
        const startX = Math.max(0, Math.floor(camera.x / T));
        const startY = Math.max(0, Math.floor(camera.y / T));
        const endX = Math.min(this.MAP_WIDTH, Math.ceil((camera.x + camera.width) / T));
        const endY = Math.min(this.MAP_HEIGHT, Math.ceil((camera.y + camera.height) / T));

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (this.fogMap[y] && this.fogMap[y][x]) continue;

                const screenX = x * T - camera.x;
                const screenY = y * T - camera.y;

                ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
                ctx.fillRect(screenX, screenY, T, T);
            }
        }

        // Keşif kenarındaki yumuşak geçiş
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (!this.fogMap[y] || !this.fogMap[y][x]) continue;
                // Komşu karanlık mı kontrol et
                const hasHiddenNeighbor =
                    (x > 0 && this.fogMap[y] && !this.fogMap[y][x - 1]) ||
                    (x < this.MAP_WIDTH - 1 && this.fogMap[y] && !this.fogMap[y][x + 1]) ||
                    (y > 0 && this.fogMap[y - 1] && !this.fogMap[y - 1][x]) ||
                    (y < this.MAP_HEIGHT - 1 && this.fogMap[y + 1] && !this.fogMap[y + 1][x]);

                if (hasHiddenNeighbor) {
                    const screenX = x * T - camera.x;
                    const screenY = y * T - camera.y;
                    ctx.fillStyle = 'rgba(10, 15, 30, 0.25)';
                    ctx.fillRect(screenX, screenY, T, T);
                }
            }
        }
    },

    placeObject(obj) {
        this.placedObjects.push(obj);
    },

    removeObjectAt(tileX, tileY) {
        this.placedObjects = this.placedObjects.filter(o => !(o.x === tileX && o.y === tileY));
    },

    // Kaynak toplama — yakındaki nesneyi topla
    harvestAt(tileX, tileY) {
        const obj = this.placedObjects.find(o => o.x === tileX && o.y === tileY);
        if (!obj) return null;

        const harvestable = {
            'palm_tree': { resource: 'wood', amount: 3, message: '🪵 3 odun toplandı!' },
            'palm_small': { resource: 'wood', amount: 1, message: '🪵 1 odun toplandı!' },
            'bush': { resource: 'wood', amount: 1, message: '🌿 1 odun toplandı!' },
            'pine_tree': { resource: 'wood', amount: 2, message: '🪵 2 odun toplandı!' },
            'lava_rock': { resource: 'stone_item', amount: 2, message: '🪨 2 taş toplandı!' },
            'ice_crystal': { resource: 'stone_item', amount: 1, message: '💎 1 kristal toplandı!' },
            'coral': { resource: 'stone_item', amount: 1, message: '🪸 1 mercan toplandı!' },
        };

        const info = harvestable[obj.type];
        if (!info) return null;

        // Enerji harca
        if (!Game.useEnergy(10)) return { error: 'Yeterli enerji yok! Dur ve dinlen.' };

        this.removeObjectAt(tileX, tileY);
        this.inventory[info.resource] = (this.inventory[info.resource] || 0) + info.amount;
        // Her 5 kaynak = 1 taş
        const totalRes = this.inventory.wood + this.inventory.stone_item;
        if (totalRes % 5 === 0 && totalRes > 0) {
            this.stones++;
        }
        return info;
    },

    setTile(x, y, tileType) {
        if (x >= 0 && x < this.MAP_WIDTH && y >= 0 && y < this.MAP_HEIGHT) {
            this.map[y][x] = tileType;
        }
    },

    getTileAt(tileX, tileY) {
        if (tileX < 0 || tileX >= this.MAP_WIDTH || tileY < 0 || tileY >= this.MAP_HEIGHT) return this.TILES.DEEP_WATER;
        return this.map[tileY][tileX];
    }
};

