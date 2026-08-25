'use client';

import { useEffect, useState } from 'react';
import { UNVERIFIED } from '@/lib/clinic';

/**
 * 진료시간 — 한 주가 한 줄에 들어간다.
 *
 * ★★ 두 번째 버전(circle-dental-2)의 디자인을 옮겨 왔다
 *    (2026-08-25 운영자: "진료시간이나 어디에 주차 저런거 버전2 디자인으로 넣어줘") ★★
 *    요일마다 한 줄씩 쌓던 세로 표를 7칸 가로 줄로 편다. 요일은 원래 가로로 나열되는
 *    정보고(달력이 그렇다), 펴 놓으면 **야간 진료가 화·목이라는 패턴**이 한눈에 보인다.
 *
 * ★★ 7일치는 rows 에서 만들어 낸다 — 손으로 적지 않는다 ★★
 *    lib/clinic.ts 의 hours.rows 는 **묶음 표기**다(월·수·금 한 줄, 화·목 한 줄).
 *    화면이 7칸이라고 해서 여기에 요일 일곱 개를 새로 적으면, 진료시간이 바뀔 때
 *    rows 만 고치고 여기를 빠뜨려 **두 곳이 어긋난다**. 그래서 rows 를 요일별로 펴고
 *    일요일만 hours.closed 에서 가져온다.
 *
 * ⚠️ '야간 진료' 표시는 rows 의 note 를 그대로 쓰지 않는다. note 는 묶음의 **대표 줄**
 *    (화요일)에만 붙어 있어서, 그대로 쓰면 목요일 칸이 비어 야간 진료가 화요일만
 *    하는 것처럼 보인다. 마감 시각으로 판정한다(19시 이후 = 야간).
 * ⚠️ 토요일 '점심시간 없음' 도 마찬가지로 계산한다. 점심(13:00–14:30)이 그날 진료시간
 *    안에 온전히 들어가지 않으면 그날은 점심시간이 없는 것이다 — lib/seo.ts 가
 *    구조화 데이터를 만들 때 쓰는 것과 **같은 판정**이라 화면과 기계가 어긋나지 않는다.
 *
 * ★ 오늘 칸을 표시한다 — 이 표를 보는 사람의 진짜 질문은 "오늘 하나요?" 다.
 *   ⚠️ 기준은 방문자의 기기 시간이 아니라 **병원이 있는 곳(Asia/Seoul)의 날짜**다.
 *      해외에서 보면 기기 날짜가 하루 어긋나는데, 궁금한 건 병원의 오늘이다.
 *   ⚠️ "지금 진료 중" 은 쓰지 않는다. 임시 휴진을 화면이 알 수 없어 틀린 안내가 된다
 *      (SiteHeader 에서 같은 이유로 라이브 배지를 걷어냈다). 오늘이 어느 칸인지만 짚는다.
 *   ⚠️ 서버 렌더 때는 아무 칸도 표시하지 않는다(mounted 후에만). 서버와 클라이언트의
 *      날짜가 다르면 hydration 이 깨진다.
 */

/** 'HH:MM' → 분. 못 읽으면 -1. */
function toMin(t: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : -1;
}

type Cell = { ko: string; time: string; note: string; closed: boolean };

/** rows(묶음 표기) → 월요일부터 일요일까지 7칸. */
function buildWeek(): Cell[] {
  const { rows, lunch, closed } = UNVERIFIED.hours;
  const KO = ['월', '화', '수', '목', '금', '토'];
  const EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const week: Cell[] = EN.map((en, i) => {
    const r = rows.find((x) => x.day === en);
    if (!r) return { ko: KO[i], time: '휴진', note: '', closed: true };

    const close = toMin(r.close);
    const open = toMin(r.open);
    /* 마감이 19시 이후면 야간 진료 — 묶음 note 에 기대지 않는다(위 주석 참조). */
    const night = close >= 19 * 60;
    /* 점심이 그날 진료시간 안에 온전히 들어가야 '점심시간 있음' 이다. */
    const hasLunch = open <= toMin(lunch.start) && toMin(lunch.end) <= close;

    return {
      ko: KO[i],
      time: `${r.open} – ${r.close}`,
      note: night ? '야간 진료' : hasLunch ? '' : '점심시간 없음',
      closed: false,
    };
  });

  /* 일요일 — rows 에 없다. 휴진 문구에서 부가 설명만 떼어 온다. */
  week.push({
    ko: '일',
    time: '휴진',
    note: /공휴일/.test(closed) ? '공휴일 포함' : '',
    closed: true,
  });

  return week;
}

export function HoursStrip() {
  const [today, setToday] = useState<number | null>(null);
  const week = buildWeek();
  const { lunch } = UNVERIFIED.hours;
  /** 점심시간이 없는 요일 — 아래 한 줄에서 예외를 밝힌다. */
  const noLunch = week.filter((d) => d.note === '점심시간 없음').map((d) => `${d.ko}요일`);

  useEffect(() => {
    /* Asia/Seoul 기준 요일(0=일 … 6=토). 이 표는 월요일부터라 일요일은 마지막 칸이다. */
    const seoul = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })).getDay();
    setToday(seoul === 0 ? 6 : seoul - 1);
  }, []);

  return (
    <>
      {/*
        ★★ 표를 또렷하게 (2026-08-25 운영자: "표를 하얀 테두리를 하든 해서 전문적인
           디자인으로 좀 더 가시성 키워줘") ★★
           칸 사이 선이 white/10 이라 어두운 판 위에서 거의 안 보였다 — 표가 아니라
           글자 덩어리로 읽혔다. 바깥 테두리를 두르고 칸 사이 선을 white/22 로 올린다.
        ⚠️ 칸 사이 선은 grid 의 gap-px 에 **바탕색이 비쳐** 만들어진다. 그래서 선 색을
           바꾸려면 dl 의 배경색을 바꿔야 한다(border 를 칸마다 주면 모서리에서 두 겹이 된다).
      */}
      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-white/25 bg-white/22 sm:grid-cols-4 lg:grid-cols-7">
        {week.map((d, n) => {
          const on = today === n;
          return (
            <div
              key={d.ko}
              /*
               * ⚠️ 7 은 2 로도 4 로도 나누어떨어지지 않는다. 마지막 칸을 그냥 두면
               *    좁은 화면에서 **빈 슬롯이 회색 사각형으로 남는다**(칸 사이 1px 선의
               *    바탕색이 그대로 보인다). 마지막 칸이 남은 폭을 차지하게 한다.
               */
              className={`relative flex flex-col gap-3 px-5 py-7 ${
                n === week.length - 1 ? 'col-span-2 lg:col-span-1' : ''
              } ${on ? 'bg-mint-400' : 'bg-brand-900'}`}
            >
              {/*
                ★★ 오늘 칸을 통째로 밝게 (2026-08-25 운영자: "실시간으로 오늘이라는거
                   딱 티나게 해줘") ★★
                   전에는 배경을 살짝 섞어 놓기만 해서 어두운 판 위에서 옆 칸과 잘
                   구분되지 않았다. 이제 칸 하나만 밝은 초록으로 채우고 글자를 뒤집는다.
                ⚠️ 색만으로 알리지 않는다 — 색을 못 보는 사람에게는 '오늘' 이라는 글자가
                   유일한 근거다. 배지를 지우지 말 것.
                ⚠️ 밝은 칸 위에서는 흰 글자가 안 보인다. 아래 글자·비고 색을 전부
                   뒤집는 이유다. 배경만 바꾸고 글자색을 두면 통째로 안 읽힌다.
              */}
              {on && (
                <span className="absolute top-4 right-4 rounded-full bg-brand-900 px-2.5 py-[3px] text-[11px] font-bold tracking-[0.02em] text-mint-400">
                  오늘
                </span>
              )}
              <dt
                className={`text-[14px] font-semibold tracking-[0.02em] ${
                  on ? 'text-brand-900/75' : d.closed ? 'text-white/45' : 'text-white/55'
                }`}
              >
                {/* 화면에는 '월', 낭독기에는 '월요일'. */}
                {d.ko}
                <span className="sr-only">요일</span>
              </dt>
              <dd>
                <span
                  className={`tabular block text-[16.5px] leading-[1.5] font-bold tracking-[-0.01em] ${
                    on ? 'text-brand-900' : d.closed ? 'text-white/55' : 'text-white'
                  }`}
                >
                  {d.time}
                </span>
                {d.note && (
                  <span
                    className={`mt-2 block text-[13px] leading-[1.5] font-medium ${
                      on ? 'text-brand-900/75' : d.closed ? 'text-white/65' : 'text-mint-400'
                    }`}
                  >
                    {d.note}
                  </span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>

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
    </>
  );
}
