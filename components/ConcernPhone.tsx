'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CONCERNS } from '@/lib/concerns';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { LogoMark } from '@/components/Logo';
import { buildWeek, liveOf, useSeoulNow } from '@/lib/liveHours';

/**
 * 망설임 — 손 안의 대화 한 판.
 *
 * ★★ 네 번 고쳤다. 순서를 알고 손댈 것 ★★
 *   ① 카드 3×2 격자 → "여기 클로드 느낌나는데"
 *   ② 세로로 쌓은 대화 → "잘 안보이고 좀 왼쪽으로 치우친 느낌? 너무 스크롤 길어"
 *   ③ 가로로 넘기는 줄기 → "너무 별로야 … 애플디자이너처럼 멋있게"
 *   ④ 지금 — "이거 그냥 아이폰 UI 넣어서 좀 카톡 배경으로 할까? 그리고 대답도 좀
 *      친절한 원장 느낌으로"
 *
 * ★★ 왜 이게 앞의 셋보다 나은가 ★★
 *   ①~③ 은 전부 **여섯 덩어리를 어떻게 늘어놓을까** 의 문제였다. 늘어놓는 한
 *   격자든 줄기든 '반복되는 카드' 라는 인상에서 못 벗어난다.
 *   화면 하나에 담으면 여섯이 **한 덩어리의 대화**가 된다. 셀 것이 없어진다.
 *
 * ★★ 카카오톡을 베끼지 않는다 (판단 근거를 남긴다) ★★
 *   노란 말풍선·카카오 특유의 배경·챗 크롬을 그대로 옮기면 **남의 브랜드 자산**을
 *   병원 홈페이지에 쓰는 것이고, 지어낸 대화가 **실제 상담 기록처럼** 보이면
 *   의료광고 오인 소지도 생긴다. 그래서 형식(메신저·아이폰)만 가져오고 색은
 *   이 병원 팔레트로 쓴다 — 환자 쪽은 테라코타(gold-400), 병원 쪽은 흰 면.
 *   ⚠️ 화면 아래 '예시' 한 줄을 지우지 말 것. 그 한 줄이 오인을 막는다.
 *
 * ★★ 스크롤이 대화를 진행시킨다 ★★
 *   섹션이 화면에 붙어 있는 동안 말풍선이 **하나씩 도착하고**, 최신 말풍선이 늘
 *   화면 아래쪽에 오도록 대화가 위로 밀린다. 실제로 대화를 나누는 순서 그대로다.
 *   ⚠️ 움직이는 값은 transform 과 opacity **둘뿐**이다. 매 프레임 레이아웃이 돌면
 *      그 순간 스크롤이 끊긴다. height·top 같은 것을 여기에 끼워 넣지 말 것.
 *
 * ★★ 고정은 조건부다 — 안 켜지면 그냥 대화 목록이다 ★★
 *   서버가 내는 HTML 은 **고정이 아닌 쪽**이라 자바스크립트가 없어도 열두 마디가
 *   전부 읽히고, 크롤러와 AI 도 처음부터 다 본다. 접거나 숨기지 않는다.
 *   (이 사이트 본문 링크 열일곱 개 중 여섯 개가 여기 있다.)
 */

/** 고정 구간의 길이 = 화면 높이 × 이 값. 체감 속도는 여기 하나로 조절한다. */
const PIN_RATIO = 1.35;
/** 최신 말풍선과 대화 영역 아래 사이에 남길 여백. */
const TAIL = 18;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function ConcernPhone({ heading }: { heading: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLUListElement>(null);

  const [pinned, setPinned] = useState(false);
  const [pinPx, setPinPx] = useState(0);

  /* ── 고정을 켤지 말지 ─────────────────────────────────────────── */
  useEffect(() => {
    const decide = () => {
      const ok =
        window.matchMedia('(min-width: 1024px)').matches &&
        /* 제목 옆에 기기가 통째로 들어가는 최소 높이(실측). 낮으면 화면이 잘린다. */
        window.innerHeight >= 780 &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPinned(ok);
      setPinPx(ok ? Math.round(window.innerHeight * PIN_RATIO) : 0);
    };
    decide();
    window.addEventListener('resize', decide);
    return () => window.removeEventListener('resize', decide);
  }, []);

  /* ── 고정일 때: 스크롤이 말풍선을 하나씩 보낸다 ────────────────── */
  useEffect(() => {
    const column = columnRef.current;
    if (!column) return;

    const bubbles = () => Array.from(column.children) as HTMLElement[];

    if (!pinned) {
      /* 끌 때는 손으로 쓴 스타일을 반드시 지운다 — 안 지우면 투명한 채로 굳는다. */
      column.style.transform = '';
      bubbles().forEach((el) => {
        el.style.transform = '';
        el.style.opacity = '';
      });
      Array.from(indexRef.current?.children ?? []).forEach((li) => {
        const el = li as HTMLElement;
        el.style.opacity = '';
        el.style.color = '';
        (el.firstElementChild as HTMLElement).style.width = '';
      });
      return;
    }

    let raf = 0;
    /*
     * 말풍선마다 "이게 도착했을 때 대화를 얼마나 밀어 올려야 하는가" 를 미리 계산한다.
     * ⚠️ 매 프레임 offsetTop 을 읽으면 브라우저가 강제로 레이아웃을 다시 돌린다.
     */
    let targets: number[] = [];
    const measure = () => {
      /*
       * ⚠️⚠️ 기기 화면이 아니라 **대화 영역**의 높이여야 한다 — 여기서 한 번 틀렸다.
       *    화면 위쪽은 상태 표시줄과 상대 이름이, 아래쪽은 전화 버튼이 먹고 있다.
       *    화면 전체 높이로 재는 동안 최신 말풍선이 영역 아래로 35~69px 잘려 있었다(실측).
       *    부모의 clientHeight 를 쓰면 위아래 크롬 높이를 바꿔도 계산이 따라온다.
       */
      const area = column.parentElement;
      if (!area) return;
      const H = area.clientHeight;
      targets = bubbles().map((el) => Math.max(0, el.offsetTop + el.offsetHeight + TAIL - H));
    };

    const frame = () => {
      raf = 0;
      const outer = outerRef.current;
      if (!outer || targets.length === 0) return;

      const r = outer.getBoundingClientRect();
      /* 화면 밖이면 아무것도 하지 않는다 — 이 섹션은 홈의 한 부분일 뿐이다. */
      if (r.bottom < 0 || r.top > window.innerHeight) return;

      const travel = r.height - window.innerHeight;
      const p = travel > 0 ? clamp(-r.top / travel, 0, 1) : 0;

      const n = targets.length;
      /*
       * f = 지금까지 도착한 말풍선 수(소수). 시작하자마자 첫 마디는 이미 와 있어야
       * 대화가 빈 화면에서 시작하지 않는다 — 그래서 1 부터 센다.
       */
      const f = 1 + p * (n - 1);
      const k = clamp(Math.floor(f) - 1, 0, n - 1);
      const next = Math.min(k + 1, n - 1);
      const y = targets[k] + (targets[next] - targets[k]) * clamp(f - Math.floor(f), 0, 1);
      column.style.transform = `translate3d(0, ${-y.toFixed(1)}px, 0)`;

      const list = bubbles();
      for (let i = 0; i < n; i++) {
        /* 0 = 아직 안 옴, 1 = 다 도착. 도착하는 동안 아래에서 살짝 올라오며 커진다. */
        const a = clamp(f - i, 0, 1);
        list[i].style.opacity = a.toFixed(3);
        list[i].style.transform = `translate3d(0, ${((1 - a) * 12).toFixed(1)}px, 0) scale(${(0.94 + 0.06 * a).toFixed(3)})`;
      }

      /*
       * 왼쪽 목차 — 지금 몇 번째 이야기인지 짚어 준다.
       * ⚠️ 말풍선은 '환자 한 마디 + 병원 한 마디' 라 두 개가 고민 하나다. 그래서 2 로 나눈다.
       *    이 관계가 깨지면(중간에 한 마디를 더 넣는다든지) 목차가 엉뚱한 데를 짚는다.
       */
      const items = Array.from(indexRef.current?.children ?? []) as HTMLElement[];
      if (items.length > 0) {
        const active = clamp(Math.floor((f - 1) / 2), 0, items.length - 1);
        for (let i = 0; i < items.length; i++) {
          const on = i === active;
          items[i].style.opacity = on ? '1' : '0.32';
          items[i].style.color = on ? '#ffffff' : '';
          (items[i].firstElementChild as HTMLElement).style.width = on ? '28px' : '10px';
        }
      }
    };

    /*
     * ⚠️ 스크롤마다 바로 그리지 않고 다음 프레임에 한 번만 그린다. 스크롤 이벤트는
     *    한 프레임에 여러 번 올 수 있어서, 그대로 받으면 같은 그림을 여러 번 그린다.
     */
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    frame();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [pinned]);

  /*
   * ★★ 기기 안의 시계와 진료 상태 (2026-08-26 운영자) ★★
   *   "시간은 지금 한국시간에 맞게 핸드폰 안에서 계속 바뀌게 하고, 그 시간에 맞춰서
   *    진료시간 라이브 표시도 나오게 해줘"
   *   ⚠️ 판정은 lib/liveHours.ts 한 곳에서만 한다 — 진료시간 표(HoursStrip)와 **같은 계산**이다.
   *      여기에 다시 적으면 두 화면이 서로 다른 상태를 띄우게 된다.
   *   ⚠️ 서버 렌더에서는 now 가 null 이다. 그래서 **진료시간 글자는 서버에서도 나오고**
   *      (크롤러가 읽는다), 살아 움직이는 '진료 중' 배지만 마운트 뒤에 붙는다.
   */
  const now = useSeoulNow();
  const week = buildWeek();
  const today = now ? week[now.dow] : null;
  const live = today && now ? liveOf(today, now.min) : null;

  /* 환자 한 마디 → 병원 한 마디 순서로 편다. 화면에서는 이 순서가 곧 대화다. */
  const messages = CONCERNS.flatMap((c) => [
    { who: 'me' as const, text: c.quote, key: `q-${c.quote}` },
    { who: 'clinic' as const, text: c.answer, href: c.href, cta: c.cta, key: `a-${c.quote}` },
  ]);

  return (
    <div
      ref={outerRef}
      className="relative"
      style={pinned ? { height: `calc(100vh + ${pinPx}px)` } : undefined}
    >
      <div className={pinned ? 'sticky top-0 flex h-screen items-center' : 'py-24 lg:py-28'}>
        <div className="mx-auto w-full max-w-[1320px] px-5 lg:px-8">
          {/*
            ★★ 규격 (2026-08-25 운영자: "좀 규격? 배치? 를 좀더 잘 맞춰볼래?") ★★
              실측으로 어긋난 곳이 셋이었다(1626px 화면 기준):
                · 왼쪽 칸 826px 중 글이 576px 만 써서 250px 가 빈 채였다
                · 왼쪽 글 158px 옆에 기기가 560px — 위 220px · 아래 182px 세로 공백
                · 두 칸이 공유하는 정렬선이 하나도 없었다
              → items-stretch + justify-between 으로 **위아래 두 줄을 맞추고**,
                빈 세로를 목차로 채운다. 기기는 원래대로 컨테이너 오른쪽 안쪽에 붙는다.
            ⚠️ items-center 로 되돌리지 말 것. 짧은 글 블록이 긴 기기 옆에서 혼자
               떠 보이던 것이 그 설정 때문이었다.
          */}
          {/*
            ⚠️⚠️ lg:max-w-[1100px] 를 지우지 말 것 — 지우면 글과 기기가 다시 멀어진다 ⚠️⚠️
              컨테이너(1320) 를 꽉 쓰면 1626px 화면에서 왼쪽 칸이 842px 이 되는데 글은
              576px 만 쓴다. 남는 266px 가 글과 기기 사이에 빈 띠로 남는다
              (2026-08-25 운영자: "글이랑 핸드폰이랑 좀 멀지 않나?").
              격자만 1100 으로 묶으면 기기가 글 쪽으로 당겨지고, 남는 여백은 기기
              **바깥쪽**으로 빠져 여백처럼 읽힌다.
            ⚠️ 왼쪽 끝은 컨테이너 그대로다 — 페이지의 다른 제목들과 같은 선을 지킨다.
          */}
          <div className="grid items-stretch gap-14 lg:max-w-[1100px] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div className="flex flex-col justify-between lg:pb-[2.4rem]">
              <div>{heading}</div>

              {/*
                목차 — 대화가 어디까지 왔는지. 왼쪽의 빈 세로를 채우는 동시에
                스크롤 연출이 무엇을 하는지 읽히게 한다(움직이기만 하고 뜻이 없으면 장식이다).
                ⚠️ 문구는 lib/concerns.ts 의 topic 에서만 온다. 여기서 만들지 않는다.
                ⚠️ 좁은 화면에서는 숨긴다 — 거기서는 위아래로 쌓여 빈 세로가 없다.
              */}
              <ul ref={indexRef} className="mt-10 hidden lg:block">
                {CONCERNS.map((con) => (
                  <li
                    key={con.topic}
                    className="flex items-center gap-3.5 py-[15px] text-[15.5px] text-brand-200 transition-[opacity,color] duration-300"
                    style={{ opacity: 0.32 }}
                  >
                    <span aria-hidden className="h-px shrink-0 bg-current transition-[width] duration-300" style={{ width: '10px' }} />
                    {con.topic}
                  </li>
                ))}
              </ul>
            </div>

            {/* ══ 기기 ══════════════════════════════════════════════ */}
            <div className="justify-self-center lg:justify-self-end">
              <div
                className="relative rounded-[3rem] bg-[#0d0c0b] p-[10px]"
                style={{ boxShadow: '0 40px 90px -30px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.09)' }}
              >
                {/*
                  ★ 화면 높이는 **언제나** 고정이다. 처음엔 고정 연출이 아닐 때 열두 마디를
                    통째로 펼쳤는데, 그러면 모바일에서 이 섹션만 1,881px 이 됐다(실측).
                    기기는 높이가 정해진 물건이라 펼치는 순간 기기로 안 보이기도 한다.
                    대신 고정이 아닐 때는 **손가락으로 안을 굴린다** — 실제 메신저와 같다.
                */}
                <div
                  ref={screenRef}
                  className="relative w-[330px] overflow-hidden rounded-[2.4rem] bg-cream-deep"
                  style={{ height: 'clamp(520px, 60vh, 640px)' }}
                >
                  {/* ── 상태 표시줄 ── */}
                  <div className="relative z-20 flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-bold text-ink">
                    {/*
                      ⚠️ 고정된 '9:41'(목업 관습)을 쓰지 않는다 — 운영자 요청대로 실제
                         서울 시각이다. 서버에서는 비워 두고(hydration 보호) 마운트 뒤에 뜬다.
                      ⚠️ 자리를 미리 잡아 둔다(min-w). 안 그러면 시각이 들어오는 순간
                         가운데 섬이 좌우로 밀린다.
                    */}
                    <span className="min-w-[42px] tabular-nums">{now?.clock ?? ''}</span>
                    {/* 가운데 섬 — 기기라는 것을 알리는 최소 신호. */}
                    <span aria-hidden className="absolute top-2.5 left-1/2 h-[26px] w-[90px] -translate-x-1/2 rounded-full bg-[#0d0c0b]" />
                    <span aria-hidden className="flex items-center gap-1">
                      <Bars />
                      <Wifi />
                      <Battery />
                    </span>
                  </div>

                  {/* ── 대화 상대 ── */}
                  <div className="relative z-20 flex items-center gap-3 border-b border-ink/10 bg-white/80 px-4 py-3 backdrop-blur">
                    {/* 글자 '동' 대신 실제 로고 마크 — 간판·명함과 같은 표시를 쓴다. */}
                    <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center">
                      <LogoMark size={36} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-bold text-ink">{CLINIC.name}</span>
                      {/*
                        오늘 진료시간 + 지금 상태.
                        ⚠️ 시간 글자는 now 없이도 나온다 — 서버가 낸 HTML 에 남아야 크롤러가 읽는다.
                           살아 움직이는 배지만 마운트 뒤에 붙는다.
                      */}
                      <span className="flex items-center gap-1.5 text-[12.5px] text-ink-muted">
                        {/*
                          ⚠️ 휴진인 날에는 시간 글자를 빼야 한다 — 안 그러면 "휴진 · 오늘 휴진"
                             처럼 같은 말이 두 번 나온다(일요일에 실제로 그랬다).
                          ⚠️ now 가 없을 때(서버 렌더)는 rows 의 첫 줄을 그대로 낸다.
                             크롤러가 읽는 HTML 에 진료시간이 남아야 한다.
                        */}
                        {!today?.closed && (
                          <span className="tabular-nums">
                            {today
                              ? today.time
                              : `${UNVERIFIED.hours.rows[0].open} – ${UNVERIFIED.hours.rows[0].close}`}
                          </span>
                        )}
                        {live && (
                          <>
                            {!today?.closed && <span aria-hidden>·</span>}
                            <span
                              className={`inline-flex items-center gap-1.5 font-bold ${
                                live.open ? 'text-brand-700' : 'text-ink-muted'
                              }`}
                            >
                              <span
                                aria-hidden
                                className={`relative inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-current ${
                                  live.open ? 'live-dot' : ''
                                }`}
                              />
                              {live.text}
                            </span>
                          </>
                        )}
                      </span>
                    </span>
                  </div>

                  {/*
                    ── 대화 ──
                    고정 연출일 때는 스크롤이 대화를 몰기 때문에 안쪽 스크롤을 막고,
                    아닐 때는 손으로 굴리게 연다.
                    ⚠️ 높이 계산(104 + 68)은 위 상태 표시줄·상대 이름과 아래 전화 버튼의
                       높이 합이다. 그 둘을 바꾸면 이 숫자도 같이 바꿀 것.
                  */}
                  <div
                    className={`relative h-[calc(100%-172px)] px-4 ${
                      pinned ? 'overflow-hidden' : 'scrollbar-none overflow-y-auto overscroll-contain'
                    }`}
                  >
                    <div ref={columnRef} className="flex flex-col gap-3 pt-4 pb-4 will-change-transform">
                      {messages.map((m) =>
                        m.who === 'me' ? (
                          <p
                            key={m.key}
                            className="max-w-[80%] self-end rounded-2xl rounded-tr-md bg-gold-400 px-4 py-2.5 text-[13.5px] leading-[1.6] font-bold text-ink"
                          >
                            {m.text}
                          </p>
                        ) : (
                          <span key={m.key} className="flex max-w-[86%] flex-col items-start gap-1.5 self-start">
                            <span className="rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[13px] leading-[1.75] text-ink shadow-[0_2px_8px_-4px_rgba(0,0,0,.25)]">
                              {m.text}
                            </span>
                            {/*
                              말풍선 밑에 붙는 바로가기. 진짜 <a> 라 크롤러도 링크로 읽는다 —
                              이 섹션이 홈에서 맡은 여섯 개의 본문 링크가 여기다.
                            */}
                            <Link
                              href={m.href!}
                              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 text-[12.5px] font-bold text-brand-700 transition hover:border-ink/35 hover:bg-white"
                            >
                              {m.cta}
                              <span aria-hidden>→</span>
                            </Link>
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  {/*
                    ── 화면 아래 ──
                    ★ 메신저라면 여기가 입력창 자리다. 그런데 **가짜 입력창은 두지 않는다** —
                      눌러도 아무 일이 없으면 그건 속이는 화면이다. 대신 실제로 걸리는
                      전화번호를 둔다. 기기 안에서 끝맺음이 되고, 하는 일도 정직하다.
                    ★ 잘린 단면이 그대로 보이면 기기가 아니라 상자다 — 위로 옅게 사라지게 둔다.
                  */}
                  <div className="absolute inset-x-0 bottom-0 z-10 h-[68px] border-t border-ink/10 bg-white/85 px-4 py-3 backdrop-blur">
                    <a
                      href={`tel:${CLINIC.phone.replace(/[^0-9]/g, '')}`}
                      className="flex h-full items-center justify-center gap-2 rounded-full bg-brand-700 text-[13px] font-bold text-white transition hover:bg-brand-800"
                    >
                      전화로 물어보기 {CLINIC.phone}
                    </a>
                  </div>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-[68px] z-10 h-10"
                    style={{ background: 'linear-gradient(to top, var(--color-cream-deep), transparent)' }}
                  />
                </div>
              </div>

              {/*
                ⚠️ 이 한 줄을 지우지 말 것. 지어낸 대화가 실제 상담 기록처럼 읽히면
                   의료광고 오인이다. 문구는 lib/concerns.ts 의 취지("자주 듣는 이야기")와 같다.
              */}
              {/*
                ⚠️⚠️ 두 줄 다 지우지 말 것 ⚠️⚠️
                  첫 줄 — 지어낸 대화가 실제 상담 기록처럼 읽히면 의료광고 오인이다.
                  둘째 줄 — 자동 진료 판정은 **공휴일·임시 휴진을 알 수 없다.** 쉬는 날
                    "진료 중" 이 떠 있으면 그 표시 하나가 환자를 헛걸음시킨다. 이 기능은
                    2026-08-14 에 그 이유로 한 번 걷어냈다가, 한계를 화면에 적는 조건으로
                    되살린 것이다(lib/liveHours.ts 머리말). 전화 버튼이 바로 위에 있다.
              */}
              <p className="mt-5 max-w-[330px] text-center text-[12.5px] leading-relaxed text-brand-300">
                자주 듣는 질문을 대화 형식으로 구성한 예시입니다. 공휴일·임시 휴진은 위 진료 상태에
                반영되지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ 상태 표시줄 조각 — 기기처럼 보이기 위한 최소한의 장식 ══════════ */

function Bars() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" className="text-ink">
      <rect x="0" y="7.5" width="3" height="3.5" rx="1" />
      <rect x="4.5" y="5" width="3" height="6" rx="1" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" y="0" width="3" height="11" rx="1" />
    </svg>
  );
}

function Wifi() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" className="text-ink">
      <path d="M1 3.6a9.5 9.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3.6 6.3a5.8 5.8 0 0 1 7.8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7.5" cy="9.3" r="1.3" fill="currentColor" />
    </svg>
  );
}

function Battery() {
  return (
    <svg width="24" height="11" viewBox="0 0 24 11" fill="none" className="text-ink">
      <rect x="0.6" y="0.6" width="19" height="9.8" rx="2.6" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
      <rect x="2.2" y="2.2" width="14" height="6.6" rx="1.5" fill="currentColor" />
      <path d="M21.4 4v3c.9-.3 1.4-.8 1.4-1.5S22.3 4.3 21.4 4Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}
