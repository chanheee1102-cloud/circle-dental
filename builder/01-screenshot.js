/**
 * 원본 사이트 스크린샷 수집기 — 웹빌더 파이프라인 [A] 단계의 빠진 조각.
 *
 * ★ 왜 필요한가
 *   HTML 만 보면 "이 이미지가 무엇인지" 를 알 수 없다. 이번 동그라미치과 작업에서
 *   실제로 모바일용 세로 영상을 데스크톱 히어로에 넣고, 글자가 박힌 캡처를 아이콘으로 쓰고,
 *   인물이 아래쪽에 몰린 PNG 를 그대로 넣는 실수가 났다. 전부 **렌더된 화면을 안 봐서** 생긴 일이다.
 *
 * ★ 무엇을 뽑는가
 *   ① 데스크톱 전체 스크린샷 (섹션 구조·색·톤 파악)
 *   ② 모바일 전체 스크린샷 (반응형이 어떻게 갈라지는지)
 *   ③ 섹션별 조각 (어느 사진이 어느 문구와 붙어 있는지)
 *   ④ 계산된 스타일 — 주조색·폰트 (디자인 토큰 자동 추출)
 *
 * 사용: node shoot.js https://example.co.kr
 */
const { chromium } = require('C:/Users/FORYOUCOM/Desktop/circle-dental/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'https://circle-dental.co.kr';
const OUT = path.join(__dirname, 'shots');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  // ── 1) 내부 링크 전수 수집 ──────────────────────────────
  //    ★ 이번 실패의 1순위 원인이 '홈만 보고 끝낸 것' 이었다. 크롤을 강제한다.
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ko-KR',
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);

  const links = await page.evaluate((base) => {
    const origin = new URL(base).origin;
    return [...new Set(
      [...document.querySelectorAll('a[href]')]
        .map((a) => a.href)
        .filter((h) => h.startsWith(origin))
        .map((h) => new URL(h).pathname)
        .filter((p) => !/\.(jpg|png|pdf|zip)$/i.test(p))
    )];
  }, BASE);

  const paths = ['/', ...links.filter((p) => p !== '/')].slice(0, 25);
  console.log(`발견한 페이지 ${paths.length}개\n`);

  // ── 2) 디자인 토큰 추출 ────────────────────────────────
  const tokens = await page.evaluate(() => {
    const count = {};
    const bump = (k) => { if (k && !/rgba?\(0, 0, 0, 0\)|transparent/.test(k)) count[k] = (count[k] || 0) + 1; };
    document.querySelectorAll('*').forEach((el) => {
      const s = getComputedStyle(el);
      bump(s.backgroundColor);
      bump(s.color);
    });
    const fonts = {};
    document.querySelectorAll('h1,h2,h3,p,a,span').forEach((el) => {
      const f = getComputedStyle(el).fontFamily;
      fonts[f] = (fonts[f] || 0) + 1;
    });
    const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
    return { colors: top(count, 12), fonts: top(fonts, 4) };
  });
  fs.writeFileSync(path.join(OUT, '_tokens.json'), JSON.stringify(tokens, null, 2), 'utf8');
  console.log('=== 주조색 상위 ===');
  tokens.colors.forEach(([c, n]) => console.log(`  ${String(n).padStart(5)}  ${c}`));
  console.log('=== 폰트 ===');
  tokens.fonts.forEach(([f, n]) => console.log(`  ${String(n).padStart(5)}  ${f.slice(0, 60)}`));
  console.log('');

  // ── 3) 페이지별 전체 스크린샷 (데스크톱 + 모바일) ──────────
  const mob = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    locale: 'ko-KR',
  });
  const mpage = await mob.newPage();

  for (const p of paths) {
    const name = (p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '_')).slice(0, 40);
    try {
      await page.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 45000 });
      // 지연 로딩 이미지를 깨우기 위해 끝까지 스크롤한 뒤 위로 돌아온다.
      await page.evaluate(async () => {
        await new Promise((r) => {
          let y = 0;
          const t = setInterval(() => {
            window.scrollBy(0, 600); y += 600;
            if (y > document.body.scrollHeight) { clearInterval(t); window.scrollTo(0, 0); r(); }
          }, 60);
        });
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT, `${name}__desktop.png`), fullPage: true });

      await mpage.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await mpage.waitForTimeout(600);
      await mpage.screenshot({ path: path.join(OUT, `${name}__mobile.png`), fullPage: true });

      console.log(`✓ ${p}`);
    } catch (e) {
      console.log(`✗ ${p}  ${String(e.message).slice(0, 60)}`);
    }
  }

  await browser.close();
  console.log(`\n저장 위치: ${OUT}`);
})();
