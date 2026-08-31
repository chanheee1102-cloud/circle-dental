import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CLINIC, NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { treatmentBySlug } from '@/lib/treatments';
import { symptomBySlug } from '@/lib/symptoms';
import { journeyForTreatment } from '@/lib/insight';
import { Container, MedicalNotice, Sentences, Breadcrumb } from '@/components/ui';
import { BeforeAfter } from '@/components/BeforeAfter';
import { JsonLd } from '@/components/JsonLd';
import { ArticleMeta, References, charCount } from '@/components/article';
import { REFS_TREATMENT } from '@/lib/references';
import {
  breadcrumbSchema,
  medicalWebPageSchema,
  articleSchema,
  og,
  imageObjectSchema,
  withLocality,
} from '@/lib/seo';

/**
 * 충치치료 — 어두운 제품 페이지.
 *
 * ★★ 왜 이 페이지만 어두운가 (2026-08-27, 오너가 Vercel 랜딩을 레퍼런스로 지목) ★★
 *   앞 판본은 밝은 카드 레이아웃이었는데 "배치가 마음에 안 든다" 는 지적을 받았다.
 *   요구는 **제품 사이트 문법** 이었다 — 어두운 바탕, 가운데 정렬 히어로, 배경의 빛 번짐,
 *   좌우로 번갈아 오는 설명 블록, 어두운 카드 위에 뜨는 화면.
 *
 * ★ 이 진료에 특히 잘 맞는 이유가 있다 — **방사선 사진과 구강 내 사진은 원래 어둡다.**
 *   밝은 바탕에서는 사진 주변이 하얗게 떠서 사진이 구멍처럼 보이는데, 어두운 바탕에서는
 *   사진이 화면에 녹아들면서 오히려 선명해진다.
 *
 * ⚠️ 순검정을 쓰지 않는다. 이 사이트는 웜 뉴트럴 축이라 순검정을 깔면 색이 튄다.
 *    바탕은 globals.css 의 --color-night(#171512) 이고 brand 축과 같은 색상각이다.
 * ⚠️ 빛 번짐 색도 남의 것을 쓰지 않는다 — Vercel 은 보라·초록이지만 여기서는 clay 와
 *    수술포의 청록만 쓴다. 색까지 따라 하면 그 사이트가 된다.
 *
 * ★ 문구는 확인되는 사실만. 근거는 lib/clinic.ts(주소·전화), lib/doctors.ts(자격),
 *   기존 홈페이지 원문(MTA·1회법·2회법·증례 사진).
 * ⚠️ 증례 사진은 의료법 제56조가 제한하는 유형이다 — CASE_NOTE 를 지우지 말 것.
 * ⚠️ 원본 증례 사진은 220x175 뿐이다. 크게 늘리면 뭉갠다.
 * ⚠️ app/treatment/[slug] 의 generateStaticParams 에서 cavity 를 빼 두었다.
 */

const PATH = '/treatment/cavity';
const LEAD =
  '충치가 신경까지 닿으면 보통 신경을 전부 제거합니다. 동그라미치과에서는 그 전에 MTA로 노출된 신경을 덮어 치아의 생명력을 유지시키는 직접치수복조술을 먼저 검토합니다.';

/** ⚠️ 증례와 항상 함께 렌더한다. 따로 떼지 말 것. */
const CASE_NOTE =
  '위 증례는 해당 환자분의 치료 결과이며, 신경의 노출 정도와 감염 상태에 따라 적용 여부와 경과는 사람마다 다릅니다. 충치치료에는 시린 증상, 수복물 탈락, 신경 염증 진행 등의 가능성이 있습니다. 어떤 방법이 맞는지는 검사 후 상담에서 안내드립니다.';

export const metadata: Metadata = {
  title: '충치치료',
  description: LEAD.slice(0, 155),
  alternates: { canonical: PATH },
  openGraph: og({ title: withLocality('충치치료'), description: LEAD.slice(0, 155), path: PATH }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
  { name: '충치치료', path: PATH },
];

const DOC_IMAGE = {
  src: '/img/scene/cavity-review.webp',
  caption: '원장이 모니터의 치아 방사선 사진에서 깊은 충치 부위를 짚어 확인하는 모습',
  width: 1536,
  height: 1024,
};

/** 히어로 아래 3칸 — 기존 홈페이지 원문에서 확인되는 것만. */
const STRIP = [
  { k: '1회법', t: '레진', d: '충치를 제거한 자리에 치아색 재료를 채우고 빛으로 굳혀 그날 마무리합니다.' },
  { k: '2회법', t: '인레이', d: '본을 뜨고 밖에서 만든 수복물을 다음 내원 때 끼웁니다. 넓게 파인 자리에 씁니다.' },
  { k: '신경 보존', t: 'MTA', d: '신경이 드러났을 때 전부 제거하는 대신 덮어 두어 치아의 생명력을 유지시킵니다.' },
];

const DEPTHS = [
  { n: '01', layer: '법랑질', body: '가장 단단한 바깥층이 녹기 시작한 단계입니다. 아직 아프지 않아 검진에서 발견되는 경우가 많습니다.', cure: '레진으로 그날 마무리' },
  { n: '02', layer: '상아질', body: '법랑질보다 무른 층이라 여기부터 빠르게 넓어집니다. 찬 것에 시리기 시작합니다.', cure: '넓으면 인레이' },
  { n: '03', layer: '치수', body: '가만히 있어도 욱신거리는 단계입니다. 보통은 신경을 전부 제거하지만 예외가 있습니다.', cure: 'MTA 또는 신경치료' },
];

const CASE_ROWS = [
  { n: 'A', t: '치료 전', d: '어금니 안쪽으로 충치의 어두운 그림자가 신경이 있는 방까지 내려와 있습니다.' },
  { n: 'B', t: '충치 제거 후', d: '썩은 부분을 걷어 내자 신경이 드러났고, 그 자리를 흰색 MTA로 덮었습니다.' },
  { n: 'C', t: '수복', d: 'MTA 위를 치아색 재료로 채워 씹을 수 있는 형태로 마무리했습니다.' },
  { n: 'D', t: '치료 후', d: '신경을 제거하지 않은 채로 수복이 끝났습니다. 뿌리 속 관은 그대로 남아 있습니다.' },
];

export default function CavityPage() {
  const t = treatmentBySlug('cavity');
  if (!t) throw new Error('cavity 진료 데이터 없음 — lib/treatments.ts');
  const journey = journeyForTreatment('cavity');
  const related = t.relatedSymptoms.map(symptomBySlug).filter(Boolean);

  return (
    <div className="page-native-dark">
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: withLocality('충치치료'),
            description: LEAD,
            path: PATH,
            about: { type: 'MedicalProcedure', name: '충치치료' },
            image: DOC_IMAGE,
          }),
          imageObjectSchema({ path: PATH, ...DOC_IMAGE }),
          articleSchema({
            path: PATH,
            title: '충치치료',
            description: LEAD,
            wordCount: charCount(LEAD, DEPTHS.map((d) => d.body).join('')),
            keywords: ['충치치료', 'MTA', '직접치수복조술', '레진', '인레이'],
            hasImage: true,
          }),
        ]}
      />

      {/*
        ★★ 히어로 — 가운데 정렬 + 배경의 빛 번짐 ★★
          이 페이지에서만 쓰는 문법이다. 다른 진료 페이지는 밝고 왼쪽 정렬이다.
        ⚠️ 빛 번짐 색은 clay 와 청록만. 남의 사이트 색(보라·초록)을 가져오지 말 것.
      */}
      {/* ⚠️ 음수 margin + 같은 값의 padding — 띠가 헤더 뒤까지 올라간다. 다른 페이지와 같은 수치다. */}
      <section className="relative isolate -mt-[68px] overflow-hidden bg-night pt-[128px] pb-24 sm:-mt-[94px] sm:pt-[154px] lg:pb-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(56%_42%_at_50%_-6%,rgba(217,164,65,0.18)_0%,transparent_66%)]"
        />
        {/* 미세 노이즈 — 큰 어두운 면이 밴딩으로 뭉개지는 것을 막는다. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          }}
        />

        <Container className="relative text-center">
          {/* ⚠️ 손으로 다시 그리지 말 것 — 공용 부품이라야 규칙이 바뀔 때 같이 따라온다. */}
          <div className="mb-10 flex justify-center">
            <Breadcrumb trail={TRAIL} tone="dark" />
          </div>

          <p className="enter text-[13.5px] font-black text-clay-300" style={{ animationDelay: '40ms' }}>
            고양 화정동 충치치료 · 보건복지부 인정 통합치의학과 전문의
          </p>

          {/* 줄마다 아래에서 밀려 올라온다(.line-rise) — 흔한 페이드업과 다르다. */}
          <h1 className="line-rise reveal display-sm mx-auto mt-7 max-w-[16em] text-[clamp(32px,5.4vw,62px)] leading-[1.14] tracking-[-0.035em] text-parchment">
            <span>
              <span>신경까지 닿은 충치도,</span>
            </span>
            <span>
              <span>신경을 살려 두는 방법부터</span>
            </span>
          </h1>

          <p
            className="enter mx-auto mt-8 max-w-[34em] text-[18px] leading-[1.9] text-parchment/85"
            style={{ animationDelay: '320ms' }}
          >
            <Sentences text={LEAD} />
          </p>

          <div
            className="enter mt-10 flex flex-wrap justify-center gap-3"
            style={{ animationDelay: '440ms' }}
          >
            <a
              href={CLINIC.booking.naver}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-wine-bg px-8 py-4 text-[17px] font-semibold text-dusk transition-colors hover:bg-mist"
            >
              진료 예약하기 <span aria-hidden>→</span>
            </a>
            <a
              href={CLINIC.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-parchment/80 px-8 py-4 text-[17px] font-semibold tabular-nums text-parchment transition-colors hover:bg-white/10"
            >
              {CLINIC.phone}
            </a>
          </div>

          {/* 히어로 아래 화면 — 어두운 카드 위에 뜨는 사진. */}
          <div className="reveal img-in mx-auto mt-16 max-w-[62rem] overflow-hidden rounded-[20px] border border-white/12 card-glass/[0.04] p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] lg:mt-20">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[13px]">
              <Image
                src="/img/scene/cavity-review.webp"
                alt="원장이 책상에서 모니터에 띄운 치아 방사선 사진 중 깊은 충치가 있는 어금니를 펜으로 짚어 확인하는 모습."
                fill
                priority
                sizes="(min-width: 1024px) 992px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 3칸 띠 — 한 단 올린 어두운 면. */}
      <section className="border-y border-white/8 bg-night-2 py-12 lg:py-16">
        <Container>
          <ul className="reveal-stack grid gap-10 sm:grid-cols-3">
            {STRIP.map((f) => (
              <li key={f.t} className="reveal">
                <p className="text-[11.5px] font-black tracking-[0.06em] text-clay-400">{f.k}</p>
                <p className="mt-2.5 text-[19px] font-black tracking-[-0.02em] text-white">{f.t}</p>
                <p className="mt-3 max-w-[24em] text-[15.5px] leading-[1.85] text-brand-300">{f.d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── 좌우 교차 블록 ① 깊이 ─────────────────────────────────── */}
      <section className="bg-night py-24 lg:py-32">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            {/* 왼쪽 — 깊이 세 단계를 어두운 카드로. */}
            <ol className="reveal-stack order-2 space-y-3 lg:order-1">
              {DEPTHS.map((d) => (
                <li
                  key={d.n}
                  className="reveal rounded-2xl border border-white/10 card-glass/[0.045] p-6 ring-1 ring-white/[0.05] ring-inset"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-[13.5px] font-black text-clay-400 tabular-nums">{d.n}</span>
                    <p className="text-[18px] font-black tracking-[-0.02em] text-white">{d.layer}</p>
                  </div>
                  <p className="mt-3 text-[15.5px] leading-[1.85] text-brand-300">{d.body}</p>
                  <p className="mt-4 inline-flex rounded-full bg-clay-400/12 px-3 py-1.5 text-[13.5px] font-black text-clay-300">
                    {d.cure}
                  </p>
                </li>
              ))}
            </ol>

            <div className="order-1 lg:order-2">
              <h2 className="reveal display-sm max-w-[13em] text-[clamp(28px,4.2vw,46px)] leading-[1.22] tracking-[-0.03em] text-white">
                어디까지 갔는지가 치료를 정합니다
              </h2>
              <p className="reveal mt-6 max-w-[30em] text-[17px] leading-[1.95] text-brand-300">
                <Sentences text="충치는 겉의 단단한 층에서 시작해 안쪽으로 들어갑니다. 층마다 무르기가 달라 진행 속도가 바뀌고, 신경이 있는 방에 닿는 순간 치료의 성격이 완전히 달라집니다." />
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 좌우 교차 블록 ② MTA ──────────────────────────────────── */}
      <section className="border-y border-white/8 bg-night-2 py-24 lg:py-32">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="reveal text-[14.5px] font-medium text-clay-300">
                MTA 직접치수복조술
              </p>
              <h2 className="reveal display-sm mt-5 max-w-[13em] text-[clamp(28px,4.2vw,46px)] leading-[1.22] tracking-[-0.03em] text-white">
                신경을 제거하면, 그 치아의 시계가 빨라집니다
              </h2>
              <div className="reveal mt-7 max-w-[32em] space-y-5 text-[17px] leading-[1.95] text-brand-300">
                <p>
                  <Sentences text="신경을 제거하면 함께 지나던 혈관도 사라져 영양 공급이 끊깁니다. 치아가 잘 부서지게 되어 장기적으로 수명이 짧아지고, 씌워야 하는 보철 비용도 올라갑니다." />
                </p>
                <p>
                  <Sentences text="동그라미치과에서는 이를 막기 위해 MTA라는 재료로 노출된 신경을 덮어 치아의 생명력을 유지시키는 직접치수복조술을 시행합니다. 다만 건강보험이 적용되지 않고, 신경의 노출 정도와 감염 상태에 따라 적용 여부가 갈립니다." />
                </p>
              </div>
            </div>

            <div className="reveal-stack grid gap-4">
              <div className="reveal rounded-2xl border border-white/10 card-glass/[0.03] p-7">
                <p className="text-[13.5px] font-black text-brand-400">일반적인 경우</p>
                <p className="mt-3 text-[19px] font-black tracking-[-0.02em] text-white">신경을 전부 제거</p>
                <ul className="mt-5 space-y-2.5 text-[15.5px] leading-[1.8] text-brand-300">
                  <li>혈관도 함께 사라져 영양 공급이 끊깁니다</li>
                  <li>치아가 잘 부서져 씌워서 보강해야 합니다</li>
                  <li>치료 회차와 비용이 늘어납니다</li>
                </ul>
              </div>
              {/* 강조되는 쪽만 clay 로 테를 두른다 — 면으로 칠하지 않는다. */}
              <div className="reveal rounded-2xl border border-clay-400/35 bg-clay-400/[0.07] p-7 ring-1 ring-clay-400/10 ring-inset">
                <p className="text-[13.5px] font-black text-clay-300">조건이 맞을 때</p>
                <p className="mt-3 text-[19px] font-black tracking-[-0.02em] text-white">MTA로 신경을 덮어 둠</p>
                <ul className="mt-5 space-y-2.5 text-[15.5px] leading-[1.8] text-brand-200">
                  <li>신경이 살아 있어 영양 공급이 이어집니다</li>
                  <li>치아를 깎는 양이 줄어듭니다</li>
                  <li>건강보험은 적용되지 않습니다</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/*
        ── 증례 — 가운데 제목 + 어두운 카드 안의 사진 ───────────────
        ★ 방사선 사진과 구강 내 사진은 원래 어둡다. 어두운 바탕에서 사진이 화면에 녹아들어
          밝은 바탕에 놓았을 때보다 훨씬 선명하게 읽힌다. 이 페이지를 어둡게 한 이유 중 하나다.
        ⚠️ 원본이 220x175 뿐이다. 크게 늘리지 말 것 — 앞 판본은 615px 로 띄워 뭉갰다.
        ⚠️⚠️ CASE_NOTE 를 지우지 말 것 — 의료법 제56조.
      */}
      <section className="bg-night py-24 lg:py-32">
        <Container>
          <div className="mx-auto max-w-[38em] text-center">
            <p className="reveal text-[14.5px] font-medium text-clay-300">
              실제 증례
            </p>
            <h2 className="reveal display-sm mt-5 text-[clamp(28px,4.2vw,46px)] leading-[1.22] tracking-[-0.03em] text-white">
              신경을 남긴 채 마무리한 경우
            </h2>
            <p className="reveal mt-5 text-[16.5px] leading-[1.9] text-brand-300">
              경계를 좌우로 끌어 치료 전후 방사선 사진을 겹쳐 보실 수 있습니다.
            </p>
          </div>

          <div className="reveal mx-auto mt-14 max-w-[64rem] rounded-[22px] border border-white/12 card-glass/[0.035] p-6 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] sm:p-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-12">
              <div>
                <BeforeAfter
                  before="/img/clinic/cavity-case-a.webp"
                  after="/img/clinic/cavity-case-d.webp"
                  beforeAlt="치료 전 방사선 사진. 어금니에 깊은 충치와 기존 수복물이 보인다."
                  afterAlt="치료 후 방사선 사진. 신경을 제거하지 않고 수복이 완료된 상태다."
                />
                <ul className="mt-4 grid grid-cols-2 gap-4">
                  {[
                    { src: '/img/clinic/cavity-case-b.webp', alt: '충치를 제거한 뒤 노출된 신경 부위에 흰색 MTA 재료를 덮은 구강 내 사진.' },
                    { src: '/img/clinic/cavity-case-c.webp', alt: 'MTA 위를 수복 재료로 채워 마무리한 구강 내 사진.' },
                  ].map((im) => (
                    <li key={im.src}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/12 bg-night">
                        <Image src={im.src} alt={im.alt} fill sizes="(min-width: 1024px) 180px, 45vw" className="object-cover" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 사진만 두면 무엇이 달라졌는지 모른다 — 네 컷을 각각 짚어 준다. */}
              <div>
                <ol className="space-y-6">
                  {CASE_ROWS.map((r) => (
                    <li key={r.n} className="flex gap-4">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/12 text-[11.5px] font-black text-clay-300">
                        {r.n}
                      </span>
                      <div>
                        <p className="text-[16px] font-black text-white">{r.t}</p>
                        <p className="mt-1.5 text-[15.5px] leading-[1.85] text-brand-300">{r.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-8 border-t border-white/10 pt-6 text-[14px] leading-[1.9] text-brand-400">
                  {CASE_NOTE}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 좌우 교차 블록 ③ 시술 ─────────────────────────────────── */}
      <section className="border-y border-white/8 bg-night-2 py-24 lg:py-32">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="reveal img-in order-2 overflow-hidden rounded-[20px] border border-white/12 card-glass/[0.04] p-2 lg:order-1">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[13px]">
                <Image
                  src="/img/scene/cavity-model-work.webp"
                  alt="장갑 낀 손이 치아 모형의 어금니에 파인 자리를 치아색 재료로 채우고 있고, 옆에 광중합기가 놓여 있다."
                  fill
                  sizes="(min-width: 1024px) 620px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="reveal text-[14.5px] font-medium text-clay-300">치료 방법</p>
              <h2 className="reveal display-sm mt-5 max-w-[13em] text-[clamp(28px,4.2vw,46px)] leading-[1.22] tracking-[-0.03em] text-white">
                당일에 끝내거나, 조각을 만들어 끼우거나
              </h2>
              <p className="reveal mt-6 max-w-[30em] text-[17px] leading-[1.95] text-brand-300">
                <Sentences text="파인 범위가 작으면 치아색 재료를 채워 그날 마무리합니다. 넓게 파여 채우는 것만으로는 버티기 어려운 자리는 본을 떠서 조각을 따로 만들어 끼웁니다." />
              </p>
              {journey ? (
                <dl className="reveal mt-9 flex gap-x-12 border-t border-white/10 pt-7">
                  <div>
                    <dt className="text-[13.5px] font-bold text-clay-400">내원 횟수</dt>
                    <dd className="mt-1.5 text-[22px] font-black tracking-[-0.02em] text-white">{journey.visits}</dd>
                  </div>
                  <div>
                    <dt className="text-[13.5px] font-bold text-clay-400">치료 기간</dt>
                    <dd className="mt-1.5 text-[22px] font-black tracking-[-0.02em] text-white">{journey.duration}</dd>
                  </div>
                </dl>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 마무리 ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-night py-24 lg:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(46%_60%_at_50%_120%,rgba(201,116,78,0.30)_0%,transparent_66%)]"
        />
        <Container className="relative">
          <div className="flex flex-wrap items-end justify-between gap-10">
            <div>
              <h2 className="reveal display-sm max-w-[14em] text-[clamp(28px,4.2vw,46px)] leading-[1.2] tracking-[-0.03em] text-white">
                신경을 살릴 수 있는 상태인지부터 확인하세요
              </h2>
              <p className="reveal mt-6 max-w-[32em] text-[17px] leading-[1.9] text-brand-300">
                같은 깊이라도 신경의 노출 정도와 감염 상태에 따라 방법이 달라집니다. 검사로 확인한
                뒤에 무엇이 가능한지 말씀드립니다.
              </p>
            </div>
            <div className="reveal flex flex-wrap gap-3">
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-wine-bg px-8 py-4 text-[17px] font-semibold text-dusk transition-colors hover:bg-mist"
              >
                진료 예약하기 <span aria-hidden>→</span>
              </a>
              <a
                href={CLINIC.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-parchment/80 px-8 py-4 text-[17px] font-semibold tabular-nums text-parchment transition-colors hover:bg-white/10"
              >
                {CLINIC.phone}
              </a>
            </div>
          </div>

          {/* 이어지는 곳 — 어두운 면 위의 조용한 링크 줄. */}
          <div className="mt-16 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/faq#cavity" className="reveal group">
              <p className="text-[13.5px] font-black text-clay-400">자주 묻는 질문</p>
              <p className="mt-2 text-[16.5px] font-black text-white group-hover:text-clay-300">
                충치치료에 대해 많이 묻는 것 {t.qa.length}가지 <span aria-hidden>→</span>
              </p>
            </Link>
            {related.slice(0, 3).map((s) => (
              <Link key={s!.slug} href={`/insight/symptom/${s!.slug}`} className="reveal group">
                <p className="text-[13.5px] font-black text-clay-400">관련 증상</p>
                <p className="mt-2 text-[16.5px] font-black text-white group-hover:text-clay-300">
                  {s!.title} <span aria-hidden>→</span>
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/*
        ⚠️ 이 페이지는 루트가 조각(fragment)이라 배경이 없는 구간은 **밝은 body** 위에 놓인다.
           앞 구간이 전부 어두운데 여기만 밝으면 페이지가 끊겨 보이므로 bg-night 로 감싼다.
           그리고 어두운 면이 됐으니 tone="dark" 를 넘긴다 — 안 넘기면 어두운 글자가 묻힌다.
      */}
      <div className="bg-night">
      <Container className="py-14">
        <div className="max-w-[46em]">
          <ArticleMeta path={PATH} tone="dark" />
        </div>
        <References items={REFS_TREATMENT} tone="dark" />
        <MedicalNotice extra={NO_GUARANTEE_NOTE} tone="dark" />
      </Container>
      </div>
    </div>
  );
}
