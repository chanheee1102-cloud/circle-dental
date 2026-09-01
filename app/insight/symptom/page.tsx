import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import Link from 'next/link';
import { SYMPTOMS } from '@/lib/symptoms';
import { Container, MedicalNotice, ContactCta, PageHero, Sentences } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '증상으로 찾기',
  description:
    '이가 시리거나 잇몸에서 피가 날 때, 밤에 욱신거릴 때. 병명을 몰라도 지금 느끼는 증상에서 시작해 가능한 원인과 확인 방법을 정리했습니다.',
  alternates: { canonical: '/insight/symptom' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '미리 알아두기', path: '/insight' },
  { name: '증상으로 찾기', path: '/insight/symptom' },
];

export default function SymptomIndexPage() {
  return (
    <>
      {/* 목록 페이지 자체도 질문–답변 묶음이다. 각 증상의 즉답을 FAQ 로 노출해 인용 통로를 넓힌다. */}
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          faqSchema(SYMPTOMS.map((s) => ({ q: s.title, a: s.answer }))),
        ]}
      />

      <PageHero
        trail={TRAIL}
        photo="room"
        eyebrow="증상으로 찾기"
        title="지금 느끼는 것에서 시작하세요"
        desc="어떤 치료가 필요한지는 진단의 결과입니다. 출발점은 증상이어야 합니다."
      />

      <Container className="py-12 lg:py-16">

        {/* ⚠️ 도입 삽화를 되살리지 말 것 (2026-09-01 오너) — 목록이 2단 유리 카드라
            사람 사진 없이도 '자료' 로 읽히지 않는다. 큰 사진은 목록을 화면 아래로 민다. */}

        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/insight/symptom" />
        </div>

        {/*
          ⚠️ 한 단으로 되돌리지 말 것 (2026-08-31) — 카드가 화면 폭을 다 쓰면서 안의 글이
             한 줄에 76자가 됐다(실측). 한글에서 편한 한 줄은 35~45자다.
          ⚠️ h-full 을 지우지 말 것 — 없으면 좌우 두 카드의 높이가 서로 달라진다.
        */}
        <div className="mt-12 grid gap-3 lg:grid-cols-2">
          {SYMPTOMS.map((s) => (
            <Link
              key={s.slug}
              href={`/insight/symptom/${s.slug}`}
              className="group block h-full rounded-2xl border border-brand-100 card-glass p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <h2 className="text-[18px] font-black leading-snug text-ink group-hover:text-brand-700 sm:text-[19px]">
                    {s.title}
                  </h2>
                  {/* 목록에서도 즉답 첫 문장을 보여 준다 — 클릭 전에 답의 방향을 알 수 있게. */}
                  <p className="mt-2.5 line-clamp-2 text-[15.5px] leading-relaxed text-ink-soft">
                    <Sentences text={s.answer} />
                  </p>
                </div>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-brand-500 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <MedicalNotice />
      </Container>

      <ContactCta
        title="증상만으로는 원인을 특정할 수 없습니다"
        desc="같은 증상이라도 원인이 여럿입니다. 검사로 확인해야 어떤 치료가 필요한지 정해집니다."
      />
    </>
  );
}
