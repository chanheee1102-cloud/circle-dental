'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOpenStatus, type OpenStatus } from '@/lib/openStatus';

/**
 * 헤더의 진료 상태 배지.
 *
 * ★ 마운트 뒤에 계산한다
 *   서버가 그린 시각과 방문자의 현재 시각은 다르다. 서버에서 그리면 hydration 이 어긋나고,
 *   무엇보다 정적으로 생성된 페이지는 **빌드 시각이 박제되어** 밤에도 '진료 중' 이라 말한다.
 *   그래서 첫 렌더에서는 아무 말도 하지 않고, 마운트 후 실제 시각으로 채운다.
 *
 * ★ 1분마다 다시 계산한다 — 열고 닫는 순간에 화면이 그대로면 그 자체가 틀린 안내다.
 *
 * ★★ 공휴일은 판정하지 못한다 ★★
 *   달력 데이터가 없다(lib/openStatus.ts 주석 참고). 그래서 배지가 단정하지 않게 만든다 —
 *   `title` 로 '공휴일 휴진' 을 늘 함께 밝히고, 누르면 진료시간 전체가 있는 페이지로 간다.
 *   확신할 수 없는 것을 확신처럼 보이게 하지 않는 것이 이 배지의 유일한 규칙이다.
 */
export function OpenStatusBadge({ className = '' }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getOpenStatus());
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  // 계산 전에는 자리만 비워 둔다. 빈 배지를 그리면 깜빡이며 자리가 밀린다.
  if (!status) return null;

  const dot =
    status.state === 'open'
      ? 'bg-emerald-500'
      : status.state === 'lunch'
        ? 'bg-gold-500'
        : 'bg-brand-300';

  return (
    <Link
      href="/visit"
      title={`${status.label}${status.detail ? ` · ${status.detail}` : ''} · 일요일과 공휴일은 휴진입니다`}
      /*
       * ⚠️ 여기서 display 를 정하지 않는다 — Tailwind 는 class 문자열 순서가 아니라
       *    CSS 파일 순서로 이긴다. 기본값에 inline-flex 를 두면 호출부의 hidden 을 눌러
       *    390px 화면에서도 배지가 떠서 "진료"/"중" 두 줄로 쪼개졌다(실측).
       */
      className={`items-center gap-1.5 whitespace-nowrap rounded-full border border-brand-200 bg-white/70 py-1 pr-3 pl-2.5 text-[12px] font-bold text-ink-soft transition-colors hover:border-brand-400 hover:text-brand-700 ${className}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status.label}
      {status.detail && (
        <span className="hidden font-medium text-ink-muted xl:inline">· {status.detail}</span>
      )}
    </Link>
  );
}
