'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * 영상 자리표시자 — 누르기 전에는 iframe 을 만들지 않는다.
 *
 * ★★ 왜 필요한가 ★★
 *   임베드 영상은 화면에 보이든 말든 **플레이어 JS 를 통째로 받아 실행한다.**
 *   느린 회선·느린 CPU(=PSI 가 재는 조건)에서 이 비용이 점수를 크게 깎는다.
 *   그런데 사회공헌 영상처럼 페이지 아래에 있는 영상은 대부분의 방문자가 재생하지 않는다.
 *   **누른 사람에게만** 값을 치르게 하는 것이 맞다.
 *
 * ★ 자리표시자는 진짜 사진이다 — 회색 네모를 두면 '깨진 영역' 으로 읽힌다.
 * ★ 누르면 그 자리에서 바로 재생된다(autoplay=1). 한 번 더 눌러야 하면 짜증이 난다.
 * ★ <button> 으로 감싼다 — div + onClick 은 키보드로 닿지 않는다.
 */
export function VideoFacade({
  embedSrc,
  poster,
  posterAlt,
  label,
  ratio = 'aspect-video',
}: {
  /** 재생 시 넣을 iframe 주소. autoplay 파라미터를 포함해 넘길 것. */
  embedSrc: string;
  poster: string;
  posterAlt: string;
  /** 버튼 접근성 이름 — "OOO 영상 재생". */
  label: string;
  ratio?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={`relative ${ratio} overflow-hidden rounded-2xl bg-brand-900`}>
        <iframe
          src={embedSrc}
          title={label}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={label}
      className={`group relative block w-full ${ratio} overflow-hidden rounded-2xl bg-brand-900`}
    >
      <Image
        src={poster}
        alt={posterAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        loading="lazy"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* 재생 버튼 위 글씨·아이콘의 대비를 확보한다. 밝은 프레임에서 흰 삼각형이 사라진다. */}
      <span aria-hidden className="absolute inset-0 bg-brand-900/35 transition-colors group-hover:bg-brand-900/25" />
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110"
      >
        {/* 삼각형은 시각적으로 왼쪽이 무거워 보이므로 1px 오른쪽으로 민다. */}
        <span className="ml-1 block h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-brand-700" />
      </span>
    </button>
  );
}
