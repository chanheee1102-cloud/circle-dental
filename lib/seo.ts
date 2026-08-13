/**
 * 구조화 데이터(JSON-LD) 빌더 — AEO/GEO 의 뼈대.
 *
 * ★ 왜 중요한가
 *   검색엔진과 AI 는 본문을 읽기 전에 구조화 데이터를 먼저 본다. 진료시간·주소·전화번호가
 *   기계가 읽을 수 있는 형태로 있어야 지도·지식패널·AI 답변에 인용된다. 본문에만 적어 두면
 *   "이 병원이 언제 여는지" 를 AI 가 확신하지 못하고 답변에서 빠진다.
 *
 * ★★ 확인되지 않은 값은 절대 넣지 않는다 ★★
 *   틀린 구조화 데이터는 없는 것보다 나쁘다. 진료시간이 틀리면 환자가 헛걸음하고,
 *   좌표가 틀리면 지도가 엉뚱한 곳을 가리켜 지역 검색 신뢰도가 함께 떨어진다.
 *   그래서 UNVERIFIED 값은 스키마에서 **빠진다** — 추측으로 채우지 않는다.
 *
 * ★ 스키마 선택 근거
 *   Dentist  : 병원 자체. LocalBusiness 하위라 지도·영업시간 신호를 함께 받는다.
 *   MedicalWebPage : 의료 정보 문서임을 명시. 일반 Article 보다 의료 질의에 강하다.
 *   MedicalProcedure / MedicalCondition : 시술·증상 페이지의 주제를 특정한다.
 *   FAQPage  : 질문–답변 쌍. AI 답변에 그대로 인용되는 형식.
 *   BreadcrumbList : 사이트 계층. 크롤러가 문서 간 관계를 이해한다.
 */

import { CLINIC, UNVERIFIED } from './clinic';

const BASE = CLINIC.url;

export const abs = (path: string) => (path === '/' ? BASE : `${BASE}${path}`);

/** 병원 본체 스키마. 사이트 전 페이지에 1회 주입한다. */
export function clinicSchema() {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${BASE}/#clinic`,
    name: CLINIC.name,
    alternateName: CLINIC.nameEn,
    description: CLINIC.description,
    url: BASE,
    telephone: CLINIC.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${CLINIC.address.street}, ${CLINIC.address.building}`,
      addressLocality: CLINIC.address.locality,
      addressRegion: CLINIC.address.region,
      addressCountry: CLINIC.address.country,
    },
    areaServed: CLINIC.serviceArea.map((a) => ({ '@type': 'Place', name: a })),
    medicalSpecialty: 'Dentistry',
    /*
     * 편의시설 — "주차 되나요" 는 지역 병원 검색에서 매우 흔한 질의다.
     * LocationFeatureSpecification 으로 내면 지도·AI 답변이 이 값을 직접 읽는다.
     * 본문에만 적어 두면 기계가 확신하지 못해 답변에서 빠진다.
     */
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: '주차',
        value: true,
        description: `${CLINIC.parking.type} · ${CLINIC.parking.fee}`,
      },
    ],
    availableService: [
      '임플란트',
      '신경치료',
      '잇몸치료',
      '충치치료',
      '사랑니 발치',
      '크라운·보철',
      '스케일링·예방치료',
      '어린이 진료',
    ].map((n) => ({ '@type': 'MedicalProcedure', name: n })),
  };

  // 진료시간 — 확인된 경우에만 넣는다. 틀린 영업시간은 환자를 헛걸음시킨다.
  //   요일별로 한 줄씩 낸다(월·수·금을 묶어서 내면 크롤러가 못 읽는 형식이 된다).
  if (UNVERIFIED.hours.verified && UNVERIFIED.hours.rows.length > 0) {
    schema.openingHoursSpecification = UNVERIFIED.hours.rows.map((r) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${r.day}`,
      opens: r.open,
      closes: r.close,
    }));
  }

  // 좌표 — 확인된 경우에만. 틀린 좌표는 지역 검색에 해가 된다.
  if (UNVERIFIED.geo.verified && UNVERIFIED.geo.lat && UNVERIFIED.geo.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: UNVERIFIED.geo.lat,
      longitude: UNVERIFIED.geo.lng,
    };
  }

  return schema;
}

/** 의료 정보 문서. 시술·증상 페이지에 붙인다. */
export function medicalWebPageSchema(opts: {
  title: string;
  description: string;
  path: string;
  /** 문서가 다루는 주제 — 시술이면 MedicalProcedure, 증상이면 MedicalCondition. */
  about?: { type: 'MedicalProcedure' | 'MedicalCondition'; name: string };
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: opts.title,
    description: opts.description,
    url: abs(opts.path),
    inLanguage: 'ko-KR',
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': `${BASE}/#clinic` },
    /** 마지막 검토 주체를 밝히면 의료 정보의 신뢰 신호가 된다(E-E-A-T). */
    reviewedBy: { '@type': 'Person', name: `${CLINIC.director} 원장`, jobTitle: '치과의사' },
  };
  if (opts.about) {
    schema.about = { '@type': opts.about.type, name: opts.about.name };
  }
  return schema;
}

/** 질문–답변 쌍. AI 답변에 가장 직접적으로 인용되는 형식이다. */
export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

/** 사이트 계층. 크롤러가 문서 간 관계를 이해하게 한다. */
export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: CLINIC.name,
    inLanguage: 'ko-KR',
    publisher: { '@id': `${BASE}/#clinic` },
  };
}

/**
 * JSON-LD 직렬화. `<` 를 이스케이프해 `</script>` 주입을 막는다.
 * (렌더 컴포넌트는 components/JsonLd.tsx — 이 파일은 JSX 없이 순수하게 유지한다.)
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
