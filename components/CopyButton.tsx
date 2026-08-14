'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 주소 복사 버튼.
 *
 * ★★ 왜 필요한가 ★★
 *   병원 홈페이지에서 가장 많이 **복사되는** 정보가 주소다. 택시 앱에, 카톡에,
 *   지도 앱 검색창에 붙여 넣는다. 그런데 긴 주소를 손으로 드래그해 고르는 것은
 *   휴대폰에서 특히 성가시다 — 한 번에 잡히지 않고 자꾸 앞뒤가 잘린다.
 *
 * ★ 성공했다는 것을 **글자로** 알려 준다. 아이콘만 바꾸면 알아채지 못한다.
 *   2초 뒤 원래대로 돌아온다 — 계속 '복사됨' 이면 다음에 눌러도 눌린 줄 모른다.
 *
 * ⚠️ clipboard API 는 HTTPS(또는 localhost)에서만 동작한다. 실패하면 조용히 넘어가지 않고
 *    주소를 선택 가능한 상태로 두는 것이 낫다 — 그래서 실패 시 아무 표시도 바꾸지 않는다.
 * ⚠️ 언마운트 뒤 타이머가 살아 있으면 사라진 컴포넌트의 상태를 건드린다. 정리한다.
 */
export function CopyButton({ text, label = '주소 복사' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setDone(false), 2000);
    } catch {
      /* 복사 권한이 없거나 http 인 환경 — 아무것도 바꾸지 않는다(주소는 그대로 선택 가능). */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand-300 bg-white px-3.5 py-2 text-[13px] font-black text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
    >
      <span aria-hidden className="text-[12px]">
        {done ? '✓' : '⧉'}
      </span>
      {done ? '복사됨' : label}
    </button>
  );
}
