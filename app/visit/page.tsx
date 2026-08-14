import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { Container, SectionHead, Breadcrumb } from '@/components/ui';
import { ClinicMap } from '@/components/ClinicMap';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '오시는 길·진료시간',
  description: `${CLINIC.name} 위치와 진료시간. ${CLINIC.address.full}. 전화 ${CLINIC.phone}.`,
  alternates: { canonical: '/visit' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '내원 안내', path: '/visit' },
];

/**
 * 오시는 길.
 *
 * ★ 지도는 components/ClinicMap 이 담당한다(확대·축소 가능한 임베드 + 길찾기 버튼).
 *   좌표는 기존 홈페이지 /information 의 지도 위젯에서 추출한 실측값이다.
 * ★ 주소는 CLINIC 한 곳에서만 읽는다. 페이지마다 따로 적으면 반드시 어긋난다.
 */
export default function VisitPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(TRAIL)} />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          as="h1"
          eyebrow="내원 안내"
          title="화정동 현창빌딩 3층입니다"
          desc={`${CLINIC.nearestStation} 인근이며, ${CLINIC.serviceArea.slice(0, 4).join(' · ')} 에서 오십니다.`}
        />

        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/visit" />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* 위치 */}
          <div className="rounded-2xl border border-brand-100 bg-white p-8">
            <h2 className="text-[18px] font-black text-ink">위치</h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-[12px] font-black tracking-[0.14em] text-ink-muted uppercase">주소</dt>
                <dd className="mt-2 text-[16px] font-semibold leading-relaxed text-ink">
                  {CLINIC.address.full}
                </dd>
                <dd className="mt-1 text-[14px] text-ink-soft">{CLINIC.address.building}</dd>
              </div>
              <div>
                <dt className="text-[12px] font-black tracking-[0.14em] text-ink-muted uppercase">전화</dt>
                <dd className="mt-2">
                  <a
                    href={CLINIC.phoneHref}
                    className="text-[22px] font-black text-brand-700 hover:underline"
                  >
                    {CLINIC.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[12px] font-black tracking-[0.14em] text-ink-muted uppercase">
                  가까운 역
                </dt>
                <dd className="mt-2 text-[15.5px] text-ink-soft">{CLINIC.nearestStation}</dd>
              </div>
              {/* 주차 — 무료 여부는 방문 결정에 직접 영향을 주므로 위치 정보와 같은 층위에 둔다. */}
              <div>
                <dt className="text-[12px] font-black tracking-[0.14em] text-ink-muted uppercase">
                  주차
                </dt>
                <dd className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[15.5px] font-bold text-ink">{CLINIC.parking.type}</span>
                  <span className="rounded-lg bg-brand-100 px-3 py-1 text-[12.5px] font-black text-brand-700">
                    {CLINIC.parking.fee}
                  </span>
                </dd>
                <dd className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
                  {CLINIC.parking.note}
                </dd>
              </div>
            </dl>

            {/* 길찾기 버튼은 지도 바로 아래(ClinicMap)에 있다 — 여기에 또 두면 중복이다. */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-brand-200 px-5 py-2.5 text-[14px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
              >
                네이버 예약
              </a>
              <a
                href={CLINIC.booking.kakao}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-brand-200 px-5 py-2.5 text-[14px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
              >
                카카오톡 상담
              </a>
            </div>
          </div>

          {/* 진료시간 */}
          <div className="rounded-2xl border border-brand-100 bg-white p-8">
            <h2 className="text-[18px] font-black text-ink">진료시간</h2>
            <div className="mt-6">
              <ul className="divide-y divide-brand-100">
                {UNVERIFIED.hours.display.map((h) => (
                  <li
                    key={h.label}
                    className={`flex items-baseline justify-between gap-4 py-4 ${
                      h.label === '점심시간' ? 'text-ink-muted' : ''
                    }`}
                  >
                    <span className="text-[15.5px] font-bold text-ink">{h.label}</span>
                    <span className="text-right text-[15.5px] text-ink-soft">
                      {h.time}
                      {h.note && (
                        <span className="ml-2 rounded-lg bg-gold-500/15 px-2 py-0.5 text-[11.5px] font-black text-gold-600">
                          {h.note}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[13.5px] font-semibold text-ink-muted">
                ※ {UNVERIFIED.hours.closed}
              </p>
              <a
                href={CLINIC.phoneHref}
                className="mt-6 inline-flex rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 px-6 py-3 text-[15.5px] font-black text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-1"
              >
                {CLINIC.phone}
              </a>
            </div>
          </div>
        </div>

        {/* 지도 — 확대·축소·드래그 가능. 아래에 네이버·카카오 길찾기 버튼이 함께 붙는다. */}
        <div className="mt-8">
          <h2 className="display-sm text-[22px] text-ink">지도</h2>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
            길찾기는 아래 네이버 지도나 카카오맵 버튼을 눌러 주세요. 대중교통 경로와 로드뷰까지 함께
            확인하실 수 있습니다.
          </p>
          <div className="mt-6">
            <ClinicMap height={460} />
          </div>
        </div>
      </Container>
    </>
  );
}
