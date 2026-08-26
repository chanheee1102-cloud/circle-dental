import Link from 'next/link';
import { CLINIC, MEDICAL_DISCLAIMER } from '@/lib/clinic';
import { headingId } from '@/components/article';

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
  return <div className="reveal prose-body max-w-[68ch] text-[16.5px] leading-[1.85] text-ink-soft">{children}</div>;
}

/**
 * 문장 단위로 줄을 나눈다.
 *
 * ★★ 왜 필요한가 (2026-08-14 운영자) ★★
 *   `word-break: keep-all` 만으로는 **낱말 중간**에서만 안 끊길 뿐, 줄이 어디서 끝날지는
 *   여전히 상자 폭이 정한다. 그래서 이런 일이 생겼다.
 *
 *     … 사랑니 발치까지 진료합니다. 충치·
 *     신경·잇몸 치료와 스케일링 …
 *
 *   앞 문장이 끝났는데 뒷문장의 첫 낱말이 같은 줄에 매달리고, 그 낱말이 또 가운데서
 *   잘렸다. 읽는 사람은 문장이 어디서 끝났는지 눈으로 못 찾는다.
 *
 * ★★ 어떻게 고치나 ★★
 *   문장을 각각 `block` 으로 만든다. 그러면 **마침표에서 반드시 줄이 바뀌고**,
 *   한 문장이 한 줄에 안 들어가면 그 안에서만 어절 단위로 접힌다.
 *   운영자가 말한 "마침표 기준으로, 안 되면 말 쉬는 타이밍에" 가 정확히 이 동작이다.
 *
 * ★ `<br>` 를 손으로 넣지 않는 이유
 *   화면 폭마다 알맞은 자리가 달라진다. 데스크톱에서 예쁜 `<br>` 는 모바일에서
 *   외톨이 줄을 만든다. 문장 단위 block 은 폭과 무관하게 항상 맞다.
 *
 * ⚠️ 마침표 뒤에 공백이 오거나 문장이 끝날 때만 자른다 — `0.5초`, `Dr.` 처럼
 *    마침표가 숫자·약어 안에 있는 경우를 자르면 문장이 깨진다.
 * ⚠️ 문장이 하나뿐이면 아무것도 하지 않는다(불필요한 span 을 만들지 않는다).
 */
export function Sentences({ text }: { text: string }) {
  const parts = text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean);
  if (!parts || parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts.map((s, i) => (
        <span key={`${i}-${s.slice(0, 8)}`} className="block">
          {s}
        </span>
      ))}
    </>
  );
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
    <div className="reveal max-w-2xl">
      {/*
        ★★ 점 + 900 굵기 → 점 없이 600 · 넓은 자간 (2026-08-25 운영자: "저 의료진 소개
           대신 DOCTOR 저 폰트로 하자 너무 클로드 티나서") ★★
           앞에 작은 점을 찍는 라벨은 요즘 자동 생성 화면의 서명이라 그것만으로
           '만들어 준 티'가 난다. globals.css 의 .t-eyebrow 한 곳에서 정의한다.
        ⚠️ 이 컴포넌트는 하위 페이지도 전부 쓴다 — 여기를 고치면 사이트 전체의
           눈금줄이 같이 바뀐다. 그게 의도다(한 페이지 안에서 두 스타일이 섞이면
           고친 게 아니라 빠뜨린 것처럼 보인다).
        ⚠️ 라벨 글자를 영문으로 바꾸는 것은 **호출하는 쪽**이 정한다. 지금은 홈만
           영문이고 하위 페이지는 한글 그대로다 — 뜻은 바로 아래 제목이 지므로
           어느 쪽이든 읽는 사람이 잃는 정보는 없다.
      */}
      {eyebrow && <p className="t-eyebrow text-brand-500">{eyebrow}</p>}
      {/*
        페이지 제목은 한 단계 크게 — 문서의 머리라는 것이 눈으로도 보여야 한다.
        ★★ 제목이 문자열이면 앵커 id 를 자동으로 붙인다 (2026-08-14) ★★
          id 가 있어야 목차가 걸리고, 답변 엔진이 문서 전체가 아니라 그 구간을 지목해
          인용할 수 있다. 손으로 붙이면 반드시 빠뜨리는 페이지가 생기므로 여기서 만든다.
          (title 이 JSX 인 경우는 문자열을 뽑을 수 없어 건너뛴다.)
      */}
      <H
        id={typeof title === 'string' ? headingId(title) : undefined}
        className={
          as === 'h1'
            ? 'display-sm mt-4 scroll-mt-28 text-[32px] text-ink sm:text-[42px]'
            : 'display-sm mt-4 scroll-mt-28 text-[28px] text-ink sm:text-[36px]'
        }
      >
        {/*
          ★★ 어절마다 가면을 씌워 아래에서 밀어 올린다 (2026-08-25 운영자:
             "모션이나 임팩트 애니메이션 최대로") ★★
             이 컴포넌트를 17개 페이지가 쓰므로 여기 한 곳이면 사이트 전체 제목이
             같이 살아난다. 실측에서 27개 중 22개 페이지에 움직이는 것이 하나도 없었다.

          ⚠️⚠️ 어절 사이 공백은 가면 **바깥**에 둔다 ⚠️⚠️
             .word-mask 는 inline-block 이라 안에 공백을 넣으면 그 공백을 먹는다.
             그러면 문서의 제목이 "누가진료하나요?" 처럼 붙어 버린다 — 화면은 멀쩡한데
             크롤러와 답변 엔진이 읽는 제목만 망가진다. (히어로 마퀴에서 실제로 겪은 일)
          ⚠️ 제목이 JSX 면 쪼개지 않는다. 문자열이 아니면 어절을 알 수 없다.
        */}
        {typeof title === 'string'
          ? title.split(' ').map((w, i, arr) => (
              <span key={`${i}-${w}`}>
                <span className="word-mask">
                  <span style={{ transitionDelay: `${i * 85}ms` }}>{w}</span>
                </span>
                {i < arr.length - 1 ? ' ' : ''}
              </span>
            ))
          : title}
      </H>
      {/*
        설명은 **문장 단위로** 줄을 나눈다 (2026-08-14 운영자: "전 페이지로 해").
        마침표에서 줄이 바뀌고, 한 문장이 한 줄에 안 들어가면 그 안에서만
        어절 단위로 접힌다(Sentences 주석 참고).
      */}
      {desc && (
        <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">
          <Sentences text={desc} />
        </p>
      )}
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
/**
 * 문답 블록.
 *
 * ★★ 헤딩마다 id 를 단다 (2026-08-14) ★★
 *   id 가 없으면 목차가 걸 곳이 없고, 답변 엔진도 문서 전체만 가리킬 수 있다.
 *   id 가 있으면 **그 질문 하나**를 URL 로 지목해 인용할 수 있다
 *   (예: /treatment/implant#임플란트는-몇-번-와야-하나요).
 *   id 는 헤딩 문자열에서 기계적으로 만든다 — 손으로 붙이면 목차와 어긋난다.
 * ★ `scroll-mt` 를 준다. 고정 헤더가 86px 이라 앵커로 뛰면 제목이 헤더 뒤로 숨는다.
 */
export function QABlock({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <div className="reveal-stack divide-y divide-brand-100">
      {items.map((it) => (
        <article key={it.q} className="py-7 first:pt-0 last:pb-0">
          <h2
            id={headingId(it.q)}
            className="scroll-mt-28 text-[19px] font-black leading-snug tracking-[-0.01em] text-ink sm:text-[21px]"
          >
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
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[12.5px] text-white"
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
    <aside className="reveal mt-12 rounded-2xl bg-brand-50 p-6 text-[13px] leading-relaxed text-ink-soft">
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
    <Container className="reveal mt-24">
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
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[17px] font-black text-brand-700 shadow-lg transition-transform hover:-translate-y-1"
            >
              {CLINIC.phone}
            </a>
            {/*
              ★ '오시는 길' 이 아니라 '예약하기' 다 (2026-08-14 운영자).
                여기까지 읽고 내려온 사람에게 필요한 다음 걸음은 위치가 아니라 **시간을 잡는 것**이다.
                위치는 이미 푸터와 상단 메뉴 양쪽에 있다.
              ★ 외부 도메인이라 새 창 + rel="noopener" — 없으면 열린 창이 window.opener 로
                이 페이지를 조작할 수 있다.
            */}
            <a
              href={CLINIC.booking.naver}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/45 px-8 py-4 text-[16.5px] font-bold text-white transition-all hover:-translate-y-1 hover:bg-white/10"
            >
              예약하기
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}

/**
 * 카드 링크 — 목록 화면에서 반복 사용.
 *
 * ★★ 제목 레벨을 밖에서 정할 수 있어야 한다 (2026-08-18 전수 검사에서 발견) ★★
 *   h3 로 못 박혀 있었는데, 카드 격자 위에 h2 가 없는 페이지(/insight)에서는
 *   **h1 → h3 으로 한 단계를 건너뛰게** 된다. 네이버 서치어드바이저가 헤딩 위계를
 *   진단 항목으로 보고, AI 에게도 문서 구조를 흐리는 요소다.
 *   ⚠️ 값을 정할 때 규칙은 하나다 — **바로 위 헤딩보다 정확히 한 단계 아래.**
 *     보기 좋으라고 고르는 값이 아니다(크기는 클래스가 정한다).
 */
export function CardLink({
  href,
  title,
  desc,
  tag,
  as: Heading = 'h3',
}: {
  href: string;
  title: string;
  desc: string;
  tag?: string;
  as?: 'h2' | 'h3' | 'h4';
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
        <span className="relative mb-3.5 inline-flex w-fit rounded-full bg-brand-100 px-3.5 py-1.5 text-[12.5px] font-black text-brand-700">
          {tag}
        </span>
      )}
      <Heading className="display-sm relative text-[18px] text-ink group-hover:text-brand-700">
        {title}
      </Heading>
      <p className="relative mt-3 flex-1 text-[14.5px] leading-[1.8] text-ink-soft">{desc}</p>
      <span className="relative mt-5 inline-flex items-center gap-2 text-[13.5px] font-black text-brand-700">
        자세히 보기
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[12.5px] transition-all group-hover:bg-brand-500 group-hover:text-white"
        >
          →
        </span>
      </span>
    </Link>
  );
}

/**
 * 한 글자씩 떠오르는 글.
 *
 * 2026-08-25 운영자: "문구 한글자씩 스크롤 이벤트로 나오게 해서 저 이미지 뜨게 하자"
 * 바깥에 .seq 를 두른 요소가 화면에 들어오면(RevealScript 가 is-shown 을 붙인다)
 * 글자들이 --d 만큼 어긋나며 차례로 올라온다.
 *
 * 주의: 글자 span 을 inline-block 으로 만들지 말 것.
 *   inline-block 은 innerText 에서 낱말 경계로 취급돼 문서의 텍스트가
 *   "L o n g - t e r m ..." 이 된다(두 번째 버전 마퀴에서 실제로 났던 문제다).
 *   그래서 기본 inline 을 유지하고, 올라오는 움직임은 position:relative + top 으로 만든다.
 *   inline 요소에도 relative 는 먹는다.
 * 주의: 공백은 span 으로 싸지 않고 그대로 둔다 — 낱말 경계를 지키고 span 수도 줄인다.
 * 주의: 화면 낭독기는 의미 없는 inline span 들을 이어 붙여 한 문장으로 읽는다.
 *   따로 aria 를 붙이면 오히려 같은 문장을 두 번 읽게 된다.
 */
export function SeqLetters({
  text,
  step = 14,
  start = 0,
  className = '',
}: {
  text: string;
  /** 글자 사이 간격(ms). */
  step?: number;
  /** 첫 글자가 뜨기까지의 지연(ms). */
  start?: number;
  className?: string;
}) {
  let n = -1;
  return (
    <span className={className}>
      {[...text].map((ch, i) => {
        if (ch === ' ') return ' ';
        n += 1;
        return (
          <span
            key={i}
            className="seq-letter"
            style={{ ['--d' as string]: `${start + n * step}ms` } as React.CSSProperties}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}
