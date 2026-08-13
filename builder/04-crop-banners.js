/**
 * 특별함 슬라이드 배너에서 '사진 영역만' 잘라낸다.
 *
 * 원본은 [왼쪽 브랜드색 + 큰 번호] | [오른쪽 사진] 구조의 가로 배너다.
 * 그대로 쓰면 번호(01~05)와 여백이 함께 들어가 카드·상세에서 지저분하다.
 * 오른쪽 사진 구간만 잘라 깨끗한 사진 자산으로 만든다.
 */
const sharp = require('C:/Users/FORYOUCOM/Desktop/circle-dental/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/FORYOUCOM/Desktop/circle-dental/public/img';
const OUT = 'C:/Users/FORYOUCOM/Desktop/circle-dental/public/img/special';

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  const files = fs.readdirSync(DIR).filter((f) => /\.(png|jpe?g)$/i.test(f));
  const wide = [];
  for (const f of files) {
    try {
      const m = await sharp(path.join(DIR, f)).metadata();
      const ratio = m.width / m.height;
      if (ratio >= 2.8) wide.push({ f, w: m.width, h: m.height, ratio: +ratio.toFixed(2) });
    } catch {}
  }
  wide.sort((a, b) => b.w - a.w);
  console.log('=== 가로 배너형 이미지 (사진+번호 슬라이드 후보) ===');
  wide.forEach((x) => console.log(`${x.f}  ${x.w}x${x.h}  ratio ${x.ratio}`));

  // 사진은 오른쪽에서 시작한다. 배너마다 시작점이 조금씩 달라 45% 지점부터 자른다.
  // (왼쪽 색면이 45% 안쪽에서 끝나는 것을 육안으로 확인했다.)
  for (const x of wide) {
    const left = Math.round(x.w * 0.45);
    const width = x.w - left;
    const out = path.join(OUT, x.f.replace(/\.(png|jpe?g)$/i, '.jpg'));
    await sharp(path.join(DIR, x.f))
      .extract({ left, top: 0, width, height: x.h })
      .jpeg({ quality: 88 })
      .toFile(out);
    console.log(`cropped -> special/${path.basename(out)}  ${width}x${x.h}`);
  }
})();
