'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IMG } from '@/lib/assets';

/**
 * 병원 내부 슬라이드 — **끊김 없이 계속 흐른다.**
 *
 * ★ 왜 격자가 아니라 슬라이드인가
 *   내부 사진은 열두 장이다. 격자로 깔면 화면을 통째로 먹고 스크롤이 길어지는데,
 *   정작 한 장씩 자세히 보는 사람은 거의 없다. 옆으로 흐르면 한 줄 자리로 다 보여 준다.
 *
 * ★ 왜 '한 장씩 툭 넘기기' 가 아닌가 (2026-08-14 운영자)
 *   4.2초마다 한 화면씩 밀어내던 방식은 **읽는 리듬을 끊는다.** 보고 있던 사진이
 *   갑자기 사라지고, 넘어가는 순간마다 시선이 다시 처음을 찾는다.
 *   원본 홈페이지처럼 아주 느리게 **계속 흐르면** 훑는 눈을 방해하지 않으면서
 *   장수는 다 보여 줄 수 있다.
 *
 * ★★ 이음매를 없애는 방법 ★★
 *   목록을 **두 벌** 이어 붙이고, 첫 벌을 다 지나가면 scrollLeft 에서 딱 그만큼을 뺀다.
 *   화면에 보이는 그림은 그대로인데 위치만 처음으로 돌아가므로 끊김을 못 느낀다.
 *   (끝에서 처음으로 '되감기' 하면 그 순간이 눈에 그대로 띈다 — 그래서 되감지 않는다.)
 *
 * ★★ 라이브러리를 쓰지 않는다 ★★
 *   CSS 애니메이션으로 하면 더 매끄럽지만 **손으로 미는 것과 충돌한다.**
 *   scrollLeft 를 조금씩 더하는 방식은 네이티브 스크롤을 그대로 두므로
 *   터치·트랙패드로 직접 밀 수 있고, 스크린리더에는 그냥 이미지 목록으로 읽힌다.
 *
 * ★ 멈출 조건을 넉넉히 둔다 — 자동으로 움직이는 화면은 잘못 만들면 그 자체가 방해다.
 *   마우스·터치·포커스 / 백그라운드 탭 / prefers-reduced-motion.
 */
export function InteriorSlider() {
  const trackRef = useRef<HTMLUListElement>(null);
  /**
   * ★★ 왜 위치를 따로 들고 있나 — 여기서 한 번 크게 틀렸다 (2026-08-14 실측) ★★
   *   처음엔 `el.scrollLeft += 0.43` 로 짰다. 그런데 **scrollLeft 는 정수로 잘린다.**
   *   실측: `el.scrollLeft = 3 + 0.43` → 다시 읽으면 그대로 3. 즉 매 프레임 더한 값이
   *   통째로 버려져 **슬라이드가 1px 도 움직이지 않았다.**(3초 측정 이동량 0px)
   *   그래서 소수점 위치는 이 ref 가 들고, 화면에는 반올림한 정수만 넘긴다.
   */
  const posRef = useRef(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = 0;

    /*
     * 초당 42px (2026-08-25 운영자: "자동으로 넘어가는거 조금만 더 빠르게").
     * 26px 는 사진 한 장이 지나가는 데 15초가 걸려 멈춘 것처럼 보였다. 42px 면
     * 약 9초 — 눈으로 좇을 수 있으면서 흐른다는 것이 분명히 느껴진다.
     * 주의: 60px 를 넘기면 훑는 눈이 사진을 못 붙잡는다. 여기가 상한선 근처다.
     * ⚠️ 프레임 수가 아니라 **경과 시간**으로 계산한다. 프레임당 고정값을 더하면
     *    120Hz 화면에서 두 배로 빨라진다.
     */
    const PX_PER_SEC = 42;

    const step = (t: number) => {
      const el = trackRef.current;
      if (!el) return;
      if (last === 0) {
        last = t;
        posRef.current = el.scrollLeft;
      }
      const dt = (t - last) / 1000;
      last = t;

      if (!document.hidden) {
        /*
         * 손으로 민 흔적이 있으면 그 자리를 따라간다.
         * 우리가 쓴 값은 항상 round(pos) 라 차이가 1px 를 넘지 않는다 —
         * 2px 넘게 벌어졌다면 사용자가 직접 민 것이다.
         */
        if (Math.abs(el.scrollLeft - Math.round(posRef.current)) > 2) {
          posRef.current = el.scrollLeft;
        }
        posRef.current += PX_PER_SEC * dt;
        /* 두 벌 중 첫 벌을 다 지났으면 그만큼 되돌린다 — 보이는 그림은 그대로다. */
        const half = el.scrollWidth / 2;
        if (half > 0 && posRef.current >= half) posRef.current -= half;
        el.scrollLeft = Math.round(posRef.current);
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  /* 두 번째 벌은 이음매용이라 스크린리더에서 숨긴다 — 같은 사진을 두 번 읽지 않게. */
  const shots = IMG.interior;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      {/*
        양끝을 배경색으로 살짝 덮어 사진이 화면 밖으로 '사라지는' 것처럼 보이게 한다.
        딱 잘리면 목록이 거기서 끝난 것처럼 읽힌다.
      */}
      {/*
        ⚠️ 2026-08-25: 화면 양끝까지 쓰게 되면서 덮개를 12 → 20 으로 넓혔다.
           끝이 화면 모서리에 닿으므로 더 넓게 풀어야 '잘렸다'가 아니라 '이어진다'로 읽힌다.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-wine-bg to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-wine-bg to-transparent"
      />

      {/*
        ⚠️ 좌우 여백을 주지 않는다 — 사진이 화면 모서리에 닿아야 한다(운영자 요청).
        ⚠️ 칸 너비는 **화면 폭 기준**이다. 컨테이너 안에 있을 때는 lg 에서 31.5% 였는데,
           같은 값을 화면 폭에 쓰면 사진이 한 단계 커져 세 장밖에 안 보인다.
           26% 로 낮춰 예전과 비슷한 크기·개수를 유지한다.
      */}
      <ul ref={trackRef} className="scrollbar-none flex gap-4 overflow-x-auto pb-2">
        {[...shots, ...shots].map((shot, i) => (
          <li
            key={`${shot.src}-${i}`}
            aria-hidden={i >= shots.length}
            className="w-[72%] shrink-0 sm:w-[40%] lg:w-[26%]"
          >
            {/* ⚠️ 위 양끝 덮개 색은 이 슬라이더가 놓인 면(parchment)과 **같아야 한다** —
                   다르면 양끝에 다른 색 띠가 보인다. 홈 전용이라 바꿔도 다른 페이지엔 영향 없다. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-wine-soft">
              <Image
                src={shot.src}
                /*
                 * 두 벌 다 같은 설명을 단다.
                 *
                 * ★ 예전엔 두 번째 벌에 빈 alt 를 줬다. 같은 사진을 두 번 읽지 않게 하려던 건데,
                 *   그 일은 이미 <li> 의 aria-hidden 이 하고 있다 — aria-hidden 은 요소를 접근성
                 *   트리에서 통째로 빼므로 alt 가 뭐든 스크린리더는 읽지 않는다. 빈 alt 는 겹치는
                 *   방어였고, 대신 **ARIA 를 안 보는 쪽**에는 설명 없는 사진 열두 장으로 남았다.
                 *   AI 크롤러 대부분이 그렇다(HTML 만 읽고 접근성 트리를 만들지 않는다).
                 * ⚠️ 되돌리지 말 것 — 화면에 읽히는 내용은 그대로고, 기계가 읽을 설명만 생겼다.
                 */
                alt={shot.alt}
                fill
                sizes="(max-width: 640px) 72vw, (max-width: 1024px) 40vw, 26vw"
                /* 앞 세 장만 미리 받는다. 스물넷을 한꺼번에 받으면 첫 화면이 느려진다. */
                loading={i < 3 ? 'eager' : 'lazy'}
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
