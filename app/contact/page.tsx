import type { Metadata } from 'next';
import Link from 'next/link';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { Container, SectionHead, Breadcrumb, ContactCta } from '@/components/ui';
import { ArticleMeta, headingId } from '@/components/article';
import { ClinicMap } from '@/components/ClinicMap';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, medicalWebPageSchema, og, ID, abs } from '@/lib/seo';

/**
 * 연락처 — 창구별로 무엇을 물어보면 되는지까지.
 *
 * ★★ 왜 `/visit` 이 있는데 또 만드나 (2026-08-14) ★★
 *   `/visit` 은 **오시는 길**이다. 지도와 교통편이 주인공이고 제목도 위치를 말한다.
 *   그런데 "연락처" 를 찾는 사람은 길을 묻는 게 아니라 **말을 걸 방법**을 찾는다.
 *   외부 진단이 "핵심 페이지 누락: contact" 로 잡은 것도 같은 이야기다 —
 *   /contact 는 사람도 크롤러도 관습적으로 먼저 찾아보는 주소다.
 *
 * ★ 그래서 이 페이지는 **창구별로 무엇에 적합한지**를 답한다. 전화·카톡·네이버 예약이
 *   나란히 있으면 어느 것을 눌러야 할지 오히려 망설이게 된다.
 *
 * ⚠️⚠️ 새 정보를 만들지 않는다 ⚠️⚠️
 *   전화·이메일·주소·진료시간·주차는 전부 CLINIC / UNVERIFIED 에서 온다.
 *   여기서 문의 폼을 만들지도 않는다 — 폼을 두면 환자의 증상 정보를 받게 되고,
 *   그건 민감정보 처리라 별도 동의·보관 절차가 필요하다(개인정보처리방침 참고).
 *   지금 이 사이트는 어떤 개인정보도 받지 않는 구조이고, 그 편이 안전하다.
 */
export const metadata: Metadata = {
  title: '연락처 · 예약 문의',
  description: `${CLINIC.name} 연락처입니다. 전화 ${CLINIC.phone}, 카카오톡 상담, 네이버 예약 중 편한 방법으로 연락하실 수 있습니다. ${CLINIC.address.locality} ${CLINIC.address.dong} 소재.`,
  alternates: { canonical: '/contact' },
  openGraph: og({
    title: `연락처 · 예약 문의 | ${CLINIC.name}`,
    description: `전화 ${CLINIC.phone} · 카카오톡 상담 · 네이버 예약. ${CLINIC.address.full}`,
    path: '/contact',
  }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '내원 안내', path: '/visit' },
  { name: '연락처', path: '/contact' },
];

/** 창구 — 각각 무엇에 맞는지까지 적는다. 나열만 하면 고르는 부담을 넘기는 셈이다. */
const CHANNELS = [
  {
    key: 'phone',
    name: '전화',
    value: CLINIC.phone,
    href: CLINIC.phoneHref,
    external: false,
    best: '지금 아프거나 급할 때',
    detail:
      '증상을 직접 말씀하시면 그날 오셔야 하는 상황인지 먼저 판단해 드립니다. 진료 중에는 연결이 늦어질 수 있습니다.',
  },
  {
    key: 'naver',
    name: '네이버 예약',
    value: '시간 선택 후 바로 확정',
    href: CLINIC.booking.naver,
    external: true,
    best: '급하지 않고 시간을 정하고 싶을 때',
    detail:
      '가능한 시간대를 보고 직접 고르실 수 있습니다. 통화 없이 예약이 끝나므로 진료 중이거나 근무 중이어도 잡을 수 있습니다.',
  },
  {
    key: 'kakao',
    name: '카카오톡 상담',
    value: '메시지로 문의',
    href: CLINIC.booking.kakao,
    external: true,
    best: '간단히 물어보고 싶을 때',
    detail:
      '진료시간·주차·준비물처럼 짧은 질문에 맞습니다. 증상 판단은 구강을 봐야 가능하므로 메시지만으로는 진단해 드릴 수 없습니다.',
  },
  {
    key: 'email',
    name: '이메일',
    value: CLINIC.email,
    href: `mailto:${CLINIC.email}`,
    external: false,
    best: '서류·제휴 문의',
    detail: '진료 문의는 전화나 카카오톡이 빠릅니다.',
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          {
            ...medicalWebPageSchema({
              title: `${CLINIC.name} 연락처 · 예약 문의`,
              description: metadata.description as string,
              path: '/contact',
            }),
            /*
             * ContactPage — "연락처 페이지" 라는 것을 타입으로 밝힌다.
             * 검색엔진이 사이트의 역할별 페이지(소개·연락·서비스)를 구분할 때 보는 값이다.
             */
            '@type': ['MedicalWebPage', 'ContactPage'],
            mainEntity: { '@id': ID.clinic },
            significantLink: [
              abs('/visit'),
              CLINIC.booking.naver,
              CLINIC.booking.kakao,
            ],
          },
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          as="h1"
          eyebrow="연락처"
          title="어떻게 연락드리면 될까요?"
          desc="전화, 네이버 예약, 카카오톡 중 편한 방법으로 연락하실 수 있습니다. 상황에 따라 맞는 창구가 다르므로 아래에 각각 무엇에 적합한지 적어 두었습니다."
        />

        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/contact" />
        </div>

        {/* 창구 — 표로 두면 '무엇에 맞는지' 를 같은 기준으로 비교할 수 있다. */}
        <div className="mt-12 overflow-x-auto rounded-2xl border border-brand-200/70">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <caption className="sr-only">
              {CLINIC.name} 연락 창구별 연락처와 적합한 상황
            </caption>
            <thead>
              <tr className="bg-brand-50/70">
                <th scope="col" className="px-6 py-4 text-[13px] font-black text-ink">
                  창구
                </th>
                <th scope="col" className="px-6 py-4 text-[13px] font-black text-ink">
                  연락처
                </th>
                <th scope="col" className="px-6 py-4 text-[13px] font-black text-ink">
                  이럴 때 적합합니다
                </th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => (
                <tr key={c.key} className="border-t border-brand-100">
                  <th scope="row" className="px-6 py-5 align-top text-[15px] font-black text-ink">
                    {c.name}
                  </th>
                  <td className="px-6 py-5 align-top">
                    <a
                      href={c.href}
                      {...(c.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="font-bold text-brand-700 underline underline-offset-4 hover:text-brand-500"
                    >
                      {c.value}
                    </a>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <span className="block text-[14.5px] font-bold text-ink">{c.best}</span>
                    <span className="mt-1.5 block max-w-[46ch] text-[13.5px] leading-relaxed text-ink-soft">
                      {c.detail}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 진료시간 — '언제 연락되나' 는 연락처와 한 세트다. */}
        {UNVERIFIED.hours.verified && (
          <section className="mt-14">
            <h2
              id={headingId('언제 연락하면 되나요')}
              className="scroll-mt-28 text-[22px] font-black text-ink sm:text-[26px]"
            >
              언제 연락하면 되나요?
            </h2>
            <p className="mt-3 max-w-[62ch] text-[15.5px] leading-[1.8] text-ink-soft">
              아래 진료시간에 전화가 연결됩니다. 네이버 예약과 카카오톡은 시간과 관계없이 남기실 수
              있고, 진료시간에 확인해 답변드립니다.
            </p>
            <dl className="mt-7 max-w-2xl overflow-hidden rounded-2xl border border-brand-200/70 bg-white">
              {UNVERIFIED.hours.display.map((h, i) => (
                <div
                  key={h.label}
                  className={`flex items-baseline justify-between gap-4 px-7 py-4.5 ${
                    i > 0 ? 'border-t border-brand-100' : ''
                  } ${h.label === '점심시간' ? 'bg-brand-50/70' : ''}`}
                >
                  <dt className="text-[15px] font-black text-ink">{h.label}</dt>
                  <dd className="text-[15.5px] font-bold text-brand-700">{h.time}</dd>
                </div>
              ))}
              <p className="border-t border-brand-100 px-7 py-3.5 text-[13.5px] font-semibold text-ink-muted">
                ※ {UNVERIFIED.hours.closed}
              </p>
            </dl>
          </section>
        )}

        {/* 위치 — 여기서 끝내지 않고 오시는 길로 넘긴다. 이 페이지의 주인공은 연락 방법이다. */}
        <section className="mt-14">
          <h2
            id={headingId('어디로 가면 되나요')}
            className="scroll-mt-28 text-[22px] font-black text-ink sm:text-[26px]"
          >
            어디로 가면 되나요?
          </h2>
          <p className="mt-3 max-w-[62ch] text-[15.5px] leading-[1.8] text-ink-soft">
            {CLINIC.address.full} ({CLINIC.address.building}). {CLINIC.nearestStation} 인근이며{' '}
            {CLINIC.parking.type}을 {CLINIC.parking.fee}로 이용하실 수 있습니다.
          </p>
          <div className="mt-8">
            <ClinicMap height={360} />
          </div>
          <Link
            href="/visit"
            className="group mt-8 inline-flex items-center gap-2 border-b-[1.5px] border-brand-400 pb-1 text-[14.5px] font-bold text-brand-700 transition-colors hover:border-brand-700"
          >
            대중교통·주차 자세히 보기{' '}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </section>
      </Container>

      <ContactCta
        title="증상부터 말씀해 주세요"
        desc="지금 오셔야 하는 상황인지 먼저 확인해 드립니다."
      />
    </>
  );
}
