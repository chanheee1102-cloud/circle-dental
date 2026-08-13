'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 화면에 들어올 때 한 번 떠오르는 래퍼.
 *
 * ★★ 왜 이것 하나만 두는가 ★★
 *   움직임이 많을수록 고급스러워지지 않는다. 오히려 요소마다 다른 효과가 붙으면
 *   페이지가 산만해지고 '기성품' 티가 난다. 섹션이 조용히 한 번 올라오는 것,
 *   그 하나만 일관되게 쓴다. 나머지는 타이포와 여백이 한다.
 *
 * ★ 한 번만 실행하고 관찰을 끊는다 — 스크롤을 오르내릴 때마다 다시 움직이면 멀미가 난다.
 * ⚠️ prefers-reduced-motion 을 존중한다. 움직임에 민감한 사용자에게 이 효과는 불편이지
 *    장식이 아니다. 그 경우 애초에 보인 상태로 시작한다.
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
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      /* 조금 일찍 시작한다 — 화면에 완전히 들어온 뒤 움직이면 이미 읽고 있던 글이 흔들린다. */
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'is-shown' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
