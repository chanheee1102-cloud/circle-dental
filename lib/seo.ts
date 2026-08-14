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

import { CLINIC, UNVERIFIED, CREDENTIALS } from './clinic';
import { TREATMENTS } from './treatments';
import { DOCTORS } from './doctors';
import { contentDates } from './contentMeta';

const BASE = CLINIC.url;

export const abs = (path: string) => (path === '/' ? BASE : `${BASE}${path}`);

/**
 * 노드 @id 규칙 — 한 곳에 모아 둔다.
 *
 * ★★ 왜 @id 가 필요한가 ★★
 *   스키마를 따로따로 내면 크롤러 입장에서는 **서로 남남인 조각들**이다.
 *   "이 문서의 발행자" 와 "이 병원" 이 같은 존재라는 것을 알 방법이 없다.
 *   @id 로 URI 를 붙여 두면 `publisher: { '@id': '…/#clinic' }` 한 줄로 이어진다.
 *   지식패널은 이렇게 이어진 **엔티티 그래프**를 보고 만들어진다.
 */
export const ID = {
  clinic: `${BASE}/#clinic`,
  website: `${BASE}/#website`,
  /** 대표원장 — 모든 의료 문서의 검토자. 원장 개별 페이지의 Physician 노드와 같은 URI 다. */
  director: `${BASE}/about/doctors/${DOCTORS[0].slug}#physician`,
  page: (path: string) => `${abs(path)}#webpage`,
  article: (path: string) => `${abs(path)}#article`,
  breadcrumb: (path: string) => `${abs(path)}#breadcrumb`,
  image: (path: string) => `${abs(path)}#primaryimage`,
} as const;

/** 병원 본체 스키마. 사이트 전 페이지에 1회 주입한다. */
export function clinicSchema() {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    /*
     * ★★ 세 타입을 함께 준다 (2026-08-14) ★★
     *   Dentist 는 스키마 계층상 MedicalOrganization → Organization 아래이지만,
     *   **상속은 사람이 읽는 규칙이지 파서가 자동으로 채워 주는 값이 아니다.**
     *   실제로 여러 검사 도구가 `@type` 문자열에서 'Organization' 을 그대로 찾는다
     *   (외부 진단: "Organization 스키마 없음"). 세 개를 명시하면
     *   Dentist 로서의 지역·진료 신호와 Organization 으로서의 회사 기본 정보가 함께 잡힌다.
     */
    '@type': ['Organization', 'MedicalOrganization', 'Dentist'],
    '@id': `${BASE}/#clinic`,
    name: CLINIC.name,
    legalName: CLINIC.name,
    alternateName: CLINIC.nameEn,
    description: CLINIC.description,
    url: BASE,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    /** 사업자등록번호 — 법인·사업자 식별의 공식 값이다. */
    taxID: CLINIC.bizNo,
    /** 대표자 — Person 노드를 @id 로 가리켜 저자·검토자와 같은 사람으로 이어진다. */
    founder: { '@id': ID.director },
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE}/#logo`,
      url: `${BASE}/icon.png`,
      contentUrl: `${BASE}/icon.png`,
      caption: `${CLINIC.name} 로고`,
      width: 196,
      height: 196,
    },
    image: { '@id': `${BASE}/#logo` },
    /*
     * 연락 창구 — 전화 하나만 두지 않고 역할을 밝힌다.
     * "예약 전화가 따로 있나요" 같은 질의에 기계가 바로 답할 수 있다.
     */
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: CLINIC.phone,
        contactType: '예약 및 진료 문의',
        areaServed: 'KR',
        availableLanguage: ['ko'],
      },
    ],
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

    /*
     * sameAs — "이 홈페이지와 저 네이버 예약과 저 카카오 채널이 **같은 병원**" 이라고
     * 기계에게 알려 주는 유일한 표준 방법이다.
     *
     * ★ 화면에 링크를 걸어 두는 것만으로는 부족하다. 크롤러 입장에서 <a href> 는
     *   '이 페이지가 저 페이지를 가리킨다' 는 뜻일 뿐, 둘이 동일 주체라는 뜻이 아니다.
     *   sameAs 는 엔티티 동일성을 선언하는 자리라 지식패널·지역 검색이 이 값을 본다.
     *   (진단에서 'sameAs 미설정' 으로 잡히던 항목이 이것이다 — 데이터는 이미 있었다.)
     *
     * ★ 있는 채널만 넣는다. 없는 주소를 sameAs 에 적으면 404 를 가리키는 동일성 선언이
     *   되어 오히려 신호를 해친다. 인스타그램은 운영자가 준 주소로 200 을 확인하고 넣었다
     *   (2026-08-14). 유튜브는 계정을 확인하지 못해 아직 넣지 않는다.
     */
    sameAs: [
      CLINIC.booking.naver,
      CLINIC.booking.kakao,
      CLINIC.social.instagram,
      CLINIC.social.naverBlog,
    ],

    /*
     * ★★ 신뢰 지표를 구조화한다 (2026-08-14) ★★
     *   외부 진단이 "인증·거래처 등 신뢰 지표가 없다" 고 잡았다. 그런데 자료는 이미 있었다 —
     *   인증패 넷, 학회 정회원, 발표 논문, 방송 출연이 전부 화면에 있는데
     *   **기계가 읽을 형태가 아니었을 뿐**이다.
     *
     * ⚠️⚠️ 여기에 '고객 후기' 를 넣지 않는다 ⚠️⚠️
     *   의료법 제56조 제2항은 **치료경험담 광고를 금지**한다. 별점·후기·전후 사진 같은
     *   일반 업종의 신뢰 지표를 치과 홈페이지에 그대로 옮기면 그 자체가 위법이다.
     *   의료에서 허용된 신뢰 지표는 **자격·학회·논문·언론** 쪽이고, 그래서 그것만 낸다.
     *   (aggregateRating / review 를 절대 넣지 말 것.)
     */
    hasCredential: CREDENTIALS.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c,
      credentialCategory: '수료·인증',
    })),
    knowsAbout: TREATMENTS.map((t) => t.name),
    /** 실제로 다루는 진료 영역 수 — '얼마나 넓게 보는가' 를 기계가 셀 수 있게. */
    makesOffer: TREATMENTS.map((t) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'MedicalProcedure', name: t.name },
      url: abs(`/treatment/${t.slug}`),
    })),
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

/**
 * 페이지별 Open Graph 블록.
 *
 * ★★ 왜 헬퍼가 필요한가 (2026-08-14 실측으로 발견) ★★
 *   Next.js 의 metadata 병합에서 `openGraph` 는 **통째로 교체**된다. 그래서 페이지가
 *   `openGraph: { title, description }` 만 적으면 루트 레이아웃이 준 `url`·`images` 가
 *   **사라진다.** 실측 결과 89개 중 og 4종을 다 갖춘 페이지가 16개뿐이었다.
 *   카카오톡에 주소를 붙여 넣었을 때 이미지가 안 뜨던 이유가 이것이다.
 *
 * ★ images 를 생략하면 `app/opengraph-image.tsx` 가 만든 1200×630 카드가 자동으로 붙는다.
 *   사람 사진처럼 그 페이지 고유의 이미지가 있으면 그것을 넘긴다.
 */
export function og(opts: {
  title: string;
  description: string;
  path: string;
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
}) {
  return {
    type: 'article' as const,
    locale: 'ko_KR',
    siteName: CLINIC.name,
    title: opts.title,
    description: opts.description,
    url: abs(opts.path),
    /*
     * ★★ images 를 반드시 채운다 (2026-08-14 실측) ★★
     *   페이지가 openGraph 를 직접 선언하면 `app/opengraph-image.tsx` 가 자동으로 붙여 주던
     *   카드가 **사라진다**(실측: og 4종을 다 갖춘 페이지가 89개 중 24개뿐이었다).
     *   그래서 고유 이미지가 없으면 루트 OG 카드 주소를 명시적으로 넣는다.
     *   metadataBase 가 있어 상대 경로도 절대 주소로 나간다.
     */
    images: opts.images ?? [
      { url: '/opengraph-image', width: 1200, height: 630, alt: `${CLINIC.name} 대표 이미지` },
    ],
  };
}

/**
 * 대표원장 Person 노드.
 *
 * ★ 모든 의료 문서의 `author` / `reviewedBy` 가 이 하나를 @id 로 가리킨다.
 *   문서마다 이름만 적어 두면 크롤러는 **같은 이름의 서로 다른 사람 여럿**으로 읽는다.
 *   하나의 URI 로 모으면 "이 사람이 쓴 글이 이만큼" 이라는 저자 권위가 누적된다.
 * ★ 경력·학회는 lib/doctors.ts 원문 그대로다 — 여기서 만들지 않는다(의료법 제56조).
 */
export function directorPersonSchema() {
  const d = DOCTORS[0];
  return {
    '@type': ['Person', 'Physician'],
    '@id': ID.director,
    name: d.name,
    jobTitle: `치과의사 · ${d.role}`,
    medicalSpecialty: 'Dentistry',
    url: abs(`/about/doctors/${d.slug}`),
    image: abs(d.photo),
    worksFor: { '@id': ID.clinic },
    knowsAbout: d.focus,
    alumniOf: d.career
      .filter((c) => /대학|대학원|UCLA|Upenn/.test(c))
      .map((c) => ({ '@type': 'EducationalOrganization', name: c })),
    memberOf: d.societies.map((s) => ({ '@type': 'Organization', name: s })),
    /*
     * 자격·수료 — 저자 권위의 근거다. 이름만 있는 저자와 "무엇을 근거로 이 사람을
     * 믿을 수 있는가" 가 붙은 저자는 인용 판단에서 다르게 취급된다.
     * ⚠️ 전부 lib/doctors.ts · lib/assets.ts 원문이다. 여기서 만들지 않는다.
     */
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: '보건복지부 인정 통합치의학과 전문의',
        credentialCategory: '전문의 자격',
        recognizedBy: { '@type': 'GovernmentOrganization', name: '보건복지부' },
      },
      ...CREDENTIALS.map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        name: c,
        credentialCategory: '수료·인증',
      })),
    ],
    /** 저자 동일성 — 이 사람의 프로필 페이지와 병원 계정을 잇는다. */
    sameAs: [
      abs(`/about/doctors/${d.slug}`),
      CLINIC.social.instagram,
      CLINIC.social.naverBlog,
    ],
  };
}

/** 대표 이미지 노드. contentUrl · caption · width · height 를 갖춰야 리치 결과 대상이 된다. */
export function imageObjectSchema(opts: {
  path: string;
  src: string;
  caption: string;
  width: number;
  height: number;
}) {
  return {
    '@type': 'ImageObject',
    '@id': ID.image(opts.path),
    contentUrl: abs(opts.src),
    url: abs(opts.src),
    caption: opts.caption,
    width: opts.width,
    height: opts.height,
  };
}

/**
 * 이 문서의 대표 이미지.
 *
 * ★★ 왜 사진이 없는 페이지에도 필요한가 ★★
 *   Article 은 image 를 요구한다 — 없으면 리치 결과 대상에서 빠진다. 그런데 질환·증상
 *   설명처럼 **사진이 없는 것이 옳은 문서**가 있다(관련 없는 사진을 억지로 넣으면
 *   그게 더 나쁘다). 그런 문서에는 그 페이지 전용으로 생성되는 1200×630 공유 카드를
 *   대표 이미지로 쓴다. 실제로 존재하고, 실제로 그 문서를 대표하는 이미지다.
 * ⚠️ 관련 없는 병원 사진을 아무거나 붙이지 말 것 — 검색 결과에 엉뚱한 그림이 나간다.
 */
export function pageImage(
  photo: { src: string; caption: string; width: number; height: number } | undefined,
  fallbackCaption: string,
) {
  return (
    photo ?? {
      src: '/opengraph-image',
      caption: fallbackCaption,
      width: 1200,
      height: 630,
    }
  );
}

/** 사이트 계층. 크롤러가 문서 간 관계를 이해하게 한다. */
export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    '@id': ID.breadcrumb(trail[trail.length - 1]?.path ?? '/'),
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

/**
 * 목록 페이지의 ItemList.
 *
 * ★★ 왜 목록에만 붙이는가 ★★
 *   화면에 **번호가 매겨진 목록이 실제로 보일 때만** 유효하다. 보이지 않는 목록을
 *   ItemList 로 표시하는 것은 구조화 데이터 정책 위반이고, 위반으로 잡히면
 *   그 페이지의 다른 마크업까지 함께 무시된다.
 *   (그래서 홈에서 진료 목록을 /treatment 로 옮길 때 홈이 아니라 여기에 붙였다.)
 *
 * ★ url 만 넣고 name 을 함께 넣는다 — url 만 있으면 크롤러가 그 페이지를 열어 봐야
 *   무엇인지 알 수 있고, 열어 보지 않으면 목록의 의미가 전달되지 않는다.
 */
export function itemListSchema(
  path: string,
  items: Array<{ name: string; path: string }>,
  name?: string,
) {
  return {
    '@type': 'ItemList',
    '@id': `${abs(path)}#itemlist`,
    ...(name ? { name } : {}),
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: abs(it.path),
    })),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: BASE,
    name: CLINIC.name,
    inLanguage: 'ko-KR',
    publisher: { '@id': ID.clinic },
  };
}

/**
 * 의료 정보 문서 노드.
 *
 * ★ 예전에는 여기서 `@context` 를 달고 독립 스크립트로 나갔다. 이제는 @graph 안의
 *   한 노드라 @context 는 바깥에서 한 번만 붙는다(components/JsonLd.tsx).
 * ★ datePublished / dateModified / reviewedBy 가 붙는다 — 의료 정보에서 "언제 기준 글인가"
 *   와 "누가 검토했나" 는 인용 여부를 가르는 두 축이다.
 */
export function medicalWebPageSchema(opts: {
  title: string;
  description: string;
  path: string;
  /** 문서가 다루는 주제 — 시술이면 MedicalProcedure, 증상이면 MedicalCondition. */
  about?: { type: 'MedicalProcedure' | 'MedicalCondition'; name: string };
  /** 목록·허브가 아니라 읽을 본문이 있는 문서인가. 대표 이미지가 있으면 함께 잇는다. */
  image?: { src: string; caption: string; width: number; height: number };
}) {
  const { published, modified } = contentDates(opts.path);
  const schema: Record<string, unknown> = {
    '@type': 'MedicalWebPage',
    '@id': ID.page(opts.path),
    name: opts.title,
    description: opts.description,
    url: abs(opts.path),
    inLanguage: 'ko-KR',
    isPartOf: { '@id': ID.website },
    publisher: { '@id': ID.clinic },
    breadcrumb: { '@id': ID.breadcrumb(opts.path) },
    datePublished: published,
    dateModified: modified,
    /** 마지막 검토 주체를 밝히면 의료 정보의 신뢰 신호가 된다(E-E-A-T). */
    reviewedBy: { '@id': ID.director },
    lastReviewed: modified,
  };
  if (opts.about) {
    schema.about = { '@type': opts.about.type, name: opts.about.name };
  }
  if (opts.image) {
    schema.primaryImageOfPage = { '@id': ID.image(opts.path) };
  }
  return schema;
}

/**
 * 본문형 문서의 Article 노드.
 *
 * ★★ headline · datePublished · dateModified · author 네 개가 핵심이다 ★★
 *   이 중 하나라도 비면 Article 로 인정받지 못한다. 특히 author 는 이름 문자열이 아니라
 *   **Person 노드를 @id 로 가리켜야** 저자 권위가 한 사람에게 누적된다.
 * ⚠️ 목록·허브 페이지에는 붙이지 않는다. 읽을 본문이 없는 Article 은 빈 껍데기라
 *    오히려 품질 신호를 깎는다.
 */
export function articleSchema(opts: {
  path: string;
  title: string;
  description: string;
  /** 본문 전체 글자수 — 있으면 넣는다(문서 깊이 신호). */
  wordCount?: number;
  hasImage?: boolean;
  /** 이 글이 다루는 주제어. 검색 질의와 문서를 잇는다. */
  keywords?: string[];
}) {
  const { published, modified } = contentDates(opts.path);
  const node: Record<string, unknown> = {
    '@type': 'Article',
    '@id': ID.article(opts.path),
    isPartOf: { '@id': ID.page(opts.path) },
    mainEntityOfPage: { '@id': ID.page(opts.path) },
    headline: opts.title,
    description: opts.description,
    inLanguage: 'ko-KR',
    datePublished: published,
    dateModified: modified,
    author: { '@id': ID.director },
    publisher: { '@id': ID.clinic },
  };
  if (opts.hasImage) node.image = { '@id': ID.image(opts.path) };
  if (opts.wordCount) node.wordCount = opts.wordCount;
  if (opts.keywords?.length) node.keywords = opts.keywords.join(', ');
  return node;
}

/**
 * 질문–답변 쌍. AI 답변에 가장 직접적으로 인용되는 형식이다.
 *
 * ⚠️⚠️ **화면에 실제로 보이는 문답만** 넣는다 ⚠️⚠️
 *    접혀 있어도 HTML 안에 있으면 되지만, 화면 어디에도 없는 질문을 마크업하면
 *    구글 구조화 데이터 정책 위반이고 수동 조치 대상이다.
 *    그래서 이 함수는 항상 **그 페이지가 렌더하는 배열 그대로** 받는다.
 */
export function faqSchema(items: Array<{ q: string; a: string }>, path?: string) {
  const base = path ? abs(path) : '';
  return {
    '@type': 'FAQPage',
    ...(path ? { '@id': `${base}#faq`, isPartOf: { '@id': ID.page(path) } } : {}),
    mainEntity: items.map((it, i) => ({
      '@type': 'Question',
      ...(path ? { '@id': `${base}#faq-${i + 1}` } : {}),
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

/**
 * JSON-LD 직렬화. `<` 를 이스케이프해 `</script>` 주입을 막는다.
 * (렌더 컴포넌트는 components/JsonLd.tsx — 이 파일은 JSX 없이 순수하게 유지한다.)
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
