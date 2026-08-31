'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CLINIC } from '@/lib/clinic';

/**
 * 우측 고정 퀵메뉴.
 *
 * ★ 실제 병원 홈페이지에 있던 요소다. 국내 병원 사이트에서 관습적으로 쓰이고,
 *   실제로 전환의 상당 부분이 여기서 나온다 — 본문 어디를 읽고 있든 전화·길찾기가 한 번에 닿는다.
 * ★ 모바일에서는 세로 목록 대신 **하단 고정 바**로 바뀐다.
 *   좁은 화면에서 우측 세로 메뉴는 본문을 가리고 엄지로 닿기도 어렵다.
 * ★ TOP 버튼은 스크롤이 내려갔을 때만 나타난다. 맨 위에서 '맨 위로' 는 의미가 없다.
 */
export function QuickMenu() {
  /*
   * ★ 여닫는 상태를 없앴다 (2026-08-27 오너) — 버튼 넷이 늘 떠 있으므로 열 이유가 없다.
   *   hovering / pinned / canHover / Esc 닫기가 전부 이 때문에 사라졌다.
   * ⚠️ 되살릴 거면 상자(배경 판)도 함께 되살려야 한다. 상자 없이 접으면 버튼이
   *    그냥 사라지는 것처럼 보인다.
   */
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/*
        ★★ 우측 세로 레일 → 오른쪽 아래 버튼 셋 (2026-08-14 운영자: "퀵메뉴가 좀 가린다") ★★

          레일은 화면 세로 가운데에 94px 폭으로 서 있었다. 본문 폭이 1,320px 라
          화면이 1,530px 보다 좁으면 **본문 오른쪽을 그대로 덮었다**(실측: 1,280px 에서 81px).
          게다가 여섯 개나 있어서 덮는 면적이 컸다.

          → 오른쪽 **아래 모서리**로 내리고 **셋만** 남긴다. 카톡·예약·전화.
            아래 모서리는 본문이 거의 없는 자리라 무엇도 가리지 않고,
            국내 사용자에게 가장 익숙한 떠 있는 버튼 자리이기도 하다.

          ★ 왜 이 셋인가 — 나머지(진료시간·오시는 길)는 **읽는 정보**라 헤더 메뉴와
            푸터에 이미 있다. 여기 남길 것은 **누르면 바로 행동이 되는 것**뿐이다.
          ★ 전화를 맨 아래(엄지에 가장 가까운 자리)에 두고 색을 채운다 —
            급한 사람이 가장 많이 누르는 버튼이다.
      */}
      {/*
        ★★ 떠 있는 버튼 셋 → 접히는 QUICK 레일 (2026-08-18 운영자, 참고 화면 제공) ★★

          직전 판은 카톡·예약·전화 세 개가 **항상 떠 있었다.** 위 주석이 레일을 걷어낸
          이유(본문을 가린다)가 규모만 줄어든 채 그대로 남아 있던 셈이다.
          이제 평소에는 동그란 QUICK 하나만 있고, 누르면 세로 레일이 올라온다.
          국내 병원 사이트에서 가장 익숙한 형태이고, 접혀 있을 때 가리는 면적이 56px 짜리
          원 하나로 줄어든다.

        ★ 접힌 상태에서 항목 넷을 다 넣어도 비용이 0 이라 **오시는 길을 되살렸다.**
          '읽는 정보라 헤더에 있다' 는 앞의 판단은 항상 떠 있을 때 이야기다.
        ★ 맨 위로 버튼은 **자리를 늘 비워 둔다.** 스크롤 600px 에서 나타날 때
          없던 자리가 생기면 아래 정렬이라 QUICK 이 통째로 위로 튄다(실제로 튀었다).
          그래서 `hidden` 이 아니라 투명도로만 감춘다.
        ⚠️ 접힘은 `visibility` 로 한다 — `opacity-0` 만 쓰면 안 보이는 링크에 Tab 이 들어간다.
      */}
      {/*
        ★★ 원본 홈페이지 형태로 (2026-08-27 오너: "그냥 이런식으로 하되 투명하게만 하자") ★★
          이름 글자와 구분선이 있는 세로 패널이다. 배경만 헤더·히어로 칩과 같은 투명 유리다.
        ★ 이름을 글자로 되살렸다 — 직전에는 동그란 아이콘만 있어서 눌러 봐야 아는 버튼이었다.
          링크 글자가 돌아오면서 앵커 텍스트도 함께 돌아온다.
        ⚠️⚠️ 자리를 화면 **세로 가운데**로 옮기지 말 것 ⚠️⚠️
          원본은 가운데에 세워 두는데, 2026-08-14 에 그것 때문에 되돌린 적이 있다 —
          본문 폭이 1,320px 라 화면이 1,530px 보다 좁으면 **본문 오른쪽을 그대로 덮는다**
          (실측: 1,280px 에서 81px). 오른쪽 아래 모서리는 본문이 거의 없는 자리다.
        ⚠️ 'QUICK MENU' 머리글은 넣지 않았다 — 한국어 화면의 영문 라벨은 장식일 뿐이고,
           세로 공간만 먹는다(components/home.tsx 의 눈썹 규칙과 같은 이유).
        ⚠️ backdrop-brightness 를 빼지 말 것 — 밝은 사진 위에서 흰 글자가 사라진다.
        ⚠️ 이 패널 **안쪽** 요소에 backdrop-filter 를 또 걸지 말 것. 겹치면 안쪽 것이 죽는다
           (메가메뉴에서 겪었다).
      */}
      {/* ⚠️ 재질은 .pane-dark 하나에 모여 있다(globals.css). 진료 카드와 같은 값을 쓴다. */}
      <nav
        className="pane-dark fixed right-5 bottom-7 z-40 hidden w-[86px] flex-col overflow-hidden rounded-[22px] lg:flex"
        aria-label="빠른 연락"
      >
        {RAIL.map((r, i) => (
          <RailItem key={r.label} {...r} first={i === 0} />
        ))}
        {/* 맨 위로 — 스크롤이 어느 정도 내려가야 나타난다. */}
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="맨 위로"
            className="group flex w-full flex-col items-center gap-1.5 border-t border-white/15 px-1 py-3.5 text-[13.5px] font-semibold text-white/85 transition-colors hover:text-white"
          >
            <span
              aria-hidden
              className="flex h-6 w-6 items-center justify-center text-[18px] leading-none transition-transform group-hover:-translate-y-0.5"
            >
              ↑
            </span>
            맨 위로
          </button>
        )}
      </nav>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-wine-line bg-wine-bg/95 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4">
          <Link
            href="/visit"
            className="flex flex-col items-center gap-1.5 py-3 text-[13.5px] font-bold text-twilight"
          >
            <PinIcon />
            오시는 길
          </Link>
          <a
            href={CLINIC.booking.kakao}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 border-x border-wine-line py-3 text-[13.5px] font-bold text-twilight"
          >
            <KakaoIcon />
            카톡 상담
          </a>
          <a
            href={CLINIC.booking.naver}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 border-r border-wine-line py-3 text-[13.5px] font-bold text-twilight"
          >
            <NaverIcon />
            네이버 예약
          </a>
          <a
            href={CLINIC.phoneHref}
            className="flex flex-col items-center gap-1.5 bg-dusk py-3 text-[13.5px] font-semibold text-white"
          >
            <PhoneIcon />
            전화
          </a>
        </div>
      </div>
      {/* 하단 고정 바가 본문 마지막 줄을 가리지 않게 여백을 만든다. */}
      <div aria-hidden className="h-[66px] lg:hidden" />
    </>
  );
}


/**
 * 레일 항목 — 데이터로 둔다. 지연 시간을 순서에서 계산해야 해서 배열이 필요하다.
 * ⚠️ 순서가 곧 화면 순서다. 전화가 맨 위인 것은 급한 사람이 가장 많이 누르기 때문이다.
 */
const RAIL = [
  /*
   * ⚠️ 네이버·카카오는 **브랜드 아이콘**을 쓴다(모바일 하단 바와 같은 것). 예전에는
   *    일반 달력/말풍선 아이콘이라 어디로 가는 버튼인지 색으로 알 수 없었다.
   * ⚠️ chip 은 그 서비스의 색이다. 전화·오시는 길은 브랜드가 없으므로 우리 색을 쓴다.
   */
  /*
   * ⚠️ 아이콘은 전부 currentColor(흰색)다. 브랜드 색 글리프를 쓰지 말 것 —
   *    유리 버튼 위에서 색만 튀고 재질이 어긋난다.
   * ⚠️ 이름 글자를 화면에 안 그리므로 label 이 유일한 이름이다(aria-label·title).
   */
  { href: CLINIC.phoneHref, label: '전화상담', icon: <PhoneIcon /> },
  { href: CLINIC.booking.naver, label: '네이버예약', external: true, icon: <NaverIcon /> },
  { href: CLINIC.booking.kakao, label: '카톡상담', external: true, icon: <KakaoIcon /> },
  { href: '/visit', label: '오시는 길', internal: true, icon: <PinIcon /> },
];

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 17.5s5.6-4.6 5.6-9a5.6 5.6 0 1 0-11.2 0c0 4.4 5.6 9 5.6 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8.4" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M6.5 3.2 8.2 6.4 6.6 8.1a10.5 10.5 0 0 0 5.3 5.3l1.7-1.6 3.2 1.7v2.9c0 .7-.6 1.3-1.4 1.2C8.2 16.8 3.2 11.8 2.4 5c-.1-.8.5-1.4 1.2-1.4h2.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function KakaoIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.4" fill="#FEE500" />
      <path
        d="M10 5.6c-2.9 0-5.2 1.8-5.2 4.1 0 1.5 1 2.8 2.5 3.5l-.6 2.2c-.05.2.16.35.33.24l2.6-1.7c.12.01.24.02.37.02 2.9 0 5.2-1.8 5.2-4.2S12.9 5.6 10 5.6Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}
function NaverIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.4" fill="#03C75A" />
      <path d="M7.4 13.4V6.6h1.9l2.2 3.4V6.6h1.9v6.8h-1.9L9.3 10v3.4H7.4Z" fill="#fff" />
    </svg>
  );
}

/**
 * QUICK 레일의 항목 하나 — 아이콘 위, 이름 아래.
 *
 * ★ 이름을 **항상 글자로 보여 준다.** 직전 판은 마우스를 올려야 이름이 펼쳐졌는데,
 *   레일 안에서는 그럴 이유가 없다(폭이 이미 고정이다). 아이콘만 있는 버튼은
 *   무엇인지 눌러 봐야 아는 버튼이다.
 * ★ 레일 아이콘은 **단색 선**으로 통일한다. 네이버 초록·카카오 노랑을 갈색 그라데이션
 *   위에 얹으면 스티커를 붙인 것처럼 보인다. 색이 든 원본 아이콘은 흰 바탕인
 *   모바일 하단 바에 그대로 남아 있다.
 */
/**
 * 퀵메뉴 항목 하나 — 아이콘 위, 이름 아래.
 *
 * ★ 이름을 **항상 글자로 보여 준다.** 아이콘만 있는 버튼은 눌러 봐야 아는 버튼이다.
 *   글자가 있으면 링크의 앵커 텍스트로도 남는다.
 * ⚠️ 네이버·카카오는 브랜드 아이콘이라 색을 그대로 둔다 — 색이 곧 '어디로 가는가' 다.
 * ⚠️ 첫 항목에는 위 구분선을 그리지 않는다. 패널 맨 위에 선이 하나 더 생긴다.
 */
function RailItem({
  href,
  label,
  icon,
  external,
  internal,
  first,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
  internal?: boolean;
  first?: boolean;
}) {
  const cls = `flex w-full flex-col items-center gap-1.5 px-1 py-3.5 text-[13.5px] font-semibold text-white/85 transition-colors hover:text-white ${
    first ? '' : 'border-t border-white/15'
  }`;
  const body = (
    <>
      <span aria-hidden className="flex h-6 w-6 items-center justify-center">
        {icon}
      </span>
      {label}
    </>
  );
  if (internal) {
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  }
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={cls}>
      {body}
    </a>
  );
}
function RailButton({
  href,
  label,
  icon,
  external,
  internal,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
  internal?: boolean;
}) {
  /*
   * ⚠️ 브랜드 색으로 채웠다가 **색 없는 유리로 바꿨다** (2026-08-27 오너: "배경색은 투명으로
   *    하고, 그냥 색갈 없이 가자"). 헤더 알약·히어로 칩과 같은 재질이라 화면에 재질이 하나다.
   * ⚠️ backdrop-brightness 를 빼지 말 것 — 밝은 사진 위에서 흰 아이콘이 사라진다.
   */
  const cls =
    'flex h-14 w-14 items-center justify-center rounded-full border border-white/25 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_34px_-16px_rgba(0,0,0,0.6)] backdrop-blur-[8px] backdrop-brightness-[0.55] backdrop-saturate-150 transition-colors hover:bg-white/10';
  const body = <span aria-hidden>{icon}</span>;
  if (internal) {
    return (
      <Link href={href} aria-label={label} title={label} className={cls}>
        {body}
      </Link>
    );
  }
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cls}
    >
      {body}
    </a>
  );
}
function CalendarIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="3" y="4.6" width="14" height="12.4" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8.4h14M7 3.2v2.8M13 3.2v2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 3.6c3.6 0 6.5 2.3 6.5 5.2 0 2.9-2.9 5.2-6.5 5.2-.5 0-1-.04-1.4-.12L5.2 16.2l.7-2.7C4.4 12.6 3.5 11.1 3.5 8.8c0-2.9 2.9-5.2 6.5-5.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
