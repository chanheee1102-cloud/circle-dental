import type { Metadata } from 'next';
import { CLINIC } from '@/lib/clinic';
import { TRUST_STATS, CREDENTIAL_ROWS, MEDIA_APPEARANCES } from '@/lib/trustSignals';
import { Container, ContactCta, MedicalNotice, PageHero } from '@/components/ui';
import { TrustSection } from '@/components/TrustSection';
import { ArticleMeta, charCount } from '@/components/article';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, medicalWebPageSchema, articleSchema, og } from '@/lib/seo';

/**
 * 무엇을 근거로 믿을 수 있나요 — 자격·인증·논문·언론.
 *
 * ★★ 왜 홈에서 여기로 옮겼나 (2026-08-14 운영자) ★★
 *   홈에 숫자 여섯 + 인증표 다섯 줄 + 논문 + 방송 + 진료시간을 한 화면에 몰아넣으니
 *   **아무것도 눈에 안 들어왔다.** 표와 문답이 좌우로 붙어 있어 어디부터 읽어야 할지
 *   모르는 화면이 됐다(운영자: "가시성 가독성 떨어진다").
 *
 *   근거 자료는 **찾아온 사람에게 충분히** 보여 주는 것이 맞다. 홈은 "그런 근거가 있다" 만
 *   알리고, 실제 표와 목록은 이 페이지가 맡는다.
 *   전용 URL 이 생기는 부수 효과도 크다 — "이 병원 믿을 만해?" 라는 질의에
 *   홈이 아니라 **이 주소를 콕 집어** 인용할 수 있다.
 *
 * ⚠️ 여기에 환자 후기·별점을 넣지 말 것 — 의료법 제56조 제2항이 치료경험담 광고를
 *    금지한다. 구조화 데이터의 aggregateRating / review 도 같은 이유로 금지다.
 */
export const metadata: Metadata = {
  title: '무엇을 근거로 믿을 수 있나요',
  description: `${CLINIC.name}의 자격과 인증, 학술지 발표 논문, 방송 기록을 한자리에 정리했습니다. 보건복지부 인정 통합치의학과 전문의 ${TRUST_STATS[0].value}, 인증·수료 ${CREDENTIAL_ROWS.length - 1}건, 발급처를 함께 적었습니다.`,
  alternates: { canonical: '/about/trust' },
  openGraph: og({
    title: `무엇을 근거로 믿을 수 있나요 | ${CLINIC.name}`,
    description: '제3자가 준 자격과 인증, 학술지에 실린 논문, 방송에 나간 기록.',
    path: '/about/trust',
  }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '병원 소개', path: '/about' },
  { name: '근거', path: '/about/trust' },
];

export default function TrustPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: `무엇을 근거로 믿을 수 있나요 — ${CLINIC.name}`,
            description: metadata.description as string,
            path: '/about/trust',
          }),
          articleSchema({
            path: '/about/trust',
            title: `${CLINIC.name} — 자격 · 인증 · 논문 · 언론`,
            description: metadata.description as string,
            wordCount: charCount(
              CREDENTIAL_ROWS.map((c) => c.name + c.issuer).join(''),
              MEDIA_APPEARANCES.map((m) => m.outlet + m.program + m.what).join(''),
            ),
            keywords: ['통합치의학과 전문의', '치과 인증', '화정동 치과', '대한치과보존학회'],
          }),
        ]}
      />

      <PageHero
        trail={TRAIL}
        photo="consult"
        eyebrow="근거"
        title="무엇을 근거로 믿을 수 있나요?"
        desc="병원이 스스로 좋다고 말하는 것은 근거가 아닙니다. 제3자가 준 자격과 인증, 학술지에 실린 논문, 방송에 나간 기록이 근거입니다."
      />

      <Container className="py-12 lg:py-16">

        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/about/trust" />
        </div>
      </Container>

      {/*
        내용은 홈에 있던 것 그대로다 — 옮긴 것이지 새로 쓴 것이 아니다.
        컴포넌트를 그대로 재사용하므로 숫자·표가 두 곳에서 어긋날 일이 없다.
      */}
      <TrustSection headless />

      <Container>
        <MedicalNotice />
      </Container>

      <ContactCta
        title="자료는 내원하시면 실물로 보실 수 있습니다"
        desc="인증패와 논문은 진료실에 걸려 있습니다."
      />
    </>
  );
}
