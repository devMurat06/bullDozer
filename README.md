<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Canvas_API-FF6F00?style=for-the-badge&logo=html5&logoColor=white" />
</p>

<h1 align="center">🏗️ BullDozer</h1>
<h3 align="center">Açık Dünya Ada Macerası</h3>

<p align="center">
  <em>Pixel art tarzında, tarayıcıda çalışan açık dünya ada keşif ve inşaat oyunu.</em><br>
  <em>3 benzersiz ada keşfet, kaynak topla, arazi şekillendir ve kendi cennetini inşa et!</em>
</p>

---
Deneyimlemek için web site linki: "https://buldozer.netlify.app/"

## 🎮 Oyun Hakkında

**BullDozer**, tamamen vanilla JavaScript ve HTML5 Canvas ile geliştirilmiş, retro pixel art estetiğine sahip bir açık dünya macera oyunudur. Oyuncu, gizemli bir takımadada mahsur kalmış bir kaşif rolüne bürünür ve hayatta kalmak için adaları keşfeder, kaynakları toplar, araziyi şekillendirir ve yapılar inşa eder.

Oyun, herhangi bir framework veya kütüphane kullanmadan sıfırdan yazılmıştır — yalnızca HTML, CSS ve JavaScript.

## ✨ Özellikler

### 🗺️ Çoklu Ada Sistemi
- **Cennet Adası** 🏝️ — Tropikal bitki örtüsü, palmiyeler ve kumsal
- **Volkan Adası** 🌋 — Lav akıntıları, volkanik kaya ve kül zeminler
- **Buzul Adası** ❄️ — Donmuş toprak, kar ve buz kristalleri
- Adalar arası **döngüsel seyahat** (Cennet → Volkan → Buzul → Cennet)
- Her geçişte **sinematik video** oynatılır

### 🌅 Gündüz / Gece Döngüsü
- 4 fazlı gerçek zamanlı döngü: Gece 🌙 → Şafak 🌅 → Gündüz ☀️ → Gün Batımı 🌇
- Ortam renk tonları (gece mavisi, şafak kızılı, gün batımı moru)
- Gece gökyüzünde titreyen yıldızlar

### 🌧️ Dinamik Hava Durumu
- **Biome'a özel** hava koşulları:
  - Tropik: Yağmur 🌧️
  - Volkanik: Kül yağışı 🌫️
  - Buzul: Kar ❄️
- Rastgele değişen hava koşulları ve partikül efektleri

### ⛏️ 3 Katmanlı Terraforming
- Her biome'a özel **kazma ve doldurma** zincirleri:
  - **Tropik:** Çim → Kum → Sığ Su → Derin Su
  - **Volkanik:** Volkanik Kaya → Kül → Kum → Kül *(su çıkmaz!)*
  - **Buzul:** Donmuş Çim → Kar → Buz → Sığ Su
- Her işlem 1 💎 taş harcar

### 🎒 Envanter & Kaynak Toplama
- **F tuşu** ile yakındaki nesneleri topla (ağaç, taş, kristal)
- Kaynaklar: 🪵 Odun, 🪨 Taş, 🐟 Balık
- Her 5 kaynak = +1 💎 terraforming taşı
- Toplama işlemi enerji harcar

### ⚡ Enerji Sistemi
- Hareket enerji tüketir, durduğunda yenilenir
- Kaynak toplama ve terraforming enerji gerektirir
- Stratejik dinlenme mekanizması

### 🗺️ Fog of War (Keşif Sisi)
- Ada başlangıçta karanlıktır
- Oyuncu hareket ettikçe çevresi keşfedilir
- Minimap'te keşfedilmemiş alanlar koyu görünür

### 🧭 Minimap
- Sağ altta canlı ada haritası
- Oyuncu konumu (yanıp sönen nokta)
- Nesne ve fog durumu gerçek zamanlı

### 📖 Hikaye Sistemi
- Her adaya varışta **hikaye diyalogları**
- Kaşif ve anlatıcı karakterleri
- Otomatik ilerleyen görev sistemi

### 🏗️ İnşaat Modu
- **B** tuşu ile inşaat moduna geç
- Kilitsiz nesneleri haritaya yerleştir
- Palmiye, çalı, çiçek, iskele, bungalov ve daha fazlası

### 🎵 Müzik & Ses
- Sürekli çalan arka plan müziği
- Ada geçiş videolarında müzik otomatik kapanır

---

## 🕹️ Kontroller

| Tuş | Eylem |
|-----|-------|
| **W A S D** | Hareket (yukarı, sol, aşağı, sağ) |
| **E** | Etkileşim / Sala bin |
| **F** | Kaynak toplama |
| **B** | İnşaat modunu aç/kapat |
| **1** | Kazma aracı (inşaat modunda) |
| **2** | Doldurma aracı (inşaat modunda) |
| **3** | Nesne seçimini temizle |
| **ESC** | İnşaat modundan çık |
| **Tıklama** | Nesne yerleştir / Araziyi değiştir |

---

## 🚀 Kurulum & Çalıştırma

### Gereksinimler
- Modern bir web tarayıcısı (Chrome, Firefox, Safari, Edge)
- Başka hiçbir bağımlılık veya sunucu gerekmez

### Çalıştırma

```bash
# Projeyi klonla
git clone https://github.com/devMurat06/bullDozer.git
cd bullDozer

# Tarayıcıda aç (yöntem 1 — doğrudan)
open index.html

# Tarayıcıda aç (yöntem 2 — yerel sunucu ile)
npx serve .
# veya
python3 -m http.server 8000
```

> **Not:** Video geçişleri ve ses dosyaları yerel dosya protokolünde (`file://`) çalışabilir, ancak en iyi deneyim için yerel bir HTTP sunucusu önerilir.

---

## 📁 Proje Yapısı

```
bullDozer/
├── index.html              # Ana HTML dosyası
├── style.css               # Tüm stiller (HUD, menü, responsive)
├── bulldozer.mp3           # Arka plan müziği
├── bulldozerVolkan.mp4     # Cennet → Volkan geçiş videosu
├── bulldozerBuzul.mp4      # Volkan → Buzul geçiş videosu
├── README.md               # Bu dosya
├── assets/                 # Ek görsel varlıklar
└── js/
    ├── game.js             # Ana oyun döngüsü, kamera, gündüz/gece, hava durumu
    ├── world.js            # Harita üretimi, tile sistemi, fog of war, terraforming
    ├── player.js           # Oyuncu hareketi, animasyon, etkileşim
    ├── objects.js           # Oyun nesneleri tanımları ve çizimleri
    ├── tasks.js            # Görev sistemi ve ilerleme takibi
    ├── story.js            # Hikaye diyalogları ve anlatı sistemi
    └── ui.js               # HUD, bildirimler, inşaat toolbar, envanter
```

---

## 🏛️ Mimari

Oyun, modüler bir singleton pattern ile tasarlanmıştır:

```
Game (Ana Döngü)
 ├── World      — Harita, tile, fog, terraforming, ada geçişleri
 ├── Player     — Hareket, animasyon, çarpışma, kaynak toplama
 ├── GameObjects— Nesne tanımları ve render
 ├── Tasks      — Görev yönetimi ve ilerleme
 ├── Story      — Diyalog ve hikaye sistemi
 └── UI         — HUD, bildirimler, toolbar, envanter
```

Her modül bağımsız bir JavaScript nesnesidir ve `init()`, `update()`, `render()` yaşam döngüsü metodlarını takip eder.

---

## 🎨 Teknik Detaylar

| Özellik | Detay |
|---------|-------|
| **Render Engine** | HTML5 Canvas 2D |
| **Harita** | Prosedürel üretim (sinüs-tabanlı gürültü) |
| **Tile Sistemi** | 32x32px grid, 12 farklı tile türü |
| **Fog of War** | Dairesel reveal (yarıçap 4 tile) |
| **Hava Durumu** | Partikül sistemi (yağmur, kar, kül) |
| **Gündüz/Gece** | ~2 dakika tam döngü, 4 faz |
| **Framework** | Sıfır bağımlılık, vanilla JS |
| **Responsive** | Tam ekran canvas, DPR desteği |

---

## 📸 Ekran Görüntüleri

<p align="center">
  <strong>Başlangıç Ekranı</strong><br>
  <em>Pixel art başlık ve özellik etiketleri</em>
</p>

<p align="center">
  <strong>Oyun İçi — Cennet Adası</strong><br>
  <em>Fog of war, yağmur efekti, minimap, enerji barı ve envanter HUD</em>
</p>

---

## 📝 Lisans

Bu proje eğitim ve kişisel kullanım amaçlıdır.

---

<p align="center">
  <strong>🏗️ BullDozer</strong> ile maceraya atıl!<br>
  <em>Keşfet · Topla · İnşa Et · Fethet</em>
</p>
