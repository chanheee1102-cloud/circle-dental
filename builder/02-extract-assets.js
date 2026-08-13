/**
 * 모든 하위 페이지에서 자산 URL 을 뽑고, 각 이미지가 어느 페이지 어느 문맥에 있었는지 기록한다.
 * (홈만 긁었을 때 의료진 사진·논문 이미지를 통째로 놓쳤다. 이번엔 전 페이지를 훑는다.)
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const BASE = 'https://circle-dental.co.kr';

const abs = (u) => {
  if (!u) return null;
  u = u.trim().replace(/^["']|["']$/g, '');
  if (!u || u.startsWith('data:') || u.startsWith('#')) return null;
  if (u.startsWith('//')) return 'https:' + u;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('/')) return BASE + u;
  return null;
};

const strip = (s) =>
  s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
   .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const files = fs.readdirSync(DIR).filter((f) => /^page_.*\.html$/.test(f));
const found = new Map(); // url -> {pages:Set, ctx:string}

for (const f of files) {
  const page = f.replace(/^page_|\.html$/g, '');
  const html = fs.readFileSync(path.join(DIR, f), 'utf8');
  const urls = new Set();

  for (const m of html.matchAll(/<img[^>]+>/gi)) {
    for (const a of ['src', 'data-src', 'data-original']) {
      const v = m[0].match(new RegExp(a + '\\s*=\\s*["\']([^"\']+)["\']', 'i'));
      if (v) { const u = abs(v[1]); if (u) urls.add(u); }
    }
  }
  for (const m of html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    const u = abs(m[1]); if (u) urls.add(u);
  }

  for (const u of urls) {
    if (!/\.(jpe?g|png|webp|gif)(\?|$)/i.test(u)) continue;
    const key = (u.split('?')[0].split('/').pop() || '').split('.')[0];
    const idx = key ? html.indexOf(key) : -1;
    const ctx = idx > -1 ? strip(html.slice(Math.max(0, idx - 1200), idx)).slice(-110) : '';
    if (!found.has(u)) found.set(u, { pages: new Set(), ctx });
    found.get(u).pages.add(page);
  }
}

// 이미 받은 파일과 대조
const HAVE = 'C:/Users/FORYOUCOM/Desktop/circle-dental/public/img';
const haveStems = new Set(
  fs.readdirSync(HAVE).filter((f) => /\.(png|jpe?g)$/i.test(f))
    .map((f) => f.replace(/\.(png|jpe?g)$/i, '').split('_').pop())
);

const fresh = [];
for (const [u, info] of found) {
  const stem = (u.split('?')[0].split('/').pop() || '').split('.')[0];
  if (haveStems.has(stem)) continue;
  fresh.push({ u, pages: [...info.pages].join(','), ctx: info.ctx });
}

fs.writeFileSync(path.join(DIR, 'assets2.txt'), fresh.map((x) => x.u).join('\n'), 'utf8');
console.log(`전체 이미지 ${found.size} / 신규 ${fresh.length}\n`);
for (const x of fresh) {
  console.log(`[${x.pages}] ${x.u.split('/').pop()}`);
  if (x.ctx) console.log(`      …${x.ctx}`);
}
