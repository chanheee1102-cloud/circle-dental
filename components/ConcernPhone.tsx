'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CONCERNS } from '@/lib/concerns';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { LogoMark } from '@/components/Logo';
import { buildWeek, liveOf, useSeoulNow } from '@/lib/liveHours';
import { Sentences } from '@/components/ui';

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
 * ★★★ **기기 위에서만 안이 굴러간다** (2026-08-31 운영자) ★★★
 *   "핸드폰 위에 스크롤 할때만 안에 내용 스크롤되게 해줘. 나머지 스크롤 하면 그냥
 *    메인페이지 자체 스크롤 되게 해줘."
 *
 *   ⚠️⚠️ **화면 고정(sticky pin)을 되살리지 말 것** ⚠️⚠️
 *     전에는 이 섹션이 화면에 235vh 동안 붙어 있고 **페이지 스크롤이 말풍선을 하나씩
 *     보냈다.** 연출은 좋았지만 대가가 컸다 — 이 구획 하나가 2,234px 이었고, 지나가려면
 *     대화를 끝까지 봐야 했다. 요청은 정확히 그 반대다.
 *   ★ 지금은 대화 영역이 그냥 **스크롤되는 상자**다. 커서가 그 위에 있으면 안이 굴러가고,
 *     밖이면 페이지가 굴러간다 — 브라우저가 원래 하는 일이라 스크롤을 가로채지 않는다.
 *   ⚠️ overscroll-behavior:contain 을 넣지 말 것. 안이 끝까지 내려가면 그 자리에서
 *      페이지가 **멈춘다** — 커서를 치우기 전까지 갇힌다. 끝에서는 페이지로 이어져야 한다.
 *
 * ★ 자바스크립트가 없어도 열두 마디가 전부 읽힌다. 접거나 숨기지 않는다.
 *   (이 사이트 본문 링크 열일곱 개 중 여섯 개가 여기 있다.)
 */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function ConcernPhone({ heading }: { heading: ReactNode }) {
  /** 대화가 굴러가는 상자. 목차와 '이 이야기로 가기' 가 이걸 기준으로 움직인다. */
  const areaRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  /** 지금 몇 번째 고민을 보고 있나 — 왼쪽 목차가 이 값을 짚는다. */
  const [at, setAt] = useState(0);

  /*
   * 안쪽 스크롤 → 목차.
   * ★ 환자 말풍선(짝수 번째)의 위치를 기준으로 삼는다 — 고민 하나는 '환자 한 마디 +
   *   병원 한 마디' 라, 환자 말풍선이 화면 위쪽에 걸리는 순간이 그 이야기의 시작이다.
   * ⚠️ 스크롤마다 바로 계산하지 않고 다음 프레임에 한 번만 한다. 스크롤 이벤트는
   *    한 프레임에 여러 번 온다.
   * ⚠️ offsetTop 은 스크롤 컨테이너 기준이라 매번 다시 읽어도 된다(레이아웃이 안 바뀐다).
   */
  useEffect(() => {
    const area = areaRef.current;
    const column = columnRef.current;
    if (!area || !column) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const marks = Array.from(column.children).filter((_, i) => i % 2 === 0) as HTMLElement[];
      /* 상자 위에서 1/4 되는 지점에 걸린 이야기를 '지금' 으로 본다. */
      const line = area.scrollTop + area.clientHeight * 0.25;
      let k = 0;
      for (let i = 0; i < marks.length; i++) if (marks[i].offsetTop <= line) k = i;
      /*
       * ⚠️ 바닥에 닿으면 **무조건 마지막**이다 (2026-08-31 실측).
       *    마지막 이야기는 더 밀어 올릴 곳이 없어 25% 선까지 못 올라온다. 그래서 끝까지
       *    내려도 목차가 다섯 번째를 짚고 있었다 — 다 봤는데 안 봤다고 하는 셈이다.
       */
      if (area.scrollTop >= area.scrollHeight - area.clientHeight - 2) k = marks.length - 1;
      setAt(clamp(k, 0, marks.length - 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    area.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      area.removeEventListener('scroll', onScroll);
    };
  }, []);

  /** 목차를 누르면 그 이야기로 데려간다. ⚠️ 페이지가 아니라 **상자 안**을 움직인다. */
  const jump = (n: number) => {
    const area = areaRef.current;
    const el = columnRef.current?.children[n * 2] as HTMLElement | undefined;
    if (!area || !el) return;
    area.scrollTo({ top: Math.max(0, el.offsetTop - 16), behavior: 'smooth' });
  };

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
    <div className="relative">
      {/*
        ⚠️ 여기에 sticky·h-screen·calc 높이를 다시 넣지 말 것 — 위 머리말 참조.
           페이지 스크롤은 이 구획을 그냥 지나간다.
      */}
      <div className="py-24 lg:py-32">
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
            {/*
              ⚠️⚠️ justify-between 으로 되돌리지 말 것 (2026-08-31) ⚠️⚠️
                화면 고정이던 시절에는 위아래 두 줄을 기기와 맞추려고 벌려 뒀다. 고정을
                없앤 뒤에도 그대로 두었더니 제목과 목차 사이에 **200px 넘는 빈 띠**가
                남았다(실측). 벌릴 이유가 사라졌으므로 한 덩어리로 묶어 기기 높이의
                가운데에 맞춘다.
            */}
            <div className="flex flex-col justify-center">
              <div>{heading}</div>

              {/*
                목차 — **여섯 고민의 차례표이자 이동 수단.**

                ⚠️⚠️ 흐릿한 장식으로 되돌리지 말 것 (2026-08-31) ⚠️⚠️
                  전에는 opacity 0.32 로 눌러 둔 글자였다. 어두운 바탕에서 그 값은
                  1.8:1 — 읽으라고 둔 글이 아니라 무늬였다. 게다가 스크롤에 따라
                  **움직이기만 하고 누를 수는 없어서**, 여섯 줄이 눈에는 걸리는데
                  아무 데도 데려다주지 않았다.
                ★ 지금은 button 이다. 누르면 기기 안이 그 이야기로 굴러간다.
                  기기가 오른쪽에 있고 목차가 왼쪽이라, 손이 닿는 자리가 하나 늘어난다.
                ⚠️ 문구는 lib/concerns.ts 의 topic 에서만 온다. 여기서 만들지 않는다.
                ⚠️ 좁은 화면에서는 숨긴다 — 거기서는 기기가 아래로 내려와 목차가 멀어진다.
              */}
              {/*
                ★★ **쓰는 법을 한 줄로 말한다** (2026-08-31) ★★
                  전에는 페이지를 내리면 대화가 저절로 진행돼서 아무 설명이 필요 없었다.
                  지금은 기기 안이 스스로 굴러가지 않으므로, 말하지 않으면 아무도
                  **여섯 마디가 더 있다는 것**도 **목차를 누를 수 있다는 것**도 모른다.
                ⚠️ 지우지 말 것. 이 한 줄이 없으면 첫 대화 한 판만 보고 지나간다.
              */}
              <p className="mt-9 hidden text-[14.5px] text-mist lg:block">
                아래 고민을 누르거나, 화면 위에서 굴려 보세요.
              </p>
              <ul className="mt-3 hidden lg:block">
                {CONCERNS.map((con, n) => {
                  const on = n === at;
                  return (
                    <li key={con.topic}>
                      <button
                        type="button"
                        onClick={() => jump(n)}
                        aria-current={on}
                        className={`flex w-full items-center gap-3.5 py-[13px] text-left text-[16.5px] transition-colors duration-300 ${
                          on ? 'font-bold text-parchment' : 'text-mist hover:text-parchment'
                        }`}
                      >
                        {/* 지금 보고 있는 줄만 눈금이 길어지고 금색이 된다 — 색과 길이 둘로 말한다. */}
                        <span
                          aria-hidden
                          className={`h-px shrink-0 transition-[width,background-color] duration-300 ${
                            on ? 'w-7 bg-signal' : 'w-2.5 bg-mist'
                          }`}
                        />
                        {con.topic}
                      </button>
                    </li>
                  );
                })}
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
                  className="relative w-[330px] overflow-hidden rounded-[2.4rem] bg-wine-soft"
                  style={{ height: 'clamp(520px, 60vh, 640px)' }}
                >
                  {/* ── 상태 표시줄 ── */}
                  <div className="relative z-20 flex items-center justify-between px-6 pt-3 pb-1 text-[14px] font-bold text-charcoal">
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
                  <div className="relative z-20 flex items-center gap-3 border-b border-wine-line bg-white/80 px-4 py-3 backdrop-blur">
                    {/* 글자 '동' 대신 실제 로고 마크 — 간판·명함과 같은 표시를 쓴다. */}
                    <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center">
                      <LogoMark size={36} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-bold text-charcoal">{CLINIC.name}</span>
                      {/*
                        오늘 진료시간 + 지금 상태.
                        ⚠️ 시간 글자는 now 없이도 나온다 — 서버가 낸 HTML 에 남아야 크롤러가 읽는다.
                           살아 움직이는 배지만 마운트 뒤에 붙는다.
                      */}
                      <span className="flex items-center gap-1.5 text-[13.5px] text-ash">
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
                                live.open ? 'text-charcoal' : 'text-ash'
                              }`}
                            >
                              <span
                                aria-hidden
                                className={`relative inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-current ${
                                  live.open ? 'live-dot' : ''
                                }`}
                              />
                              <Sentences text={live.text} />
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
                    ref={areaRef}
                    /*
                     * ⚠️ overscroll-contain 을 넣지 말 것 — 끝까지 내려간 뒤 커서가 여기
                     *    있으면 페이지가 멈춰 갇힌다. 끝에서는 페이지로 이어져야 한다.
                     * ⚠️ 높이 계산(104 + 68)은 위 상태 표시줄·상대 이름과 아래 전화 버튼의
                     *    높이 합이다. 그 둘을 바꾸면 이 숫자도 같이 바꿀 것.
                     */
                    className="scrollbar-none relative h-[calc(100%-172px)] overflow-y-auto px-4"
                  >
                    <div ref={columnRef} className="flex flex-col gap-3 pt-4 pb-4">
                      {messages.map((m) =>
                        m.who === 'me' ? (
                          <p
                            key={m.key}
                            className="max-w-[80%] self-start rounded-2xl rounded-tl-md border border-wine-line bg-parchment/80 px-4 py-2.5 text-[14.5px] leading-[1.6] font-semibold text-charcoal"
                          >
                            <Sentences text={m.text} />
                          </p>
                        ) : (
                          <span key={m.key} className="flex max-w-[86%] flex-col items-end gap-1.5 self-end">
                            <span className="rounded-2xl rounded-tr-md bg-signal px-4 py-3 text-[14px] leading-[1.75] font-medium text-charcoal shadow-[0_2px_8px_-4px_rgba(0,0,0,.25)]">
                              <Sentences text={m.text} />
                            </span>
                            {/*
                              말풍선 밑에 붙는 바로가기. 진짜 <a> 라 크롤러도 링크로 읽는다 —
                              이 섹션이 홈에서 맡은 여섯 개의 본문 링크가 여기다.
                            */}
                            <Link
                              href={m.href!}
                              className="inline-flex items-center gap-1.5 rounded-full border border-wine-line bg-white/70 px-3 py-1.5 text-[13.5px] font-bold text-charcoal transition hover:border-ash/50 hover:bg-parchment"
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
                  <div className="absolute inset-x-0 bottom-0 z-10 h-[68px] border-t border-wine-line bg-white/85 px-4 py-3 backdrop-blur">
                    <a
                      href={`tel:${CLINIC.phone.replace(/[^0-9]/g, '')}`}
                      className="flex h-full items-center justify-center gap-2 rounded-full bg-wine-deep text-[14px] font-semibold text-parchment transition hover:bg-wine-deep-2"
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
              {/*
                ⚠️ 이 한 줄을 지우지 말 것 — 위 주석의 두 이유가 그대로 살아 있다.
                   2026-08-31 오너 요청으로 두 문장을 한 줄로 줄인 것이지, 없앤 것이 아니다.
              */}
              <p className="mt-5 max-w-[330px] text-center text-[13.5px] leading-relaxed text-mist/80">
                예시 대화 · 공휴일·임시 휴진은 반영되지 않습니다
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
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" className="text-charcoal">
      <rect x="0" y="7.5" width="3" height="3.5" rx="1" />
      <rect x="4.5" y="5" width="3" height="6" rx="1" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" y="0" width="3" height="11" rx="1" />
    </svg>
  );
}

function Wifi() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" className="text-charcoal">
      <path d="M1 3.6a9.5 9.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3.6 6.3a5.8 5.8 0 0 1 7.8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7.5" cy="9.3" r="1.3" fill="currentColor" />
    </svg>
  );
}

function Battery() {
  return (
    <svg width="24" height="11" viewBox="0 0 24 11" fill="none" className="text-charcoal">
      <rect x="0.6" y="0.6" width="19" height="9.8" rx="2.6" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
      <rect x="2.2" y="2.2" width="14" height="6.6" rx="1.5" fill="currentColor" />
      <path d="M21.4 4v3c.9-.3 1.4-.8 1.4-1.5S22.3 4.3 21.4 4Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}
