import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { Sentences } from '@/components/ui';

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
 * ★★ 지도는 **처음부터 떠 있다** (2026-08-14 운영자: "지도 늘 보이게") ★★
 *   한동안 '지도 보기' 를 눌러야 뜨게 해 뒀다. PSI 모바일 점수 때문이었는데,
 *   운영자 판단은 다르다 — 오시는 길 페이지에 왔는데 지도가 회색 상자면 그게 고장으로 보인다.
 *   점수 몇 점보다 "여기가 어딘지 바로 보이는 것" 이 이 페이지의 존재 이유다.
 *   대신 `loading="lazy"` 는 남겨 둔다. 화면에 들어올 때 받으므로 첫 화면은 그대로다.
 *   ⚠️ 다시 클릭식으로 되돌리지 말 것 (되돌리려면 운영자 GO 필요).
 *
 * ★ 좌표가 확인되지 않은 상태면 지도를 아예 렌더하지 않는다. 틀린 위치를 가리키는 지도는
 *   없는 것보다 나쁘다(환자가 엉뚱한 곳으로 간다).
 */
export function ClinicMap({
  height = 420,
  variant = 'full',
}: {
  height?: number;
  /**
   * full    — 지도 + 주소 바 + 지도 앱 버튼 셋. 오시는 길 **전용 페이지**용.
   * compact — 지도만. 다른 정보(주소·전화·주차) 옆에 곁들일 때 쓴다.
   *
   * ★★ 왜 나눴나 (2026-08-25 운영자: "여기 왼쪽밑에 지도 나오게 못하나?") ★★
   *   홈의 '오시는 길' 은 오른쪽에 주소 카드가 이미 있고 그 아래 '지도 · 길찾기 보기'
   *   버튼도 있다. 거기에 full 을 그대로 넣으면 **주소가 세 번, 길찾기 버튼이 두 벌**
   *   나온다. 홈에서 비어 있던 것은 '여기가 어디인지 보이는 그림' 하나였으므로
   *   그것만 넣는다.
   * ⚠️ /visit · /contact 는 full 그대로 둔다. 그 페이지들에는 곁들일 카드가 없어서
   *    주소 바와 앱 버튼이 유일한 길찾기 수단이다.
   */
  variant?: 'full' | 'compact';
}) {
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
      dot: '#03C75A',
    },
    {
      href: `https://map.kakao.com/?q=${q}`,
      label: '카카오맵',
      sub: '길찾기 · 로드뷰',
      dot: '#FEE500',
    },
    {
      href: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      label: 'Google 지도',
      sub: '새 창에서 크게',
      dot: '#4285F4',
    },
  ];

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-brand-200/70 shadow-[var(--shadow-soft)]">
        {/*
          ★ loading="lazy" — 화면에 들어올 때 받는다. 지도는 대부분 페이지 아래쪽에 있어
            첫 화면 로딩에는 영향을 주지 않으면서 스크롤해 내려오면 이미 떠 있다.
        */}
        <iframe
          src={embed}
          title={`${CLINIC.name} 위치 지도`}
          referrerPolicy="no-referrer-when-downgrade"
          loading="lazy"
          allowFullScreen
          style={{ height }}
          className="w-full border-0"
        />
        {/* 주소 바 — 지도 아래에 붙여 두면 스크린샷을 찍어 공유해도 주소가 함께 남는다. */}
        {variant === 'full' && (
          <p className="bg-brand-600 px-6 py-4 text-center text-[15.5px] font-semibold text-white">
            {/*
              ⚠️ max-w 를 지우지 말 것 — 없으면 넓은 화면에서 한 줄이 81자까지 늘어난다(실측).
                 한글에서 편한 한 줄은 35~45자다. 가운데 정렬이라 mx-auto 가 함께 있어야 한다.
            */}
            <span className="mx-auto block max-w-[40em]">
              {CLINIC.address.full} ({CLINIC.address.dong}, {CLINIC.address.building})
            </span>
          </p>
        )}
      </div>

      {variant === 'compact' ? null : (
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 rounded-[12px] border border-brand-200/70 card-glass px-4 py-3.5 transition-colors hover:border-brand-300"
          >
            {/* 브랜드 조각 — 이게 '어느 앱인지' 를 말한다. 색을 바꾸지 말 것. */}
            <span
              aria-hidden
              className="h-8 w-8 shrink-0 rounded-[8px]"
              style={{ backgroundColor: l.dot }}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-semibold text-ink">{l.label}</span>
              <span className="mt-0.5 block text-[13.5px] text-ink-soft"><Sentences text={l.sub} /></span>
            </span>
            <span aria-hidden className="text-[15px] text-ink-soft">
              ↗
            </span>
          </a>
        ))}
      </div>
      )}
    </div>
  );
}
