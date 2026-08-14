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
 *   ③ **재생이 실제로 시작됐다는 신호를 받은 뒤** 1.2초에 걸쳐 겹친다.
 *   전환이 끝날 때까지 보이는 것은 사진이라 검은 구간이 없다.
 *
 * ⚠️ 화면비가 다른 두 영상을 화면 크기에 따라 갈라 쓴다(16:9 / 4:5). 하나만 쓰면 반대쪽에서
 *    좌우 또는 상하가 크게 잘린다. cover 계산은 globals.css 의 .video-cover-* 참조.
 */
export function HeroMedia() {
  const [shown, setShown] = useState(false);

  /**
   * ★★ '재생이 시작됐다' 는 신호를 받고 나서 겹친다 ★★
   *   처음에는 iframe 의 onLoad 로 판단했는데 틀렸다 — onLoad 는 **오류 페이지에서도 발생한다.**
   *   회사망·백신이 Vimeo 를 막는 환경에서 플레이어가 영어 오류 문구
   *   ("We couldn't verify the security of your connection") 를 띄웠고, 그게 페이드인으로
   *   올라와 **사진을 덮어 버렸다**(라이브 실측).
   *
   *   Vimeo 플레이어는 postMessage 로 상태를 알려 준다. ready 를 받으면 play 이벤트를
   *   구독하고, 실제 play 가 왔을 때만 겹친다. 차단된 환경에서는 play 가 영영 오지 않으므로
   *   영상 레이어가 투명한 채로 남고 **진료실 사진이 그대로 보인다.**
   */
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://player.vimeo.com') return;
      let data: { event?: string };
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data?.event === 'ready') {
        /* 준비됐다고 겹치지 않는다 — 준비와 재생은 다르다. play 를 구독만 해 둔다. */
        (e.source as Window | null)?.postMessage(
          JSON.stringify({ method: 'addEventListener', value: 'play' }),
          'https://player.vimeo.com',
        );
        return;
      }
      if (data?.event === 'play') setShown(true);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

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
          className="video-cover video-cover-16x9 hidden lg:block"
        />
        <iframe
          src={HERO_VIDEO.mobile}
          title=""
          tabIndex={-1}
          allow="autoplay"
          className="video-cover video-cover-4x5 block lg:hidden"
        />
      </div>
    </>
  );
}
