import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import Image from 'next/image';
import Link from 'next/link';
import { SYMPTOMS } from '@/lib/symptoms';
import { Container, SectionHead, Breadcrumb, MedicalNotice, ContactCta } from '@/components/ui';
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

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          as="h1"
          eyebrow="증상으로 찾기"
          title="지금 느끼는 것에서 시작하세요"
          desc="어떤 치료가 필요한지는 진단의 결과입니다. 출발점은 증상이어야 합니다. 각 항목에는 가능한 원인, 내원 전 할 수 있는 것, 바로 와야 하는 신호를 함께 적었습니다."
        />

        {/*
          도입 삽화.
          ★ 이 페이지는 목록이라 글자만 이어진다. 첫 화면에 사람이 한 명도 없으면
            '자료' 로 읽히고, 자기 얘기라고 느끼기까지 시간이 걸린다.
          ⚠️ 장식이라 alt 는 비우지 않는다 — 본문에 없는 정보(누가·어떤 상황인지)를 담고 있다.
          ⚠️ priority: 첫 화면 안에 들어오는 유일한 큰 이미지다. LCP 를 이 이미지가 잡는다.
        */}
        <figure className="mt-10 overflow-hidden rounded-3xl border border-brand-100 bg-brand-50">
          <Image
            src="/img/ai/symptom-hero.webp"
            alt="밝은 창가에 앉아 한 손으로 턱 옆을 짚은 채 생각에 잠긴 사람. 아픈 곳을 어떻게 말해야 할지 고르는 표정이다."
            width={1536}
            height={1024}
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="h-[220px] w-full object-cover object-[30%_40%] sm:h-[300px] lg:h-[360px]"
          />
        </figure>

        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/insight/symptom" />
        </div>

        <div className="mt-12 space-y-3">
          {SYMPTOMS.map((s) => (
            <Link
              key={s.slug}
              href={`/insight/symptom/${s.slug}`}
              className="group block rounded-2xl border border-brand-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <h2 className="text-[18px] font-black leading-snug text-ink group-hover:text-brand-700 sm:text-[19px]">
                    {s.title}
                  </h2>
                  {/* 목록에서도 즉답 첫 문장을 보여 준다 — 클릭 전에 답의 방향을 알 수 있게. */}
                  <p className="mt-2.5 line-clamp-2 text-[14.5px] leading-relaxed text-ink-soft">
                    {s.answer}
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
