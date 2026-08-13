import type { Metadata } from 'next';
import { TREATMENTS } from '@/lib/treatments';
import { Container, SectionHead, CardLink, Breadcrumb, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '진료과목',
  description:
    '동그라미치과의 진료 범위입니다. 임플란트, 신경치료, 잇몸치료, 충치치료, 사랑니 발치, 크라운·보철, 스케일링, 어린이 진료를 봅니다.',
  alternates: { canonical: '/treatment' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
];

export default function TreatmentIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(TRAIL)} />
      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          eyebrow="진료과목"
          title="무엇을 하는 곳인지, 각 치료가 어떤 과정인지"
          desc="치료마다 자주 나오는 질문을 먼저 정리했습니다. 궁금한 것이 이미 적혀 있다면 진료실에서는 그다음 이야기를 할 수 있습니다."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TREATMENTS.map((t) => (
            <CardLink
              key={t.slug}
              href={`/treatment/${t.slug}`}
              title={t.name}
              desc={t.summary}
              tag={`질문 ${t.qa.length}개`}
            />
          ))}
        </div>
      </Container>

      <ContactCta />
    </>
  );
}
