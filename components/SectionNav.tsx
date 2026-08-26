'use client';

import { useEffect, useState } from 'react';

/**
 * 진료 페이지 섹션 내비 — 떠 있는 알약 바.
 *
 * ★★ 왜 목차 카드로는 안 되나 ★★
 *   본문 위쪽에 목차 카드가 이미 있지만 그건 **한 번 지나가면 사라진다.** 이 페이지는
 *   스크롤이 10,000px 을 넘고, 아래로 내려간 사람이 "비용은 어디 있지" 를 물을 때
 *   돌아갈 길이 없다. 그래서 따라다니는 바가 따로 필요하다.
 *
 * ★★ 왜 전폭 띠가 아니라 알약인가 (2026-08-26) ★★
 *   전폭 띠 + 밑줄 활성 표시는 국내 병원 사이트가 다 쓰는 문법이라, 그대로 두면
 *   어느 병원 페이지인지 구분이 안 된다는 지적을 받았다. 화면 폭을 가로지르지 않고
 *   **떠 있는 알약**으로 두면 밑의 내용이 계속 보이고, 바가 UI 부품처럼 읽힌다.
 *
 * ⚠️ top 값은 스크롤된 뒤의 헤더 높이다(SiteHeader.tsx:103 — 52px / sm 68px).
 *   헤더 높이를 바꾸면 여기도 같이 고칠 것.
 * ⚠️ z-40 — 헤더(z-50) 보다 낮아야 헤더 메가메뉴가 이 바 위로 펼쳐진다.
 * ⚠️ 앵커가 실제로 존재하는 항목만 넘길 것 — 없는 id 로 링크하면 눌러도 아무 일이 없다.
 */
export function SectionNav({ items }: { items: Array<{ id: string; label: string }> }) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const targets = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    /*
     * rootMargin 윗값을 크게 잡아 **화면 상단 근처에 온 제목**을 현재 구간으로 친다.
     * 기본값으로 두면 아래쪽 섹션이 먼저 잡혀 표시가 실제 읽는 위치보다 앞서 뛴다.
     */
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-140px 0px -70% 0px', threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <div className="sticky top-[60px] z-40 flex justify-center px-4 sm:top-[78px]">
      <nav
        aria-label="이 페이지 안에서 이동"
        className="max-w-full overflow-x-auto rounded-full border border-brand-200/70 bg-white/90 p-1.5 shadow-[var(--shadow-soft)] backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-0.5">
          {items.map((i) => (
            <a
              key={i.id}
              href={`#${i.id}`}
              aria-current={active === i.id ? 'true' : undefined}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap transition-colors ${
                active === i.id
                  ? 'bg-ink text-white'
                  : 'text-ink-soft hover:bg-brand-100 hover:text-ink'
              }`}
            >
              {i.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
