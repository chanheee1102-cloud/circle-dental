/**
 * 히어로 아래 '사실 띠'.
 *
 * ★★ 왜 이 자리가 중요한가 ★★
 *   환자가 홈페이지에서 5초 안에 확인하려는 것은 대개 넷이다 — 언제 여는지, 누가 보는지,
 *   무엇을 하는지, 어디인지. 그것들이 스크롤 없이 한 줄에 있으면 전화까지의 거리가 짧아진다.
 *   AI 검색도 같은 것을 찾는다. 사람과 기계가 같은 자리를 본다.
 *
 * ★★ 확인된 것만 싣는다 ★★
 *   UNVERIFIED 로 남아 있는 값은 칸이 아예 생기지 않는다. 빈칸을 그럴듯한 홍보 문구로
 *   메우면 그 순간 이 자리는 광고가 되고, 이 사이트가 지키려는 원칙과 정반대가 된다.
 *
 * ★ 라벨을 영문으로 두는 이유 — 값(한글)과 라벨(영문)이 글꼴·크기·색에서 확실히 갈려
 *   한 칸 안에서 위계가 즉시 읽힌다. 라벨까지 한글이면 두 줄이 서로 경쟁한다.
 */

import { CLINIC, UNVERIFIED, TREATMENT_PILLARS } from './clinic';
import { DOCTORS } from './doctors';

export interface HeroFact {
  label: string;
  value: string;
}

/** "09:30 - 20:30" 에서 끝 시각. 못 읽으면 -1. */
function closeMinutes(time: string): number {
  const m = time.match(/(\d{1,2}):(\d{2})\s*$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : -1;
}

export function heroFacts(): HeroFact[] {
  const out: HeroFact[] = [];

  if (UNVERIFIED.hours.verified) {
    const rows = UNVERIFIED.hours.display.filter((r) => !/점심/.test(r.label));

    /* 야간 진료 — 직장인이 가장 먼저 찾는 값이라 맨 앞에 둔다. */
    const night = rows.find((r) => closeMinutes(r.time) >= 19 * 60);
    if (night) {
      out.push({ label: 'Night', value: `${night.label} ${night.time.split('-')[1]?.trim()}까지` });
    }

    const sat = rows.find((r) => /토/.test(r.label));
    if (sat) out.push({ label: 'Saturday', value: sat.time });

    /* 야간·토요일이 없으면 대표 진료시간이라도 — 빈 띠보다 낫다. */
    if (!night && !sat && rows[0]) {
      out.push({ label: 'Hours', value: `${rows[0].label} ${rows[0].time}` });
    }
  }

  if (UNVERIFIED.doctors.verified && DOCTORS.length > 0) {
    out.push({ label: 'Doctors', value: `의료진 ${DOCTORS.length}인` });
  }

  if (TREATMENT_PILLARS.length > 0) {
    out.push({ label: 'Care', value: `진료과목 ${TREATMENT_PILLARS.length}` });
  }

  if (CLINIC.nearestStation) {
    out.push({ label: 'Station', value: `${CLINIC.nearestStation} 인근` });
  }

  return out.slice(0, 5);
}
