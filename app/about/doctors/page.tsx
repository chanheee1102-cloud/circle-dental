import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CLINIC, CREDENTIALS } from '@/lib/clinic';
import { DOCTORS, PUBLICATION_DETAIL } from '@/lib/doctors';
import { IMG } from '@/lib/assets';
import { Container, SectionHead, Breadcrumb, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, abs, medicalWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '의료진 소개',
  description:
    '동그라미치과의원 의료진 3인. 대표원장 변석호(경희대 치의학전문대학원 외래교수·치의학박사), 김동주 원장, 김인진 원장. 모두 보건복지부 인정 통합치의학과 전문의입니다.',
  alternates: { canonical: '/about/doctors' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '병원 소개', path: '/about' },
  { name: '의료진', path: '/about/doctors' },
];

/**
 * 의료진 목록.
 *
 * ★ 세 분의 경력은 기존 홈페이지 /doctor 원문 그대로다(lib/doctors.ts).
 *   추측한 항목은 하나도 없다 — 의료인 경력 허위 표시는 의료법 제56조 위반이다.
 * ★ 원장마다 Physician 스키마를 따로 낸다. 지식패널이 인식하는 단위가 '사람'이라
 *   한 페이지에 세 명을 묶어 하나로 내면 누구의 경력인지 기계가 구분하지 못한다.
 */
export default function DoctorsPage() {
  const physicians = DOCTORS.map((d) => ({
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
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: '의료진 소개',
            description: metadata.description as string,
            path: '/about/doctors',
          }),
          ...physicians,
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          eyebrow="의료진 소개"
          title={
            <>
              대학병원 교수출신
              <br />
              대표원장님과 의료진
            </>
          }
          desc="손끝의 숙련도에 따라 결과가 달라지는 치과 진료, 10년 이상 경력의 교수출신 대표원장님과 보건복지부 인정 전문의들로만 구성된 의료진이 한차원 높은 의료서비스를 제공합니다."
        />

        {/* 원장 3인 */}
        <div className="mt-14 space-y-6">
          {DOCTORS.map((d, i) => (
            <article
              key={d.slug}
              className="overflow-hidden rounded-2xl border border-brand-200/70 bg-white shadow-[var(--shadow-soft)]"
            >
              <div className="grid gap-0 md:grid-cols-[minmax(0,340px)_1fr]">
                {/*
                  ★ 모바일에서는 원본 비율(625×670)을 그대로 써서 잘림이 없게 하고,
                    md 이상에서는 aspect 를 풀어 **카드 높이만큼 늘어나게** 한다.
                    비율을 고정해 두면 오른쪽 경력 목록이 더 길 때 사진 아래에 빈 띠가 남는다.
                    (grid 기본 align-items:stretch 가 높이를 맞춰 준다.)
                */}
                <div className="relative aspect-[625/670] bg-brand-100 md:aspect-auto md:min-h-[440px]">
                  <Image
                    src={d.photo}
                    alt={`${CLINIC.name} ${d.role} ${d.name}`}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 340px"
                    className="object-cover object-top"
                  />
                </div>

                <div className="p-8 lg:p-10">
                  <p className="text-[12.5px] font-black tracking-[0.16em] text-brand-500">
                    동그라미치과 {d.role}
                  </p>
                  <h2 className="display mt-2 text-[32px] tracking-[0.06em] text-ink sm:text-[38px]">
                    {d.name}
                  </h2>

                  <ul className="mt-7 space-y-2">
                    {d.career.map((c) => (
                      <li key={c} className="text-[15px] leading-relaxed text-ink-soft">
                        {c}
                      </li>
                    ))}
                  </ul>

                  {d.societies.length > 0 && (
                    <div className="mt-7">
                      <span className="inline-flex rounded-lg bg-brand-500 px-3 py-1.5 text-[12.5px] font-black text-white">
                        학회활동
                      </span>
                      <ul className="mt-4 space-y-2">
                        {d.societies.map((s) => (
                          <li key={s} className="text-[15px] leading-relaxed text-ink-soft">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    href={`/about/doctors/${d.slug}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-lg border-[1.5px] border-brand-300 px-6 py-3 text-[14.5px] font-bold text-brand-700 transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50"
                  >
                    {d.name} {d.role} 자세히 <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>

      {/* 인증·수료 */}
      <section className="border-y border-brand-200/60 bg-white py-16">
        <Container>
          <h2 className="display-sm text-[24px] text-ink sm:text-[28px]">인증 · 수료</h2>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {IMG.credentials.map((c, i) => (
              <figure key={c.src} className="text-center">
                <div className="overflow-hidden rounded-xl border border-brand-100 bg-brand-50/50 p-3">
                  <Image
                    src={c.src}
                    alt={c.label}
                    width={320}
                    height={420}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <figcaption className="mt-3 text-[12.5px] leading-snug text-ink-soft">
                  {CREDENTIALS[i] ?? c.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* 발표 논문 */}
      <Container className="py-16">
        <div className="overflow-hidden rounded-2xl border border-brand-200/70 bg-white shadow-[var(--shadow-soft)]">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-8 lg:p-10">
              <p className="text-[12.5px] font-black tracking-[0.16em] text-brand-500 uppercase">
                발표 논문
              </p>
              <h2 className="display-sm mt-4 text-[21px] leading-snug text-ink">
                {PUBLICATION_DETAIL.title}
              </h2>
              <p className="mt-4 text-[14px] text-ink-muted">{PUBLICATION_DETAIL.authors}</p>
              <div className="mt-6 rounded-2xl bg-brand-50 p-5">
                <p className="text-[11.5px] font-black tracking-[0.14em] text-brand-600 uppercase">
                  Clinical Relevance
                </p>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
                  {PUBLICATION_DETAIL.relevanceKo}
                </p>
              </div>
            </div>
            {/*
              ★ 원본(768×800)은 위 60% 가 흐린 배경이고 **노트북과 논문은 아래쪽**에 있다.
                object-top 으로 자르면 정작 논문이 화면 밖으로 밀린다(실제로 그랬다).
                아래를 기준으로 잘라야 제목·저자까지 들어온다.
            */}
            <div className="relative min-h-[340px] bg-brand-100">
              <Image
                src={PUBLICATION_DETAIL.image}
                alt="발표 논문 — Long-term Follow-up of Complicated Crown Fracture With Fragment Reattachment"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-bottom"
              />
            </div>
          </div>
        </div>
      </Container>

      <ContactCta />
    </>
  );
}
