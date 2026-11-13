# 健康島 Health Island

## v1.1｜標籤自動避讓 × 高對比夜景 × 重製島嶼進度

以 Three.js 建立 3D 青春教育世界，沿用先前的七島地圖與三份完整 PDF。本次更新改善各島標籤、夜景可讀性與操作便利性：

- `label-layout.js` 依照 3D 投影座標，自動調整島嶼、知識寶庫、導覽員與 Padlet 標籤，避開彼此與固定導覽區（不因相機旋轉而固定在單一位置）。
- `interface-polish.css` 加強夜景所有標籤及標題文字對比，並縮小左側標題區、優化窄畫面與底部工具列。
- 底部工具列新增「重製進度」。確認後只清除 `healthIslandQuestPrototypeV1` 的島嶼／塔樓解鎖階段與導覽歡迎標記，然後重整頁面。**不清除各個 GitHub Pages 互動教材自己保存的練習紀錄。**

七島基本配置：

- 三座主題大島：左上「不染色島」、右上「不炫耀島」、下方「不迷路島」，保留各自三座認知／情意／技能塔。
- 中央小島：「導覽島／Padlet」，提供原有 Padlet 嵌入看板與闖關導覽。
- 三座知識寶庫小島：分別在左下、上方、右下，可隨時點擊閱讀對應的**完整原始 PDF**，不受學習塔解鎖條件影響。

### 三份原始 PDF

| 小島 | PDF | 原稿頁數 | Google Drive |
|---|---|---|---|
| 不染色知識寶庫 | 悸動青春頌 | 9 頁 | https://drive.google.com/file/d/1c3werbYfxxOa96fY8EoQ3uqAWHLDLd40/view |
| 不炫耀知識寶庫 | 不需炫耀、不是比較 | 9 頁 | https://drive.google.com/file/d/1v7zTXRnUN52NvD7glko0eig8pxpQxRA4/view |
| 不迷路知識寶庫 | 青春不迷路，幸福不MISS | 10 頁 | https://drive.google.com/file/d/1fedgmtF8YBZJ_tnu1I_YfDd2rLejY7Xk/view |

閱讀器使用 Google Drive 的 PDF 預覽模式，保留原稿圖文與版面。**檔案分享權限仍需由擁有者設定為「知道連結的任何人：檢視者」**，否則一般訪客會看見需要存取權。GitHub 網站本身不能繞過 Drive 存取限制。

### 闖關與解鎖

知識寶庫和 Padlet 可直接進入；主題島與教材塔仍沿用原有學習任務。

| 階段 | 完成條件 | 解鎖項目 |
|---|---|---|
| 0 → 1 | 在導覽員完成兩題行前檢核 | 不炫耀島、1-2 認知塔 |
| 1 → 2 | 完成 1-2 遊戲並輸入青春密碼 | 2-2 情意塔 |
| 2 → 3 | 完成 2-2 徽章挑戰並輸入通關密碼 | 3-2 技能塔 |
| 3 → 4 | 完成 3-2 技能挑戰並輸入成功密碼 | 不染色島、1-1 認知塔 |
| 4 → 5 | 完成 1-1 認知挑戰並輸入青春密碼 | 2-1 情意塔 |

密碼輸入欄位直接顯示在原教材 iframe 下方，不用回導覽小人。驗證 3-2 的密碼成功後，會自動關閉教材並聚焦升起的不染色島，1-1 認知塔可從地圖進入。其餘關卡驗證成功後可按「前往下一座教材塔」。原有密碼均保留；闖關進度仍在本機 localStorage 儲存。剩餘塔樓仍鎖定，等後續開發。

### 核心程式

- `app.js`：3D 主場景、中央導覽島縮放、七島初始化及重製進度按鈕
- `label-layout.js`、`interface-polish.css`：標示自動避讓、夜景文字對比及行動裝置排版
- `satellites.js`：三座主題大島與橋梁
- `knowledge-islands.js`、`knowledge-islands.css`：三座知識寶庫、小島標記及 PDF 閱讀器
- `vault.js`、`vault-learning.js`、`vault.css`：中央 Padlet、導覽及彈出看板
- `guide.js`、`quest-rules.js`：導覽員、檢核、密碼解鎖
- `lessons.js`、`learning.css`、`data/lessons.json`：九座教材塔、外部遊戲、內嵌密碼驗證

部署：GitHub Pages 使用 main 分支根目錄。站點：https://kaoelvmpvm.github.io/Health-Island/

備註：外部 iframe、Google Drive PDF 分享權限，以及真實裝置上的 WebGL 畫面仍需瀏覽器實測。
