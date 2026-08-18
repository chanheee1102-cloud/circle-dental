'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 이 사이트의 스크롤 효과를 **혼자서** 담당하는 스크립트. 레이아웃에 한 번만 놓는다.
 *
 * ★★ 왜 한 곳으로 모았나 (2026-08-18 성능 실측) ★★
 *   전에는 Reveal 과 ConcernCard 가 각자 클라이언트 컴포넌트였고, 인스턴스마다
 *   IntersectionObserver 를 하나씩 만들었다. 홈 기준으로 래퍼 34개 + 고민 카드 6개 =
 *   **관찰자 40개, 하이드레이션 경계 40개**다. 실측에서 홈의 긴 작업이 1,748ms 로
 *   본문 페이지(160~212ms)의 여덟 배였고, 그 대부분이 한 덩어리의 하이드레이션이었다.
 *
 *   지금은 화면에 그려지는 것들이 전부 **서버가 만든 HTML** 이고, 움직임은 이 파일 하나가
 *   관찰자 **하나**로 처리한다. 요소가 늘어도 관찰자는 계속 하나다.
 *
 * ★ 라우트가 바뀌면 다시 건다 — usePathname 을 의존성에 둔다.
 *   SPA 이동 후에는 이전 페이지의 요소가 사라지고 새 요소가 생기므로, 한 번만 걸면
 *   두 번째 페이지부터 아무것도 안 올라온다(빈 화면처럼 보인다).
 *
 * ⚠️ prefers-reduced-motion 이면 관찰하지 않고 **즉시 다 보이게** 한다.
 *    움직임에 민감한 사용자에게 이건 장식이 아니라 불편이다.
 * ⚠️ `.reveal` 은 CSS 에서 opacity 0 으로 시작한다. 그래서 이 스크립트가 못 돌면 글이
 *    안 보인다 — 자바스크립트를 끈 경우는 layout 의 noscript 가 받아 준다.
 */
export function RevealScript() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.reveal, .concern');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      targets.forEach((el) => el.classList.add('is-shown'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-shown');
          /* 한 번 보였으면 관찰을 끊는다 — 오르내릴 때마다 다시 움직이면 멀미가 난다. */
          io.unobserve(e.target);
        }
      },
      /* 조금 일찍 시작한다 — 화면에 완전히 들어온 뒤 움직이면 읽던 글이 흔들린다. */
      { rootMargin: '0px 0px -12% 0px' },
    );
    targets.forEach((el) => io.observe(el));

    /*
     * 고민 카드의 스포트라이트 — 커서 자리에서 빛이 번진다.
     *
     * ★ 카드마다 핸들러를 달지 않고 문서 하나에 위임한다. 카드가 여섯 장이든 스무 장이든
     *   리스너는 하나다.
     * ★ 카드가 없는 페이지에서는 **아예 걸지 않는다** — 대부분의 페이지가 여기 해당한다.
     * ⚠️ 좌표는 state 가 아니라 CSS 변수로 바로 쓴다. 리렌더가 끼면 마우스를 움직이는
     *    내내 프레임이 떨어진다.
     */
    const hasCards = document.querySelector('.concern-card');
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('.concern-card') as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    if (hasCards) document.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      io.disconnect();
      if (hasCards) document.removeEventListener('pointermove', onMove);
    };
  }, [pathname]);

  return null;
}
