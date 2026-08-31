import Image from 'next/image';
import Link from 'next/link';
import type { Treatment } from '@/lib/treatments';
import type { TreatmentPage } from '@/lib/treatmentPages';
import type { Journey } from '@/lib/insight';
import { CLINIC } from '@/lib/clinic';
import { Container, Breadcrumb, Sentences } from '@/components/ui';
import { SectionHead, Card, NumChip } from '@/components/saas';
import { SectionNav } from '@/components/SectionNav';

/**
 * 진료 랜딩 페이지 — 임플란트에서 만든 언어를 나머지 진료가 함께 쓰는 틀.
 *
 * ★★ 왜 하나로 묶었나 ★★
 *   진료가 아홉이라 페이지를 따로 쓰면 아홉 벌이 조금씩 어긋난다. 실제로 임플란트만
 *   손보는 사이 나머지 여덟이 옛 모양으로 남아 한 사이트로 안 보였다.
 *   내용은 lib/treatmentPages.ts 가 갖고, 모양은 여기 하나가 갖는다.
 *
 * ★ 디자인 규칙은 components/saas.tsx 머리말에 있다. 전면 사진 히어로 · 전폭 어두운 밴드 ·
 *   자간 넓힌 영문 캡스 눈썹으로 되돌리지 말 것 — 셋 다 경쟁 병원과 같아지는 지점이다.
 * ⚠️ AI 로 만든 사진(figure.ai)에는 설명용 고지를 반드시 함께 렌더한다. 지우지 말 것.
 */
export function TreatmentLanding({
  t,
  page,
  journey,
  related,
  trail,
  children,
}: {
  t: Treatment;
  page: TreatmentPage;
  journey: Journey | undefined;
  related: Array<{ slug: string; title: string }>;
  trail: Array<{ name: string; path: string }>;
  /** 비교표처럼 이 진료에만 붙는 것들. 본문 구간 뒤, FAQ 앞에 들어간다. */
  children?: React.ReactNode;
}) {
  /** 지표 3칸 — 사진이 어디로 가느냐에 따라 글 아래에도, 오른쪽 칸에도 놓인다. */
  const stats = (
    <dl
      className="enter mt-12 grid max-w-[34rem] grid-cols-3 gap-x-6 border-t border-white/20 pt-7"
      style={{ animationDelay: '500ms' }}
    >
      {page.stats.map((s) => (
        <div key={s.k}>
          <dt className="text-[13.5px] font-bold text-clay-300">{s.k}</dt>
          <dd className="mt-1.5 text-[15.5px] leading-snug font-black text-parchment">{s.v}</dd>
        </div>
      ))}
    </dl>
  );

  const navItems = [
    ...page.blocks.map((b, i) => ({ id: `구간-${i + 1}`, label: b.label })),
    ...(journey ? [{ id: '진행-순서', label: '진행 순서' }] : []),
    ...(page.aftercare ? [{ id: '주의사항', label: '주의사항' }] : []),
  ];

  /* AI 사진이 한 장이라도 쓰였는지 — 고지를 렌더할지 정한다. */
  const usesAi =
    page.hero.ai || page.blocks.some((b) => b.figure?.ai);

  return (
    <>
      {/*
        히어로 — **어두운 유리 면 위 2단**. 사진은 카드에 담아 층을 만든다.
        ⚠️ 밝은 면으로 되돌리지 말 것 (2026-08-28 오너) — 하위 페이지 머리는 전부
           어두운 띠로 통일돼 있다. 여기만 밝으면 진료 페이지만 결이 갈린다.
        ⚠️ 이 면 위 글자는 parchment 계열이다. 회색조(ink-soft 등)를 쓰면 3:1 대로 떨어진다.
      */}
      <section className="relative isolate -mt-[68px] overflow-hidden bg-wine-deep pt-[68px] text-parchment sm:-mt-[94px] sm:pt-[94px]">
        {/*
          ★★ 사진은 **배경으로 깐다** (2026-08-31 운영자) ★★
            "대부분 진료페이지에 사진 이상하게 사이즈 돼서 들어가던데 걍 병원소개쪽처럼
             배경으로 사진을 넣던지."
            히어로 사진은 진료마다 비율이 제각각이다(1.50 · 2.24 · 2.40 · 4.80).
            상자에 담는 한 어떤 비율을 골라도 누군가는 잘리거나 옆이 빈다.
            배경으로 깔면 **비율 문제 자체가 없어진다** — 잘리는 것이 당연한 자리이기 때문이다.
          ⚠️ 상자(오른쪽 칸 카드 · 전폭 띠)로 되돌리지 말 것. 그 길은 이미 두 번 돌았다.
          ⚠️ 병원 소개(components/ui.tsx PageHero)와 **같은 두 겹 스크림**을 쓴다.
             옅게 하지 말 것 — 사진 밝은 부분에서 작은 금색 글자가 2.26:1 까지 떨어진다(실측).
        */}
        <Image
          src={page.hero.src}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(78%_62%_at_50%_38%,rgba(36,34,30,0.68)_0%,rgba(36,34,30,0.86)_62%,rgba(36,34,30,0.95)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_58%_at_78%_10%,rgba(217,164,65,0.16)_0%,transparent_64%)]"
        />
        <Container className="relative pt-10 pb-16 lg:pb-24">
          <Breadcrumb trail={trail} tone="dark" />

          <div
            className="mt-12 grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16"
          >
            <div>
              <span
                className="enter inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13.5px] font-black text-parchment backdrop-blur-[10px]"
                style={{ animationDelay: '40ms' }}
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-clay-500" />
                진료과목 · {t.name}
              </span>

              {/*
                ⚠️ 폭 제한은 **글자와 같은 요소**에 건다. 부모에 걸면 부모의 font-size 기준이라
                   큰 글씨가 좁은 폭에 갇혀 여러 줄로 쪼개진다(실제로 겪은 일).
                ⚠️ 한글에는 ch 대신 em — ch 는 숫자 0 의 폭이라 한글 한 글자보다 좁다.
              */}
              <h1
                className="enter display-sm mt-7 max-w-[14em] text-[clamp(32px,5.4vw,62px)] leading-[1.16] tracking-[-0.035em] whitespace-pre-line text-parchment"
                style={{ animationDelay: '140ms' }}
              >
                {page.headline}
              </h1>

              <p
                className="enter mt-7 max-w-[30em] text-[18px] leading-[1.9] text-parchment/85"
                style={{ animationDelay: '260ms' }}
              >
                <Sentences text={page.lead} />
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
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-parchment/70 px-8 py-4 text-[16.5px] font-black text-parchment transition-colors hover:bg-white/10"
                >
                  {CLINIC.phone}
                </a>
              </div>

              {/* 지표 3칸 — 사진이 배경으로 가면서 이 자리에 그대로 남는다. */}
              {stats}
            </div>

          </div>

        </Container>
      </section>

      <SectionNav items={navItems} />

      {/* 본문 구간 — 밝은 면과 크림 면이 번갈아 오게 해서 리듬을 만든다. */}
      {page.blocks.map((b, i) => {
        const tinted = i % 2 === 1;
        return (
          <section
            key={b.label}
            className={
              tinted
                ? 'border-y border-brand-200/60 bg-wine-soft/50 py-16 lg:py-24'
                : 'py-16 lg:py-24'
            }
          >
            <Container>
              <SectionHead
                id={`구간-${i + 1}`}
                n={String(i + 1).padStart(2, '0')}
                label={b.label}
                title={b.title}
                desc={b.desc}
              />

              {/*
                글과 사진을 나란히 둔다 — 사진이 **왼쪽**, 글이 오른쪽이다.
                ⚠️ 사진이 있을 때만 두 단이다. 없으면 한 단으로 두어 빈 칸을 만들지 않는다.
                ⚠️ 사진을 오른쪽으로 옮기지 말 것 — 눈이 왼쪽에서 출발하므로, 사진이 먼저
                   무엇에 대한 이야기인지 알려 준 다음 글로 들어가는 순서가 맞다.
              */}
              {b.paragraphs && b.figure ? (
                <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
                  <Card lift className="reveal img-in overflow-hidden lg:sticky lg:top-32">
                    {/* ⚠️ 4:3 고정으로 되돌리지 말 것 — 3:2 사진이 11% 잘린다. */}
                    <div className="relative bg-brand-100" style={{ aspectRatio: b.figure.ratio ?? '4 / 3' }}>
                      <Image
                        src={b.figure.src}
                        alt={b.figure.alt}
                        fill
                        sizes="(min-width: 1024px) 520px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </Card>
                  <div className="reveal space-y-5">
                    {b.paragraphs.map((p) => (
                      <p key={p} className="text-[17px] leading-[1.95] text-ink-soft">
                        <Sentences text={p} />
                      </p>
                    ))}
                  </div>
                </div>
              ) : b.paragraphs ? (
                <div className="reveal mt-10 max-w-[36em] space-y-5">
                  {b.paragraphs.map((p) => (
                    <p key={p} className="text-[17px] leading-[1.95] text-ink-soft">
                      <Sentences text={p} />
                    </p>
                  ))}
                </div>
              ) : null}

              {b.steps ? (
                <div className="relative mt-14">
                  <span
                    aria-hidden
                    className="line-in absolute top-[13px] right-0 left-0 hidden h-px bg-brand-300/70 lg:block"
                  />
                  <ol className="reveal-stack relative grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {b.steps.map((s) => (
                      <li key={s.step} className="reveal flex h-full flex-col">
                        <div className="mb-6 flex items-center">
                          <NumChip n={s.step} />
                        </div>
                        <Card className="flex h-full flex-col p-7">
                          <h3 className="display-sm text-[17.5px] tracking-[-0.01em] text-ink">
                            {s.title}
                          </h3>
                          <p className="mt-2.5 text-[15.5px] leading-[1.85] text-ink-soft">{s.body}</p>
                        </Card>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {/*
                ★★ 항목에 사진이 딸리면 **사진 왼쪽 · 카드 오른쪽** 2단이다 (2026-08-31 운영자) ★★
                  전에는 카드를 3열로 깔고 그 아래에 사진을 한 장 놓았는데, 사진이 혼자
                  전폭을 차지해 본문 한가운데가 사진으로 끊겼다("갑자기 너무 큰 이미지가
                  중간에 있어"). 나란히 두면 사진이 카드 옆에서 같은 이야기를 거든다.
                ⚠️ 사진을 오른쪽으로 옮기지 말 것 — 이 페이지의 다른 2단 구간도 사진이
                   왼쪽이다(위 주석). 구간마다 방향이 다르면 읽는 눈이 매번 자리를 다시 찾는다.
                ⚠️ 카드는 2열이다. 오른쪽 칸이 640px 남짓이라 3열로 두면 한 칸이 200px 밑으로
                   내려가 제목이 두 줄로 접힌다.
              */}
              {/*
                ⚠️⚠️ items-start + 고정 비율로 되돌리지 말 것 (2026-08-31 운영자) ⚠️⚠️
                  사진을 자기 비율(3:2 → 339px)로 두었더니 카드 두 줄(약 500px)과 높이가
                  안 맞아 사진 아래가 160px 비었다("카드랑 사진이랑 크기 잘 안맞으니깐").
                ★ items-stretch + h-full — 사진이 **카드 줄 높이를 그대로 채운다.**
                  잘리는 것은 배경 사진과 같은 성격이라 눈에 걸리지 않는다.
                ⚠️ 최소 높이를 함께 둔다. 카드가 한 줄뿐인 구간에서는 사진이 너무 납작해진다.
              */}
              {b.items && b.figure && !b.paragraphs ? (
                <div className="mt-12 grid items-stretch gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                  <Card lift className="reveal img-in overflow-hidden">
                    <div className="relative h-full min-h-[280px] bg-brand-100">
                      <Image
                        src={b.figure.src}
                        alt={b.figure.alt}
                        fill
                        sizes="(min-width: 1024px) 520px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </Card>
                  <ul className="reveal-stack grid gap-5 sm:grid-cols-2">
                  {b.items.map((it, k) => (
                    <Card as="li" key={it.title} className="reveal p-7">
                      <NumChip n={String(k + 1).padStart(2, '0')} />
                      <h3 className="display-sm mt-5 text-[18px] tracking-[-0.01em] text-ink">
                        {it.title}
                      </h3>
                      <p className="mt-2.5 text-[15.5px] leading-[1.85] text-ink-soft">{it.body}</p>
                    </Card>
                  ))}
                  </ul>
                </div>
              ) : b.items ? (
                <ul className="reveal-stack mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {b.items.map((it, k) => (
                    <Card as="li" key={it.title} className="reveal p-7">
                      <NumChip n={String(k + 1).padStart(2, '0')} />
                      <h3 className="display-sm mt-5 text-[18px] tracking-[-0.01em] text-ink">
                        {it.title}
                      </h3>
                      <p className="mt-2.5 text-[15.5px] leading-[1.85] text-ink-soft">{it.body}</p>
                    </Card>
                  ))}
                </ul>
              ) : null}

              {/*
                ⚠️ 사진 아래에 설명 한 줄을 달지 말 것 (2026-08-27 오너 지시).
                   alt 는 화면에 안 보이는 사람을 위해 남기고, 보이는 캡션은 두지 않는다.
                   사진이 무엇인지는 그 위 본문이 이미 말하고 있다.
              */}
              {/* ⚠️ 글이 함께 있으면 위 2단에서 이미 그렸다. 여기서 또 그리면 사진이 두 번 나온다. */}
              {/*
                ⚠️⚠️ 전폭 16:10 으로 깔지 말 것 (2026-08-31 운영자: "갑자기 너무 큰 이미지가
                   중간에 있어") ⚠️⚠️
                   컨테이너를 다 쓰면 1254×784 가 되어 본문 한가운데를 사진이 통째로 차지한다.
                   게다가 3:2 사진을 16:10 에 담아 6% 가 잘리고, 원본보다 크게 늘어나 흐려진다.
                ★ 폭을 860px 로 묶고 사진의 실제 비율을 쓴다. 위 2단 구간의 사진(520px)과
                  크기 차이가 나지만, 그쪽은 글 옆에 붙고 이쪽은 혼자 서므로 조금 큰 것이 맞다.
              */}
              {b.figure && !b.paragraphs && !b.items ? (
                <Card lift className="reveal img-in mt-12 max-w-[860px] overflow-hidden">
                  <div
                    className="relative bg-brand-100"
                    style={{ aspectRatio: b.figure.ratio ?? '16 / 10' }}
                  >
                    <Image
                      src={b.figure.src}
                      alt={b.figure.alt}
                      fill
                      sizes="(min-width: 900px) 860px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </Card>
              ) : null}

              {/*
                실제 증례 연속 컷.
                ★ 이미지 안에 A/B/C/D 가 이미 찍혀 있어 캡션이 필요 없다.
                ⚠️ 원본이 작아(220px) 크게 늘리면 뭉갠다. 칸을 작게 두고 여백으로 격을 만든다.
              */}
              {b.panels?.length ? (
                <ol className="reveal-stack mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {b.panels.map((p) => (
                    <li key={p.src} className="reveal">
                      <div className="img-in relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand-200/80 bg-brand-900">
                        <Image
                          src={p.src}
                          alt={p.alt}
                          fill
                          sizes="(min-width: 1024px) 300px, (min-width: 640px) 47vw, calc(100vw - 40px)"
                          className="object-cover"
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              ) : null}

              {/* 가로로 긴 원본은 띠로 쓴다 — 4:3 으로 자르면 내용이 통째로 잘린다. */}
              {b.band ? (
                <div className="reveal img-in mt-12 overflow-hidden rounded-[22px] border border-brand-200/80 bg-brand-900">
                  {/* ⚠️ 3:1 고정이면 원본 비율이 다른 띠가 잘린다. */}
                  <div className="relative" style={{ aspectRatio: b.band.ratio ?? '3 / 1' }}>
                    <Image
                      src={b.band.src}
                      alt={b.band.alt}
                      fill
                      sizes="(min-width: 1320px) 1256px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : null}
            </Container>
          </section>
        );
      })}

      {children}

      {/* 진행 순서 */}
      {journey && (
        <section className="border-y border-brand-200/60 bg-wine-soft/50 py-16 lg:py-24">
          <Container>
            <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
              <div className="lg:sticky lg:top-40 lg:self-start">
                <SectionHead
                  id="진행-순서"
                  n={String(page.blocks.length + 1).padStart(2, '0')}
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
              <p className="reveal mt-12 max-w-[46em] text-[14.5px] leading-[1.9] text-ink-muted">
                기간이 늘어나는 경우도 있습니다. {journey.variables.join(' ')}
              </p>
            ) : null}
          </Container>
        </section>
      )}

      {/*
        ★★ 자주 묻는 질문은 여기서 펼치지 않는다 (2026-08-27 오너 지시) ★★
          진료 페이지에 문답까지 다 펼치니 한 페이지가 너무 길어졌다. 정본은 /faq 가 갖고
          여기서는 그리로 가는 줄만 둔다.
        ⚠️ 함께 옮긴 것: FAQPage 구조화 데이터. 화면에서 뺐는데 스키마만 남기면 보이지 않는
           내용을 주장하는 꼴이라 검색엔진이 무시하거나 감점한다. 되살리려면 둘을 같이 옮길 것.
      */}
      {t.qa.length ? (
        <section className="py-16 lg:py-24">
          <Container>
            <Link href={`/faq#${t.slug}`} className="reveal group block">
              <Card className="flex flex-wrap items-center justify-between gap-6 p-8 transition-all group-hover:border-clay-400 group-hover:shadow-[var(--shadow-lift)]">
                <div>
                  <p className="text-[13.5px] font-black text-clay-700">자주 묻는 질문</p>
                  <p className="mt-2.5 text-[19px] font-black tracking-[-0.015em] text-ink">
                    {t.name}에 대해 많이 묻는 것 {t.qa.length}가지
                  </p>
                  <p className="mt-2 text-[15.5px] leading-[1.8] text-ink-soft">
                    기간과 횟수, 통증, 보험 적용까지 한자리에 모아 두었습니다.
                  </p>
                </div>
                <span className="shrink-0 text-[16px] font-black text-clay-700">
                  전체 보기 <span aria-hidden>→</span>
                </span>
              </Card>
            </Link>
          </Container>
        </section>
      ) : null}

      {/* 주의사항 — 원문에 있는 진료만 렌더된다. */}
      {page.aftercare && (
        <section className="border-y border-brand-200/60 bg-wine-soft/50 py-16 lg:py-24">
          <Container>
            <SectionHead
              id="주의사항"
              n={String(page.blocks.length + (journey ? 2 : 1)).padStart(2, '0')}
              label={page.aftercare.title}
              title="이 며칠이 결과를 좌우합니다"
            />
            <ol className="reveal-stack mt-12 grid gap-5 sm:grid-cols-2">
              {page.aftercare.items.map((a, i) => (
                <Card as="li" key={a} className="reveal flex gap-4 p-6">
                  <NumChip n={String(i + 1).padStart(2, '0')} />
                  <p className="text-[16px] leading-[1.85] text-ink-soft">{a}</p>
                </Card>
              ))}
            </ol>
          </Container>
        </section>
      )}

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
                  key={s.slug}
                  href={`/insight/symptom/${s.slug}`}
                  className="rounded-full btn-pane border px-5 py-2.5 text-[15.5px] font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/*
        ⚠️⚠️ AI 사진 고지 — 지우지 말 것 ⚠️⚠️
          이 페이지에 AI 로 만든 사진이 한 장이라도 있으면 함께 렌더한다. 고지가 없으면
          원내 사진으로 읽히고, 그 순간 확인되지 않은 시설 주장이 된다(의료법 제56조).
          사진을 전부 실제 진료 사진으로 바꾸면 usesAi 가 false 가 되어 자동으로 사라진다.
      */}
      {/*
        ⚠️ 이 고지는 남긴다 — 다른 안내문과 성격이 다르다. 우리가 실제로 AI 로 만든 그림을
           쓰기 때문에 붙는 것이고, 빼면 그 그림이 원내 실제 사진으로 읽힌다.
        ★ 다만 **눈에 띄지 않게** 둔다 (2026-08-31 운영자: "저렇게 잘보이게 말고 자연스럽게
          좀 안보이게"). 라벨·구분선·굵은 글씨를 걷고 푸터 한 줄로 낮췄다.
        ⚠️ 사진을 전부 실제 진료 사진으로 바꾸면 usesAi 가 false 가 되어 저절로 사라진다.
      */}
      {usesAi ? (
        <Container className="pb-6">
          <p className="max-w-[52em] text-[12.5px] leading-[1.7] text-ink-muted/70">
            일부 이미지는 진료 과정을 설명하기 위해 만든 것으로 실제 진료 사진이 아닙니다.
          </p>
        </Container>
      ) : null}
    </>
  );
}
