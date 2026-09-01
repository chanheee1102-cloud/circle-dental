import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMG } from '@/lib/assets';
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
  return <div className="reveal prose-body max-w-[68ch] text-[17.5px] leading-[1.85] text-ink-soft">{children}</div>;
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
/**
 * 문자열에서 강조 표시를 떼어 낸다.
 * ⚠️ 메타 설명·JSON-LD 에 넣기 전에 **반드시** 통과시킬 것 — 안 그러면 검색 결과에
 *    별표가 그대로 나간다.
 */
export function plain(text: string) {
  return text.split('**').join('');
}

/**
 * `**핵심 구절**` 을 강조색으로 바꾼다.
 * ★ 문장을 JSX 로 다시 쓰지 않는 이유 — 그러면 화면용과 메타용으로 **같은 문장이
 *   두 벌**이 되고, 두 벌은 반드시 어긋난다. 문자열 하나에 표시만 남긴다.
 * ⚠️ 한 문단에 두 곳 넘게 강조하지 말 것. 다 강조하면 아무것도 강조가 아니다.
 * ⚠️ 밝은 면에서는 clay-600, 어두운 면에서는 ember 다 — 금색은 밝은 면에서 2.08:1 이라
 *    글자로 못 읽는다(실측). tone 을 반드시 맞춰 줄 것.
 */
function Marked({ text, tone }: { text: string; tone: 'light' | 'dark' }) {
  const bits = text.split('**');
  /*
   * ⚠️ 짝이 안 맞으면(표시 개수가 홀수) 강조를 **포기한다**.
   *   문장 단위로 쪼갠 뒤 강조를 입히는 구조라, 마침표가 표시 안에 있으면 닫는 표시가
   *   다음 문장으로 넘어가 그 문장이 통째로 물든다. 조용히 번지는 대신 조용히 넘긴다 —
   *   글이 잘못 강조되는 것보다 강조가 없는 편이 낫다.
   */
  if (bits.length % 2 === 0) return <>{plain(text)}</>;
  return (
    <>
      {bits.map((b, i) =>
        i % 2 === 1 ? (
          <strong
            key={`${i}-${b.slice(0, 6)}`}
            className={`font-semibold ${tone === 'dark' ? 'text-ember' : 'text-clay-600'}`}
          >
            {b}
          </strong>
        ) : (
          <span key={`${i}-${b.slice(0, 6)}`}>{b}</span>
        ),
      )}
    </>
  );
}
/**
 * 쉼표 뒤에서 줄이 바뀌게 한다 — **이보다 짧은 마디만** 통째로 움직인다(글자 수).
 *
 * ⚠️ 값을 크게 올리지 말 것. 마디가 길수록 줄 끝에 남는 빈자리도 그만큼 커진다.
 *    실측(9개 페이지): 16 → 문장부호 뒤 18%, 26 → 25%, 34 → 31%.
 *    그런데 줄 끝에 남는 빈자리(상위 10%)는 104px → 141px → 229px 로 뛴다.
 *    34 는 한 줄에 일곱 자쯤이 통째로 비어 눈에 띈다. 26 이 얻는 것과 잃는 것의 경계다.
 * ⚠️ 0 으로 두면 쉼표 규칙이 통째로 꺼진다(줄바꿈이 아무 데서나 일어나던 상태로 돌아간다).
 */
const CLAUSE_MAX = 26;

/**
 * 한 문장 안에서 **쉼표 뒤**를 줄바꿈 자리로 밀어 준다.
 *
 * ★★ 왜 (2026-09-01 운영자) ★★
 *   "최대한 마침표 뒤나 쉼표 뒤에서" — 마침표는 Sentences 가 문장마다 줄을 나눠 해결하지만,
 *   한 문장이 두 줄을 넘으면 그 안에서는 여전히 아무 데서나 끊겼다("…를 먼저 보고, 심을 /
 *   수 있는지부터"). 쉼표는 문장 안에서 숨을 쉬는 자리라 거기서 끊는 편이 읽기 쉽다.
 *
 * ★★ 어떻게 ★★
 *   짧은 마디를 inline-block 으로 만든다. 그러면 그 마디는 **쪼개지지 않고**, 남은 자리에
 *   안 들어가면 통째로 다음 줄로 내려간다 → 앞 줄이 쉼표에서 끝난다.
 *
 * ⚠️⚠️ 띄어쓰기를 &nbsp; 로 묶는 방법을 쓰지 말 것 ⚠️⚠️
 *   같은 효과를 내지만, 마디가 칸보다 넓으면 **가로로 넘쳐** 페이지에 가로 스크롤이 생긴다.
 *   inline-block 은 그럴 때 마디 안에서 알아서 줄을 바꾼다 — 넘치지 않는다.
 *
 * ⚠️ 강조 표시(**)가 든 문장은 건드리지 않는다. 쉼표가 강조 안에 있으면 여는 표시와 닫는
 *    표시가 서로 다른 마디로 갈라져, Marked 의 짝 검사에 걸려 강조가 통째로 사라진다.
 */
function Clauses({ text, tone }: { text: string; tone: 'light' | 'dark' }) {
  if (text.includes('**')) return <Marked text={text} tone={tone} />;
  const parts = text.split(/(?<=,)\s+/);
  if (parts.length < 2) return <Marked text={text} tone={tone} />;
  return (
    <>
      {parts.map((c, i) => (
        <Fragment key={`${i}-${c.slice(0, 8)}`}>
          {c.length <= CLAUSE_MAX ? <span className="clause">{c}</span> : c}
          {/* 나눌 때 없어진 띄어쓰기를 되돌린다 — 없으면 마디끼리 붙어 버린다. */}
          {i < parts.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}

export function Sentences({ text, tone = 'light' }: { text: string; tone?: 'light' | 'dark' }) {
  const parts = text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean);
  if (!parts || parts.length < 2) return <Clauses text={text} tone={tone} />;
  return (
    <>
      {parts.map((s, i) => (
        <span key={`${i}-${s.slice(0, 8)}`} className="block">
          <Clauses text={s} tone={tone} />
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
      {eyebrow && <p className="eyebrow-chip text-brand-500">{eyebrow}</p>}
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
        <p className="mt-5 text-[17px] leading-[1.85] text-ink-soft">
          <Sentences text={desc} />
        </p>
      )}
    </div>
  );
}

/**
 * 하위 페이지의 첫 화면 — **홈 히어로와 같은 문법**이다.
 *
 * ★★ 왜 부품 하나로 모았나 (2026-08-28 오너: "모든 페이지가 텍스트 형식이라 바꿀 거야") ★★
 *   31개 페이지가 각자 Breadcrumb + SectionHead 를 늘어놓고 있었다. 페이지마다 손으로
 *   머리를 그리면 반드시 몇 장이 빠지고, 그때부터 '고쳤는데 안 고쳐진' 화면이 생긴다.
 *   여기 한 곳만 고치면 전 페이지가 같이 움직인다.
 *
 * ★ 구조 — ① 어두운 면(또는 사진) ② 두 겹 스크림 ③ 가운데로 모은 제목 한 덩어리
 * ⚠️ 스크림을 한 겹으로 줄이지 말 것 — 사진이 밝은 쪽으로 치우치면 글자가 바로 묻힌다.
 *    방사형(가운데를 살림) + 선형(아래를 눌러 줌) 두 겹이라야 어느 사진이든 견딘다.
 * ⚠️ 높이를 한 화면(100dvh)으로 키우지 말 것 — 하위 페이지에서는 본문이 접힌 아래로
 *    밀려난다. 검색·답변 엔진이 먼저 읽는 것이 본문이라 그대로 손해다.
 * ⚠️ 헤더는 sticky 라 자리를 차지한다. 띠가 헤더 뒤까지 올라가려면 음수 margin 으로
 *    끌어올리고 **같은 값만큼 padding 으로 돌려줘야** 한다(홈 히어로와 같은 수치).
 * ⚠️ h1 은 페이지에 하나다. 이 부품이 h1 을 내므로, 쓰는 페이지에서 SectionHead as="h1"
 *    을 함께 두지 말 것.
 */
/**
 * 히어로 띠에 쓰는 병원 사진 이름표.
 * ⚠️ 어두운 스크림을 두 겹 덮으므로 **밝고 형태가 단순한 사진**이 맞다.
 *    어두운 사진은 덮고 나면 그냥 검은 면이 되어 사진을 쓴 값이 없다.
 */
const HERO_PHOTOS = {
  corridor: IMG.interior[2], // 진료실로 이어지는 복도 — 시선이 가운데로 모인다
  booth: IMG.interior[0], // 유리 파티션 상담 부스
  consult: IMG.interior[3], // 엑스레이 화면을 놓고 설명하는 장면
  room: IMG.interior[8], // 창가 진료실
  sterile: IMG.interior[5], // 멸균 기구를 꺼내는 장면
} as const;

export function PageHero({
  trail,
  eyebrow,
  title,
  desc,
  photo,
  children,
}: {
  trail: Array<{ name: string; path: string }>;
  eyebrow: string;
  /**
   * ⚠️ 되도록 문자열로 줄 것 — 문자열일 때만 앵커 id 가 자동으로 붙는다.
   *    id 가 있어야 답변 엔진이 문서 전체가 아니라 이 제목을 지목해 인용한다.
   *    JSX 로 주면(줄바꿈 등) id 가 빠진다. SectionHead 와 같은 규칙이다.
   */
  title: React.ReactNode;
  desc?: string;
  /**
   * 띠에 깔 병원 사진. 없으면 어두운 돌 면 그대로다.
   * ★ 페이지가 파일 경로를 알 필요가 없게 **이름표로 고른다** — 사진을 바꾸면
   *   여기 한 곳만 고치면 되고, 페이지마다 IMG import 가 늘지 않는다.
   * ⚠️ 장식이라 alt 는 빈 문자열이다(aria-hidden). 사진이 지는 뜻이 없다 —
   *    뜻은 바로 위 제목이 전부 진다.
   */
  photo?: keyof typeof HERO_PHOTOS;
  /** 제목 아래 덧붙일 것(발행일·칩 등). */
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate -mt-[68px] overflow-hidden bg-wine-deep pt-[68px] text-parchment sm:-mt-[94px] sm:pt-[94px]">
      {photo ? (
        <Image
          src={HERO_PHOTOS[photo].src}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      {/*
        두 겹 스크림. ⚠️ 한 겹으로 줄이지 말 것 — 위 주석 참고.
        ⚠️⚠️ 이 값을 옅게 되돌리지 말 것 (2026-08-28 실측) ⚠️⚠️
          처음에 옅게(0.35/0.2) 뒀더니 사진 밝은 부분에서 금색 눈금 글자가
          **2.26:1** 까지 떨어졌다(기준 4.5). 큰 흰 제목은 통과하는데 작은 글자가
          먼저 무너진다 — 사진 위 글자는 늘 작은 글자가 먼저 깨진다.
          지금 값은 가운데가 약 76% 덮여 사진이 질감으로만 남는 선이다.
        사진이 없을 때도 그대로 둔다: 어두운 면에 깊이를 준다.
      */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(78%_62%_at_50%_38%,rgba(36,34,30,0.68)_0%,rgba(36,34,30,0.86)_62%,rgba(36,34,30,0.95)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(36,34,30,0.62)_0%,rgba(36,34,30,0.52)_38%,rgba(36,34,30,0.82)_100%)]"
      />

      <Container className="relative flex min-h-[42vh] flex-col justify-between py-10 lg:min-h-[48vh] lg:py-12">
        <Breadcrumb trail={trail} tone="dark" />

        {/* ⚠️ 가운데 정렬은 홈 히어로와 맞춘 것이다. 왼쪽 정렬로 되돌리면 하위 페이지만 결이 갈린다. */}
        <div className="mx-auto max-w-3xl py-10 text-center lg:py-14">
          <p className="eyebrow-chip text-clay-300">{eyebrow}</p>
          <h1
            id={typeof title === 'string' ? headingId(title) : undefined}
            className="display-sm mt-4 scroll-mt-28 text-[30px] text-parchment sm:text-[40px] lg:text-[46px]"
          >
            {title}
          </h1>
          {desc ? (
            <p className="mx-auto mt-6 max-w-[46em] text-[17px] leading-[1.9] text-parchment/85 sm:text-[18px]">
              <Sentences text={desc} />
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>

        {/* 아래쪽 균형을 잡는 빈 칸 — 제목 덩어리가 띠 한가운데 오게 한다. */}
        <div aria-hidden className="h-0" />
      </Container>
    </section>
  );
}

/**
 * 빵부스러기.
 * ★ 시각적 장식이 아니라 크롤러에게 계층을 알려주는 신호다. 깊은 페이지일수록 중요하다.
 */
export function Breadcrumb({
  trail,
  tone = 'light',
}: {
  trail: Array<{ name: string; path: string }>;
  /** 어두운 히어로 띠 위에 놓일 때 — 글자를 밝은 쪽으로 뒤집는다. */
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    /*
     * ⚠️ ink-muted(#756e67)는 크림 바탕에서 3.97:1 이라 본문 기준(4.5:1)에 못 미친다(실측).
     *    13px 짜리 작은 글자라 더 그렇다. ink-soft(#625b55)로 내리면 5.9:1 이다.
     */
    <nav
      aria-label="현재 위치"
      className={`flex flex-wrap items-center gap-1.5 text-[14px] ${
        dark ? 'text-parchment/75' : 'text-ink-soft'
      }`}
    >
      {trail.map((t, i) => (
        <span key={t.path} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden>›</span>}
          {i === trail.length - 1 ? (
            <span
              className={`font-semibold ${dark ? 'text-parchment' : 'text-ink-soft'}`}
              aria-current="page"
            >
              {t.name}
            </span>
          ) : (
            <Link
              href={t.path}
              className={`transition-colors ${dark ? 'hover:text-parchment' : 'hover:text-brand-700'}`}
            >
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
    <div className="reveal-stack mx-auto grid max-w-4xl gap-4">
      {items.map((it) => (
        <article
          key={it.q}
          className="card-glass rounded-[18px] border border-mist p-7 sm:p-8"
        >
          <h2
            id={headingId(it.q)}
            className="scroll-mt-28 text-[19px] font-black leading-snug tracking-[-0.01em] text-ink sm:text-[21px]"
          >
            {it.q}
          </h2>
          <p className="mt-3.5 max-w-[70ch] text-[17px] leading-[1.85] text-ink-soft"><Sentences text={it.a} /></p>
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
      <p className="flex items-center gap-2 text-[14px] font-black text-gold-600">
        <span
          aria-hidden
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[13.5px] text-white"
        >
          !
        </span>
        {label} — 확인 필요
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
        <Sentences text={note} />
      </p>
    </div>
  );
}

/** 의료 정보 페이지 하단 고지. 시술·증상 설명이 있는 모든 페이지에 붙인다. 빼지 말 것. */
/** @param tone 어두운 배경에 놓을 때는 'dark'. 면과 글자가 한 벌로 바뀐다. */
/**
 * ⚠️⚠️ **화면에서 걷어냈다 — 되살리려면 운영자 GO 가 필요하다** (2026-08-31) ⚠️⚠️
 *   운영자: "페이지마다 이런내용 꼭 넣어야돼? 없애고싶어."
 *
 *   ★ 법적으로 필요한 것이 아니었다. 의료광고 심의가 부작용 고지를 요구하는 것은
 *     **치료 전후 사진·환자 경험담**을 쓸 때이고, 이 사이트는 그런 것을 쓰지 않는다.
 *   ★ 부르는 곳은 그대로 두고 여기서 null 을 돌려준다 — 되살릴 때 이 파일 한 곳만 고치면 된다.
 *   ⚠️ '설명용 이미지' 고지는 **성격이 다르다.** 그건 우리가 실제로 AI 로 만든 그림을
 *      쓰기 때문에 붙는 것이라 그림을 쓰는 동안은 남는다(components/TreatmentLanding.tsx).
 */
export function MedicalNotice(_: { extra?: string; tone?: 'light' | 'dark' }) {
  return null;
}

function MedicalNoticeHidden({ extra, tone = 'light' }: { extra?: string; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <aside
      className={`reveal mt-12 rounded-2xl p-6 text-[14px] leading-relaxed ${
        dark ? 'card-glass/[0.04] text-white/70' : 'bg-brand-50 text-ink-soft'
      }`}
    >
      <p className={`font-bold ${dark ? 'text-white' : 'text-brand-700'}`}>안내</p>
      {/*
        ⚠️ max-w 를 지우지 말 것 — 없으면 넓은 화면에서 한 줄이 86자까지 늘어난다(실측).
           한글에서 편한 한 줄은 35~45자다. em 으로 잡는 이유는 1em ≈ 한글 한 글자이기 때문이다.
      */}
      <p className="mt-2 max-w-[44em]">
        <Sentences text={MEDICAL_DISCLAIMER} />
      </p>
      {extra && <p className="mt-2 max-w-[44em]">{extra}</p>}
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
          <p className="mt-5 text-[17px] leading-[1.85] text-brand-100/90">
            <Sentences text={desc} tone="dark" />
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={CLINIC.phoneHref}
              className="inline-flex items-center gap-2 rounded-full bg-parchment px-8 py-4 text-[18px] font-black text-brand-700 shadow-lg transition-transform hover:-translate-y-1"
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
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/45 px-8 py-4 text-[17.5px] font-bold text-white transition-all hover:-translate-y-1 hover:bg-white/10"
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
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-brand-200/70 card-glass p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1.5 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
    >
      {/* 호버 시 번지는 원 — 카드에 깊이를 준다. 장식이므로 스크린리더에서 숨긴다. */}
      <div
        aria-hidden
        className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-brand-50 transition-transform duration-500 group-hover:scale-[1.8]"
      />
      {tag && (
        <span className="relative mb-3.5 inline-flex w-fit rounded-full bg-brand-100 px-3.5 py-1.5 text-[13.5px] font-black text-brand-700">
          {tag}
        </span>
      )}
      <Heading className="display-sm relative text-[18px] text-ink group-hover:text-brand-700">
        {title}
      </Heading>
      <p className="relative mt-3 flex-1 text-[15.5px] leading-[1.8] text-ink-soft">
        <Sentences text={desc} />
      </p>
      <span className="relative mt-5 inline-flex items-center gap-2 text-[14.5px] font-black text-brand-700">
        자세히 보기
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[13.5px] transition-all group-hover:bg-brand-500 group-hover:text-white"
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
