import { useEffect, useState } from 'react';
import { UNVERIFIED } from '@/lib/clinic';

/**
 * 지금 진료 중인지 — **판정은 여기 한 곳에서만 한다.**
 *
 * ★★ 왜 따로 뺐나 (2026-08-26) ★★
 *   원래 이 계산은 components/HoursStrip.tsx 안에만 있었다. 그런데 대화 화면(ConcernPhone)
 *   상단에도 같은 표시가 필요해졌다. 거기에 같은 계산을 다시 적으면 진료시간이 바뀔 때
 *   **두 곳이 어긋난다** — 한쪽은 '진료 중', 다른 쪽은 '진료 종료' 가 뜨는 화면이 된다.
 *   lib/clinic.ts 의 hours 가 유일한 사실이고, 그 해석도 하나여야 한다.
 *
 * ⚠️⚠️ 이 기능은 2026-08-14 에 **일부러 걷어냈던 것**이다 ⚠️⚠️
 *   자동 판정은 **공휴일·임시 휴진을 알 수 없다.** 쉬는 날 "진료 중" 이 떠 있으면
 *   그 표시 하나가 환자를 헛걸음시킨다. 운영자 요청으로 되살리되 조건이 붙어 있다 —
 *   **그 한계를 화면에 적어 둘 것.** 표시를 쓰는 화면마다 옆에 전화번호가 함께 있어야 한다.
 *   (HoursStrip 은 표 아래 한 줄, ConcernPhone 은 기기 아래 한 줄이 그 자리다.)
 *
 * ⚠️ 기준 시각은 방문자의 기기가 아니라 **병원이 있는 곳(Asia/Seoul)** 이다.
 *    해외에서 보면 기기 날짜가 하루 어긋나는데, 궁금한 건 병원의 오늘이다.
 */

/** 'HH:MM' → 자정부터의 분. 못 읽으면 -1. */
export function toMin(t: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : -1;
}

export type Cell = {
  ko: string;
  time: string;
  note: string;
  closed: boolean;
  /** 분 단위 — 지금 상태를 판정할 때만 쓴다. */
  open: number;
  close: number;
  hasLunch: boolean;
};

/**
 * rows(묶음 표기) → 월요일부터 일요일까지 7칸.
 *
 * ⚠️ lib/clinic.ts 의 hours.rows 는 **묶음 표기**다(월·수·금 한 줄, 화·목 한 줄).
 *    화면이 7칸이라고 요일 일곱 개를 따로 적으면, 진료시간이 바뀔 때 rows 만 고치고
 *    화면 쪽을 빠뜨려 두 곳이 어긋난다.
 * ⚠️ '야간 진료' 는 note 를 그대로 쓰지 않는다. note 가 묶음의 대표 줄(화요일)에만 붙어
 *    있어서, 그대로 쓰면 목요일 칸이 비어 야간 진료가 화요일만 하는 것처럼 보인다.
 *    마감 시각으로 판정한다(19시 이후 = 야간).
 * ⚠️ 토요일 '점심시간 없음' 도 계산한다 — 점심이 그날 진료시간 안에 온전히 들어가야
 *    '점심시간 있음' 이다. lib/seo.ts 의 구조화 데이터와 **같은 판정**이라 화면과 기계가
 *    어긋나지 않는다.
 */
export function buildWeek(): Cell[] {
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
    const night = close >= 19 * 60;
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

export type Live = { text: string; open: boolean };

/** 지금이 진료 중인지 — 오늘 칸에만 쓴다. */
export function liveOf(cell: Cell, nowMin: number): Live {
  const { lunch } = UNVERIFIED.hours;
  if (cell.closed) return { text: '오늘 휴진', open: false };
  if (nowMin < cell.open) return { text: '진료 전', open: false };
  if (nowMin >= cell.close) return { text: '진료 종료', open: false };
  if (cell.hasLunch && nowMin >= toMin(lunch.start) && nowMin < toMin(lunch.end)) {
    return { text: '점심시간', open: false };
  }
  return { text: '진료 중', open: true };
}

export type SeoulNow = {
  /** 0=월 … 6=일. buildWeek() 이 내는 배열의 index 와 같다. */
  dow: number;
  /** 자정부터 지난 분. */
  min: number;
  /** 화면에 그대로 쓰는 24시간제 시각(예: "17:04"). */
  clock: string;
};

/**
 * 서울 기준 '지금'. 서버 렌더 때는 **null** 이다.
 *
 * ⚠️ 서버에서 시각을 그리면 클라이언트와 값이 달라 hydration 이 깨진다.
 *    쓰는 쪽은 null 일 때 아무 것도 그리지 않도록 만들 것.
 * ⚠️ 분이 바뀌는 **정각에 맞춰** 다시 읽는다. 60초 간격 타이머만 두면 최대 59초까지
 *    늦은 시각이 떠 있는다 — 시계로는 그게 '고장' 으로 보인다.
 */
export function useSeoulNow(): SeoulNow | null {
  const [now, setNow] = useState<SeoulNow | null>(null);

  useEffect(() => {
    let timer = 0;

    const read = () => {
      const seoul = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
      const h = seoul.getHours();
      const m = seoul.getMinutes();
      /* 0=일 … 6=토 → 이 배열은 월요일부터라 일요일이 마지막 칸이다. */
      const dow = seoul.getDay() === 0 ? 6 : seoul.getDay() - 1;
      setNow({ dow, min: h * 60 + m, clock: `${h}:${String(m).padStart(2, '0')}` });

      /* 다음 분 정각까지 남은 시간만큼만 기다린다(+250ms 여유). */
      const wait = (60 - seoul.getSeconds()) * 1000 + 250;
      timer = window.setTimeout(read, wait);
    };

    read();
    return () => window.clearTimeout(timer);
  }, []);

  return now;
}
