import Link from 'next/link';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { NAV } from '@/lib/nav';
import { LogoLockup } from '@/components/Logo';

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
        <p className="mt-4 text-[11.5px] text-brand-200/40">
          &copy; {new Date().getFullYear()} {CLINIC.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
