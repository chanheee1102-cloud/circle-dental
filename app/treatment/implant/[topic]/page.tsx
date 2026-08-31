import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IMPLANT_TOPICS, implantTopicBySlug } from '@/lib/implantTopics';
import { NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { Container, MedicalNotice, ContactCta, Sentences, PageHero } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, articleSchema , og , imageObjectSchema, pageImage} from '@/lib/seo';
import { KeyPoints, TableOfContents, ArticleMeta, References, headingId, charCount } from '@/components/article';
import { REFS_TREATMENT } from '@/lib/references';

/**
 * 임플란트 세부 주제 상세.
 *
 * ⚠️ 라우트 위치 주의 — /treatment/implant 는 [slug] 동적 라우트가 이미 잡고 있다.
 *   Next 는 정적 세그먼트(implant)를 동적([slug])보다 우선하므로 이 폴더가 이긴다.
 *   그래서 개요 페이지(/treatment/implant)가 여전히 [slug] 로 처리되도록
 *   같은 폴더에 별도 page.tsx 를 두지 않고, 세부 주제만 [topic] 으로 받는다.
 */
export function generateStaticParams() {
  return IMPLANT_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const t = implantTopicBySlug(topic);
  if (!t) return {};
  return {
    title: `${t.name} — ${t.tagline}`,
    description: t.answer.slice(0, 155),
    alternates: { canonical: `/treatment/implant/${t.slug}` },
    openGraph: og({
      title: `임플란트 ${t.name}`,
      description: t.answer.slice(0, 155),
      path: `/treatment/implant/${t.slug}`,
    }),
  };
}

export default async function ImplantTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const t = implantTopicBySlug(topic);
  if (!t) notFound();

  const trail = [
    { name: '홈', path: '/' },
    { name: '진료과목', path: '/treatment' },
    { name: '임플란트', path: '/treatment/implant' },
    { name: t.name, path: `/treatment/implant/${t.slug}` },
  ];

  const others = IMPLANT_TOPICS.filter((o) => o.slug !== t.slug);

  const BUILDPATH = `/treatment/implant/${t.slug}`;

  /** 대표 이미지 — 사진이 없는 문서는 그 페이지 전용 공유 카드를 쓴다(lib/seo.ts pageImage 주석). */
  const docImage = pageImage(undefined, `임플란트 ${t.name} — 동그라미치과의원 설명`);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: `${t.name} — ${t.tagline}`,
            description: t.answer,
            path: BUILDPATH,
            about: { type: 'MedicalProcedure', name: `임플란트 ${t.name}` },
            image: docImage,
          }),
          imageObjectSchema({ path: BUILDPATH, ...docImage }),
          articleSchema({
            path: BUILDPATH,
            title: t.name + ' — ' + t.tagline,
            description: t.answer,
            wordCount: charCount(t.answer, t.detail, t.faq.map((q) => q.q + q.a).join('')),
            keywords: ['임플란트', t.name, ...t.indications.slice(0, 3)],
            hasImage: true,
          }),
          faqSchema(t.faq, BUILDPATH),
        ]}
      />

      <article>
        {/*
          ⚠️ 머리를 손으로 다시 그리지 말 것 — PageHero 하나가 전담한다(2026-08-28).
          ⚠️ 바로 아래 '즉답 블록' 은 히어로로 옮기지 말 것 — 같은 문장이 두 번 나오면
             인용 가치가 떨어진다. 답은 본문 첫 자리에 한 번만 둔다.
        */}
        <PageHero trail={trail} photo="consult" eyebrow="임플란트" title={t.name} desc={t.tagline} />

        <Container className="py-12 lg:py-16">

          <div className="mt-8 max-w-[64ch] rounded-2xl border-l-[3px] border-brand-500 card-glass p-6 shadow-[var(--shadow-soft)]">
            <p className="text-[18px] leading-[1.85] text-ink"><Sentences text={t.answer} /></p>
          </div>

          <p className="mt-7 max-w-[66ch] text-[17px] leading-[1.85] text-ink-soft"><Sentences text={t.detail} /></p>

          <div className="mt-9 max-w-[70ch]">
            <ArticleMeta path={BUILDPATH} />
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <KeyPoints items={[t.answer, '이런 경우: ' + t.indications.slice(0, 2).join(', ')]} />
            <TableOfContents items={['이런 경우에 해당합니다', '알아 두실 점', '자주 묻는 질문']} />
          </div>
        </Container>

        <section className="border-y border-brand-200/60 bg-parchment py-14">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 id={headingId('이런 경우에 해당합니다')} className="display-sm scroll-mt-28 text-[21px] text-ink">
                  이런 경우에 해당합니다
                </h2>
                <ul className="mt-6 space-y-3">
                  {t.indications.map((s) => (
                    <li key={s} className="flex gap-3 text-[16.5px] leading-relaxed text-ink-soft">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[13.5px] text-white"
                      >
                        ✓
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              {/* 부작용·한계를 같은 비중으로 둔다. 이점만 적으면 의료광고법상 문제가 된다. */}
              <div>
                <h2 id={headingId('알아 두실 점')} className="display-sm scroll-mt-28 text-[21px] text-ink">
                  알아 두실 점
                </h2>
                <ul className="mt-6 space-y-3">
                  {t.cautions.map((s) => (
                    <li key={s} className="flex gap-3 text-[16.5px] leading-relaxed text-ink-soft">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500 text-[13.5px] text-white"
                      >
                        !
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        <Container className="py-14">
          <h2 id={headingId('자주 묻는 질문')} className="display-sm scroll-mt-28 text-[24px] text-ink sm:text-[28px]">
            자주 묻는 질문
          </h2>
          <div className="mt-8 divide-y divide-brand-100 border-t border-brand-100">
            {t.faq.map((f) => (
              <article key={f.q} className="py-6">
                <h3 className="text-[18px] font-black leading-snug text-ink">{f.q}</h3>
                <p className="mt-3 max-w-[68ch] text-[16.5px] leading-[1.85] text-ink-soft">{f.a}</p>
              </article>
            ))}
          </div>
        </Container>

        <section className="border-t border-brand-200/60 bg-brand-50/40 py-14">
          <Container>
            <h2 className="text-[20px] font-black text-ink">임플란트 다른 주제</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/treatment/implant/${o.slug}`}
                  className="group rounded-xl border border-brand-200/70 card-glass px-5 py-4 transition-colors hover:border-brand-400"
                >
                  <span className="block text-[16px] font-black text-ink group-hover:text-brand-700">
                    {o.name}
                  </span>
                  <span className="mt-1 block text-[14px] text-ink-muted">{o.tagline}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/insight/journey/implant"
              className="mt-8 inline-flex items-center gap-2 text-[16px] font-black text-brand-700 hover:underline"
            >
              임플란트는 몇 번 오고 얼마나 걸리나요 <span aria-hidden>→</span>
            </Link>
          </Container>
        </section>

        <Container>
          <div className="max-w-[70ch]">
            <References items={REFS_TREATMENT} />
          </div>
          <MedicalNotice extra={NO_GUARANTEE_NOTE} />
        </Container>
      </article>

      <ContactCta />
    </>
  );
}
