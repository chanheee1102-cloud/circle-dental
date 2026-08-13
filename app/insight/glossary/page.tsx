import type { Metadata } from 'next';
import Link from 'next/link';
import { GLOSSARY } from '@/lib/insight';
import { Container, SectionHead, Breadcrumb, MedicalNotice, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, abs } from '@/lib/seo';

export const metadata: Metadata = {
  title: '치과 용어 사전',
  description:
    '치수염, 치주낭, 골유착, 드라이소켓, 인레이. 진료실에서 듣는 치과 용어를 한두 문장으로 풀었습니다.',
  alternates: { canonical: '/insight/glossary' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '인사이트', path: '/insight' },
  { name: '용어 사전', path: '/insight/glossary' },
];

/**
 * 용어 사전.
 *
 * ★ DefinedTermSet 스키마를 쓴다 — "치수염이 뭐예요" 같은 정의형 질의에 대해
 *   AI 가 정의를 통째로 인용하기 가장 좋은 형식이다. FAQPage 로도 되지만
 *   정의에는 DefinedTerm 이 의미상 정확하고, 용어 하나하나가 개별 엔티티로 인식된다.
 * ★ 정의는 두 문장을 넘기지 않는다. 길면 인용 대상에서 밀린다.
 */
export default function GlossaryPage() {
  const definedTermSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: '치과 용어 사전',
    url: abs('/insight/glossary'),
    inLanguage: 'ko-KR',
    hasDefinedTerm: GLOSSARY.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      ...(t.reading ? { alternateName: t.reading } : {}),
      description: t.def,
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(TRAIL), definedTermSet]} />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          eyebrow="용어 사전"
          title="설명을 들을 때 옆에 두고 보세요"
          desc="진료실에서 쓰는 말이 어렵게 들리는 것은 당연합니다. 자주 나오는 것만 한두 문장으로 풀었습니다."
        />

        <dl className="mt-12 grid gap-3 sm:grid-cols-2">
          {GLOSSARY.map((t) => (
            <div
              key={t.term}
              className="rounded-2xl border border-brand-100 bg-white p-6 transition-colors hover:border-brand-200"
            >
              <dt className="flex flex-wrap items-baseline gap-2">
                <span className="text-[17px] font-black text-ink">{t.term}</span>
                {t.reading && (
                  <span className="text-[13px] font-semibold text-ink-muted">{t.reading}</span>
                )}
              </dt>
              <dd className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                {t.def}
                {t.related && (
                  <>
                    {' '}
                    <Link
                      href={`/treatment/${t.related}`}
                      className="font-bold text-brand-700 underline underline-offset-2"
                    >
                      관련 진료 보기
                    </Link>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <MedicalNotice />
      </Container>

      <ContactCta
        title="설명이 이해되지 않으면 다시 물어보셔도 됩니다"
        desc="같은 내용을 다른 말로 설명드립니다. 이해하지 못한 채 동의하는 치료는 없어야 합니다."
      />
    </>
  );
}
