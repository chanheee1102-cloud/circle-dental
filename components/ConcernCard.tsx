'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Concern } from '@/lib/concerns';

/**
 * 망설임 카드 한 장 — 진입 파도 + 포인터 스포트라이트.
 *
 * ★★ 왜 이 섹션만 따로 움직이는가 (2026-08-18 운영자: "임팩트 좀 많이 넣어줘") ★★
 *   전역 규칙은 '.reveal 하나만 쓴다' 이고 그 판단은 지금도 맞다. 다만 이 섹션은
 *   페이지에서 **처음으로 어두워지는 자리**다. 스크롤이 흰 면을 지나다 갑자기 검은 면에
 *   들어서는 지점이라, 여기서 한 번 세게 주고 나머지를 조용히 두는 편이 낫다.
 *   (효과를 여기저기 흩뿌리는 것과 한 곳에 몰아 주는 것은 전혀 다른 결과가 된다.)
 *
 * ★ 두 가지만 한다
 *   ① 진입 — 아래에서 올라오며 살짝 커진다. 대각선 순서로 번져 파도처럼 읽힌다.
 *   ② 스포트라이트 — 마우스를 얹으면 **커서 위치**에서 빛이 번진다.
 *     어두운 면에서만 성립하는 효과라 이 섹션 고유의 인상이 된다.
 *
 * ⚠️ 좌표는 state 가 아니라 **CSS 변수로 바로 쓴다.** setState 로 하면 마우스가 움직이는
 *    내내 리렌더가 걸린다(카드 여섯 장이면 그대로 프레임 드롭이다).
 * ⚠️ prefers-reduced-motion 이면 진입 효과 없이 처음부터 보이고, 스포트라이트도 안 붙인다.
 */
export function ConcernCard({ concern, order }: { concern: Concern; order: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const [shown, setShown] = useState(false);
  const [motion, setMotion] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMotion(false);
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const track = (e: React.MouseEvent<HTMLElement>) => {
    if (!motion) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <li
      ref={ref}
      className={`concern h-full ${shown ? 'is-shown' : ''}`}
      /* 대각선으로 번지게 — 3열에서 (행+열) 순서면 왼쪽 위에서 오른쪽 아래로 파도가 친다. */
      style={{ transitionDelay: `${((order % 3) + Math.floor(order / 3)) * 95}ms` }}
    >
      <Link
        href={concern.href}
        onMouseMove={track}
        className="concern-card group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/[0.055] p-8 transition-[transform,background-color] duration-300 hover:-translate-y-1.5 hover:bg-white/[0.09]"
      >
        {/*
          따옴표를 **글자로** 쓴다. 직전에는 카드 위에 큰 장식 글리프를 세웠는데,
          그건 환자의 말을 인용부호로 감싸는 것과 달라서 화면에서만 예쁘고
          스크린리더에는 아무것도 아니었다. 여기서는 따옴표가 실제 인용부호다.
        */}
        <p className="relative text-[17px] leading-[1.5] font-bold text-white">
          &ldquo;{concern.quote}&rdquo;
        </p>
        <p className="relative mt-4 flex-1 text-[14.5px] leading-[1.8] text-brand-200/85">
          {concern.answer}
        </p>
        {/*
          링크 글자에 **강조색을 쓰지 않는다.** 어디로 가는지는 알려 줘야 하지만
          ('자세히 보기' 로 뭉뚱그리지 않는 이유), 카드 여섯 장에서 여섯 번
          강조색이 반복되면 그게 곧 상투적인 인상을 만든다.
        */}
        <span className="relative mt-7 inline-flex items-center gap-2 text-[13.5px] font-bold text-brand-300 transition-colors group-hover:text-white">
          {concern.cta}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </span>
      </Link>
    </li>
  );
}
