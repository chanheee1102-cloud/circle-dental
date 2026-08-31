import Image from 'next/image';
import { IMG } from '@/lib/assets';

/**
 * 로고.
 *
 * ★ 기존 홈페이지의 실제 로고 파일을 그대로 쓴다. 비슷하게 그린 SVG 를 쓰면
 *   간판·명함·기존 인쇄물과 미세하게 어긋나 브랜드가 두 개로 갈라진다.
 * ★ 어두운 배경(푸터)에서는 원본이 짙은 회색이라 안 보인다. CSS 필터로 반전시킨다 —
 *   흰색 버전 파일을 따로 받으면 `tone="light"` 분기를 그 파일로 바꾸면 된다.
 * ★ priority — 헤더 로고는 첫 화면에 반드시 보이는 이미지라 지연 로딩하지 않는다.
 */
export function LogoLockup({ tone = 'brand' }: { tone?: 'brand' | 'light' }) {
  return (
    <Image
      src={IMG.logo}
      alt="동그라미치과의원 CIRCLE DENTAL CLINIC"
      width={214}
      height={44}
      priority
      className={`h-[38px] w-auto sm:h-[42px] ${tone === 'light' ? 'brightness-0 invert' : ''}`}
    />
  );
}

/**
 * 마크만 — 섹션 장식, 파비콘성 용도, 그리고 **헤더 알약 안의 로고**.
 *
 * @param tone 어두운 면에 놓을 때는 'light'.
 *   ⚠️ 기본값(brand)은 갈색 원이라 **어두운 유리 위에서 거의 안 보인다**(실제로 그랬다).
 *      어두운 면에서는 원을 밝게, 치아를 어둡게 뒤집는다. 색만 바꾸는 것으로는 안 된다 —
 *      원과 치아가 서로의 반대색이어야 형태가 읽힌다.
 */
export function LogoMark({ size = 44, tone = 'brand' }: { size?: number; tone?: 'brand' | 'light' }) {
  const light = tone === 'light';
  const ring = light ? 'rgba(255,255,255,0.55)' : 'var(--color-brand-400)';
  const body = light ? '#fefffc' : 'var(--color-brand-700)';
  const tooth = light ? '#1f1f29' : '#fff';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden focusable="false">
      <path
        d="M24 2.5a21.5 21.5 0 1 0 0 43"
        stroke={ring}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="17" fill={body} />
      <circle cx="34" cy="14" r="4.2" fill={body} />
      <path
        d="M24 14.6c-3.5 0-6 2.2-6 5.4 0 2.3.62 3.75 1.05 5.4.42 1.66.52 3.4.74 4.7.22 1.3.65 2.6 1.65 2.6 1 0 1.22-1.1 1.43-2.4.22-1.3.44-2.5 1.13-2.5.7 0 .92 1.2 1.13 2.5.21 1.3.43 2.4 1.43 2.4 1 0 1.43-1.3 1.65-2.6.22-1.3.32-3.04.74-4.7.43-1.65 1.05-3.1 1.05-5.4 0-3.2-2.5-5.4-6-5.4Z"
        fill={tooth}
      />
    </svg>
  );
}
