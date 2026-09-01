import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SYMPTOMS, symptomBySlug } from '@/lib/symptoms';
import { treatmentBySlug } from '@/lib/treatments';
import { conditionsForSymptom } from '@/lib/conditions';
import { CLINIC } from '@/lib/clinic';
import { Container, MedicalNotice, ContactCta, Sentences, PageHero } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, articleSchema , og , imageObjectSchema, pageImage} from '@/lib/seo';
import { KeyPoints, TableOfContents, ArticleMeta, References, charCount, headingId } from '@/components/article';
import { REFS_CONDITION } from '@/lib/references';

export function generateStaticParams() {
  return SYMPTOMS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = symptomBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    // 메타 설명에 즉답을 그대로 쓴다 — 검색 결과 스니펫이 곧 답이 되게 한다.
    description: s.answer.slice(0, 155),
    alternates: { canonical: `/insight/symptom/${s.slug}` },
    openGraph: og({
      title: s.title,
      description: s.answer.slice(0, 155),
      path: `/insight/symptom/${s.slug}`,
    }),
  };
}

export default async function SymptomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = symptomBySlug(slug);
  if (!s) notFound();

  const trail = [
    { name: '홈', path: '/' },
    { name: '미리 알아두기', path: '/insight' },
    { name: '증상으로 찾기', path: '/insight/symptom' },
    { name: s.short, path: `/insight/symptom/${s.slug}` },
  ];

  const treatments = s.relatedTreatments.map(treatmentBySlug).filter(Boolean);
  /* 질환 쪽 relatedSymptoms 를 거꾸로 읽는다 — 증상 데이터에 새 필드를 만들지 않는다. */
  const conditions = conditionsForSymptom(s.slug);

  const SYPATH = `/insight/symptom/${s.slug}`;
  /** 대표 이미지 — 사진이 없는 문서는 그 페이지 전용 공유 카드를 쓴다(lib/seo.ts pageImage 주석). */
  const docImage = pageImage(undefined, `${s.title} — 동그라미치과의원 설명`);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: s.title,
            description: s.answer,
            path: SYPATH,
            about: { type: 'MedicalCondition', name: s.short },
            image: docImage,
          }),
          imageObjectSchema({ path: SYPATH, ...docImage }),
          articleSchema({
            path: `/insight/symptom/${s.slug}`,
            title: s.title,
            description: s.answer,
            wordCount: charCount(s.answer, s.causes.map((c) => c.name + c.detail).join('')),
            keywords: [s.short, ...s.causes.map((c) => c.name)],
            hasImage: true,
          }),
          faqSchema([{ q: s.title, a: s.answer }], `/insight/symptom/${s.slug}`),
        ]}
      />

      <article>
        {/*
          ⚠️ 머리를 다시 손으로 그리지 말 것 — PageHero 하나가 전담한다(2026-08-28).
          ⚠️ 바로 아래 '즉답 블록' 을 히어로 설명글로 옮기지 말 것. 같은 문장이 두 번 나오면
             인용 가치가 떨어진다. 답은 본문 첫 자리에 한 번만 둔다.
        */}
        <PageHero trail={trail} photo="room" eyebrow="증상" title={s.title} />
        <Container className="py-12 lg:py-16">

          {/* 즉답 블록 — AI 가 인용하는 자리. 제목 바로 아래에서 답이 끝난다. */}
          <div className="mt-8 max-w-[64ch] rounded-2xl border-l-[3px] border-brand-500 card-glass p-6">
            <p className="text-[18px] leading-[1.85] text-ink"><Sentences text={s.answer} /></p>
          </div>

          {/*
            증상 삽화 — 즉답 **다음**에 온다.
            ★ 순서가 의미다. 이 페이지에서 먼저 읽혀야 할 것은 답이고, 그림은 그 답이
              누구 이야기인지 붙여 주는 역할이다. 제목 바로 아래로 올리면 즉답이 접힌 화면
              밖으로 밀린다(= AI 가 인용하는 단락이 첫 화면에서 사라진다).
            ⚠️ 데이터에 image 가 없는 증상은 아무것도 렌더하지 않는다 — 빈 자리를 남기지 않는다.
          */}
          {s.image ? (
            <figure className="mt-10 max-w-[64ch]">
              <Image
                src={s.image.src}
                alt={s.image.alt}
                width={1536}
                height={1024}
                sizes="(min-width: 1024px) 64ch, 100vw"
                className="w-full rounded-2xl border border-brand-100 object-cover"
              />
            </figure>
          ) : null}

          <div className="mt-8 max-w-[70ch]">
            <ArticleMeta path={`/insight/symptom/${s.slug}`} />
          </div>

          {/*
            한눈에 보기 — 지어내지 않는다. 응급 신호와 확인된 원인 이름을 그대로 옮긴다.
            이 페이지에서 가장 먼저 읽혀야 할 것이 '지금 가야 하나' 라 그 줄을 맨 위에 둔다.
          */}
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <KeyPoints
              items={[
                s.answer,
                `지금 병원에 가야 하는 신호: ${s.urgent.slice(0, 2).join(', ')}`,
                `흔한 원인: ${s.causes.map((c) => c.name).join(', ')}`,
              ]}
            />
            <TableOfContents
              items={[
                '어떤 경우에 미루면 안 되나요?',
                '왜 이런 증상이 생기나요?',
                '오기 전에 해볼 수 있는 것이 있나요?',
                /* 질환 목록이 비면 그 소제목도 없다 — 목차에 없는 자리를 걸면 클릭이 죽는다. */
                ...(conditions.length ? ['어떤 질환일 수 있나요?'] : []),
              ]}
            />
          </div>
        </Container>

        {/* 응급 신호를 원인보다 먼저 둔다 — 지금 병원에 가야 할 사람이 아래까지 안 읽고 나갈 수 있다. */}
        <section className="border-y border-gold-400/40 bg-gold-400/8 py-12">
          <Container>
            <h2
              id={headingId('어떤 경우에 미루면 안 되나요?')}
              className="flex scroll-mt-28 items-center gap-2.5 text-[19px] font-black text-ink"
            >
              <span
                aria-hidden
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-[15px] font-black text-white"
              >
                !
              </span>{' '}
              어떤 경우에 미루면 안 되나요?
            </h2>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {s.urgent.map((u) => (
                <li key={u} className="flex gap-2.5 text-[16px] leading-relaxed text-ink-soft">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  {u}
                </li>
              ))}
            </ul>
            <a
              href={CLINIC.phoneHref}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-[16.5px] font-black text-white transition-colors hover:bg-brand-600"
            >
              {CLINIC.phone} 로 전화
            </a>
          </Container>
        </section>

        <Container className="py-14">
          <h2
            id={headingId('왜 이런 증상이 생기나요?')}
            className="scroll-mt-28 text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]"
          >
            왜 이런 증상이 생기나요?
          </h2>
          <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-ink-soft">
            <Sentences text="아래는 이 증상에서 흔히 확인되는 원인들입니다. 증상만으로는 어느 쪽인지 특정할 수 없고, 검사로 확인해야 치료가 정해집니다." />
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {s.causes.map((c) => (
              <div key={c.name} className="rounded-2xl border border-brand-100 card-glass p-6">
                <h3 className="text-[17.5px] font-black text-ink">{c.name}</h3>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-soft"><Sentences text={c.detail} /></p>
              </div>
            ))}
          </div>
        </Container>

        <section className="border-t border-brand-100 bg-parchment py-14">
          <Container>
            <h2
              id={headingId('오기 전에 해볼 수 있는 것이 있나요?')}
              className="scroll-mt-28 text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]"
            >
              오기 전에 해볼 수 있는 것이 있나요?
            </h2>
            <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-ink-soft">
              <Sentences text="증상을 덜어주는 방법이지 원인을 없애는 방법은 아닙니다. 나아진 것처럼 느껴져도 원인은 그대로 남아 있습니다." />
            </p>
            <ul className="mt-7 max-w-[68ch] space-y-3.5">
              {s.selfCare.map((c) => (
                <li key={c} className="flex gap-3 text-[16.5px] leading-relaxed text-ink-soft">
                  <span
                    aria-hidden
                    className="mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-300 text-[13.5px] text-brand-600"
                  >
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/*
          ★★ 증상 → 질환 링크 (2026-08-18 내부 링크 전수 조사) ★★
            질환 페이지 15개가 전부 **들어오는 링크 하나**(허브 목록)뿐이었다. 질환은 증상을
            가리키는데 증상은 질환을 안 가리켜 화살표가 한 방향으로만 나 있었기 때문이다.
            환자가 실제로 밟는 길은 "밤에 아픔 → 치수염 → 신경치료" 인데, 그 가운데 칸으로
            들어가는 길이 없었던 셈이다.
          ★ 목록은 질환 쪽 relatedSymptoms 를 거꾸로 읽어 만든다 — 새로 지어낸 사실이 0 이다
            (lib/conditions.ts conditionsForSymptom 주석 참고).
          ★ 앞의 '왜 이런 증상이 생기나요?' 는 원인을 **설명**하는 자리이고 링크가 없다.
            여기는 그 원인을 **읽으러 갈 곳**이라 역할이 겹치지 않는다.
        */}
        {conditions.length > 0 && (
          <Container className="py-14">
            <h2
              id={headingId('어떤 질환일 수 있나요')}
              className="scroll-mt-28 text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]"
            >
              어떤 질환일 수 있나요?
            </h2>
            <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-ink-soft">
              <Sentences text="이 증상에서 흔히 확인되는 질환입니다. 증상만으로 어느 쪽인지 단정할 수 없으니 무엇을 확인하게 되는지 미리 읽어 보시는 정도로 보시면 됩니다." />
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {conditions.map((c) => (
                <Link
                  key={c.slug}
                  href={`/insight/condition/${c.slug}`}
                  className="group rounded-2xl border border-brand-100 card-glass p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
                >
                  <h3 className="text-[18px] font-black text-ink group-hover:text-brand-700">
                    {c.name}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft"><Sentences text={c.definition} /></p>
                </Link>
              ))}
            </div>
          </Container>
        )}

        {treatments.length > 0 && (
          <Container className="py-14">
            <h2 className="text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]">
              어떤 치료로 이어지나요?
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {treatments.map((t) => (
                <Link
                  key={t!.slug}
                  href={`/treatment/${t!.slug}`}
                  className="group rounded-2xl border border-brand-100 card-glass p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
                >
                  <h3 className="text-[18px] font-black text-ink group-hover:text-brand-700">
                    {t!.name}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{t!.summary}</p>
                </Link>
              ))}
            </div>
          </Container>
        )}

        <Container className="pt-4">
          <div className="max-w-[70ch]">
            <References items={REFS_CONDITION} />
          </div>
          <MedicalNotice />
        </Container>
      </article>

      <ContactCta />
    </>
  );
}
