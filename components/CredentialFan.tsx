'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import { IMG } from '@/lib/assets';

/**
 * 인증·수료 — 아래에서 하나씩 솟아오르고, 커서를 따라 기우는 입체 진열.
 *
 * ★★ 부채꼴 펼침 → 하나씩 솟아오르기 (2026-08-25 운영자: "저 인증패들 나오는거,
 *    하나씩 밑에서 튀어나오면서 선명하게 조금 크게 잘보이게 해줘") ★★
 *    직전에는 한 점에서 좌우로 벌어지는 부채꼴이었다. 펼쳐지는 **중간 내내 흐리고
 *    작고 기울어 있어서**, 스크롤을 멈춘 자리에 따라 인증패가 제대로 안 보였다.
 *    지금은 자리를 처음부터 잡아 두고 **아래에서 위로 하나씩 올라오기만** 한다 —
 *    도착하면 흐림이 0 이고 크기도 1 이라 언제 멈춰도 선명하다.
 *
 * ★ 크기를 키웠다 — 액자 높이 190 → 245px, 칸 폭 280 → 284px.
 *   인증서 원본이 236px 폭이라 그보다 크게 늘리면 뭉개진다. 여기가 상한선이다.
 *
 * ★★ 남은 세 가지가 입체를 만든다 ★★
 *   ① 기울기 — 커서 위치를 따라 판이 기운다(원근 900px).
 *   ② 층    — 인증패는 52px, 라벨은 20px 띄운다. 기울 때 둘이 다른 속도로
 *             움직이는 것이 3D 로 읽히는 진짜 이유다. 같은 평면에 두면
 *             아무리 회전해도 '기운 사진'일 뿐이다.
 *   ③ 바닥 그림자 — 판만 뜨고 그림자는 바닥(Z 0)에 남는다.
 *   ⚠️ 가만히 있을 때의 기본 각도(부채처럼 -6/-2/+2/+6도)는 **뺐다.** 솟아오르는
 *      연출에서는 각도가 붙으면 '흐트러진 것'으로 보인다. 커서 기울기만 남긴다.
 *
 * ★ 밑변 정렬은 그대로 지킨다 — 세 번째(세계근관치료학회)만 236×178 로 납작해서
 *   가운데 정렬하면 혼자 아래로 내려앉는다. items-end 로 네 장의 밑변을 한 선에 세운다.
 *
 * ★ 누르면 의료진 페이지로 간다. 움직이기만 하고 눌리지 않으면 사용자는 두세 번
 *   눌러 본 뒤에야 포기한다.
 *
 * ⚠️ 등장은 이 사이트의 .reveal 과 레이아웃에 하나뿐인 RevealScript 가 맡는다.
 *    여기서 IntersectionObserver 를 새로 만들지 말 것 — 관찰자를 한 곳으로 모은
 *    구조(2026-08-18 성능 작업)가 깨진다.
 */

/** 액자가 놓이는 칸 — 밑변이 여기 선다. */
const SHELF = 'h-[190px] w-full sm:h-[245px]';

export function CredentialFan() {
  const items = IMG.credentials;

  return (
    <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10">
      {items.map((c, i) => (
        /*
          ⚠️ 하나씩 올라오게 만드는 것은 이 delay 다. 다 같이 올라오면 '한 덩어리가
             떠오르는' 것이지 '하나씩 튀어나오는' 것이 아니다.
        */
        <li key={c.src} className="reveal" style={{ transitionDelay: `${i * 130}ms` }}>
          <Tilt deg={14}>
            <Link
              href="/about/doctors"
              aria-label={`${c.label} — 의료진 페이지에서 크게 보기`}
              className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
            >
              <figure className="relative px-2">
                {/* 바닥 그림자 — 판만 뜨고 이건 바닥에 남는다(translateZ 없음). */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-5 bottom-[52px] h-[20px] rounded-[50%] bg-brand-900/25 blur-[13px] sm:bottom-[62px]"
                />

                {/*
                  ⚠️⚠️ 크기를 이미지의 '내부 크기'에 맡기지 말 것 ⚠️⚠️
                    전에는 width/height 를 적고 `h-auto max-h-full w-auto` 로 뒀는데,
                    실제로는 **184×189 로 렌더됐다**(원본은 236×242). next/image 가 고른
                    변형본의 크기가 그대로 화면 크기가 돼 버려, 선반을 230px 로 키워도
                    사진은 그대로였다(실측으로 잡음).
                    → fill + object-contain 으로 **선반이 크기를 정하게** 한다. 이제
                      선반 높이를 바꾸면 사진도 따라 커진다.
                  ⚠️ object-bottom — 밑변 정렬이 여기서 지켜진다. 가운데 정렬로 두면
                     납작한 세 번째(236×178)만 혼자 떠 보인다.
                */}
                <div className={`relative ${SHELF}`}>
                  <Image
                    src={c.src}
                    alt={c.label}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 44vw, 300px"
                    /*
                      ⚠️ 최적화를 끈다. next/image 가 만든 변형본이 **184×189 로 줄어**
                         나와서(원본 236×242, 실측) 245px 로 그리면 30% 확대가 된다 —
                         인증서 글자가 뭉갠다. 이 넷은 원본이 52~71KB 로 작고 화면
                         아래쪽이라 lazy 로 받으므로, 원본을 그대로 쓰는 편이 낫다.
                      ⚠️ 큰 사진(히어로·진료 카드)에는 절대 쓰지 말 것 — 그쪽은 최적화가
                         파일 크기를 몇 배로 줄여 준다.
                    */
                    unoptimized
                    className="object-contain object-bottom"
                    style={{
                      transform: 'translateZ(52px)',
                      /* ⚠️ box-shadow 가 아니라 drop-shadow — 이 PNG 들은 배경이 지워져 있어
                         상자 그림자를 주면 없는 네모가 보인다. drop-shadow 는 실제 윤곽을 따른다. */
                      filter:
                        'drop-shadow(0 20px 24px rgba(15, 48, 42,.30)) drop-shadow(0 3px 6px rgba(15, 48, 42,.18))',
                    }}
                  />
                </div>

                {/*
                  캡션 자리를 두 줄 높이로 고정한다 — 이름 길이가 달라 한 줄/두 줄이 오가면
                  카드 아래 선이 어긋난다(원본이 정확히 그랬다).
                */}
                <figcaption
                  className="relative mt-5 flex min-h-[2.9rem] items-start justify-center text-center text-[13px] leading-snug text-ink-soft"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {c.label}
                </figcaption>
              </figure>
            </Link>
          </Tilt>
        </li>
      ))}
    </ul>
  );
}

/* ══ 기울기 ═════════════════════════════════════════════════════════ */

/**
 * 커서를 따라 기우는 판.
 * ⚠️ 손가락 입력·모션 감소에서는 아무것도 걸지 않는다 — 커서가 없거나, 있어도 불편이다.
 */
function Tilt({ children, deg = 5 }: { children: ReactNode; deg?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateX(${-py * deg}deg) rotateY(${px * deg}deg) translateZ(0)`;
    };
    const leave = () => {
      el.style.transform = '';
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [deg]);

  return (
    <div className="tilt-host">
      <div ref={ref} className="tilt">
        {children}
      </div>
    </div>
  );
}
