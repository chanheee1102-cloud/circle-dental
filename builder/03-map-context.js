// 각 이미지가 HTML 어디에 있는지 찾아, 주변 한글 텍스트로 용도를 라벨링한다.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'home.html'), 'utf8');

const urls = fs
  .readFileSync(path.join(__dirname, 'assets.txt'), 'utf8')
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);

const strip = (s) =>
  s
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const rows = [];
for (const u of urls) {
  // URL 의 고유 부분(해시)만으로 찾는다 — 쿼리스트링이 붙어 있어도 매칭되게.
  const key = (u.split('?')[0].split('/').pop() || '').split('.')[0];
  if (!key) continue;
  const idx = html.indexOf(key);
  if (idx === -1) continue;

  // 앞쪽 3000자에서 한글 문구를 찾는다 — 섹션 제목이 이미지보다 먼저 나온다.
  const before = strip(html.slice(Math.max(0, idx - 3000), idx));
  const after = strip(html.slice(idx, idx + 800));
  const ko = (before.match(/[가-힣][가-힣 ()·,.0-9A-Za-z]{3,40}/g) || []).slice(-6);
  const koAfter = (after.match(/[가-힣][가-힣 ()·,.0-9A-Za-z]{3,40}/g) || []).slice(0, 2);

  const clean = u.split('?')[0];
  const stem = path.basename(clean, path.extname(clean));
  const dir = clean.split('/').slice(-2)[0];
  const file = `${dir}_${stem}${path.extname(clean)}`.replace(/[^A-Za-z0-9._-]/g, '');

  rows.push({ pos: idx, file, ctx: [...ko, '»', ...koAfter].join(' | ') });
}

rows.sort((a, b) => a.pos - b.pos);
for (const r of rows) {
  console.log(`${String(r.pos).padStart(7)}  ${r.file}\n          ${r.ctx.slice(0, 190)}\n`);
}
console.log('총 ' + rows.length + '개');
