import Link from 'next/link';
import { TREATMENTS } from '@/lib/treatments';
import { Container } from '@/components/ui';
import { Reveal } from '@/components/Reveal';

/**
 * 진료 영역 전체 목록 — 번호 + 이름 + '이런 경우' 칩 + 링크.
 *
 * ★ 위쪽 PillarSection 과 역할이 다르다
 *   저기는 사진으로 보여 주는 **네 갈래 요약**이고, 여기는 **열 갈래 전체 목록**이다.
 *   사진 카드는 인상을 주지만 훑기가 안 된다 — 자기 것을 찾으려면 이런 목록이 필요하다.
 *   부수 효과로 진료 페이지 열 곳으로 가는 내부 링크가 한 번에 생긴다.
 *
 * ★ 칩에 무엇을 넣는가
 *   장비 이름이나 브랜드를 늘어놓지 않는다. 우리가 확인한 것은 **'이런 경우에 봅니다'**
 *   (treatments.whoFor) 이고, 환자가 자기 상황을 찾는 데도 그쪽이 실제로 쓸모 있다.
 *   ⚠️ 여기서 문구를 새로 만들지 않는다 — 전부 lib/treatments.ts 에서 온다.
 *
 * ★ 디자인은 우리 것으로
 *   번호를 크게 두되 **테두리만 있는 원**에 담아 브랜드 모티프(동그라미)와 잇는다.
 *   행 전체가 링크이고, 올리면 배경이 아주 옅게 깔리며 화살표가 움직인다.
 */
export function CareListSection() {
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            Our Care
          </p>
          <h2 className="display-sm mt-4 text-[30px] text-ink sm:text-[38px]">
            어떤 경우에 어떤 진료를 하나요?
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">
            {TREATMENTS.length}가지 진료 영역을 &lsquo;이런 경우에 봅니다&rsquo; 기준으로 정리했습니다.
            자기 상황과 가까운 줄을 눌러 보세요.
          </p>
        </div>

        <ul className="mt-14 border-t border-brand-200/70">
          {TREATMENTS.map((t, i) => (
            <li key={t.slug} className="border-b border-brand-200/70">
              <Reveal delay={Math.min(i, 5) * 40}>
                <Link
                  href={`/treatment/${t.slug}`}
                  className="group grid items-center gap-x-6 gap-y-3 px-2 py-7 transition-colors hover:bg-brand-50/70 sm:px-4 lg:grid-cols-[auto_minmax(0,260px)_1fr_auto]"
                >
                  {/* 번호 — 테두리 원. 병원 이름이 '동그라미'라 이 모티프를 계속 쓴다. */}
                  <span
                    aria-hidden
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-300 text-[14px] font-black tabular-nums text-brand-500 transition-colors group-hover:border-gold-500 group-hover:text-gold-600"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <h3 className="display-sm text-[19px] text-ink transition-colors group-hover:text-brand-700 sm:text-[21px]">
                    {t.name}
                  </h3>

                  {/* '이런 경우' — 셋까지만. 넷을 넘으면 줄이 두 줄이 되어 목록의 리듬이 깨진다. */}
                  <ul className="flex flex-wrap gap-2">
                    {t.whoFor.slice(0, 3).map((w) => (
                      <li
                        key={w}
                        className="rounded-md bg-brand-100/80 px-2.5 py-1 text-[12.5px] leading-snug text-ink-soft"
                      >
                        {w}
                      </li>
                    ))}
                  </ul>

                  <span
                    aria-hidden
                    className="hidden text-[18px] text-brand-300 transition-all group-hover:translate-x-1 group-hover:text-gold-600 lg:inline"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
