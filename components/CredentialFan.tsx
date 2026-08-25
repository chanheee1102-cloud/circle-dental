'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { IMG } from '@/lib/assets';

/**
 * 인증·수료 — 스크롤에 맞춰 부채처럼 펼쳐지고, 커서를 따라 기우는 입체 진열.
 *
 * ★★ 두 번째 버전(circle-dental-2)의 인증패 연출을 옮겨 왔다
 *    (2026-08-25 운영자: "이렇게 버전2에서 스크롤 이벤트를 버전 1에도 입혀보자") ★★
 *    네 가지가 함께 움직여야 '진열대'로 읽힌다. 하나만 하면 그냥 커진 사진이다.
 *      ① 펼침  — 화면 아래에서 올라오는 동안 한 점에서 좌우로 벌어진다.
 *                동시에 흐림이 걷히고 커진다. **흐림이 핵심이다** — 크기·투명도만
 *                바꾸면 '커진다'로 읽히고, 흐림이 걷혀야 '초점이 맞는다'가 된다.
 *      ② 기울기 — 커서 위치를 따라 판이 기운다(원근 900px).
 *      ③ 층    — 인증패는 52px, 라벨은 20px 띄운다. 기울 때 둘이 다른 속도로
 *                움직이는 것이 3D 로 읽히는 진짜 이유다. 같은 평면에 두면
 *                아무리 회전해도 '기운 사진'일 뿐이다.
 *      ④ 바닥 그림자 — 판만 뜨고 그림자는 바닥(Z 0)에 남는다.
 *
 * ★ 기본 각도 — 가만히 있을 때도 부채처럼 각자 다른 각도로 선다.
 *   커서 기울기만 두면 손가락 입력(모바일)에는 커서가 없어 평면으로 무너지고,
 *   데스크톱에서도 네 장을 다 훑지는 않는다.
 *   ⚠️ 이 회전은 <figure> 에 건다. Tilt 는 바깥 .tilt 의 transform 을 직접 쓰고
 *      커서가 빠지면 그 값을 지우므로, 거기에 기본 각도를 두면 지워진다.
 *
 * ★ 밑변 정렬은 그대로 지킨다 — 세 번째(세계근관치료학회)만 236×178 로 납작해서
 *   가운데 정렬하면 혼자 아래로 내려앉는다. items-end 로 네 장의 밑변을 한 선에 세운다.
 *
 * ★ 누르면 의료진 페이지로 간다. 움직이기만 하고 눌리지 않으면 사용자는 두세 번
 *   눌러 본 뒤에야 포기한다.
 *   ⚠️ 예전의 '뒤에서 번지는 스포트라이트'는 뺐다 — 기울기·층·바닥 그림자가 이미
 *      "손이 여기 있다"를 훨씬 세게 말한다. 셋 위에 빛까지 겹치면 지저분해진다.
 *
 * ⚠️ 모션 감소·손가락 입력 환경에서는 펼침과 기울기가 스스로 꺼지고 **평범한 격자**로
 *    떨어진다. 그때도 바닥 그림자와 층 간격은 남아 평면으로 무너지지 않는다.
 */

/** 액자가 놓이는 칸 — 밑변이 여기 선다. */
const SHELF = 'flex h-[150px] items-end justify-center sm:h-[190px]';

export function CredentialFan() {
  const items = IMG.credentials;

  return (
    <FanRow>
      {items.map((c, i) => (
        <Tilt key={c.src} deg={14}>
          <Link
            href="/about/doctors"
            aria-label={`${c.label} — 의료진 페이지에서 크게 보기`}
            className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 focus-visible:ring-offset-brand-50"
          >
            <figure
              className="relative px-2"
              /* 가운데를 0 으로 두고 바깥으로 갈수록 4도씩 더 돌린다. */
              style={{ transform: `rotateY(${(i - (items.length - 1) / 2) * 4}deg)` }}
            >
              {/* 바닥 그림자 — 판만 뜨고 이건 바닥에 남는다(translateZ 없음). */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-4 bottom-[46px] h-[18px] rounded-[50%] bg-brand-900/25 blur-[12px] sm:bottom-[56px]"
              />

              <div className={`relative ${SHELF}`}>
                <Image
                  src={c.src}
                  alt={c.label}
                  width={236}
                  height={242}
                  loading="lazy"
                  sizes="(max-width: 640px) 40vw, 220px"
                  className="relative h-auto max-h-full w-auto"
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
                className="relative mt-5 flex min-h-[2.9rem] items-start justify-center text-center text-[12.5px] leading-snug text-ink-soft"
                style={{ transform: 'translateZ(20px)' }}
              >
                {c.label}
              </figcaption>
            </figure>
          </Link>
        </Tilt>
      ))}
    </FanRow>
  );
}

/* ══ 펼침 ═══════════════════════════════════════════════════════════ */

/**
 * 한 점에서 좌우로 펼쳐지는 줄.
 *
 * ⚠️⚠️ 매 프레임 자식을 다시 찾는다 ⚠️⚠️
 *   setFlat(false) 는 비동기라 이 훅이 도는 시점에 .fan-item 은 아직 DOM 에 없다.
 *   한 번만 모아 두면 카드가 한 자리에 겹친 채 아무것도 안 움직인다(v2 에서 겪은 버그).
 * ⚠️ rAF 루프는 이 컴포넌트가 스스로 돌린다. v2 는 전역 Smooth 의 틱을 빌려 쓰는데
 *    이 사이트에는 그런 게 없다 — 여기서 만들고 여기서 끈다.
 */
function FanRow({ children }: { children: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [flat, setFlat] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* 손가락 입력·모션 감소에서는 평범한 격자로 둔다. */
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 900px)').matches
    ) {
      return;
    }
    setFlat(false);

    let raf = 0;
    const frame = () => {
      const kids = Array.from(el.querySelectorAll<HTMLElement>('.fan-item'));
      if (kids.length) {
        const r = el.getBoundingClientRect();
        /* 섹션이 화면 아래에서 가운데로 올라오는 동안 0 → 1 */
        const span = window.innerHeight * 0.85;
        const p = Math.min(
          1,
          Math.max(0, (window.innerHeight - r.top - window.innerHeight * 0.15) / span),
        );
        /* 부드럽게 — 선형이면 끝에서 뚝 멈춘 것처럼 보인다. */
        const e = 1 - Math.pow(1 - p, 3);
        const gap = Math.min(330, (window.innerWidth - 220) / Math.max(1, kids.length));
        const mid = (kids.length - 1) / 2;

        kids.forEach((k, i) => {
          /* -1.5 … +1.5 — 가운데가 0 이라 좌우가 대칭으로 벌어진다. */
          const rel = i - mid;
          const x = rel * gap * e;
          /*
            아크 — 바깥으로 갈수록 아래로 처진다. 손에 쥔 카드가 부채꼴로 벌어질 때
            생기는 곡선이다. 이게 없으면 그냥 가로로 미끄러지는 줄이 된다.
          */
          const y = (1 - e) * 26 + Math.abs(rel) * 12 * e;
          /* 각도 — 처음엔 한 뭉치로 겹쳐 있다가 펼쳐지며 각자 기운다(카드를 돌리듯). */
          const rot = rel * 4.5 * e;
          k.style.transform =
            `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ` +
            `rotate(${rot.toFixed(2)}deg) scale(${(0.76 + 0.24 * e).toFixed(3)})`;
          /* ⚠️ 흐림이 핵심이다 — 크기·투명도만 바꾸면 '커진다'로 읽히고,
             흐림이 걷혀야 '초점이 맞는다'가 된다. */
          k.style.filter = `blur(${((1 - e) * 4).toFixed(2)}px)`;
          k.style.opacity = `${(0.35 + 0.65 * e).toFixed(3)}`;
          /* 가운데 두 장이 위로 오게 — 겹쳐 있는 구간에서 순서가 뒤집히면 어수선하다. */
          k.style.zIndex = `${10 - Math.round(Math.abs(rel) * 2)}`;
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', frame, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={
        flat
          ? 'mt-9 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4'
          : /* 아크로 아래가 처지므로 높이에 그만큼 여유를 둔다 — 안 두면 바깥 두 장의
               캡션이 다음 섹션에 물린다. */
            'relative mt-10 grid h-[clamp(300px,25vw,350px)] place-items-center'
      }
    >
      {children.map((it, i) => (
        <div key={i} className={flat ? '' : 'fan-item absolute w-[min(280px,21vw)] will-change-transform'}>
          {it}
        </div>
      ))}
    </div>
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
