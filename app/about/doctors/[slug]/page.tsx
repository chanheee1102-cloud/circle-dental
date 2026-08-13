import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DOCTORS, doctorBySlug, PUBLICATION_DETAIL } from '@/lib/doctors';
import { CLINIC } from '@/lib/clinic';
import { Container, Breadcrumb, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, abs, medicalWebPageSchema } from '@/lib/seo';

export function generateStaticParams() {
  return DOCTORS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = doctorBySlug(slug);
  if (!d) return {};
  const desc = `${CLINIC.name} ${d.role} ${d.name}. ${d.career.slice(0, 3).join(' · ')}.`;
  return {
    title: `${d.name} ${d.role}`,
    description: desc,
    keywords: [d.name, `${d.name} 원장`, `화정동 치과 ${d.name}`],
    alternates: { canonical: `/about/doctors/${d.slug}` },
    openGraph: { title: `${d.name} ${d.role} | ${CLINIC.name}`, description: desc, images: [{ url: d.photo }] },
  };
}

/**
 * 원장별 상세.
 *
 * ★ 사람 이름은 그 자체로 검색 질의다("변석호 원장", "김인진 치과").
 *   한 페이지에 세 명을 묶어 두면 그 질의에 대해 어느 부분이 답인지 기계가 못 고른다.
 * ★ 경력은 lib/doctors.ts 에서만 온다 — 이 파일에서 문장을 만들지 않는다.
 *   여기서 한 줄이라도 지어내면 그게 곧 의료법 제56조 위반이다.
 */
export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = doctorBySlug(slug);
  if (!d) notFound();

  const trail = [
    { name: '홈', path: '/' },
    { name: '병원 소개', path: '/about' },
    { name: '의료진', path: '/about/doctors' },
    { name: `${d.name} ${d.role}`, path: `/about/doctors/${d.slug}` },
  ];

  const others = DOCTORS.filter((o) => o.slug !== d.slug);
  /** 논문 저자 목록에 이 원장이 포함되는지 — 변석호(SH Byun)만 해당한다. */
  const hasPublication = d.slug === 'byun-seokho';

  const physician = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${CLINIC.url}/about/doctors/${d.slug}#physician`,
    name: `${d.name} ${d.role}`,
    givenName: d.name,
    jobTitle: `치과의사 · ${d.role}`,
    medicalSpecialty: 'Dentistry',
    url: abs(`/about/doctors/${d.slug}`),
    image: abs(d.photo),
    worksFor: { '@id': `${CLINIC.url}/#clinic` },
    knowsAbout: d.focus,
    alumniOf: d.career
      .filter((c) => /대학|대학원|UCLA|Upenn/.test(c))
      .map((c) => ({ '@type': 'EducationalOrganization', name: c })),
    memberOf: d.societies.map((s) => ({ '@type': 'Organization', name: s })),
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: `${d.name} ${d.role}`,
            description: `${CLINIC.name} ${d.role} ${d.name}`,
            path: `/about/doctors/${d.slug}`,
          }),
          physician,
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={trail} />
      </Container>

      <article>
        <Container className="py-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
            {/* 원본 비율(625×670) 그대로 — 임의 비율로 강제하면 인물이 잘리거나 여백이 생긴다. */}
            <div className="relative aspect-[625/670] overflow-hidden rounded-2xl bg-brand-100 shadow-[var(--shadow-lift)]">
              <Image
                src={d.photo}
                alt={`${CLINIC.name} ${d.role} ${d.name}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-[13px] font-black tracking-[0.16em] text-brand-500">
                동그라미치과 {d.role}
              </p>
              <h1 className="display mt-3 text-[38px] tracking-[0.06em] text-ink sm:text-[48px]">
                {d.name}
              </h1>

              <div className="mt-6 flex flex-wrap gap-2">
                {d.focus.map((f) => (
                  <span
                    key={f}
                    className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-[13.5px] font-bold text-brand-700"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <h2 className="display-sm mt-10 text-[18px] text-ink">학력 · 경력</h2>
              <ul className="mt-4 space-y-2.5">
                {d.career.map((c) => (
                  <li key={c} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-soft">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {c}
                  </li>
                ))}
              </ul>

              {d.societies.length > 0 && (
                <>
                  <h2 className="display-sm mt-9 text-[18px] text-ink">학회 활동</h2>
                  <ul className="mt-4 space-y-2.5">
                    {d.societies.map((s) => (
                      <li key={s} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-soft">
                        <span
                          aria-hidden
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] text-white"
                        >
                          ✓
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </Container>

        {hasPublication && (
          <section className="border-y border-brand-200/60 bg-white py-14">
            <Container>
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="text-[12.5px] font-black tracking-[0.16em] text-brand-500 uppercase">
                    발표 논문
                  </p>
                  <h2 className="display-sm mt-4 text-[20px] leading-snug text-ink">
                    {PUBLICATION_DETAIL.title}
                  </h2>
                  <p className="mt-4 text-[14px] text-ink-muted">{PUBLICATION_DETAIL.authors}</p>
                  <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.85] text-ink-soft">
                    {PUBLICATION_DETAIL.relevanceKo}
                  </p>
                </div>
                {/*
                  ★ 논문 이미지는 노트북과 본문이 **아래쪽**에 있다(768×800).
                    비율도 원본에 가깝게 잡아 논문 제목·저자·초록이 잘리지 않게 한다.
                */}
                <div className="relative aspect-[768/800] overflow-hidden rounded-2xl bg-brand-100 shadow-[var(--shadow-soft)]">
                  <Image
                    src={PUBLICATION_DETAIL.image}
                    alt="발표 논문 화면 — Long-term Follow-up of Complicated Crown Fracture With Fragment Reattachment"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-bottom"
                  />
                </div>
              </div>
            </Container>
          </section>
        )}

        <section className="bg-brand-50/40 py-14">
          <Container>
            <h2 className="text-[20px] font-black text-ink">다른 의료진</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/about/doctors/${o.slug}`}
                  className="group flex items-center gap-5 rounded-2xl border border-brand-200/70 bg-white p-5 transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-100">
                    <Image src={o.photo} alt="" fill sizes="80px" className="object-cover object-top" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black tracking-wide text-brand-500">{o.role}</p>
                    <p className="mt-1 text-[18px] font-black tracking-[0.05em] text-ink group-hover:text-brand-700">
                      {o.name}
                    </p>
                    <p className="mt-1 text-[13px] text-ink-muted">{o.focus.slice(0, 2).join(' · ')}</p>
                  </div>
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
