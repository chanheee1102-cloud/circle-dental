import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CLINIC, NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { treatmentBySlug } from '@/lib/treatments';
import { symptomBySlug } from '@/lib/symptoms';
import { IMPLANT_TOPICS } from '@/lib/implantTopics';
import { journeyForTreatment } from '@/lib/insight';
import { MISSING_TOOTH_OPTIONS } from '@/lib/comparisons';
import {
  DIGITAL_BENEFITS,
  IMPLANT_STEPS,
  IMPLANT_COMPARE,
  IMPLANT_STRENGTHS,
  IMPLANT_AFTERCARE,
} from '@/lib/implantPage';
import { IMPLANT_CASES, CASE_NOTICE } from '@/lib/implantCases';
import { Container, Breadcrumb, MedicalNotice, Sentences } from '@/components/ui';
import { SectionHead, Card, GlassCard, DarkPanel, NumChip } from '@/components/saas';
import { ComparisonTable } from '@/components/ComparisonTable';
import { JsonLd } from '@/components/JsonLd';
import { SectionNav } from '@/components/SectionNav';
import { ArticleMeta, References, charCount } from '@/components/article';
import { REFS_CONDITION } from '@/lib/references';
import {
  breadcrumbSchema,
  medicalWebPageSchema,
  articleSchema,
  og,
  imageObjectSchema,
} from '@/lib/seo';

/**
 * 임플란트 — 랜딩 페이지.
 *
 * ★★ 구성은 '정보 순서' 가 아니라 '퍼널' 이다 ★★
 *   환자가 실제로 밟는 단계로 배열했다 —
 *     내 얘기인가 → 뭐가 다른가 → 어떻게 하나 → 실제 결과 →
 *     원칙 → 얼마나 걸리나 → 남은 걱정 → 그래서 뭘 하면 되나
 *   ⚠️ '믿을 만한가'(대표원장 사진·경력 + 전문의·학회·인증·논문 지표) 구간은 오너 지시로
 *      뺐다(2026-08-26). 퍼널상 원래 '뭐가 다른가' 앞에 있던 자리다 — 되살릴 때 그 자리로.
 *
 * ★ 디자인 규칙은 components/saas.tsx 머리말에 있다. 전면 사진 히어로 · 전폭 어두운 밴드 ·
 *   자간 넓힌 영문 캡스 눈썹으로 되돌리지 말 것 — 셋 다 경쟁 병원과 같아지는 지점이다.
 * ★ 사진은 전부 기존 홈페이지의 **실제 사진**이다(public/img/clinic). AI 도해 0장.
 * ⚠️ 문구 일부는 원문에서 의도적으로 고쳤다(의료광고법) — lib/implantPage.ts 머리말 참고.
 * ⚠️ 치료 증례 섹션은 게시 조건이 걸려 있다 — lib/implantCases.ts 머리말을 반드시 읽을 것.
 * ⚠️ app/treatment/[slug]/page.tsx 의 generateStaticParams 에서 implant 를 빼 두었다.
 */

const PATH = '/treatment/implant';
const TITLE = '임플란트';
const SUMMARY =
  '3D CT로 신경 위치와 뼈의 양을 먼저 확인하고, 화면에서 정한 자리를 그대로 옮겨 심는 디지털 방식으로 진행합니다. 자연치아를 살릴 수 있는지 먼저 검토한 뒤에 권합니다.';

export const metadata: Metadata = {
  title: TITLE,
  description: SUMMARY.slice(0, 155),
  alternates: { canonical: PATH },
  openGraph: og({ title: `${TITLE} — ${CLINIC.shortName}`, description: SUMMARY.slice(0, 155), path: PATH }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
  { name: '임플란트', path: PATH },
];

const DOC_IMAGE = {
  src: '/img/clinic/implant-hero.webp',
  caption: '동그라미치과의원 상담실에서 원장이 환자에게 치료 계획을 설명하는 모습',
  width: 1920,
  height: 1280,
};

export default function ImplantPage() {
  const t = treatmentBySlug('implant');
  if (!t) throw new Error('implant 진료 데이터 없음 — lib/treatments.ts');

  const journey = journeyForTreatment('implant');
  const related = t.relatedSymptoms.map(symptomBySlug).filter(Boolean);

  const navItems = [
    { id: '디지털-방식', label: '디지털 방식' },
    { id: '시술-방법', label: '시술 방법' },
    { id: '방식-비교', label: '방식 비교' },
    { id: '치료-증례', label: '치료 증례' },
    { id: '진료-원칙', label: '진료 원칙' },
    ...(journey ? [{ id: '진행-순서', label: '진행 순서' }] : []),
    { id: '주의사항', label: '주의사항' },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: `${TITLE} — ${CLINIC.shortName}`,
            description: SUMMARY,
            path: PATH,
            about: { type: 'MedicalProcedure', name: '임플란트' },
            image: DOC_IMAGE,
          }),
          imageObjectSchema({ path: PATH, ...DOC_IMAGE }),
          articleSchema({
            path: PATH,
            title: TITLE,
            description: SUMMARY,
            wordCount: charCount(SUMMARY, t.qa.map((q) => q.q + q.a).join('')),
            keywords: [t.name, ...t.whoFor],
            hasImage: true,
          }),
        ]}
      />

      {/*
        ★★ 히어로 ★★
          제목을 clamp(38px, 5.6vw, 64px) 로 크게 연다. 어중간한 크기가 템플릿처럼 보이게
          만드는 가장 큰 원인이었다(components/saas.tsx 규칙 ①).
        ⚠️ 사진을 화면 전체에 깔지 말 것 — 카드에 담아 층을 만든다.
      */}
      {/*
        ⚠️ 밝은 면으로 되돌리지 말 것 (2026-08-28 오너) — 하위 페이지 머리는 전부 어두운 띠다.
        ⚠️ 이 면 위 글자는 parchment 계열이다. 회색조(ink-soft 등)는 3:1 대로 떨어진다.
      */}
      <section className="relative isolate -mt-[68px] overflow-hidden bg-wine-deep pt-[68px] text-parchment sm:-mt-[94px] sm:pt-[94px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_58%_at_78%_10%,rgba(217,164,65,0.16)_0%,transparent_64%)]"
        />
        <Container className="relative pt-10 pb-20 lg:pb-28">
          <Breadcrumb trail={TRAIL} tone="dark" />

          <div className="mt-12 grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <span
                className="enter inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13.5px] font-black text-parchment backdrop-blur-[10px]"
                style={{ animationDelay: '40ms' }}
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-clay-500" />
                진료과목 · 임플란트
              </span>

              <h1
                className="enter display-sm mt-7 max-w-[16em] text-[clamp(32px,5.4vw,62px)] leading-[1.14] tracking-[-0.035em] text-parchment"
                style={{ animationDelay: '140ms' }}
              >
                자연치아를 먼저 보고,
                <br />
                임플란트는 그다음입니다
              </h1>

              <p
                className="enter mt-7 max-w-[48ch] text-[18px] leading-[1.9] text-parchment/85"
                style={{ animationDelay: '260ms' }}
              >
                <Sentences text={SUMMARY} />
              </p>

              <div className="enter mt-10 flex flex-wrap gap-3" style={{ animationDelay: '380ms' }}>
                <a
                  href={CLINIC.booking.naver}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-parchment px-8 py-4 text-[16.5px] font-black text-wine-deep transition-colors hover:bg-mist"
                >
                  진료 예약하기
                  <span aria-hidden>→</span>
                </a>
                <a
                  href={CLINIC.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-parchment/70 px-8 py-4 text-[17px] font-semibold tabular-nums text-parchment transition-colors hover:bg-white/10"
                >
                  {CLINIC.phone}
                </a>
              </div>

              {/* 지표 — 지어낸 숫자를 쓰지 않는다. 이 병원이 실제로 하는 일만 적는다. */}
              <dl
                className="enter mt-12 grid max-w-[34rem] grid-cols-3 gap-x-6 border-t border-white/20 pt-7"
                style={{ animationDelay: '500ms' }}
              >
                {[
                  { k: '진단', v: '3D CT · 구강 스캔' },
                  { k: '식립', v: '맞춤 수술 가이드' },
                  { k: '검토', v: '통합치의학과 전문의' },
                ].map((s) => (
                  <div key={s.k}>
                    <dt className="text-[13.5px] font-bold text-clay-300">{s.k}</dt>
                    <dd className="mt-1.5 text-[15.5px] leading-snug font-black text-parchment">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div
                className="img-in enter overflow-hidden rounded-[28px] border border-brand-200/70 card-glass shadow-[var(--shadow-lift)]"
                style={{ animationDelay: '220ms' }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/img/clinic/implant-hero.webp"
                    alt="동그라미치과의원 상담실에서 원장이 모니터를 함께 보며 환자에게 치료 계획을 설명하는 모습"
                    fill
                    priority
                    sizes="(min-width: 1024px) 620px, 100vw"
                    className="object-cover object-[58%_center]"
                  />
                </div>
              </div>
              <div
                className="enter absolute -bottom-6 -left-4 hidden max-w-[17rem] rounded-2xl border border-brand-200/70 card-glass p-5 shadow-[var(--shadow-lift)] sm:block"
                style={{ animationDelay: '660ms' }}
              >
                <p className="text-[14px] font-black text-clay-700">진료 전 확인</p>
                <p className="mt-2 text-[15px] leading-[1.7] text-ink-soft">
                  뼈의 양과 신경 위치를 먼저 보고, 심을 수 있는지부터 말씀드립니다.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionNav items={navItems} />

      {/* 01 — 내 얘기인가 */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-center lg:gap-14">
            <h2 className="reveal display-sm max-w-[20em] text-[clamp(21px,2.6vw,30px)] leading-[1.35] tracking-[-0.02em] text-ink">
              이런 상태라면 한번 확인해 보세요
            </h2>
            <ul className="reveal-stack grid gap-3 sm:grid-cols-3">
              {t.whoFor.map((w) => (
                <Card as="li" key={w} className="reveal flex items-start gap-3 p-5">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                  <span className="text-[15.5px] leading-[1.75] font-bold text-ink">{w}</span>
                </Card>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 02 — 뭐가 다른가 */}
      <section className="py-24 lg:py-32">
        <Container>
          <SectionHead
            id="디지털-방식"
            n="02"
            label="디지털 방식"
            title="수술대에서 정하지 않고, 심기 전에 정합니다"
            desc="3D CT와 구강 스캔으로 얻은 자료를 화면에 올려, 어느 자리에 어느 깊이로 어떤 각도로 심을지를 수술 전에 정합니다. 그렇게 정한 위치를 그대로 옮긴 맞춤 가이드를 만들어 그 길을 따라 심는 방식입니다."
          />

          <div className="reveal-stack mt-14 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <Card lift className="reveal img-in overflow-hidden">
              <div className="relative aspect-[16/10] bg-brand-100">
                <Image
                  src="/img/clinic/implant-simulation.webp"
                  alt="노트북 화면에 아래턱 3차원 영상과 식립 계획이 표시되어 있고, 옆에 임플란트 고정체와 수술 가이드가 놓여 있다."
                  fill
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="display-sm text-[19px] tracking-[-0.015em] text-ink">
                  화면에서 먼저 심어 봅니다
                </h3>
                <p className="mt-3.5 text-[16px] leading-[1.85] text-ink-soft">
                  <Sentences text="신경관까지 남은 높이와 뼈 두께를 단면으로 확인하고, 고정체가 들어갈 자리를 미리 잡아 둡니다. 수술 중에 판단할 것을 수술 전으로 옮기는 것이 이 방식의 요점입니다." />
                </p>
              </div>
            </Card>

            <div className="reveal grid content-start gap-5">
              {DIGITAL_BENEFITS.map((b, i) => (
                <Card key={b.title} className="p-7">
                  <div className="flex items-start gap-4">
                    <NumChip n={i + 1} />
                    <div>
                      <h3 className="display-sm text-[18px] tracking-[-0.01em] text-ink">{b.title}</h3>
                      <p className="mt-2.5 text-[15.5px] leading-[1.85] text-ink-soft"><Sentences text={b.body} /></p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 03 — 어떻게 하나 */}
      <section className="border-y border-brand-200/60 bg-wine-soft/50 py-24 lg:py-32">
        <Container>
          <SectionHead id="시술-방법" n="03" label="시술 방법" title="네 단계로 진행합니다" />

          <div className="relative mt-14">
            <span
              aria-hidden
              className="line-in absolute top-[13px] right-0 left-0 hidden h-px bg-brand-300/70 lg:block"
            />
            <ol className="reveal-stack relative grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {IMPLANT_STEPS.map((s) => (
                <li key={s.step} className="reveal flex h-full flex-col">
                  <div className="mb-6 flex items-center">
                    <NumChip n={s.step} />
                  </div>
                  <Card className="img-in flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-[4/3] shrink-0 bg-brand-100">
                      <Image
                        src={s.image}
                        alt={s.alt}
                        fill
                        sizes="(min-width: 1024px) 300px, (min-width: 640px) 47vw, calc(100vw - 40px)"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="display-sm text-[17.5px] tracking-[-0.01em] text-ink">{s.title}</h3>
                      <p className="mt-2.5 text-[15px] leading-[1.8] text-ink-soft"><Sentences text={s.body} /></p>
                    </div>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 04 — 판단 근거 */}
      <section className="py-24 lg:py-32">
        <Container>
          <SectionHead id="방식-비교" n="04" label="방식 비교" title={IMPLANT_COMPARE.caption} />

          <div className="reveal-stack mt-14 grid gap-5 lg:grid-cols-2">
            {(['legacy', 'digital'] as const).map((key, ci) => (
              <Card
                key={key}
                lift={ci === 1}
                className={ci === 1 ? 'reveal border-clay-500/30 bg-clay-tint/30 p-8' : 'reveal p-8'}
              >
                <p className={`text-[17px] font-black ${ci === 1 ? 'text-clay-700' : 'text-ink-soft'}`}>
                  {IMPLANT_COMPARE.columns[ci]}
                </p>
                <dl className="mt-7 space-y-5">
                  {IMPLANT_COMPARE.rows.map((r) => (
                    <div key={r.label} className="border-t border-brand-200/70 pt-4 first:border-0 first:pt-0">
                      <dt className="text-[13.5px] font-black text-ink-muted">{r.label}</dt>
                      <dd className="mt-1.5 text-[16px] leading-[1.8] text-ink">{r[key]}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            ))}
          </div>

          {/* ⚠️ 이 단서를 지우지 말 것 — 카드 두 장만 두면 '디지털이 항상 낫다' 로 읽힌다. */}
          <p className="reveal mt-8 max-w-[74ch] text-[14.5px] leading-[1.9] text-ink-muted">
            <Sentences text={IMPLANT_COMPARE.note} />
          </p>
        </Container>
      </section>

      {/*
        06 — 실제 결과 (치료 증례).
        ⚠️⚠️ 게시 조건이 걸려 있다. lib/implantCases.ts 머리말을 반드시 읽을 것 ⚠️⚠️
          치료 전후 사진은 의료법 제56조가 제한하는 광고 유형이다. 오너 지시로 게시하되
          ① 치료 기간을 그대로 적고 ② 하단 고지를 함께 렌더하며 ③ 집계 표현을 쓰지 않는다.
          셋 중 하나라도 빼지 말 것.
      */}
      <section id="치료-증례" className="scroll-mt-36 pb-24 lg:pb-32">
        <Container>
          <DarkPanel className="px-7 py-16 sm:px-12 lg:px-16 lg:py-20">
            <SectionHead
              n="05"
              label="치료 증례"
              tone="dark"
              title="실제로 이런 경우를 봤습니다"
              desc="다른 곳에서 어렵다는 말을 들은 경우도 원인부터 확인하면 길이 생기기도 합니다. 아래는 그런 두 경우입니다."
            />

            <div className="reveal-stack mt-14 space-y-8">
              {IMPLANT_CASES.map((c) => (
                <GlassCard key={c.no} as="div" className="reveal p-7 sm:p-9">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="rounded-lg bg-white/12 px-2.5 py-1 text-[13.5px] font-black tracking-[0.06em] text-clay-300">
                      {c.no}
                    </span>
                    {/* 기간을 숨기면 '금방 끝난다' 는 인상을 준다 — 원문 값을 그대로 적는다. */}
                    <span className="text-[13.5px] font-bold text-brand-300">치료 기간 {c.period}</span>
                  </div>
                  <h3 className="display-sm mt-5 max-w-[30em] text-[18px] leading-[1.5] text-white sm:text-[20px]">
                    {c.title}
                  </h3>
                  <ul className="mt-7 grid gap-4 sm:grid-cols-3">
                    {c.images.map((im) => (
                      <li key={im.src}>
                        <div className="img-in relative aspect-[16/10] overflow-hidden rounded-xl card-glass/5 ring-1 ring-white/10 ring-inset">
                          <Image
                            src={im.src}
                            alt={im.alt}
                            fill
                            sizes="(min-width: 640px) 300px, calc(100vw - 80px)"
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-2.5 text-[13.5px] font-bold text-brand-300"><Sentences text={im.caption} /></p>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>

            {/* ⚠️ 증례와 항상 함께 렌더한다. 따로 떼지 말 것. */}
            <p className="reveal mt-10 max-w-[76ch] text-[14px] leading-[1.9] text-brand-300">
              {CASE_NOTICE}
            </p>
          </DarkPanel>
        </Container>
      </section>

      {/* 06 — 원칙 */}
      <section className="border-y border-brand-200/60 bg-wine-soft/50 py-24 lg:py-32">
        <Container>
          <SectionHead
            id="진료-원칙"
            n="06"
            label="진료 원칙"
            title="심는 것보다 오래 쓰는 것을 먼저 봅니다"
          />
          <ul className="reveal-stack mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {IMPLANT_STRENGTHS.map((s, i) => (
              <Card as="li" key={s.title} className="reveal p-7">
                <NumChip n={String(i + 1).padStart(2, '0')} />
                <h3 className="display-sm mt-5 text-[18px] tracking-[-0.01em] text-ink">{s.title}</h3>
                <p className="mt-2.5 text-[15.5px] leading-[1.85] text-ink-soft"><Sentences text={s.body} /></p>
              </Card>
            ))}
          </ul>
        </Container>
      </section>

      {/* 원장이 내건 문장 */}
      <section className="py-24 lg:py-32">
        <Container>
          <DarkPanel className="reveal px-8 py-16 sm:px-14 lg:px-16 lg:py-24">
            {/*
              ⚠️⚠️ 폭 제한은 **글자와 같은 요소**에 건다 ⚠️⚠️
                전에는 blockquote(16px)에 max-w-[24ch] 를 걸고 글자는 안쪽 p 의 42px 였다.
                ch 는 그 요소의 font-size 기준이라 폭이 225px 로 잠겼고, 거기에 42px 글씨가
                들어가 **일곱 줄**로 쪼개졌다(실측).
              ⚠️ 그리고 한글에는 ch 를 쓰지 않는다 — ch 는 숫자 0 의 폭(이 폰트에서 0.68em)이라
                 한글 한 글자(1em)보다 좁다. 20ch 라고 적으면 한글은 13자밖에 안 들어간다.
                 한글 제목의 줄 수를 맞출 때는 **em** 으로 적을 것. 45자를 두 줄로 두려면 22em.
            */}
            <blockquote>
              <p className="display-sm max-w-[22em] text-[clamp(28px,4.2vw,46px)] leading-[1.34] tracking-[-0.03em] text-white">
                <Sentences text="자연치아를 살리기 위해 노력하며, 임플란트는 마지막 선택이 될 수 있도록 합니다." />
              </p>
            </blockquote>

            {/*
              보조 문장과 버튼을 한 줄로 나눠 오른쪽 빈 자리를 채운다.
              큰 인용문 아래에 둘 다 왼쪽으로 붙이면 패널 오른쪽 절반이 통째로 비어 보인다.
            */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-8 border-t border-white/12 pt-8">
              <p className="max-w-[34em] text-[17px] leading-[1.9] text-brand-200">
                장기적인 예후까지 생각한 계획으로 고민과 걱정을 덜어 드리겠습니다.
              </p>
              <Link
                href="/treatment/save-natural-tooth"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-parchment px-7 py-3.5 text-[16px] font-black text-ink transition-colors hover:bg-brand-100"
              >
                자연치아 살리기 먼저 보기 <span aria-hidden>→</span>
              </Link>
            </div>
          </DarkPanel>
        </Container>
      </section>

      {/* 07 — 얼마나 걸리나 */}
      {journey && (
        <section className="border-y border-brand-200/60 bg-wine-soft/50 py-24 lg:py-32">
          <Container>
            <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
              <div className="lg:sticky lg:top-40 lg:self-start">
                <SectionHead
                  id="진행-순서"
                  n="07"
                  label="진행 순서"
                  title="몇 번에 걸쳐 어떻게 진행되나요?"
                  desc={journey.answer}
                />
                <dl className="reveal mt-9 flex gap-x-10">
                  <div>
                    <dt className="text-[13.5px] font-bold text-clay-700">내원 횟수</dt>
                    <dd className="mt-1.5 text-[20px] font-black tracking-[-0.02em] text-ink">
                      {journey.visits}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[13.5px] font-bold text-clay-700">치료 기간</dt>
                    <dd className="mt-1.5 text-[20px] font-black tracking-[-0.02em] text-ink">
                      {journey.duration}
                    </dd>
                  </div>
                </dl>
              </div>

              <ol className="reveal-stack space-y-4">
                {journey.steps.map((st, i) => (
                  <Card as="li" key={st.label} className="reveal p-6">
                    <div className="flex items-start gap-4">
                      <NumChip n={String(i + 1).padStart(2, '0')} />
                      <div>
                        <h3 className="display-sm text-[17.5px] tracking-[-0.01em] text-ink">
                          {st.label}
                        </h3>
                        <p className="mt-2 text-[15.5px] leading-[1.8] text-ink-soft">{st.what}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </ol>
            </div>

            {journey.variables.length ? (
              <p className="reveal mt-12 max-w-[74ch] text-[14.5px] leading-[1.9] text-ink-muted">
                기간이 늘어나는 경우도 있습니다. {journey.variables.join(' ')}
              </p>
            ) : null}
          </Container>
        </section>
      )}

      {/* 빠진 치아를 대신하는 방법 */}
      <section className="py-24 lg:py-32">
        <Container>
          <ComparisonTable data={MISSING_TOOTH_OPTIONS} />
        </Container>
      </section>

      {/*
        ★ 자주 묻는 질문의 정본은 /faq 가 갖는다 (2026-08-27 오너 지시 — 페이지가 너무 길다).
        ⚠️ FAQPage 구조화 데이터도 함께 옮겼다. 화면에서 뺐는데 스키마만 남기면 보이지 않는
           내용을 주장하는 꼴이 된다. 되살리려면 둘을 같이 옮길 것.
      */}
      <section className="border-y border-brand-200/60 bg-wine-soft/50 py-16 lg:py-24">
        <Container>
          <Link href="/faq#implant" className="reveal group block">
            <Card className="flex flex-wrap items-center justify-between gap-6 p-8 transition-all group-hover:border-clay-400 group-hover:shadow-[var(--shadow-lift)]">
              <div>
                <p className="text-[13.5px] font-black text-clay-700">자주 묻는 질문</p>
                <p className="mt-2.5 text-[19px] font-black tracking-[-0.015em] text-ink">
                  임플란트에 대해 많이 묻는 것 {t.qa.length}가지
                </p>
                <p className="mt-2 text-[15.5px] leading-[1.8] text-ink-soft">
                  기간과 횟수, 통증, 뼈이식, 건강보험까지 한자리에 모아 두었습니다.
                </p>
              </div>
              <span className="shrink-0 text-[16px] font-black text-clay-700">
                전체 보기 <span aria-hidden>→</span>
              </span>
            </Card>
          </Link>
        </Container>
      </section>

      {/* 09 — 사후 */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <Card lift className="reveal img-in overflow-hidden">
              <div className="relative aspect-[4/3] bg-brand-100">
                <Image
                  src="/img/clinic/implant-aftercare.webp"
                  alt="상담실에서 원장이 모니터의 파노라마 영상을 보며 임플란트 부품을 환자에게 설명하는 모습."
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
              </div>
            </Card>
            <div>
              <SectionHead
                id="주의사항"
                n="09"
                label="수술 후 주의사항"
                title="심은 다음 며칠이 결과를 좌우합니다"
              />
              <ol className="reveal-stack mt-10 space-y-5">
                {IMPLANT_AFTERCARE.map((a, i) => (
                  <li key={a} className="reveal flex gap-4">
                    <NumChip n={String(i + 1).padStart(2, '0')} />
                    <p className="text-[16.5px] leading-[1.85] text-ink-soft">{a}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* 세부 주제 */}
      <section className="border-y border-brand-200/60 bg-wine-soft/50 py-24 lg:py-32">
        <Container>
          <SectionHead n="10" label="더 자세히" title="임플란트, 나눠서 더 보기" />
          <div className="reveal-stack mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {IMPLANT_TOPICS.map((o) => (
              <Link key={o.slug} href={`/treatment/implant/${o.slug}`} className="reveal group">
                <Card className="flex h-full flex-col p-7 transition-all group-hover:-translate-y-1 group-hover:border-clay-400 group-hover:shadow-[var(--shadow-lift)]">
                  <h3 className="display-sm text-[17.5px] tracking-[-0.01em] text-ink group-hover:text-clay-700">
                    {o.name}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[15px] leading-[1.8] text-ink-soft">{o.tagline}</p>
                  <span className="mt-6 text-[14.5px] font-black text-clay-700">
                    자세히 보기 <span aria-hidden>→</span>
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 관련 증상 */}
      {related.length > 0 && (
        <section className="py-16 lg:py-24">
          <Container>
            <h2 className="display-sm reveal text-[19px] tracking-[-0.01em] text-ink">
              이런 증상이라면 함께 보세요
            </h2>
            <div className="reveal mt-6 flex flex-wrap gap-2.5">
              {related.map((s) => (
                <Link
                  key={s!.slug}
                  href={`/insight/symptom/${s!.slug}`}
                  className="rounded-full btn-pane border px-5 py-2.5 text-[15.5px] font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {s!.title}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <Container className="pb-12">
        <div className="max-w-[70ch]">
          <ArticleMeta path={PATH} />
        </div>
        <References items={REFS_CONDITION} />
        <MedicalNotice extra={NO_GUARANTEE_NOTE} />
      </Container>

      {/* 그래서 뭘 하면 되나 */}
      <section className="pb-24">
        <Container>
          <Card lift className="reveal px-8 py-14 sm:px-12">
            <div className="flex flex-wrap items-end justify-between gap-10">
              <div>
                <h2 className="display-sm max-w-[20em] text-[clamp(21px,2.6vw,30px)] leading-[1.3] tracking-[-0.025em] text-ink">
                  심을 수 있는지부터 확인해 보세요
                </h2>
                <p className="mt-5 max-w-[50ch] text-[16.5px] leading-[1.9] text-ink-soft">
                  <Sentences text="뼈의 양과 잇몸 상태에 따라 방법과 기간이 달라집니다. 검사로 확인한 뒤에 무엇이 필요한지 말씀드립니다." />
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={CLINIC.booking.naver}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[16.5px] font-black text-white shadow-[var(--shadow-btn)] transition-colors hover:bg-brand-700"
                >
                  진료 예약하기 <span aria-hidden>→</span>
                </a>
                <a
                  href={CLINIC.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-charcoal/70 px-8 py-4 text-[17px] font-semibold tabular-nums text-charcoal transition-colors hover:bg-charcoal/6"
                >
                  {CLINIC.phone}
                </a>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
