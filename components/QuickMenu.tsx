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

  const mapQuery = encodeURIComponent(`${CLINIC.name} ${CLINIC.address.dong}`);

  return (
    <>
      {/* 데스크톱 — 우측 세로 */}
      {/*
        ⚠️ 이 레일은 본문 위에 뜨는 것이 전제다 — 국내 병원 사이트의 관습적 배치이고,
           원본 홈페이지도 같았다. 다만 **본문 폭이 1,320px 라 화면이 1,530px 보다
           좁으면 레일이 본문 오른쪽 끝을 덮는다**(실측: 1,440px 20px / 1,280px 81px).
           폭을 76 → 94px 로 키우면서(운영자 요청) 그만큼 더 덮게 됐다.
           right-5 → right-3 으로 8px 만 되찾아 둔다.
        ⚠️ 완전히 없애려면 둘 중 하나를 골라야 한다 — ① 본문 폭을 1,200px 로 줄이거나
           ② 레일을 1,536px 이상에서만 띄우거나. 둘 다 화면이 눈에 띄게 바뀌는 결정이라
           운영자 확인 없이 하지 않는다.
      */}
      <aside
        className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
        aria-label="빠른 메뉴"
      >
        <div className="overflow-hidden rounded-2xl border border-brand-200/70 bg-white/95 shadow-[var(--shadow-lift)] backdrop-blur">
          <p className="bg-gradient-to-b from-brand-500 to-brand-600 px-3 py-3 text-center text-[12px] font-black tracking-[0.16em] text-white">
            QUICK
          </p>
          <QuickItem href="/visit" label="진료시간" icon={<ClockIcon />} />
          <QuickItem
            href={`https://map.naver.com/p/search/${mapQuery}`}
            label="오시는 길"
            icon={<PinIcon />}
            external
          />
          <QuickItem href={CLINIC.booking.naver} label="네이버 예약" icon={<NaverIcon />} external />
          <QuickItem href={CLINIC.booking.kakao} label="카톡 상담" icon={<KakaoIcon />} external />
          <QuickItem href={CLINIC.phoneHref} label="전화 상담" icon={<PhoneIcon />} />
          {showTop && (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex w-full flex-col items-center gap-1.5 border-t border-brand-100 bg-brand-50 px-3 py-3.5 text-[12px] font-black text-brand-700 transition-colors hover:bg-brand-100"
            >
              <span aria-hidden className="text-[15px] leading-none transition-transform group-hover:-translate-y-0.5">
                ↑
              </span>
              TOP
            </button>
          )}
        </div>
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

function QuickItem({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  const cls =
    'group flex w-[92px] flex-col items-center gap-2 border-t border-brand-100 px-2 py-4 text-[12px] font-bold text-ink-soft transition-all duration-200 hover:bg-brand-50 hover:text-brand-700 first:border-t-0';
  if (external || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {icon}
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {icon}
      {label}
    </Link>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5.8V10l2.8 1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
