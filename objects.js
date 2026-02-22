/* ========================================
   Game Objects Module
   Yerleştirilebilir nesneler: binaları, ağaçlar, dekorasyonlar
   ======================================== */

const GameObjects = {
    // Nesne türleri
    TYPES: {
        PALM_TREE: 'palm_tree',
        PALM_SMALL: 'palm_small',
        BUSH: 'bush',
        FLOWER: 'flower',
        SHELL: 'shell',
        STARFISH: 'starfish',
        PIER_H: 'pier_h',
        PIER_V: 'pier_v',
        BUNGALOW: 'bungalow',
        BUNGALOW_LARGE: 'bungalow_large',
        FENCE: 'fence',
        TORCH: 'torch',
        CRATE: 'crate',
        FLAG: 'flag',
        CORAL: 'coral',
        BOAT: 'boat',
        // Yeni biome nesneleri
        RAFT: 'raft',
        VOLCANO: 'volcano',
        LAVA_ROCK: 'lava_rock',
        OBSIDIAN_PILLAR: 'obsidian_pillar',
        IGLOO: 'igloo',
        PINE_TREE: 'pine_tree',
        ICE_CRYSTAL: 'ice_crystal',
        TREASURE: 'treasure',
        SNOWMAN: 'snowman',
    },

    // Nesne tanımları
    definitions: {},

    init() {
        const T = World.TILE_SIZE;

        this.definitions = {
            [this.TYPES.PALM_TREE]: {
                name: '🌴 Palmiye Ağacı',
                icon: '🌴',
                width: T * 1.5,
                height: T * 2.2,
                walkable: false,
                category: 'nature'
            },
            [this.TYPES.PALM_SMALL]: {
                name: '🌱 Küçük Palmiye',
                icon: '🌱',
                width: T * 0.8,
                height: T * 1.2,
                walkable: false,
                category: 'nature'
            },
            [this.TYPES.BUSH]: {
                name: '🌿 Tropikal Çalı',
                icon: '🌿',
                width: T * 0.9,
                height: T * 0.7,
                walkable: false,
                category: 'nature'
            },
            [this.TYPES.FLOWER]: {
                name: '🌺 Tropikal Çiçek',
                icon: '🌺',
                width: T * 0.5,
                height: T * 0.5,
                walkable: true,
                category: 'decoration'
            },
            [this.TYPES.SHELL]: {
                name: '🐚 Deniz Kabuğu',
                icon: '🐚',
                width: T * 0.4,
                height: T * 0.3,
                walkable: true,
                category: 'decoration'
            },
            [this.TYPES.STARFISH]: {
                name: '⭐ Denizyıldızı',
                icon: '⭐',
                width: T * 0.4,
                height: T * 0.4,
                walkable: true,
                category: 'decoration'
            },
            [this.TYPES.PIER_H]: {
                name: '🌉 İskele (Yatay)',
                icon: '🌉',
                width: T,
                height: T,
                walkable: true,
                category: 'structure'
            },
            [this.TYPES.PIER_V]: {
                name: '🌉 İskele (Dikey)',
                icon: '🌉',
                width: T,
                height: T,
                walkable: true,
                category: 'structure'
            },
            [this.TYPES.BUNGALOW]: {
                name: '🏠 Bungalov',
                icon: '🏠',
                width: T * 2,
                height: T * 2,
                walkable: false,
                category: 'building'
            },
            [this.TYPES.BUNGALOW_LARGE]: {
                name: '🏘️ Büyük Bungalov',
                icon: '🏘️',
                width: T * 2.5,
                height: T * 2.5,
                walkable: false,
                category: 'building'
            },
            [this.TYPES.FENCE]: {
                name: '🪵 Ahşap Çit',
                icon: '🪵',
                width: T,
                height: T * 0.4,
                walkable: false,
                category: 'structure'
            },
            [this.TYPES.TORCH]: {
                name: '🔥 Meşale',
                icon: '🔥',
                width: T * 0.3,
                height: T * 0.8,
                walkable: true,
                category: 'decoration'
            },
            [this.TYPES.CRATE]: {
                name: '📦 Sandık',
                icon: '📦',
                width: T * 0.7,
                height: T * 0.7,
                walkable: false,
                category: 'structure'
            },
            [this.TYPES.FLAG]: {
                name: '🚩 Bayrak',
                icon: '🚩',
                width: T * 0.3,
                height: T * 1.2,
                walkable: true,
                category: 'decoration'
            },
            [this.TYPES.CORAL]: {
                name: '🪸 Mercan',
                icon: '🪸',
                width: T * 0.6,
                height: T * 0.5,
                walkable: true,
                category: 'nature'
            },
            [this.TYPES.BOAT]: {
                name: '⛵ Tekne',
                icon: '⛵',
                width: T * 1.5,
                height: T * 0.8,
                walkable: false,
                category: 'structure'
            },
            // --- Yeni biome nesneleri ---
            [this.TYPES.RAFT]: {
                name: '⛵ Sal',
                icon: '🛶',
                width: T * 1.5,
                height: T,
                walkable: true,
                category: 'structure',
                interactable: true
            },
            [this.TYPES.VOLCANO]: {
                name: '🌋 Volkan',
                icon: '🌋',
                width: T * 2.5,
                height: T * 2.5,
                walkable: false,
                category: 'nature'
            },
            [this.TYPES.LAVA_ROCK]: {
                name: '🪨 Lav Taşı',
                icon: '🪨',
                width: T * 0.7,
                height: T * 0.6,
                walkable: false,
                category: 'nature'
            },
            [this.TYPES.OBSIDIAN_PILLAR]: {
                name: '🏛️ Obsidyen Sütun',
                icon: '🏛️',
                width: T * 0.5,
                height: T * 1.5,
                walkable: false,
                category: 'structure'
            },
            [this.TYPES.IGLOO]: {
                name: '🏠 İglu',
                icon: '🏠',
                width: T * 2,
                height: T * 1.8,
                walkable: false,
                category: 'building'
            },
            [this.TYPES.PINE_TREE]: {
                name: '🌲 Çam Ağacı',
                icon: '🌲',
                width: T,
                height: T * 2,
                walkable: false,
                category: 'nature'
            },
            [this.TYPES.ICE_CRYSTAL]: {
                name: '💎 Buz Kristali',
                icon: '💎',
                width: T * 0.5,
                height: T * 0.8,
                walkable: true,
                category: 'decoration'
            },
            [this.TYPES.TREASURE]: {
                name: '💰 Hazine Sandığı',
                icon: '💰',
                width: T * 0.8,
                height: T * 0.7,
                walkable: false,
                category: 'structure'
            },
            [this.TYPES.SNOWMAN]: {
                name: '⛄ Kardan Adam',
                icon: '⛄',
                width: T * 0.7,
                height: T * 1.2,
                walkable: false,
                category: 'decoration'
            },
        };
    },

    // Nesne çiz (pixel art)
    drawObject(ctx, type, sx, sy) {
        const T = World.TILE_SIZE;

        switch (type) {
            case this.TYPES.PALM_TREE:
                this.drawPalmTree(ctx, sx, sy, T, false);
                break;
            case this.TYPES.PALM_SMALL:
                this.drawPalmTree(ctx, sx, sy, T, true);
                break;
            case this.TYPES.BUSH:
                this.drawBush(ctx, sx, sy, T);
                break;
            case this.TYPES.FLOWER:
                this.drawFlower(ctx, sx, sy, T);
                break;
            case this.TYPES.SHELL:
                this.drawShell(ctx, sx, sy, T);
                break;
            case this.TYPES.STARFISH:
                this.drawStarfish(ctx, sx, sy, T);
                break;
            case this.TYPES.PIER_H:
                this.drawPier(ctx, sx, sy, T, true);
                break;
            case this.TYPES.PIER_V:
                this.drawPier(ctx, sx, sy, T, false);
                break;
            case this.TYPES.BUNGALOW:
                this.drawBungalow(ctx, sx, sy, T, false);
                break;
            case this.TYPES.BUNGALOW_LARGE:
                this.drawBungalow(ctx, sx, sy, T, true);
                break;
            case this.TYPES.FENCE:
                this.drawFence(ctx, sx, sy, T);
                break;
            case this.TYPES.TORCH:
                this.drawTorch(ctx, sx, sy, T);
                break;
            case this.TYPES.CRATE:
                this.drawCrate(ctx, sx, sy, T);
                break;
            case this.TYPES.FLAG:
                this.drawFlag(ctx, sx, sy, T);
                break;
            case this.TYPES.CORAL:
                this.drawCoral(ctx, sx, sy, T);
                break;
            case this.TYPES.BOAT:
                this.drawBoat(ctx, sx, sy, T);
                break;
            case this.TYPES.RAFT:
                this.drawRaft(ctx, sx, sy, T);
                break;
            case this.TYPES.VOLCANO:
                this.drawVolcano(ctx, sx, sy, T);
                break;
            case this.TYPES.LAVA_ROCK:
                this.drawLavaRock(ctx, sx, sy, T);
                break;
            case this.TYPES.OBSIDIAN_PILLAR:
                this.drawObsidianPillar(ctx, sx, sy, T);
                break;
            case this.TYPES.IGLOO:
                this.drawIgloo(ctx, sx, sy, T);
                break;
            case this.TYPES.PINE_TREE:
                this.drawPineTree(ctx, sx, sy, T);
                break;
            case this.TYPES.ICE_CRYSTAL:
                this.drawIceCrystal(ctx, sx, sy, T);
                break;
            case this.TYPES.TREASURE:
                this.drawTreasure(ctx, sx, sy, T);
                break;
            case this.TYPES.SNOWMAN:
                this.drawSnowman(ctx, sx, sy, T);
                break;
        }
    },

    // === Pixel Art Çizim Fonksiyonları ===

    drawPalmTree(ctx, sx, sy, T, small) {
        const scale = small ? 0.6 : 1;
        const baseX = sx + T * 0.4;
        const baseY = sy + T * (small ? 0.4 : 0);

        // Gövde
        ctx.fillStyle = '#8B6914';
        const trunkW = 6 * scale;
        ctx.fillRect(baseX + T * 0.15, baseY + T * 0.6 * scale, trunkW, T * 1.2 * scale);

        // Gövde halkaları
        ctx.fillStyle = '#7a5a10';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(baseX + T * 0.13, baseY + T * (0.7 + i * 0.25) * scale, trunkW + 4, 2);
        }

        // Yapraklar
        const leafCX = baseX + T * 0.18;
        const leafCY = baseY + T * 0.5 * scale;

        // Hindistancevizi
        ctx.fillStyle = '#c87830';
        ctx.beginPath();
        ctx.arc(leafCX + 2, leafCY + 8, 3 * scale, 0, Math.PI * 2);
        ctx.arc(leafCX - 3, leafCY + 6, 3 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Yaprak katmanları
        const leafColors = ['#228B22', '#32CD32', '#006400'];
        for (let l = 0; l < 3; l++) {
            ctx.fillStyle = leafColors[l];
            const angle = l * 2.09 - 0.5;
            const leafLen = T * 0.8 * scale;
            const leafW = T * 0.35 * scale;

            ctx.save();
            ctx.translate(leafCX, leafCY);
            ctx.rotate(angle);

            // Yaprak şekli
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(leafLen * 0.5, -leafW, leafLen, -leafW * 0.3);
            ctx.quadraticCurveTo(leafLen * 0.5, leafW * 0.5, 0, 0);
            ctx.fill();

            // Yaprak damarları
            ctx.strokeStyle = '#1a6e1a';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(2, 0);
            ctx.lineTo(leafLen * 0.8, -leafW * 0.15);
            ctx.stroke();

            ctx.restore();
        }

        // Ek yapraklar (diğer tarafa)
        for (let l = 0; l < 2; l++) {
            ctx.fillStyle = l === 0 ? '#2E8B57' : '#3CB371';
            const angle = Math.PI + l * 1.5 - 0.3;
            const leafLen = T * 0.7 * scale;
            const leafW = T * 0.3 * scale;

            ctx.save();
            ctx.translate(leafCX, leafCY);
            ctx.rotate(angle);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(leafLen * 0.5, -leafW, leafLen, -leafW * 0.3);
            ctx.quadraticCurveTo(leafLen * 0.5, leafW * 0.5, 0, 0);
            ctx.fill();

            ctx.restore();
        }
    },

    drawBush(ctx, sx, sy, T) {
        const cx = sx + T * 0.45;
        const cy = sy + T * 0.6;

        // Gölge
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + T * 0.15, T * 0.35, T * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();

        // Alt yapraklar (koyu)
        ctx.fillStyle = '#1a6e1a';
        ctx.beginPath();
        ctx.ellipse(cx, cy, T * 0.38, T * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Üst yapraklar (açık)
        ctx.fillStyle = '#2d9a2d';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 4, T * 0.3, T * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Parlaklık
        ctx.fillStyle = 'rgba(120, 255, 120, 0.3)';
        ctx.beginPath();
        ctx.ellipse(cx - 4, cy - 8, T * 0.12, T * 0.08, -0.3, 0, Math.PI * 2);
        ctx.fill();
    },

    drawFlower(ctx, sx, sy, T) {
        const cx = sx + T * 0.25;
        const cy = sy + T * 0.25;

        // Sap
        ctx.fillStyle = '#228B22';
        ctx.fillRect(cx - 1, cy + 5, 2, 10);

        // Yapraklar
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.ellipse(cx - 4, cy + 8, 4, 2, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // Çiçek yaprakları
        const petalColors = ['#ff6b9d', '#ff4081', '#ff8a80'];
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = petalColors[i % petalColors.length];
            const angle = (i * Math.PI * 2) / 5;
            const px = cx + Math.cos(angle) * 5;
            const py = cy + Math.sin(angle) * 5;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Merkez
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
    },

    drawShell(ctx, sx, sy, T) {
        const cx = sx + T * 0.2;
        const cy = sy + T * 0.2;

        ctx.fillStyle = '#f5e6d0';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 7, 5, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Spiral deseni
        ctx.strokeStyle = '#d4a574';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx + 1, cy, 3, 0.5, Math.PI * 1.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 2, cy, 1.5, 0.3, Math.PI * 1.3);
        ctx.stroke();
    },

    drawStarfish(ctx, sx, sy, T) {
        const cx = sx + T * 0.2;
        const cy = sy + T * 0.2;

        ctx.fillStyle = '#ff7043';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const outerAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const innerAngle = outerAngle + Math.PI / 5;
            const ox = cx + Math.cos(outerAngle) * 7;
            const oy = cy + Math.sin(outerAngle) * 7;
            const ix = cx + Math.cos(innerAngle) * 3;
            const iy = cy + Math.sin(innerAngle) * 3;
            if (i === 0) ctx.moveTo(ox, oy);
            else ctx.lineTo(ox, oy);
            ctx.lineTo(ix, iy);
        }
        ctx.closePath();
        ctx.fill();

        // Merkez nokta
        ctx.fillStyle = '#ffab91';
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();
    },

    drawPier(ctx, sx, sy, T, horizontal) {
        // Ahşap platform
        ctx.fillStyle = '#a0764a';
        if (horizontal) {
            ctx.fillRect(sx, sy + T * 0.25, T, T * 0.5);
        } else {
            ctx.fillRect(sx + T * 0.25, sy, T * 0.5, T);
        }

        // Tahta çizgileri
        ctx.strokeStyle = '#8b6239';
        ctx.lineWidth = 1;
        if (horizontal) {
            for (let i = 0; i < 4; i++) {
                const y = sy + T * 0.3 + i * T * 0.1;
                ctx.beginPath();
                ctx.moveTo(sx, y);
                ctx.lineTo(sx + T, y);
                ctx.stroke();
            }
        } else {
            for (let i = 0; i < 4; i++) {
                const x = sx + T * 0.3 + i * T * 0.1;
                ctx.beginPath();
                ctx.moveTo(x, sy);
                ctx.lineTo(x, sy + T);
                ctx.stroke();
            }
        }

        // Destek direkleri
        ctx.fillStyle = '#6b4226';
        if (horizontal) {
            ctx.fillRect(sx + 4, sy + T * 0.7, 4, T * 0.3);
            ctx.fillRect(sx + T - 8, sy + T * 0.7, 4, T * 0.3);
        } else {
            ctx.fillRect(sx + T * 0.2, sy + 4, T * 0.15, 4);
            ctx.fillRect(sx + T * 0.2, sy + T - 8, T * 0.15, 4);
        }
    },

    drawBungalow(ctx, sx, sy, T, large) {
        const scale = large ? 1.25 : 1;
        const w = T * 1.8 * scale;
        const h = T * 1.5 * scale;
        const bx = sx + (T - w) / 2 + T * 0.3;
        const by = sy + T * 0.3;

        // Stilts (su ayakları)
        ctx.fillStyle = '#6b4226';
        ctx.fillRect(bx + w * 0.1, by + h * 0.7, 4, h * 0.4);
        ctx.fillRect(bx + w * 0.85, by + h * 0.7, 4, h * 0.4);
        ctx.fillRect(bx + w * 0.45, by + h * 0.7, 4, h * 0.4);

        // Su yansıması
        ctx.fillStyle = 'rgba(0, 100, 150, 0.2)';
        ctx.fillRect(bx + w * 0.05, by + h * 0.95, w * 0.9, h * 0.12);

        // Duvar
        ctx.fillStyle = '#d4a050';
        ctx.fillRect(bx, by + h * 0.35, w, h * 0.4);

        // Duvar dokusu (bambu)
        ctx.strokeStyle = '#c08830';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const lx = bx + w * (0.05 + i * 0.16);
            ctx.beginPath();
            ctx.moveTo(lx, by + h * 0.35);
            ctx.lineTo(lx, by + h * 0.75);
            ctx.stroke();
        }

        // Kapı
        ctx.fillStyle = '#8b5e3c';
        ctx.fillRect(bx + w * 0.4, by + h * 0.5, w * 0.2, h * 0.25);

        // Pencere
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(bx + w * 0.1, by + h * 0.42, w * 0.15, h * 0.15);
        ctx.fillRect(bx + w * 0.72, by + h * 0.42, w * 0.15, h * 0.15);

        // Pencere çerçeve
        ctx.strokeStyle = '#6b4226';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx + w * 0.1, by + h * 0.42, w * 0.15, h * 0.15);
        ctx.strokeRect(bx + w * 0.72, by + h * 0.42, w * 0.15, h * 0.15);

        // Çatı (hasır)
        ctx.fillStyle = '#c8a040';
        ctx.beginPath();
        ctx.moveTo(bx + w * 0.5, by);
        ctx.lineTo(bx - w * 0.08, by + h * 0.38);
        ctx.lineTo(bx + w * 1.08, by + h * 0.38);
        ctx.closePath();
        ctx.fill();

        // Çatı dokusu
        ctx.strokeStyle = '#a88030';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const ry = by + h * 0.08 + i * h * 0.08;
            const leftX = bx + w * 0.5 - (ry - by) * 0.7;
            const rightX = bx + w * 0.5 + (ry - by) * 0.7;
            ctx.beginPath();
            ctx.moveTo(leftX, ry);
            ctx.lineTo(rightX, ry);
            ctx.stroke();
        }

        if (large) {
            // Havuz (büyük bungalov)
            ctx.fillStyle = '#33bbdd';
            ctx.fillRect(bx + w * 0.7, by + h * 0.55, w * 0.35, h * 0.25);
            ctx.strokeStyle = '#87CEEB';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx + w * 0.7, by + h * 0.55, w * 0.35, h * 0.25);
        }
    },

    drawFence(ctx, sx, sy, T) {
        ctx.fillStyle = '#a0764a';
        // Yatay çubuklar
        ctx.fillRect(sx, sy + T * 0.25, T, 3);
        ctx.fillRect(sx, sy + T * 0.5, T, 3);

        // Dikey direkler
        ctx.fillStyle = '#8b6239';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(sx + i * T * 0.3 + 2, sy + T * 0.1, 4, T * 0.55);
            // Sivri uç
            ctx.beginPath();
            ctx.moveTo(sx + i * T * 0.3 + 2, sy + T * 0.1);
            ctx.lineTo(sx + i * T * 0.3 + 4, sy);
            ctx.lineTo(sx + i * T * 0.3 + 6, sy + T * 0.1);
            ctx.closePath();
            ctx.fill();
        }
    },

    drawTorch(ctx, sx, sy, T) {
        const cx = sx + T * 0.15;

        // Direk
        ctx.fillStyle = '#6b4226';
        ctx.fillRect(cx - 2, sy + T * 0.3, 4, T * 0.6);

        // Alev
        const flicker = Math.random() * 3;
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.ellipse(cx, sy + T * 0.25, 5, 7 + flicker, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.ellipse(cx, sy + T * 0.28, 3, 4 + flicker * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Işık halkası
        ctx.fillStyle = 'rgba(255, 200, 50, 0.08)';
        ctx.beginPath();
        ctx.arc(cx, sy + T * 0.3, T * 0.5, 0, Math.PI * 2);
        ctx.fill();
    },

    drawCrate(ctx, sx, sy, T) {
        const s = T * 0.6;
        const cx = sx + (T - s) / 2;
        const cy = sy + (T - s) / 2 + 4;

        // Gölge
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(cx + 3, cy + s - 2, s, 4);

        // Ana kutu
        ctx.fillStyle = '#b8853a';
        ctx.fillRect(cx, cy, s, s);

        // Kenar karartma
        ctx.fillStyle = '#9a6e2c';
        ctx.fillRect(cx, cy + s - 3, s, 3); // alt
        ctx.fillRect(cx + s - 3, cy, 3, s); // sağ

        // Tahta çizgileri
        ctx.strokeStyle = '#8b6230';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx, cy, s, s);
        ctx.beginPath();
        ctx.moveTo(cx, cy + s / 2);
        ctx.lineTo(cx + s, cy + s / 2);
        ctx.stroke();

        // Çapraz metal bant
        ctx.strokeStyle = '#777';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 2, cy + 2);
        ctx.lineTo(cx + s - 2, cy + s - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + s - 2, cy + 2);
        ctx.lineTo(cx + 2, cy + s - 2);
        ctx.stroke();
    },

    drawFlag(ctx, sx, sy, T) {
        const cx = sx + T * 0.15;

        // Direk
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(cx - 1, sy + T * 0.1, 3, T * 0.85);

        // Bayrak
        const wave = Math.sin(Date.now() * 0.003) * 2;
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(cx + 2, sy + T * 0.12);
        ctx.lineTo(cx + 18 + wave, sy + T * 0.2);
        ctx.lineTo(cx + 16 + wave, sy + T * 0.35);
        ctx.lineTo(cx + 2, sy + T * 0.4);
        ctx.closePath();
        ctx.fill();

        // Bayrak üzerindeki yıldız
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx + 10 + wave * 0.5, sy + T * 0.27, 2, 0, Math.PI * 2);
        ctx.fill();
    },

    drawCoral(ctx, sx, sy, T) {
        const cx = sx + T * 0.3;
        const cy = sy + T * 0.35;

        // Mercan dalları
        const colors = ['#ff6b6b', '#ff8a80', '#e57373'];
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = colors[i];
            const angle = -Math.PI / 2 + (i - 1) * 0.6;
            ctx.save();
            ctx.translate(cx, cy + 8);
            ctx.rotate(angle);
            ctx.fillRect(-2, -15, 4, 15);
            // Dallanma
            ctx.fillRect(-6, -15, 4, 8);
            ctx.fillRect(2, -12, 4, 6);
            ctx.restore();
        }
    },

    drawBoat(ctx, sx, sy, T) {
        const cx = sx + T * 0.4;
        const cy = sy + T * 0.3;

        // Tekne gövdesi
        ctx.fillStyle = '#8b5a2b';
        ctx.beginPath();
        ctx.moveTo(cx - T * 0.4, cy + 8);
        ctx.lineTo(cx + T * 0.55, cy + 8);
        ctx.lineTo(cx + T * 0.7, cy);
        ctx.lineTo(cx + T * 0.55, cy + 18);
        ctx.lineTo(cx - T * 0.35, cy + 18);
        ctx.closePath();
        ctx.fill();

        // İç kısım
        ctx.fillStyle = '#a0764a';
        ctx.fillRect(cx - T * 0.3, cy + 10, T * 0.7, 6);

        // Direk
        ctx.fillStyle = '#6b4226';
        ctx.fillRect(cx, cy - 15, 2, 25);

        // Yelken
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath();
        ctx.moveTo(cx + 3, cy - 13);
        ctx.lineTo(cx + 20, cy);
        ctx.lineTo(cx + 3, cy + 5);
        ctx.closePath();
        ctx.fill();
    },

    // === Yeni Biome Nesneleri ===

    drawRaft(ctx, sx, sy, T) {
        const bob = Math.sin(Date.now() * 0.002) * 2;
        const ry = sy + T * 0.35 + bob;

        // Kütükler
        ctx.fillStyle = '#8b6239';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(sx + 2, ry + i * T * 0.15, T * 1.2, T * 0.1);
        }
        // Bağlar
        ctx.fillStyle = '#6b4226';
        ctx.fillRect(sx + T * 0.2, ry - 2, 4, T * 0.6);
        ctx.fillRect(sx + T * 0.8, ry - 2, 4, T * 0.6);
        // Yelken direği
        ctx.fillStyle = '#5a3a1a';
        ctx.fillRect(sx + T * 0.5, ry - T * 0.6, 3, T * 0.7);
        // Yelken
        ctx.fillStyle = '#f5e0c0';
        ctx.beginPath();
        ctx.moveTo(sx + T * 0.53, ry - T * 0.55);
        ctx.lineTo(sx + T * 1.0, ry - T * 0.2);
        ctx.lineTo(sx + T * 0.53, ry + T * 0.05);
        ctx.closePath();
        ctx.fill();
        // E etkileşim ipucu
        ctx.fillStyle = 'rgba(255,215,0,0.7)';
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillText('E', sx + T * 0.45, ry - T * 0.7);
    },

    drawVolcano(ctx, sx, sy, T) {
        const cx = sx + T * 1.25;
        const baseY = sy + T * 2;
        // Dağ gövdesi
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.moveTo(cx - T * 1.2, baseY);
        ctx.lineTo(cx - T * 0.35, sy + T * 0.3);
        ctx.lineTo(cx + T * 0.35, sy + T * 0.3);
        ctx.lineTo(cx + T * 1.2, baseY);
        ctx.closePath();
        ctx.fill();
        // Kar çizgileri
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const ly = sy + T * 0.8 + i * T * 0.25;
            ctx.beginPath();
            ctx.moveTo(cx - T * 0.6 - i * T * 0.12, ly);
            ctx.lineTo(cx + T * 0.6 + i * T * 0.12, ly);
            ctx.stroke();
        }
        // Krater
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.ellipse(cx, sy + T * 0.35, T * 0.3, T * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        // Lav
        const flicker = Math.sin(Date.now() * 0.005) * 3;
        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.ellipse(cx, sy + T * 0.32, T * 0.18, T * 0.06 + flicker * 0.01, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.ellipse(cx, sy + T * 0.33, T * 0.1, T * 0.04, 0, 0, Math.PI * 2);
        ctx.fill();
        // Duman
        ctx.fillStyle = 'rgba(100,100,100,0.3)';
        for (let i = 0; i < 3; i++) {
            const dx = Math.sin(Date.now() * 0.001 + i * 2) * 5;
            ctx.beginPath();
            ctx.arc(cx + dx, sy + T * 0.15 - i * 8, 6 + i * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    drawLavaRock(ctx, sx, sy, T) {
        const cx = sx + T * 0.35;
        const cy = sy + T * 0.35;
        // Taş
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy + 8);
        ctx.lineTo(cx - 5, cy - 8);
        ctx.lineTo(cx + 8, cy - 6);
        ctx.lineTo(cx + 10, cy + 5);
        ctx.lineTo(cx + 3, cy + 10);
        ctx.closePath();
        ctx.fill();
        // Lav çizgisi
        ctx.strokeStyle = '#ff4400';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy - 4);
        ctx.lineTo(cx + 2, cy + 3);
        ctx.lineTo(cx + 6, cy - 1);
        ctx.stroke();
        // Parıltı
        ctx.fillStyle = 'rgba(255,100,0,0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, T * 0.3, 0, Math.PI * 2);
        ctx.fill();
    },

    drawObsidianPillar(ctx, sx, sy, T) {
        const cx = sx + T * 0.25;
        // Sütun
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(cx - 6, sy + T * 0.1, 12, T * 0.85);
        // Parlatma
        ctx.fillStyle = 'rgba(100,100,200,0.2)';
        ctx.fillRect(cx - 4, sy + T * 0.15, 3, T * 0.75);
        // Üst detay
        ctx.fillStyle = '#2a2a4e';
        ctx.fillRect(cx - 8, sy + T * 0.08, 16, 4);
        ctx.fillRect(cx - 8, sy + T * 0.9, 16, 4);
        // Rune
        ctx.fillStyle = '#6644aa';
        ctx.fillRect(cx - 2, sy + T * 0.35, 4, 4);
        ctx.fillRect(cx - 2, sy + T * 0.55, 4, 4);
    },

    drawIgloo(ctx, sx, sy, T) {
        const cx = sx + T;
        const cy = sy + T * 0.9;
        // Kubbe
        ctx.fillStyle = '#e8eef5';
        ctx.beginPath();
        ctx.arc(cx, cy, T * 0.7, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        // Blok çizgileri
        ctx.strokeStyle = '#bbc8d8';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const ry = cy - T * 0.1 - i * T * 0.15;
            const rw = T * 0.65 - i * T * 0.12;
            ctx.beginPath();
            ctx.moveTo(cx - rw, ry);
            ctx.lineTo(cx + rw, ry);
            ctx.stroke();
        }
        // Girişi
        ctx.fillStyle = '#445566';
        ctx.beginPath();
        ctx.arc(cx, cy, T * 0.22, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        // Buz parıltısı
        ctx.fillStyle = 'rgba(200,230,255,0.3)';
        ctx.beginPath();
        ctx.ellipse(cx - T * 0.2, cy - T * 0.35, T * 0.15, T * 0.08, -0.3, 0, Math.PI * 2);
        ctx.fill();
    },

    drawPineTree(ctx, sx, sy, T) {
        const cx = sx + T * 0.5;
        const baseY = sy + T * 1.6;
        // Gövde
        ctx.fillStyle = '#6b4226';
        ctx.fillRect(cx - 3, baseY - T * 0.3, 6, T * 0.5);
        // Yaprak katmanları (üçgenler)
        const layers = [
            { y: baseY - T * 0.3, w: T * 0.5, h: T * 0.45 },
            { y: baseY - T * 0.65, w: T * 0.4, h: T * 0.4 },
            { y: baseY - T * 0.95, w: T * 0.3, h: T * 0.35 },
        ];
        const greens = ['#1a5c1a', '#227722', '#2d8b2d'];
        layers.forEach((l, i) => {
            ctx.fillStyle = greens[i];
            ctx.beginPath();
            ctx.moveTo(cx, l.y - l.h);
            ctx.lineTo(cx - l.w, l.y);
            ctx.lineTo(cx + l.w, l.y);
            ctx.closePath();
            ctx.fill();
        });
        // Kar
        ctx.fillStyle = '#e8eef5';
        layers.forEach((l, i) => {
            ctx.beginPath();
            ctx.moveTo(cx, l.y - l.h);
            ctx.lineTo(cx - l.w * 0.4, l.y - l.h * 0.5);
            ctx.lineTo(cx + l.w * 0.4, l.y - l.h * 0.5);
            ctx.closePath();
            ctx.fill();
        });
    },

    drawIceCrystal(ctx, sx, sy, T) {
        const cx = sx + T * 0.25;
        const cy = sy + T * 0.4;
        // Ana kristal
        ctx.fillStyle = '#88ccff';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 12);
        ctx.lineTo(cx + 7, cy - 3);
        ctx.lineTo(cx + 5, cy + 8);
        ctx.lineTo(cx - 5, cy + 8);
        ctx.lineTo(cx - 7, cy - 3);
        ctx.closePath();
        ctx.fill();
        // İç parıltı
        ctx.fillStyle = 'rgba(200,240,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 8);
        ctx.lineTo(cx + 3, cy);
        ctx.lineTo(cx - 3, cy);
        ctx.closePath();
        ctx.fill();
        // Yansıma
        ctx.fillStyle = 'rgba(150,220,255,0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, T * 0.25, 0, Math.PI * 2);
        ctx.fill();
    },

    drawTreasure(ctx, sx, sy, T) {
        const s = T * 0.65;
        const cx = sx + (T - s) / 2;
        const cy = sy + T * 0.25;
        // Gölge
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(cx + 3, cy + s - 1, s, 4);
        // Sandık
        ctx.fillStyle = '#c8952a';
        ctx.fillRect(cx, cy, s, s);
        // Kapaklı üst
        ctx.fillStyle = '#daa530';
        ctx.fillRect(cx - 2, cy, s + 4, s * 0.35);
        // Metal bantlar
        ctx.fillStyle = '#888';
        ctx.fillRect(cx, cy + s * 0.33, s, 3);
        ctx.fillRect(cx + s * 0.45, cy, 3, s);
        // Kilit
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(cx + s * 0.5, cy + s * 0.35, 4, 0, Math.PI * 2);
        ctx.fill();
        // Parıltı
        ctx.fillStyle = 'rgba(255,215,0,0.2)';
        ctx.beginPath();
        ctx.arc(cx + s * 0.5, cy + s * 0.5, T * 0.4, 0, Math.PI * 2);
        ctx.fill();
    },

    drawSnowman(ctx, sx, sy, T) {
        const cx = sx + T * 0.35;
        // Alt top
        ctx.fillStyle = '#f0f4fa';
        ctx.beginPath();
        ctx.arc(cx, sy + T * 0.75, T * 0.25, 0, Math.PI * 2);
        ctx.fill();
        // Üst top
        ctx.beginPath();
        ctx.arc(cx, sy + T * 0.42, T * 0.18, 0, Math.PI * 2);
        ctx.fill();
        // Kafa
        ctx.beginPath();
        ctx.arc(cx, sy + T * 0.18, T * 0.13, 0, Math.PI * 2);
        ctx.fill();
        // Gözler
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(cx - 3, sy + T * 0.15, 1.5, 0, Math.PI * 2);
        ctx.arc(cx + 3, sy + T * 0.15, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Havuç burun
        ctx.fillStyle = '#ff7043';
        ctx.beginPath();
        ctx.moveTo(cx, sy + T * 0.18);
        ctx.lineTo(cx + 7, sy + T * 0.2);
        ctx.lineTo(cx, sy + T * 0.22);
        ctx.closePath();
        ctx.fill();
        // Şapka
        ctx.fillStyle = '#222';
        ctx.fillRect(cx - T * 0.12, sy + T * 0.02, T * 0.24, T * 0.08);
        ctx.fillRect(cx - T * 0.08, sy - T * 0.06, T * 0.16, T * 0.1);
        // Düğmeler
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(cx, sy + T * 0.35, 2, 0, Math.PI * 2);
        ctx.arc(cx, sy + T * 0.45, 2, 0, Math.PI * 2);
        ctx.fill();
    },
};
