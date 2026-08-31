import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TREATMENTS, treatmentBySlug } from '@/lib/treatments';
import { TREATMENT_PAGES } from '@/lib/treatmentPages';
import { symptomBySlug } from '@/lib/symptoms';
import { journeyForTreatment } from '@/lib/insight';
import { NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { Container, MedicalNotice, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { TreatmentLanding } from '@/components/TreatmentLanding';
import { ArticleMeta, References, charCount } from '@/components/article';
import { REFS_TREATMENT } from '@/lib/references';
import { ComparisonTable } from '@/components/ComparisonTable';
import { MISSING_TOOTH_OPTIONS, NATURAL_VS_IMPLANT } from '@/lib/comparisons';
import {
  breadcrumbSchema,
  medicalWebPageSchema,
  articleSchema,
  og,
  imageObjectSchema,
  withLocality,
} from '@/lib/seo';

/**
 * 진료과목 상세 — 랜딩 페이지.
 *
 * ★★ 2026-08-26 전면 교체 ★★
 *   전에는 글 위주 문서 템플릿이었다(h1 이 진료 이름 한 단어, 사진 없음). 임플란트를
 *   먼저 랜딩 페이지로 바꿨더니 나머지 여덟이 옛 모양으로 남아 한 사이트로 안 보였다.
 *   지금은 모양을 components/TreatmentLanding.tsx 하나가 갖고, 내용은
 *   lib/treatmentPages.ts 가 갖는다. 진료를 추가하려면 데이터만 쓰면 된다.
 *
 * ★ 내용은 **기존 홈페이지(circle-dental.co.kr) 각 진료 페이지 원문**이 바탕이다.
 *   원문에 있던 것은 전부 옮겼고, 원문이 얇은 자리만 표준 의학 지식으로 보완했다.
 *   무엇을 왜 고쳤는지는 lib/treatmentPages.ts 각 항목 주석에 있다.
 *
 * ⚠️ implant 는 여기서 제외된다 — app/treatment/implant/page.tsx 전용 페이지가 따로 있다.
 *    generateStaticParams 에 implant 를 되살리면 같은 경로를 두 곳에서 만들어 빌드가 깨진다.
 * ⚠️ TREATMENT_PAGES 에 데이터가 없는 slug 는 페이지 자체를 만들지 않는다. 데이터 없이
 *    껍데기만 렌더하면 '준비 중' 같은 빈 페이지가 색인된다.
 */

export function generateStaticParams() {
  /* ⚠️ 전용 페이지가 있는 slug 는 여기서 만들지 않는다 — 같은 경로를 두 곳에서 만들면 빌드가 깨진다. */
  const OWN = ['implant', 'cavity', 'crown-prosthesis', 'aesthetic', 'wisdom-tooth'];
  return TREATMENTS.filter((t) => !OWN.includes(t.slug) && TREATMENT_PAGES[t.slug]).map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  const page = TREATMENT_PAGES[slug];
  if (!t || !page) return {};
  return {
    title: t.name,
    description: page.lead.slice(0, 155),
    alternates: { canonical: `/treatment/${t.slug}` },
    openGraph: og({
      title: withLocality(t.name),
      description: page.lead.slice(0, 155),
      path: `/treatment/${t.slug}`,
    }),
  };
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  const page = TREATMENT_PAGES[slug];
  if (!t || !page) notFound();

  const journey = journeyForTreatment(t.slug);
  const related = t.relatedSymptoms
    .map(symptomBySlug)
    .filter(Boolean)
    .map((s) => ({ slug: s!.slug, title: s!.title }));

  const TPATH = `/treatment/${t.slug}`;
  const trail = [
    { name: '홈', path: '/' },
    { name: '진료과목', path: '/treatment' },
    { name: t.short, path: TPATH },
  ];

  /** 대표 이미지 — 실제 진료 사진이 있으므로 제목 카드 대신 그것을 쓴다. */
  const docImage = { src: page.hero.src, caption: page.hero.alt, width: 1200, height: 900 };

  /* 이 진료에만 붙는 비교표. 어느 것을 붙일지는 진료마다 다르다. */
  const comparison =
    t.slug === 'crown-prosthesis' ? MISSING_TOOTH_OPTIONS
    : t.slug === 'save-natural-tooth' ? NATURAL_VS_IMPLANT
    : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: withLocality(t.name),
            description: page.lead,
            path: TPATH,
            about: { type: 'MedicalProcedure', name: t.name },
            image: docImage,
          }),
          imageObjectSchema({ path: TPATH, ...docImage }),
          articleSchema({
            path: TPATH,
            title: t.name,
            description: page.lead,
            wordCount: charCount(page.lead, t.qa.map((q) => q.q + q.a).join('')),
            keywords: [t.name, ...t.whoFor],
            hasImage: true,
          }),
        ]}
      />

      <TreatmentLanding t={t} page={page} journey={journey} related={related} trail={trail}>
        {comparison ? (
          <section className="py-24 lg:py-32">
            <Container>
              <ComparisonTable data={comparison} />
            </Container>
          </section>
        ) : null}
      </TreatmentLanding>

      <Container className="pb-12">
        <div className="max-w-[46em]">
          <ArticleMeta path={TPATH} />
        </div>
        <References items={REFS_TREATMENT} />
        <MedicalNotice extra={NO_GUARANTEE_NOTE} />
      </Container>

      <ContactCta
        title={`${t.name}, 지금 상태부터 확인해 보세요`}
        desc="같은 이름의 치료라도 상태에 따라 방법과 기간이 달라집니다. 검사로 확인한 뒤에 무엇이 필요한지 말씀드립니다."
      />
    </>
  );
}
