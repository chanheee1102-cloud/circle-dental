import type { Metadata } from 'next';
import { Container, SectionHead, CardLink, Breadcrumb, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import { SYMPTOMS } from '@/lib/symptoms';
import { JOURNEYS, COST_TOPICS, GLOSSARY } from '@/lib/insight';
import { CONDITIONS } from '@/lib/conditions';

export const metadata: Metadata = {
  title: '인사이트',
  description:
    '증상으로 찾기, 치료 여정, 비용 가이드, 용어 사전, 응급 상황 안내. 진료실에서 다 담기 어려운 배경 설명을 정리했습니다.',
  alternates: { canonical: '/insight' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '인사이트', path: '/insight' },
];

export default function InsightHubPage() {
  const cards = [
    {
      href: '/insight/symptom',
      title: '증상으로 찾기',
      desc: '병명을 몰라도 됩니다. 지금 느끼는 증상에서 출발해 가능한 원인과 확인 방법을 정리했습니다.',
      tag: `${SYMPTOMS.length}가지 증상`,
    },
    {
      href: '/insight/condition',
      title: '질환 사전',
      desc: '진료실에서 들은 병명이 무엇인지, 방치하면 어떻게 진행하는지 정리했습니다.',
      tag: `${CONDITIONS.length}개 질환`,
    },
    {
      href: '/insight/journey',
      title: '치료 여정',
      desc: '몇 번 오고 얼마나 걸리는지, 각 회차에 무엇을 하는지 회차별로 적었습니다.',
      tag: `${JOURNEYS.length}개 치료`,
    },
    {
      href: '/insight/cost',
      title: '비용 가이드',
      desc: '건강보험이 되는 항목과 되지 않는 항목, 비용이 사람마다 달라지는 이유를 설명합니다.',
      tag: `${COST_TOPICS.length}개 주제`,
    },
    {
      href: '/insight/glossary',
      title: '용어 사전',
      desc: '진료실에서 듣는 말을 짧게 풀었습니다. 설명을 들을 때 옆에 두고 보시면 됩니다.',
      tag: `${GLOSSARY.length}개 용어`,
    },
    {
      href: '/insight/emergency',
      title: '응급 상황',
      desc: '치아가 빠졌거나 부러졌을 때, 밤에 참기 힘들 때 지금 할 수 있는 것과 하면 안 되는 것.',
      tag: '지금 당장',
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(TRAIL)} />
      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          eyebrow="인사이트"
          title="진료 시간에 다 못 하는 이야기를 여기에 적었습니다"
          desc="치료 자체보다 그 앞뒤의 설명이 부족해서 불안한 경우가 많습니다. 미리 읽고 오시면 진료실에서 할 이야기가 달라집니다."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <CardLink key={c.href} {...c} />
          ))}
        </div>
      </Container>

      <ContactCta />
    </>
  );
}
