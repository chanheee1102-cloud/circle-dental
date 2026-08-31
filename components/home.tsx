import Link from 'next/link';
import type { ReactNode } from 'react';

/*
 * ★★ 홈 전용 조각들 — GIC(General Intelligence Company) 문법 (2026-08-27) ★★
 *
 *   오너 지적: 홈이 "이고운치과 + 예전 동그라미" 를 못 벗어난다.
 *   두 참고 사이트의 공통점은 **크게 굵게 말하는 것**이다 — 900 굵기, 자간 -0.042em,
 *   영문 대문자 눈썹, 알약 버튼, 사진 위 흰 글씨. GIC 는 정반대다.
 *
 *   이 파일이 지키는 규칙 (globals.css 의 홈 전용 토큰 주석과 한 쌍)
 *     · 제목은 **세리프 400** — 굵기로 강조하지 않는다.
 *     · 채워진 버튼은 dusk 하나뿐. signal(파랑)은 **테두리로만** 쓴다.
 *     · 카드는 흰 면 + mist 1px 실선. 그림자는 거의 안 쓴다.
 *     · 모서리 — 버튼 8px, 카드 14px, 큰 면 24px.
 *     · 영문 대문자 눈썹을 쓰지 않는다. 한글에는 대문자가 없어서 그 문법 자체가
 *       **한국어 화면에서는 남의 것**이다. 짧은 한글 라벨 + 파란 짧은 선으로 대신한다.
 *
 * ⚠️ 여기 있는 것들을 다른 페이지에 쓰지 말 것 — 사이트가 두 벌로 갈린다.
 */

/**
 * 구획 머리말.
 *
 * ⚠️ title 에 넣는 한글은 **잘라낸 글꼴(scripts/subset-gowun.py)에 있어야 한다.**
 *    없는 글자는 그 글자만 Pretendard 로 떨어져 한 줄에 글꼴이 두 벌 보인다.
 *    문구를 바꾸면 그 스크립트의 TEXT 도 함께 고치고 다시 돌릴 것.
 */
export function HomeHead({
  label,
  title,
  desc,
  tone = 'light',
  /*
   * 스크롤 등장을 끌 수 있다 (2026-08-28 오너).
   * ⚠️ 한 구획 안에서 어떤 것은 등장하고 어떤 것은 처음부터 서 있으면,
   *    늦게 나오는 쪽이 '나중 것' 으로 읽힌다. 구획 단위로 맞출 것 —
   *    카드에서 등장을 뺐으면 머리말에서도 빼야 한다.
   */
  reveal = true,
  className = '',
}: {
  label: string;
  title: ReactNode;
  desc?: ReactNode;
  tone?: 'light' | 'dark';
  reveal?: boolean;
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div className={`${reveal ? 'reveal' : ''} ${className}`}>
      {/*
        ⚠️ '짧은 선 + 라벨' 로 되돌리지 말 것 (2026-08-31 오너: "이고운이랑 똑같아서").
           그 형태는 흔한 관용구라 레퍼런스와 구별되지 않았다. 이 사이트의 재질(유리 알약)로
           바꾼 것이며, 재질은 globals.css 의 .eyebrow-chip 한 곳에 있다.
        ⚠️ 알약 안에 가로선을 다시 넣지 말 것.
      */}
      <p className={`eyebrow-chip ${dark ? 'text-mist/80' : 'text-ash'}`}>{label}</p>
      <h2
        className={`display-ko mt-5 text-[clamp(30px,4.6vw,46px)] ${
          dark ? 'text-parchment' : 'text-charcoal'
        }`}
      >
        {title}
      </h2>
      {desc ? (
        <p
          className={`mt-6 max-w-[44em] text-[18px] leading-[1.9] ${
            dark ? 'text-mist/80' : 'text-ash'
          }`}
        >
          {desc}
        </p>
      ) : null}
    </div>
  );
}

/**
 * 채워진 버튼 — 이 시스템에서 **유일하게 면을 채우는 것**이다.
 * ★ 밝은 면에서는 dusk 로 채우고, 어두운 면에서는 parchment 로 채운다.
 * ⚠️ signal(파랑)으로 채우지 말 것 — 그 순간 흔한 SaaS 버튼이 된다.
 * ⚠️ 알약(rounded-full)으로 만들지 말 것. 8px 각진 모서리가 이 시스템의 표식이다.
 */
export function FillBtn({
  href,
  children,
  external,
  tone = 'light',
  label,
  className = '',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  tone?: 'light' | 'dark';
  label?: string;
  className?: string;
}) {
  const dark = tone === 'dark';
  // ⚠️ 8px 각진 모서리에서 알약으로 되돌렸다 (2026-08-27 오너: "버튼 좀 둥그렇게").
  const cls = `group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[17px] font-semibold transition-colors ${
    dark
      ? 'bg-wine-bg text-dusk hover:bg-mist'
      : 'bg-dusk text-parchment hover:bg-twilight'
  } ${className}`;
  const inner = (
    <>
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} aria-label={label} className={cls}>
      {inner}
    </Link>
  );
}

/**
 * 테두리 버튼.
 *
 * ⚠️ 테두리를 signal(파랑)로 쓰다가 **뺐다** (2026-08-27 오너: "전화번호 버튼 파란 테두리
 *    별로야. 좀더 진하게"). 파랑이 옅어서 버튼이 흐릿해 보였다.
 *    지금은 글자와 같은 색 계열의 진한 테두리다 — 채운 버튼과 무게만 다르고 색은 한 벌이다.
 * ⚠️ 파란 테두리로 되돌리지 말 것. signal 은 이제 구획 머리말의 짧은 선에만 남는다.
 * ⚠️ 글자는 charcoal/parchment 다. 파란 글자를 쓰지 말 것(밝은 면에서 2.90:1).
 */
export function LineBtn({
  href,
  children,
  external,
  tone = 'light',
  className = '',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  /*
   * ★★ 밝은 바탕의 보조 버튼은 **헤더 알약과 같은 재질**이다 (2026-08-28 오너) ★★
   *   전에는 테두리만 있는 빈 알약이었는데, 진료 카드처럼 무거운 판 옆에 서니
   *   눌러지는 것으로 안 읽혔다. 화면에 이미 '떠 있는 밝은 판'(헤더)이 있으니
   *   버튼도 같은 재질로 두면 재질이 두 벌로 갈리지 않는다. 재질은 .btn-pane 하나에 있다.
   * ⚠️ 어두운 바탕(tone='dark')에서는 그대로 테두리 알약이다 —
   *    어두운 면 위의 밝은 판은 카드와 싸운다.
   * ⚠️ .btn-pane 은 테두리 색까지 스스로 정한다. 여기서 border 색을 또 주지 말 것.
   */
  const cls = `group inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] px-8 py-4 text-[17px] font-semibold transition-colors ${
    dark
      ? 'border-parchment/80 text-parchment hover:bg-white/10'
      : 'btn-pane text-charcoal'
  } ${className}`;
  /*
   * ⚠️ tel: / mailto: 는 **새 창으로 열면 안 된다.** 빈 탭이 하나 뜨고 통화 앱이 뜨거나,
   *    데스크톱에서는 아무 일도 안 일어난 것처럼 보인다. 같은 창에서 그대로 던진다.
   * ⚠️ 화살표(→)도 뺀다 — '다음 화면으로 간다' 는 뜻인데 전화는 그런 동작이 아니다.
   */
  const isDirect = href.startsWith('tel:') || href.startsWith('mailto:');
  const inner = (
    <>
      {children}
      {!isDirect && (
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      )}
    </>
  );
  if (isDirect) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** 밑줄 없는 조용한 글자 링크 — 구획 끝에서 다음 페이지로 넘기는 자리. */
export function QuietLink({
  href,
  children,
  tone = 'light',
  className = '',
}: {
  href: string;
  children: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <Link
      href={href}
      className={`group inline-flex w-fit items-center gap-2 border-b pb-1 text-[16.5px] font-medium transition-colors ${
        dark
          ? 'border-wine-line/30 text-parchment hover:border-wine-line'
          : 'border-wine-line text-charcoal hover:border-signal'
      } ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
