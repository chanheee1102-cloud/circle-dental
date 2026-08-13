import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CONDITIONS, conditionBySlug } from '@/lib/conditions';
import { symptomBySlug } from '@/lib/symptoms';
import { treatmentBySlug } from '@/lib/treatments';
import { Container, Breadcrumb, MedicalNotice, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, abs } from '@/lib/seo';

export function generateStaticParams() {
  return CONDITIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = conditionBySlug(slug);
  if (!c) return {};
  return {
    // 별칭을 제목에 넣는다 — '치주염' 보다 '풍치' 로 검색하는 사람이 많다.
    title: `${c.name} (${c.aka[0]})`,
    description: c.definition,
    keywords: [c.name, ...c.aka],
    alternates: { canonical: `/insight/condition/${c.slug}` },
    openGraph: { title: `${c.name} — ${c.aka[0]}`, description: c.definition },
  };
}

export default async function ConditionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = conditionBySlug(slug);
  if (!c) notFound();

  const trail = [
    { name: '홈', path: '/' },
    { name: '인사이트', path: '/insight' },
    { name: '질환 사전', path: '/insight/condition' },
    { name: c.name, path: `/insight/condition/${c.slug}` },
  ];

  const symptoms = c.relatedSymptoms.map(symptomBySlug).filter(Boolean);
  const treatments = c.relatedTreatments.map(treatmentBySlug).filter(Boolean);

  /**
   * MedicalCondition 스키마 — 질환 페이지의 핵심이다.
   * name/alternateName 을 함께 주면 '풍치' 같은 구어 질의도 이 문서로 연결된다.
   */
  const conditionSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: c.name,
    alternateName: c.aka,
    description: c.definition,
    url: abs(`/insight/condition/${c.slug}`),
    signOrSymptom: c.signs.map((s) => ({ '@type': 'MedicalSignOrSymptom', name: s })),
    riskFactor: c.causes.map((s) => ({ '@type': 'MedicalRiskFactor', name: s })),
    possibleTreatment: treatments.map((t) => ({ '@type': 'MedicalProcedure', name: t!.name })),
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: `${c.name} (${c.aka[0]})`,
            description: c.definition,
            path: `/insight/condition/${c.slug}`,
            about: { type: 'MedicalCondition', name: c.name },
          }),
          conditionSchema,
          faqSchema([{ q: `${c.name}이란 무엇인가요?`, a: c.definition }, ...c.faq]),
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={trail} />
      </Container>

      <article>
        <Container className="py-10 lg:py-14">
          <p className="text-[12.5px] font-black tracking-[0.2em] text-brand-500 uppercase">질환</p>
          <h1 className="display mt-4 text-[32px] text-ink sm:text-[46px]">{c.name}</h1>
          <p className="mt-3 text-[15.5px] font-semibold text-ink-muted">{c.aka.join(' · ')}</p>

          {/* 정의 블록 — AI 가 인용하는 자리. 한 문장으로 끝난다. */}
          <div className="mt-8 max-w-[64ch] rounded-2xl border-l-[3px] border-brand-500 bg-white p-6 shadow-[var(--shadow-soft)]">
            <p className="text-[17.5px] leading-[1.85] text-ink">{c.definition}</p>
          </div>

          <p className="mt-7 max-w-[66ch] text-[16px] leading-[1.85] text-ink-soft">{c.detail}</p>
        </Container>

        {/* 증상 · 원인 */}
        <section className="border-y border-brand-200/60 bg-white py-14">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="display-sm text-[22px] text-ink">이런 증상이 나타납니다</h2>
                <ul className="mt-6 space-y-3">
                  {c.signs.map((s) => (
                    <li key={s} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-soft">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400"
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="display-sm text-[22px] text-ink">원인과 위험 요인</h2>
                <ul className="mt-6 space-y-3">
                  {c.causes.map((s) => (
                    <li key={s} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-soft">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* 진행 단계 — '언제 가야 하나'를 스스로 가늠하게 해 준다. */}
        <Container className="py-14">
          <h2 className="display-sm text-[24px] text-ink sm:text-[28px]">방치하면 이렇게 진행합니다</h2>
          <ol className="relative mt-10 space-y-0 border-l-2 border-brand-200 pl-8">
            {c.stages.map((st, i) => (
              <li key={st.step} className="relative pb-8 last:pb-0">
                <span
                  aria-hidden
                  className="absolute -left-[41px] top-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-brand-300 bg-cream text-[12px] font-black text-brand-600"
                >
                  {i + 1}
                </span>
                <h3 className="text-[17px] font-black text-ink">{st.step}</h3>
                <p className="mt-2 max-w-[64ch] text-[15px] leading-relaxed text-ink-soft">{st.what}</p>
              </li>
            ))}
          </ol>
        </Container>

        {/* 치료 · 예방 */}
        <section className="border-y border-brand-200/60 bg-brand-50/40 py-14">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="display-sm text-[22px] text-ink">일반적인 치료 방향</h2>
                <p className="mt-5 max-w-[62ch] text-[15.5px] leading-[1.85] text-ink-soft">
                  {c.treatment}
                </p>
              </div>
              <div>
                <h2 className="display-sm text-[22px] text-ink">예방과 관리</h2>
                <ul className="mt-5 space-y-3">
                  {c.prevention.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-400 text-[11px] text-brand-600"
                      >
                        ✓
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <Container className="py-14">
          <h2 className="display-sm text-[24px] text-ink sm:text-[28px]">자주 묻는 질문</h2>
          <div className="mt-8 divide-y divide-brand-100 border-t border-brand-100">
            {c.faq.map((f) => (
              <article key={f.q} className="py-6">
                <h3 className="text-[18px] font-black leading-snug text-ink">{f.q}</h3>
                <p className="mt-3 max-w-[68ch] text-[15.5px] leading-[1.85] text-ink-soft">{f.a}</p>
              </article>
            ))}
          </div>
        </Container>

        {/* 연결 */}
        {(symptoms.length > 0 || treatments.length > 0) && (
          <section className="border-t border-brand-200/60 bg-white py-14">
            <Container>
              <div className="grid gap-10 lg:grid-cols-2">
                {symptoms.length > 0 && (
                  <div>
                    <h2 className="text-[19px] font-black text-ink">관련 증상</h2>
                    <div className="mt-5 space-y-2.5">
                      {symptoms.map((s) => (
                        <Link
                          key={s!.slug}
                          href={`/insight/symptom/${s!.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-brand-100 px-5 py-3.5 transition-colors hover:border-brand-300 hover:bg-brand-50"
                        >
                          <span className="text-[14.5px] font-bold text-ink group-hover:text-brand-700">
                            {s!.title}
                          </span>
                          <span aria-hidden className="text-brand-500">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {treatments.length > 0 && (
                  <div>
                    <h2 className="text-[19px] font-black text-ink">관련 진료</h2>
                    <div className="mt-5 space-y-2.5">
                      {treatments.map((t) => (
                        <Link
                          key={t!.slug}
                          href={`/treatment/${t!.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-brand-100 px-5 py-3.5 transition-colors hover:border-brand-300 hover:bg-brand-50"
                        >
                          <span className="text-[14.5px] font-bold text-ink group-hover:text-brand-700">
                            {t!.name}
                          </span>
                          <span aria-hidden className="text-brand-500">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Container>
          </section>
        )}

        <Container>
          <MedicalNotice />
        </Container>
      </article>

      <ContactCta />
    </>
  );
}
