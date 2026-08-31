import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import { CLINIC } from '@/lib/clinic';
import { Container, ContactCta, PageHero } from '@/components/ui';
import { InteriorGallery } from '@/components/InteriorGallery';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '병원 둘러보기',
  /* 62자였다 — 검색 결과에서 쓸 수 있는 자리를 절반도 안 썼다. 있는 사실만으로 늘렸다(2026-08-18). */
  description: `${CLINIC.name} 내부 사진입니다. 대기 공간, 상담실, 진료실, 소독실을 미리 보실 수 있습니다. 처음 오시는 분이 어떤 곳인지 미리 확인하시도록 실제 사진만 올렸습니다. 경기 ${CLINIC.address.locality} ${CLINIC.address.dong} 현창빌딩 3층, 화정역 인근입니다.`,
  alternates: { canonical: '/about/tour' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '병원 소개', path: '/about' },
  { name: '둘러보기', path: '/about/tour' },
];

/**
 * 병원 둘러보기.
 *
 * ★ 처음 가는 병원의 낯섦은 실제 방문을 미루게 하는 이유 중 하나다.
 *   내부를 미리 보여 주는 것만으로 그 문턱이 낮아진다.
 * ★ 사진은 기존 홈페이지의 실제 병원 사진이다.
 * ★ 첫 두 장만 priority — 나머지는 지연 로딩한다. 12장을 한꺼번에 받으면 초기 로딩이 무겁다.
 */
export default function TourPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(TRAIL)} />

      <PageHero
        trail={TRAIL}
        photo="booth"
        eyebrow="Circle Dental Clinic"
        title="동그라미 치과 내부 둘러보기"
        desc="상담실과 진료실을 미리 보고 오시면 첫 방문이 조금 덜 낯섭니다."
      />

      <Container className="py-12 lg:py-16">

        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/about/tour" />
        </div>

        {/*
          ★★ 사진마다 설명을 눈에 보이게 단다 (2026-08-14) ★★
            전에는 사진 열두 장뿐이고 글이 120자였다. 사람에게는 "예쁘네" 로 끝나고,
            검색·답변 엔진 입장에서는 **인용할 문장이 하나도 없는 페이지**였다.
            사진이 무엇을 보여 주는지 한 줄씩 붙이면 같은 사진이 근거가 된다.
            설명은 lib/assets.ts 한 곳에서만 온다 — 사진 순서가 바뀌어도 어긋나지 않는다.
        */}
        {/*
          ★★ 격자 → **큰 사진 한 장 + 썸네일 줄** (2026-08-31 운영자) ★★
            운영자가 기존 홈페이지의 '둘러보기' 화면을 보여 주며 "우리도 이렇게 하는거 어때".
            격자는 열두 장을 한 번에 보여 주지만 **한 장도 크게 볼 수 없었다.**
            이 페이지는 '어떤 곳인지 미리 본다' 가 목적이라 크게 보는 쪽이 맞는다.

          ★ 앞선 두 번의 판단은 지금도 유효하다 —
            ① 벽돌쌓기(masonry)로 되돌리지 말 것. 줄이 안 맞고 읽는 순서가 뒤집힌다
               (2026-08-14 운영자: "줄이나 규격 좀 맞춰줘").
            ② **설명을 없애지 말 것.** 사진만 열두 장이던 시절 이 페이지는 인용할 문장이
               하나도 없었다. 지금은 큰 사진 아래 캡션 한 줄 + 썸네일 열두 장의 alt 로
               열두 줄이 모두 문서에 남는다(components/InteriorGallery.tsx 주석 참조).
          ⚠️ 홈의 흐르는 띠(InteriorSlider)와 헷갈리지 말 것 — 홈은 그대로 둔다.
        */}
        <div className="mt-14">
          <InteriorGallery />
        </div>
      </Container>

      <ContactCta
        title="직접 보시면 더 정확합니다"
        desc="궁금한 점이 있으시면 방문 전에 전화로 물어보셔도 됩니다."
      />
    </>
  );
}
