import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CLINIC, NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { treatmentBySlug } from '@/lib/treatments';
import { symptomBySlug } from '@/lib/symptoms';
import { journeyForTreatment } from '@/lib/insight';
import { METHODS, MATERIALS, SHADE_STEPS, RISKS } from '@/lib/aestheticPage';
import { Container, MedicalNotice, Sentences } from '@/components/ui';
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
 * 심미보철 — 크림 종이(MindMarket) 시스템.
 *
 * ★★ 이 페이지만 다른 축을 쓴다 ★★
 *   바탕이 흰색이 아니라 크림 종이(#f5f1e4)이고, 층은 그림자가 아니라 크림→흰색 면 차이로만
 *   만든다. 라운드는 카드·버튼 50px, 사진 상자 64px. 초록은 **구조 강조 전용**이고
 *   코랄은 서비스 단위 행동 버튼 하나에만 쓴다.
 *
 * ★★ 한글 디스플레이 타이포 (2026-08-27 오너: "폰트도 마찬가지") ★★
 *   레퍼런스는 Inter weight 500 을 쓰지만, **한글은 500 으로 크게 키우면 획이 가늘어져
 *   힘이 빠진다.** 라틴 폰트의 500 과 한글 폰트의 500 은 시각 두께가 다르다.
 *   그래서 한글 제목은 700~800 을 쓰고, 자간(-0.05~-0.06em)과 행간(0.98)만 레퍼런스를 따른다.
 *   숫자·영문 라벨은 tabular-nums 로 자리를 고정한다.
 *
 * ★ 내용 원칙 — 기존 홈페이지의 특징 목록은 마케팅 문구라 **판단 근거가 없다**(오너 지적).
 *   원문 사실은 전부 살리되, 삭제량·재료·조건·한계를 함께 적는다. 임상 수치는 표준 지식이고
 *   병원 고유 주장(보유 장비·실적)은 넣지 않는다. 근거는 lib/aestheticPage.ts 머리말 참고.
 * ⚠️ RISKS 섹션을 지우지 말 것 — 부작용과 한계가 빠지면 이 페이지는 광고문이 된다(제56조).
 * ⚠️ app/treatment/[slug] 의 generateStaticParams 에서 crown-prosthesis 를 빼 두었다.
 */

const PATH = '/treatment/crown-prosthesis';
const LEAD =
  '심미보철은 색과 모양만 다루는 치료가 아닙니다. 치아를 얼마나 깎는지, 그 아래 남은 구조가 힘을 견딜 수 있는지가 결과와 수명을 함께 정합니다.';

export const metadata: Metadata = {
  title: '심미보철',
  description: LEAD.slice(0, 155),
  alternates: { canonical: PATH },
  openGraph: og({ title: withLocality('심미보철'), description: LEAD.slice(0, 155), path: PATH }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
  { name: '심미보철', path: PATH },
];

const DOC_IMAGE = {
  src: '/img/clinic/aes-consult.webp',
  caption: '상담실에서 원장이 환자에게 보철 치료 계획을 설명하는 모습',
  width: 1280,
  height: 853,
};

/** 막대 길이 기준 — 가장 큰 삭제량(1.5mm)을 100% 로 둔다. */
const MAX_MM = 1.5;

export default function CrownProsthesisPage() {
  const t = treatmentBySlug('crown-prosthesis');
  if (!t) throw new Error('crown-prosthesis 진료 데이터 없음 — lib/treatments.ts');
  const journey = journeyForTreatment('crown-prosthesis');
  const related = t.relatedSymptoms.map(symptomBySlug).filter(Boolean);

  return (
    <div className="bg-paper text-inkw">
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: withLocality('심미보철'),
            description: LEAD,
            path: PATH,
            about: { type: 'MedicalProcedure', name: '심미보철' },
            image: DOC_IMAGE,
          }),
          imageObjectSchema({ path: PATH, ...DOC_IMAGE }),
          articleSchema({
            path: PATH,
            title: '심미보철',
            description: LEAD,
            wordCount: charCount(LEAD, METHODS.flatMap((m) => m.requires).join('')),
            keywords: ['심미보철', '라미네이트', '올세라믹', '지르코니아', '치아 삭제량'],
            hasImage: true,
          }),
        ]}
      />

      {/* ── 히어로 ─────────────────────────────────────────────────── */}
      {/* ⚠️ 음수 margin + 같은 값의 padding — 띠가 헤더 뒤까지 올라간다(다른 페이지와 같은 수치). */}
      <section className="-mt-[68px] pt-[124px] pb-20 sm:-mt-[94px] sm:pt-[150px] lg:pb-24">
        <Container>
          <nav aria-label="현재 위치" className="text-[16px] text-stone">
            {TRAIL.map((c, i) => (
              <span key={c.path}>
                {i > 0 ? <span aria-hidden className="mx-2">/</span> : null}
                {i === TRAIL.length - 1 ? (
                  <span className="text-inkw">{c.name}</span>
                ) : (
                  <Link href={c.path} className="border-b border-stone/50 transition-colors hover:text-inkw">
                    {c.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <p className="mt-12 flex items-center gap-3 text-[16px] font-bold text-stone">
            <span aria-hidden className="h-3 w-3 rounded-full bg-grass" />
            고양 화정동 심미보철 · 라미네이트 · 올세라믹
          </p>

          {/*
            ⚠️ 한글 디스플레이는 700 이다. 레퍼런스의 500 을 그대로 쓰면 큰 크기에서 획이
               가늘어져 힘이 빠진다(파일 머리말 참고). 자간·행간만 레퍼런스를 따른다.
          */}
          <h1 className="display line-rise reveal mt-6 text-[clamp(32px,5.4vw,62px)] leading-[0.98] tracking-[-0.055em]">
            <span>
              <span>깎는 양이</span>
            </span>
            <span>
              <span>결과를 정합니다</span>
            </span>
          </h1>

          {/*
            ⚠️ 버튼을 오른쪽 끝(lg:justify-end)에 두지 말 것 — 오른쪽 아래 퀵메뉴 패널과
               겹친다(실제로 겹쳤다). 다른 진료 페이지와 같이 본문 아래 왼쪽에 세운다.
          */}
          <div className="mt-12 max-w-[46em]">
            <p className="text-[18px] leading-[1.7] text-inkw">
              <Sentences text={LEAD} />
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-dusk px-8 py-4 text-[17px] font-semibold text-parchment transition-colors hover:bg-twilight"
              >
                진료 예약하기
                <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-grass" />
              </a>
              <a
                href={CLINIC.phoneHref}
                className="inline-flex items-center gap-3 rounded-full border-[1.5px] border-charcoal/70 px-8 py-4 text-[17px] font-semibold tabular-nums text-charcoal transition-colors hover:bg-charcoal/6"
              >
                {CLINIC.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/*
        ★★ 삭제량 비교 — 이 페이지의 임팩트 자리 ★★
          두 방법의 가장 큰 차이는 색도 재료도 아니고 **얼마나 깎느냐** 다. 글자로 적으면
          0.3 과 1.5 의 차이가 안 느껴져서, 막대가 실제 비율대로 자라게 한다(.bar-grow).
        ⚠️ 수치는 범위로만 적는다. 단일 값은 모든 케이스에 그 값이 적용되는 것처럼 읽힌다.
      */}
      <section className="bg-paper-2 py-24 lg:py-32">
        <Container>
          <h2 className="display-sm focus-in max-w-[13em] text-[clamp(28px,4.2vw,46px)] leading-[1.06] tracking-[-0.05em]">
            같은 앞니라도 깎는 두께가 세 배까지 차이 납니다
          </h2>

          <div className="mt-16 space-y-12">
            {METHODS.map((m) => (
              <div key={m.key}>
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <p className="text-[19px] font-bold">{m.name}</p>
                  <p className="text-[16px] text-stone">{m.reduction.label}</p>
                </div>
                <div className="mt-4 h-11 w-full overflow-hidden rounded-full bg-parchment">
                  <span
                    className={`bar-grow h-full rounded-full ${m.key === 'veneer' ? 'bg-grass' : 'bg-coral'}`}
                    style={{ ['--w' as string]: `${(m.reduction.max / MAX_MM) * 100}%` }}
                  />
                </div>
                <p className="mt-4 text-[clamp(26px,3vw,38px)] leading-none font-extrabold tracking-[-0.04em] tabular-nums">
                  {m.reduction.min}–{m.reduction.max}
                  <span className="ml-2 text-[17px] font-bold text-stone">mm</span>
                </p>
              </div>
            ))}
          </div>

          <p className="mt-14 max-w-[38em] text-[18px] leading-[1.7] text-stone">
            깎은 치아 구조는 돌아오지 않습니다. 그래서 덜 깎는 방법이 가능한지부터 확인하고,
            그것으로 버티지 못하는 자리에만 더 깎는 방법을 씁니다.
          </p>
        </Container>
      </section>

      {/* 사진 */}
      <Container className="pt-20 lg:pt-28">
        <div className="img-in reveal overflow-hidden rounded-[64px]">
          <div className="relative aspect-[3/1]">
            <Image
              src="/img/clinic/aes-consult.webp"
              alt="상담실에서 원장이 모니터를 함께 보며 환자에게 보철 치료 계획을 설명하는 모습."
              fill
              priority
              sizes="(min-width: 1320px) 1256px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>

      {/* ── 두 방법: 조건과 한계까지 ────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <h2 className="display-sm reveal max-w-[12em] text-[clamp(28px,4.2vw,46px)] leading-[1.06] tracking-[-0.05em]">
            무엇이 가능한지는 남은 치아가 정합니다
          </h2>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {METHODS.map((m) => (
              <article key={m.key} className="rounded-[50px] card-glass p-8 sm:p-11">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`h-3 w-3 rounded-full ${m.key === 'veneer' ? 'bg-grass' : 'bg-coral'}`}
                  />
                  <p className="text-[16px] font-bold text-stone">{m.tag}</p>
                </div>
                <h3 className="display-sm mt-6 text-[clamp(28px,4.2vw,46px)] leading-[1.08] tracking-[-0.05em]">
                  {m.name}
                </h3>
                <p className="mt-6 text-[18px] leading-[1.65]">{m.def}</p>

                <div className="mt-10 img-in overflow-hidden rounded-[36px]">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={m.key === 'veneer' ? '/img/clinic/aes-veneer.webp' : '/img/clinic/aes-chairside.webp'}
                      alt={
                        m.key === 'veneer'
                          ? '장갑 낀 손이 얇은 세라믹 보철물을 다루고 있는 근접 사진.'
                          : '진료실에서 원장과 진료 보조 인력이 벽에 걸린 파노라마 영상을 보며 진료하는 모습.'
                      }
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* 조건 — 원문에 없던 판단 근거. 이 카드에서 가장 중요한 부분이다. */}
                <p className="mt-10 text-[14px] font-bold tracking-[0.06em] text-stone">가능한 조건</p>
                <ul className="mt-5 space-y-5">
                  {m.requires.map((r, i) => (
                    <li key={r} className="flex gap-4">
                      <span className="mt-[5px] text-[14px] font-bold text-stone tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[17.5px] leading-[1.65]">{r}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-10 text-[14px] font-bold tracking-[0.06em] text-stone">이런 경우에 검토합니다</p>
                <ul className="mt-5 space-y-3">
                  {m.indications.map((v) => (
                    <li key={v} className="flex gap-3 text-[17.5px] leading-[1.6]">
                      <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-inkw" />
                      {v}
                    </li>
                  ))}
                </ul>

                {/* ⚠️ 한계 — 지우지 말 것. 이것이 빠지면 광고문이 된다. */}
                <div className="mt-10 rounded-[28px] bg-paper p-7">
                  <p className="text-[14px] font-bold tracking-[0.06em] text-stone">알아 두실 점</p>
                  <ul className="mt-4 space-y-3">
                    {m.limits.map((l) => (
                      <li key={l} className="text-[17px] leading-[1.65] text-inkw">
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 재료 ────────────────────────────────────────────────────── */}
      <section className="bg-paper-2 py-24 lg:py-32">
        <Container>
          <h2 className="display-sm reveal max-w-[12em] text-[clamp(28px,4.2vw,46px)] leading-[1.06] tracking-[-0.05em]">
            자리마다 유리한 재료가 다릅니다
          </h2>
          <p className="reveal mt-8 max-w-[36em] text-[18px] leading-[1.7] text-stone">
            앞니는 빛이 통과하는 정도가, 어금니는 씹는 힘을 견디는 강도가 먼저입니다. 하나로
            정해 두면 한쪽이 손해를 봅니다.
          </p>

          <ul className="reveal-stack mt-16 grid gap-6 lg:grid-cols-3">
            {MATERIALS.map((m) => (
              <li key={m.name} className="reveal rounded-[50px] card-glass p-8 sm:p-10">
                <p className="text-[14px] font-bold tracking-[0.06em] text-stone">{m.where}</p>
                <h3 className="display-sm mt-5 text-[26px] leading-[1.1] tracking-[-0.04em]">
                  {m.name}
                </h3>
                <p className="mt-5 text-[17.5px] leading-[1.65]">{m.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── 색 맞추기 ───────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <h2 className="display-sm reveal max-w-[9em] text-[clamp(28px,4.2vw,46px)] leading-[1.06] tracking-[-0.05em]">
                색은 마지막이 아니라 순서의 문제입니다
              </h2>
              <p className="reveal mt-8 max-w-[26em] text-[18px] leading-[1.7] text-stone">
                보철은 나중에 색이 변하지 않습니다. 그래서 무엇을 먼저 하느냐가 결과를 가릅니다.
              </p>
              <div className="img-in reveal mt-12 overflow-hidden rounded-[64px]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/img/clinic/aes-scanner.webp"
                    alt="진료실 구강 스캐너 화면에 위아래 치열의 3차원 스캔 데이터가 표시되어 있다."
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <ol className="reveal-stack space-y-4">
              {SHADE_STEPS.map((s) => (
                <li key={s.n} className="reveal rounded-[50px] card-glass p-8 sm:p-10">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[15px] font-bold text-stone tabular-nums">{s.n}</span>
                    <h3 className="display-sm text-[21px] leading-[1.25] tracking-[-0.03em]">
                      {s.t}
                    </h3>
                  </div>
                  <p className="mt-4 text-[17.5px] leading-[1.7] text-inkw">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/*
        ── 부작용과 한계 ────────────────────────────────────────────
        ⚠️⚠️ 지우지 말 것 — 의료법 제56조. 이 구간이 빠지면 페이지 전체가 광고문이 된다.
      */}
      <section className="bg-paper-2 py-24 lg:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <h2 className="display-sm reveal text-[clamp(28px,4.2vw,46px)] leading-[1.06] tracking-[-0.05em]">
              미리 아셔야 할 것
            </h2>
            <ul className="reveal-stack space-y-5">
              {RISKS.map((r) => (
                <li key={r} className="reveal border-b border-hairline pb-5 text-[17.5px] leading-[1.65] last:border-0 last:pb-0">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── 마무리 ──────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="rounded-[50px] card-glass p-8 sm:p-14">
            <h2 className="display-sm focus-in max-w-[11em] text-[clamp(28px,4.2vw,46px)] leading-[1.08] tracking-[-0.05em]">
              덜 깎고도 되는지부터 봅니다
            </h2>
            <p className="mt-7 max-w-[34em] text-[18px] leading-[1.7] text-stone">
              남은 치아의 양과 무는 힘, 잇몸 상태를 먼저 확인한 뒤에 어떤 방법이 가능한지
              말씀드립니다. 씹는 기능과 잇몸을 정리하는 것이 색과 모양보다 앞섭니다.
            </p>

            {journey ? (
              <dl className="mt-12 flex flex-wrap gap-x-16 gap-y-6 border-t border-inkw pt-8">
                <div>
                  <dt className="text-[16px] text-stone">내원 횟수</dt>
                  <dd className="mt-2 text-[clamp(26px,3vw,38px)] leading-none font-extrabold tracking-[-0.04em] tabular-nums">
                    {journey.visits}
                  </dd>
                </div>
                <div>
                  <dt className="text-[16px] text-stone">치료 기간</dt>
                  <dd className="mt-2 text-[clamp(26px,3vw,38px)] leading-none font-extrabold tracking-[-0.04em] tabular-nums">
                    {journey.duration}
                  </dd>
                </div>
              </dl>
            ) : null}

            <div className="mt-12 flex flex-wrap gap-3">
              {/* 이 시스템에서 가장 강한 색 — 서비스 단위 행동에만 쓴다. */}
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-dusk px-8 py-4 text-[17px] font-semibold text-parchment transition-colors hover:bg-twilight"
              >
                진료 예약하기
                <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-parchment" />
              </a>
              <a
                href={CLINIC.phoneHref}
                className="inline-flex items-center gap-3 rounded-full border border-inkw px-8 py-4 text-[16px] font-bold text-inkw transition-colors hover:bg-paper"
              >
                {CLINIC.phone}
              </a>
            </div>

            <div className="mt-14 grid gap-8 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/faq#crown-prosthesis" className="group">
                <p className="text-[16px] text-stone">자주 묻는 질문</p>
                <p className="mt-2 text-[18px] font-bold">
                  <span className="border-b border-inkw pb-0.5 transition-colors group-hover:border-grass">
                    많이 묻는 것 {t.qa.length}가지
                  </span>
                </p>
              </Link>
              {related.slice(0, 3).map((s) => (
                <Link key={s!.slug} href={`/insight/symptom/${s!.slug}`} className="group">
                  <p className="text-[16px] text-stone">관련 증상</p>
                  <p className="mt-2 text-[18px] font-bold">
                    <span className="border-b border-inkw pb-0.5 transition-colors group-hover:border-grass">
                      {s!.title}
                    </span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container className="pb-20">
        <div className="max-w-[46em]">
          <ArticleMeta path={PATH} />
        </div>
        <References items={REFS_TREATMENT} />
        <MedicalNotice extra={NO_GUARANTEE_NOTE} />
      </Container>

      {/* 닫는 띠 — 이 시스템의 마감. */}
      <div aria-hidden className="h-16 bg-sun sm:h-20" />
    </div>
  );
}
