/* ========================================
   Story Module — Hikaye ve diyalog sistemi
   RPG tarzı diyalog kutuları, bölümler
   ======================================== */

const Story = {
    // Diyalog durumu
    active: false,
    currentDialogues: [],
    currentIndex: 0,
    typingText: '',
    typingIndex: 0,
    typingTimer: 0,
    typingSpeed: 35, // ms per char
    waitingForInput: false,

    // Geçmiş gösterilmiş hikayeler
    shownEvents: new Set(),

    // === Hikaye Verileri ===
    chapters: {
        // === ADA 1 — CENNET ADASI ===
        island_0_intro: {
            trigger: 'island_arrival',
            island: 0,
            dialogues: [
                { speaker: '🧭', name: 'Anlatıcı', text: 'Şiddetli bir fırtına, gemiyi parçaladı...' },
                { speaker: '👷', name: 'Kaşif', text: 'Neredeyim? Bu tropik ada... Burada hayatta kalmalıyım!' },
                { speaker: '🧭', name: 'Anlatıcı', text: 'Kayıp denizci, kendini gizemli bir takımadanın ilk adasında bulur.' },
                { speaker: '👷', name: 'Kaşif', text: 'Önce etrafı keşfedeyim. Belki hayatta kalmama yardımcı olacak şeyler bulurum.' },
                { speaker: '🗺️', name: 'İpucu', text: 'WASD ile hareket et, adayı keşfet! Görevleri tamamla!' },
            ]
        },
        island_0_task1: {
            trigger: 'task_complete',
            taskId: 'explore',
            dialogues: [
                { speaker: '👷', name: 'Kaşif', text: 'Bu ada muhteşem! Palmiye ağaçları, beyaz kumsal...' },
                { speaker: '🧭', name: 'Anlatıcı', text: 'Adanın doğal güzellikleri gözler önüne serildi.' },
            ]
        },
        island_0_task3: {
            trigger: 'task_complete',
            taskId: 'build_pier',
            dialogues: [
                { speaker: '👷', name: 'Kaşif', text: 'İskeleyi inşa ettim! Artık denize açılabilirim.' },
                { speaker: '🧭', name: 'Anlatıcı', text: 'İskele kenarında eski bir harita parçası bulundu...' },
                { speaker: '👷', name: 'Kaşif', text: 'Bu harita... Yakınlarda başka adalar var gibi görünüyor!' },
            ]
        },
        island_0_complete: {
            trigger: 'task_complete',
            taskId: 'resort',
            dialogues: [
                { speaker: '🧭', name: 'Anlatıcı', text: 'Cennet Adası bir tatil köyüne dönüştü! Ama macera bitmedi...' },
                { speaker: '👷', name: 'Kaşif', text: 'Haritadaki ikinci ada... Bir volkanın olduğu yer. Oraya gitmeliyim!' },
                { speaker: '⛵', name: 'İpucu', text: 'Sahildeki salaya yaklaş ve E tuşuna bas!' },
            ]
        },

        // === ADA 2 — VOLKAN ADASI ===
        island_1_intro: {
            trigger: 'island_arrival',
            island: 1,
            dialogues: [
                { speaker: '🧭', name: 'Anlatıcı', text: 'Sala, dalgaları yararak volkanik adaya ulaştı...' },
                { speaker: '👷', name: 'Kaşif', text: 'İnanılmaz! Aktif bir volkan! Dikkatli olmalıyım.' },
                { speaker: '🌋', name: 'Ada Ruhu', text: 'Hoş geldin, gezgin. Bu ada ateşle yoğrulmuş...' },
                { speaker: '🌋', name: 'Ada Ruhu', text: 'Lav arasında saklı bir hazine var. Onu bulabilir misin?' },
                { speaker: '🗺️', name: 'İpucu', text: 'Volkan Adası\'nı keşfet! B tuşu ile inşaat moduna geç!' },
            ]
        },
        island_1_complete: {
            trigger: 'island_all_tasks',
            island: 1,
            dialogues: [
                { speaker: '🌋', name: 'Ada Ruhu', text: 'Ateşin gücünü kanıtladın! Hazineyi hak ediyorsun.' },
                { speaker: '👷', name: 'Kaşif', text: 'Bu altın pusula... Kuzeye, buzulların olduğu bir adaya işaret ediyor!' },
                { speaker: '🧭', name: 'Anlatıcı', text: 'Son ada, tüm sırları açığa çıkaracak...' },
                { speaker: '⛵', name: 'İpucu', text: 'Salaya bin ve son adaya yolculuk et!' },
            ]
        },

        // === ADA 3 — BUZUL ADASI ===
        island_2_intro: {
            trigger: 'island_arrival',
            island: 2,
            dialogues: [
                { speaker: '🧭', name: 'Anlatıcı', text: 'Buz gibi rüzgarlar, karla kaplı bir adaya ulaştılar...' },
                { speaker: '👷', name: 'Kaşif', text: 'Brrr! Burası dondurucu soğuk! Ama güzel bir yer...' },
                { speaker: '❄️', name: 'Buzul Ruhu', text: 'Son gelen sen ol, ilk giden de sen ol...' },
                { speaker: '❄️', name: 'Buzul Ruhu', text: 'Buzların altında antik bir tapınak yatıyor. Onu ortaya çıkar!' },
            ]
        },
        island_2_complete: {
            trigger: 'island_all_tasks',
            island: 2,
            dialogues: [
                { speaker: '🧭', name: 'Anlatıcı', text: 'Antik tapınak buzların arasından yükseldi...' },
                { speaker: '❄️', name: 'Buzul Ruhu', text: 'Tebrikler gezgin! Üç adanın sırrını çözdün.' },
                { speaker: '🧭', name: 'Anlatıcı', text: 'Bu adalar, eski bir medeniyetin kalıntılarıymış.' },
                { speaker: '👷', name: 'Kaşif', text: 'Üç adayı da inşa ettim! Bu, benim yeni evim olacak.' },
                { speaker: '🏆', name: 'Tebrikler!', text: '🎉 Tüm adalar tamamlandı! Sen gerçek bir BullDozer\'sın!' },
            ]
        },
    },

    init() {
        // E tuşu ve Space/Enter diyalog ilerleme
        window.addEventListener('keydown', (e) => {
            if (this.active && this.waitingForInput) {
                if (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'e') {
                    e.preventDefault();
                    this.advanceDialogue();
                }
            }
        });
    },

    // Ada varışında hikaye tetikle
    onIslandArrival(islandIndex) {
        const key = `island_${islandIndex}_intro`;
        if (this.chapters[key] && !this.shownEvents.has(key)) {
            setTimeout(() => this.startChapter(key), 1200);
        }
    },

    // Görev tamamlandığında hikaye tetikle
    onTaskComplete(taskId) {
        for (const [key, chapter] of Object.entries(this.chapters)) {
            if (chapter.trigger === 'task_complete' && chapter.taskId === taskId && !this.shownEvents.has(key)) {
                setTimeout(() => this.startChapter(key), 800);
                return;
            }
        }
    },

    // Ada tüm görevleri tamamlandığında
    onIslandAllTasks(islandIndex) {
        const key = `island_${islandIndex}_complete`;
        if (this.chapters[key] && !this.shownEvents.has(key)) {
            setTimeout(() => this.startChapter(key), 1000);
        }
    },

    // Bölüm başlat
    startChapter(key) {
        const chapter = this.chapters[key];
        if (!chapter) return;

        this.shownEvents.add(key);
        this.active = true;
        this.currentDialogues = chapter.dialogues;
        this.currentIndex = 0;
        this.startTyping();
    },

    startTyping() {
        const dialogue = this.currentDialogues[this.currentIndex];
        if (!dialogue) { this.endDialogue(); return; }

        this.typingText = '';
        this.typingIndex = 0;
        this.waitingForInput = false;
        this.typingTimer = 0;
    },

    update(dt) {
        if (!this.active) return;

        const dialogue = this.currentDialogues[this.currentIndex];
        if (!dialogue) return;

        if (this.typingIndex < dialogue.text.length) {
            this.typingTimer += dt;
            if (this.typingTimer >= this.typingSpeed) {
                this.typingText += dialogue.text[this.typingIndex];
                this.typingIndex++;
                this.typingTimer = 0;
            }
        } else {
            this.waitingForInput = true;
        }
    },

    advanceDialogue() {
        const dialogue = this.currentDialogues[this.currentIndex];
        if (!dialogue) return;

        // Henüz yazma bitmemişse, tamamla
        if (this.typingIndex < dialogue.text.length) {
            this.typingText = dialogue.text;
            this.typingIndex = dialogue.text.length;
            this.waitingForInput = true;
            return;
        }

        // Sonraki diyalog
        this.currentIndex++;
        if (this.currentIndex >= this.currentDialogues.length) {
            this.endDialogue();
        } else {
            this.startTyping();
        }
    },

    endDialogue() {
        this.active = false;
        this.currentDialogues = [];
        this.currentIndex = 0;
    },

    // Diyalog kutusunu çiz (canvas üzerinde)
    render(ctx, canvasW, canvasH) {
        if (!this.active) return;

        const dialogue = this.currentDialogues[this.currentIndex];
        if (!dialogue) return;

        const dpr = window.devicePixelRatio || 1;
        const boxH = 140 * dpr;
        const boxY = canvasH - boxH - 20 * dpr;
        const boxX = 40 * dpr;
        const boxW = canvasW - 80 * dpr;

        // Kutucuk arka planı
        ctx.fillStyle = 'rgba(8, 12, 28, 0.92)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 12 * dpr);
        ctx.fill();

        // Kutucuk kenarı
        ctx.strokeStyle = 'rgba(80, 200, 255, 0.6)';
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 12 * dpr);
        ctx.stroke();

        // Glow
        ctx.shadowColor = 'rgba(80, 200, 255, 0.3)';
        ctx.shadowBlur = 15 * dpr;
        ctx.strokeStyle = 'rgba(80, 200, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 12 * dpr);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Speaker emoji
        ctx.font = `${32 * dpr}px sans-serif`;
        ctx.fillText(dialogue.speaker, boxX + 16 * dpr, boxY + 42 * dpr);

        // Speaker adı
        ctx.font = `bold ${10 * dpr}px "Press Start 2P", monospace`;
        ctx.fillStyle = '#50c8ff';
        ctx.fillText(dialogue.name, boxX + 56 * dpr, boxY + 28 * dpr);

        // Metin
        ctx.font = `${9 * dpr}px "Press Start 2P", monospace`;
        ctx.fillStyle = '#e0e8f0';

        // Satır kaydırma
        const maxWidth = boxW - 80 * dpr;
        const words = this.typingText.split(' ');
        let line = '';
        let lineY = boxY + 55 * dpr;
        const lineHeight = 18 * dpr;

        for (const word of words) {
            const testLine = line + (line ? ' ' : '') + word;
            if (ctx.measureText(testLine).width > maxWidth) {
                ctx.fillText(line, boxX + 56 * dpr, lineY);
                line = word;
                lineY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, boxX + 56 * dpr, lineY);

        // İlerle bildirimi
        if (this.waitingForInput) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = `${7 * dpr}px "Press Start 2P", monospace`;
            const hint = `[${this.currentIndex + 1}/${this.currentDialogues.length}] SPACE / ENTER ile devam et ▶`;
            ctx.fillText(hint, boxX + 56 * dpr, boxY + boxH - 16 * dpr);

            // Yanıp sönen ok
            if (Math.floor(Date.now() / 500) % 2 === 0) {
                ctx.fillStyle = '#50c8ff';
                ctx.fillText('▼', boxX + boxW - 30 * dpr, boxY + boxH - 16 * dpr);
            }
        }
    }
};
