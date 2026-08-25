'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * 먼지가 모여 형태를 이루듯 나타나는 배너.
 *
 * ★★ 왼쪽에서 닦이는 방식 → 먼지 (2026-08-25 운영자: "이거 먼지가 모이듯이
 *    스크롤이벤트 넣어줘") ★★
 *    사진의 색을 **격자로 찍어 낟알을 만들고**, 그 낟알들을 사방으로 흩어 둔 뒤
 *    스크롤에 맞춰 제자리로 모은다. 다 모이면 낟알 그림을 걷고 진짜 사진이 남는다.
 *
 * ★★ 어떻게 '먼지'로 읽히게 만드는가 — 셋이 다 있어야 한다 ★★
 *   ① 낟알마다 **시작 시각이 다르다**(0~45% 구간에 흩어진 지연). 다 같이 움직이면
 *      먼지가 아니라 사진 한 장이 확대되는 것으로 보인다.
 *   ② 방향이 제각각이다 — 각도는 무작위, 거리는 60~260px.
 *   ③ 모이면서 진해진다(투명 → 불투명). 처음부터 진하면 '조각난 사진'이지 먼지가 아니다.
 *
 * ★ 스크롤에 매달아 둔다. 한 번 재생하고 끝나는 게 아니라 **스크롤을 되돌리면 다시
 *   흩어진다** — 이 사이트의 다른 스크롤 연출(인증패 부채, 의료진 시차)과 같은 성질이다.
 *
 * ⚠️⚠️ 사진을 새로 내려받지 않는다 ⚠️⚠️
 *   next/image 가 이미 그려 둔 <img> 를 그대로 캔버스에 옮겨 색을 읽는다. 같은 주소로
 *   new Image() 를 하나 더 만들면 **최적화 안 된 원본을 한 번 더 받는다**(배너는 큰
 *   사진이라 그 값이 크다).
 * ⚠️ 자르기(object-cover / object-right)를 캔버스에서도 같은 식으로 계산해야 한다.
 *   안 그러면 낟알 그림과 진짜 사진의 구도가 어긋나 마지막에 화면이 한 번 튄다.
 *
 * ⚠️ 손가락 입력·모션 감소에서는 캔버스를 아예 만들지 않는다 — 낟알 수천 개를 매
 *   프레임 찍는 일이라 값이 싸지 않고, 그 환경에서는 처음부터 완성된 사진이 낫다.
 */

/** 가로 낟알 수 — 화면 폭에 따라. 많을수록 곱지만 매 프레임 그릴 사각형도 그만큼 는다. */
const MAX_COLS = 140;

export function DustReveal({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current;
    const canvas = cv.current;
    if (!el || !canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) {
      el.style.setProperty('--dust-real', '1');
      canvas.style.display = 'none';
      return;
    }

    const img = el.querySelector('img');
    if (!img) return;

    let raf = 0;
    let cancelled = false;
    /** 낟알: 목표 좌표 · 흩어진 시작 좌표 · 색 · 시작 지연 */
    let grains: {
      tx: number; ty: number; ox: number; oy: number;
      r: number; g: number; b: number; d: number;
    }[] = [];
    let cell = 1;
    /*
      ⚠️ 스크롤이 멈추면 다시 그리지 않는다.
        이 연출은 스크롤에 매달려 있어서 p 가 안 변하면 화면도 안 변한다. 그런데도 매
        프레임 낟알 수천 개를 다시 찍으면 **가만히 있는 동안에도** CPU 를 먹는다.
        실측(1400x900, 헤드리스): 먼지를 그리는 동안 프레임 간격이 16.7ms -> 21.1ms 로
        늘었다. 안 변했으면 건너뛰는 것만으로 멈춰 있을 때의 값이 0 이 된다.
    */
    let lastP = -1;

    const build = () => {
      const box = el.getBoundingClientRect();
      if (box.width < 2 || box.height < 2 || !img.naturalWidth) return false;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);

      const cols = Math.min(MAX_COLS, Math.max(48, Math.round(box.width / 9)));
      const rows = Math.max(12, Math.round(cols * (box.height / box.width)));
      cell = box.width / cols;

      /*
        object-cover + object-right 를 그대로 다시 계산한다.
        가로가 모자라면 **왼쪽을 잘라** 오른쪽(노트북)을 남긴다 — 화면과 같은 구도.
      */
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const scale = Math.max(box.width / nw, box.height / nh);
      const dw = nw * scale;
      const dh = nh * scale;
      const sx = (dw - box.width) / scale;
      const sy = (dh - box.height) / 2 / scale;
      const sw = box.width / scale;
      const sh = box.height / scale;

      /* 색은 작은 캔버스에서 한 번만 읽는다 — 매 프레임 읽으면 못 쓴다. */
      const small = document.createElement('canvas');
      small.width = cols;
      small.height = rows;
      const sctx = small.getContext('2d', { willReadFrequently: true });
      if (!sctx) return false;
      try {
        sctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      } catch {
        return false;
      }
      let data: Uint8ClampedArray;
      try {
        data = sctx.getImageData(0, 0, cols, rows).data;
      } catch {
        return false;
      }

      const next: typeof grains = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const a = data[i + 3];
          if (a < 8) continue;
          const angle = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * 200;
          next.push({
            tx: x * cell,
            ty: y * (box.height / rows),
            ox: Math.cos(angle) * dist,
            oy: Math.sin(angle) * dist,
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
            /* ⚠️ 0.45 를 넘기지 말 것 — 마지막 낟알이 너무 늦게 도착하면 '느리다'가 된다. */
            d: Math.random() * 0.45,
          });
        }
      }
      grains = next;
      return true;
    };

    const draw = () => {
      const ctx = canvas.getContext('2d');
      const box = el.getBoundingClientRect();
      if (!ctx || !grains.length) return;

      /* 아래에서 올라오는 동안 0 → 1. 인증패 부채와 같은 식이다. */
      const span = window.innerHeight * 0.75;
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight - box.top - window.innerHeight * 0.2) / span),
      );

      /* 다 모이기 조금 전부터 진짜 사진이 올라온다 — 겹치는 구간이 있어야 안 튄다. */
      const real = Math.min(1, Math.max(0, (p - 0.7) / 0.3));
      el.style.setProperty('--dust-real', real.toFixed(3));
      canvas.style.opacity = p >= 0.999 ? '0' : '1';
      if (p >= 0.999) { lastP = p; return; }
      if (Math.abs(p - lastP) < 0.0015) return;
      lastP = p;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, box.width, box.height);

      /*
        ⚠️ 날아오는 동안은 낟알을 작게, 도착하면 칸을 꽉 채운다.
           끝까지 같은 크기면 '모자이크 조각이 날아온다'로 보이고, 작게 시작해야
           '먼지'로 읽힌다. 도착 시 0.6px 더 키우는 것은 칸 사이 실틈을 메우려는 것이다.
      */
      for (let i = 0; i < grains.length; i++) {
        const gr = grains[i];
        const local = Math.min(1, Math.max(0, (p - gr.d) / (1 - gr.d)));
        if (local <= 0) continue;
        const e = 1 - Math.pow(1 - local, 3);
        const k = 1 - e;
        ctx.globalAlpha = e;
        ctx.fillStyle = `rgb(${gr.r},${gr.g},${gr.b})`;
        const size = cell * (0.45 + 0.55 * e) + 0.6;
        ctx.fillRect(gr.tx + gr.ox * k, gr.ty + gr.oy * k, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (cancelled) return;
      if (!build()) {
        /* 사진이 아직 안 왔다 — 다음 프레임에 다시. */
        raf = requestAnimationFrame(start);
        return;
      }
      const loop = () => {
        draw();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      build();
    };

    if (img.complete) start();
    else img.addEventListener('load', start, { once: true });

    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      img.removeEventListener('load', start);
    };
  }, []);

  return (
    <div ref={host} className={`dust-host ${className}`}>
      {children}
      <canvas ref={cv} aria-hidden className="dust-canvas" />
    </div>
  );
}
