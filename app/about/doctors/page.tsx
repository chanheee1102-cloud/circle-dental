import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CLINIC } from '@/lib/clinic';
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
    /*
     * ★ Person 과 Physician 두 타입을 함께 준다.
     *   Physician 만 주면 '저자(author)' 로 쓸 수 없다 — 스키마에서 author 가 받는 것은
     *   Person 또는 Organization 이다. 실측에서 두 페이지의 Person 노드가 사라졌던 이유가
     *   이것이다(@id 가 같아 병합될 때 Physician 이 Person 을 덮었다).
     */
    '@type': ['Person', 'Physician'],
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
          as="h1"
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
              className="rounded-2xl border border-brand-200/70 bg-white p-7 shadow-[var(--shadow-soft)] lg:p-10"
            >
              {/*
                ★ 사진 비율을 건드리지 않는다.
                  md 이상에서 aspect 를 풀어 카드 높이에 맞춰 늘렸더니 인물이 잘렸다(머리가 위 가장자리에 닿음).
                  인물 사진은 촬영 시 여백까지 계산된 결과물이라 비율을 바꾸면 반드시 어색해진다.
                  → 사진은 원본 비율(625×670) 그대로 두고, **열 폭으로** 높이를 맞춘다.

                ★ 왜 하필 560px 인가 — 눈대중이 아니라 실측값이다.
                  글 한 단의 높이는 이 폭 범위(470~590px)에서 줄바꿈이 생기지 않아 602px 로 고정이다.
                  사진 높이 = 폭 × 670/625 = 폭 × 1.072 이므로 602px 가 되는 폭이 곧 562px 다.
                  실측: 폭 470 → 사진 504(-98) / 530 → 568(-34) / 550 → 590(-12) / 560 → 600(-2) / 590 → 632(+30).
                  앞서 440px 로 두었을 때 글이 132px 더 길어 사진 아래가 휑했던 것이 이 계산을 빠뜨린 결과다.

                ★ 세 번째 카드(김인진 원장)만 학회활동이 없어 글이 542px 다 — 이때는 사진이 58px 더 크다.
                  남는 공간이 글 쪽(오른쪽 아래)으로 가는 건 원본 홈페이지와 같은 모습이라 그대로 둔다.
                  반대로 사진 아래가 비면 카드가 무너져 보인다.

                ★ items-start → 사진 윗변과 '동그라미치과 대표원장' 첫 줄이 같은 선에서 시작한다.
              */}
              <div className="grid gap-8 md:grid-cols-[minmax(0,560px)_1fr] md:items-start lg:gap-12">
                <div className="overflow-hidden rounded-xl bg-brand-100">
                  <Image
                    src={d.photo}
                    alt={`${CLINIC.name} ${d.role} ${d.name}`}
                    width={625}
                    height={670}
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="h-auto w-full"
                  />
                </div>

                <div>
                  <p className="text-[12.5px] font-black tracking-[0.16em] text-brand-500">
                    동그라미치과 {d.role}
                  </p>
                  <h2 className="display mt-2 text-[32px] tracking-[0.06em] text-ink sm:text-[36px]">
                    {d.name}
                  </h2>

                  <ul className="mt-6 space-y-[7px]">
                    {d.career.map((c) => (
                      <li key={c} className="text-[15px] leading-[1.65] text-ink-soft">
                        {c}
                      </li>
                    ))}
                  </ul>

                  {d.societies.length > 0 && (
                    <>
                      <span className="mt-6 inline-flex rounded-md bg-brand-500 px-3 py-1.5 text-[12.5px] font-black text-white">
                        학회활동
                      </span>
                      <ul className="mt-3 space-y-[7px]">
                        {d.societies.map((s) => (
                          <li key={s} className="text-[15px] leading-[1.65] text-ink-soft">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <Link
                    href={`/about/doctors/${d.slug}`}
                    className="mt-7 inline-flex items-center gap-2 rounded-lg border-[1.5px] border-brand-300 px-6 py-3 text-[14.5px] font-bold text-brand-700 transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50"
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
          {/*
            ★ 라벨을 `CREDENTIALS[i]` 로 가져오지 않는다.
              이미지 배열과 문구 배열을 인덱스로 짝지으면 한쪽 순서만 바뀌어도 전부 어긋나는데
              화면은 멀쩡해 보인다. 실제로 네 장 모두 다른 인증서 이름을 달고 있었다.
              문구는 이제 이미지 옆(lib/assets.ts)에 붙어 있으므로 `c.label` 하나만 쓴다.

            ★ 칸 높이를 고정한다.
              인증서 원본은 236×242 세 장과 236×178 한 장으로 비율이 제각각이다.
              그대로 흘리면 짧은 한 장만 캡션이 위로 올라와 줄이 어긋난다(원본 홈페이지가 그렇다).
              정사각 액자에 object-contain 으로 담으면 비율이 달라도 액자 높이가 같아
              네 캡션이 같은 선에서 시작한다. 잘리는 인증서도 없다.
          */}
          <div className="mt-10 grid grid-cols-2 items-start gap-x-6 gap-y-8 sm:grid-cols-4">
            {IMG.credentials.map((c) => (
              <figure key={c.src}>
                <div className="relative aspect-square overflow-hidden rounded-xl border border-brand-100 bg-brand-50/50">
                  <Image
                    src={c.src}
                    alt={c.label}
                    fill
                    sizes="(max-width: 640px) 45vw, 260px"
                    className="object-contain p-4"
                  />
                </div>
                <figcaption className="mt-3.5 text-center text-[12.5px] leading-snug text-ink-soft">
                  {c.label}
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
