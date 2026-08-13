import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JOURNEYS, journeyBySlug } from '@/lib/insight';
import { treatmentBySlug } from '@/lib/treatments';
import { NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { Container, Breadcrumb, MedicalNotice, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, abs } from '@/lib/seo';

/**
 * 치료 여정 상세.
 *
 * ★ 왜 한 페이지에 몰지 않고 나누는가
 *   "임플란트 몇 번 가나요" 와 "신경치료 몇 번 가나요" 는 서로 다른 질의다.
 *   한 페이지에 모아 두면 어느 쪽으로 검색해도 같은 URL 이 나오고, 그 문서에서
 *   내 질문에 해당하는 부분을 찾아야 한다. 나누면 각 질의가 자기 답만 있는 문서로 간다.
 * ★ HowTo 스키마를 쓴다 — 회차·순서가 있는 절차를 기계가 읽을 수 있는 형태로 준다.
 */
export function generateStaticParams() {
  return JOURNEYS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const j = journeyBySlug(slug);
  if (!j) return {};
  return {
    title: j.question,
    description: j.answer.slice(0, 155),
    alternates: { canonical: `/insight/journey/${j.slug}` },
    openGraph: { title: j.question, description: j.answer.slice(0, 155) },
  };
}

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const j = journeyBySlug(slug);
  if (!j) notFound();

  const trail = [
    { name: '홈', path: '/' },
    { name: '인사이트', path: '/insight' },
    { name: '치료 여정', path: '/insight/journey' },
    { name: j.treatment, path: `/insight/journey/${j.slug}` },
  ];

  const treatment = treatmentBySlug(j.slug);

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: j.question,
    description: j.answer,
    url: abs(`/insight/journey/${j.slug}`),
    totalTime: j.duration,
    step: j.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.label,
      text: s.what,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: j.question,
            description: j.answer,
            path: `/insight/journey/${j.slug}`,
            about: { type: 'MedicalProcedure', name: j.treatment },
          }),
          howTo,
          faqSchema([{ q: j.question, a: j.answer }]),
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={trail} />
      </Container>

      <article>
        <Container className="py-10 lg:py-14">
          <p className="text-[12.5px] font-black tracking-[0.2em] text-brand-500 uppercase">
            치료 여정
          </p>
          <h1 className="display mt-4 max-w-3xl text-[30px] text-ink sm:text-[42px]">{j.question}</h1>

          <div className="mt-8 max-w-[64ch] rounded-2xl border-l-[3px] border-brand-500 bg-white p-6 shadow-[var(--shadow-soft)]">
            <p className="text-[17px] leading-[1.85] text-ink">{j.answer}</p>
          </div>

          <dl className="mt-9 grid max-w-2xl gap-px overflow-hidden rounded-xl border border-brand-200/70 bg-brand-200/70 sm:grid-cols-2">
            <div className="bg-white px-6 py-5">
              <dt className="text-[11.5px] font-black tracking-[0.16em] text-brand-500 uppercase">
                내원 횟수
              </dt>
              <dd className="mt-2 text-[19px] font-black text-ink">{j.visits}</dd>
            </div>
            <div className="bg-white px-6 py-5">
              <dt className="text-[11.5px] font-black tracking-[0.16em] text-brand-500 uppercase">
                전체 기간
              </dt>
              <dd className="mt-2 text-[19px] font-black text-ink">{j.duration}</dd>
            </div>
          </dl>
        </Container>

        <section className="border-y border-brand-200/60 bg-white py-14">
          <Container>
            <h2 className="display-sm text-[24px] text-ink sm:text-[28px]">회차별로 하는 일</h2>
            <ol className="relative mt-10 space-y-0 border-l-2 border-brand-200 pl-8">
              {j.steps.map((st, i) => (
                <li key={st.label} className="relative pb-8 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[41px] top-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-brand-300 bg-white text-[12px] font-black text-brand-600"
                  >
                    {i + 1}
                  </span>
                  <h3 className="text-[17px] font-black text-ink">{st.label}</h3>
                  <p className="mt-2 max-w-[64ch] text-[15px] leading-relaxed text-ink-soft">
                    {st.what}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <Container className="py-14">
          <h2 className="display-sm text-[22px] text-ink">이럴 때 더 걸립니다</h2>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
            위 회차는 일반적인 경우입니다. 아래에 해당하면 단계가 추가되거나 기다리는 기간이 늘어납니다.
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {j.variables.map((v) => (
              <li
                key={v}
                className="flex gap-3 rounded-xl border border-brand-100 bg-white px-5 py-4 text-[14.5px] leading-relaxed text-ink-soft"
              >
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                {v}
              </li>
            ))}
          </ul>

          {treatment && (
            <Link
              href={`/treatment/${treatment.slug}`}
              className="mt-9 inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 px-7 py-3.5 text-[15.5px] font-black text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-1"
            >
              {treatment.name} 진료 안내 <span aria-hidden>→</span>
            </Link>
          )}

          <MedicalNotice extra={NO_GUARANTEE_NOTE} />
        </Container>
      </article>

      <ContactCta
        title="계획을 먼저 알면 일정을 짤 수 있습니다"
        desc="검사 후에는 몇 번에 걸쳐 어떤 순서로 진행할지 먼저 말씀드립니다."
      />
    </>
  );
}
