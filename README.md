# Emotion Memory 🌌

> 把每一份情緒，好好收藏。

一個「情緒記憶收藏宇宙」網站。每一段回憶，都會根據情緒，生成一顆漂浮於宇宙中的「情緒記憶球」。

## 功能特色

- 🎭 **五種原創情緒角色**：喜悅、憤怒、悲傷、恐懼、厭惡
- 🌍 **情緒宇宙視圖**：漂浮的記憶球組成你的情緒宇宙
- 📊 **統計分析**：情緒比例、趨勢圖表、強度分析
- 📅 **情緒日曆**：按日期瀏覽情緒記錄
- ✨ **每日回顧**：今日情緒總結與語錄
- 📱 **一鍵匯出 IG Story**：將情緒卡片匯出為圖片
- 💾 **本地儲存**：所有資料安全保存在瀏覽器中
- 🎨 **深色宇宙主題**：Glassmorphism + 漂浮粒子動畫

## 技術棧

- React 18
- Vite 5
- Tailwind CSS 3
- Framer Motion
- Lucide React Icons
- Recharts
- html2canvas
- date-fns

## 安裝與運行

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 部署到 GitHub Pages

### 方法一：使用 GitHub Actions（推薦）

1. 將專案推送到 GitHub 倉庫
2. 在倉庫中建立 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. 在 GitHub 倉庫設定中，前往 **Settings > Pages**，將 Source 設為 **GitHub Actions**

### 方法二：手動部署

```bash
npm run build
# 將 dist 資料夾內容推送到 gh-pages 分支
```

## 部署到 Vercel

### 方法一：連接 GitHub 倉庫（推薦）

1. 前往 [vercel.com](https://vercel.com)
2. 點擊 "New Project"
3. 匯入你的 GitHub 倉庫
4. Vercel 會自動偵測 Vite 設定
5. 點擊 "Deploy"

### 方法二：使用 Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 專案結構

```
emotion-memory/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── CreateMemoryModal.jsx
│   │   ├── EmotionCharacter.jsx
│   │   ├── MemoryBall.jsx
│   │   ├── MemoryDetail.jsx
│   │   └── ParticleBackground.jsx
│   ├── data/
│   │   └── emotions.js
│   ├── pages/
│   │   ├── CalendarPage.jsx
│   │   ├── CollectionPage.jsx
│   │   ├── CreatePage.jsx
│   │   ├── ReviewPage.jsx
│   │   └── StatsPage.jsx
│   ├── store/
│   │   └── useMemoryStore.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 授權

MIT License
