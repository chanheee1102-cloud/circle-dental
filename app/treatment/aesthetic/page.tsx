import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CLINIC, NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { treatmentBySlug } from '@/lib/treatments';
import { symptomBySlug } from '@/lib/symptoms';
import {
  ISOLATION_BODY,
  STEPS,
  PRODUCT_POINTS,
  INDICATIONS,
  WORKS_ON,
  RISKS,
  AFTERCARE,
} from '@/lib/whiteningPage';
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
 * 치아미백 — 실험실(Integrated Biosciences) 시스템으로 만든 페이지.
 *
 * ★★ 이 시스템의 규칙 — 어기면 다른 사이트가 된다 ★★
 *   ① **단일 굵기.** 제목부터 본문까지 전부 400 이다. 위계는 굵기가 아니라 크기와 자간으로만
 *      만든다. 자간은 크기에 비례해 조인다 — 큰 제목 -0.03em, 본문 -0.001em.
 *   ② **그림자 없음.** 깊이는 면 색과 1px 헤어라인으로만 만든다.
 *   ③ **강조는 미세 면에만.** 라임은 40×40 화살표 버튼과 6px 점에서만 쓴다. 큰 면·본문 뒤·
 *      그라디언트 금지. 나머지가 전부 무채색이라 초록이 나타날 때 눈이 그리로 간다.
 *   ④ **순검정은 푸터에만.** 본문 어두운 면은 abyss(#222f30) — 초록 기운을 품은 어두운 색이라
 *      라임과 같은 계열로 읽힌다.
 *   ⑤ 고정폭은 라벨·번호·태그에만. 제목이나 긴 본문에 쓰지 않는다.
 *
 * ⚠️ 레퍼런스는 사진 대신 현미경·분자 렌더를 쓰지만, 여기서는 **병원의 실제 사진**을 쓴다.
 *    기존 홈페이지 자산을 옮기는 것이 이 작업의 전제다(오너 지시). 대신 밝은 라이프스타일
 *    컷(웃는 입·모형 스톡)은 빼고 어두운 시술·제품 사진만 골라 12~16px 라운드에 담았다.
 * ⚠️ 원본을 확대해 늘리지 않는다 — 제품 컷은 625x404 라 그 이상 키우면 뭉갠다.
 * ⚠️ RISKS 를 지우지 말 것. 미백은 개인차와 재착색이 큰 처치라 이것이 빠지면 광고문이 된다.
 * ⚠️ app/treatment/[slug] 의 generateStaticParams 에서 aesthetic 을 빼 두었다.
 */

const PATH = '/treatment/aesthetic';
/* ★ 제목이 던진 분기를 그대로 이어받는다 — 아래 04 구간이 이 이야기를 펼친다. */
const LEAD =
  '미백제는 법랑질 안에 스며든 착색을 분해합니다. 겉에 쌓인 착색은 잘 듣지만, 안쪽에서 온 변색이나 보철물은 같은 방법으로 밝아지지 않습니다. 그래서 원인부터 확인합니다.';

export const metadata: Metadata = {
  title: '치아미백',
  description: LEAD.slice(0, 155),
  alternates: { canonical: PATH },
  openGraph: og({ title: withLocality('치아미백'), description: LEAD.slice(0, 155), path: PATH }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
  { name: '치아미백', path: PATH },
];

const DOC_IMAGE = {
  src: '/img/clinic/wh-light.webp',
  caption: '전용 광조사기의 빛이 미백제를 바른 앞니에 조사되고 있는 모습',
  width: 1920,
  height: 400,
};

/** 이 페이지에서만 쓰는 고정폭 라벨. */
const MONO = 'font-[family-name:var(--font-mono)] tracking-[-0.02em]';

/**
 * 주 행동 버튼.
 * ⚠️ 고정폭 글자 + 라임 사각 화살표였던 것을 홈 규격(알약·16px·semibold)으로 통일했다
 *    (2026-08-28). 이 페이지만 버튼 언어가 달라 다른 사이트처럼 보였다.
 * ⚠️ 색을 반드시 지정한다 — 없으면 body 색을 물려받아 어두운 면에서 사라진다.
 */
function ArrowBtn({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const inner = (
    <>
      {label}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </>
  );
  const cls =
    'group inline-flex items-center gap-2 rounded-full bg-wine-bg px-8 py-4 text-[17px] font-semibold text-dusk transition-colors hover:bg-mist';
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** 구간 번호 — 목차 역할. */
function Counter({ n, total, dark }: { n: string; total: string; dark?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[14px] ${MONO} ${
        dark ? 'border-graphite text-lichen' : 'border-lichen text-graphite'
      }`}
    >
      {n} / {total}
    </span>
  );
}

export default function WhiteningPage() {
  const t = treatmentBySlug('aesthetic');
  if (!t) throw new Error('aesthetic 진료 데이터 없음 — lib/treatments.ts');
  const related = t.relatedSymptoms.map(symptomBySlug).filter(Boolean);

  return (
    <div className="page-native-dark bg-abyss">
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: withLocality('치아미백'),
            description: LEAD,
            path: PATH,
            about: { type: 'MedicalProcedure', name: '치아미백' },
            image: DOC_IMAGE,
          }),
          imageObjectSchema({ path: PATH, ...DOC_IMAGE }),
          articleSchema({
            path: PATH,
            title: '치아미백',
            description: LEAD,
            wordCount: charCount(LEAD, STEPS.map((s) => s.d).join('')),
            keywords: ['치아미백', 'BeauTis', '전문가 미백', '잇몸 격리'],
            hasImage: true,
          }),
        ]}
      />

      {/*
        ★ 히어로 — 어두운 면에 큰 글자만. 제목 위아래로 크게 비운다.
        ⚠️ 굵기를 올리지 말 것. 이 시스템은 400 단일 굵기가 정체성이다.
      */}
      {/* ⚠️ 음수 margin + 같은 값의 padding — 띠가 헤더 뒤까지 올라간다(다른 페이지와 같은 수치). */}
      <section className="-mt-[68px] pt-[128px] pb-24 sm:-mt-[94px] sm:pt-[154px] lg:pb-32">
        <Container>
          <nav aria-label="현재 위치" className={`${MONO} text-[14px] font-bold text-lichen`}>
            {TRAIL.map((c, i) => (
              <span key={c.path}>
                {i > 0 ? <span aria-hidden className="mx-2">/</span> : null}
                {i === TRAIL.length - 1 ? (
                  <span className="text-lichen">{c.name}</span>
                ) : (
                  <Link href={c.path} className="transition-colors hover:text-lichen">
                    {c.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <p className={`mt-14 flex items-center gap-2.5 ${MONO} text-[14px] font-bold text-lichen`}>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
            치아미백 · 고양 화정동
          </p>

          {/*
            ⚠️ 크기를 다시 키우지 말 것. 124px 은 한글에서 두 단어면 한 줄이 차서 화면을
               통째로 먹고, 그 결과가 '커서 비어 보이는' 화면이었다(오너 지적).
            ★ 문구는 멋부린 선언 대신 **실제 임상 분기**를 쓴다 — 겉에 쌓인 색과 안쪽에서
              온 색은 방법이 갈린다. 아래 04 구간이 그 이야기를 이어받는다.
          */}
          <h1 className="display line-rise reveal mt-8 text-[clamp(32px,5.4vw,62px)] leading-[1.08] tracking-[-0.025em] text-parchment">
            <span>
              <span>겉에 쌓인 색인지,</span>
            </span>
            <span>
              <span>안쪽에서 온 색인지.</span>
            </span>
          </h1>

          <p className="mt-12 max-w-[34em] text-[20px] leading-[1.45] font-normal tracking-[-0.006em] text-lichen">
            <Sentences text={LEAD} />
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
            <ArrowBtn href={CLINIC.booking.naver} label="진료 예약하기" external />
            <a
              href={CLINIC.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-parchment/80 px-8 py-4 text-[17px] font-semibold tabular-nums text-parchment transition-colors hover:bg-white/10"
            >
              {CLINIC.phone}
            </a>
          </div>
        </Container>
      </section>

      {/* 시술 장면 — 원본이 1920x400 이라 그 비율 그대로 쓴다(확대 금지). */}
      <Container>
        <div className="img-in reveal overflow-hidden rounded-2xl">
          <div className="relative aspect-[3/1]">
            <Image
              src="/img/clinic/wh-light.webp"
              alt="전용 광조사기의 푸른빛이 미백제를 바른 앞니에 조사되고 있는 모습."
              fill
              priority
              sizes="(min-width: 1320px) 1256px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>

      {/* ── 01 잇몸 격리 — 이 병원이 원문에서 강조한 부분 ─────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <Counter n="01" total="05" dark />
          <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 className="display-sm max-w-[13em] text-[clamp(28px,4.2vw,46px)] leading-[1.1] tracking-[-0.012em] text-white">
                미백제가 닿을 곳과 닿으면 안 될 곳을 먼저 나눕니다.
              </h2>
              <div className="mt-10 max-w-[32em] space-y-6 text-[18px] leading-[1.7] font-normal tracking-[-0.001em] text-lichen">
                {ISOLATION_BODY.map((p) => (
                  <p key={p}>
                    <Sentences text={p} />
                  </p>
                ))}
              </div>
            </div>
            <div className="img-in reveal overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/img/scene/wh-barrier.webp"
                  alt="개구기를 낀 치아 모형의 잇몸 경계를 따라 가느다란 주사기 끝으로 보호막을 도포하는 접사."
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 02 과정 ─────────────────────────────────────────────────── */}
      <section className="border-t border-graphite py-24 lg:py-32">
        <Container>
          <Counter n="02" total="05" dark />
          <h2 className="display-sm mt-10 max-w-[12em] text-[clamp(28px,4.2vw,46px)] leading-[1.1] tracking-[-0.012em] text-white">
            다섯 단계로 진행합니다.
          </h2>

          <ol className="reveal-stack mt-16 divide-y divide-graphite border-y border-graphite">
            {STEPS.map((s) => (
              <li key={s.n} className="reveal grid gap-6 py-9 lg:grid-cols-[6rem_minmax(0,14em)_minmax(0,1fr)] lg:gap-10">
                <span className={`${MONO} text-[14px] font-bold text-lime`}>{s.n}</span>
                <h3 className="display-sm text-[24px] leading-[1.2] tracking-[-0.006em] text-white">
                  {s.t}
                </h3>
                <p className="max-w-[36em] text-[18px] leading-[1.65] font-normal text-lichen">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── 03 제품 — 밝은 면으로 뒤집는다 ─────────────────────────── */}
      <section className="bg-bone py-24 lg:py-32">
        <Container>
          <Counter n="03" total="05" />
          <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
            <h2 className="display-sm max-w-[13em] text-[clamp(28px,4.2vw,46px)] leading-[1.1] tracking-[-0.012em] text-abyss">
              오스템 BeauTis 미백 솔루션을 사용합니다.
            </h2>
            <p className={`${MONO} flex items-center gap-2.5 text-[14px] text-graphite`}>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" />
              PRODUCT
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            {/* 제품 컷 — 원본 625x404. 카드 폭 안에서만 쓰고 늘리지 않는다. */}
            <div className="rounded-[40px] card-glass p-10">
              <div className="img-in reveal overflow-hidden rounded-2xl bg-tissue">
                <div className="relative aspect-[16/10]">
                  <Image
                    src="/img/clinic/wh-kit.webp"
                    alt="오스템 BeauTis 치아미백 시술용 미백제 두 종류의 제품 사진."
                    fill
                    sizes="(min-width: 1024px) 460px, 100vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2">
              {PRODUCT_POINTS.map((p) => (
                <li key={p.t} className="rounded-[20px] border border-lichen card-glass p-8">
                  <p className={`${MONO} text-[14px] font-bold text-graphite`}>{p.k}</p>
                  <h3 className="display-sm mt-4 text-[24px] leading-[1.2] tracking-[-0.006em] text-abyss">
                    {p.t}
                  </h3>
                  <p className="mt-4 text-[18px] leading-[1.6] font-normal text-graphite">{p.d}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* 적응증 — 원문 3가지. */}
          <div className="mt-16 rounded-[40px] bg-tissue p-10 sm:p-14">
            <p className={`${MONO} text-[14px] font-bold text-graphite`}>이런 분들께 권합니다</p>
            <ul className="mt-8 divide-y divide-lichen border-y border-lichen">
              {INDICATIONS.map((v) => (
                <li key={v} className="py-6 text-[20px] leading-[1.4] font-normal tracking-[-0.006em] text-abyss">
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── 04 듣는 착색과 안 듣는 착색 ────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <Counter n="04" total="05" dark />
          <h2 className="display-sm mt-10 max-w-[12em] text-[clamp(28px,4.2vw,46px)] leading-[1.1] tracking-[-0.012em] text-white">
            모든 어두움이 미백으로 밝아지지는 않습니다.
          </h2>
          <p className="mt-8 max-w-[34em] text-[18px] leading-[1.7] font-normal text-lichen">
            미백제는 법랑질 안에 스며든 착색 분자를 분해합니다. 그래서 어두움이 어디서 왔는지에
            따라 듣는 정도가 다르고, 아예 다른 방법이 필요한 경우도 있습니다.
          </p>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {WORKS_ON.map((g, gi) => (
              <div key={g.label} className="rounded-[20px] border border-graphite p-9">
                <p className={`${MONO} flex items-center gap-2.5 text-[14px] text-lichen`}>
                  {gi === 0 ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lime" /> : null}
                  {g.label}
                </p>
                <ul className="mt-8 divide-y divide-graphite border-y border-graphite">
                  {g.items.map((it) => (
                    <li key={it} className="py-5 text-[17.5px] leading-[1.6] font-normal text-white">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="img-in reveal mt-14 overflow-hidden rounded-2xl">
            <div className="relative aspect-[3/1]">
              <Image
                src="/img/scene/wh-shade.webp"
                alt="장갑 낀 손이 치아 색조 가이드를 부채꼴로 펼쳐 들고 모형 치아와 색을 비교하는 접사."
                fill
                sizes="(min-width: 1320px) 1256px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/*
        ── 05 미리 아셔야 할 것 ────────────────────────────────────
        ⚠️⚠️ 지우지 말 것 — 의료법 제56조. 미백은 개인차와 재착색이 큰 처치다.
      */}
      <section className="bg-bone py-24 lg:py-32">
        <Container>
          <Counter n="05" total="05" />
          <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <h2 className="display-sm text-[clamp(28px,4.2vw,46px)] leading-[1.1] tracking-[-0.012em] text-abyss">
              미리 아셔야 할 것.
            </h2>
            <ul className="divide-y divide-lichen border-y border-lichen">
              {RISKS.map((r) => (
                <li key={r} className="py-6 text-[18px] leading-[1.65] font-normal text-graphite">
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 rounded-[40px] card-glass p-10 sm:p-14">
            <p className={`${MONO} text-[14px] font-bold text-graphite`}>미백 후 며칠</p>
            <ul className="mt-8 grid gap-x-12 gap-y-6 sm:grid-cols-2">
              {AFTERCARE.map((a) => (
                <li key={a} className="flex gap-4 text-[17.5px] leading-[1.6] font-normal text-abyss">
                  <span aria-hidden className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── 마무리 ──────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <h2 className="display-sm focus-in max-w-[12em] text-[clamp(28px,4.2vw,46px)] leading-[1.08] tracking-[-0.02em] text-white">
            어떤 착색인지부터 확인하세요.
          </h2>
          <p className="mt-10 max-w-[34em] text-[18px] leading-[1.7] font-normal text-lichen">
            같은 누런색이라도 겉에 쌓인 것인지, 안쪽에서 온 것인지에 따라 방법이 달라집니다.
            보철물이 있는 경우에는 색이 어긋나지 않도록 순서를 먼저 정합니다.
          </p>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5">
            <ArrowBtn href={CLINIC.booking.naver} label="진료 예약하기" external />
            <a
              href={CLINIC.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-parchment/80 px-8 py-4 text-[17px] font-semibold tabular-nums text-parchment transition-colors hover:bg-white/10"
            >
              {CLINIC.phone}
            </a>
          </div>

          <div className="mt-20 grid gap-8 border-t border-graphite pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/faq#aesthetic" className="group">
              <p className={`${MONO} text-[14px] font-bold text-lichen`}>FAQ</p>
              <p className="mt-3 text-[18px] leading-[1.4] font-normal text-white transition-colors group-hover:text-lime">
                많이 묻는 것 {t.qa.length}가지
              </p>
            </Link>
            <Link href="/treatment/crown-prosthesis" className="group">
              <p className="text-[14.5px] font-medium text-lichen">함께 보기</p>
              <p className="mt-3 text-[18px] leading-[1.4] font-normal text-white transition-colors group-hover:text-lime">
                심미보철
              </p>
            </Link>
            {related.slice(0, 2).map((s) => (
              <Link key={s!.slug} href={`/insight/symptom/${s!.slug}`} className="group">
                <p className="text-[14.5px] font-medium text-lichen">증상</p>
                <p className="mt-3 text-[18px] leading-[1.4] font-normal text-white transition-colors group-hover:text-lime">
                  {s!.title}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 검토자·출처·고지 — 순검정 면. 이 시스템에서 검정은 마감을 뜻한다. */}
      <div className="bg-void py-16">
        <Container>
          {/* ⚠️ 글자색만 덮지 말 것 — 카드 배경이 흰색이라 크림 글자가 사라진다(겪은 일). */}
          <div className="max-w-[46em]">
            <ArticleMeta path={PATH} tone="dark" />
          </div>
          <div className="mt-10">
            <References items={REFS_TREATMENT} tone="dark" />
            <MedicalNotice extra={NO_GUARANTEE_NOTE} tone="dark" />
          </div>
        </Container>
      </div>
    </div>
  );
}
