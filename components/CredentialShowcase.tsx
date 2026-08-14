'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IMG } from '@/lib/assets';

/**
 * 인증패 쇼케이스 — 한 장씩, 가운데, 크게. 자동으로 넘어간다.
 *
 * ★★ 왜 나란히 늘어놓지 않는가 (2026-08-14 운영자) ★★
 *   네 장을 한 줄에 두면 한 장당 폭이 좁아져 **무엇이 적힌 인증서인지 안 보인다.**
 *   그러면 "인증서가 네 개 있다" 는 인상만 남고 정작 근거는 전달되지 않는다.
 *   한 장씩 크게 보여 주면 발급 기관 로고와 이름이 읽히고, 그게 근거의 핵심이다.
 *
 * ★★ 원본이 236×242px 다 — 무한정 키울 수 없다 ★★
 *   1.3배(약 300px)를 넘기면 눈에 띄게 뭉개진다. 그래서 **사진 자체는 300px 선에서
 *   멈추고, 대신 무대(스테이지)를 넓게 잡아** 한 장이 홀로 서 있게 만든다.
 *   크기가 아니라 여백이 '크다' 는 인상을 만든다.
 *   ⚠️ 더 크게 보여 주려면 원본 파일부터 다시 받아야 한다. 지금 파일로 늘리면 흐려진다.
 *
 * ★ 네 장을 전부 DOM 에 두고 투명도만 바꾼다.
 *   한 장만 렌더하면 나머지 세 장의 alt 텍스트가 HTML 에서 사라져 검색·답변 엔진이
 *   "인증서가 네 개" 라는 사실을 읽지 못한다. 보이지 않는 장은 aria-hidden 으로 가려
 *   스크린리더가 네 번 읽지 않게 한다.
 *
 * ★ 멈출 조건을 넉넉히 — 자동으로 움직이는 화면은 잘못 만들면 그 자체가 방해다.
 *   마우스·포커스 / 백그라운드 탭 / prefers-reduced-motion.
 */
const INTERVAL_MS = 4200;

export function CredentialShowcase() {
  const shots = IMG.credentials;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (paused || shots.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tick = () => {
      /* 다른 탭에 있을 때는 넘기지 않는다 — 돌아왔을 때 엉뚱한 장에 가 있지 않게. */
      if (!document.hidden) setI((n) => (n + 1) % shots.length);
    };
    timer.current = window.setInterval(tick, INTERVAL_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, shots.length]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* 무대 — 높이를 고정한다. 인증서 비율이 제각각(242/178)이라 그대로 두면 줄이 튄다. */}
      <div className="relative flex h-[300px] items-center justify-center sm:h-[340px]">
        {shots.map((c, n) => (
          <div
            key={c.src}
            aria-hidden={n !== i}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
              n === i ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
            }`}
          >
            <Image
              src={c.src}
              alt={c.label}
              width={236}
              height={242}
              /* 첫 장만 미리 받는다. 넷을 한꺼번에 받을 이유가 없다. */
              loading={n === 0 ? 'eager' : 'lazy'}
              sizes="300px"
              className="h-auto max-h-[240px] w-auto drop-shadow-[0_14px_34px_rgba(58,33,26,0.22)] sm:max-h-[280px]"
            />
          </div>
        ))}
      </div>

      {/*
        이름은 무대 아래 고정 자리에 둔다. 사진과 함께 움직이면 글자가 흔들려 읽기 어렵다.
        ★ 두 줄까지 들어갈 높이를 잡아 둔다 — 이름 길이가 달라 한 줄/두 줄이 오가면
          아래 점들이 위아래로 튄다.
      */}
      <p className="flex min-h-[3.2rem] items-start justify-center px-4 text-center text-[14px] leading-relaxed font-bold text-ink">
        <span key={i} className="enter">
          {shots[i].label}
        </span>
      </p>

      {/* 몇 번째인지 + 직접 고르기. 자동으로만 넘어가면 놓친 장을 다시 볼 방법이 없다. */}
      <div className="mt-1 flex items-center justify-center gap-2.5">
        {shots.map((c, n) => (
          <button
            key={c.src}
            type="button"
            onClick={() => setI(n)}
            aria-label={`${n + 1}번째 인증서 — ${c.label}`}
            aria-current={n === i}
            className={`h-2 rounded-full transition-all duration-300 ${
              n === i ? 'w-7 bg-brand-600' : 'w-2 bg-brand-300 hover:bg-brand-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
