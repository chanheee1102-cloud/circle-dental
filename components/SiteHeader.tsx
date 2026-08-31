'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  /*
   * ★★ 첫 화면 위에서는 헤더를 투명하게 (2026-08-25 운영자: "아예 똑같이 해줘. 헤더랑 전부") ★★
   *   두 번째 버전처럼 사진이 화면 맨 위까지 이어지고 헤더가 그 위에 얹힌다.
   * ⚠️⚠️ 조건에서 pathname 을 빼지 말 것 ⚠️⚠️
   *   투명하게 만들면 로고·메뉴·전화번호를 전부 흰색으로 뒤집어야 하는데, 하위 페이지는
   *   맨 위가 밝은 크림색이라 흰 글자가 통째로 사라진다. 어두운 히어로가 깔린 홈에서,
   *   그것도 아직 안 내렸을 때만 투명이다.
   * ⚠️ 홈에서 이 모드가 성립하려면 히어로가 헤더 아래로 파고들어야 한다 —
   *   app/page.tsx 의 Hero 에 음수 위쪽 여백(-mt)이 그 짝이다. 한쪽만 고치면
   *   헤더 자리에 크림색 띠가 남거나 히어로가 헤더에 잘린다.
   */
  const pathname = usePathname();
  /*
   * ⚠️ 전에는 메뉴를 열면(openMenu) 사진 위 상태를 풀었다. 그때는 헤더가 **크림색 띠**로
   *    바뀌어야 흰 메가메뉴가 붙어 보였기 때문이다. 지금은 헤더가 떠 있는 유리판이라
   *    그럴 이유가 없고, 오히려 손을 올릴 때마다 어두운 유리 → 밝은 유리로 튄다.
   * ⚠️ 모바일 서랍(mobileOpen)은 여전히 뺀다 — 서랍이 크림색 판이라 위에 어두운 유리가
   *    얹히면 두 재질이 붙어 어색하다.
   */
  const overHero = pathname === '/' && !scrolled && !mobileOpen;

  /** 지금 열린 메뉴 항목 — 판을 알약 밖에서 한 번만 그리므로 여기서 찾아 둔다. */
  const openPanel = NAV.find((n) => n.label === openMenu && n.children?.length);
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
      /*
       * ⚠️ 바깥 <header> 는 **아무것도 안 그린다.** 배경도 테두리도 없다.
       *    여기에 배경이나 그라디언트를 다시 넣으면 상자가 끝나는 자리에 가로줄이 생긴다
       *    (2026-08-27 에 실제로 생겼던 그 선이다).
       */
      className="sticky top-0 z-50"
    >
      <div
        className={`relative mx-auto max-w-[1320px] px-4 transition-all duration-300 lg:px-6 ${
          scrolled ? 'py-1 sm:py-2' : 'py-1.5 sm:py-3'
        }`}
      >
        {/*
          ★★ 떠 있는 유리판 ★★
            헤더가 화면을 가로지르는 '띠' 가 아니라 사진 위에 **얹힌 물건**이 된다.
            히어로 왼쪽 아래 카드와 같은 재질이라 첫 화면에 유리 두 장이 같은 언어로 놓인다.
          ★ 3D 느낌은 세 겹이 만든다 —
              ① 위 모서리 안쪽의 밝은 실선(inset 하이라이트) = 빛을 받는 유리 윗면
              ② 아래로 깔리는 부드러운 그림자 = 떠 있는 높이
              ③ 대각선 그라데이션 = 판이 평평하지 않다는 느낌
            셋 중 하나만 빼도 그냥 반투명 네모가 된다.
          ⚠️ 사진 위(overHero)와 밝은 면에서 재질이 반대다. 한쪽만 고치지 말 것.
          ⚠️ overflow-hidden 을 주지 말 것 — 메가메뉴가 이 판 밖으로 내려와야 한다.

          ★★ 더 투명하게 (2026-08-27, 오너: "내가 보낸것처럼 더 투명하게") ★★
            색을 얹어 어둡게 하면 판이 **불투명한 회색 네모**가 된다. 참고 사이트의 판은
            뒤가 훤히 비치는데도 글자가 읽힌다 — 색을 얹는 대신 **뒤 배경 자체를 눌러서**다.
            backdrop-brightness 가 그 역할을 한다. 판은 비쳐 보이고 대비는 남는다.
          ⚠️ 얹는 색(gradient)을 다시 올리지 말 것 — 그 순간 투명함이 사라진다.
          ⚠️ 반대로 brightness 를 1 에 가깝게 되돌리면 밝은 사진 위에서 글자가 무너진다.
             값을 만지면 반드시 실측할 것 — 사진 위 글자는 CSS 만 봐선 알 수 없다.
        */}
        <div
          className={`flex w-full items-center justify-between gap-3 rounded-[18px] border px-3 backdrop-saturate-150 transition-all duration-300 sm:px-4 lg:mx-auto lg:w-fit lg:gap-8 ${
            // ⚠️ 히어로의 -mt-[68px] sm:-mt-[94px] 와 짝이다. 여백+판 높이의 합을 맞출 것.
            scrolled ? 'h-12 sm:h-[58px]' : 'h-14 sm:h-[70px]'
          } ${
            overHero
              ? // 사진 위 — 뒤가 훤히 비쳐야 한다. 흐림을 약하게 두어 형체가 남고,
                //   밝기만 눌러 흰 글자의 대비를 만든다(실측 6.7~11.8:1).
                'border-white/16 bg-[linear-gradient(135deg,rgba(23,23,26,0.22),rgba(23,23,26,0.06))] backdrop-blur-[7px] backdrop-brightness-[0.76] shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_18px_44px_-20px_rgba(0,0,0,0.7)]'
              : // ★★ 내려도 흰 판이 되지 않는다 (2026-08-28 오너: "헤더가 내리면 하얀색으로 변하네?") ★★
                //   전에는 거의 다 채워서 유리 느낌이 사라졌다. 지금은 면을 훨씬 비우고
                //   **흐림을 아주 세게**(40px) 걸어 뒤 글자를 형체 없이 뭉갠다.
                // ⚠️ 흐림을 줄이지 말 것 — 어두운 글자는 밝기를 눌러도 안 지워지므로,
                //    옅은 면 + 약한 흐림이면 본문이 헤더 글자와 겹쳐 읽힌다(실제로 겪었다).
                // ⚠️ backdrop-saturate 로 뒤 색을 살짝 살린다 — 완전한 무채색이면 유리가 아니라
                //    반투명 종이로 보인다.
                // ⚠️ 2026-08-28: 너무 비워서 판이 안 보였다(오너). 면을 조금 채우고
                //    테두리·그림자를 세워 '떠 있는 물건' 으로 읽히게 한다.
                //    흐림 40px 은 그대로 — 이걸 줄이면 뒤 본문이 헤더 글자와 겹친다.
                'border-charcoal/16 bg-[linear-gradient(135deg,rgba(254,255,252,0.80),rgba(254,255,252,0.64))] backdrop-blur-[40px] backdrop-saturate-[1.6] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_20px_-12px_rgba(23,23,23,0.18),0_24px_50px_-26px_rgba(23,23,23,0.35)]'
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
          {/*
            ⚠️ 데스크톱 알약 안에서는 **마크만** 쓴다 — 워드마크(214px)가 알약을 두 배로 벌린다.
               좁은 화면은 알약이 화면 폭을 다 쓰므로 워드마크를 그대로 둔다.
            ⚠️ 링크와 aria-label 은 양쪽 다 같다 — 마크만 보여도 병원명은 읽힌다.
          */}
          <Link href="/" aria-label={`${CLINIC.name} 홈`} className="transition-opacity hover:opacity-80">
            <LogoLockup tone={overHero ? 'light' : 'brand'} />
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
        {/*
          ★★ 메뉴를 알약 하나에 담는다 (2026-08-27) ★★
            GIC 의 표식 중 하나가 **50px 알약 안에 든 메뉴**다. 줄글처럼 늘어놓던 메뉴가
            하나의 덩어리가 되면서 헤더가 '바' 가 아니라 '얹힌 물건' 으로 읽힌다.
          ⚠️ overflow-hidden 을 주지 말 것 — 메가메뉴가 이 알약 밖으로 내려와야 한다.
          ⚠️ 사진 위(overHero)에서는 알약을 그리지 않는다. 반투명 흰 알약이 사진 위에
             떠 있으면 헤더가 두 겹으로 보인다.
        */}
        {/*
          ⚠️ 유리판 안이므로 메뉴 알약에 테두리를 두지 않는다 — 상자 안의 상자가 된다.
             열린 항목만 옅은 면으로 표시한다.
        */}
        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="주 메뉴"
        >
          {NAV.map((item) => {
            const open = openMenu === item.label;
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.children ? item.label : null)}
              >
                {/*
                  ⚠️ 밑줄 표시를 뺐다 — 알약 안에서는 밑줄이 알약 테두리에 붙어 지저분해진다.
                     열린 항목은 **옅은 면**으로 표시한다. 채운 dusk 로 하면 메뉴 하나가
                     버튼처럼 보여 진짜 버튼(예약하기)과 다툰다.
                  ⚠️ 굵기를 900 → 500 으로 내렸다. 이 시스템은 굵기로 강조하지 않는다.
                */}
                <Link
                  href={item.href}
                  onFocus={() => setOpenMenu(item.children ? item.label : null)}
                  aria-expanded={item.children ? open : undefined}
                  className={`relative inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-[17px] font-medium transition-colors ${
                    overHero
                      ? open
                        ? 'bg-white/14 text-white'
                        : 'text-white/90 hover:text-white'
                      : open
                        ? 'bg-charcoal/8 text-charcoal'
                        : 'text-twilight hover:text-charcoal'
                  }`}
                >
                  {item.label}
                  {item.children && <Chevron open={open} />}
                </Link>

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
            헤더가 거의 흰 바탕이라 채운 초록 버튼이 가장 먼저 눈에 든다.
        */}
        <div className="flex items-center gap-2">
          {/*
            ★★ 전화·예약 버튼을 알약에서 뺐다 (2026-08-27 오너) ★★
              참고 사이트의 알약에는 링크와 버튼 하나뿐이라 좁다. 우리는 여기에 전화번호
              버튼(약 170px)과 예약 버튼까지 넣어서 같은 알약이 두 배로 벌어져 있었다.
            ⚠️ 두 행동을 없앤 것이 아니다 —
                 예약: 히어로 주 버튼 · 퀵메뉴(네이버예약) · 모바일 서랍/하단 바 · 푸터
                 전화: 히어로 보조 버튼(번호 그대로 보인다) · 퀵메뉴(전화상담) ·
                       모바일 서랍/하단 바 · 푸터
            ⚠️ 여기에 버튼을 다시 넣지 말 것. 넣는 순간 알약이 다시 벌어지고,
               좁은 알약이 이 헤더의 전부다.
          */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] border sm:h-11 sm:w-11 lg:hidden ${
              overHero ? 'border-white/40 text-white' : 'border-wine-line text-charcoal'
            }`}
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileOpen}
          >
            <span className="text-lg leading-none">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
        </div>

        {/*
          ★★ 메가메뉴는 알약 **밖**에 그린다 (2026-08-27) ★★
            알약이 backdrop-filter 를 쓰기 때문에, 그 안에 있으면 판의 backdrop-filter 가
            통째로 죽는다(위 알약 주석 참고). 밖으로 빼야 판도 뒤를 눌러 글자를 살릴 수 있다.
          ⚠️ 그래도 <header> 의 자손으로는 남겨야 한다 — 밖으로 빼면 알약에서 판으로
             마우스를 옮기는 순간 header 의 onMouseLeave 가 떠서 메뉴가 닫힌다.
          ⚠️ transform 으로 가운데를 맞추지 말 것 — transform 도 backdrop root 를 만든다.
             판 폭이 600px 로 못 박혀 있으므로 고정 음수 여백으로 맞춘다.
          ★ 항목마다 따로 띄우던 것을 알약 아래 **한 자리**로 모았다. 어느 메뉴를 열어도
            같은 자리에 떠서 메뉴를 가로질러도 판이 움직이지 않는다.
        */}
        {openPanel && (
          <div className="absolute top-full left-1/2 z-10 ml-[-300px]">
            <MegaPanel item={openPanel} onNavigate={() => setOpenMenu(null)} overHero={overHero} />
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="border-t border-wine-line bg-wine-bg lg:hidden">
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
                className="inline-flex items-center justify-center rounded-[8px] bg-dusk px-4 py-3.5 text-[16px] font-semibold text-parchment"
              >
                예약하기
              </a>
              <a
                href={CLINIC.phoneHref}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-signal card-glass px-4 py-3.5 text-[16px] font-semibold text-charcoal"
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
                <div key={item.href} className="border-b border-wine-line last:border-0">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMobileGroup(expanded ? null : item.label)}
                        aria-expanded={expanded}
                        className="flex w-full items-center justify-between gap-3 py-4 text-left text-[16.5px] font-black text-charcoal"
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
                              className="flex items-center gap-2 py-2.5 text-[15px] font-black text-ash"
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
                                className="block border-t border-mist-soft py-2.5"
                              >
                                <span className="block text-[15.5px] font-bold text-charcoal">
                                  {c.label}
                                </span>
                                {c.desc && (
                                  <span className="mt-0.5 block text-[13.5px] text-ash">
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
                      className="block py-4 text-[16.5px] font-black text-charcoal"
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
/**
 * 메가메뉴.
 *
 * ⚠️ 재질을 헤더 알약과 **같이** 간다 (2026-08-27 오너: "하얀색 디자인말고 지금처럼 투명하게").
 *    유리 알약 아래에 흰 판이 붙어 있으면 한 덩어리가 아니라 두 벌로 보인다.
 * ⚠️ 밝은 면에서는 투명하게 두면 안 된다 — 스크롤하는 본문 글자가 판을 뚫고 비친다
 *    (헤더에서 실제로 겪었다). 어두운 글자는 밝기를 눌러도 안 지워진다.
 */
function MegaPanel({
  item,
  onNavigate,
  overHero,
}: {
  item: NavItem;
  onNavigate: () => void;
  overHero: boolean;
}) {
  const children = item.children ?? [];

  /*
    ★ 폭을 못 박는다(600px). 어느 메뉴를 열어도 카드 크기가 같아야
      메뉴를 가로질러 옮길 때 카드가 커졌다 작아졌다 하지 않는다.
    ⚠️ 화면 폭보다 넓어지지 않게 상한을 함께 건다 — 카드는 트리거 가운데에 맞춰
       좌우로 펼쳐지므로, 폭이 화면을 넘으면 한쪽이 잘려 나간다.
  */
  /* ⚠️ 그림자를 크게 쓰지 말 것 — 이 시스템은 그림자 대신 실선으로 면을 나눈다. */
  return (
    <div
      className={`mega-in w-[600px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-[16px] border p-5 backdrop-saturate-150 ${
        overHero
          ? // ★ 알약보다 조금 더 누른다 — 판이 600×340 으로 넓어 사진의 밝은 구역을
            //   통째로 덮는다. 알약과 같은 값이면 밝은 쪽 글자가 기준에 못 미친다.
            'border-white/16 bg-[linear-gradient(135deg,rgba(23,23,26,0.28),rgba(23,23,26,0.12))] backdrop-blur-[10px] backdrop-brightness-[0.50] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_22px_50px_-26px_rgba(0,0,0,0.75)]'
          : // ⚠️ 알약과 **같은 재질**이어야 한다 — 알약만 유리이고 판만 흰색이면 두 벌로 보인다.
            //    흐림을 세게 거는 이유는 알약과 같다(뒤 글자를 형체 없이 뭉개려고).
            'border-charcoal/12 bg-[linear-gradient(135deg,rgba(254,255,252,0.72),rgba(254,255,252,0.56))] backdrop-blur-[40px] backdrop-saturate-[1.6] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_18px_40px_-28px_rgba(23,23,23,0.32)]'
      }`}
    >
      {/* 머리 줄 — 왼쪽에 지금 연 메뉴, 오른쪽에 그 그룹 대표 페이지로 가는 길. */}
      <div className={`flex items-baseline justify-between gap-4 border-b pb-3 ${overHero ? 'border-white/15' : 'border-wine-line'}`}>
        <p className={`text-[18px] font-semibold ${overHero ? 'text-parchment' : 'text-charcoal'}`}>{item.label}</p>
        <Link
          href={item.href}
          onClick={onNavigate}
          className={`group inline-flex shrink-0 items-center gap-1.5 text-[15px] font-medium transition-colors ${
            overHero ? 'text-mist/80 hover:text-parchment' : 'text-ash hover:text-charcoal'
          }`}
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
              className={`group block h-full rounded-[12px] border px-4 py-3 transition-colors ${
                overHero
                  ? 'border-white/14 hover:border-parchment/60 hover:bg-white/10'
                  : 'border-wine-line hover:border-charcoal/40 hover:bg-wine-soft/60'
              }`}
            >
              {/*
                ⚠️ 설명 줄(c.desc)을 그리지 않는다 (2026-08-27 오너: "저 서브 설명같은 문구들
                   다 지워줘"). 이름만 남기니 판이 짧아지고 훑기 쉬워진다.
                ⚠️ lib/nav.ts 의 desc 데이터는 지우지 않았다 — 다른 곳(/insight 카드 등)에서
                   쓰고, 되살릴 때도 필요하다. 여기서 안 그릴 뿐이다.
              */}
              <span className={`block text-[17px] font-semibold transition-colors ${
                overHero ? 'text-parchment' : 'text-charcoal group-hover:text-twilight'
              }`}>
                {c.label}
              </span>
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
