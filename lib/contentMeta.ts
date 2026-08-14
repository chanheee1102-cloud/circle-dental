/**
 * 콘텐츠 날짜 — 발행일과 최종 수정일.
 *
 * ★★ 왜 날짜가 필요한가 ★★
 *   의료 정보에서 검색엔진과 답변 엔진이 가장 먼저 보는 신뢰 신호가 **언제 쓴 글인가**다.
 *   같은 내용이라도 날짜가 없으면 "언제 기준인지 모르는 글" 이 되어 인용 순위에서 밀린다.
 *   Article 계열 스키마의 datePublished / dateModified 는 사실상 필수 필드다.
 *
 * ★★ 왜 상수로 두는가 — 지어내지 않기 위해서 ★★
 *   페이지마다 그럴듯한 날짜를 흩뿌려 두면 그 순간 전부 **거짓 날짜**가 된다.
 *   "최종 수정 2026-08-14" 라고 화면에 적어 놓고 실제로는 안 고쳤다면 그건 사실과 다른
 *   표시이고, 병원 홈페이지에서는 의료광고법상 위험한 종류의 거짓말이다.
 *   그래서 **실제로 그 글을 쓰거나 고친 날**만 여기 적는다.
 *
 * ⚠️ 본문을 고쳤으면 여기 날짜도 함께 올릴 것. 고치지 않았으면 올리지 말 것.
 *    (자동화하고 싶다면 git 커밋 날짜를 빌드 때 주입하는 방법이 있지만,
 *     오탈자 수정 같은 커밋까지 '내용 갱신' 으로 잡혀 오히려 신뢰를 깎는다.)
 */

/** 이 사이트의 콘텐츠를 처음 공개한 날. */
export const SITE_PUBLISHED = '2026-08-10';

/**
 * 전체 콘텐츠의 최종 검토·수정일.
 * 2026-08-14 — 구조화 데이터 전면 보완, 사진 설명 12장 작성, 병원 내부 사진 캡션 추가.
 */
export const SITE_MODIFIED = '2026-08-14';

/**
 * 경로별 예외. 여기 없으면 위의 사이트 기본값을 쓴다.
 * ⚠️ 실제로 그 페이지만 따로 고친 날이 있을 때만 적는다.
 */
const OVERRIDES: Record<string, { published?: string; modified?: string }> = {
  '/about/tour': { modified: '2026-08-14' },
  '/privacy': { published: '2026-08-13', modified: '2026-08-13' },
};

export function contentDates(path: string) {
  const o = OVERRIDES[path] ?? {};
  return {
    published: o.published ?? SITE_PUBLISHED,
    modified: o.modified ?? SITE_MODIFIED,
  };
}

/** 2026-08-14 → 2026년 8월 14일. 화면에 사람이 읽는 형태로 쓸 때. */
export function formatKoreanDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}
