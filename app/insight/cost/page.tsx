import type { Metadata } from 'next';
import { COST_TOPICS, COST_LABEL } from '@/lib/insight';
import { UNVERIFIED } from '@/lib/clinic';
import {
  Container,
  SectionHead,
  Breadcrumb,
  NeedsInfo,
  MedicalNotice,
  ContactCta,
} from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '비용 가이드 — 무엇이 보험이고 무엇이 아닌가',
  description:
    '만 65세 임플란트 보험 조건, 스케일링 연 1회 적용, 신경치료와 크라운의 보험 차이. 치과 비용이 사람마다 달라지는 이유를 설명합니다.',
  alternates: { canonical: '/insight/cost' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '인사이트', path: '/insight' },
  { name: '비용 가이드', path: '/insight/cost' },
];

const BADGE: Record<string, string> = {
  insurance: 'bg-brand-100 text-brand-700',
  partial: 'bg-gold-400/20 text-gold-600',
  private: 'bg-cream-deep text-ink-soft',
};

/**
 * 비용 가이드.
 *
 * ★★ 금액을 적지 않는다 ★★
 *   비급여 진료비는 의료법상 원내 게시 금액과 일치해야 한다. 확인되지 않은 금액을 웹에 적으면
 *   그 자체가 허위 표시이고, 원내 금액과 어긋나면 분쟁이 된다. 그래서 이 페이지는
 *   **보험 적용 여부와 비용을 가르는 변수**만 다룬다.
 *
 * ★ 그런데 이 편이 검색에도 유리하다
 *   "임플란트 얼마" 로 검색한 사람이 실제로 알고 싶은 것은 숫자 하나가 아니라
 *   "왜 병원마다 다른가, 내 경우는 어디에 해당하는가" 다. 금액표는 그 질문에 답하지 못한다.
 */
export default function CostPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          faqSchema(COST_TOPICS.map((c) => ({ q: c.title, a: c.answer }))),
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          as="h1"
          eyebrow="비용 가이드"
          title="금액보다 먼저 알아야 하는 것들"
          desc="같은 치료라도 보험이 되는 부분과 안 되는 부분이 나뉘고, 그 경계가 최종 비용을 가장 크게 좌우합니다. 여기서는 그 경계를 설명합니다."
        />

        <div className="mt-12 space-y-4">
          {COST_TOPICS.map((c) => (
            <article
              key={c.slug}
              id={c.slug}
              className="scroll-mt-28 rounded-2xl border border-brand-100 bg-white p-7"
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[11.5px] font-black ${BADGE[c.covered]}`}
              >
                {COST_LABEL[c.covered]}
              </span>
              <h2 className="mt-4 text-[19px] font-black leading-snug tracking-[-0.01em] text-ink sm:text-[21px]">
                {c.title}
              </h2>
              {/* 즉답 */}
              <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.85] text-ink">{c.answer}</p>
              <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.8] text-ink-soft">{c.detail}</p>

              <div className="mt-5 border-t border-brand-50 pt-4">
                <h3 className="text-[12.5px] font-black tracking-wide text-ink-muted">
                  비용을 가르는 요인
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {c.factors.join(' · ')}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          {UNVERIFIED.pricing.verified ? null : (
            <NeedsInfo label={UNVERIFIED.pricing.label} note={UNVERIFIED.pricing.note} />
          )}
        </div>

        <MedicalNotice extra="비급여 진료비는 병원마다 다르며, 정확한 금액은 검사 후 개별 상태에 따라 안내드립니다. 원내 게시된 비급여 진료비를 함께 확인하실 수 있습니다." />
      </Container>

      <ContactCta
        title="검사 없이 나온 금액은 견적이 아닙니다"
        desc="구강 상태를 확인해야 어떤 항목이 필요한지 정해지고, 그래야 비용을 말씀드릴 수 있습니다."
      />
    </>
  );
}
