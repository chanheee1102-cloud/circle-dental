import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SPECIALS, specialBySlug } from '@/lib/specials';
import { CLINIC } from '@/lib/clinic';
import { Container, Breadcrumb, MedicalNotice, ContactCta } from '@/components/ui';
import { StrengthIcon } from '@/components/StrengthIcons';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema } from '@/lib/seo';

export function generateStaticParams() {
  return SPECIALS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = specialBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.body,
    alternates: { canonical: `/about/special/${s.slug}` },
    openGraph: {
      title: `${s.title} | ${CLINIC.name}`,
      description: s.body,
      images: [{ url: s.image }],
    },
  };
}

/**
 * 특별함 상세.
 *
 * ★ 사진을 크게 쓰는 자리다. 기존 홈페이지에서는 슬라이드라 넘겨야 보였고
 *   각각의 URL 도 없었다. 페이지로 열면 색인되고, 사진도 잘리지 않는다.
 * ★ 원문(title·body)과 일반 지식 확장(context·faq)을 화면에서도 구분해 배치한다 —
 *   위쪽은 병원이 하는 약속, 아래쪽은 그 용어가 무엇인지에 대한 설명이다.
 */
export default async function SpecialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = specialBySlug(slug);
  if (!s) notFound();

  const trail = [
    { name: '홈', path: '/' },
    { name: '병원 소개', path: '/about' },
    { name: s.title, path: `/about/special/${s.slug}` },
  ];

  const others = SPECIALS.filter((o) => o.slug !== s.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({ title: s.title, description: s.body, path: `/about/special/${s.slug}` }),
          faqSchema(s.faq),
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={trail} />
      </Container>

      <article>
        {/* 히어로 — 사진을 크게 */}
        <Container className="py-10 lg:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[var(--shadow-btn)]"
                >
                  <StrengthIcon name={s.key} />
                </span>
                <div>
                  <p className="text-[11.5px] font-black tracking-[0.16em] text-brand-500">
                    {s.eyebrow}
                  </p>
                  <p className="text-[26px] font-black leading-none text-brand-200">{s.no}</p>
                </div>
              </div>

              <h1 className="display mt-7 text-[30px] text-ink sm:text-[42px]">{s.title}</h1>

              {/* 원문 그대로 — AI 인용 대상 */}
              <p className="mt-7 max-w-[58ch] text-[17px] leading-[1.9] text-ink-soft">{s.body}</p>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-[var(--shadow-lift)] lg:aspect-[16/11]">
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>

        {/* 용어 풀이 — 일반적인 치과 지식 */}
        <section className="border-y border-brand-200/60 bg-white py-16">
          <Container>
            <p className="text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
              알아 두면 좋은 것
            </p>
            <div className="mt-8 divide-y divide-brand-100">
              {s.context.map((c) => (
                <div key={c.h} className="py-7 first:pt-0 last:pb-0">
                  <h2 className="display-sm text-[19px] text-ink sm:text-[21px]">{c.h}</h2>
                  <p className="mt-3.5 max-w-[70ch] text-[16px] leading-[1.85] text-ink-soft">{c.p}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <Container className="py-14">
          <h2 className="display-sm text-[24px] text-ink sm:text-[28px]">자주 묻는 질문</h2>
          <div className="mt-8 divide-y divide-brand-100 border-t border-brand-100">
            {s.faq.map((f) => (
              <article key={f.q} className="py-6">
                <h3 className="text-[18px] font-black leading-snug text-ink">{f.q}</h3>
                <p className="mt-3 max-w-[68ch] text-[15.5px] leading-[1.85] text-ink-soft">{f.a}</p>
              </article>
            ))}
          </div>
          <MedicalNotice />
        </Container>

        {/* 다른 특별함 */}
        <section className="border-t border-brand-200/60 bg-brand-50/40 py-14">
          <Container>
            <h2 className="text-[20px] font-black text-ink">동그라미 치과만의 특별함</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/about/special/${o.slug}`}
                  className="group overflow-hidden rounded-2xl border border-brand-200/70 bg-white transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={o.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="px-5 py-4 text-[14.5px] font-black text-ink group-hover:text-brand-700">
                    {o.title}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </article>

      <ContactCta />
    </>
  );
}
