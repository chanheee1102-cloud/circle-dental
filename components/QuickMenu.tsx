'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
      <aside
        className="fixed right-5 bottom-6 z-40 hidden flex-col items-end gap-2.5 lg:flex"
        aria-label="빠른 연락"
      >
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="맨 위로"
            className="group mb-1 flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white/95 text-brand-700 shadow-[var(--shadow-lift)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brand-400"
          >
            <span aria-hidden className="text-[15px] leading-none transition-transform group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        )}

        <Fab
          href={CLINIC.booking.kakao}
          label="카톡 상담"
          external
          className="border border-brand-200 bg-white/95 text-ink"
          icon={<KakaoIcon />}
        />
        <Fab
          href={CLINIC.booking.naver}
          label="예약하기"
          external
          className="border border-brand-200 bg-white/95 text-ink"
          icon={<NaverIcon />}
        />
        <Fab
          href={CLINIC.phoneHref}
          label={CLINIC.phone}
          className="bg-gradient-to-b from-brand-600 to-brand-700 text-white shadow-[var(--shadow-btn)]"
          icon={<PhoneIcon />}
        />
      </aside>

      {/* 모바일 — 하단 고정 바. 엄지가 닿는 위치라 전환의 대부분이 여기서 난다. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4">
          <Link
            href="/visit"
            className="flex flex-col items-center gap-1.5 py-3 text-[11.5px] font-bold text-ink-soft"
          >
            <PinIcon />
            오시는 길
          </Link>
          <a
            href={CLINIC.booking.kakao}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 border-x border-brand-100 py-3 text-[11.5px] font-bold text-ink-soft"
          >
            <KakaoIcon />
            카톡 상담
          </a>
          <a
            href={CLINIC.booking.naver}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 border-r border-brand-100 py-3 text-[11.5px] font-bold text-ink-soft"
          >
            <NaverIcon />
            네이버 예약
          </a>
          <a
            href={CLINIC.phoneHref}
            className="flex flex-col items-center gap-1.5 bg-gradient-to-b from-brand-500 to-brand-600 py-3 text-[11.5px] font-black text-white"
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
function KakaoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.4" fill="#FEE500" />
      <path
        d="M10 5.6c-2.9 0-5.2 1.8-5.2 4.1 0 1.5 1 2.8 2.5 3.5l-.6 2.2c-.05.2.16.35.33.24l2.6-1.7c.12.01.24.02.37.02 2.9 0 5.2-1.8 5.2-4.2S12.9 5.6 10 5.6Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}
function NaverIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.4" fill="#03C75A" />
      <path d="M7.4 13.4V6.6h1.9l2.2 3.4V6.6h1.9v6.8h-1.9L9.3 10v3.4H7.4Z" fill="#fff" />
    </svg>
  );
}

/**
 * 떠 있는 동작 버튼 하나.
 *
 * ★ 평소에는 동그란 아이콘, 마우스를 올리면 이름이 옆으로 펼쳐진다.
 *   항상 이름을 펼쳐 두면 셋이 나란히 큰 면적을 차지해 결국 본문을 가린다 —
 *   레일을 걷어낸 이유를 그대로 되풀이하는 셈이다.
 * ⚠️ 이름은 **DOM 에 항상 있다.** 폭만 0 으로 접는다 — 스크린리더와 검색엔진은
 *    그대로 읽는다. `aria-label` 로만 두면 화면에 이름이 아예 없는 버튼이 된다.
 * ⚠️ `overflow-hidden` 없이 폭을 접으면 글자가 삐져나온다.
 */
function Fab({
  href,
  label,
  icon,
  className,
  external,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  className: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      title={label}
      className={`group flex h-12 items-center gap-0 rounded-full px-3.5 shadow-[var(--shadow-lift)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:gap-2.5 hover:pr-5 ${className}`}
    >
      <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="max-w-0 overflow-hidden text-[14px] font-black whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100">
        {label}
      </span>
    </a>
  );
}
