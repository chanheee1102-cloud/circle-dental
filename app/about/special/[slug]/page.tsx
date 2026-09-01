import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SPECIALS, specialBySlug } from '@/lib/specials';
import { CLINIC } from '@/lib/clinic';
import { Container, MedicalNotice, ContactCta, Sentences, PageHero } from '@/components/ui';
import { StrengthIcon } from '@/components/StrengthIcons';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, articleSchema, og, imageObjectSchema } from '@/lib/seo';
import { KeyPoints, TableOfContents, ArticleMeta, headingId, charCount } from '@/components/article';
import { imageMeta } from '@/lib/imageSize';

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
  /*
   * ★ 설명이 짧으면 본문의 첫 소제목을 이어 붙인다 (2026-08-14 실측).
   *   body 한 줄만 쓰면 항목에 따라 42자밖에 안 돼 검색 결과에서 한 줄로 끝난다
   *   (실측: digital-diagnosis 42자). 45자 미만은 스니펫으로서 제 역할을 못 한다.
   *   ⚠️ 새 문장을 짓지 않는다 — 본문에 이미 있는 context 의 소제목을 그대로 잇는다.
   *
   * ★ 기준을 60 → 80 으로 올렸다 (2026-08-18 전수 재측정).
   *   60 이면 hygiene 이 **정확히 60자**라 아슬아슬하게 통과해 그대로 짧게 나갔다.
   *   본문 길이(42·52·60·79·92)를 보면 80 이 다섯 항목을 자연스럽게 가른다 —
   *   79자 이하는 이어 붙이고, 92자짜리 medical-team 만 그대로 둔다.
   */
  const description =
    s.body.length >= 80 ? s.body : `${s.body}. ${s.context.map((c) => c.h).slice(0, 2).join(', ')} 등을 정리했습니다.`;
  return {
    title: s.title,
    description,
    alternates: { canonical: `/about/special/${s.slug}` },
    openGraph: og({
      title: `${s.title} | ${CLINIC.name}`,
      description,
      path: `/about/special/${s.slug}`,
      images: [{ url: s.image, alt: s.alt }],
    }),
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

  const SPATH = `/about/special/${s.slug}`;
  const heroImage = imageMeta(s.image, s.alt);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: s.title,
            description: s.body,
            path: SPATH,
            image: heroImage,
          }),
          heroImage ? imageObjectSchema({ path: SPATH, ...heroImage }) : null,
          articleSchema({
            path: SPATH,
            title: s.title,
            description: s.body,
            wordCount: charCount(s.body, s.context.map((c) => c.h + c.p).join('')),
            keywords: [s.title, ...s.context.map((c) => c.h)],
          }),
          faqSchema(s.faq, SPATH),
        ]}
      />

      <article>
        {/*
          ⚠️ 제목을 아래 격자에서 다시 그리지 말 것 (2026-08-28) — 머리는 PageHero 가 전담한다.
          ★ 아이콘·번호·사진은 격자에 남긴다 — 그것은 머리말이 아니라 내용이다.
        */}
        <PageHero trail={trail} photo="consult" eyebrow={s.eyebrow} title={s.title} />
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
                  <p className="text-[13.5px] font-black tracking-[0.16em] text-brand-500">
                    {s.eyebrow}
                  </p>
                  <p className="text-[26px] font-black leading-none text-ink-muted">{s.no}</p>
                </div>
              </div>


              {/* 원문 그대로 — AI 인용 대상 */}
              <p className="mt-7 max-w-[58ch] text-[18px] leading-[1.9] text-ink-soft"><Sentences text={s.body} /></p>

              <div className="mt-8">
                <ArticleMeta path={SPATH} />
              </div>
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
        <section className="border-y border-brand-200/60 bg-parchment py-16">
          <Container>
            <p className="text-[13.5px] font-black tracking-[0.2em] text-brand-500 uppercase">
              알아 두면 좋은 것
            </p>
            <div className="mb-10 max-w-[70ch]">
              <KeyPoints items={[s.body, ...s.context.slice(0, 2).map((c) => c.h + ' — ' + c.p.slice(0, 70) + '…')]} />
            </div>
            <div className="mb-10 max-w-[70ch]">
              <TableOfContents items={[...s.context.map((c) => c.h), '자주 묻는 질문']} />
            </div>
            <div className="mt-8 divide-y divide-brand-100">
              {s.context.map((c) => (
                <div key={c.h} className="py-7 first:pt-0 last:pb-0">
                  <h2 id={headingId(c.h)} className="display-sm scroll-mt-28 text-[19px] text-ink sm:text-[21px]">
                    {c.h}
                  </h2>
                  <p className="mt-3.5 max-w-[70ch] text-[17px] leading-[1.85] text-ink-soft"><Sentences text={c.p} /></p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <Container className="py-14">
          <h2 id={headingId('자주 묻는 질문')} className="display-sm scroll-mt-28 text-[24px] text-ink sm:text-[28px]">
            자주 묻는 질문
          </h2>
          <div className="mt-8 divide-y divide-brand-100 border-t border-brand-100">
            {s.faq.map((f) => (
              <article key={f.q} className="py-6">
                <h3 className="text-[18px] font-black leading-snug text-ink">{f.q}</h3>
                <p className="mt-3 max-w-[68ch] text-[16.5px] leading-[1.85] text-ink-soft"><Sentences text={f.a} /></p>
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
                  className="group overflow-hidden rounded-2xl border border-brand-200/70 card-glass transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={o.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="px-5 py-4 text-[15.5px] font-black text-ink group-hover:text-brand-700">
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
