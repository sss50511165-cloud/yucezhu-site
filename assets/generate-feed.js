// assets/generate-feed.js
// 用法：node assets/generate-feed.js
// 讀取 stocks.json 和 medical.json，生成 feed.xml

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://sss50511165-cloud.github.io/yucezhu-site';

const stockData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'stocks.json'), 'utf8'));
const medData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'medical.json'), 'utf8'));

const stockFiles = Array.isArray(stockData) ? stockData : (stockData.files || []);
const medItems = Array.isArray(medData) ? medData : [];

const items = [];

stockFiles.sort().reverse().slice(0, 10).forEach(file => {
  const date = file.replace('.json', '').replace('.html', '');
  items.push({
    title: `股市摘要 — ${date}`,
    link: `${SITE_URL}/stocks/viewer.html?d=${date}`,
    description: '台股美股每日重點事件整理，掌握市場動態。',
    pubDate: new Date(date + 'T08:00:00+08:00').toUTCString(),
    category: '股市摘要'
  });
});

medItems.slice(0, 10).forEach(item => {
  const key = item.filename.replace('.json', '');
  const dateStr = item.pub_date || item.date;
  const timeStr = item.time || '06:00';
  items.push({
    title: item.summary || item.title_zh || '',
    link: `${SITE_URL}/medical/viewer.html?d=${encodeURIComponent(key)}`,
    description: item.title_zh || '',
    pubDate: new Date(`${dateStr}T${timeStr}:00+08:00`).toUTCString(),
    category: item.department || '醫學新知'
  });
});

items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>雲端知識誌</title>
  <link>${SITE_URL}</link>
  <description>整合每日財經與醫學新知</description>
  <language>zh-TW</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.map(item => `  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${item.link}</link>
    <description>${escapeXml(item.description)}</description>
    <pubDate>${item.pubDate}</pubDate>
    <category>${escapeXml(item.category)}</category>
    <guid>${item.link}</guid>
  </item>`).join('\n')}
</channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, '..', 'feed.xml'), rss, 'utf8');
console.log('feed.xml generated with ' + items.length + ' items.');
