'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IMG } from '@/lib/assets';

/**
 * 병원 둘러보기 — **큰 사진 한 장 + 아래 썸네일 줄.**
 *
 * ★★ 어디에 쓰는가 — /about/tour 한 곳뿐이다 ★★
 *   운영자가 기존 홈페이지(circle-dental.co.kr/preview)의 '둘러보기' 화면을 보여 주며
 *   "우리도 이렇게 하는거 어때". 원본은 큰 사진 하나 + 썸네일 여섯 장이다.
 *   ⚠️⚠️ **홈에 넣지 말 것** ⚠️⚠️ 홈은 저절로 옆으로 흐르는 띠(InteriorSlider)를
 *      그대로 쓴다 — 2026-08-31 운영자: "메인페이지는 아까처럼 자동으로 지나가는
 *      그대로 냅두고". 한 번 홈에 넣었다가 되돌렸다.
 *
 * ★ 왜 격자에서 이 짜임으로 바꿨나
 *   격자는 열두 장을 한 번에 보여 주지만 **한 장도 크게 볼 수 없었다.** 둘러보기는
 *   '어떤 곳인지 미리 본다' 는 페이지라 크게 보는 것이 목적에 맞는다.
 *
 * ⚠️⚠️ **썸네일의 alt 를 비우지 말 것** ⚠️⚠️
 *   이 페이지는 원래 사진마다 설명을 한 줄씩 달아 **인용할 문장이 있는 페이지**로 만든
 *   것이다(2026-08-14: "인용할 문장이 하나도 없는 페이지였다"). 큰 뷰어로 바꾸면 화면에
 *   보이는 설명은 한 줄뿐이라, 나머지 열한 줄은 썸네일 img 의 alt 로 문서에 남긴다.
 *   alt 를 비우면 그 열한 줄이 문서에서 통째로 사라진다.
 * ⚠️ 스크린리더는 button 의 aria-label 을 읽으므로 설명이 두 번 읽히지는 않는다.
 *
 * ★ 자동으로 넘기지 않는다 — 원본도 그렇고, 여기는 **찾아 들어와서 보는** 자리다.
 *   고르는 사람 앞에서 화면이 제멋대로 넘어가면 방해가 된다.
 *   (저절로 움직여 "볼 것이 더 있다" 를 알리는 역할은 홈의 InteriorSlider 가 맡는다.)
 */
export function InteriorGallery() {
  const shots = IMG.interior;
  const [i, setI] = useState(0);
  const thumbsRef = useRef<HTMLUListElement>(null);

  const go = useCallback(
    (next: number) => setI(((next % shots.length) + shots.length) % shots.length),
    [shots.length],
  );

  /*
   * ⚠️ 고른 썸네일이 화면 밖이면 끌어온다 — 좁은 화면에서 썸네일 줄은 옆으로 스크롤된다.
   * ⚠️ block:'nearest' 다. 'center' 로 두면 세로로도 움직여 페이지가 튄다.
   * ⚠️ 첫 렌더에서는 건너뛴다 — 페이지를 열자마자 스크롤이 움직이면 안 된다.
   */
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = thumbsRef.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [i]);

  const cur = shots[i];

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(i - 1);
        if (e.key === 'ArrowRight') go(i + 1);
      }}
    >
      {/*
        큰 사진.
        ⚠️ 4:3 을 유지한다 — 원본 사진이 4:3 이라 16:10 같은 비율로 담으면 위아래가 잘린다.
           잘라서 시원해 보이는 것보다 다 보이는 것이 이 페이지의 일이다.
        ⚠️ key 는 일부러다. 바뀔 때마다 요소가 새로 붙어 fade 가 다시 돈다.
      */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-100">
        <Image
          key={cur.src}
          src={cur.src}
          alt={cur.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1000px"
          priority={i === 0}
          className="animate-[galleryFade_0.4s_ease] object-cover"
        />

        {/*
          ⚠️ 다음 한 장을 미리 받아 둔다 — 안 받으면 넘길 때마다 빈 칸이 한 번 스친다.
             열두 장을 통째로 받지는 않는다(첫 화면이 느려진다). 한 장이면 충분하다.
        */}
        <Image
          key={`pre-${shots[(i + 1) % shots.length].src}`}
          src={shots[(i + 1) % shots.length].src}
          alt=""
          aria-hidden
          width={1}
          height={1}
          className="pointer-events-none absolute h-px w-px opacity-0"
        />

        <Arrow side="left" onClick={() => go(i - 1)} />
        <Arrow side="right" onClick={() => go(i + 1)} />

        {/* 몇 번째인지 — 좁은 화면에서는 썸네일이 다 안 보이므로 숫자로도 말한다. */}
        <p className="absolute right-4 bottom-4 rounded-full bg-charcoal/70 px-3 py-1 text-[14px] font-bold text-parchment tabular-nums">
          {i + 1} / {shots.length}
        </p>
      </div>

      {/*
        캡션 — 화면에 보이는 설명. lib/assets.ts 의 alt 를 그대로 쓴다.
        ⚠️ 화면 설명과 기계가 읽는 설명이 갈라지면 둘 중 하나는 반드시 낡는다.
        ⚠️ 두 줄이 될 때 아래 썸네일이 들썩이지 않도록 최소 높이를 둔다.
      */}
      {/* ⚠️ max-w 를 지우지 말 것 — 없으면 넓은 화면에서 한 줄이 76자가 된다(실측). */}
      <p className="mt-4 min-h-[3.25rem] max-w-[42em] text-[16.5px] leading-[1.6] text-ink-soft">
        {cur.alt}
      </p>

      {/*
        썸네일 줄 — 열둘이 한 줄에 들어간다(좁은 화면에서는 옆으로 스크롤).
        ⚠️ button 이다. div 에 onClick 을 걸면 키보드로 못 고른다.
      */}
      <ul ref={thumbsRef} className="scrollbar-none mt-2 flex gap-2 overflow-x-auto pb-1">
        {shots.map((shot, n) => (
          <li key={shot.src} className="shrink-0">
            <button
              type="button"
              onClick={() => go(n)}
              aria-label={`${n + 1}번째 사진 — ${shot.alt}`}
              aria-current={n === i}
              className={`relative block aspect-[4/3] w-[84px] overflow-hidden rounded-[8px] transition-opacity sm:w-[96px] ${
                n === i ? 'opacity-100' : 'opacity-55 hover:opacity-85'
              }`}
            >
              {/* ⚠️ alt 를 비우지 말 것 — 위 주석 참조. 열두 줄의 설명이 여기 남는다. */}
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="96px"
                loading={n < 6 ? 'eager' : 'lazy'}
                className="object-cover"
              />
              {/*
                고른 것에 테두리 — 안쪽에 그린다(ring 대신 inset shadow).
                ⚠️ 바깥 테두리로 두면 썸네일이 1px 커져 줄 전체가 밀린다.
              */}
              {n === i && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[8px] shadow-[inset_0_0_0_2px_var(--color-signal)]"
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 좌우 화살표.
 * ⚠️ 사진 위에 얹히므로 바탕을 깔아야 한다 — 밝은 사진 위에서 흰 화살표는 사라진다.
 */
function Arrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? '이전 사진' : '다음 사진'}
      className={`absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-charcoal/55 text-[20px] text-parchment transition hover:bg-charcoal/75 ${
        side === 'left' ? 'left-3' : 'right-3'
      }`}
    >
      <span aria-hidden>{side === 'left' ? '‹' : '›'}</span>
    </button>
  );
}
