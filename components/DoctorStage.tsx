'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CLINIC } from '@/lib/clinic';
import { DOCTORS } from '@/lib/doctors';

/**
 * 의료진 — 대표원장이 가운데에 서고 두 원장이 좌우 아래에 선다.
 *
 * ★★ 카드 세 장 → 원본 홈페이지의 무대 구도 (2026-08-25 운영자: "대표원장 가운데에
 *    딱 뜨고 그 왼쪽 오른쪽 밑에 각각 원장들 뜨고, 좀 카드 형식 말고 이렇게 원래
 *    동그라미치과 참고해서") ★★
 *    원본(circle-dental.co.kr)은 세 분을 누끼로 따서 **가운데가 크고 높게, 양옆이
 *    작고 낮게** 세워 뒀다. 한 줄로 늘어놓은 카드 세 장과 달리 그 자체가 위계를
 *    말한다 — 누가 대표원장인지 글을 안 읽어도 보인다. 그 구도를 가져오되,
 *    누끼 이미지가 따로 없으므로 **아래로 흐려져 사라지는 마스크**로 같은 인상을 낸다.
 *
 * ★ 상자를 없앴다 — 흰 카드·테두리·그림자가 사라지고 인물이 바탕 위에 그냥 선다.
 *   ⚠️ 그래서 사진 아래를 마스크로 지운다. 안 지우면 스튜디오 배경의 회색 네모가
 *      바닥에 그대로 남아 '상자를 없앤' 것이 아니라 '테두리만 지운' 것이 된다.
 *   ⚠️ -webkit-mask-image 를 같이 쓴다 — 사파리는 아직 접두사 없는 쪽을 안 본다.
 *
 * ★ 등장 순서 — 가운데가 먼저, 좌우가 뒤따른다(운영자 요청 그대로).
 *   ⚠️ 이 사이트의 .reveal 클래스를 그대로 쓴다. 관찰자는 레이아웃에 하나뿐인
 *      RevealScript 가 맡는다(components/RevealScript.tsx 주석 참조) — 여기서
 *      IntersectionObserver 를 새로 만들면 그 구조가 깨진다.
 *
 * ★ 스크롤 시차 — 좌우가 가운데보다 조금 늦게 따라온다. 등장이 끝난 뒤에도 계속
 *   살아 있게 만드는 것은 이쪽이다.
 *   ⚠️ 시차 transform 은 .reveal **안쪽** 요소에 건다. 같은 요소에 걸면 등장
 *      transform 을 매 프레임 덮어써서 등장이 아예 안 보인다.
 */

/** 무대 위 자리 — 원본과 같은 순서(왼쪽·가운데·오른쪽). */
const STAGE = [
  { at: 'left', delay: 200 },
  { at: 'center', delay: 0 },
  { at: 'right', delay: 320 },
] as const;

/** 사진 아래를 지우는 마스크 — 인물이 바탕에서 솟은 것처럼 보이게 한다. */
const FADE = 'linear-gradient(180deg, #000 0%, #000 72%, rgba(0,0,0,.45) 89%, transparent 100%)';

export function DoctorStage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    /* 좁은 화면은 세로로 쌓이므로 시차가 의미 없다. */
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    let raf = 0;
    const frame = () => {
      const kids = Array.from(el.querySelectorAll<HTMLElement>('.stage-drift'));
      if (kids.length) {
        const r = el.getBoundingClientRect();
        /* 섹션이 화면을 지나는 동안 -1 → 1. 가운데를 지날 때 0 이라 그때가 제자리다. */
        const t = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        kids.forEach((k) => {
          const w = Number(k.dataset.weight ?? 0);
          k.style.transform = `translate3d(0, ${(t * w).toFixed(2)}px, 0)`;
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  /*
   * ⚠️⚠️ 칸을 겹치게 하지 말 것 ⚠️⚠️
   *   원본은 누끼 인물 셋이 어깨를 겹치고 이름이 따로 없다. 여기는 인물 아래에
   *   각자 이름·경력이 붙으므로, 칸을 음수 여백으로 겹치면 **글끼리 겹친다**
   *   (실측: -3% 로 겹쳤더니 세 사람의 경력 줄이 서로 파고들었다).
   *   겹침 대신 **크기와 높이 차이**로 같은 위계를 만든다 — 가운데 칸이 1.25배
   *   넓고(= 같은 비율이라 그만큼 높고) 위에서 시작한다.
   * ⚠️ 좁은 화면에서는 세로로 쌓인다. 그때 대표원장이 맨 위여야 하므로 order 로
   *   끌어올린다 — 자리 순서(왼·가운데·오른)를 그대로 쌓으면 대표원장이 가운데 낀다.
   */
  return (
    <div
      ref={ref}
      className="mt-16 flex flex-col items-center gap-14 lg:mt-20 lg:grid lg:grid-cols-[1fr_1.25fr_1fr] lg:items-start lg:gap-x-8"
    >
      {STAGE.map(({ at, delay }) => {
        /* 자리 순서(왼·가운데·오른)와 데이터 순서(대표원장이 0번)는 다르다. */
        const d = at === 'center' ? DOCTORS[0] : at === 'left' ? DOCTORS[2] : DOCTORS[1];
        const lead = at === 'center';

        return (
          <div
            key={d.slug}
            className={`reveal w-full max-w-[380px] lg:max-w-none ${
              lead ? 'order-first lg:order-none' : 'lg:mt-24'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
          >
            {/* 시차는 안쪽에 — 바깥은 등장 transform 이 쓴다(위 주석). */}
            <div className="stage-drift" data-weight={lead ? -14 : 26}>
              <Link href={`/about/doctors/${d.slug}`} className="group block">
                <div
                  className="relative mx-auto aspect-[625/670] w-full"
                  style={{ maskImage: FADE, WebkitMaskImage: FADE }}
                >
                  <Image
                    src={d.photo}
                    alt={`${CLINIC.name} ${d.role} ${d.name}`}
                    fill
                    priority={lead}
                    sizes="(max-width: 1023px) 92vw, (max-width: 1440px) 36vw, 460px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>

                {/*
                  글은 사진 바로 아래. 상자가 없으므로 가운데 정렬로 인물과 축을 맞춘다.
                  ⚠️ 대표원장만 글자를 키운다 — 구도가 말하는 위계를 글자가 한 번 더 확인해 준다.
                */}
                <div className={`mt-6 text-center ${lead ? '' : 'lg:mt-5'}`}>
                  <p className="text-[12px] font-black tracking-[0.08em] text-gold-600">{d.role}</p>
                  <h3
                    className={`display mt-2 tracking-[0.04em] text-ink transition-colors group-hover:text-brand-700 ${
                      lead ? 'text-[30px] sm:text-[34px]' : 'text-[24px] sm:text-[26px]'
                    }`}
                  >
                    {d.name}
                  </h3>
                  <p className="mt-2.5 text-[13.5px] font-bold text-brand-600">
                    보건복지부 인정 통합치의학과 전문의
                  </p>

                  {/* 경력 두 줄만 — 나머지는 개별 페이지에 있다. */}
                  <ul className="mt-3.5 space-y-1">
                    {d.career
                      .filter((c) => !/통합치의학과 전문의/.test(c))
                      .slice(0, 2)
                      .map((c) => (
                        <li key={c} className="text-[13px] leading-relaxed text-ink-soft">
                          {c}
                        </li>
                      ))}
                  </ul>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-black text-brand-700">
                    프로필 보기
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
