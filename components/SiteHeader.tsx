'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NAV } from '@/lib/nav';
import { CLINIC } from '@/lib/clinic';
import { LogoLockup } from '@/components/Logo';
import { OpenStatusBadge } from '@/components/OpenStatusBadge';

/**
 * 전역 헤더.
 *
 * ★ 스크롤에 따라 두께와 그림자가 바뀐다 — 맨 위에서는 배경에 얹힌 듯 가볍게,
 *   내려가면 압축되면서 그림자가 생겨 본문 위에 떠 있다는 것이 분명해진다.
 *   고정 헤더가 항상 같은 모습이면 화면이 납작해 보인다.
 * ★ 전화번호를 데스크톱에서도 노출한다 — 치과 방문 결정의 마지막 한 걸음은 여전히 전화다.
 * ★ 드롭다운은 hover 와 focus 양쪽에서 열린다. 키보드로 메뉴에 닿지 못하면
 *   그 하위 페이지 전체가 닫힌 것과 같다.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-brand-200/60 bg-cream/85 shadow-[0_4px_24px_-12px_rgba(58,33,26,0.25)] backdrop-blur-xl'
          : 'border-b border-transparent bg-cream/60 backdrop-blur-md'
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 transition-all duration-300 lg:px-8 ${
          scrolled ? 'h-[68px]' : 'h-[86px]'
        }`}
      >
        {/*
          로고 옆에 진료 상태를 둔다 — 방문자가 가장 먼저 확인하는 것이 '지금 여나' 이고,
          그 답이 화면 맨 위에 있으면 전화 한 통이 줄어든다.
          ⚠️ 좁은 화면에서는 숨긴다. 로고와 전화 버튼 사이에 끼면 둘 다 좁아져 오히려 방해다.
        */}
        <div className="flex items-center gap-3">
          <Link href="/" aria-label={`${CLINIC.name} 홈`} className="transition-opacity hover:opacity-80">
            <LogoLockup />
          </Link>
          <OpenStatusBadge className="hidden sm:inline-flex" />
        </div>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="주 메뉴">
          {NAV.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 rounded-lg px-4 py-2.5 text-[15.5px] font-bold text-ink-soft transition-colors hover:bg-brand-100/70 hover:text-brand-700"
                onFocus={() => setOpenMenu(item.label)}
              >
                {item.label}
                {item.children && <Chevron />}
              </Link>

              {item.children && openMenu === item.label && (
                <div className="absolute left-1/2 top-full w-[268px] -translate-x-1/2 pt-2.5">
                  {/*
                    ★ 보조설명(desc)을 렌더하지 않는다 (2026-08-14 운영자).
                      메뉴는 '어디로 가는지' 만 알면 되는 자리다. 항목마다 한 줄씩 설명이 붙으면
                      드롭다운이 두 배로 길어지고 훑는 속도가 오히려 떨어진다.
                      설명은 그 페이지에 들어가서 읽으면 된다.
                      (lib/nav.ts 의 desc 는 지우지 않는다 — 사이트맵·검색 설명 등에 쓸 수 있다.)
                  */}
                  <div className="overflow-hidden rounded-xl border border-brand-200/70 bg-white p-2 shadow-[var(--shadow-lift)]">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block rounded-lg px-3.5 py-2 text-[14.5px] font-bold text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
                        onBlur={() => setOpenMenu(null)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CLINIC.phoneHref}
            className="hidden items-center gap-2 rounded-lg border border-brand-300/80 bg-white/70 px-5 py-2.5 text-[15.5px] font-black text-brand-700 transition-all hover:border-brand-400 hover:bg-white md:inline-flex"
          >
            <PhoneIcon />
            {CLINIC.phone}
          </a>
          {/*
            ★ '상담 예약' 은 **네이버 예약**으로 보낸다 (2026-08-14 운영자).
              예전엔 전화 걸기였는데, 그러면 옆의 전화번호 버튼과 같은 동작이라 버튼이 둘인 의미가 없다.
              지금은 '전화로 물어보기' 와 '지금 바로 시간 잡기' 로 갈린다.
              네이버 예약은 플레이스 지표로도 쌓여 지역 검색에 직접 기여한다(lib/clinic.ts 주석 참고).
            ★ 외부 도메인이라 새 창으로 열고 rel="noopener" 를 붙인다 — 없으면 열린 창이
              window.opener 로 이 페이지를 조작할 수 있다.
          */}
          <a
            href={CLINIC.booking.naver}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 px-6 py-2.5 text-[15.5px] font-black text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5"
          >
            네이버 예약
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-300 text-brand-700 lg:hidden"
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileOpen}
          >
            <span className="text-lg leading-none">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-brand-200/70 bg-white lg:hidden">
          <nav className="mx-auto max-w-[1320px] px-5 py-4" aria-label="모바일 메뉴">
            {NAV.map((item) => (
              <div key={item.href} className="border-b border-brand-50 py-3.5 last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-[15.5px] font-black text-brand-700"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-[14px] font-medium text-ink-soft"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden focusable="false">
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
      <path
        d="M5.2 2.5 6.6 5 5.3 6.4a8.4 8.4 0 0 0 4.3 4.3L11 9.4l2.5 1.4v2.3c0 .6-.5 1-1.1.9C6.6 13.4 2.6 9.4 1.9 4.6c-.1-.6.3-1.1.9-1.1h2.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
