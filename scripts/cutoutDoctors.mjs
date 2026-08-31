/**
 * 의료진 사진 **누끼** — 스튜디오 배경을 지우고 투명 PNG 로 만든다.
 *
 * ★★ 왜 이 방법인가 (2026-08-31) ★★
 *   운영자 요청: "누끼로 영역 따서. 사람에 직접 마우스 갖다 대야 자세히 나오게."
 *
 *   앞서 세 번 실패했다 —
 *     ① 배경색 하나를 정해 거리로 자르기 → 배경 #dddfe4 와 흰 가운이 28 밖에 차이가
 *        안 나 **가운이 통째로 지워졌다.**
 *     ② 가장자리에서 홍수 채우기(고정 임계값) → 배경이 **그라데이션**이라 얼룩이 남았다.
 *     ③ 이웃과 비교하며 번지기 → 가운을 타고 넘어가 인물을 먹었다.
 *
 *   ★ 이번에는 배경을 **행마다 모델링**한다. 스튜디오 배경은 좌→우로 매끄럽게 변하고
 *     인물은 가운데에 있으므로, 각 행의 **왼쪽 끝 12px 과 오른쪽 끝 12px 의 중앙값**을
 *     양 끝점으로 잡아 가로로 선형 보간하면 그 행의 배경을 꽤 정확히 예측할 수 있다.
 *     고정 임계값이 아니라 **예측값과의 차이**로 자르므로 그라데이션에 안 흔들린다.
 *
 *   ★ 구멍은 **가장자리에서의 홍수 채우기**로 막는다. '배경처럼 보이는 픽셀' 중
 *     화면 가장자리에서 이어지는 것만 진짜 배경이다. 가운 주름의 그늘처럼 인물 안쪽에
 *     갇힌 어두운 부분은 가장자리에서 못 닿으므로 인물로 남는다.
 *
 * ⚠️ 원본(-bg.jpg)을 지우지 말 것 — 여기서 읽는다. 톤을 맞춰 둔 판이라 셋의 배경이 같다.
 * ⚠️ 결과가 이상하면 임계값을 만지기 전에 **왜 그런지 재 볼 것.** 위 세 번의 실패는
 *    전부 '숫자를 조금씩 바꿔 보기' 로 시간을 쓴 경우였다.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  '20211123_b07b19257d734-bg.jpg',
  '20210906_28ce020ff6ebb-bg.jpg',
  '20210906_d48365779037c-bg.jpg',
];

/** 배경으로 볼 최대 차이. 이보다 크면 인물. */
const T_BG = 15;
/** 완전히 인물로 볼 차이. T_BG~T_ON 사이는 반투명(가장자리 부드럽게). */
const T_ON = 30;
/** 양 끝에서 배경을 몇 px 씩 표본으로 삼나. */
const EDGE = 12;

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

for (const file of FILES) {
  const src = `public/img/${file}`;
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const C = info.channels;
  const at = (x, y) => (y * W + x) * C;

  /* ── ① 행마다 배경을 예측하고 '배경다움' 을 잰다 ──────────────── */
  const diff = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    const l = [[], [], []];
    const r = [[], [], []];
    for (let k = 0; k < EDGE; k++) {
      const i = at(k, y);
      const j = at(W - 1 - k, y);
      for (let c = 0; c < 3; c++) {
        l[c].push(data[i + c]);
        r[c].push(data[j + c]);
      }
    }
    const L = l.map(median);
    const R = r.map(median);
    for (let x = 0; x < W; x++) {
      const t = x / (W - 1);
      const i = at(x, y);
      let s = 0;
      for (let c = 0; c < 3; c++) {
        const pred = L[c] + (R[c] - L[c]) * t;
        const d = data[i + c] - pred;
        s += d * d;
      }
      diff[y * W + x] = Math.sqrt(s);
    }
  }

  /* ── ② 가장자리에서 이어지는 '배경다운' 픽셀만 진짜 배경 ────────── */
  const isBg = new Uint8Array(W * H); // 1 = 진짜 배경
  const stack = [];
  const push = (x, y) => {
    const k = y * W + x;
    if (isBg[k] || diff[k] > T_BG) return;
    isBg[k] = 1;
    stack.push(k);
  };
  for (let x = 0; x < W; x++) {
    push(x, 0);
    push(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    push(0, y);
    push(W - 1, y);
  }
  while (stack.length) {
    const k = stack.pop();
    const x = k % W;
    const y = (k - x) / W;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }

  /* ── ③ 알파 — 배경 0, 인물 1, 경계는 차이에 따라 부드럽게 ───────── */
  const alpha = new Uint8Array(W * H);
  for (let k = 0; k < W * H; k++) {
    if (isBg[k]) {
      /* 진짜 배경이라도 인물에 가까운 픽셀은 반투명으로 남겨 테두리를 부드럽게 한다. */
      const a = (diff[k] - T_BG) / (T_ON - T_BG);
      alpha[k] = Math.round(255 * Math.min(1, Math.max(0, a)));
    } else {
      alpha[k] = 255;
    }
  }

  /* ── ④ 경계 1px 흐리기 — 톱니를 없앤다 ─────────────────────────── */
  const soft = await sharp(Buffer.from(alpha), { raw: { width: W, height: H, channels: 1 } })
    .blur(0.8)
    .raw()
    .toBuffer();

  /* ── ⑤ 합쳐서 PNG ─────────────────────────────────────────────── */
  const out = Buffer.alloc(W * H * 4);
  for (let k = 0; k < W * H; k++) {
    const i = k * C;
    out[k * 4] = data[i];
    out[k * 4 + 1] = data[i + 1];
    out[k * 4 + 2] = data[i + 2];
    out[k * 4 + 3] = soft[k];
  }
  const dst = src.replace(/-bg\.jpg$/, '-cut.png');
  await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png({ compressionLevel: 9 }).toFile(dst);

  const kept = soft.reduce((n, a) => n + (a > 127 ? 1 : 0), 0);
  console.log(`${file} → ${dst.split('/').pop()}  인물 비율 ${((kept / (W * H)) * 100).toFixed(1)}%`);
}
