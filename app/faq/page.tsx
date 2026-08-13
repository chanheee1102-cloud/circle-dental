import type { Metadata } from 'next';
import Link from 'next/link';
import { TREATMENTS } from '@/lib/treatments';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
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
/**
 * 내원·예약 문답.
 *
 * ★★ 이전 버전에서 걷어낸 것 ★★
 *   주차 가능 여부, 예약 없이 와도 되는지 같은 **운영 정보를 내가 지어냈었다**.
 *   확인된 바가 없는 내용이라 전부 정리했다. 주차는 원장님 확인 후 넣기로 했으므로
 *   지금은 항목 자체를 두지 않는다 — 애매하게 적어 두면 그 자체가 잘못된 안내가 된다.
 *
 * ★ 지금 남은 것은 두 종류뿐이다
 *   ① 확인된 사실(진료시간·예약 채널·위치)
 *   ② 병원 방침이 아닌 일반적인 치과 진료 정보
 *   ⚠️ 여기에 운영 정보를 추가하려면 반드시 원장님 확인이 먼저다.
 */
const CLINIC_QA = [
  {
    q: '진료시간이 어떻게 되나요?',
    a: '월·수·금은 오전 9시 30분부터 오후 6시 30분까지, 화·목은 오후 8시 30분까지 야간 진료를 합니다. 토요일은 오전 9시 30분부터 오후 2시까지이며 일요일과 공휴일은 휴진입니다. 평일 점심시간은 오후 1시부터 2시 30분까지입니다.',
  },
  {
    q: '예약은 어떻게 하나요?',
    a: `전화(${CLINIC.phone}), 네이버 예약, 카카오톡 상담으로 하실 수 있습니다. 미리 연락하시면 증상에 필요한 시간을 확보해 둘 수 있어 대기가 줄어듭니다.`,
  },
  {
    q: '위치가 어디인가요?',
    a: `${CLINIC.address.full}입니다. ${CLINIC.address.building} 3층이며 ${CLINIC.nearestStation} 인근입니다.`,
  },
  {
    q: '주차는 가능한가요?',
    a: `${CLINIC.parking.type}을 ${CLINIC.parking.fee}로 이용하실 수 있습니다. ${CLINIC.parking.note}`,
  },
  {
    q: '다른 병원에서 찍은 엑스레이를 가져가도 되나요?',
    a: '가져오시면 도움이 됩니다. 최근에 찍은 사진이라면 중복 촬영을 줄일 수 있습니다. 다만 촬영한 지 오래됐거나 필요한 부위가 나오지 않은 경우에는 다시 찍어야 할 수 있습니다.',
  },
  {
    q: '복용 중인 약이 있으면 어떻게 하나요?',
    a: '임의로 중단하지 마시고 복용 중이라는 사실을 알려주세요. 특히 항응고제(아스피린·와파린 등), 골다공증 주사제, 당뇨약은 치료 계획과 안전에 직접 영향을 줍니다. 필요하면 주치의와 상의해 일정을 조율합니다.',
  },
  {
    q: '임신 중에도 치과 치료를 받을 수 있나요?',
    a: '받을 수 있습니다. 임신 중에는 호르몬 변화로 잇몸 염증이 잘 생겨 오히려 관리가 더 필요합니다. 다만 시기에 따라 권장되는 처치가 달라지므로 임신 주수를 먼저 알려주시는 것이 좋습니다.',
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(TRAIL), faqSchema(CLINIC_QA)]} />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
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
