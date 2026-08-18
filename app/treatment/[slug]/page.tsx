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
  Sentences,
} from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, articleSchema , og , imageObjectSchema, pageImage} from '@/lib/seo';
import { KeyPoints, TableOfContents, ArticleMeta, References, charCount, firstSentence } from '@/components/article';
import { REFS_TREATMENT } from '@/lib/references';
import { ComparisonTable } from '@/components/ComparisonTable';
import { MISSING_TOOTH_OPTIONS, NATURAL_VS_IMPLANT } from '@/lib/comparisons';

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
    openGraph: og({
      title: `${t.name} | 동그라미치과`,
      description: t.summary,
      path: `/treatment/${t.slug}`,
    }),
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

  const TPATH = `/treatment/${t.slug}`;
  /** 대표 이미지 — 사진이 없는 문서는 그 페이지 전용 공유 카드를 쓴다(lib/seo.ts pageImage 주석). */
  const docImage = pageImage(undefined, `${t.name} 진료 안내 — 동그라미치과의원`);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: t.name,
            description: t.summary,
            path: TPATH,
            about: { type: 'MedicalProcedure', name: t.name },
            image: docImage,
          }),
          imageObjectSchema({ path: TPATH, ...docImage }),
          articleSchema({
            path: `/treatment/${t.slug}`,
            title: `${t.name} — 진료 안내`,
            description: t.summary,
            wordCount: charCount(t.intro, t.qa.map((q) => q.q + q.a).join('')),
            keywords: [t.name, ...t.whoFor],
            hasImage: true,
          }),
          faqSchema(t.qa, `/treatment/${t.slug}`),
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
          <p className="mt-6 max-w-[62ch] text-[17.5px] leading-[1.8] text-ink-soft"><Sentences text={t.summary} /></p>

          <div className="mt-9 flex flex-wrap gap-2">
            {t.whoFor.map((w) => (
              <span
                key={w}
                className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-[13.5px] font-semibold text-brand-700"
              >
                {w}
              </span>
            ))}
          </div>

          {/*
            ★★ 저자·검토자·최종 수정일 (2026-08-14) ★★
              구조화 데이터에만 적어 두면 '기계용으로만 써 둔 값' 이다. 사람이 읽는 자리에도
              같은 값이 있어야 그 선언이 사실로 받아들여진다.
            ⚠️ '원장이 직접 작성' 이 아니라 **검토**다 — 작성 주체를 부풀리면 거짓 표시가 된다.
          */}
          <div className="mt-10 max-w-[70ch]">
            <ArticleMeta path={`/treatment/${t.slug}`} />
          </div>

          {/*
            ★★ 한눈에 보기 + 목차 ★★
              요약은 새로 쓰지 않는다 — 문답의 **첫 문장**을 그대로 뽑는다. 이 사이트의 답은
              애초에 첫 문장에서 끝나도록 쓰여 있어(lib/treatments.ts) 그대로가 요약이 된다.
              지어내지 않으면서 답변 엔진이 인용할 결론 블록이 생긴다.
          */}
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <KeyPoints items={[t.summary, ...t.qa.slice(0, 3).map((qa) => firstSentence(qa.a))]} />
            <TableOfContents
              items={[
                ...t.qa.map((qa) => qa.q),
                ...(t.slug === 'implant' || t.slug === 'crown-prosthesis'
                  ? [MISSING_TOOTH_OPTIONS.title]
                  : []),
                ...(t.slug === 'save-natural-tooth' ? [NATURAL_VS_IMPLANT.title] : []),
              ]}
            />
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
          {/*
            ⚠️ 예전에는 여기 h2 가 sr-only 였다. 그러면 화면에는 없고 구조에만 있는 헤딩이라
               목차가 걸 곳이 없고, 답변 엔진이 보는 구조와 사람이 보는 화면이 어긋난다.
               문답 하나하나가 이미 h2 이므로 이 자리는 눈썹 한 줄로 충분하다.
          */}
          <p className="text-[12.5px] font-black tracking-[0.2em] text-brand-500 uppercase">
            {t.name} 자주 묻는 질문
          </p>
          <div className="mt-8">
            <QABlock items={t.qa} />
          </div>
        </Container>

        {/*
          ★★ 비교표 (2026-08-14) ★★
            "임플란트랑 브릿지 중 뭐가 나아요" 는 진료실에서도 검색에서도 가장 잦은 질문인데
            줄글로는 **비교가 안 된다** — 사람은 두 선택지를 같은 기준으로 나란히 봐야 판단한다.
            답변 엔진도 표는 행 단위로 사실이 끊겨 그대로 인용한다.
          ⚠️ 우열을 매기지 않는다. 표는 차이를 보여 주는 것이지 판단을 대신하지 않는다
             (lib/comparisons.ts 주석 참고).
        */}
        {(t.slug === 'implant' || t.slug === 'crown-prosthesis') && (
          <section className="border-t border-brand-200/60 bg-white py-14">
            <Container>
              <ComparisonTable data={MISSING_TOOTH_OPTIONS} />
            </Container>
          </section>
        )}
        {t.slug === 'save-natural-tooth' && (
          <section className="border-t border-brand-200/60 bg-white py-14">
            <Container>
              <ComparisonTable data={NATURAL_VS_IMPLANT} />
            </Container>
          </section>
        )}

        {/* 임플란트만 세부 주제를 따로 둔다 — 질의가 가장 잘게 갈라지는 영역이라(뼈이식·상악동·보험 등)
            개요 페이지 하나로는 그 검색을 잡지 못한다. */}
        {t.slug === 'implant' && (
          <section className="border-t border-brand-200/60 bg-brand-50/40 py-14">
            <Container>
              <h2 id="임플란트-더-자세히" className="display-sm scroll-mt-28 text-[22px] text-ink sm:text-[26px]">
                임플란트, 더 자세히
              </h2>
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
              <h2 id="이런-증상이라면-함께-보세요" className="scroll-mt-28 text-[20px] font-black text-ink">
                이런 증상이라면 함께 보세요
              </h2>
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

        <Container className="pt-4">
          {/* 참고자료 — 본문이 실제로 근거로 삼는 공식 출처만(lib/references.ts 주석 참고). */}
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
