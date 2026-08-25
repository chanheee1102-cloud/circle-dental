/**
 * 첫 화면 위쪽을 가로지르는 대형 영문 마퀴.
 *
 * ★★ 두 번째 버전(circle-dental-2)의 히어로에서 옮겨 왔다
 *    (2026-08-25 운영자: "히어로는 두번째버전 디자인이 좋은것 같아") ★★
 *    큰 세리프 글자가 화면 폭을 가로질러 아주 느리게 흐른다. 배경 영상 위에서
 *    이 한 줄이 '지금 살아 있는 화면'이라는 인상을 만든다.
 *
 * ★ 글꼴은 v2 가 쓰던 Playfair 를 새로 들여오지 않고 **이 사이트가 이미 가진
 *   Marcellus(.display-en)** 를 쓴다. 라틴 글자만 담긴 14.5KB 한 벌이고,
 *   globals.css 가 "라틴만 있는 짧은 자리에 쓰라"고 정해 둔 바로 그 용도다.
 *   글꼴을 하나 더 받으면 첫 화면 임계 경로가 그만큼 늘어난다.
 *   ⚠️ 그래서 이 컴포넌트에 **한글 문구를 넣지 말 것.** Marcellus 에는 한글이
 *      없어 글자마다 Pretendard 로 떨어지고, 한 줄 안에서 세리프와 산세리프가
 *      섞여 굵기·베이스라인이 어긋난다.
 *
 * ⚠️⚠️ 글자를 하나씩 쪼개지 않는다 — v2 에서 실제로 난 문제 ⚠️⚠️
 *    v2 는 글자마다 inline-block span 으로 쪼개 미세하게 숨 쉬는 효과를 줬다.
 *    그런데 **inline-block 은 innerText 에서 낱말 경계로 취급**돼, 문서의 텍스트가
 *    "S a v e   y o u r ..." 가 된다. 이 마퀴가 첫 화면 맨 위에 있어서 결국
 *    **페이지의 첫 문장이 알파벳 나열**이 돼 있었다(v2 라이브 실측).
 *    aria-label 은 화면 낭독기만 고친다 — 크롤러와 AI 가 읽는 본문 텍스트는
 *    그대로다. 그래서 여기서는 쪼개지 않고 통글자로 둔다. 잃는 것은 거의
 *    보이지도 않던 0.018em 짜리 숨쉬기 하나뿐이고, 얻는 것은 읽을 수 있는 본문이다.
 *
 * ⚠️ y·g 디센더 잘림 — line-height:1 상자는 폰트가 선언한 디센트만큼만 잡히는데
 *    실제 잉크가 그보다 깊다. 상자를 아래로만 20% 키워(paddingBottom) 잉크를
 *    담는다. overflow 는 양축 hidden 이어야 한다 — 한쪽만 visible 로 두면 CSS
 *    스펙상 auto 로 강제 계산돼 결국 똑같이 잘린다(v2 에서 한 번 헛짚은 자리).
 */

/**
 * 글자 크기 — 화면 폭을 따라간다. 두 번째 버전과 같은 값(56~268px, 13.9vw).
 *
 * ⚠️ 이 값은 임의가 아니다. 작은 폰에서 키우면 히어로가 한 화면을 넘겨
 *    **사실 띠가 첫 화면 밖으로 밀린다** — 띠가 첫 화면에 들어오는 것이 이 히어로
 *    구성의 전제다(app/page.tsx Hero 주석). 헤더가 투명해지며 히어로가 화면 전체를
 *    쓰게 돼 세로가 126px 늘어난 덕에 이 크기가 들어간다. 헤더를 다시 불투명하게
 *    되돌리면 이 값도 함께 줄여야 한다.
 */
const SIZE = 'clamp(56px, 13.9vw, 268px)';

/**
 * 트랙 하나에 넣을 반복 수.
 * ⚠️ 2 인 이유 — 트랙이 화면 폭보다 넓기만 하면 이음매가 안 보인다. 필요 이상으로
 *    늘리면 같은 문구가 문서에 그만큼 여러 번 적히고(본문 텍스트가 지저분해진다)
 *    그릴 글자 수만 늘어난다. 가장 넓은 화면에서도 2 벌이면 넘친다.
 */
const REPEAT = 2;

export function HeroMarquee({
  text,
  seconds = 30,
  className = '',
  size = SIZE,
  colorClass = 'text-mint-400',
}: {
  text: string;
  seconds?: number;
  className?: string;
  /**
   * 글자 크기(CSS 값). 기본은 첫 화면용 대형.
   * ⚠️ 크기를 바꾸면 디센더 여백도 같이 따라간다 — 아래 paddingBottom 이 이 값을 쓴다.
   *    둘을 따로 계산하면 y·g 아랫부분이 잘린다.
   */
  size?: string;
  /**
   * 글자색. 배경 워터마크로 쓸 때는 아주 옅은 색을 넘긴다.
   * ⚠️ 배경으로 쓸 때 진한 색을 주면 그 위에 얹히는 내용이 안 읽힌다 — 그건 배경이
   *    아니라 두 번째 내용이 된다.
   */
  colorClass?: string;
}) {
  /* 트랙 두 벌이 -50% 로 밀려 이음매 없이 순환한다. */
  const track = (key: string) => (
    <span
      key={key}
      className="marquee-track inline-flex will-change-transform"
      style={{ animationDuration: `${seconds}s` }}
    >
      {Array.from({ length: REPEAT }, (_, i) => (
        <span
          key={`${key}-${i}`}
          className={`display-en flex-none pr-[0.24em] ${colorClass}`}
          style={{ fontSize: size, lineHeight: '1' }}
        >
          {text}
        </span>
      ))}
    </span>
  );

  return (
    <div
      role="img"
      aria-label={text}
      className={`pointer-events-none relative flex select-none overflow-hidden whitespace-nowrap ${className}`}
      style={{ paddingBottom: `calc(${size} * 0.2)` }}
    >
      {/* 시각적 복제라 접근성 트리에서는 통째로 뺀다 — 바깥 aria-label 이 대신 읽힌다. */}
      <span aria-hidden className="inline-flex">
        {track('a')}
        {track('b')}
      </span>
    </div>
  );
}
