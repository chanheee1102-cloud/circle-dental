/**
 * 의료진 — circle-dental.co.kr/doctor 원문 그대로.
 *
 * ★★ 여기 적힌 것은 전부 병원이 자기 홈페이지에 공개한 경력이다 ★★
 *   의료인의 학력·자격·경력 표시는 사실과 달라서는 안 된다(의료법 제56조).
 *   그래서 한 줄도 추측하지 않았고, 순서까지 원문을 따랐다.
 *   ⚠️ 여기에 새 경력을 추가하려면 반드시 본인 확인이 먼저다.
 *
 * ★ 유일한 표기 정정 — '보건복지부인증' → '보건복지부 인정'
 *   전문의 자격 제도의 공식 용어는 '인정'이다. 자격의 내용은 그대로이고 표기만 바로잡았다.
 *
 * ★ 왜 원장별로 페이지를 나누는가
 *   ① 검색은 사람 이름으로 들어온다 — "변석호 원장", "화정동 김인진 치과" 같은 질의는
 *      한 페이지에 세 명이 섞여 있으면 어느 부분이 답인지 기계가 못 고른다.
 *   ② Physician 스키마를 사람마다 하나씩 낼 수 있다. 지식패널 대상이 되는 단위가 사람이다.
 */

export interface Doctor {
  slug: string;
  name: string;
  /** 직함 — 대표원장 / 원장. */
  role: string;
  photo: string;
  /** 학력·경력. 원문 순서 그대로. */
  career: string[];
  /** 학회 활동. 없는 원장도 있다(원문 기준). */
  societies: string[];
  /** 진료에서 주로 보는 영역 — career/societies 에서 확인되는 범위만 적는다. */
  focus: string[];
}

const P = '/img';

export const DOCTORS: Doctor[] = [
  {
    slug: 'byun-seokho',
    name: '변석호',
    role: '대표원장',
    photo: `${P}/20211123_b07b19257d734.jpg`,
    career: [
      '경희대학교 치의학전문대학원 외래교수',
      '경희대학교 치의학전문대학원 치의학박사',
      '경희대학교 치의학전문대학원 치의학석사',
      '보건복지부 인정 통합치의학과 전문의',
      '고려대학교 학사',
      '전) 능곡서울치과 대표원장',
    ],
    societies: [
      '대한구강악안면임플란트학회 정회원',
      '대한치과보존학회 정회원',
      '대한근관치료학회 정회원',
      '한국접착치의학회 정회원',
      '대한심미치과학회 정회원',
      '대한보철학회 정회원',
    ],
    /** 학회 구성으로 확인되는 범위 — 보존·근관·접착·임플란트·보철·심미. */
    focus: ['자연치아 보존', '근관치료(신경치료)', '임플란트', '보철·심미'],
  },
  {
    slug: 'kim-dongju',
    name: '김동주',
    role: '원장',
    photo: `${P}/20210906_28ce020ff6ebb.jpg`,
    career: [
      '경희대학교 치의학전문대학원 치의학석사',
      '보건복지부 인정 통합치의학과 전문의',
      '고려대학교 학사',
      '강원도 화천보건의료원 치과과장 역임',
      '평창 동계올림픽 자문 치과의사',
      'Upenn Endo Microedondotics course 수료',
      '전) 해온미소치과 원장',
      '전) 디자인치과 원장',
    ],
    societies: [
      '대한 구강악안면 임플란트학회 정회원',
      '미국 심미치과학회(AACD) 정회원',
      '미국 임플란트학회(AAID) 정회원',
      '보철학회 정회원',
    ],
    focus: ['임플란트', '근관치료(신경치료)', '심미치료', '보철'],
  },
  {
    slug: 'kim-injin',
    name: '김인진',
    role: '원장',
    photo: `${P}/20210906_d48365779037c.jpg`,
    career: [
      '경희대학교 치의학전문대학원 치의학석사',
      '보건복지부 인정 통합치의학과 전문의',
      'UCLA Biochemistry B.S',
      'Upenn Endo Microedondotics course 수료',
      'UCLA 교정과정 수료',
      'Dentium 심미보철 과정 수료',
      'ARA 총의치 과정 수료',
      '턱관절장애교육연수회 수료',
      '오스템 임플란트 AIC master course 수료',
      '전) 아이플러스치과 원장',
      '전) 담덕치과 원장',
      '전) 박플란트치과 원장',
    ],
    societies: [],
    focus: ['근관치료(신경치료)', '심미보철', '총의치', '턱관절'],
  },
];

export const doctorBySlug = (slug: string) => DOCTORS.find((d) => d.slug === slug);

/**
 * 발표 논문 — 기존 홈페이지에 실린 논문이다.
 * 저자 목록에 SH Byun(변석호 대표원장)이 포함돼 있다.
 */
export const PUBLICATION_DETAIL = {
  title: 'Long-term Follow-up of Complicated Crown Fracture With Fragment Reattachment: Two Case Reports',
  authors: 'S Oh · JH Jang · HJ Kim · NS Seo · SH Byun · SW Kim · DS Kim',
  /** 논문 초록의 임상적 의의 부분(원문 영문). */
  relevance:
    'Complicated crown fracture in permanent teeth may cause restorative problems with an unfavorable prognosis. The fragment reattachment technique is the most conservative treatment option.',
  /** 한국어 풀이 — 원문을 옮긴 것이지 새 주장을 만든 것이 아니다. */
  relevanceKo:
    '영구치의 복잡 치관 파절은 예후가 좋지 않아 수복이 까다로운 경우가 많은데, 부러진 조각을 다시 붙이는 방법이 가장 보존적인 선택지라는 내용입니다.',
  image: `${P}/20210927_a3d3770d37636.jpg`,
};

/** 사회공헌 사진 — 경희대학교 치과대학병원 봉사동아리(CDSA)와 함께한 농어촌 무료 진료. */
export const OUTREACH_PHOTO = {
  src: `${P}/S20210831796fb42e6ffe6_5dc8f5d818f8b.jpg`,
  alt: '농촌사랑 의료봉사 활동 — 경희대학교 치과대학병원 무료 진료 현장',
};
