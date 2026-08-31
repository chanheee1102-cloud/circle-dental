/**
 * 의료진 사진의 **배경 톤을 하나로 맞춘다.**
 *
 * ★★ 왜 (2026-08-31 운영자: "의사 뒤에 배경 색 통일 시키고") ★★
 *   세 사진이 다른 날 다른 배경에서 찍혀 뒤 색이 제각각이다(실측 — 귀퉁이 평균):
 *       변석호 #c0bdba (따뜻한 회색) · 김동주 #dddfe4 (밝은 푸른 회색) · 김인진 #cdcdd3
 *   한 줄에 세우면 그 차이가 그대로 보인다.
 *
 * ★★★ **배경을 오려내려던 세 번의 시도는 전부 실패했다 — 기록해 둔다** ★★★
 *   ① 배경색에 가까운 픽셀을 전부 치환 → 배경(#dddfe4)과 **흰 가운의 색 거리가 28**뿐이라
 *      가운이 통째로 뭉개지고 얼굴에 회색 얼룩이 생겼다(바뀐 픽셀 85%).
 *   ② 테두리에서 번지는 채우기(연결성 이용) → 문턱을 좁히니 인물은 살았지만
 *      **배경이 얼룩**이 됐다. 스튜디오 조명의 미세한 그라데이션이 씨앗 색에서 멀어져서다.
 *   ③ 이웃 픽셀 기준 영역 성장 → 배경은 평평해졌지만 **흰 가운이 먹혔다.**
 *      가운과 배경의 경계가 부드러워 성장이 그대로 걸어 들어간다.
 *   → 흰 가운과 밝은 회색 배경은 **단순한 규칙으로는 못 가른다.** 제대로 하려면
 *     사람이 오려내거나 분할 모델이 필요하다. 여기서 더 시도하지 말 것.
 *
 * ★ 그래서 **오려내지 않는다.** 사진 전체에 아주 작은 톤 보정을 걸어 배경끼리만 맞춘다.
 *   채널마다 같은 비율을 곱하는 화이트밸런스식 보정이라 **인공물이 생길 수 없다** —
 *   경계도 마스크도 없기 때문이다. 비율이 0.9~1.1 안이면 피부색 변화는 눈에 안 띈다.
 * ⚠️ 비율이 그 범위를 벗어나면 멈춘다. 인물 색이 바뀌는 것은 의료진 사진에서 사고다.
 * ⚠️ 원본을 덮어쓰지 않는다 — `-bg` 를 붙인 새 파일. 상세 페이지는 원본을 그대로 쓴다.
 *
 * 쓰는 법:  node scripts/normalizeDoctorBg.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 맞출 배경색 — 세 사진의 가운데쯤(김인진 #cdcdd3).
 * ★ 가장 밝은 사진에 맞추면 나머지를 밝혀야 하는데, 밝히면 흰 가운이 날아간다.
 *   가운데 값이면 두 사진 모두 보정폭이 작다.
 */
const TARGET = [205, 205, 211];

/** 이 밖으로 벗어나는 보정은 하지 않는다 — 인물 색이 눈에 띄게 변한다. */
const SAFE = { min: 0.88, max: 1.14 };

const FILES = [
  '20211123_b07b19257d734.jpg',
  '20210906_28ce020ff6ebb.jpg',
  '20210906_d48365779037c.jpg',
];

const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

for (const file of FILES) {
  const src = path.join('public/img', file);
  if (!fs.existsSync(src)) { console.log('없음:', src); continue; }

  /* 위쪽 귀퉁이 두 곳을 재서 이 사진의 배경색을 잡는다 — 인물은 가운데 아래에 있다. */
  const meta = await sharp(src).metadata();
  const samples = [];
  for (const [l, t] of [[0, 0], [meta.width - 40, 0]]) {
    const s = await sharp(src).extract({ left: Math.max(0, l), top: t, width: 36, height: 36 }).stats();
    samples.push(s.channels.slice(0, 3).map((c) => c.mean));
  }
  const bg = [0, 1, 2].map((i) => (samples[0][i] + samples[1][i]) / 2);

  /* 채널마다 배경을 목표로 옮기는 비율. */
  const ratio = [0, 1, 2].map((i) => TARGET[i] / bg[i]);
  const worst = ratio.reduce((a, r) => Math.max(a, Math.abs(Math.log(r))), 0);
  const outOfRange = ratio.some((r) => r < SAFE.min || r > SAFE.max);

  const out = path.join('public/img', file.replace(/\.jpg$/i, '-bg.jpg'));
  if (outOfRange) {
    /* ⚠️ 보정폭이 크면 손대지 않고 원본을 그대로 복사한다 — 인물 색을 바꾸느니 그대로 둔다. */
    fs.copyFileSync(src, out);
    console.log(file.slice(0, 24), hex(bg), '→ 보정폭이 커서 원본 유지', ratio.map((r) => r.toFixed(2)).join('/'));
    continue;
  }

  await sharp(src)
    .linear(ratio, [0, 0, 0])
    .jpeg({ quality: 92 })
    .toFile(out);

  const after = await sharp(out).extract({ left: 0, top: 0, width: 36, height: 36 }).stats();
  const got = after.channels.slice(0, 3).map((c) => c.mean);
  console.log(
    file.slice(0, 24),
    hex(bg), '→', hex(got),
    '· 보정', ratio.map((r) => r.toFixed(3)).join(' / '),
    worst < 0.08 ? '(눈에 안 띄는 폭)' : '(확인 필요)',
  );
}
