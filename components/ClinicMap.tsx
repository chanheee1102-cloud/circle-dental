import { CLINIC, UNVERIFIED } from '@/lib/clinic';

/**
 * 병원 위치 지도.
 *
 * ★ 왜 Google 임베드인가
 *   API 키 없이 확대·축소·드래그가 되는 지도를 넣을 수 있는 방법이 이것뿐이다.
 *   네이버·카카오 지도는 JS SDK 를 쓰려면 클라이언트 ID 발급이 필요하다(무료지만 도메인 등록 필요).
 *   기존 홈페이지도 같은 방식(Google 임베드)을 쓰고 있다.
 *
 * ★ 그런데 한국 사용자는 길찾기를 네이버·카카오로 한다
 *   그래서 지도는 '여기가 어디인지 보는 용도'로 두고, **실제 길찾기 버튼을 크게 따로 둔다**.
 *   지도만 있고 길찾기 링크가 없으면 사용자가 주소를 복사해 다른 앱에 붙여넣어야 한다.
 *
 * ★ loading="lazy" — 지도 iframe 은 무겁다. 화면에 들어올 때 불러온다.
 * ★ 좌표가 확인되지 않은 상태면 지도를 아예 렌더하지 않는다. 틀린 위치를 가리키는 지도는
 *   없는 것보다 나쁘다(환자가 엉뚱한 곳으로 간다).
 */
export function ClinicMap({ height = 420 }: { height?: number }) {
  const { lat, lng, verified } = UNVERIFIED.geo;
  if (!verified || lat == null || lng == null) return null;

  const q = encodeURIComponent(`${CLINIC.name} ${CLINIC.address.full}`);
  /** z=17 — 건물이 구분되면서 주변 랜드마크(화정역·이마트)도 함께 보이는 배율. */
  const embed = `https://maps.google.com/maps?q=${lat},${lng}&z=17&hl=ko&output=embed`;

  const links = [
    {
      href: `https://map.naver.com/p/search/${q}`,
      label: '네이버 지도',
      sub: '길찾기 · 대중교통',
      brand: 'bg-[#03C75A] text-white',
    },
    {
      href: `https://map.kakao.com/?q=${q}`,
      label: '카카오맵',
      sub: '길찾기 · 로드뷰',
      brand: 'bg-[#FEE500] text-[#3C1E1E]',
    },
    {
      href: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      label: 'Google 지도',
      sub: '새 창에서 크게',
      brand: 'bg-white text-ink border border-brand-200',
    },
  ];

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-brand-200/70 shadow-[var(--shadow-soft)]">
        <iframe
          src={embed}
          title={`${CLINIC.name} 위치 지도`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          style={{ height }}
          className="w-full border-0"
        />
        {/* 주소 바 — 지도 아래에 붙여 두면 스크린샷을 찍어 공유해도 주소가 함께 남는다. */}
        <p className="bg-brand-600 px-6 py-4 text-center text-[14.5px] font-semibold text-white">
          {CLINIC.address.full} ({CLINIC.address.dong}, {CLINIC.address.building})
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between gap-3 rounded-2xl px-5 py-4 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1 ${l.brand}`}
          >
            <span>
              <span className="block text-[15px] font-black">{l.label}</span>
              <span className="mt-0.5 block text-[12px] opacity-75">{l.sub}</span>
            </span>
            <span aria-hidden className="text-[15px] opacity-70">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
