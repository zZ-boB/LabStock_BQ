# 🧪 LabStock — 實驗室庫存管理系統

> IVF 實驗室耗材與試劑的進出庫管理、批號追蹤、報帳作業一站式解決方案

---

## 目錄

- [系統簡介](#系統簡介)
- [技術架構](#技術架構)
- [專案結構](#專案結構)
- [安裝與啟動](#安裝與啟動)
- [功能模組說明](#功能模組說明)
- [資料庫架構](#資料庫架構)
- [⚠️ 注意事項與安全性提醒](#️-注意事項與安全性提醒)

---

## 系統簡介

LabStock 是一套專為 IVF（體外受精）實驗室設計的庫存管理系統，提供：

- 📦 耗材與試劑的即時庫存管理
- 🏷️ 批號追蹤與 **FEFO**（先到期先出）管理
- 📋 完整的出入庫歷史紀錄
- 📊 年度月用量統計
- 💰 按月份自動計算報帳金額，支援 **Excel 匯出**
- 📞 供應商聯絡資訊管理
- ☁️ **Supabase 雲端即時同步**

---

## 技術架構

| 層級         | 技術                                     |
| ------------ | ---------------------------------------- |
| **前端框架** | React 18                                 |
| **建置工具** | Vite 5                                   |
| **樣式**     | Tailwind CSS v3                          |
| **圖示**     | Lucide React                             |
| **後端資料** | Supabase（雲端 PostgreSQL + REST API）   |
| **報表匯出** | SheetJS (xlsx)                           |
| **字體**     | Google Fonts — Inter + JetBrains Mono    |

---

## 專案結構

```
lab_v1/
├── index.html                        # Vite 入口 HTML
├── index.original.html               # 原始單檔版本（備份）
├── package.json                      # 套件與腳本定義
├── vite.config.js                    # Vite 設定
├── tailwind.config.js                # Tailwind CSS 設定
├── postcss.config.js                 # PostCSS 設定
│
└── src/
    ├── main.jsx                      # React 掛載入口
    ├── index.css                     # 全域樣式 + Tailwind 指令
    ├── App.jsx                       # 核心元件（狀態管理 + 業務邏輯）
    │
    ├── config/
    │   └── supabase.js               # Supabase 連線設定
    │
    ├── data/
    │   └── initialData.js            # 預設庫存品項與廠商資料
    │
    ├── utils/
    │   └── helpers.js                # 共用工具函式
    │
    └── components/
        ├── ErrorBoundary.jsx         # React 錯誤邊界
        ├── LoginPage.jsx             # 登入頁面
        ├── Sidebar.jsx               # 側邊導覽列 + 雲端狀態
        ├── Header.jsx                # 頁面標題 + 搜尋框
        │
        ├── tabs/                     # ── 各功能分頁 ──
        │   ├── InventoryTab.jsx      #   庫存清單（含預警卡片）
        │   ├── BatchesTab.jsx        #   批號查詢（FEFO）
        │   ├── HistoryTab.jsx        #   出入庫追蹤紀錄
        │   ├── StatsTab.jsx          #   月使用量統計
        │   ├── PurchaseTab.jsx       #   報帳報表 + Excel 匯出
        │   ├── VendorsTab.jsx        #   廠商聯絡資訊
        │   └── SettingsTab.jsx       #   品項新增/編輯
        │
        └── modals/                   # ── 彈窗元件 ──
            ├── InboundModal.jsx      #   進貨（入庫）登記
            ├── OutboundModal.jsx     #   出庫作業
            ├── ItemModal.jsx         #   品項設定
            └── VendorModal.jsx       #   廠商資訊設定
```

---

## 安裝與啟動

### 前置需求

- **Node.js** 18 以上（建議 20 LTS）
- **npm** 9 以上

### 步驟

```bash
# 1. 進入專案目錄
cd lab_v1

# 2. 安裝所有依賴套件
npm install

# 3. 啟動開發伺服器
npm run dev
```

啟動後終端會顯示：

```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 在瀏覽器中開啟

在瀏覽器網址列輸入以下網址即可存取系統：

```
http://localhost:5173
```

> 💡 如果 5173 埠被佔用，Vite 會自動使用 5174、5175… 等，請看終端輸出的實際網址。

### 建置正式版本

```bash
npm run build     # 產出到 dist/ 資料夾
npm run preview   # 預覽正式版本
```

---

## 功能模組說明

| 分頁           | 功能                                                       |
| -------------- | ---------------------------------------------------------- |
| **庫存清單**   | 即時庫存總覽、低庫存訂貨提醒、30 天效期預警、一鍵入庫/出庫   |
| **批號查詢**   | 輸入日期查看療程使用批號、FEFO 優先消耗排序                  |
| **出入庫追蹤** | 所有入庫/出庫操作的完整歷史紀錄                              |
| **月使用量**   | 年度 1–12 月用量交叉表，可切換年份                           |
| **實驗室報帳** | 按月份篩選進貨紀錄、自動計算金額、匯出 Excel (.xlsx)         |
| **廠商聯絡**   | 廠商公司名、業務、電話、Email 管理                           |
| **品項設定**   | 新增/編輯品項名稱、廠牌、單位、報帳單價、安全存量             |

### 品項分類

- **Media/REAG.** — 培養液與試劑（如 Q1、Q2、冷凍 KIT、EmbryoGlue）
- **CONS.** — 耗材（如培養皿、吸管、巴斯德管）

---

## 資料庫架構

系統使用 Supabase 雲端 PostgreSQL，包含三張資料表：

| 資料表      | 用途       | 主要欄位                                            |
| ----------- | ---------- | --------------------------------------------------- |
| `inventory` | 庫存品項   | id, name, vendor, category, unit, unitPrice, minQty, batches (JSONB) |
| `vendors`   | 廠商資訊   | id, company, name, phone, email, note               |
| `history`   | 操作紀錄   | itemId, type, change, batchNo, invoiceDate, user, date |

---

## ⚠️ 注意事項與安全性提醒

### 🔴 1. 登入密碼為前端硬編碼（高風險）

```
帳號: lab
密碼: 1234
```

- 密碼直接寫在 `src/components/LoginPage.jsx` 中
- **任何人查看原始碼都能看到密碼**
- 此登入機制僅防止誤操作，**不具備真正的安全防護**
- **建議改善**：使用 Supabase Auth 內建的身份驗證功能，支援 Email/密碼登入、OAuth 等

### 🔴 2. Supabase API Key 暴露在前端

- `src/config/supabase.js` 包含 Supabase URL 和 API Key
- 前端程式碼在瀏覽器中完全可見，任何人可取得此 Key
- **建議改善**：
  - 確保 Supabase 已正確設定 **Row Level Security (RLS)** 規則
  - 使用 `anon` key 搭配 RLS 限制未授權存取
  - 敏感操作應透過 Supabase Edge Functions 在伺服器端執行

### 🟡 3. 開發伺服器僅限本機存取

- `npm run dev` 啟動的伺服器**預設僅限 localhost**
- 同網路內的其他裝置（如手機、其他電腦）**無法直接連線**
- **如需區域網路存取**（例如讓實驗室其他電腦使用）：

  ```bash
  npx vite --host
  ```

  這會顯示一個區域網路 IP 位址（如 `http://192.168.x.x:5173`），同網路內的裝置即可使用該 IP 連線。

### 🟡 4. 正式部署注意事項(供參考)

若要將系統部署到網路上供遠端使用：

| 部署方式             | 說明                                              |
| -------------------- | ------------------------------------------------- |
| **Vercel**           | 免費靜態託管，`npm run build` 後部署 `dist/` 資料夾 |
| **Netlify**          | 免費方案，拖曳 `dist/` 資料夾即可                  |
| **GitHub Pages**     | 免費，需設定 `base` 路徑                            |
| **自架 Nginx**       | 將 `dist/` 內容放到伺服器靜態目錄即可              |

> ⚠️ 部署到公開網路後，上述密碼與 API Key 問題將更加嚴重，**務必先解決安全性問題再部署**。

### 🟡 5. 資料同步機制

- 系統採用「**樂觀更新**」：先更新本地 UI，再同步至雲端
- 若雲端同步失敗（如斷網），本地顯示正確但雲端資料不一致
- **刷新頁面後會重新從雲端載入**，可能導致未同步的操作遺失
- 目前沒有離線快取或同步衝突處理機制

### 🟢 6. 瀏覽器相容性

- 支援所有現代瀏覽器（Chrome、Edge、Firefox、Safari）
- 不支援 IE 11
- 已包含手機端自適應設計（Responsive），手機瀏覽器可正常使用

### 🟢 7. 資料備份

- 資料儲存在 Supabase 雲端，具基本的自動備份
- Excel 匯出功能可作為額外的手動備份手段
- 原始單檔版本保存為 `index.original.html`

---

## 常見問題

### Q: 如何在手機上使用？

1. 確保手機和電腦在同一個 Wi-Fi 網路
2. 使用 `npx vite --host` 啟動
3. 在手機瀏覽器輸入終端顯示的區域網路 IP（例如 `http://192.168.1.100:5173`）

### Q: 忘記密碼怎麼辦？

密碼寫死在 `src/components/LoginPage.jsx`，直接打開檔案查看或修改即可。

### Q: 如何修改 Supabase 連線？

編輯 `src/config/supabase.js`，替換 `supabaseUrl` 和 `supabaseKey`。

### Q: 如何新增品項分類？

目前僅支援 `Media/REAG.` 和 `CONS.` 兩個分類，若需新增需修改多個元件中的分類切換按鈕。

---

## License

Internal use only — 僅供實驗室內部使用
