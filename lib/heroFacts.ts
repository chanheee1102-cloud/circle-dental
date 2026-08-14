/**
 * 히어로 아래 '사실 띠'.
 *
 * ★★ 왜 이 자리가 중요한가 ★★
 *   환자가 홈페이지에서 5초 안에 확인하려는 것은 대개 넷이다 — 누가 보는지, 언제 여는지,
 *   무엇을 하는지, 어디인지. 그것들이 스크롤 없이 한 줄에 있으면 전화까지의 거리가 짧아진다.
 *   AI 검색도 같은 것을 찾는다. 사람과 기계가 같은 자리를 본다.
 *
 * ★★ 확인된 것만 싣는다 ★★
 *   UNVERIFIED 로 남아 있는 값은 칸이 아예 생기지 않는다. 빈칸을 그럴듯한 홍보 문구로
 *   메우면 그 순간 이 자리는 광고가 되고, 이 사이트가 지키려는 원칙과 정반대가 된다.
 *
 * ★ 값을 구체적으로 (2026-08-14 운영자 지적)
 *   예전에는 `Doctors / 의료진 3인`, `Care / 진료과목 4` 처럼 **라벨과 값이 같은 말**이거나
 *   숫자만 덩그러니 있었다. 5초 안에 읽는 자리에 "진료과목 4" 는 아무것도 알려 주지 않는다.
 *   라벨은 갈래 이름만 맡고, 값에 **판단에 쓸 수 있는 사실**을 넣는다.
 *
 * ★ 라벨을 영문 소문자 갈래로 두는 이유 — 값(한글)과 확실히 갈려 한 칸 안에서 위계가
 *   즉시 읽힌다. 라벨까지 한글이면 두 줄이 서로 경쟁한다.
 */

import { CLINIC, UNVERIFIED } from './clinic';
import { DOCTORS } from './doctors';

export interface HeroFact {
  label: string;
  value: string;
}

/** '09:30 - 20:30' → '20:30'. 못 읽으면 빈 문자열. */
function closeTime(time: string): string {
  return time.split('-')[1]?.trim() ?? '';
}

/** '09:30 - 20:30' 에서 끝 시각을 분으로. 못 읽으면 -1. */
function closeMinutes(time: string): number {
  const m = time.match(/(\d{1,2}):(\d{2})\s*$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : -1;
}

export function heroFacts(): HeroFact[] {
  const out: HeroFact[] = [];

  /*
   * ① 의료진 — 병원을 고를 때 가장 먼저 걸리는 사실이라 맨 앞이다.
   *   '3인' 이라는 숫자보다 **어떤 자격인지**가 판단에 쓰인다.
   */
  if (UNVERIFIED.doctors.verified && DOCTORS.length > 0) {
    out.push({ label: '전문의', value: `통합치의학과 전문의 ${DOCTORS.length}인` });
    /* ② 대표원장 이력 — 원본 홈페이지가 첫 화면에 내세우던 사실이다. */
    out.push({ label: '대표원장', value: '경희대 치의학전문대학원 외래교수' });
  }

  if (UNVERIFIED.hours.verified) {
    const rows = UNVERIFIED.hours.display.filter((r) => !/점심/.test(r.label));

    /* ③ 야간 진료 — 직장인이 실제로 찾는 값. 요일과 끝 시각을 함께 준다. */
    const night = rows.find((r) => closeMinutes(r.time) >= 19 * 60);
    if (night) out.push({ label: '야간진료', value: `${night.label} ${closeTime(night.time)}까지` });

    /*
     * ④ 토요일 — 여는지 아닌지가 궁금한 것이므로 '연다 + 언제까지' 로 답한다.
     *   ⚠️ 값에 '토요일' 을 다시 쓰지 않는다. 라벨이 이미 토요일이라 "토요일 / 토요일 14:00까지"
     *      처럼 같은 말이 두 번 나온다(실측). 라벨은 갈래, 값은 새 정보여야 한다.
     */
    const sat = rows.find((r) => /토/.test(r.label));
    if (sat) out.push({ label: '토요일', value: `${sat.time.replace('-', '–')} 진료` });

    /* 야간·토요일이 둘 다 없으면 대표 진료시간이라도 — 빈 띠보다 낫다. */
    if (!night && !sat && rows[0]) {
      out.push({ label: '진료시간', value: `${rows[0].label} ${rows[0].time}` });
    }
  }

  /*
   * ⑤ 주차 — 내원 직전에 가장 많이 검색되는 것 중 하나이고, 우리는 확인된 답이 있다.
   *   위치(화정역 인근)보다 주차가 실제 결정에 더 쓰인다 — 위치는 지도에서 보면 되지만
   *   주차 여부는 사이트에 안 적혀 있으면 알 길이 없다.
   */
  if (CLINIC.parking?.fee) {
    out.push({ label: '주차', value: `건물 내 주차 ${CLINIC.parking.fee}` });
  }

  return out.slice(0, 5);
}
