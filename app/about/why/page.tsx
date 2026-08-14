import type { Metadata } from 'next';
import { CLINIC } from '@/lib/clinic';
import { CONCERNS } from '@/lib/concerns';
import { WHY_US, WHY_US_COUNT } from '@/lib/whyUs';
import { Container, SectionHead, Breadcrumb, ContactCta, MedicalNotice } from '@/components/ui';
import { ConcernsSection } from '@/components/ConcernsSection';
import { WhyUsSection } from '@/components/WhyUsSection';
import { ArticleMeta, KeyPoints, TableOfContents, charCount } from '@/components/article';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, medicalWebPageSchema, articleSchema, faqSchema, og } from '@/lib/seo';

/**
 * 왜 동그라미치과인가 — 망설임과 근거를 한 문서로.
 *
 * ★★ 왜 홈에서 여기로 옮겼나 (2026-08-14 운영자) ★★
 *   '망설임 6가지' 와 'WHY US 12가지' 가 홈에 함께 있으니 홈 스크롤이 끝없이 길어졌다.
 *   그리고 AEO 관점에서도 홈에 다 몰아넣는 것이 유리하지 않다 —
 *   답변 엔진은 페이지가 아니라 **주제 단위 문맥(chunk)** 을 가져간다. 한 페이지에
 *   병원 소개·진료·후기·FAQ 가 섞여 있으면 그 문서의 핵심 주제가 흐려지고,
 *   인용할 때도 홈 URL 밖에 줄 수 없다.
 *   → 주제를 가진 전용 URL 로 나누면 "이 병원 왜 가야 해?" 라는 질의에
 *     **이 페이지 주소를 콕 집어** 인용할 수 있다.
 *
 * ★ 둘을 한 페이지에 둔 이유
 *   망설임(질문)과 근거(답)는 짝이다. 따로 두면 "무섭다" 는 페이지와 "전문의가 있다" 는
 *   페이지가 서로를 모른 채 떠 있게 된다. 같은 문서 안에서 이어져야 답이 된다.
 *
 * ⚠️ 문구는 전부 lib/concerns.ts · lib/whyUs.ts 에서 온다. 여기서 문장을 만들지 않는다 —
 *    의료광고는 사실이 아닌 표시가 그대로 의료법 제56조 위반이다.
 */
export const metadata: Metadata = {
  title: '왜 동그라미치과인가',
  description: `치과를 미루게 되는 이유 ${CONCERNS.length}가지와 ${CLINIC.name}이 그에 답하는 근거 ${WHY_US_COUNT}가지를 정리했습니다. 의료진, 진단·장비, 내원 편의 세 갈래로 나눠 확인하실 수 있습니다.`,
  alternates: { canonical: '/about/why' },
  openGraph: og({
    title: `왜 동그라미치과인가 | ${CLINIC.name}`,
    description: `미루게 되는 이유 ${CONCERNS.length}가지와 그에 답하는 근거 ${WHY_US_COUNT}가지.`,
    path: '/about/why',
  }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '병원 소개', path: '/about' },
  { name: '왜 동그라미치과인가', path: '/about/why' },
];

export default function WhyPage() {
  /*
   * ⚠️ FAQPage 는 **화면에 실제로 보이는 문답**만 낸다.
   *    망설임 카드는 "질문 — 답" 구조로 화면에 그대로 그려지므로 마크업 대상이 맞다.
   */
  const faq = CONCERNS.map((c) => ({ q: c.quote, a: c.answer }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: `왜 ${CLINIC.name}인가`,
            description: metadata.description as string,
            path: '/about/why',
          }),
          articleSchema({
            path: '/about/why',
            title: `왜 ${CLINIC.name}인가 — 미루게 되는 이유와 그 답`,
            description: metadata.description as string,
            wordCount: charCount(
              CONCERNS.map((c) => c.quote + c.answer).join(''),
              WHY_US.map((g) => g.cards.map((k) => k.title + k.body).join('')).join(''),
            ),
            keywords: ['화정동 치과 추천', '고양시 덕양구 치과', '통합치의학과 전문의', '야간진료 치과'],
          }),
          faqSchema(faq, '/about/why'),
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          as="h1"
          eyebrow="왜 동그라미치과인가"
          title="미루게 되는 이유와, 그에 대한 답"
          desc={`치과를 미루는 이유는 대개 치료 자체가 아니라 망설임입니다. 자주 듣는 망설임 ${CONCERNS.length}가지와, 그에 답할 수 있는 근거 ${WHY_US_COUNT}가지를 함께 정리했습니다.`}
        />

        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/about/why" />
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <KeyPoints
            items={[
              `세 분 원장 모두 보건복지부 인정 통합치의학과 전문의입니다.`,
              `자주 듣는 망설임 ${CONCERNS.length}가지에 대해 각각 무엇을 어떻게 하는지 적었습니다.`,
              `근거 ${WHY_US_COUNT}가지를 의료진 · 진단·장비 · 내원 편의 세 갈래로 나눴습니다.`,
              `화·목은 오후 8시 30분까지, 토요일은 오후 2시까지 진료합니다.`,
            ]}
          />
          <TableOfContents
            items={['이런 마음으로 미뤄오셨다면', ...WHY_US.map((g) => g.label)]}
          />
        </div>
      </Container>

      {/* 망설임 — 원래 홈에 있던 섹션 그대로. 문구는 lib/concerns.ts 에서 온다. */}
      <ConcernsSection />

      {/* 근거 — 원래 홈에 있던 섹션 그대로. 문구는 lib/whyUs.ts 에서 온다. */}
      <WhyUsSection />

      <Container>
        <MedicalNotice />
      </Container>

      <ContactCta
        title="망설이는 이유를 그대로 말씀해 주셔도 됩니다"
        desc="무엇이 걸리는지 알아야 그 부분부터 설명드릴 수 있습니다."
      />
    </>
  );
}
