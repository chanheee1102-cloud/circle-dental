import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { QuickMenu } from '@/components/QuickMenu';
import { CLINIC } from '@/lib/clinic';

/**
 * 루트 레이아웃.
 *
 * ★ metadataBase 를 반드시 둔다 — 없으면 OG 이미지와 canonical 이 상대 경로로 나가
 *   카카오톡·검색엔진이 이미지를 못 읽는다.
 *
 * ★ 파비콘은 `app/icon.png` · `app/apple-icon.png` 파일 두 개다. 여기에 metadata.icons 를
 *   적지 않는다 — App Router 는 그 경로의 파일을 자동으로 찾아 <link> 를 만들고,
 *   양쪽에 적으면 어느 쪽이 이겼는지 헷갈리는 중복 선언이 된다.
 *   (실측: 선언이 하나도 없어 크롬 탭에 기본 지구본이 떴다 — 운영자 신고 2026-08-13.)
 *
 *   icon.png 는 **기존 홈페이지가 실제로 쓰는 파비콘 파일 그대로**다(196×196, 투명 배경).
 *   비슷하게 그린 SVG 로 대체하지 않는다 — 두 사이트를 나란히 열었을 때 탭 아이콘이
 *   미묘하게 달라 보이면 브랜드가 두 개로 갈라진다.
 *
 *   apple-icon.png 만 흰 바탕으로 다시 합성했다. iOS 는 홈 화면 아이콘의 투명 영역을
 *   **검게** 채우는데, 원본 마크가 짙은 회색이라 검정 위에 얹히면 형체가 사라진다.
 *   모서리를 iOS 가 깎으므로 안쪽 여백도 함께 뒀다.
 * ★★ 구조화 데이터는 여기서 내지 않는다 (2026-08-14) ★★
 *   예전에는 병원(Dentist)·사이트(WebSite)를 레이아웃에서 한 번 내고, 페이지가 자기
 *   스키마를 또 따로 냈다. 그러면 한 문서에 스크립트가 **둘 이상**이 되고,
 *   크롤러 입장에서 그 조각들은 서로 남남이라 "이 문서의 발행자 = 이 병원" 이라는
 *   관계가 이어지지 않는다.
 *   → 이제 `components/JsonLd.tsx` 가 병원·사이트·대표원장 노드를 자동으로 앞에 붙여
 *     **페이지마다 @graph 하나짜리 스크립트 한 개**를 낸다. 그쪽 주석 참고.
 *   ⚠️ 여기에 JsonLd 를 다시 넣지 말 것 — 넣는 순간 모든 페이지가 스크립트 2개가 된다.
 */
export const metadata: Metadata = {
  metadataBase: new URL(CLINIC.url),
  title: {
    default: `${CLINIC.name} | 고양시 덕양구 화정동 치과`,
    // 페이지별 제목 뒤에 병원명을 붙인다 — 검색 결과에서 어느 병원인지 즉시 보이게.
    template: `%s | ${CLINIC.name}`,
  },
  description: CLINIC.description,
  applicationName: CLINIC.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: CLINIC.name,
    title: `${CLINIC.name} | 고양시 덕양구 화정동 치과`,
    description: CLINIC.description,
    url: CLINIC.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { telephone: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/*
          글꼴을 <link> 로 건다 — globals.css 안의 @import 를 여기로 옮긴 것이다.
          @import 는 CSS 를 다 받아 파싱한 뒤에야 발견되므로 첫 화면이 그만큼 늦는다.
          <link> 는 HTML 을 읽는 즉시 발견돼 다른 자원과 병렬로 내려온다.

          preload 는 굳이 걸지 않는다. 이 CSS 는 unicode-range 로 92조각을 가리키고
          실제로 필요한 조각은 브라우저가 글자를 보고 고른다 — 미리 집어 주면
          안 쓸 조각을 받아 오히려 손해다. font-display:swap 이 이미 들어 있어
          글꼴이 늦어도 본문은 폴백으로 즉시 보인다.
        */}
        <link rel="stylesheet" href="/fonts/pretendard/pretendard.css" />
      </head>
      <body>
        {/* 키보드 사용자가 헤더 메뉴를 매번 통과하지 않고 본문으로 건너뛸 수 있게 한다. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-white"
        >
          본문 바로가기
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <QuickMenu />
      </body>
    </html>
  );
}
