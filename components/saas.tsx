import type { ReactNode } from 'react';

/**
 * 랜딩 페이지 조각들.
 *
 * ★★ 왜 새 언어가 필요했나 (2026-08-26, 오너 지시 3회) ★★
 *   ① 처음엔 국내 병원 문법을 썼다 — 전면 사진 히어로 + 어두운 오버레이 + 가운데 정렬 +
 *      자간 넓힌 영문 캡스 눈썹 + 화면을 가로지르는 어두운 밴드. 경쟁 병원과 구분이 안 됐다.
 *   ② 다음엔 밝은 카드 레이아웃으로 갈아탔다. 겹치지는 않게 됐는데 이번엔 **밋밋했다** —
 *      "AI 티 난다". 원인은 배치가 아니라 **타이포 스케일과 층이 약해서**였다.
 *      제목이 32px 이고 카드 그림자가 옅으니 화면 전체가 한 겹으로 눌려 보였다.
 *
 * ★ 지금 규칙 — 이 셋이 '전문적으로 보이는가' 를 가른다.
 *     ① **크기 대비를 크게 준다.** 제목은 최대 64px, 자간 -0.035em. 본문 16px 와의 격차가
 *        곧 위계다. 어중간한 32px 제목이 템플릿처럼 보이게 만든다.
 *     ② **층을 만든다.** 카드가 배경 위에 뜨고, 그 위에 또 뜬다. 그림자 두 단(soft/lift)을
 *        섞고 안쪽 하이라이트 링을 얹는다.
 *     ③ **구간마다 번호를 붙인다.** 01 —— 시술 방법. 문서가 아니라 설계된 화면으로 읽힌다.
 *
 * ⚠️ 되돌리지 말 것: 전면 사진 히어로, 화면을 가로지르는 어두운 밴드, 자간 넓힌 영문 캡스 눈썹.
 *    셋 다 경쟁 병원과 같아지는 지점이다.
 */

/** 구간 번호 + 라벨. 눈썹 대신 이것을 쓴다. */
export function SectionIndex({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="text-[12.5px] font-black text-clay-600 tabular-nums">{n}</span>
      <span aria-hidden className="line-in h-px w-8 bg-clay-500/50" />
      <span className="text-[12.5px] font-black text-ink-soft">{label}</span>
    </div>
  );
}

/**
 * 섹션 머리.
 * ★ 제목 크기를 clamp 로 잡아 화면이 넓어질수록 커진다 — 고정 px 는 큰 화면에서 초라해진다.
 */
export function SectionHead({
  n,
  label,
  title,
  desc,
  id,
  tone = 'light',
}: {
  n: string;
  label: string;
  title: ReactNode;
  desc?: string;
  id?: string;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    /* ★ 섹션 머리는 예외 없이 등장 연출을 받는다 — 호출부에서 매번 붙이면 반드시 빠뜨린다. */
    <div id={id} className={`reveal${id ? ' scroll-mt-36' : ''}`}>
      <div className="flex items-center gap-3.5">
        <span className={`text-[12.5px] font-black tabular-nums ${dark ? 'text-clay-400' : 'text-clay-600'}`}>
          {n}
        </span>
        <span aria-hidden className={`h-px w-8 ${dark ? 'bg-clay-400/50' : 'bg-clay-500/50'}`} />
        <span className={`text-[12.5px] font-black ${dark ? 'text-brand-200' : 'text-ink-soft'}`}>
          {label}
        </span>
      </div>
      <h2
        className={`display-sm mt-6 max-w-[20ch] text-[clamp(26px,3.4vw,42px)] leading-[1.24] tracking-[-0.03em] ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {desc ? (
        <p
          className={`mt-5 max-w-[56ch] text-[16px] leading-[1.9] ${dark ? 'text-brand-200' : 'text-ink-soft'}`}
        >
          {desc}
        </p>
      ) : null}
    </div>
  );
}

/**
 * 카드 — 이 페이지의 기본 단위.
 * ★ 안쪽 하이라이트 링(ring-inset white)이 있어야 흰 카드가 흰 배경에서 뜬다.
 *   테두리만으로는 층이 안 생긴다.
 */
export function Card({
  children,
  className = '',
  as: Tag = 'div',
  lift = false,
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
  lift?: boolean;
}) {
  return (
    <Tag
      className={`rounded-[22px] border border-brand-200/80 bg-white ring-1 ring-white/70 ring-inset ${
        lift ? 'shadow-[var(--shadow-lift)]' : 'shadow-[var(--shadow-soft)]'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

/** 어두운 면 위의 유리 카드. */
export function GlassCard({ children, className = '', as: Tag = 'div' }: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  return (
    <Tag
      className={`rounded-[22px] border border-white/12 bg-white/[0.055] ring-1 ring-white/[0.06] ring-inset backdrop-blur-sm ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * 어두운 패널 — 화면을 가로지르지 않고 모서리가 둥근 채로 안에 들어온다.
 * ★ 방사형 글로우 + 미세 노이즈가 있어야 '검은 사각형' 이 아니라 면으로 읽힌다.
 */
export function DarkPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative isolate overflow-hidden rounded-[28px] bg-ink ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_85%_8%,rgba(201,116,78,0.28)_0%,transparent_58%),radial-gradient(60%_50%_at_10%_100%,rgba(217,144,108,0.14)_0%,transparent_60%)]"
      />
      {/* 미세 노이즈 — 큰 어두운 면의 밴딩을 지우고 질감을 준다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/** 번호 칩 — 작게. 큰 세리프 숫자는 경쟁사 문법이라 쓰지 않는다. */
export function NumChip({ n, tone = 'light' }: { n: number | string; tone?: 'light' | 'dark' }) {
  return (
    <span
      className={`inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[12.5px] font-black tabular-nums ${
        tone === 'dark' ? 'bg-white/12 text-clay-300' : 'bg-ink text-white'
      }`}
    >
      {n}
    </span>
  );
}
