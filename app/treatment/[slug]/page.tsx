import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TREATMENTS, treatmentBySlug } from '@/lib/treatments';
import { symptomBySlug } from '@/lib/symptoms';
import { IMPLANT_TOPICS } from '@/lib/implantTopics';
import { NO_GUARANTEE_NOTE } from '@/lib/clinic';
import {
  Container,
  Breadcrumb,
  QABlock,
  MedicalNotice,
  ContactCta,
  Prose,
} from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema } from '@/lib/seo';

/**
 * 진료과목 상세.
 *
 * ★ 전부 정적 생성한다(generateStaticParams). 크롤러가 자바스크립트 실행 없이
 *   완성된 HTML 을 읽어야 AEO 가 성립한다. 서버 렌더가 아니라 빌드 시점 생성이 안전하다.
 * ★ FAQPage 스키마를 함께 넣는다 — 이 페이지의 Q&A 가 AI 답변에 인용되는 통로다.
 */
export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  if (!t) return {};
  return {
    title: t.name,
    description: t.summary,
    alternates: { canonical: `/treatment/${t.slug}` },
    openGraph: { title: `${t.name} | 동그라미치과`, description: t.summary },
  };
}

export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  if (!t) notFound();

  const trail = [
    { name: '홈', path: '/' },
    { name: '진료과목', path: '/treatment' },
    { name: t.name, path: `/treatment/${t.slug}` },
  ];

  const related = t.relatedSymptoms.map(symptomBySlug).filter(Boolean);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: t.name,
            description: t.summary,
            path: `/treatment/${t.slug}`,
            about: { type: 'MedicalProcedure', name: t.name },
          }),
          faqSchema(t.qa),
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={trail} />
      </Container>

      <article>
        <Container className="py-10 lg:py-14">
          <p className="text-[12.5px] font-black tracking-[0.2em] text-gold-600 uppercase">진료과목</p>
          <h1 className="mt-4 max-w-3xl text-[32px] font-black leading-[1.24] tracking-[-0.03em] text-ink sm:text-[42px]">
            {t.name}
          </h1>
          {/* 요약을 제목 바로 아래 둔다 — AI 가 문서 주제를 파악하는 첫 단락이다. */}
          <p className="mt-6 max-w-[62ch] text-[17.5px] leading-[1.8] text-ink-soft">{t.summary}</p>

          <div className="mt-9 flex flex-wrap gap-2">
            {t.whoFor.map((w) => (
              <span
                key={w}
                className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-[13.5px] font-semibold text-brand-700"
              >
                {w}
              </span>
            ))}
          </div>
        </Container>

        <section className="border-y border-brand-100 bg-white py-14">
          <Container>
            <Prose>
              <p>{t.intro}</p>
            </Prose>
          </Container>
        </section>

        <Container className="py-14 lg:py-16">
          <h2 className="sr-only">{t.name}에 대해 자주 묻는 질문</h2>
          <QABlock items={t.qa} />
        </Container>

        {/* 임플란트만 세부 주제를 따로 둔다 — 질의가 가장 잘게 갈라지는 영역이라(뼈이식·상악동·보험 등)
            개요 페이지 하나로는 그 검색을 잡지 못한다. */}
        {t.slug === 'implant' && (
          <section className="border-t border-brand-200/60 bg-brand-50/40 py-14">
            <Container>
              <h2 className="display-sm text-[22px] text-ink sm:text-[26px]">임플란트, 더 자세히</h2>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
                뼈가 부족할 때, 위턱 어금니일 때, 65세 이상 보험을 쓸 때처럼 상황마다 달라지는 부분을
                따로 정리했습니다.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {IMPLANT_TOPICS.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/treatment/implant/${o.slug}`}
                    className="group rounded-2xl border border-brand-200/70 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
                  >
                    <span className="block text-[16.5px] font-black text-ink group-hover:text-brand-700">
                      {o.name}
                    </span>
                    <span className="mt-1.5 block text-[13.5px] text-ink-muted">{o.tagline}</span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}

        {related.length > 0 && (
          <section className="border-t border-brand-100 bg-white py-14">
            <Container>
              <h2 className="text-[20px] font-black text-ink">이런 증상이라면 함께 보세요</h2>
              <p className="mt-2 text-[15px] text-ink-soft">
                아래 증상은 {t.name}으로 이어지는 경우가 있습니다.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((s) => (
                  <Link
                    key={s!.slug}
                    href={`/insight/symptom/${s!.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-brand-100 px-5 py-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    <span className="text-[15px] font-bold text-ink group-hover:text-brand-700">
                      {s!.title}
                    </span>
                    <span aria-hidden className="text-brand-500">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}

        <Container>
          <MedicalNotice extra={NO_GUARANTEE_NOTE} />
        </Container>
      </article>

      <ContactCta />
    </>
  );
}
