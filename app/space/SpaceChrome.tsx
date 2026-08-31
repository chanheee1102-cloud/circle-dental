'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CLINIC } from '@/lib/clinic';

/**
 * /space 전용 헤더·푸터.
 *
 * ★★ 왜 새로 짰나 (2026-08-19 운영자) ★★
 *   "헤더나 내용 등등 이전 버전 냄새가 너무 남아있어"
 *   맞는 지적이었다. 본문만 새 결로 짜고 헤더는 기존 것을 그대로 뒀더니, 화면 맨 위에
 *   **알약 버튼과 드롭다운 메뉴**가 그대로 남아 첫인상이 통째로 예전 사이트였다.
 *   레퍼런스의 헤더는 정반대다 — 큰 버튼이 없고, 얇은 글자와 선으로만 되어 있다.
 *
 * ⚠️ 기존 SiteHeader/SiteFooter 는 **건드리지 않는다.** 모든 페이지가 함께 쓰는 부품이라
 *    여기서 고치면 나머지 89장이 전부 흔들린다. 이 화면에서만 감추고(space.css) 이걸 쓴다.
 * ⚠️ 이건 **시안**이다. 이 결로 확정되면 그때 전역 부품을 이 방향으로 옮기는 것이 맞다 —
 *    한 화면만 다른 헤더를 쓰는 상태를 오래 두면 그 자체가 새로운 '이전 버전 냄새' 가 된다.
 */

const NAV = [
  { label: '병원 소개', href: '/about' },
  { label: '진료', href: '/treatment' },
  { label: '의료진', href: '/about/doctors' },
  { label: '내원 안내', href: '/visit' },
] as const;

export function SpaceHeader() {
  /*
   * 첫 화면 위에 있을 때는 투명 + 흰 글씨, 내려가면 베이지 + 짙은 글씨.
   * ⚠️ 스크롤 값을 rAF 없이 그대로 쓰면 스크롤마다 리렌더가 돈다 — 임계값을 넘을 때만 바꾼다.
   */
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? 'border-b border-[color:var(--sp-line)] bg-[#eeede9]/92 backdrop-blur-md' : ''
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1560px] items-center gap-10 px-6 lg:px-10">
        {/*
          ⚠️ 로고 그림을 쓰지 않는다. 짙은 색 그림이라 사진 위에서 안 보이고,
             filter 로 뒤집으면 모양이 뭉갠다. 이 결은 어차피 글자가 주인공이다.
        */}
        <Link href="/space" className="flex-none">
          <span
            className={`sp-serif block text-[19px] leading-none transition-colors duration-500 ${
              solid ? 'text-[color:var(--sp-ink)]' : 'text-white'
            }`}
          >
            {CLINIC.shortName}
          </span>
          <span
            className={`mt-1.5 block text-[9.5px] tracking-[0.3em] transition-colors duration-500 ${
              solid ? 'text-[color:var(--sp-dim)]' : 'text-white/55'
            }`}
          >
            {CLINIC.nameEn}
          </span>
        </Link>

        <nav className="hidden flex-1 justify-center gap-11 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-[14.5px] tracking-[0.04em] transition-colors duration-500 ${
                solid ? 'text-[color:var(--sp-ink)]' : 'text-white/90'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* 오른쪽 — 알약 버튼 대신 얇은 글자. 이 결의 성격이 여기서 갈린다. */}
        <div className="ml-auto flex items-center gap-7 lg:ml-0">
          <a
            href={CLINIC.phoneHref}
            className={`hidden text-[14.5px] tracking-[0.06em] transition-colors duration-500 sm:block ${
              solid ? 'text-[color:var(--sp-ink)]' : 'text-white/90'
            }`}
          >
            {CLINIC.phone}
          </a>
          <Link
            href="/contact"
            className={`sp-arrow ${solid ? '' : '!text-white'}`}
            style={{ fontSize: 13 }}
          >
            예약
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SpaceFooter() {
  return (
    <footer className="border-t border-[color:var(--sp-line)] bg-[color:var(--sp-canvas)] px-6 py-16 lg:px-10">
      <div className="mx-auto grid max-w-[1560px] gap-10 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="sp-serif text-[18px]">{CLINIC.name}</p>
          <p className="mt-4 text-[13.5px] leading-[2] text-[color:var(--sp-dim)]">
            {CLINIC.address.full}
            <br />
            대표전화 {CLINIC.phone}
          </p>
          {/*
            ⚠️ 의료광고 표시 의무 — 병원 이름·주소·전화는 반드시 남긴다.
               인상을 위해 이 셋을 빼면 그건 디자인이 아니라 규정 위반이다.
          */}
        </div>
        <nav className="flex flex-wrap items-start gap-x-8 gap-y-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[13.5px] tracking-[0.04em] text-[color:var(--sp-dim)] hover:text-[color:var(--sp-ink)]"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/privacy"
            className="text-[13.5px] tracking-[0.04em] text-[color:var(--sp-dim)] hover:text-[color:var(--sp-ink)]"
          >
            개인정보처리방침
          </Link>
        </nav>
      </div>
    </footer>
  );
}
