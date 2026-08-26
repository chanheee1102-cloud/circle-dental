import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TREATMENTS, treatmentBySlug } from '@/lib/treatments';
import { symptomBySlug } from '@/lib/symptoms';
import { IMPLANT_TOPICS } from '@/lib/implantTopics';
import { journeyForTreatment } from '@/lib/insight';
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
import { SectionNav } from '@/components/SectionNav';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, articleSchema , og , imageObjectSchema, pageImage, withLocality } from '@/lib/seo';
import { KeyPoints, TableOfContents, ArticleMeta, References, charCount, firstSentence, headingId } from '@/components/article';
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
  /*
   * ⚠️ implant 는 제외한다 — app/treatment/implant/page.tsx 라는 **전용 페이지**가 따로 있다.
   *   Next 는 정적 세그먼트를 동적 세그먼트보다 먼저 잡으므로 화면은 전용 페이지가 이기지만,
   *   여기서 implant 를 그대로 내보내면 같은 경로를 두 곳에서 만들어 빌드가 충돌한다.
   */
  return TREATMENTS.filter((t) => t.slug !== 'implant').map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  if (!t) return {};
  /*
   * ★ 메타 설명에만 지역을 붙인다 (2026-08-18). 카드에 쓰는 t.summary 자체는 안 건드린다 —
   *   /treatment 목록에서 열 줄이 전부 '…화정동 동그라미치과의원입니다' 로 끝나면 읽기 싫어진다.
   *   지역이 필요한 곳은 검색 결과이지 화면이 아니다.
   */
  const desc = withLocality(t.summary);
  return {
    title: t.name,
    description: desc,
    alternates: { canonical: `/treatment/${t.slug}` },
    openGraph: og({
      title: `${t.name} | 동그라미치과`,
      description: desc,
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
  /* 여정은 slug 로 맞춘다 — lib/insight.ts journeyForTreatment 주석 참고. */
  const journey = journeyForTreatment(t.slug);

  /*
    figures 격자의 빈칸 방지 규칙 — 열은 2열로 고정하고, 장수가 홀수면 첫 장이 한 행을 다 쓴다.
    2장 2×1 · 3장 리드+2 · 4장 2×2 · 5장 리드+2×2 — n ≥ 1 어디에도 홀이 없다.
    ⚠️ '열 수를 장수에 맞추는' 방식으로 되돌리지 말 것. 데스크톱에서 3열로 풀어도 태블릿에서
       2열로 접히는 순간 홀수 장이 다시 혼자 남는다. 열을 고정하고 장수 쪽을 맞추는 것이 요점이다.
    ★ 하필 첫 장이 리드인 이유는 취향이 아니다 — lib/treatments.ts 를 전수로 보면 10개 진료 중
      8개의 figures[0] 이 '구조·단계 전체를 보여 주는 개괄 도해'다. 개괄을 크게 두고 세부를
      아래에 까는 것이 읽는 순서 그대로다.
  */
  const figs = t.figures ?? [];
  const hasLead = figs.length % 2 === 1;

  /*
    고정 서브 내비에 넣을 구간.
    ⚠️ **실제로 렌더되는 섹션만** 넣는다 — 없는 id 로 링크하면 눌러도 아무 일이 안 일어난다.
       그래서 조건부 섹션(figures · 비교표 · 임플란트 세부 · 진행 순서 · 관련 증상)은
       화면을 그리는 조건과 **같은 조건**으로 여기서도 거른다. 둘이 어긋나면 죽은 링크가 된다.
  */
  const figuresHeading = t.figuresTitle ?? `${t.name}, 눈으로 먼저 보기`;
  const navItems = [
    figs.length ? { id: headingId(figuresHeading), label: '구조·과정' } : null,
    { id: '자주-묻는-질문', label: '자주 묻는 질문' },
    t.slug === 'implant' || t.slug === 'crown-prosthesis' || t.slug === 'save-natural-tooth'
      ? { id: '방법-비교', label: '방법 비교' }
      : null,
    t.slug === 'implant' && IMPLANT_TOPICS.length
      ? { id: '임플란트-더-자세히', label: '더 자세히' }
      : null,
    journey ? { id: '진행-순서', label: '진행 순서' } : null,
    related.length ? { id: '이런-증상이라면-함께-보세요', label: '관련 증상' } : null,
  ].filter((x): x is { id: string; label: string } => x !== null);

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

      {/*
        ★ 고정 섹션 내비 — 이 페이지는 스크롤이 7,000px 을 넘는다. 위쪽 목차 카드는 한 번
          지나가면 사라져서, 아래로 내려간 사람이 다른 구간으로 갈 길이 없었다.
        ⚠️ 빵부스러기 **아래**, 본문 **위**에 둔다. 헤더 안으로 넣으면 전 페이지에 나오는데
           이 바는 진료 페이지 전용이다.
      */}
      <SectionNav items={navItems} />

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

        {/*
          구조·과정 설명 이미지.

          ★ 자리를 여기로 잡은 이유 — 도입 글이 끝난 **직후**다. 글로만 읽으면 형태가 안 잡힌 채
            문답까지 내려간다. 형태를 먼저 주고 질문으로 넘어가야 답이 붙을 자리가 생긴다.
          ⚠️⚠️ 아래 고지 블록을 지우지 말 것 ⚠️⚠️
            이 사진들은 AI 로 만든 설명용이다. 고지가 없으면 원내 장비·시술 사진으로 읽히고,
            그 순간 확인되지 않은 시설 주장이 된다(의료법 제56조 · lib/treatments.ts figures 주석).
        */}
        {figs.length ? (
          <section className="border-b border-brand-200/60 bg-cream-deep/60 py-16 lg:py-20">
            <Container>
              {/*
                ★ 눈금줄을 둔다 — 이 페이지의 다른 구간에는 전부 있는데 여기만 없어서 사진이
                  아무 신호 없이 시작됐다. 문구를 '설명용 그림' 으로 잡아, 아래 고지와 같은 말을
                  섹션 첫 줄에서 미리 한다. 마지막에만 적으면 다 보고 난 뒤의 변명처럼 읽힌다.
              */}
              <p className="flex items-center gap-2.5 text-[12.5px] font-black tracking-[0.2em] text-clay-600 uppercase">
                <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-clay-500" />
                설명용 그림
              </p>
              <h2
                id={headingId(t.figuresTitle ?? `${t.name}, 눈으로 먼저 보기`)}
                className="display-sm mt-4 max-w-[26ch] scroll-mt-28 text-[24px] text-ink sm:text-[28px]"
              >
                {t.figuresTitle ?? `${t.name}, 눈으로 먼저 보기`}
              </h2>

              <div className="reveal-stack mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:gap-x-8 lg:gap-y-10">
                {figs.map((f, i) => {
                  const isLead = hasLead && i === 0;
                  return (
                    /*
                      ★★ figure 자체가 흰 카드다 ★★
                        전에는 이미지만 있고 캡션이 카드 밖 공중에 떠 있었다. 3장이 나란히 있으면
                        가운데 캡션이 어느 사진 것인지 눈이 한 번 헷갈린다. 캡션은 장식이 아니라
                        그 사진이 무엇을 말하는지이므로 사진과 같은 상자 안에 있어야 한다.
                        (이 형식은 /about/tour 가 이미 쓰는 것이다 — 새로 만들지 않았다.)
                      ★ h-full + flex-col: 캡션 길이가 제각각이라 카드 키가 달라진다. 격자가 행 높이를
                        맞춰 주므로 사진의 아래 선이 한 줄로 정확히 떨어진다.
                      ⚠️ 호버 리프트를 넣지 말 것. 여기 도해는 클릭 대상이 아니다. 안 눌리는 것이
                         마우스에 반응하면 '눌리는 것' 이라는 잘못된 신호가 된다.
                    */
                    <figure
                      key={f.src}
                      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-brand-200/70 bg-white shadow-[var(--shadow-soft)]${
                        isLead ? ' sm:col-span-2 sm:flex-row sm:items-stretch' : ''
                      }`}
                    >
                      {/*
                        ★★ 비율은 컨테이너가 못 박는다 ★★
                          전에는 width/height 를 준 Image 에 object-cover 를 걸었는데, 그건 자를 것이
                          없는 no-op 이었다(상자가 원본 비율대로 흐른다). 줄이 맞았던 건 소재가 우연히
                          전부 1536×1024 라서지 코드가 보증한 게 아니었다. aspect-[3/2] 는 지금 소재와
                          정확히 같아 크롭이 0 이면서, 소재가 바뀌어도 줄은 절대 안 어긋난다.
                        ★ 리드는 세로로 두면 화면을 통째로 먹는다. 가로로 눕혀 미디어 56% / 캡션 44%.
                      */}
                      <div
                        className={`relative aspect-[3/2] shrink-0 overflow-hidden bg-brand-100${
                          isLead ? ' sm:w-[56%]' : ''
                        }`}
                      >
                        <Image
                          src={f.src}
                          alt={f.alt}
                          fill
                          /*
                            ★ 상한(px)을 반드시 둔다. 예전 값 '50vw' 에는 상한이 없어서 넓은 모니터에서
                              슬롯이 612px 인데 1280px 변형을 받아 왔다.
                          */
                          sizes={
                            isLead
                              ? '(min-width: 1320px) 704px, (min-width: 640px) 55vw, calc(100vw - 40px)'
                              : '(min-width: 1320px) 612px, (min-width: 640px) 47vw, calc(100vw - 40px)'
                          }
                          className="object-cover"
                        />
                        {/*
                          ★ 인셋 하이라인 — 이 한 줄이 '사진이 배경에 녹아 잘려 보인다' 를 없앤다.
                            도해는 배경이 대부분 밝아서 불투명한 밝은 테두리(brand-100 은 대비 1.13:1)가
                            흰 도해 위에서 그대로 묻힌다. 알파 링은 이미지 **위에** 합성되므로 밑에
                            무엇이 있든 항상 같은 세기로 어두워진다.
                          ⚠️ 링을 바깥 div 에 직접 걸면 fill 이미지 아래에 깔려 안 보인다. 형제로 둘 것.
                        */}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-brand-900/12"
                        />
                      </div>

                      <figcaption
                        className={`px-6 pb-6 pt-5 text-[14.5px] leading-[1.75] text-ink-soft${
                          isLead
                            ? ' sm:flex sm:flex-1 sm:flex-col sm:justify-center sm:px-9 sm:py-8 sm:text-[16px] sm:leading-[1.8]'
                            : ''
                        }`}
                      >
                        <Sentences text={f.caption} />
                      </figcaption>
                    </figure>
                  );
                })}
              </div>

              {/*
                ★★ 고지의 자리와 형식 (2026-08-26) ★★
                  전에는 max-w-[62ch] 문단 하나였는데, 그 폭이 격자 왼쪽 열 폭과 거의 같아서
                  **왼쪽 칸에 딸린 각주**처럼 정렬됐다. 지우면 안 되는 문장이 화면에서 가장
                  소속이 불분명한 요소가 되어 있었다.
                  → 전폭 hairline 을 먼저 긋는다(격자 '전체' 에 걸린 고지라는 뜻이 선으로 보인다).
                  → 라벨을 왼쪽 레일에 세워, 읽는 사람이 본문 전에 성격을 안다.
                ★ 색은 ink-muted 로 통일한다. 예전의 brand-500 은 이 사이트에서 눈금줄 전용 색이다.
              */}
              <div className="mt-12 border-t border-brand-200/70 pt-6 lg:grid lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-x-8">
                <p className="text-[12px] font-black tracking-[0.14em] text-brand-600">
                  설명용 이미지
                </p>
                <p className="mt-2 max-w-[72ch] text-[13.5px] leading-[1.8] text-ink-muted lg:mt-0">
                  위 이미지는 구조와 과정을 설명하기 위해 만든 것으로, 실제 진료 사진이나 원내 장비
                  사진이 아닙니다. 사용하는 재료와 방법은 진단 결과에 따라 달라집니다.
                </p>
              </div>
            </Container>
          </section>
        ) : null}

        <Container className="py-14 lg:py-16">
          {/*
            ⚠️ 예전에는 여기 h2 가 sr-only 였다. 그러면 화면에는 없고 구조에만 있는 헤딩이라
               목차가 걸 곳이 없고, 답변 엔진이 보는 구조와 사람이 보는 화면이 어긋난다.
               문답 하나하나가 이미 h2 이므로 이 자리는 눈썹 한 줄로 충분하다.
          */}
          {/* 눈썹에 룰을 붙이고 강조색을 준다 — 구간이 시작된다는 신호가 색으로 먼저 온다. */}
          <p
            id="자주-묻는-질문"
            className="flex scroll-mt-32 items-center gap-2.5 text-[12.5px] font-black tracking-[0.2em] text-clay-600 uppercase"
          >
            <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-clay-500" />
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
          <section id="방법-비교" className="scroll-mt-32 border-t border-brand-200/60 bg-white py-14">
            <Container>
              <ComparisonTable data={MISSING_TOOTH_OPTIONS} />
            </Container>
          </section>
        )}
        {t.slug === 'save-natural-tooth' && (
          <section id="방법-비교" className="scroll-mt-32 border-t border-brand-200/60 bg-white py-14">
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

        {/*
          ★★ 치료 여정으로 잇는다 (2026-08-18 내부 링크 전수 조사) ★★
            치료 여정 8개 중 7개가 들어오는 링크 하나(허브 목록)뿐이었다. 데이터에 진료 ↔ 여정
            대응이 이미 있는데 진료 페이지 쪽에서 아무도 안 읽고 있었다.
          ★ "몇 번 와야 하나요" 는 이 페이지를 읽는 사람이 바로 다음에 하는 질문이라
            자리도 여기가 맞다. 여정이 없는 진료(스케일링·소아)는 아무것도 그리지 않는다.
        */}
        {/*
          ★★ 어두운 밴드 (2026-08-26, 제품 오너 GO) ★★
            이 페이지는 크림 → 흰 → 크림만 반복해서 리듬이 없었다. 밝은 면만 이어지면
            아무리 정돈해도 '문서' 로 읽히고 '디자인된 화면' 으로는 안 읽힌다.
            한 구간을 어둡게 눕히면 그 대비 하나로 페이지 전체가 설계된 것으로 보인다.
          ★ 하필 진행 순서를 고른 이유 — journey.steps 에 3~6단계 데이터가 **이미 있는데
            화면에 한 줄도 안 나오고 있었다.** 링크 한 개로만 넘기고 있었다. 없는 것을
            새로 만드는 대신 있는 것을 꺼낸다.
          ⚠️ 어두운 면에서 ink-soft 를 쓰지 말 것(globals.css 주석). 본문은 clay-300,
             보조는 brand-200/300 이 맡는다.
        */}
        {journey && (
          <section
            id="진행-순서"
            className="scroll-mt-32 border-y border-brand-900 bg-brand-900 py-16 lg:py-20"
          >
            <Container>
              {/*
                눈썹 표식을 **작은 원**으로 둔다. 병원 이름이 동그라미이고 로고가 원이며,
                KeyPoints 가 이미 ● 를 쓰고 있다. 가로 룰(———)은 우리 언어가 아니었다.
                문구도 한국어로 — 이 사이트의 다른 눈썹은 전부 한국어다.
              */}
              <p className="flex items-center gap-2.5 text-[12.5px] font-black tracking-[0.2em] text-clay-400">
                <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-clay-400" />
                진행 순서
              </p>
              <h2 className="display-sm mt-4 max-w-[24ch] text-[24px] text-white sm:text-[28px]">
                몇 번에 걸쳐 어떻게 진행되나요?
              </h2>
              <p className="mt-4 max-w-[62ch] text-[15.5px] leading-[1.85] text-brand-200">
                {journey.answer}
              </p>

              {/* 내원 횟수·기간은 숫자라 먼저 눈에 들어와야 한다. 라벨은 한국어로. */}
              <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-white/12 py-5">
                <div>
                  <p className="text-[12px] font-bold tracking-[0.06em] text-clay-300">내원 횟수</p>
                  <p className="mt-1.5 text-[16px] font-black text-white">{journey.visits}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold tracking-[0.06em] text-clay-300">치료 기간</p>
                  <p className="mt-1.5 text-[16px] font-black text-white">{journey.duration}</p>
                </div>
              </div>

              {/*
                ★★ 단계 — 번호를 '원' 안에 넣고 선으로 잇는다 ★★
                  처음에는 큰 세리프 숫자를 왼쪽 위에 두었는데, 그건 경쟁 병원 페이지의
                  구성 그대로였다(오너 지적). 이 병원의 표식은 **동그라미**다 — 이름도
                  로고도 원이고, 본문 목록도 ● 를 쓴다. 그 표식을 단계에 그대로 쓴다.
                ★ 원 뒤로 이어지는 선이 '단계가 이어진다' 를 형태로 말한다. 마지막 칸에서는
                  선을 끊어 끝을 표시한다 — 선이 계속 나가면 뒤에 뭔가 더 있는 것처럼 읽힌다.
              */}
              <ol className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                {journey.steps.map((st, i) => (
                  <li key={st.label}>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-clay-400/55 text-[14.5px] font-black text-clay-300">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {i < journey.steps.length - 1 ? (
                        <span aria-hidden className="h-px flex-1 bg-white/12" />
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-[16.5px] font-black text-white">{st.label}</h3>
                    <p className="mt-2 text-[14.5px] leading-[1.8] text-brand-200">{st.what}</p>
                  </li>
                ))}
              </ol>

              {/* 기간을 늘리는 요인 — 기대치를 미리 맞추는 자리라 단계 바로 다음에 둔다. */}
              {journey.variables.length ? (
                <p className="mt-10 max-w-[68ch] text-[14.5px] leading-[1.85] text-brand-300">
                  기간이 늘어나는 경우도 있습니다. {journey.variables.join(' ')}
                </p>
              ) : null}

              <Link
                href={`/insight/journey/${journey.slug}`}
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-clay-500 px-6 py-3 text-[15px] font-black text-white transition-colors hover:bg-clay-600"
              >
                {t.name} 치료 여정 자세히
                <span aria-hidden>→</span>
              </Link>
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
