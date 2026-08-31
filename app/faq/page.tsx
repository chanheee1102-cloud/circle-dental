import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import Link from 'next/link';
import { TREATMENTS } from '@/lib/treatments';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { CLINIC_QA } from '@/lib/faq';
import { Container, MedicalNotice, ContactCta, PageHero } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '자주 묻는 질문',
  /* 66자였다 — 있는 사실(진료시간·예약 경로·지역)만으로 늘렸다(2026-08-18). */
  description:
    '임플란트 기간, 신경치료 회차, 사랑니 발치, 잇몸치료 보험 적용까지. 진료시간과 예약 방법도 함께 정리했습니다. 경기 고양시 덕양구 화정동, 화정역 인근 동그라미치과의원입니다.',
  alternates: { canonical: '/faq' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '내원 안내', path: '/visit' },
  { name: '자주 묻는 질문', path: '/faq' },
];

/**
 * FAQ 허브.
 *
 * ★ 진료과목 페이지의 Q&A 를 여기서 다시 모은다.
 *   중복처럼 보이지만 의도한 것이다 — 검색 유입 경로가 다르다. 시술명으로 들어오는 사람은
 *   진료과목 페이지로, 질문 문장으로 들어오는 사람은 이 페이지로 온다.
 *   원본은 lib/treatments.ts 한 곳이라 내용이 갈라질 일은 없다.
 *
 * ★★ 2026-08-27 — 여기가 문답의 **정본**이 됐다 ★★
 *   진료 페이지가 너무 길어져 문답을 전부 이리로 옮겼다(오너 지시). 진료 페이지에는
 *   /faq#<slug> 로 가는 줄만 남고 화면에도 스키마에도 문답이 없다.
 *   그래서 FAQPage 구조화 데이터를 이 페이지가 통째로 낸다 — 화면에 보이는 것과 스키마가
 *   같은 곳에 있어야 검색엔진이 정본을 고를 수 있다.
 * ⚠️ 진료 페이지에 문답을 되살리려면 화면과 스키마를 **같이** 옮길 것. 한쪽만 옮기면
 *   보이지 않는 내용을 주장하는 꼴이 된다.
 */

export default function FaqPage() {
  return (
    <>
      {/* 병원 운영 문답 + 진료별 문답 전부가 이 페이지의 스키마다(위 머리말 참고). */}
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          faqSchema(
            [...CLINIC_QA, ...TREATMENTS.flatMap((t) => t.qa)].map((qa) => ({ q: qa.q, a: qa.a })),
            '/faq',
          ),
        ]}
      />

      <PageHero
        trail={TRAIL}
        photo="consult"
        eyebrow="자주 묻는 질문"
        title="많이 들어오는 질문을 모았습니다"
        desc="궁금한 점을 정리해 오시면 진료실에서 더 깊은 이야기를 할 수 있습니다. 여기에 없는 것은 전화로 물어보셔도 됩니다."
      />

      <Container className="py-12 lg:py-16">

        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/faq" />
        </div>

        {/* 병원 운영 관련 */}
        <section className="mt-14">
          <h2 className="text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]">
            내원·예약
          </h2>
          <div className="mt-7 divide-y divide-brand-100 border-t border-brand-100">
            {CLINIC_QA.map((qa) => (
              <article key={qa.q} className="py-6">
                <h3 className="text-[18px] font-black leading-snug text-ink">{qa.q}</h3>
                <p className="mt-3 max-w-[68ch] text-[16.5px] leading-[1.85] text-ink-soft">{qa.a}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={CLINIC.phoneHref}
              className="rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-6 py-3 text-[16.5px] font-black text-white shadow-[var(--shadow-btn)]"
            >
              {CLINIC.phone}
            </a>
            <a
              href={CLINIC.booking.naver}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full btn-pane border px-6 py-3 text-[16.5px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              네이버 예약
            </a>
            <a
              href={CLINIC.booking.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full btn-pane border px-6 py-3 text-[16.5px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              카카오톡 상담
            </a>
          </div>
          {/* 주차 안내는 확인 후 이 자리에 넣는다(2026-08-13 오너: "나중에 확인"). */}
        </section>

        {/* 치료별 — 원본은 treatments.ts */}
        {TREATMENTS.filter((t) => t.qa.length > 0).map((t) => (
          /* 진료 페이지에서 /faq#<slug> 로 들어온다 — id 를 지우면 그 링크가 죽는다. */
          <section key={t.slug} id={t.slug} className="mt-16 scroll-mt-28">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]">
                {t.name}
              </h2>
              <Link
                href={`/treatment/${t.slug}`}
                className="text-[15px] font-bold text-brand-700 hover:underline"
              >
                진료 안내 보기 →
              </Link>
            </div>
            <div className="mt-7 divide-y divide-brand-100 border-t border-brand-100">
              {t.qa.map((qa) => (
                <article key={qa.q} className="py-6">
                  <h3 className="text-[18px] font-black leading-snug text-ink">{qa.q}</h3>
                  <p className="mt-3 max-w-[68ch] text-[16.5px] leading-[1.85] text-ink-soft">{qa.a}</p>
                </article>
              ))}
            </div>
          </section>
        ))}

        <MedicalNotice />
      </Container>

      <ContactCta />
    </>
  );
}
