import type { Metadata } from 'next';
import Link from 'next/link';
import { TREATMENTS } from '@/lib/treatments';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { CLINIC_QA } from '@/lib/faq';
import { Container, SectionHead, Breadcrumb, MedicalNotice, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '자주 묻는 질문',
  description:
    '임플란트 기간, 신경치료 회차, 사랑니 발치, 잇몸치료 보험 적용까지. 동그라미치과에 자주 들어오는 질문을 모았습니다.',
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
 * ⚠️ 두 페이지에 같은 FAQPage 스키마가 중복으로 나가는 것은 피한다.
 *   여기서는 병원 운영 관련 질문만 스키마로 내고, 시술 Q&A 는 본문으로만 노출한다.
 *   (같은 Q&A 를 여러 URL 에서 스키마로 주장하면 검색엔진이 정본을 못 고른다.)
 */

export default function FaqPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(TRAIL), faqSchema(CLINIC_QA)]} />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          as="h1"
          eyebrow="자주 묻는 질문"
          title="많이 들어오는 질문을 모았습니다"
          desc="여기에 없는 것은 전화로 물어보셔도 됩니다. 진료 전 궁금한 점을 정리해 오시면 진료실에서 더 깊은 이야기를 할 수 있습니다."
        />

        {/* 병원 운영 관련 */}
        <section className="mt-14">
          <h2 className="text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]">
            내원·예약
          </h2>
          <div className="mt-7 divide-y divide-brand-100 border-t border-brand-100">
            {CLINIC_QA.map((qa) => (
              <article key={qa.q} className="py-6">
                <h3 className="text-[18px] font-black leading-snug text-ink">{qa.q}</h3>
                <p className="mt-3 max-w-[68ch] text-[15.5px] leading-[1.85] text-ink-soft">{qa.a}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={CLINIC.phoneHref}
              className="rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 px-6 py-3 text-[15.5px] font-black text-white shadow-[var(--shadow-btn)]"
            >
              {CLINIC.phone}
            </a>
            <a
              href={CLINIC.booking.naver}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-brand-300 bg-white px-6 py-3 text-[15.5px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              네이버 예약
            </a>
            <a
              href={CLINIC.booking.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-brand-300 bg-white px-6 py-3 text-[15.5px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              카카오톡 상담
            </a>
          </div>
          {/* 주차 안내는 확인 후 이 자리에 넣는다(2026-08-13 오너: "나중에 확인"). */}
        </section>

        {/* 치료별 — 원본은 treatments.ts */}
        {TREATMENTS.filter((t) => t.qa.length > 0).map((t) => (
          <section key={t.slug} className="mt-16">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[26px]">
                {t.name}
              </h2>
              <Link
                href={`/treatment/${t.slug}`}
                className="text-[14px] font-bold text-brand-700 hover:underline"
              >
                진료 안내 보기 →
              </Link>
            </div>
            <div className="mt-7 divide-y divide-brand-100 border-t border-brand-100">
              {t.qa.map((qa) => (
                <article key={qa.q} className="py-6">
                  <h3 className="text-[18px] font-black leading-snug text-ink">{qa.q}</h3>
                  <p className="mt-3 max-w-[68ch] text-[15.5px] leading-[1.85] text-ink-soft">{qa.a}</p>
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
