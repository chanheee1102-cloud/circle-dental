'use client';

import { useState } from 'react';
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
 * ★ 지도는 **누르면 뜬다**(아래 mapOn 주석 참고). loading="lazy" 만으로는 PSI 비용이 남는다.
 * ★ 좌표가 확인되지 않은 상태면 지도를 아예 렌더하지 않는다. 틀린 위치를 가리키는 지도는
 *   없는 것보다 나쁘다(환자가 엉뚱한 곳으로 간다).
 */
export function ClinicMap({ height = 420 }: { height?: number }) {
  const [mapOn, setMapOn] = useState(false);
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
        {/*
          ★ 누르기 전에는 지도 iframe 을 만들지 않는다 (2026-08-14, PSI 대응).
            loading="lazy" 만으로는 부족하다 — 화면 근처에 오면 결국 지도 스크립트를
            통째로 받아 실행하고, 그 비용이 PSI 모바일 점수를 그대로 깎는다.
            실제로 지도를 확대·이동해 보는 사람보다 **주소를 읽고 길찾기 버튼을 누르는**
            사람이 훨씬 많다. 그 사람들에게 지도 스크립트 값을 물릴 이유가 없다.
          ★ 다만 '지도가 없는 것' 처럼 보이면 안 된다 — 자리표시자에 주소와 안내를 적고
            아래 길찾기 버튼은 그대로 둔다. 지도를 안 눌러도 할 일은 다 할 수 있다.
        */}
        {mapOn ? (
          <iframe
            src={embed}
            title={`${CLINIC.name} 위치 지도`}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            style={{ height }}
            className="w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setMapOn(true)}
            style={{ height }}
            className="flex w-full flex-col items-center justify-center gap-3 bg-brand-100/70 transition-colors hover:bg-brand-100"
          >
            <span
              aria-hidden
              className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-300 bg-white text-[19px] text-brand-600"
            >
              ⌖
            </span>
            <span className="text-[15.5px] font-bold text-brand-700">지도 보기</span>
            <span className="px-6 text-center text-[13px] leading-relaxed text-ink-muted">
              {CLINIC.address.full}
            </span>
          </button>
        )}
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
