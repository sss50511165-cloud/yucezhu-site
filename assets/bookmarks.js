/* ═══════════════════════════════════════════════════════════
   bookmarks.js — 全站統一收藏系統
   雲端知識誌 · MMXXVI
   ═══════════════════════════════════════════════════════════ */

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('site-bookmarks') || '[]'); }
  catch(e) { return []; }
}

function saveBookmarks(arr) {
  localStorage.setItem('site-bookmarks', JSON.stringify(arr));
}

function isBookmarked(key) {
  return getBookmarks().some(b => b.key === key);
}

function toggleBookmark(key, info, btn) {
  let bm = getBookmarks();
  if (bm.some(b => b.key === key)) {
    bm = bm.filter(b => b.key !== key);
    if (btn) {
      btn.textContent = '☆';
      btn.classList.remove('bookmarked');
      const card = btn.closest('.card');
      if (card) card.classList.remove('card-bookmarked');
    }
  } else {
    bm.push({ key, ...info });
    if (btn) {
      btn.textContent = '★';
      btn.classList.add('bookmarked');
      const card = btn.closest('.card');
      if (card) card.classList.add('card-bookmarked');
    }
  }
  saveBookmarks(bm);
  if (typeof updateBookmarkPanel === 'function') updateBookmarkPanel();
}

// 遷移舊的 med-bookmarks 到新格式
function migrateOldBookmarks() {
  const old = localStorage.getItem('med-bookmarks');
  if (old) {
    try {
      const oldKeys = JSON.parse(old);
      const existing = getBookmarks();
      oldKeys.forEach(key => {
        if (!existing.some(b => b.key === key)) {
          existing.push({
            key,
            type: 'medical',
            title: key,
            dept: '',
            date: '',
            url: './medical/viewer.html?d=' + encodeURIComponent(key)
          });
        }
      });
      saveBookmarks(existing);
      localStorage.removeItem('med-bookmarks');
    } catch(e) {}
  }
}

migrateOldBookmarks();
