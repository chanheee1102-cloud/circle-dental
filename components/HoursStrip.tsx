'use client';

import { useEffect, useState } from 'react';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';

/**
 * 진료시간 — 한 주가 한 줄에 들어가고, 오늘 칸에 지금 상태가 실시간으로 뜬다.
 *
 * ★★ 두 번째 버전(circle-dental-2)의 7칸 배치를 옮겨 왔다 (2026-08-25) ★★
 *    요일마다 한 줄씩 쌓던 세로 표를 가로 7칸으로 편다. 요일은 원래 가로로 나열되는
 *    정보고(달력이 그렇다), 펴 놓으면 **야간 진료가 화·목이라는 패턴**이 한눈에 보인다.
 *
 * ★★ 7일치는 rows 에서 만들어 낸다 — 손으로 적지 않는다 ★★
 *    lib/clinic.ts 의 hours.rows 는 **묶음 표기**다(월·수·금 한 줄, 화·목 한 줄).
 *    화면이 7칸이라고 해서 요일 일곱 개를 여기 새로 적으면, 진료시간이 바뀔 때
 *    rows 만 고치고 여기를 빠뜨려 **두 곳이 어긋난다**.
 *
 * ⚠️ '야간 진료' 는 rows 의 note 를 그대로 쓰지 않는다. note 가 묶음의 대표 줄(화요일)에만
 *    붙어 있어서, 그대로 쓰면 목요일 칸이 비어 야간 진료가 화요일만 하는 것처럼 보인다.
 *    마감 시각으로 판정한다(19시 이후 = 야간).
 * ⚠️ 토요일 '점심시간 없음' 도 계산한다. 점심(13:00–14:30)이 그날 진료시간 안에 온전히
 *    들어가지 않으면 그날은 점심시간이 없다 — lib/seo.ts 가 구조화 데이터를 만들 때
 *    쓰는 것과 **같은 판정**이라 화면과 기계가 어긋나지 않는다.
 *
 * ★★ 지금 상태 표시 (2026-08-25 운영자: "그 라이브 모양으로 실제 진료시간에 맞게
 *    나오게 하자") ★★
 *    ⚠️⚠️ 이건 2026-08-14 에 **일부러 걷어냈던 기능이다** ⚠️⚠️
 *      그때 이유: 자동 판정은 **공휴일·임시 휴진을 알 수 없다.** 쉬는 날 "진료 중"이
 *      떠 있으면 그 표시 하나가 환자를 헛걸음시킨다(SiteHeader 주석 참조).
 *      운영자가 다시 요청해 되살리되, 그 한계를 **화면에 적어 두는 조건**으로 넣는다 —
 *      표 아래 한 줄이 그것이다. 그 줄을 지우면 이 기능은 다시 위험해진다.
 *    ⚠️ 그래서 문구도 단정하지 않는다. '진료 중' 옆에 늘 전화가 함께 있어야 한다.
 *
 * ⚠️ 기준 시각은 방문자의 기기가 아니라 **병원이 있는 곳(Asia/Seoul)** 이다.
 *    해외에서 보면 기기 날짜가 하루 어긋나는데, 궁금한 건 병원의 오늘이다.
 * ⚠️ 서버 렌더 때는 아무 것도 표시하지 않는다(mounted 후에만). 서버와 클라이언트의
 *    시각이 다르면 hydration 이 깨진다.
 */

/** 'HH:MM' → 분. 못 읽으면 -1. */
function toMin(t: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : -1;
}

type Cell = {
  ko: string;
  time: string;
  note: string;
  closed: boolean;
  /** 분 단위 — 지금 상태를 판정할 때만 쓴다. */
  open: number;
  close: number;
  hasLunch: boolean;
};

/** rows(묶음 표기) → 월요일부터 일요일까지 7칸. */
function buildWeek(): Cell[] {
  const { rows, lunch, closed } = UNVERIFIED.hours;
  const KO = ['월', '화', '수', '목', '금', '토'];
  const EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const lunchStart = toMin(lunch.start);
  const lunchEnd = toMin(lunch.end);

  const week: Cell[] = EN.map((en, i) => {
    const r = rows.find((x) => x.day === en);
    if (!r) {
      return { ko: KO[i], time: '휴진', note: '', closed: true, open: -1, close: -1, hasLunch: false };
    }
    const open = toMin(r.open);
    const close = toMin(r.close);
    /* 마감이 19시 이후면 야간 진료 — 묶음 note 에 기대지 않는다(위 주석 참조). */
    const night = close >= 19 * 60;
    /* 점심이 그날 진료시간 안에 온전히 들어가야 '점심시간 있음' 이다. */
    const hasLunch = open <= lunchStart && lunchEnd <= close;

    return {
      ko: KO[i],
      time: `${r.open} – ${r.close}`,
      note: night ? '야간 진료' : hasLunch ? '' : '점심시간 없음',
      closed: false,
      open,
      close,
      hasLunch,
    };
  });

  /* 일요일 — rows 에 없다. 휴진 문구에서 부가 설명만 떼어 온다. */
  week.push({
    ko: '일',
    time: '휴진',
    note: /공휴일/.test(closed) ? '공휴일 포함' : '',
    closed: true,
    open: -1,
    close: -1,
    hasLunch: false,
  });

  return week;
}

type Live = { text: string; open: boolean };

/** 지금이 진료 중인지 — 오늘 칸에만 쓴다. */
function liveOf(cell: Cell, nowMin: number): Live {
  const { lunch } = UNVERIFIED.hours;
  if (cell.closed) return { text: '오늘 휴진', open: false };
  if (nowMin < cell.open) return { text: '진료 전', open: false };
  if (nowMin >= cell.close) return { text: '진료 종료', open: false };
  if (cell.hasLunch && nowMin >= toMin(lunch.start) && nowMin < toMin(lunch.end)) {
    return { text: '점심시간', open: false };
  }
  return { text: '진료 중', open: true };
}

export function HoursStrip() {
  /** [요일 index, 자정부터 지난 분] — 서울 기준. 서버 렌더 때는 null. */
  const [now, setNow] = useState<[number, number] | null>(null);
  const week = buildWeek();
  const { lunch } = UNVERIFIED.hours;
  /** 점심시간이 없는 요일 — 아래 한 줄에서 예외를 밝힌다. */
  const noLunch = week.filter((d) => d.note === '점심시간 없음').map((d) => `${d.ko}요일`);

  useEffect(() => {
    const read = () => {
      const seoul = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
      /* 0=일 … 6=토. 이 표는 월요일부터라 일요일은 마지막 칸이다. */
      const dow = seoul.getDay() === 0 ? 6 : seoul.getDay() - 1;
      setNow([dow, seoul.getHours() * 60 + seoul.getMinutes()]);
    };
    read();
    /* ⚠️ 1분마다 다시 읽는다 — 안 하면 페이지를 열어 둔 채로 진료가 끝나도 '진료 중'이 남는다. */
    const id = window.setInterval(read, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const todayIdx = now?.[0] ?? null;

  return (
    <>
      {/*
        표를 판 위로 띄운다 — 바깥 그림자 + 칸마다 위쪽 옅은 흰 선(inset).
        ⚠️ 그림자는 **바깥 상자**가 진다. dl 은 둥근 모서리를 위해 overflow-hidden 이라
           안쪽에 건 그림자는 잘려 아무것도 안 보인다.
        ⚠️ 그림자를 Tailwind 임의값으로 썼더니 적용이 안 됐다(계산값이 투명 두 겹).
           한 번 쓰는 장식값이라 인라인 style 로 둔다.
      */}
      <div
        className="mt-10 rounded-[20px]"
        style={{ boxShadow: '0 26px 64px -28px rgba(0,0,0,0.75)' }}
      >
        {/*
          ⚠️ 칸 사이 선은 grid 의 gap-px 에 **dl 의 배경색이 비쳐** 만들어진다.
             선 색을 바꾸려면 dl 배경을 바꿔야 한다 — 칸마다 border 를 주면 맞닿는
             자리에서 두 겹이 된다.
        */}
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-white/25 bg-white/22 sm:grid-cols-4 lg:grid-cols-7">
          {week.map((d, n) => {
            const on = todayIdx === n;
            const live = on && now ? liveOf(d, now[1]) : null;
            return (
              <div
                key={d.ko}
                /*
                 * ⚠️ 7 은 2 로도 4 로도 나누어떨어지지 않는다. 마지막 칸을 그냥 두면
                 *    좁은 화면에서 **빈 슬롯이 회색 사각형으로 남는다**(칸 사이 1px 선의
                 *    바탕색이 그대로 보인다). 마지막 칸이 남은 폭을 차지하게 한다.
                 *
                 * ★★ 오늘 칸을 흰 면 → **테두리**로 (2026-08-25 운영자: "이것보다는
                 *    그냥 테두리를 잘보이게 TODAY 로 표시하고") ★★
                 *    면을 통째로 채우면 그 칸만 다른 표처럼 보였다. 테두리는 표의 결을
                 *    지키면서 '여기' 만 짚는다.
                 * ⚠️ border 가 아니라 **안쪽 그림자(inset ring)** 다. border 를 주면
                 *    그 칸만 2px 커져 옆 칸들이 밀린다.
                 */
                className={`relative flex flex-col gap-3 px-5 py-7 ${
                  n === week.length - 1 ? 'col-span-2 lg:col-span-1' : ''
                } bg-brand-900 ${on ? '' : 'shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]'}`}
                style={
                  on
                    ? { boxShadow: 'inset 0 0 0 2px var(--color-mint-400)' }
                    : undefined
                }
              >
                {/*
                  ⚠️ 색만으로 알리지 않는다 — 색을 못 보는 사람에게는 'TODAY' 라는
                     글자가 유일한 근거다. 배지를 지우지 말 것.
                */}
                {on && (
                  <span className="absolute top-4 right-4 rounded-full border border-mint-400/60 px-2.5 py-[3px] text-[10.5px] font-bold tracking-[0.14em] text-mint-400 uppercase">
                    Today
                  </span>
                )}

                <dt
                  className={`text-[14px] font-semibold tracking-[0.02em] ${
                    d.closed ? 'text-white/45' : on ? 'text-white/75' : 'text-white/55'
                  }`}
                >
                  {/* 화면에는 '월', 낭독기에는 '월요일'. */}
                  {d.ko}
                  <span className="sr-only">요일</span>
                </dt>

                <dd>
                  <span
                    className={`tabular block text-[16.5px] leading-[1.5] font-bold tracking-[-0.01em] ${
                      d.closed ? 'text-white/55' : 'text-white'
                    }`}
                  >
                    {d.time}
                  </span>
                  {d.note && (
                    <span
                      className={`mt-2 block text-[13px] leading-[1.5] font-medium ${
                        d.closed ? 'text-white/65' : 'text-mint-400'
                      }`}
                    >
                      {d.note}
                    </span>
                  )}

                  {/*
                    지금 상태 — 오늘 칸에만. 진료 중일 때만 점이 맥박한다.
                    ⚠️ 진료 중이 아닐 때 점이 계속 뛰면 '살아 있다' 는 신호가 거짓이 된다.
                  */}
                  {live && (
                    <span
                      className={`mt-3 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[12px] font-bold ${
                        live.open
                          ? 'bg-mint-400/15 text-mint-400'
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`relative inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-current ${
                          live.open ? 'live-dot' : ''
                        }`}
                      />
                      {live.text}
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {/*
        점심시간은 요일 칸에 넣지 않는다 — 7칸 전부에 같은 값을 반복하게 되고,
        예외인 요일이 오히려 묻힌다.
      */}
      <p className="mt-6 text-[14.5px] leading-[1.8] text-white/60">
        점심시간{' '}
        <span className="tabular font-bold text-white">
          {lunch.start} – {lunch.end}
        </span>
        {noLunch.length > 0 && <span className="ml-2">({noLunch.join(' · ')} 제외)</span>}
      </p>

      {/*
        ⚠️⚠️ 이 줄을 지우지 말 것 ⚠️⚠️
          위의 '진료 중' 표시는 **정해진 진료시간만** 보고 판정한다. 공휴일과 임시
          휴진은 화면이 알 방법이 없다 — 그래서 2026-08-14 에 같은 기능을 한 번
          걷어냈었다. 지금은 운영자 요청으로 되살리되 **한계를 함께 적는 조건**이다.
          이 문장이 없으면 쉬는 날 "진료 중" 하나가 환자를 헛걸음시킨다.
      */}
      <p className="mt-2 text-[13.5px] leading-[1.8] text-white/45">
        공휴일·임시 휴진은 이 표시에 반영되지 않습니다. 방문 전{' '}
        <a href={CLINIC.phoneHref} className="font-bold text-white/70 underline underline-offset-4">
          {CLINIC.phone}
        </a>
        로 확인해 주세요.
      </p>
    </>
  );
}
