/**
 * 화면에 들어올 때 한 번 떠오르는 래퍼.
 *
 * ★★ 왜 이것 하나만 두는가 ★★
 *   움직임이 많을수록 고급스러워지지 않는다. 오히려 요소마다 다른 효과가 붙으면
 *   페이지가 산만해지고 '기성품' 티가 난다. 섹션이 조용히 한 번 올라오는 것,
 *   그 하나만 일관되게 쓴다. 나머지는 타이포와 여백이 한다.
 *
 * ★★ 서버 컴포넌트다 — 클라이언트 컴포넌트가 아니다 (2026-08-18) ★★
 *   전에는 이 파일이 'use client' 였고, 인스턴스마다 useState + useEffect +
 *   IntersectionObserver 를 하나씩 만들었다. 홈에는 이 래퍼가 **34개** 있어서
 *   관찰자 34개와 하이드레이션 경계 34개가 생겼다(실측: 홈의 긴 작업 1,748ms,
 *   같은 사이트의 본문 페이지는 160~212ms).
 *
 *   지금은 **표시만** 한다 — 클래스와 지연 시간을 붙인 div 를 낼 뿐이고,
 *   실제로 `is-shown` 을 붙이는 일은 문서 전체에 하나뿐인 관찰자(RevealScript)가 한다.
 *   ⚠️ 여기에 'use client' 를 다시 붙이지 말 것. 붙이는 순간 34개가 되돌아온다.
 *
 * ⚠️ prefers-reduced-motion 과 자바스크립트 실패는 RevealScript / layout 의 noscript 가 맡는다.
 *    이 파일만 보고 "움직임이 꺼졌을 때 처리가 없다" 고 판단하지 말 것.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  /** 같은 줄의 카드들을 조금씩 늦춰 띄울 때 쓴다(ms). */
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
