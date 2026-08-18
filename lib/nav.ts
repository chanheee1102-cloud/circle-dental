/**
 * 사이트 구조 정의.
 *
 * ★ 헤더 메뉴·푸터·사이트맵·빵부스러기가 전부 이 파일에서 파생된다.
 *   페이지를 추가하고 사이트맵에 넣는 것을 잊으면 그 페이지는 검색엔진이 영원히 모른다.
 *   한 곳에서 정의해 그 사고를 구조적으로 막는다.
 *
 * ★ 정보 구조 설계 근거 — 진료과목만으로는 검색 수요의 절반을 놓친다.
 *   환자는 "임플란트" 로도 검색하지만 "이가 빠졌는데 어떡하죠" 로도 묻는다.
 *   그래서 축을 둘로 나눴다: **진료**(무엇을 하는가) / **미리 알아두기**(내 상태가 무엇인가).
 *   후자가 AI 검색에서 인용을 만드는 축이다.
 */

export interface NavChild {
  label: string;
  href: string;
  /** 메뉴에 붙는 한 줄 설명. 클릭 전에 무엇인지 알게 한다. */
  desc?: string;
}

/*
 * (2026-08-14) 메가메뉴 오른쪽 '대표 카드'(NavFeature — 사진 + 홍보 문구 + CTA)를 제거했다.
 *   운영자 판단: "굳이 오른쪽에 저건 없어도 돼. 그냥 메뉴만 나오면 돼."
 *   메뉴는 가려던 곳으로 빨리 보내는 자리라 거기서 읽을거리를 권하지 않는다.
 *   ⚠️ 이 파일이 lib/assets · lib/doctors · lib/clinic 을 import 하던 이유가 그 카드였다.
 *      import 도 함께 지웠다 — 헤더는 클라이언트 컴포넌트라 안 쓰는 데이터가 딸려 오면
 *      그만큼 첫 화면에서 받아야 할 자바스크립트가 늘어난다.
 */
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
      /*
       * ⚠️ '교수 출신' 이라고만 적었었다 — 확인된 경력은 **외래교수**다(lib/doctors.ts).
       *    줄여 적은 말이 원문보다 세지면 그건 과장이고, 의료광고에서 자격 과장은 제56조 문제다.
       */
      { label: '의료진 소개', href: '/about/doctors', desc: '외래교수 출신 대표원장' },
      /*
       * ★ 홈에서 뺀 '근거'(자격·인증·논문·언론)를 옮겨 담은 페이지 (2026-08-14).
       *   홈에서 뺀 만큼 메뉴에는 반드시 올린다 — 메뉴에 없으면 사이트 안에서 그 페이지로
       *   가는 길이 사라져 크롤러도 늦게 발견하고 사람도 못 찾는다.
       */
      { label: '근거 · 인증', href: '/about/trust', desc: '자격·논문·언론 기록' },
      { label: '둘러보기', href: '/about/tour', desc: '병원 내부 사진' },
      { label: '진료 절차', href: '/about/process', desc: '내원부터 유지관리까지' },
    ],
  },
  {
    label: '진료',
    href: '/treatment',
    /*
     * ★ desc 는 전부 lib/treatments.ts 의 whoFor 에서 온다 (2026-08-14).
     *   메뉴 문구를 새로 지어내지 않는다 — 진료 내용을 말하는 문장은 어디에 있든
     *   같은 근거에서 나와야 한다. 여기 있는 것은 그 첫 항목을 메뉴 길이에 맞게 줄인 것이다.
     */
    children: [
      { label: '전체 진료과목', href: '/treatment', desc: '열 갈래를 한눈에' },
      { label: '자연치아 살리기', href: '/treatment/save-natural-tooth', desc: '발치를 권유받았을 때' },
      { label: '임플란트', href: '/treatment/implant', desc: '치아를 뽑았거나 빠진 자리' },
      { label: '심미치료', href: '/treatment/aesthetic', desc: '앞니 색·모양이 신경 쓰일 때' },
      { label: '신경치료', href: '/treatment/endodontic', desc: '가만히 있어도 욱신거릴 때' },
      { label: '잇몸치료', href: '/treatment/periodontal', desc: '양치할 때 피가 날 때' },
      { label: '충치치료', href: '/treatment/cavity', desc: '검은 점이나 구멍이 보일 때' },
      { label: '사랑니 발치', href: '/treatment/wisdom-tooth', desc: '사랑니 주변이 붓고 아플 때' },
      { label: '크라운·보철', href: '/treatment/crown-prosthesis', desc: '깨졌거나 크게 파인 치아' },
      { label: '스케일링·예방', href: '/treatment/scaling-prevention', desc: '1년 넘게 안 받았다면' },
      { label: '어린이 진료', href: '/treatment/pediatric', desc: '첫 치과 방문을 앞둔 아이' },
    ],
  },
  {
    label: '미리 알아두기',
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
      { label: '오시는 길·진료시간', href: '/visit', desc: '위치 · 주차 · 여는 시간' },
      /*
       * ★ 연락처를 메뉴에 올린다 (2026-08-14).
       *   /visit 은 '오시는 길' 이라 지도와 교통편이 주인공이다. "연락처" 를 찾는 사람은
       *   길이 아니라 **말을 걸 방법**을 찾고, 그 주소는 관습적으로 /contact 다.
       *   메뉴에 없으면 사이트 안에서 그 페이지로 가는 길이 없어 크롤러도 늦게 발견한다.
       */
      { label: '연락처·예약 문의', href: '/contact', desc: '전화 · 카톡 · 네이버 예약' },
      { label: '자주 묻는 질문', href: '/faq', desc: '오기 전에 많이 묻는 것' },
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
