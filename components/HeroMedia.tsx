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
   * ★★ 영상을 첫 화면 임계 경로에서 빼낸다 (2026-08-14, PSI 54 대응) ★★
   *
   * 두 가지가 겹쳐 있었다.
   *   ① 화면비가 다른 두 영상을 `hidden lg:block` / `block lg:hidden` 으로 갈랐는데,
   *      그건 **CSS 로 감춘 것일 뿐 둘 다 로드된다.** 모바일에서도 데스크톱용 플레이어를
   *      함께 받고 있었다(실측: 모바일 390px 에서 iframe 4개).
   *   ② iframe 이 처음부터 있어서 Vimeo 플레이어 JS 가 첫 화면과 CPU 를 두고 경쟁했다.
   *      PSI 모바일은 CPU 를 4배 느리게 흉내 내므로 여기서 점수가 크게 깎인다.
   *
   * → 화면 크기를 재서 **하나만** 만들고, 첫 페인트가 끝난 뒤에 붙인다.
   *   아래에 진료실 사진이 이미 깔려 있어 늦게 붙어도 화면이 비지 않는다 — 오히려
   *   사진이 먼저 또렷하게 보이고 영상이 뒤따라 겹치는 지금 연출과 잘 맞는다.
   */
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    /*
     * ★★ 모바일에서는 배경 영상을 아예 켜지 않는다 (2026-08-14) ★★
     *   PSI 는 **모바일 기준**으로 점수를 매기고(현재 54/100), 그 점수는 검색 순위 신호이자
     *   AI 크롤러의 수집 속도에 영향을 준다. 배경 영상은 장식인데 값이 가장 비싸다 —
     *   플레이어 JS 와 영상 스트림이 느린 회선·느린 CPU 를 그대로 때린다.
     *
     *   게다가 세로 화면에서는 4:5 영상도 크게 잘려 나가 얻는 인상이 크지 않다.
     *   그 자리에 진료실 사진을 또렷하게 보여 주는 편이 낫다.
     *
     *   ⚠️ 되살리려면 이 분기만 지우면 된다(아래 pick 이 모바일 주소를 이미 갖고 있다).
     *      다만 그 전에 PSI 를 다시 재 볼 것.
     */
    const pick = () =>
      window.matchMedia('(min-width: 1024px)').matches ? HERO_VIDEO.desktop : null;

    /*
     * 유휴 시간에 붙인다 — 없으면(사파리 등) 짧은 타이머로 물러선다.
     * ⚠️ requestIdleCallback 은 타입 정의가 없는 환경이 있어 좁혀서 꺼낸다.
     */
    const ric = (window as unknown as {
      requestIdleCallback?: (c: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    }).requestIdleCallback;

    const run = () => setSrc(pick());
    if (ric) {
      const h = ric(run, { timeout: 2500 });
      return () => {
        (window as unknown as { cancelIdleCallback?: (x: number) => void }).cancelIdleCallback?.(h);
      };
    }
    const t = window.setTimeout(run, 900);
    return () => window.clearTimeout(t);
  }, []);

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
        {/*
          ★★ 이 사진이 모바일 LCP 다. sizes 를 실제 필요한 폭보다 작게 적는다 ★★
            브라우저는 `sizes` 값에 **DPR 을 곱해서** 후보를 고른다. `100vw` 를 두면
            390px 화면이 DPR 3 에서 1920px 짜리를 받아 간다(실측).
            이 사진은 배경이다 — 위에 어두운 그라데이션 두 겹과 방사형 오버레이가 덮이고
            그 위에 흰 글씨가 얹힌다. 사람은 이 사진의 화소를 보지 않는다.
          ⚠️ 이 요령을 내용을 보여 주는 사진에 쓰지 말 것 — 인증서·의료진·내부 사진은
             흐려지면 그대로 손해다. 오버레이에 덮이는 배경에만 쓴다.
        */}
        <Image
          src={IMG.hero}
          /*
           * 배경 사진이지만 설명은 단다.
           *   위 래퍼가 aria-hidden 이라 스크린리더는 이걸 읽지 않는다 — 장식 배경을
           *   읽어 주면 오히려 방해다. 그 판단은 그대로 두고, ARIA 를 안 보는 기계에게는
           *   이 사진이 무엇인지 알려 준다. 실제로 찍힌 것만 적는다(지어내면 제56조 위반).
           */
          alt="진료실로 이어지는 복도 — 양옆이 유리 파티션으로 나뉘어 있다"
          fill
          priority
          quality={55}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 75vw, 1920px"
          className="object-cover object-center"
        />
      </div>

      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-out ${
          shown ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/*
          하나만 만든다. 어느 쪽을 만들지는 위에서 화면 폭으로 정했고,
          cover 클래스도 그 화면비에 맞춰 함께 고른다 — 둘이 어긋나면 좌우가 크게 잘린다.
        */}
        {src && (
          <iframe
            src={src}
            title=""
            tabIndex={-1}
            allow="autoplay"
            className={`video-cover ${
              src === HERO_VIDEO.desktop ? 'video-cover-16x9' : 'video-cover-4x5'
            }`}
          />
        )}
      </div>
    </>
  );
}
