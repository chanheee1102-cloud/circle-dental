import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import Link from 'next/link';
import { JOURNEYS } from '@/lib/insight';
import { NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { Container, SectionHead, Breadcrumb, MedicalNotice, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '치료 여정 — 몇 번 오고 얼마나 걸리나요',
  description:
    '임플란트 5~7회 3~6개월, 신경치료 크라운까지 4~7회, 잇몸치료 4~6회. 치료별 내원 횟수와 기간, 회차마다 하는 일을 정리했습니다.',
  alternates: { canonical: '/insight/journey' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '미리 알아두기', path: '/insight' },
  { name: '치료 여정', path: '/insight/journey' },
];

/**
 * 치료 여정 허브.
 *
 * ★ 목록에 회차·기간을 바로 노출한다 — 상세로 들어가지 않아도 답을 얻게 하고,
 *   이 페이지 자체도 "치과 치료 몇 번 가나요" 류 질의의 인용 대상이 되게 한다.
 */
export default function JourneyIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          faqSchema(JOURNEYS.map((j) => ({ q: j.question, a: j.answer }))),
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          as="h1"
          eyebrow="치료 여정"
          title="몇 번 오고, 얼마나 걸리고, 그때마다 무엇을 하는지"
          desc="치료가 길어지는 이유는 대부분 시술이 아니라 기다림입니다. 어디서 기다리는지를 알면 일정을 세우기 쉬워집니다."
        />

        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/insight/journey" />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {JOURNEYS.map((j) => (
            <Link
              key={j.slug}
              href={`/insight/journey/${j.slug}`}
              className="group flex h-full flex-col rounded-xl border border-brand-200/70 bg-white p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="inline-flex w-fit rounded-full bg-brand-100 px-3.5 py-1.5 text-[11.5px] font-black text-brand-700">
                {j.treatment}
              </span>
              <h2 className="display-sm mt-4 text-[18px] text-ink group-hover:text-brand-700">
                {j.question}
              </h2>
              <p className="mt-3 flex-1 text-[14.5px] leading-[1.8] text-ink-soft">{j.answer}</p>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-brand-100 pt-4">
                <span className="rounded-full border border-brand-200 px-3 py-1.5 text-[12.5px] font-bold text-brand-700">
                  내원 {j.visits}
                </span>
                <span className="rounded-full border border-brand-200 px-3 py-1.5 text-[12.5px] font-bold text-brand-700">
                  {j.duration}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <MedicalNotice extra={NO_GUARANTEE_NOTE} />
      </Container>

      <ContactCta
        title="계획을 먼저 알면 일정을 짤 수 있습니다"
        desc="검사 후에는 몇 번에 걸쳐 어떤 순서로 진행할지 먼저 말씀드립니다."
      />
    </>
  );
}
