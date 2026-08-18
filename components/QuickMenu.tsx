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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* 열어 둔 채로 다른 데를 볼 일은 없다 — Esc 로 닫는다. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

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
      <aside
        className="fixed right-5 bottom-7 z-40 hidden flex-col items-center gap-3 lg:flex"
        aria-label="빠른 연락"
      >
        <div
          id="quick-rail"
          className={`flex w-[74px] flex-col items-center overflow-hidden rounded-full bg-gradient-to-b from-brand-600 to-brand-800 py-3 text-white shadow-[var(--shadow-lift)] transition-all duration-300 ${
            open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-3 opacity-0'
          }`}
        >
          <RailItem href={CLINIC.phoneHref} label="전화상담" icon={<PhoneIcon />} />
          <RailItem href={CLINIC.booking.naver} label="네이버예약" external icon={<CalendarIcon />} />
          <RailItem href={CLINIC.booking.kakao} label="카카오상담" external icon={<ChatIcon />} />
          <RailItem href="/visit" internal label="오시는 길" icon={<PinIcon />} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="quick-rail"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-900 text-[11.5px] font-black tracking-[0.06em] text-white shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5"
        >
          {open ? '닫기' : 'QUICK'}
        </button>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="맨 위로"
          aria-hidden={!showTop}
          tabIndex={showTop ? 0 : -1}
          className={`group flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-brand-500 to-brand-700 text-white shadow-[var(--shadow-lift)] transition-all hover:-translate-y-0.5 ${
            showTop ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        >
          <span
            aria-hidden
            className="text-[15px] leading-none transition-transform group-hover:-translate-y-0.5"
          >
            ↑
          </span>
        </button>
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
 * QUICK 레일의 항목 하나 — 아이콘 위, 이름 아래.
 *
 * ★ 이름을 **항상 글자로 보여 준다.** 직전 판은 마우스를 올려야 이름이 펼쳐졌는데,
 *   레일 안에서는 그럴 이유가 없다(폭이 이미 고정이다). 아이콘만 있는 버튼은
 *   무엇인지 눌러 봐야 아는 버튼이다.
 * ★ 레일 아이콘은 **단색 선**으로 통일한다. 네이버 초록·카카오 노랑을 갈색 그라데이션
 *   위에 얹으면 스티커를 붙인 것처럼 보인다. 색이 든 원본 아이콘은 흰 바탕인
 *   모바일 하단 바에 그대로 남아 있다.
 */
function RailItem({
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
  const cls =
    'flex w-full flex-col items-center gap-1.5 px-1 py-3 text-[11px] font-bold text-white/80 transition-colors hover:text-white';
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
    <a
      href={href}
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
