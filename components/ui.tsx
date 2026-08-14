import Link from 'next/link';
import { CLINIC, MEDICAL_DISCLAIMER } from '@/lib/clinic';

/**
 * 페이지 폭을 한 곳에서 통제한다. 페이지마다 max-w 를 따로 적으면 반드시 어긋난다.
 *
 * ★ 1200 → 1320 (2026-08-14 운영자: "헤더가 너무 딱 모여 있다").
 *   헤더에 로고·상태배지·메뉴 5개·전화·예약 버튼이 한 줄에 들어가 숨 쉴 틈이 없었다.
 *   ⚠️ 헤더(SiteHeader)의 max-w 도 **같은 값**이어야 한다. 다르면 헤더 양끝과 본문 양끝이
 *      어긋나 화면 전체가 미묘하게 삐뚤어져 보인다.
 */
export function Container({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[1320px] px-5 lg:px-8 ${className}`}>{children}</div>;
}

/** 좁은 본문 폭 — 읽기 위한 글은 한 줄이 길면 눈이 다음 줄을 놓친다. */
export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose-body max-w-[68ch] text-[16.5px] leading-[1.85] text-ink-soft">{children}</div>;
}

export function SectionHead({
  eyebrow,
  title,
  desc,
  as = 'h2',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  desc?: string;
  /**
   * ★★ 이 페이지의 제목이면 반드시 `as="h1"` ★★ (2026-08-14 실측으로 발견)
   *
   *   이 컴포넌트는 늘 h2 만 냈다. 그런데 목록·허브 페이지들은 제목을 이것 하나로만
   *   그리고 있어서, **h1 이 아예 없는 페이지가 13개** 였다(89개 중).
   *     /treatment · /faq · /visit · /insight · /insight/symptom · /insight/condition
   *     /insight/journey · /insight/cost · /insight/glossary · /insight/emergency
   *     /about/doctors · /about/tour · /about/process
   *
   *   h1 이 없으면 "이 문서가 무엇에 관한 것인가" 를 한 줄로 집어 줄 자리가 사라진다.
   *   답변 엔진은 h1 을 문서의 주제로 쓰기 때문에, 없으면 본문에서 추론해야 하고
   *   그 추론은 자주 빗나간다. 화면은 그대로인데 기계가 읽는 구조만 비어 있던 셈이다.
   *
   *   ⚠️ 한 페이지에 h1 은 하나다. 섹션 머리글로 쓸 때는 기본값(h2)을 그대로 둔다.
   */
  as?: 'h1' | 'h2';
}) {
  const H = as;
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          {eyebrow}
        </p>
      )}
      {/* 페이지 제목은 한 단계 크게 — 문서의 머리라는 것이 눈으로도 보여야 한다. */}
      <H
        className={
          as === 'h1'
            ? 'display-sm mt-4 text-[32px] text-ink sm:text-[42px]'
            : 'display-sm mt-4 text-[28px] text-ink sm:text-[36px]'
        }
      >
        {title}
      </H>
      {desc && <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">{desc}</p>}
    </div>
  );
}

/**
 * 빵부스러기.
 * ★ 시각적 장식이 아니라 크롤러에게 계층을 알려주는 신호다. 깊은 페이지일수록 중요하다.
 */
export function Breadcrumb({ trail }: { trail: Array<{ name: string; path: string }> }) {
  return (
    <nav aria-label="현재 위치" className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-muted">
      {trail.map((t, i) => (
        <span key={t.path} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden>›</span>}
          {i === trail.length - 1 ? (
            <span className="font-semibold text-ink-soft" aria-current="page">
              {t.name}
            </span>
          ) : (
            <Link href={t.path} className="transition-colors hover:text-brand-700">
              {t.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * 질문–답변 블록 — 이 사이트의 AEO 주력 형식.
 *
 * ★ 왜 `<h2>` 에 질문을 그대로 쓰는가
 *   AI 검색엔진은 문서에서 "질문과 같은 제목 + 바로 뒤에 오는 짧은 답" 을 찾아 인용한다.
 *   제목을 "임플란트 기간" 처럼 명사구로 줄이면 자연어 질의와 매칭이 약해진다.
 *   환자가 실제로 치는 문장을 그대로 제목에 쓰는 것이 핵심이다.
 * ★ 답은 첫 단락에서 끝난다. 답을 세 문단 뒤에 두면 인용되지 않는다.
 */
export function QABlock({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <div className="divide-y divide-brand-100">
      {items.map((it) => (
        <article key={it.q} className="py-7 first:pt-0 last:pb-0">
          <h2 className="text-[19px] font-black leading-snug tracking-[-0.01em] text-ink sm:text-[21px]">
            {it.q}
          </h2>
          <p className="mt-3 max-w-[70ch] text-[16px] leading-[1.85] text-ink-soft">{it.a}</p>
        </article>
      ))}
    </div>
  );
}

/**
 * 확인되지 않은 정보 자리.
 *
 * ★ 왜 빈칸으로 두지 않고 이렇게 드러내는가
 *   빈칸은 "아직 안 만든 페이지" 로 보이지만, 이 배지는 "무엇을 채워야 하는지" 를 지목한다.
 *   그리고 가짜 값으로 채우는 것을 구조적으로 막는다 — 의료광고에서 사실이 아닌 표시는
 *   의료법 제56조 위반이고, 틀린 진료시간은 환자를 헛걸음시킨다.
 */
export function NeedsInfo({ label, note }: { label: string; note: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gold-400/70 bg-gold-400/8 p-5">
      <p className="flex items-center gap-2 text-[13px] font-black text-gold-600">
        <span
          aria-hidden
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[11px] text-white"
        >
          !
        </span>
        {label} — 확인 필요
      </p>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}

/** 의료 정보 페이지 하단 고지. 시술·증상 설명이 있는 모든 페이지에 붙인다. 빼지 말 것. */
export function MedicalNotice({ extra }: { extra?: string }) {
  return (
    <aside className="mt-12 rounded-2xl bg-brand-50 p-6 text-[13px] leading-relaxed text-ink-soft">
      <p className="font-bold text-brand-700">안내</p>
      <p className="mt-2">{MEDICAL_DISCLAIMER}</p>
      {extra && <p className="mt-2">{extra}</p>}
    </aside>
  );
}

/** 페이지 하단 전환 블록. */
export function ContactCta({
  title = '증상이 애매할 때가 확인하기 가장 좋은 시점입니다',
  desc = '아직 아프지 않은 단계에서 확인하면 선택지가 많습니다. 전화로 상태를 먼저 말씀해 주세요.',
}: {
  title?: string;
  desc?: string;
}) {
  return (
    <Container className="mt-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-8 py-14 text-white shadow-[var(--shadow-lift)] sm:px-14">
        {/* 겹친 원 — 히어로와 같은 모티프로 페이지 양끝을 묶는다. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-24 h-[380px] w-[380px] rounded-full border border-white/15" />
          <div className="absolute -right-4 top-[-10%] h-[220px] w-[220px] rounded-full bg-white/5" />
          <div className="absolute -bottom-32 left-[-6%] h-[300px] w-[300px] rounded-full bg-gold-400/10 blur-2xl" />
        </div>
        <div className="relative max-w-xl">
          <h2 className="display-sm text-[26px] sm:text-[33px]">{title}</h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-brand-100/90">{desc}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={CLINIC.phoneHref}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-[17px] font-black text-brand-700 shadow-lg transition-transform hover:-translate-y-1"
            >
              {CLINIC.phone}
            </a>
            <Link
              href="/visit"
              className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-white/45 px-8 py-4 text-[16.5px] font-bold text-white transition-all hover:-translate-y-1 hover:bg-white/10"
            >
              오시는 길
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

/** 카드 링크 — 목록 화면에서 반복 사용. */
export function CardLink({
  href,
  title,
  desc,
  tag,
}: {
  href: string;
  title: string;
  desc: string;
  tag?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-brand-200/70 bg-white p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1.5 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
    >
      {/* 호버 시 번지는 원 — 카드에 깊이를 준다. 장식이므로 스크린리더에서 숨긴다. */}
      <div
        aria-hidden
        className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-brand-50 transition-transform duration-500 group-hover:scale-[1.8]"
      />
      {tag && (
        <span className="relative mb-3.5 inline-flex w-fit rounded-lg bg-brand-100 px-3.5 py-1.5 text-[11.5px] font-black text-brand-700">
          {tag}
        </span>
      )}
      <h3 className="display-sm relative text-[18px] text-ink group-hover:text-brand-700">{title}</h3>
      <p className="relative mt-3 flex-1 text-[14.5px] leading-[1.8] text-ink-soft">{desc}</p>
      <span className="relative mt-5 inline-flex items-center gap-2 text-[13.5px] font-black text-brand-700">
        자세히 보기
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[11px] transition-all group-hover:bg-brand-500 group-hover:text-white"
        >
          →
        </span>
      </span>
    </Link>
  );
}
