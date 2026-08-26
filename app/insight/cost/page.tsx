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
import { breadcrumbSchema, faqSchema, articleSchema, medicalWebPageSchema } from '@/lib/seo';
import { KeyPoints, ArticleMeta, References, charCount, headingId } from '@/components/article';
import { REFS_COST } from '@/lib/references';

export const metadata: Metadata = {
  title: '비용 가이드 — 무엇이 보험이고 무엇이 아닌가',
  description:
    '만 65세 임플란트 보험 조건, 스케일링 연 1회 적용, 신경치료와 크라운의 보험 차이. 치과 비용이 사람마다 달라지는 이유를 설명합니다.',
  alternates: { canonical: '/insight/cost' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '미리 알아두기', path: '/insight' },
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
          /*
           * ⚠️ 이 노드가 없으면 안 된다 (2026-08-18 전수 검사에서 발견).
           *   articleSchema 는 isPartOf / mainEntityOfPage 로 `#webpage` 를 가리키는데,
           *   여기 MedicalWebPage 가 없어서 **문서 안에서 해소되지 않는 참조**가 됐다.
           *   그래프가 열려 있으면 크롤러가 문서를 하나로 못 묶는다.
           */
          medicalWebPageSchema({
            title: '비용 가이드 — 무엇이 보험이고 무엇이 아닌가',
            description:
              '만 65세 임플란트 보험 조건, 스케일링 연 1회 적용, 신경치료와 크라운의 보험 차이. 치과 비용이 사람마다 달라지는 이유를 설명합니다.',
            path: '/insight/cost',
          }),
          articleSchema({
            path: '/insight/cost',
            title: '치과 비용 — 건강보험 적용 항목과 비급여 항목',
            description:
              '같은 치료라도 건강보험이 되는 부분과 안 되는 부분이 나뉩니다. 그 경계와 비용을 가르는 요인을 정리했습니다.',
            wordCount: charCount(COST_TOPICS.map((c) => c.title + c.answer + c.detail).join('')),
            keywords: ['치과 비용', '건강보험', '비급여', '임플란트 보험'],
          }),
          faqSchema(
            COST_TOPICS.map((c) => ({ q: c.title, a: c.answer })),
            '/insight/cost',
          ),
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

        <div className="mt-9 max-w-[70ch]">
          <ArticleMeta path="/insight/cost" />
        </div>

        {/*
          ★★ "얼마인가요?" 에 정면으로 답하는 자리 (2026-08-14) ★★
            외부 진단이 "가격 정보 없음 — 비용 검색에 노출 불가" 로 잡았다. 맞는 지적이다.
            비용 페이지인데 정작 **'얼마'라는 낱말에 답하는 문장이 없었다.**

          ⚠️⚠️ 그렇다고 금액을 지어낼 수는 없다 ⚠️⚠️
            비급여 진료비는 의료법상 **원내 게시 금액과 일치해야** 하고(UNVERIFIED.pricing),
            병원이 실제 금액을 주기 전에 적으면 그 자체가 거짓 표시다.
            → 대신 **금액이 정해지는 구조**를 답한다. "왜 병원마다 다른가", "내 경우는
              어디에 해당하는가" 는 실제로 검색하는 사람이 알고 싶어 하는 것이고,
              금액표 하나보다 이 답이 오래 맞다.
        */}
        <h2
          id={headingId('치과 치료비는 얼마인가요')}
          className="mt-12 scroll-mt-28 text-[22px] font-black text-ink sm:text-[26px]"
        >
          치과 치료비는 얼마인가요?
        </h2>
        <div className="mt-4 max-w-[68ch] rounded-2xl border-l-[3px] border-brand-500 bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-[17px] leading-[1.85] text-ink">
            같은 이름의 치료라도 <strong className="font-black">건강보험이 적용되는지</strong>에
            따라 부담이 크게 갈립니다. 급여 항목은 전국 어느 치과에서나 정해진 기준을 따르고
            본인부담률도 정해져 있는 반면, 비급여 항목은 병원이 각자 정하고 원내에 게시합니다.
            그래서 &lsquo;얼마&rsquo;는 <strong className="font-black">어떤 항목이 몇 개 필요한지</strong>가
            정해진 뒤에야 나옵니다.
          </p>
        </div>
        <div className="mt-6 max-w-[68ch] space-y-3 text-[15.5px] leading-[1.85] text-ink-soft">
          <p>
            아래 표에서 각 항목이 급여인지 비급여인지, 그리고 무엇이 비용을 가르는지 먼저
            확인하실 수 있습니다. 급여 항목의 본인부담률과 만 65세 이상 임플란트·틀니 적용 조건은
            국민건강보험공단이 정한 기준을 따르므로, 정확한 최신 기준은 아래 참고자료의
            공단·심사평가원 문서에서 확인하시는 것이 정확합니다.
          </p>
          <p>
            비급여 진료비는 검사 결과에 따라 필요한 항목이 달라져 검사 전에는 말씀드릴 수
            없습니다. 내원하시면 촬영 사진을 함께 보며 필요한 항목과 각각의 금액을 안내드리고,
            원내 게시된 비급여 진료비도 함께 확인하실 수 있습니다.
          </p>
        </div>

        <div className="mt-9 max-w-[70ch]">
          <KeyPoints
            items={[
              `전체 ${COST_TOPICS.length}개 항목 중 건강보험이 적용되는 항목은 ${
                COST_TOPICS.filter((c) => c.covered === 'insurance').length
              }개, 조건부 적용이 ${COST_TOPICS.filter((c) => c.covered === 'partial').length}개,
              비급여가 ${COST_TOPICS.filter((c) => c.covered === 'private').length}개입니다.`,
              '같은 치료라도 보험이 되는 부분과 안 되는 부분이 나뉘고, 그 경계가 최종 비용을 가장 크게 좌우합니다.',
              '검사 없이 나온 금액은 견적이 아닙니다 — 어떤 항목이 필요한지 정해져야 비용이 나옵니다.',
            ]}
          />
        </div>

        {/*
          ★★ 비교표 (2026-08-14) ★★
            같은 정보를 카드로만 두면 "내가 알아보려는 치료가 보험이 되나" 를 한눈에 못 본다.
            항목 × 보험 적용 × 비용을 가르는 요인 세 열이면 그 비교가 한 화면에서 끝난다.
            표는 답변 엔진이 특히 잘 인용하는 형식이기도 하다(행 단위로 사실이 끊긴다).
          ⚠️ 금액은 넣지 않는다 — 비급여 진료비는 확인된 값이 없고, 확인 없이 적는 순간
             의료광고법상 거짓 표시가 된다(UNVERIFIED.pricing 주석 참고).
          ⚠️ 좁은 화면에서 표는 가로로 넘친다. 감싼 div 가 자기 안에서만 스크롤되게 한다 —
             페이지 본문이 통째로 가로 스크롤되면 그건 고장으로 보인다.
        */}
        <div className="mt-10 overflow-x-auto rounded-2xl border border-brand-200/70">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">
              치과 진료 항목별 건강보험 적용 여부와 비용을 가르는 요인
            </caption>
            <thead>
              <tr className="bg-brand-50/70">
                <th scope="col" className="px-6 py-4 text-[13px] font-black text-ink">
                  항목
                </th>
                <th scope="col" className="px-6 py-4 text-[13px] font-black text-ink">
                  건강보험 적용
                </th>
                <th scope="col" className="px-6 py-4 text-[13px] font-black text-ink">
                  비용을 가르는 요인
                </th>
              </tr>
            </thead>
            <tbody>
              {COST_TOPICS.map((c) => (
                <tr key={c.slug} className="border-t border-brand-100">
                  <th scope="row" className="px-6 py-4 align-top text-[14.5px] font-bold text-ink">
                    <a href={`#${c.slug}`} className="hover:text-brand-700 hover:underline">
                      {c.title}
                    </a>
                  </th>
                  <td className="px-6 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[12.5px] font-black ${BADGE[c.covered]}`}
                    >
                      {COST_LABEL[c.covered]}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top text-[14px] leading-relaxed text-ink-soft">
                    {c.factors.join(' · ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 space-y-4">
          {COST_TOPICS.map((c) => (
            <article
              key={c.slug}
              id={c.slug}
              className="scroll-mt-28 rounded-2xl border border-brand-100 bg-white p-7"
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[12.5px] font-black ${BADGE[c.covered]}`}
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

        <div className="mt-10 max-w-[70ch]">
          <References items={REFS_COST} />
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
