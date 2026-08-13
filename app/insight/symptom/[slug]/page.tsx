import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SYMPTOMS, symptomBySlug } from '@/lib/symptoms';
import { treatmentBySlug } from '@/lib/treatments';
import { CLINIC } from '@/lib/clinic';
import { Container, Breadcrumb, MedicalNotice, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema } from '@/lib/seo';

export function generateStaticParams() {
  return SYMPTOMS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = symptomBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    // 메타 설명에 즉답을 그대로 쓴다 — 검색 결과 스니펫이 곧 답이 되게 한다.
    description: s.answer.slice(0, 155),
    alternates: { canonical: `/insight/symptom/${s.slug}` },
    openGraph: { title: s.title, description: s.answer.slice(0, 155) },
  };
}

export default async function SymptomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = symptomBySlug(slug);
  if (!s) notFound();

  const trail = [
    { name: '홈', path: '/' },
    { name: '인사이트', path: '/insight' },
    { name: '증상으로 찾기', path: '/insight/symptom' },
    { name: s.short, path: `/insight/symptom/${s.slug}` },
  ];

  const treatments = s.relatedTreatments.map(treatmentBySlug).filter(Boolean);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: s.title,
            description: s.answer,
            path: `/insight/symptom/${s.slug}`,
            about: { type: 'MedicalCondition', name: s.short },
          }),
          faqSchema([{ q: s.title, a: s.answer }]),
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={trail} />
      </Container>

      <article>
        <Container className="py-10 lg:py-14">
          <p className="text-[12.5px] font-black tracking-[0.2em] text-gold-600 uppercase">증상</p>
          {/* 제목은 환자가 말하는 문장 그대로. 자연어 질의와 매칭되는 핵심 지점이다. */}
          <h1 className="mt-4 max-w-3xl text-[30px] font-black leading-[1.26] tracking-[-0.03em] text-ink sm:text-[40px]">
            {s.title}
          </h1>

          {/* 즉답 블록 — AI 가 인용하는 자리. 제목 바로 아래에서 답이 끝난다. */}
          <div className="mt-8 max-w-[64ch] rounded-2xl border-l-[3px] border-brand-500 bg-white p-6">
            <p className="text-[17px] leading-[1.85] text-ink">{s.answer}</p>
          </div>
        </Container>

        {/* 응급 신호를 원인보다 먼저 둔다 — 지금 병원에 가야 할 사람이 아래까지 안 읽고 나갈 수 있다. */}
        <section className="border-y border-gold-400/40 bg-gold-400/8 py-12">
          <Container>
            <h2 className="flex items-center gap-2.5 text-[19px] font-black text-ink">
              <span
                aria-hidden
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-[14px] font-black text-white"
              >
                !
              </span>
              이럴 때는 미루지 마세요
            </h2>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {s.urgent.map((u) => (
                <li key={u} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-soft">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  {u}
                </li>
              ))}
            </ul>
            <a
              href={CLINIC.phoneHref}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-6 py-3 text-[15.5px] font-black text-white transition-colors hover:bg-brand-600"
            >
              {CLINIC.phone} 로 전화
            </a>
          </Container>
        </section>

        <Container className="py-14">
          <h2 className="text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]">
            가능한 원인
          </h2>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
            아래는 이 증상에서 흔히 확인되는 원인들입니다. 증상만으로는 어느 쪽인지 특정할 수 없고,
            검사로 확인해야 치료가 정해집니다.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {s.causes.map((c) => (
              <div key={c.name} className="rounded-2xl border border-brand-100 bg-white p-6">
                <h3 className="text-[16.5px] font-black text-ink">{c.name}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">{c.detail}</p>
              </div>
            ))}
          </div>
        </Container>

        <section className="border-t border-brand-100 bg-white py-14">
          <Container>
            <h2 className="text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]">
              내원 전에 해볼 수 있는 것
            </h2>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
              증상을 덜어주는 방법이지 원인을 없애는 방법은 아닙니다. 나아진 것처럼 느껴져도 원인은
              그대로 남아 있습니다.
            </p>
            <ul className="mt-7 max-w-[68ch] space-y-3.5">
              {s.selfCare.map((c) => (
                <li key={c} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-soft">
                  <span
                    aria-hidden
                    className="mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-300 text-[11px] text-brand-600"
                  >
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {treatments.length > 0 && (
          <Container className="py-14">
            <h2 className="text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]">
              이어지는 치료
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {treatments.map((t) => (
                <Link
                  key={t!.slug}
                  href={`/treatment/${t!.slug}`}
                  className="group rounded-2xl border border-brand-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
                >
                  <h3 className="text-[17px] font-black text-ink group-hover:text-brand-700">
                    {t!.name}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{t!.summary}</p>
                </Link>
              ))}
            </div>
          </Container>
        )}

        <Container>
          <MedicalNotice />
        </Container>
      </article>

      <ContactCta />
    </>
  );
}
