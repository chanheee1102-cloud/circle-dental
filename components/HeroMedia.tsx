'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IMG, HERO_VIDEO } from '@/lib/assets';

/**
 * 히어로 배경 — 사진 위로 영상이 서서히 겹쳐 든다.
 *
 * ★★ 첫 화면의 검은 화면 1~2초를 없애는 자리 ★★
 *   Vimeo 는 iframe 이 뜬 뒤에도 첫 프레임이 나오기까지 시간이 걸린다. 그 사이 플레이어의
 *   검은 바탕이 화면을 덮어, 홈페이지가 "먹통" 으로 시작하는 것처럼 보였다(운영자 신고).
 *
 *   ① 진료실 사진을 먼저 깔고
 *   ② 영상은 투명하게 시작해
 *   ③ 재생이 시작될 만한 시점에 1.2초에 걸쳐 겹친다.
 *   전환이 끝날 때까지 보이는 것은 사진이라 검은 구간이 없다.
 *
 * ⚠️ iframe 의 onLoad 는 '플레이어 문서가 떴다' 는 뜻이지 '영상이 나온다' 는 뜻이 아니다.
 *    그래서 onLoad 뒤에 조금 더 기다렸다가 겹친다. 영상이 끝내 안 뜨면(회사망·백신 차단)
 *    투명한 채로 남아 사진이 그대로 보인다 — 실패해도 화면이 망가지지 않는다.
 *
 * ⚠️ 화면비가 다른 두 영상을 화면 크기에 따라 갈라 쓴다(16:9 / 4:5). 하나만 쓰면 반대쪽에서
 *    좌우 또는 상하가 크게 잘린다. cover 계산은 globals.css 의 .video-cover-* 참조.
 */
export function HeroMedia() {
  const [loaded, setLoaded] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    /* 플레이어가 첫 프레임을 그릴 여유. 짧으면 검은 화면이 비치고, 길면 영상이 늦게 보인다. */
    const t = setTimeout(() => setShown(true), 900);
    return () => clearTimeout(t);
  }, [loaded]);

  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={IMG.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-out ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <iframe
          src={HERO_VIDEO.desktop}
          title=""
          tabIndex={-1}
          allow="autoplay"
          onLoad={() => setLoaded(true)}
          className="video-cover video-cover-16x9 hidden lg:block"
        />
        <iframe
          src={HERO_VIDEO.mobile}
          title=""
          tabIndex={-1}
          allow="autoplay"
          onLoad={() => setLoaded(true)}
          className="video-cover video-cover-4x5 block lg:hidden"
        />
      </div>
    </>
  );
}
