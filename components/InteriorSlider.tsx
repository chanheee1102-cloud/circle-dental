'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IMG } from '@/lib/assets';

/**
 * 병원 내부 슬라이드.
 *
 * ★ 왜 격자가 아니라 슬라이드인가
 *   내부 사진은 열두 장이다. 격자로 깔면 화면을 통째로 먹고 스크롤이 길어지는데,
 *   정작 한 장씩 자세히 보는 사람은 거의 없다. 옆으로 넘기면 자리는 한 줄만 쓰면서
 *   **장수는 다 보여 줄 수 있다.**
 *
 * ★★ 라이브러리를 쓰지 않는다 ★★
 *   `scroll-snap` 과 `scrollBy` 만으로 충분하다. 캐러셀 라이브러리는 수십 KB에
 *   접근성 문제를 함께 들여오는 경우가 많다. 여기서 필요한 것은 '가로로 밀린다' 뿐이다.
 *   - 터치·트랙패드는 브라우저가 알아서 처리한다(네이티브 스크롤).
 *   - 키보드는 좌우 화살표 버튼으로 닿는다.
 *   - 스크린리더에는 그냥 이미지 목록이다 — 가장 단순한 것이 가장 잘 읽힌다.
 *
 * ★ 자동으로 넘어간다(2026-08-14 운영자). 다만 멈출 조건을 넉넉히 뒀다 —
 *   마우스·터치·포커스·백그라운드 탭·prefers-reduced-motion. 아래 useEffect 주석 참고.
 */
export function InteriorSlider() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  /* 사용자가 보고 있는 동안에는 자동 넘김을 멈춘다(아래 useEffect 주석 참고). */
  const [paused, setPaused] = useState(false);

  /* 끝에 닿으면 화살표를 흐리게 — 눌리지 않는 버튼을 그대로 두면 고장으로 읽힌다. */
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  /* 한 번에 '보이는 폭' 만큼 민다 — 카드 폭을 계산하면 화면 크기마다 어긋난다. */
  const move = useCallback((dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }, []);

  /**
   * ★★ 자동으로 넘어간다 (2026-08-14 운영자: "버튼 말고 자동으로 계속 넘어가게") ★★
   *
   * 다만 자동 재생은 잘못 만들면 그 자체가 방해다. 네 가지를 지킨다.
   *   ① 끝에 닿으면 **처음으로 돌아온다.** 멈춰 버리면 고장으로 읽힌다.
   *   ② 마우스를 올리거나 손으로 만지는 동안 멈춘다 — 읽고 있는데 밀려나면 화가 난다.
   *   ③ 탭이 뒤로 가면 멈춘다. 안 보는 화면을 계속 움직이면 배터리만 쓴다.
   *   ④ prefers-reduced-motion 이면 아예 켜지 않는다. 움직임에 민감한 사용자에게
   *      자동으로 움직이는 화면은 장식이 아니라 증상을 부르는 자극이다.
   *
   * 4.2초는 사진 한 장을 훑기에는 충분하고 기다림으로 느껴지기 직전의 값이다.
   */
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el || document.hidden) return;
      const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atRight) el.scrollTo({ left: 0, behavior: 'smooth' });
      else move(1);
    }, 4200);
    return () => clearInterval(id);
  }, [paused, move]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <ul
        ref={trackRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {IMG.interior.map((src, i) => (
          <li
            key={src}
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-100 shadow-[var(--shadow-soft)]">
              <Image
                src={src}
                alt={`동그라미치과의원 내부 ${i + 1}`}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 32vw"
                /* 앞 세 장만 미리 받는다. 열두 장을 한꺼번에 받으면 첫 화면이 느려진다. */
                loading={i < 3 ? 'eager' : 'lazy'}
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>

      {/* 좌우 버튼 — 데스크톱에서만. 터치 기기는 손으로 미는 것이 더 빠르다. */}
      <div className="mt-6 hidden justify-end gap-2 lg:flex">
        <SlideButton dir="prev" disabled={atStart} onClick={() => move(-1)} />
        <SlideButton dir="next" disabled={atEnd} onClick={() => move(1)} />
      </div>
    </div>
  );
}

function SlideButton({
  dir,
  disabled,
  onClick,
}: {
  dir: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? '이전 사진' : '다음 사진'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-300 text-brand-600 transition-all hover:border-brand-500 hover:bg-brand-50 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <span aria-hidden className="text-[17px] leading-none">
        {dir === 'prev' ? '←' : '→'}
      </span>
    </button>
  );
}
