// assets/guide.js — 互動式網站導覽
(function(){
  const STORAGE_KEY = 'site-guide-seen';

  const GUIDES = {
    'index': [
      { target: '#today-highlight', title: '今日精選', desc: '每天自動顯示最新的股市摘要與醫學文獻', position: 'bottom' },
      { target: '#stats-bar', title: '統計總覽', desc: '即時統計累計文獻數量與本月更新', position: 'bottom' },
      { target: '.column-section:first-child', title: '市場脈動', desc: '點擊任何一張卡片閱讀完整股市摘要', position: 'right' },
      { target: '.column-section:last-child', title: '臨床動態', desc: '最新內科醫學文獻，由 AI 翻譯整理', position: 'left' },
      { target: '#theme-toggle', title: '明暗切換', desc: '點這裡切換淺色／深色模式', position: 'left' }
    ],
    'medical-index': [
      { target: '#search-input', title: '搜尋', desc: '輸入關鍵字即時篩選文獻', position: 'bottom' },
      { target: '#ym-filter', title: '年月篩選', desc: '點擊年份和月份快速定位', position: 'bottom' },
      { target: '#high-star-toggle', title: '高分精選', desc: '一鍵只看 4 星以上的重要文獻', position: 'right' },
      { target: '#dept-filter-container', title: '科別篩選', desc: '可複選多個科別同時篩選', position: 'left' },
      { target: '.bookmark-btn', title: '收藏功能', desc: '點星號收藏文章，下次快速找到', position: 'left' }
    ],
    'stock-index': [
      { target: '#search-input', title: '搜尋', desc: '輸入關鍵字篩選股市摘要', position: 'bottom' },
      { target: '#ym-filter', title: '年月篩選', desc: '按年份月份快速瀏覽歷史摘要', position: 'bottom' }
    ],
    'viewer': [
      { target: '#reading-progress', title: '閱讀進度', desc: '頂部金色線條顯示閱讀進度', position: 'bottom' },
      { target: '.nav-hint', title: '快捷導航', desc: '用鍵盤 ← → 或點這裡切換上下篇', position: 'top' },
      { target: '#back-to-top', title: '回到頂部', desc: '隨時點這裡回到頁面頂端', position: 'left' }
    ]
  };

  function getPageType() {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path.endsWith('/')) {
      if (path.includes('/medical/')) return 'medical-index';
      if (path.includes('/stocks/')) return 'stock-index';
      return 'index';
    }
    if (path.includes('viewer.html')) return 'viewer';
    return null;
  }

  function hasSeenGuide() {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
    catch(e) { return false; }
  }

  function markGuideSeen() {
    try { localStorage.setItem(STORAGE_KEY, 'true'); }
    catch(e) {}
  }

  let currentStep = 0;
  let steps = [];
  let overlay, tooltip;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'guide-overlay';
    document.body.appendChild(overlay);

    tooltip = document.createElement('div');
    tooltip.id = 'guide-tooltip';
    document.body.appendChild(tooltip);
  }

  function showStep(index) {
    if (index >= steps.length) {
      endGuide();
      return;
    }
    currentStep = index;
    const step = steps[index];
    const el = document.querySelector(step.target);

    if (!el) {
      showStep(index + 1);
      return;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const rect = el.getBoundingClientRect();

      overlay.style.display = 'block';
      overlay.innerHTML = '';
      const hole = document.createElement('div');
      hole.id = 'guide-hole';
      hole.style.top = (rect.top + window.scrollY - 8) + 'px';
      hole.style.left = (rect.left - 8) + 'px';
      hole.style.width = (rect.width + 16) + 'px';
      hole.style.height = (rect.height + 16) + 'px';
      overlay.appendChild(hole);

      const stepInfo = `${index + 1} / ${steps.length}`;
      tooltip.innerHTML = `
        <div class="guide-step-info">${stepInfo}</div>
        <div class="guide-title">${step.title}</div>
        <div class="guide-desc">${step.desc}</div>
        <div class="guide-actions">
          ${index > 0 ? '<button class="guide-btn guide-prev" onclick="window._guidePrev()">上一步</button>' : ''}
          <button class="guide-btn guide-next" onclick="window._guideNext()">${index < steps.length - 1 ? '下一步' : '完成'}</button>
          <button class="guide-btn guide-skip" onclick="window._guideEnd()">跳過</button>
        </div>
      `;
      tooltip.style.display = 'block';

      const tooltipRect = tooltip.getBoundingClientRect();
      let top, left;

      if (step.position === 'bottom') {
        top = rect.bottom + window.scrollY + 16;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      } else if (step.position === 'top') {
        top = rect.top + window.scrollY - tooltipRect.height - 16;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      } else if (step.position === 'right') {
        top = rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2;
        left = rect.right + 16;
      } else {
        top = rect.top + window.scrollY + rect.height / 2 - tooltipRect.height / 2;
        left = rect.left - tooltipRect.width - 16;
      }

      left = Math.max(16, Math.min(left, window.innerWidth - tooltipRect.width - 16));
      top = Math.max(window.scrollY + 16, top);

      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
    }, 400);
  }

  function endGuide() {
    markGuideSeen();
    if (overlay) overlay.remove();
    if (tooltip) tooltip.remove();
    overlay = null;
    tooltip = null;
  }

  window._guideNext = () => showStep(currentStep + 1);
  window._guidePrev = () => showStep(currentStep - 1);
  window._guideEnd = () => endGuide();

  window.startGuide = function() {
    const pageType = getPageType();
    if (!pageType || !GUIDES[pageType]) return;
    steps = GUIDES[pageType];
    currentStep = 0;
    if (!overlay) createOverlay();
    showStep(0);
  };

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!hasSeenGuide()) {
        window.startGuide();
      }
    }, 1500);
  });
})();
