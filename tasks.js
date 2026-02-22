/* ========================================
   Tasks Module - Multi-Island Quest System
   Her ada için ayrı görevler, ödüller
   ======================================== */

const Tasks = {
    currentTaskIndex: 0,
    score: 0,
    buildingsPlaced: 0,

    // Ada başına görev listeleri
    islandTasks: {
        // === ADA 0: CENNET ADASI ===
        0: [
            {
                id: 'explore', title: 'Adayı Keşfet', description: '20 farklı kareyi keşfet',
                icon: '🗺️', target: 20, progress: 0, completed: false,
                reward: {
                    objects: ['palm_tree', 'palm_small', 'bush'],
                    message: '🌴 Palmiye ağaçları ve çalılar açıldı!',
                    stones: 5,
                    autoPlace: [
                        { type: 'palm_tree', x: 12, y: 8 }, { type: 'palm_tree', x: 16, y: 7 },
                        { type: 'palm_tree', x: 10, y: 12 }, { type: 'palm_small', x: 18, y: 10 },
                        { type: 'palm_small', x: 11, y: 14 }, { type: 'bush', x: 14, y: 13 },
                        { type: 'bush', x: 13, y: 9 }, { type: 'bush', x: 17, y: 11 },
                    ]
                }
            },
            {
                id: 'collect_sand', title: 'Sahili Güzelleştir', description: 'Kum üzerinde 30 adım at',
                icon: '🏖️', target: 30, progress: 0, completed: false, checkTile: 3,
                reward: {
                    objects: ['flower', 'shell', 'starfish', 'coral'],
                    message: '🏖️ Sahil dekorasyonları açıldı!',
                    stones: 5,
                    autoPlace: [
                        { type: 'flower', x: 9, y: 13 }, { type: 'flower', x: 17, y: 13 },
                        { type: 'shell', x: 10, y: 14 }, { type: 'starfish', x: 12, y: 15 },
                        { type: 'coral', x: 8, y: 14 },
                    ]
                }
            },
            {
                id: 'build_pier', title: 'İskele İnşa Et', description: 'Sahilde 40 adım at',
                icon: '🌉', target: 40, progress: 0, completed: false, checkTile: 3,
                reward: {
                    objects: ['pier_h', 'pier_v', 'flag'],
                    message: '🌉 İskele inşa edildi!',
                    stones: 8,
                    autoPlace: [
                        { type: 'pier_h', x: 20, y: 11 }, { type: 'pier_h', x: 21, y: 11 },
                        { type: 'pier_h', x: 22, y: 11 }, { type: 'pier_h', x: 23, y: 11 },
                        { type: 'flag', x: 23, y: 10 },
                    ],
                    makeTilesWalkable: [
                        { x: 20, y: 11 }, { x: 21, y: 11 }, { x: 22, y: 11 }, { x: 23, y: 11 }
                    ]
                }
            },
            {
                id: 'build_bungalow', title: 'Bungalov İnşa Et', description: '60 adım daha at',
                icon: '🏠', target: 60, progress: 0, completed: false,
                reward: {
                    objects: ['bungalow', 'torch', 'crate'],
                    message: '🏠 Bungalov inşa edildi!',
                    stones: 10,
                    autoPlace: [
                        { type: 'bungalow', x: 24, y: 10 }, { type: 'torch', x: 23, y: 9 },
                        { type: 'torch', x: 23, y: 12 }, { type: 'crate', x: 19, y: 10 },
                    ],
                    makeTilesWalkable: [
                        { x: 24, y: 10 }, { x: 24, y: 11 }, { x: 25, y: 10 }, { x: 25, y: 11 }
                    ]
                }
            },
            {
                id: 'resort', title: 'Tatil Köyü Kur', description: '50 farklı kareyi keşfet',
                icon: '🏘️', target: 50, progress: 0, completed: false,
                reward: {
                    objects: ['bungalow_large', 'fence', 'boat', 'raft'],
                    message: '🏘️ Tatil köyü tamamlandı! Sala hazır!',
                    stones: 15,
                    autoPlace: [
                        { type: 'bungalow_large', x: 26, y: 9 },
                        { type: 'fence', x: 11, y: 15 }, { type: 'fence', x: 12, y: 15 },
                        { type: 'fence', x: 13, y: 15 }, { type: 'fence', x: 14, y: 15 },
                        { type: 'boat', x: 7, y: 14 },
                        { type: 'raft', x: 23, y: 14 },
                    ],
                    makeTilesWalkable: [
                        { x: 26, y: 9 }, { x: 26, y: 10 }, { x: 27, y: 9 }, { x: 27, y: 10 },
                        { x: 23, y: 14 }, { x: 24, y: 14 },
                    ]
                }
            },
        ],

        // === ADA 1: VOLKAN ADASI ===
        1: [
            {
                id: 'v_explore', title: 'Volkanik Arazide Keşif', description: '25 kareyi keşfet',
                icon: '🌋', target: 25, progress: 0, completed: false,
                reward: {
                    objects: ['lava_rock', 'obsidian_pillar'],
                    message: '🪨 Lav taşları ve obsidyen açıldı!',
                    stones: 8,
                    autoPlace: [
                        { type: 'lava_rock', x: 12, y: 8 }, { type: 'lava_rock', x: 16, y: 9 },
                        { type: 'lava_rock', x: 18, y: 12 }, { type: 'lava_rock', x: 10, y: 13 },
                        { type: 'obsidian_pillar', x: 13, y: 7 }, { type: 'obsidian_pillar', x: 17, y: 7 },
                    ]
                }
            },
            {
                id: 'v_volcano', title: 'Volkanı İncele', description: 'Volkanın etrafını keşfet (35 kare)',
                icon: '🔥', target: 35, progress: 0, completed: false,
                reward: {
                    objects: ['volcano', 'torch'],
                    message: '🌋 Volkan haritalandı!',
                    stones: 10,
                    autoPlace: [
                        { type: 'volcano', x: 13, y: 9 },
                        { type: 'torch', x: 12, y: 12 }, { type: 'torch', x: 18, y: 12 },
                    ]
                }
            },
            {
                id: 'v_treasure', title: 'Hazineyi Bul', description: '50 adım at ve hazineyi keşfet',
                icon: '💰', target: 50, progress: 0, completed: false,
                reward: {
                    objects: ['treasure', 'fence', 'raft'],
                    message: '💰 Hazine bulundu! Pusula kuzeyi gösteriyor!',
                    stones: 15,
                    autoPlace: [
                        { type: 'treasure', x: 15, y: 14 },
                        { type: 'fence', x: 12, y: 14 }, { type: 'fence', x: 13, y: 14 },
                        { type: 'raft', x: 23, y: 14 },
                    ],
                    makeTilesWalkable: [
                        { x: 23, y: 14 }, { x: 24, y: 14 },
                    ]
                }
            },
        ],

        // === ADA 2: BUZUL ADASI ===
        2: [
            {
                id: 'w_explore', title: 'Karla Kaplı Arazide Keşif', description: '25 kareyi keşfet',
                icon: '❄️', target: 25, progress: 0, completed: false,
                reward: {
                    objects: ['pine_tree', 'ice_crystal'],
                    message: '🌲 Çam ağaçları ve buz kristalleri açıldı!',
                    stones: 8,
                    autoPlace: [
                        { type: 'pine_tree', x: 12, y: 8 }, { type: 'pine_tree', x: 16, y: 7 },
                        { type: 'pine_tree', x: 10, y: 12 }, { type: 'pine_tree', x: 18, y: 10 },
                        { type: 'ice_crystal', x: 14, y: 9 }, { type: 'ice_crystal', x: 17, y: 13 },
                    ]
                }
            },
            {
                id: 'w_igloo', title: 'İglu İnşa Et', description: '40 adım at',
                icon: '🏠', target: 40, progress: 0, completed: false,
                reward: {
                    objects: ['igloo', 'snowman', 'fence'],
                    message: '🏠 İglu inşa edildi! Sıcacık!',
                    stones: 12,
                    autoPlace: [
                        { type: 'igloo', x: 14, y: 10 },
                        { type: 'snowman', x: 12, y: 11 }, { type: 'snowman', x: 16, y: 12 },
                        { type: 'fence', x: 12, y: 13 }, { type: 'fence', x: 13, y: 13 },
                    ]
                }
            },
            {
                id: 'w_temple', title: 'Antik Tapınağı Keşfet', description: '60 kareyi keşfet',
                icon: '🏛️', target: 60, progress: 0, completed: false,
                reward: {
                    objects: ['treasure', 'obsidian_pillar', 'flag'],
                    message: '🏛️ Antik tapınak buzların altından yükseldi!',
                    stones: 20,
                    autoPlace: [
                        { type: 'obsidian_pillar', x: 13, y: 8 }, { type: 'obsidian_pillar', x: 17, y: 8 },
                        { type: 'obsidian_pillar', x: 13, y: 12 }, { type: 'obsidian_pillar', x: 17, y: 12 },
                        { type: 'treasure', x: 15, y: 10 },
                        { type: 'flag', x: 15, y: 8 },
                        { type: 'torch', x: 14, y: 8 }, { type: 'torch', x: 16, y: 8 },
                    ]
                }
            },
        ],
    },

    // Aktif görev listesi (mevcut ada)
    taskList: [],
    unlockedObjects: new Set(),

    init() {
        this.loadIslandTasks(0);
    },

    loadIslandTasks(islandIndex) {
        this.taskList = this.islandTasks[islandIndex] || [];
        this.currentTaskIndex = 0;

        // Tamamlanmış görevlerin indeksini bul
        for (let i = 0; i < this.taskList.length; i++) {
            if (!this.taskList[i].completed) {
                this.currentTaskIndex = i;
                break;
            }
            if (i === this.taskList.length - 1 && this.taskList[i].completed) {
                this.currentTaskIndex = this.taskList.length;
            }
        }
    },

    update() {
        if (this.currentTaskIndex >= this.taskList.length) return;

        const task = this.taskList[this.currentTaskIndex];
        if (!task || task.completed) return;

        // Görev ilerleme kontrolü
        const taskId = task.id;

        if (taskId === 'explore' || taskId === 'v_explore' || taskId === 'w_explore' ||
            taskId === 'resort' || taskId === 'v_volcano' || taskId === 'w_temple') {
            task.progress = Player.tilesExplored.size;
        } else if (task.checkTile !== undefined) {
            if (World.getTileAt(Player.getTileX(), Player.getTileY()) === task.checkTile) {
                task.progress = Math.min(task.progress + 0.02, task.target);
            }
        } else {
            // Genel adım sayacı
            task.progress = Math.min(task.progress + 0.01, task.target);
        }

        if (task.progress >= task.target) {
            this.completeTask(task);
        }
    },

    completeTask(task) {
        task.completed = true;
        this.score += 100;

        if (task.reward.objects) {
            task.reward.objects.forEach(obj => this.unlockedObjects.add(obj));
        }
        if (task.reward.stones) {
            World.stones += task.reward.stones;
        }
        if (task.reward.autoPlace) {
            task.reward.autoPlace.forEach(obj => {
                World.placeObject({ type: obj.type, x: obj.x, y: obj.y });
                this.buildingsPlaced++;
            });
        }
        if (task.reward.makeTilesWalkable) {
            task.reward.makeTilesWalkable.forEach(t => {
                World.setTile(t.x, t.y, World.TILES.SAND);
            });
        }

        UI.showNotification(task.icon, task.reward.message);

        // Hikaye tetikle
        Story.onTaskComplete(task.id);

        this.currentTaskIndex++;

        // Tüm ada görevleri tamamlandı mı?
        if (this.currentTaskIndex >= this.taskList.length) {
            Story.onIslandAllTasks(World.currentIslandIndex);
        }
    },

    getCurrentTask() {
        if (this.currentTaskIndex >= this.taskList.length) return null;
        return this.taskList[this.currentTaskIndex];
    },

    allCompleted() {
        return this.currentTaskIndex >= this.taskList.length;
    },

    // Tüm adalar tamamlandı mı
    allIslandsCompleted() {
        for (let i = 0; i < 3; i++) {
            const tasks = this.islandTasks[i];
            if (tasks.some(t => !t.completed)) return false;
        }
        return true;
    }
};
