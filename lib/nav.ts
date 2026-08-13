/**
 * 사이트 구조 정의.
 *
 * ★ 헤더 메뉴·푸터·사이트맵·빵부스러기가 전부 이 파일에서 파생된다.
 *   페이지를 추가하고 사이트맵에 넣는 것을 잊으면 그 페이지는 검색엔진이 영원히 모른다.
 *   한 곳에서 정의해 그 사고를 구조적으로 막는다.
 *
 * ★ 정보 구조 설계 근거 — 진료과목만으로는 검색 수요의 절반을 놓친다.
 *   환자는 "임플란트" 로도 검색하지만 "이가 빠졌는데 어떡하죠" 로도 묻는다.
 *   그래서 축을 둘로 나눴다: **진료**(무엇을 하는가) / **인사이트**(내 상태가 무엇인가).
 *   후자가 AI 검색에서 인용을 만드는 축이다.
 */

export interface NavChild {
  label: string;
  href: string;
  /** 메뉴에 붙는 한 줄 설명. 클릭 전에 무엇인지 알게 한다. */
  desc?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV: NavItem[] = [
  {
    label: '병원 소개',
    href: '/about',
    children: [
      { label: '동그라미의 특별함', href: '/about', desc: '진료를 대하는 기준' },
      { label: '의료진 소개', href: '/about/doctors', desc: '교수 출신 대표원장' },
      { label: '둘러보기', href: '/about/tour', desc: '병원 내부 사진' },
      { label: '진료 절차', href: '/about/process', desc: '내원부터 유지관리까지' },
    ],
  },
  {
    label: '진료',
    href: '/treatment',
    children: [
      { label: '전체 진료과목', href: '/treatment', desc: '한눈에 보기' },
      { label: '자연치아 살리기', href: '/treatment/save-natural-tooth', desc: '뽑기 전에 먼저' },
      { label: '임플란트', href: '/treatment/implant' },
      { label: '심미치료', href: '/treatment/aesthetic' },
      { label: '신경치료', href: '/treatment/endodontic' },
      { label: '잇몸치료', href: '/treatment/periodontal' },
      { label: '충치치료', href: '/treatment/cavity' },
      { label: '사랑니 발치', href: '/treatment/wisdom-tooth' },
      { label: '크라운·보철', href: '/treatment/crown-prosthesis' },
      { label: '스케일링·예방', href: '/treatment/scaling-prevention' },
      { label: '어린이 진료', href: '/treatment/pediatric' },
    ],
  },
  {
    label: '인사이트',
    href: '/insight',
    children: [
      { label: '증상으로 찾기', href: '/insight/symptom', desc: '내 증상이 무엇인지부터' },
      { label: '질환 사전', href: '/insight/condition', desc: '들은 병명이 무엇인지' },
      { label: '치료 여정', href: '/insight/journey', desc: '몇 번 오고 얼마나 걸리는지' },
      { label: '비용 가이드', href: '/insight/cost', desc: '보험이 되는 것과 안 되는 것' },
      { label: '용어 사전', href: '/insight/glossary', desc: '설명에 나오는 말 풀이' },
      { label: '응급 상황', href: '/insight/emergency', desc: '지금 당장 해야 할 것' },
    ],
  },
  {
    label: '내원 안내',
    href: '/visit',
    children: [
      { label: '오시는 길·진료시간', href: '/visit' },
      { label: '자주 묻는 질문', href: '/faq' },
    ],
  },
];

/** 사이트맵·푸터가 함께 쓰는 평탄화 목록. */
export function flatNavPaths(): string[] {
  const out = new Set<string>(['/']);
  for (const item of NAV) {
    out.add(item.href);
    for (const c of item.children ?? []) out.add(c.href);
  }
  return [...out];
}

/** 빵부스러기 라벨 조회 — 경로에서 사람이 읽는 이름으로. */
export function labelForPath(path: string): string | undefined {
  for (const item of NAV) {
    if (item.href === path) return item.label;
    for (const c of item.children ?? []) if (c.href === path) return c.label;
  }
  return undefined;
}
