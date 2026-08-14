import { CLINIC, UNVERIFIED } from './clinic';
import { DOCTORS, PUBLICATION_DETAIL } from './doctors';
import { IMG } from './assets';
import { TREATMENTS } from './treatments';
import { SYMPTOMS } from './symptoms';
import { CONDITIONS } from './conditions';

/**
 * 신뢰 지표 — "왜 이 병원 말을 믿을 수 있는가" 를 기계와 사람 양쪽이 읽을 수 있게.
 *
 * ★★ 왜 필요한가 ★★
 *   외부 진단이 "신뢰 지표 없음 / 실적 수치 없음" 으로 잡았다. 그런데 자료는 이미 다 있었다 —
 *   전문의 자격, 인증패 넷, 학회 정회원, 발표 논문, 방송 출연이 화면에 흩어져 있었을 뿐
 *   **한 자리에 모여 세어지지 않았다.** 답변 엔진은 "구체 수치" 를 인용하지 흩어진 인상을
 *   인용하지 않는다.
 *
 * ⚠️⚠️ 여기에 절대 넣지 않는 것 ⚠️⚠️
 *   ① **환자 후기·별점·치료 전후 사진** — 의료법 제56조 제2항이 치료경험담 광고를
 *      금지한다. 일반 업종의 '고객 후기' 를 그대로 옮기면 그 자체가 위법이다.
 *      구조화 데이터의 aggregateRating / review 도 같은 이유로 금지다.
 *   ② **진료 건수·성공률** — "임플란트 5,000케이스" 같은 숫자는 확인할 방법이 없고,
 *      틀리면 거짓 광고다. 병원이 근거 자료를 주기 전에는 쓰지 않는다.
 *   ③ **"최고·유일·1위"** — 최상급 표현은 의료광고 금지 항목이다.
 *
 * ★ 그래서 여기 있는 값은 전부 **이 저장소 안의 데이터를 센 것**이다.
 *   숫자가 바뀌면 자동으로 따라온다 — 손으로 적어 둔 값이 하나도 없다.
 */

export interface TrustStat {
  /** 화면에 크게 나오는 값. */
  value: string;
  label: string;
  /** 이 값이 어디서 나왔는지 — 감사할 때 추적하기 위한 것이지 화면 문구가 아니다. */
  source: string;
}

const specialistCount = DOCTORS.filter((d) =>
  d.career.some((c) => /통합치의학과 전문의/.test(c)),
).length;

export const TRUST_STATS: TrustStat[] = [
  {
    value: `${specialistCount}명`,
    label: '보건복지부 인정 통합치의학과 전문의',
    source: 'lib/doctors.ts — career 에 전문의 자격이 있는 원장 수',
  },
  {
    value: `${DOCTORS[0].societies.length}곳`,
    label: '대표원장 학회 정회원',
    source: 'lib/doctors.ts — DOCTORS[0].societies',
  },
  {
    value: `${IMG.credentials.length}건`,
    label: '인증 · 수료 (실물 확인)',
    source: 'lib/assets.ts — IMG.credentials (사진 보유)',
  },
  {
    value: '1편',
    label: '국제 학술지 발표 논문',
    source: 'lib/doctors.ts — PUBLICATION_DETAIL',
  },
  {
    value: `${TREATMENTS.length}개`,
    label: '진료 영역',
    source: 'lib/treatments.ts — TREATMENTS.length',
  },
  {
    value: `${SYMPTOMS.length + CONDITIONS.length}가지`,
    label: '증상 · 질환 설명 문서',
    source: 'lib/symptoms.ts + lib/conditions.ts',
  },
];

/** 논문 제목 — 화면에서 근거로 함께 보여 줄 때 쓴다. */
export const PUBLICATION_TITLE = PUBLICATION_DETAIL.title;

export interface CredentialRow {
  name: string;
  issuer: string;
  kind: string;
}

/**
 * 인증·자격 표.
 *
 * ★ 발급처를 함께 적는 것이 핵심이다. "수료증 4건" 은 인상이지만
 *   "세계근관치료학회가 준 수료증" 은 검증 가능한 사실이다.
 * ⚠️ 발급처는 인증패 이름에 이미 들어 있는 것만 적었다 — 추정해서 채우지 않는다.
 */
export const CREDENTIAL_ROWS: CredentialRow[] = [
  {
    name: '통합치의학과 전문의',
    issuer: '보건복지부',
    kind: '전문의 자격',
  },
  {
    name: '연구자문치과 위촉패',
    issuer: '오스템임플란트',
    kind: '위촉',
  },
  {
    name: 'Professional Implant Training Course 수료패',
    issuer: 'Lifelong Dental Implant Research & Education Center',
    kind: '수료',
  },
  {
    name: '근관치료 학술대회 수료증',
    issuer: '세계근관치료학회(IFEA)',
    kind: '수료',
  },
  {
    name: '정회원 회원증',
    issuer: '대한치과보존학회',
    kind: '학회 정회원',
  },
];

/**
 * 언론·외부 노출.
 * ⚠️ 확인된 것만. 기사 URL 은 병원이 아직 주지 않아 비워 둔다 —
 *    없는 링크를 만들어 붙이면 그 순간 거짓 근거가 된다.
 */
export const MEDIA_APPEARANCES = [
  {
    outlet: 'TV조선',
    program: '구조신호 시그널 24회',
    what: '무료 틀니 제공 — 방영분 영상 보유',
    /** 기사·다시보기 URL 이 확인되면 여기에 넣는다. */
    url: null as string | null,
  },
];

/** 진료 가능 시간대 — '언제 갈 수 있나' 도 신뢰 지표다(야간·토요일). */
export const ACCESS_FACTS = UNVERIFIED.hours.verified
  ? [
      { label: '야간 진료', value: '화 · 목 오후 8시 30분까지' },
      { label: '토요일 진료', value: '오후 2시까지' },
      { label: '주차', value: `${CLINIC.parking.type} · ${CLINIC.parking.fee}` },
    ]
  : [];
