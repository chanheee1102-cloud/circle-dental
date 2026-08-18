import Link from 'next/link';
import type { Concern } from '@/lib/concerns';

/**
 * 망설임 카드 한 장.
 *
 * ★★ 왜 이 섹션만 따로 움직이는가 (2026-08-18 운영자: "임팩트 좀 많이 넣어줘") ★★
 *   전역 규칙은 '.reveal 하나만 쓴다' 이고 그 판단은 지금도 맞다. 다만 이 섹션은
 *   페이지에서 **처음으로 어두워지는 자리**다. 스크롤이 흰 면을 지나다 검은 면에
 *   들어서는 지점이라, 여기서 한 번 세게 주고 나머지를 조용히 두는 편이 낫다.
 *
 *   ① 진입 — 아래에서 올라오며 살짝 커진다. 대각선 순서로 번져 파도처럼 읽힌다.
 *   ② 스포트라이트 — 마우스를 얹으면 **커서 위치**에서 빛이 번진다.
 *     어두운 면에서만 성립하는 효과라 이 섹션 고유의 인상이 된다.
 *
 * ★★ 서버 컴포넌트다 (2026-08-18 성능 실측) ★★
 *   처음엔 'use client' 로 만들어 카드마다 IntersectionObserver 와 onMouseMove 를 달았다.
 *   여섯 장이면 관찰자 여섯, 하이드레이션 경계 여섯이다. 홈의 긴 작업이 1,748ms 로
 *   본문 페이지의 여덟 배였고 그 대부분이 하이드레이션이었다.
 *   지금은 두 가지 모두 **문서에 하나뿐인 RevealScript** 가 위임으로 처리한다 —
 *   이 파일은 클래스와 지연 시간만 붙인 HTML 을 낸다.
 *   ⚠️ 여기에 'use client' 를 다시 붙이지 말 것.
 */
export function ConcernCard({ concern, order }: { concern: Concern; order: number }) {
  return (
    <li
      className="concern h-full"
      /* 대각선으로 번지게 — 3열에서 (행+열) 순서면 왼쪽 위에서 오른쪽 아래로 파도가 친다. */
      style={{ transitionDelay: `${((order % 3) + Math.floor(order / 3)) * 95}ms` }}
    >
      <Link
        href={concern.href}
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
