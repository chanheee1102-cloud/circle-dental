import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import { TREATMENTS } from '@/lib/treatments';
import { Container, SectionHead, Breadcrumb, ContactCta } from '@/components/ui';
import { CareListSection } from '@/components/CareListSection';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '진료과목',
  description:
    '동그라미치과의 진료 범위입니다. 임플란트, 신경치료, 잇몸치료, 충치치료, 사랑니 발치, 크라운·보철, 스케일링, 어린이 진료를 봅니다.',
  alternates: { canonical: '/treatment' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
];

export default function TreatmentIndexPage() {
  return (
    <>
      {/*
        ★ 화면에 열 줄짜리 번호 목록이 실제로 보이게 된 다음에야 ItemList 를 붙였다
          (2026-08-14, 홈에서 목록을 옮겨 온 커밋). 안 보이는 목록에 붙이면 정책 위반이다.
      */}
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          itemListSchema(
            '/treatment',
            TREATMENTS.map((t) => ({ name: t.name, path: `/treatment/${t.slug}` })),
            '동그라미치과 진료 영역',
          ),
        ]}
      />
      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        {/*
          ★ 제목을 질문형으로 바꿨다 (2026-08-14).
            '무엇을 하는 곳인지, 각 치료가 어떤 과정인지' 는 목차 제목이지 사람이 치는 문장이
            아니다. 홈에서 이 목록을 옮겨 오면서 홈에서 쓰던 질문형 제목을 함께 가져왔다.
        */}
        <SectionHead
          as="h1"
          eyebrow="진료과목"
          title="어떤 경우에 어떤 진료를 하나요?"
          desc={`${TREATMENTS.length}가지 진료 영역을 ‘이런 경우에 봅니다’ 기준으로 정리했습니다. 자기 상황과 가까운 줄을 눌러 보세요. 치료마다 자주 나오는 질문도 함께 적어 두었습니다.`}
        />

        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/treatment" />
        </div>

        {/*
          ★★ 홈에 있던 진료 영역 목록을 여기로 옮겼다 (2026-08-14 운영자) ★★
            원래 이 자리에 있던 카드 격자(이름 + 요약 + 질문 수)는 이 목록이 그대로 흡수했다.
            목록 쪽에는 카드에 없던 **'이런 경우에 봅니다'** 칩까지 있어 카드를 남길 이유가 없다.
          ⚠️ 둘을 같이 두면 같은 열 개 링크가 한 페이지에 두 번 생긴다 — 중복 링크는
             사람에게도 기계에게도 손해다.
        */}
        <div className="mt-12">
          <CareListSection headless />
        </div>
      </Container>

      <ContactCta />
    </>
  );
}
