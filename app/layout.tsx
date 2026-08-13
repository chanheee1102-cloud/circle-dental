import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { QuickMenu } from '@/components/QuickMenu';
import { JsonLd } from '@/components/JsonLd';
import { clinicSchema, websiteSchema } from '@/lib/seo';
import { CLINIC } from '@/lib/clinic';

/**
 * 루트 레이아웃.
 *
 * ★ metadataBase 를 반드시 둔다 — 없으면 OG 이미지와 canonical 이 상대 경로로 나가
 *   카카오톡·검색엔진이 이미지를 못 읽는다.
 * ★ 병원 스키마(Dentist)는 여기서 1회만 주입한다. 페이지마다 중복 주입하면
 *   같은 @id 가 여러 번 나와 크롤러가 어느 쪽을 믿을지 혼란스러워진다.
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
        <JsonLd data={[clinicSchema(), websiteSchema()]} />
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
