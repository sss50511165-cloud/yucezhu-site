/* ═══════════════════════════════════════════════════════════
   ym-filter.js — 通用年月篩選器
   雲端知識誌 · MMXXVI
   ═══════════════════════════════════════════════════════════ */

let ymState = { year: null, month: null };

function initYMFilter(dates, listSelector, applyFiltersFn) {
  const yearMonths = {};
  dates.forEach(d => {
    if (!d) return;
    const parts = d.split('-');
    if (parts.length < 2) return;
    const y = parts[0];
    const m = parseInt(parts[1]);
    if (!yearMonths[y]) yearMonths[y] = new Set();
    yearMonths[y].add(m);
  });

  const years = Object.keys(yearMonths).sort().reverse();
  if (years.length === 0) return;

  const container = document.getElementById('ym-filter');
  const yearTabsEl = document.getElementById('year-tabs');
  const monthPillsEl = document.getElementById('month-pills');

  if (!container || !yearTabsEl || !monthPillsEl) return;
  container.style.display = '';

  function renderYears() {
    yearTabsEl.innerHTML = years.map(y =>
      `<button class="year-tab${ymState.year === y ? ' active' : ''}" data-year="${y}">${y}</button>`
    ).join('');
  }

  function renderMonths() {
    const availableMonths = ymState.year ? yearMonths[ymState.year] : new Set();
    let html = '';
    for (let m = 1; m <= 12; m++) {
      const has = availableMonths.has(m);
      const isActive = ymState.month === m;
      let cls = 'month-pill';
      if (isActive) cls += ' active';
      else if (!has) cls += ' disabled';
      html += `<button class="${cls}" data-month="${m}" ${!has && !isActive ? 'disabled' : ''}>${m} 月</button>`;
    }
    monthPillsEl.innerHTML = html;
  }

  function updateStatus() {
    const statusEl = document.getElementById('filter-status');
    if (!ymState.year && !ymState.month) {
      if (statusEl) statusEl.style.display = 'none';
      return;
    }
    if (statusEl) statusEl.style.display = 'flex';
    const textEl = document.getElementById('filter-text');
    const countEl = document.getElementById('filter-count');

    let label = '';
    if (ymState.year && ymState.month) {
      label = `顯示 ${ymState.year} 年 ${ymState.month} 月`;
    } else if (ymState.year) {
      label = `顯示 ${ymState.year} 年`;
    }

    const visible = document.querySelectorAll(`${listSelector} li`);
    let count = 0;
    visible.forEach(li => { if (li.style.display !== 'none') count++; });

    if (textEl) textEl.textContent = label;
    if (countEl) countEl.textContent = `· ${count} 篇`;
  }

  function applyYMFilter() {
    if (applyFiltersFn) {
      applyFiltersFn();
    } else {
      const lis = document.querySelectorAll(`${listSelector} li`);
      lis.forEach(li => {
        const date = li.dataset.date || '';
        li.style.display = matchYM(date) ? '' : 'none';
      });
    }
    updateStatus();
  }

  yearTabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.year-tab');
    if (!btn) return;
    const y = btn.dataset.year;
    if (ymState.year === y) {
      ymState.year = null;
      ymState.month = null;
    } else {
      ymState.year = y;
      ymState.month = null;
    }
    renderYears();
    renderMonths();
    applyYMFilter();
  });

  monthPillsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.month-pill');
    if (!btn || btn.disabled) return;
    const m = parseInt(btn.dataset.month);
    if (ymState.month === m) {
      ymState.month = null;
    } else {
      ymState.month = m;
      if (!ymState.year) {
        for (const y of years) {
          if (yearMonths[y].has(m)) { ymState.year = y; break; }
        }
        renderYears();
      }
    }
    renderMonths();
    applyYMFilter();
  });

  ymState.year = years[0];
  ymState.month = null;
  renderYears();
  renderMonths();
}

function matchYM(dateStr) {
  if (!ymState.year && !ymState.month) return true;
  if (!dateStr) return false;
  const parts = dateStr.split('-');
  if (parts.length < 2) return false;
  const y = parts[0];
  const m = parseInt(parts[1]);
  if (ymState.year && y !== ymState.year) return false;
  if (ymState.month && m !== ymState.month) return false;
  return true;
}

function clearYMFilter() {
  ymState.year = null;
  ymState.month = null;
  const yearTabsEl = document.getElementById('year-tabs');
  const monthPillsEl = document.getElementById('month-pills');
  if (yearTabsEl) yearTabsEl.querySelectorAll('.year-tab').forEach(b => b.classList.remove('active'));
  if (monthPillsEl) monthPillsEl.querySelectorAll('.month-pill').forEach(b => b.classList.remove('active'));
  document.dispatchEvent(new Event('ym-clear'));
}
