import Link from 'next/link';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { NAV } from '@/lib/nav';
import { LogoLockup } from '@/components/Logo';
import { SITE_MODIFIED, formatKoreanDate } from '@/lib/contentMeta';

/**
 * 전역 푸터.
 *
 * ★ 사업자 정보는 여기 한 곳에만 적는다. 두 군데 적으면 반드시 어긋난다.
 * ★ 진료시간은 확인 전까지 '확인 중' 으로 표시한다. 임의의 시간을 적어 두면
 *   그걸 보고 온 환자가 헛걸음한다 — 잘못된 정보는 없는 것보다 나쁘다.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-brand-100 bg-brand-900 text-brand-100">
      <div className="mx-auto max-w-[1200px] px-5 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <LogoLockup tone="light" />
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-brand-200/90">
              {CLINIC.description}
            </p>
            <a
              href={CLINIC.phoneHref}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-[16px] font-bold text-white transition-colors hover:bg-white/20"
            >
              {CLINIC.phone}
            </a>

            {/*
              ★★ 공식 채널 (2026-08-14 운영자) ★★
                푸터의 채널 링크는 장식이 아니다. 여기 걸린 주소가 그대로
                `sameAs` 로도 나가(lib/seo.ts) "이 홈페이지와 저 계정이 같은 병원" 이라는
                선언이 된다. 지식패널·지역 검색이 그 값을 읽는다.
                ⚠️ 그래서 **확인된 계정만** 건다. 없는 주소를 걸면 404 를 가리키는
                   동일성 선언이 되어 오히려 신호를 해친다.
              ★ 아이콘만 두지 않고 이름을 함께 적는다 — 아이콘만 있으면 스크린리더에서
                "링크" 로만 읽히고, 검색엔진도 무엇으로 가는 링크인지 알 수 없다.
            */}
            <div className="mt-7">
              <p className="text-[11.5px] font-black tracking-[0.16em] text-brand-200/60 uppercase">
                공식 채널
              </p>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                <li>
                  <a
                    href={CLINIC.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${CLINIC.name} 공식 인스타그램 (새 창)`}
                    className="group inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-[13.5px] font-bold text-brand-100 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <InstagramIcon />
                    인스타그램
                    <span
                      aria-hidden
                      className="text-[11px] text-brand-200/60 transition-transform group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={CLINIC.social.naverBlog}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${CLINIC.name} 네이버 블로그 (새 창)`}
                    className="group inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-[13.5px] font-bold text-brand-100 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <NaverMark />
                    네이버 블로그
                    <span
                      aria-hidden
                      className="text-[11px] text-brand-200/60 transition-transform group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={CLINIC.booking.naver}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${CLINIC.name} 네이버 예약 (새 창)`}
                    className="group inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-[13.5px] font-bold text-brand-100 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <NaverMark />
                    네이버 예약
                    <span
                      aria-hidden
                      className="text-[11px] text-brand-200/60 transition-transform group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={CLINIC.booking.kakao}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${CLINIC.name} 카카오톡 상담 (새 창)`}
                    className="group inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-[13.5px] font-bold text-brand-100 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <KakaoMark />
                    카카오톡 상담
                    <span
                      aria-hidden
                      className="text-[11px] text-brand-200/60 transition-transform group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {NAV.map((item) => (
              <div key={item.href}>
                <p className="text-[13px] font-black tracking-wide text-white">{item.label}</p>
                <ul className="mt-3 space-y-2">
                  {(item.children ?? [{ label: item.label, href: item.href }]).map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        className="text-[13px] text-brand-200/80 transition-colors hover:text-white"
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 text-[12.5px] leading-relaxed text-brand-200/70 sm:grid-cols-2">
          <div>
            <p>{CLINIC.address.full}</p>
            <p className="mt-1">
              {CLINIC.address.building} · {CLINIC.nearestStation} 인근
            </p>
          </div>
          <div>
            <p>대표자 {CLINIC.director} · 사업자등록번호 {CLINIC.bizNo}</p>
            <p className="mt-1">
              대표전화 / FAX {CLINIC.phone} · E-MAIL {CLINIC.email}
            </p>
            {UNVERIFIED.hours.verified && (
              <p className="mt-1.5 text-brand-200/90">
                {UNVERIFIED.hours.display.map((h) => `${h.label} ${h.time}`).join(' · ')} ·{' '}
                {UNVERIFIED.hours.closed}
              </p>
            )}
          </div>
        </div>

        <p className="mt-8 text-[11.5px] leading-relaxed text-brand-200/50">
          본 사이트의 진료 정보는 일반적인 이해를 돕기 위한 것으로 개별 진단을 대신하지 않습니다. 치료 결과는
          개인의 구강 상태와 전신 건강에 따라 다를 수 있으며, 모든 의료 행위에는 부작용이 따를 수 있습니다.
        </p>
        {/*
          개인정보처리방침은 푸터에 둔다 — 「개인정보 보호법」 제30조가 '정보주체가 쉽게 확인할 수
          있도록' 공개하라고 정하고 있고, 그 관행상의 자리가 푸터다. 주 메뉴에 올리면 진료 정보를
          찾는 흐름을 방해하고, 없으면 법적으로도 AI 신뢰도 평가에서도 감점이다.
        */}
        {/*
          ★★ 최종 확인일 — 모든 페이지에 (2026-08-14) ★★
            외부 진단이 "날짜 정보 없음 / 최근 연도는 있으나 구체적 날짜 없음" 으로 잡았다.
            본문형 페이지에는 발행·수정일을 달았지만 **홈에는 없었다.** 홈은 대부분의
            방문자와 크롤러가 처음 만나는 문서라, 거기 날짜가 없으면 사이트 전체가
            "언제 기준인지 모르는 곳" 으로 읽힌다.
          ★ `<time datetime>` 으로 기계 판독 값을 함께 준다. 사람에게는 한국어로,
            기계에게는 ISO 8601 로.
          ⚠️ 이 날짜는 lib/contentMeta.ts 의 SITE_MODIFIED 다. **실제로 내용을 고친 날만**
             올린다 — 안 고쳤는데 날짜만 올리면 그건 사실과 다른 표시이고,
             병원 홈페이지에서는 위험한 종류의 거짓말이다.
        */}
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px]">
          <Link
            href="/privacy"
            className="font-bold text-brand-200/80 transition-colors hover:text-white"
          >
            개인정보처리방침
          </Link>
          <span className="text-brand-200/60">
            병원 정보 최종 확인{' '}
            <time dateTime={SITE_MODIFIED} className="font-semibold text-brand-200/80">
              {formatKoreanDate(SITE_MODIFIED)}
            </time>
          </span>
          <span className="text-brand-200/40">
            &copy; {new Date().getFullYear()} {CLINIC.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

/*
 * 채널 아이콘 — 인라인 SVG 로 둔다.
 * ★ 아이콘 폰트나 외부 이미지를 쓰지 않는 이유: 요청이 하나 더 늘고, 늦게 뜨면
 *   푸터가 한 번 흔들린다. 세 개짜리라 인라인이 언제나 이긴다.
 * ★ 인스타그램은 브랜드 색(그라데이션)을 쓰지 않고 단색으로 둔다 — 짙은 푸터 위에서
 *   원색 그라데이션은 혼자 튀어 광고처럼 보인다. 네이버·카카오는 각인된 색이 강해
 *   단색으로 두면 오히려 못 알아보므로 브랜드 색을 유지한다.
 */
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false">
      <rect x="2.6" y="2.6" width="14.8" height="14.8" rx="4.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14.3" cy="5.7" r="1" fill="currentColor" />
    </svg>
  );
}

function NaverMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false">
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.6" fill="#03C75A" />
      <path d="M7.4 13.4V6.6h1.9l2.2 3.4V6.6h1.9v6.8h-1.9L9.3 10v3.4H7.4Z" fill="#fff" />
    </svg>
  );
}

function KakaoMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false">
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.6" fill="#FEE500" />
      <path
        d="M10 5.6c-2.9 0-5.2 1.8-5.2 4.1 0 1.5 1 2.8 2.5 3.5l-.6 2.2c-.05.2.16.35.33.24l2.6-1.7c.12.01.24.02.37.02 2.9 0 5.2-1.8 5.2-4.2S12.9 5.6 10 5.6Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}
