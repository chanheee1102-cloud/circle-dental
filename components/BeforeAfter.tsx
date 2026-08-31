'use client';

import Image from 'next/image';
import { useCallback, useId, useRef, useState } from 'react';

/**
 * 치료 전후를 **손으로 끌어서** 겹쳐 보는 비교판.
 *
 * ★★ 왜 이걸 만들었나 ★★
 *   두 장을 나란히 놓으면 눈이 좌우로 튀면서 어디가 달라졌는지 못 찾는다. 같은 자리에
 *   겹쳐 놓고 경계를 움직이면 **바뀐 부분만** 남아 보인다. 방사선 사진처럼 구도가 똑같은
 *   두 장에서 특히 잘 듣는다.
 *
 * ⚠️ 의료법 제56조 — 치료 전후 사진은 제한되는 광고 유형이다. 이 부품은 '보여 주는 방법'
 *    일 뿐이고, **게시 여부와 고지는 쓰는 쪽 책임**이다. 쓰는 페이지에서 개인차·부작용
 *    고지를 반드시 함께 렌더할 것(lib/implantCases.ts 머리말과 같은 원칙).
 *
 * ★ 접근성 — 마우스로만 되면 안 된다. range 입력을 겹쳐 두어 키보드 화살표로도 움직이고,
 *   스크린리더에는 두 사진의 alt 가 그대로 읽힌다.
 * ⚠️ 상태를 CSS 변수로 바로 밀어 넣는다. React state 로 매 프레임 리렌더하면 끌 때 끊긴다.
 */
export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel = '치료 전',
  afterLabel = '치료 후',
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const id = useId();

  const move = useCallback((v: number) => {
    const p = Math.max(0, Math.min(100, v));
    setPct(p);
    wrap.current?.style.setProperty('--x', `${p}%`);
  }, []);

  const fromPointer = useCallback(
    (clientX: number) => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      move(((clientX - r.left) / r.width) * 100);
    },
    [move],
  );

  return (
    <div
      ref={wrap}
      style={{ ['--x' as string]: '50%' }}
      className="group relative aspect-[4/3] w-full touch-none overflow-hidden rounded-2xl border border-brand-200/80 bg-brand-900 select-none"
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        fromPointer(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) fromPointer(e.clientX);
      }}
    >
      {/* 아래층 — 치료 후 */}
      <Image src={after} alt={afterAlt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />

      {/* 위층 — 치료 전. 경계까지만 보인다. */}
      <div className="absolute inset-0" style={{ clipPath: 'inset(0 calc(100% - var(--x)) 0 0)' }}>
        <Image src={before} alt={beforeAlt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
      </div>

      {/* 경계선과 손잡이 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
        style={{ left: 'var(--x)' }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-parchment text-[11px] font-black text-ink shadow-[var(--shadow-lift)]">
          ↔
        </span>
      </div>

      <span className="pointer-events-none absolute top-3 left-3 rounded-md bg-brand-900/75 px-2 py-1 text-[11px] font-black text-white">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-md bg-brand-900/75 px-2 py-1 text-[11px] font-black text-white">
        {afterLabel}
      </span>

      {/* 키보드용 — 화면에는 안 보이지만 초점을 받고 화살표로 움직인다. */}
      <label htmlFor={id} className="sr-only">
        치료 전후 비교 경계 위치
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => move(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
