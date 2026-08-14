'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV, type NavItem } from '@/lib/nav';
import { CLINIC } from '@/lib/clinic';
import { LogoLockup } from '@/components/Logo';

/**
 * 전역 헤더.
 *
 * ★ 스크롤에 따라 두께와 그림자가 바뀐다 — 맨 위에서는 배경에 얹힌 듯 가볍게,
 *   내려가면 압축되면서 그림자가 생겨 본문 위에 떠 있다는 것이 분명해진다.
 *   고정 헤더가 항상 같은 모습이면 화면이 납작해 보인다.
 * ★ 전화번호를 데스크톱에서도 노출한다 — 치과 방문 결정의 마지막 한 걸음은 여전히 전화다.
 *
 * ★★ 드롭다운이 두 번 바뀌었다 — 지금 모습에 이른 경위 (2026-08-14) ★★
 *   ① 처음: 268px 상자에 항목 이름만 세로로 쌓았다. '진료' 아래 열한 개가 한 줄에 하나씩
 *      내려왔고, 이름만 보고는 무엇을 하는 진료인지 알 수 없었다
 *      (lib/nav.ts 에 한 줄 설명이 이미 있었는데 화면에 쓰지 않고 있었다).
 *   ② 화면 폭을 다 쓰는 판으로 바꿨다. 설명은 보이게 됐지만 **내용이 화면 왼쪽에만**
 *      몰려서, 오른쪽 끝의 '내원 안내' 를 눌렀는데 글자는 반대편에 나타났다.
 *      누른 자리와 열린 자리가 멀면 그 둘이 이어져 있다는 것을 눈이 못 잇는다.
 *      (오른쪽에 두었던 사진 카드도 이때 함께 뺐다 — 메뉴에서 읽을거리를 권하지 않는다.)
 *   ③ 지금: **누른 메뉴 바로 아래에 뜨는 600px 카드**. 항목마다 이름 + 한 줄 설명이
 *      테두리 칸에 묶여 있고, 카드 머리에 그룹 이름과 '전체 보기' 가 마주 본다.
 *
 * ★ 열고 닫기 — hover, focus, Escape 셋 다 동작한다.
 *   키보드로 메뉴에 닿지 못하면 그 하위 페이지 전체가 닫힌 것과 같다.
 *   닫기는 헤더 전체에서 마우스가 나갈 때 한 번만 판정한다. 버튼과 판을 따로 감시하면
 *   그 사이 1px 를 지날 때 메뉴가 깜빡인다.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  /** 모바일에서 펼쳐 놓은 그룹. 한 번에 하나만 — 전부 펼치면 접는 의미가 없다. */
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Escape — 열린 판은 반드시 키보드로 닫을 수 있어야 한다. */
  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openMenu, mobileOpen]);

  /*
    Tab 으로 헤더 밖까지 빠져나가면 닫는다.
    ⚠️ relatedTarget 이 null 인 경우(창 밖으로 포커스가 나감)에도 닫아야 한다 —
       안 닫으면 다른 탭에 갔다 와도 판이 열린 채 남는다.
  */
  const onHeaderBlur = useCallback((e: React.FocusEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null;
    if (!next || !headerRef.current?.contains(next)) setOpenMenu(null);
  }, []);


  return (
    <header
      ref={headerRef}
      onMouseLeave={() => setOpenMenu(null)}
      onBlur={onHeaderBlur}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        openMenu
          ? 'border-b border-brand-200/60 bg-cream/95 backdrop-blur-xl'
          : scrolled
            ? 'border-b border-brand-200/60 bg-cream/85 shadow-[0_4px_24px_-12px_rgba(58,33,26,0.25)] backdrop-blur-xl'
            : 'border-b border-transparent bg-cream/60 backdrop-blur-md'
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 transition-all duration-300 lg:px-8 ${
          scrolled ? 'h-[52px] sm:h-[68px]' : 'h-[60px] sm:h-[86px]'
        }`}
      >
        {/*
          ⚠️ 실시간 '진료 중' 배지를 뺐다 (2026-08-14 운영자: "저거 라이브도 빼줘").
             자동으로 여닫힘을 판정하는 표시는 **공휴일·임시 휴진을 알 수 없다**
             (lib/openStatus.ts 주석에 적어 둔 한계다). 쉬는 날 "진료 중" 이라고 떠 있으면
             그 표시 하나가 환자를 헛걸음시킨다 — 없는 편이 낫다.
             진료시간은 푸터와 /visit 에 정확히 적혀 있다.
             ⚠️ 되살리려면 그 한계(공휴일 판정 불가)부터 해결할 것.
        */}
        <div className="flex items-center gap-3">
          <Link href="/" aria-label={`${CLINIC.name} 홈`} className="transition-opacity hover:opacity-80">
            <LogoLockup />
          </Link>
        </div>

        {/*
          ★★ 판을 화면 폭에서 → **누른 메뉴 바로 아래** 로 (2026-08-14 운영자) ★★
            화면 전체를 덮는 흰 판에 내용은 왼쪽 끝에만 있어서, '내원 안내' 를 눌렀는데
            글자는 화면 반대편에 나타났다. 누른 자리와 열린 자리가 멀면 그 둘이
            이어져 있다는 것을 눈이 못 잇는다.
            → 각 메뉴가 자기 아래에 카드를 띄운다. 눌린 곳에서 바로 펼쳐지므로
              어느 메뉴에서 나온 것인지 위치만으로 분명하다.
          ⚠️ 카드를 감싼 껍데기의 위쪽 여백(pt-2.5)을 지우지 말 것 —
             버튼과 카드 사이에 빈틈이 생기면 마우스가 그 틈을 지날 때 hover 가 끊겨
             카드가 닫힌다. 여백이 껍데기 안에 있어야 마우스가 계속 안에 머문다.
        */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="주 메뉴">
          {NAV.map((item) => {
            const open = openMenu === item.label;
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.children ? item.label : null)}
              >
                <Link
                  href={item.href}
                  onFocus={() => setOpenMenu(item.children ? item.label : null)}
                  aria-expanded={item.children ? open : undefined}
                  className={`relative inline-flex items-center gap-1 rounded-lg px-4 py-2.5 text-[15.5px] font-bold transition-colors ${
                    open ? 'text-brand-700' : 'text-ink-soft hover:text-brand-700'
                  }`}
                >
                  {item.label}
                  {item.children && <Chevron open={open} />}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 -bottom-px h-[2.5px] rounded-full bg-brand-600 transition-transform duration-300 ${
                      open ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </Link>

                {item.children && open && (
                  <div className="mega-in absolute top-full left-1/2 z-10 -translate-x-1/2 pt-2.5">
                    <MegaPanel item={item} onNavigate={() => setOpenMenu(null)} />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/*
          ★★ 헤더 버튼 두 개도 알약형으로 (2026-08-14 운영자: "헤더 버튼들도 좀 바꿔") ★★
            히어로의 두 버튼을 알약형으로 바꿨는데 헤더만 각진 사각(rounded-lg)이라
            같은 화면에서 두 가지 버튼 언어가 섞여 있었다. 첫 화면에 보이는 버튼 넷은
            같은 모양이어야 한다.
          ★ 높이를 h-10 으로 **둘 다 못 박는다**. 전화 버튼에만 테두리가 있어
            여백으로 맞추면 1px 씩 어긋난다(히어로에서 겪은 것과 같은 문제다).
          ★ 무게로 나눈다 — 전화는 테두리만, 예약은 채운다.
            헤더가 밝은 크림색이라 채운 갈색 버튼이 가장 먼저 눈에 든다.
        */}
        <div className="flex items-center gap-2">
          <a
            href={CLINIC.phoneHref}
            className="hidden h-10 items-center gap-2 rounded-full border border-brand-300 bg-white/80 px-5 text-[15px] font-black text-brand-700 transition-colors hover:border-brand-500 hover:bg-white md:inline-flex"
          >
            <PhoneIcon />
            <span className="tabular-nums">{CLINIC.phone}</span>
          </a>
          {/*
            ★ 누르면 **네이버 예약**으로 간다 (2026-08-14 운영자).
              예전엔 전화 걸기였는데, 그러면 옆의 전화번호 버튼과 같은 동작이라 버튼이 둘인 의미가 없다.
              지금은 '전화로 물어보기' 와 '지금 바로 시간 잡기' 로 갈린다.
              네이버 예약은 플레이스 지표로도 쌓여 지역 검색에 직접 기여한다(lib/clinic.ts 주석 참고).
            ★ 글자는 '네이버 예약' 이 아니라 **'예약하기'** 다 (2026-08-14 운영자).
              버튼 글자는 '어디로 가는지' 가 아니라 '무엇을 하는지' 를 말해야 한다.
              가는 곳이 네이버라는 것은 눌러 보면 안다 — 그걸 미리 알려 주는 대가로
              화면에서 가장 중요한 버튼이 남의 브랜드 이름을 달고 있을 이유는 없다.
              ⚠️ 목적지는 그대로다. 글자만 바뀐 것이라 링크를 /visit 등으로 바꾸지 말 것.
            ★ 외부 도메인이라 새 창으로 열고 rel="noopener" 를 붙인다 — 없으면 열린 창이
              window.opener 로 이 페이지를 조작할 수 있다.
            ★ aria-label 에는 목적지를 남긴다 — 새 창이 뜨는 이유를 스크린리더가 먼저 알려야 한다.
          */}
          <a
            href={CLINIC.booking.naver}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="예약하기 — 네이버 예약 새 창으로 열기"
            className="group hidden h-10 items-center gap-2 rounded-full bg-gradient-to-b from-brand-600 to-brand-700 px-6 text-[15px] font-black text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            예약하기
            <span aria-hidden className="text-[13px] transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-300 text-brand-700 sm:h-10 sm:w-10 lg:hidden"
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileOpen}
          >
            <span className="text-lg leading-none">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>


      {mobileOpen && (
        <div className="border-t border-brand-200/70 bg-white lg:hidden">
          {/*
            ★★ 예약·전화를 메뉴 맨 위에 (2026-08-14 운영자) ★★
              헤더에서 예약 버튼을 뺐으니 그 행동이 갈 곳이 있어야 한다. 메뉴를 연 사람은
              찾으러 온 사람이라, 목록을 훑기 전에 바로 할 수 있는 두 가지를 먼저 둔다.
          */}
          <div className="mx-auto max-w-[1320px] px-5 pt-4">
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                aria-label="예약하기 — 네이버 예약 새 창으로 열기"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 px-4 py-3.5 text-[15.5px] font-black text-white shadow-[var(--shadow-btn)]"
              >
                예약하기
              </a>
              <a
                href={CLINIC.phoneHref}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-300 bg-white px-4 py-3.5 text-[15.5px] font-black text-brand-700"
              >
                <PhoneIcon />
                {CLINIC.phone}
              </a>
            </div>
          </div>

          {/*
            ★★ 모바일은 접었다 편다 (2026-08-14) ★★
              항목이 스물다섯 개다. 전부 펼쳐 두면 메뉴를 연 순간 화면이 글자로 가득 차고
              원하는 곳을 찾으려면 한참을 굴려야 한다. 그룹만 보여 주고 누른 것만 편다.
            ★ 그룹 이름은 **버튼**이지 링크가 아니다 — 누르면 펴지는 것과 이동하는 것이
              같은 자리에 있으면 어느 쪽이 일어날지 알 수 없다. 그룹 페이지로 가는 길은
              펼쳐진 안에 '전체 보기' 로 따로 둔다.
            ⚠️ 메뉴가 길어질 수 있으므로 높이를 화면 안으로 제한하고 스크롤을 준다 —
               안 그러면 마지막 항목이 화면 밖으로 나가 닿지 못한다.
          */}
          <nav
            className="mx-auto max-h-[calc(100dvh-140px)] max-w-[1320px] overflow-y-auto px-5 py-4"
            aria-label="모바일 메뉴"
          >
            {NAV.map((item) => {
              const expanded = mobileGroup === item.label;
              return (
                <div key={item.href} className="border-b border-brand-100 last:border-0">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMobileGroup(expanded ? null : item.label)}
                        aria-expanded={expanded}
                        className="flex w-full items-center justify-between gap-3 py-4 text-left text-[15.5px] font-black text-brand-700"
                      >
                        {item.label}
                        <Chevron open={expanded} />
                      </button>

                      {expanded && (
                        <ul className="pb-3">
                          <li>
                            <Link
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2 py-2.5 text-[14px] font-black text-brand-600"
                            >
                              전체 보기
                              <span aria-hidden>→</span>
                            </Link>
                          </li>
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                onClick={() => setMobileOpen(false)}
                                className="block border-t border-brand-50 py-2.5"
                              >
                                <span className="block text-[14.5px] font-bold text-ink">
                                  {c.label}
                                </span>
                                {c.desc && (
                                  <span className="mt-0.5 block text-[12.5px] text-ink-muted">
                                    {c.desc}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 text-[15.5px] font-black text-brand-700"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

/**
 * 메뉴 카드 — 누른 메뉴 바로 아래에 떠오르는 흰 카드.
 *
 * 위에 그룹 이름과 '전체 보기' 가 한 줄로 마주 보고, 그 아래 항목이 두 칸으로 깔린다.
 * 항목마다 이름 + 한 줄 설명이 함께 있어 눌러 보기 전에 무엇인지 안다.
 *
 * ⚠️ 카드 안의 링크를 누르면 반드시 카드를 닫는다(onNavigate). Next.js 는 페이지를 갈아
 *    끼우는 방식이라 헤더가 다시 마운트되지 않는다 — 안 닫으면 이동한 뒤에도 떠 있다.
 */
function MegaPanel({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const children = item.children ?? [];

  /*
    ★ 폭을 못 박는다(600px). 어느 메뉴를 열어도 카드 크기가 같아야
      메뉴를 가로질러 옮길 때 카드가 커졌다 작아졌다 하지 않는다.
    ⚠️ 화면 폭보다 넓어지지 않게 상한을 함께 건다 — 카드는 트리거 가운데에 맞춰
       좌우로 펼쳐지므로, 폭이 화면을 넘으면 한쪽이 잘려 나간다.
  */
  return (
    <div className="w-[600px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-brand-200/70 bg-white p-5 shadow-[0_24px_60px_-24px_rgba(58,33,26,0.45)]">
      {/* 머리 줄 — 왼쪽에 지금 연 메뉴, 오른쪽에 그 그룹 대표 페이지로 가는 길. */}
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-3">
        <p className="text-[16px] font-black text-ink">{item.label}</p>
        <Link
          href={item.href}
          onClick={onNavigate}
          className="group inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-bold text-ink-muted transition-colors hover:text-brand-700"
        >
          전체 보기
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>

      {/*
        ★ 항목을 테두리 있는 칸으로 세운다 — 이름과 설명이 한 덩어리로 묶여 보여야
          '자연치아 살리기 / 발치를 권유받았을 때' 가 두 개의 항목으로 읽히지 않는다.
        ★ 여기서는 grid 를 쓴다(왼→오 순서). 칸이 상자 모양이면 눈이 줄 단위로 읽으므로
          다단(위→아래)보다 격자가 맞다.
      */}
      <ul className="mt-4 grid grid-cols-2 gap-2.5">
        {children.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              onClick={onNavigate}
              className="group block h-full rounded-xl border border-brand-100 px-4 py-3 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              <span className="block text-[14.5px] font-black text-ink transition-colors group-hover:text-brand-700">
                {c.label}
              </span>
              {c.desc && (
                <span className="mt-1 block text-[12.5px] leading-snug text-ink-muted">
                  {c.desc}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      focusable="false"
      className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
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
