# 雲端知識誌 — 專案說明（給 Claude Code）

## 專案概述
靜態知識分享網站，部署在 GitHub Pages。整合每日財經摘要與內科醫學文獻。

## 技術架構
- 純 HTML/CSS/JS 靜態網站，無框架
- 主題樣式：assets/theme.css
- 共用模組：assets/bookmarks.js（收藏系統）、assets/ym-filter.js（年月篩選器）
- RSS 生成：assets/generate-feed.js（每次更新內容後需跑 node assets/generate-feed.js）
- 資料來源：stocks.json、medical.json

## 檔案結構
```
index.html              # 首頁（hero + 今日精選 + 統計儀表板 + 雙欄列表）
feed.xml                # RSS feed（由 generate-feed.js 生成）
stocks.json             # 股市資料索引
medical.json            # 醫學資料索引
assets/
  theme.css             # 全站主題樣式
  bookmarks.js          # 全站收藏系統（localStorage 'site-bookmarks'）
  ym-filter.js          # 通用年月篩選器
  generate-feed.js      # RSS feed 生成腳本
  guide.js              # 互動式網站導覽（首次造訪自動觸發）
stocks/
  index.html            # 股市列表頁
  viewer.html           # 股市內文頁
  template.html         # 股市摘要生成模板 ❌ 不要修改
  *.html                # 各日股市摘要 ❌ 不要修改
medical/
  index.html            # 醫學列表頁
  viewer.html           # 醫學內文頁
  compare.html          # 文獻對比頁（2-3 篇並排）
  *.json                # 各篇醫學文獻資料
images/
  whale-header.webp     # 首頁 hero 背景圖
```

## 已實裝功能（請勿破壞）
1. **配色系統** — CSS variables 在 theme.css :root，含 [data-theme="light"] 淺色模式
2. **明暗模式切換** — 右上角按鈕，localStorage 持久化，所有頁面都有
3. **搜尋框** — stocks/index.html 和 medical/index.html 的即時關鍵字篩選
4. **科別複選篩選器** — medical/index.html 右側 sidebar，支援多選
5. **年月篩選器** — assets/ym-filter.js，stocks 和 medical 列表頁共用
6. **今日精選** — index.html，自動抓最新股市+醫學各一篇
7. **統計儀表板** — index.html，四個數字卡片（累計文獻/本月新增/涵蓋科別/股市摘要）
8. **閱讀時間估算** — 醫學卡片顯示「約 X 分鐘」
9. **收藏系統** — assets/bookmarks.js，全站共用，localStorage 'site-bookmarks'，stock 和 medical 都有
10. **閱讀進度條** — viewer 頁面頂部金色細線
11. **回到頂部按鈕** — 所有頁面右下角
12. **滾動觸發動畫** — Intersection Observer，卡片滾動到才 fadeUp
13. **相關文獻推薦** — medical/viewer.html 底部，同科別優先
14. **高分精選** — medical/index.html「★ 只看高分」toggle
15. **鍵盤快捷鍵** — viewer 頁面 ← → 切換上下篇
16. **文章導航提示** — viewer 頁面底部「← 上一篇 | 下一篇 →」
17. **RSS Feed** — feed.xml + 所有頁面 footer 有 RSS 圖示
18. **互動式網站使用指南** — assets/guide.js，首次造訪自動觸發，localStorage 'site-guide-seen'，footer 有 ? 按鈕可重新觸發
19. **文獻對比模式** — medical/index.html 卡片可勾選 2-3 篇，跳轉 medical/compare.html 並排對比

## 篩選器共存規則
medical/index.html 的 applyFilters() 同時判斷：關鍵字搜尋 + 科別篩選 + 年月篩選 + 高分篩選，四者 AND 邏輯。新增篩選條件時必須整合進 applyFilters()。

## 修改注意事項
- ❌ 不要修改 stocks/template.html 和 stocks/*.html（已生成的摘要）
- ❌ 不要修改 JSON 資料結構（stocks.json、medical.json、medical/*.json）
- ❌ 不要修改 fetch 邏輯和 JSON 路徑
- ✅ 改 CSS 時只改 theme.css，不要在各頁面重複定義
- ✅ 新功能的共用 JS 放 assets/ 資料夾
- ✅ 更新內容後記得跑 node assets/generate-feed.js 再 push

## 設計風格
- 暗色主題 + 金銅色調（editorial luxury 風格）
- 字體：LXGW WenKai TC（中文內文）、Cormorant Garamond（英文裝飾）、Playfair Display（標題）
- 動畫：fadeUp、slideInLeft，cubic-bezier(0.25, 0.1, 0.25, 1)
- 邊框：0.5px solid，圓角 4px
