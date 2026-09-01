'use client';

import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { buildWeek, liveOf, useSeoulNow } from '@/lib/liveHours';
import { Sentences } from '@/components/ui';

/**
 * 진료시간 — 한 주가 한 줄에 들어가고, 오늘 칸에 지금 상태가 실시간으로 뜬다.
 *
 * ★★ 두 번째 버전(circle-dental-2)의 7칸 배치를 옮겨 왔다 (2026-08-25) ★★
 *    요일마다 한 줄씩 쌓던 세로 표를 가로 7칸으로 편다. 요일은 원래 가로로 나열되는
 *    정보고(달력이 그렇다), 펴 놓으면 **야간 진료가 화·목이라는 패턴**이 한눈에 보인다.
 *
 * ★★ 7일치는 rows 에서 만들어 낸다 — 손으로 적지 않는다 ★★
 *    lib/clinic.ts 의 hours.rows 는 **묶음 표기**다(월·수·금 한 줄, 화·목 한 줄).
 *    화면이 7칸이라고 해서 요일 일곱 개를 여기 새로 적으면, 진료시간이 바뀔 때
 *    rows 만 고치고 여기를 빠뜨려 **두 곳이 어긋난다**.
 *
 * ⚠️ '야간 진료' 는 rows 의 note 를 그대로 쓰지 않는다. note 가 묶음의 대표 줄(화요일)에만
 *    붙어 있어서, 그대로 쓰면 목요일 칸이 비어 야간 진료가 화요일만 하는 것처럼 보인다.
 *    마감 시각으로 판정한다(19시 이후 = 야간).
 * ⚠️ 토요일 '점심시간 없음' 도 계산한다. 점심(13:00–14:30)이 그날 진료시간 안에 온전히
 *    들어가지 않으면 그날은 점심시간이 없다 — lib/seo.ts 가 구조화 데이터를 만들 때
 *    쓰는 것과 **같은 판정**이라 화면과 기계가 어긋나지 않는다.
 *
 * ★★ 지금 상태 표시 (2026-08-25 운영자: "그 라이브 모양으로 실제 진료시간에 맞게
 *    나오게 하자") ★★
 *    ⚠️⚠️ 이건 2026-08-14 에 **일부러 걷어냈던 기능이다** ⚠️⚠️
 *      그때 이유: 자동 판정은 **공휴일·임시 휴진을 알 수 없다.** 쉬는 날 "진료 중"이
 *      떠 있으면 그 표시 하나가 환자를 헛걸음시킨다(SiteHeader 주석 참조).
 *      운영자가 다시 요청해 되살리되, 그 한계를 **화면에 적어 두는 조건**으로 넣는다 —
 *      표 아래 한 줄이 그것이다. 그 줄을 지우면 이 기능은 다시 위험해진다.
 *    ⚠️ 그래서 문구도 단정하지 않는다. '진료 중' 옆에 늘 전화가 함께 있어야 한다.
 *
 * ⚠️ 기준 시각은 방문자의 기기가 아니라 **병원이 있는 곳(Asia/Seoul)** 이다.
 *    해외에서 보면 기기 날짜가 하루 어긋나는데, 궁금한 건 병원의 오늘이다.
 * ⚠️ 서버 렌더 때는 아무 것도 표시하지 않는다(mounted 후에만). 서버와 클라이언트의
 *    시각이 다르면 hydration 이 깨진다.
 */

/*
 * ⚠️ 진료시간 계산(buildWeek · liveOf · 지금 시각)은 **lib/liveHours.ts 한 곳**에 있다.
 *    대화 화면(ConcernPhone) 상단에도 같은 표시가 필요해져 2026-08-26 에 빼냈다.
 *    여기에 다시 적으면 진료시간이 바뀔 때 두 곳이 어긋난다 — 한쪽은 '진료 중',
 *    다른 쪽은 '진료 종료' 가 뜨는 화면이 된다.
 */

export function HoursStrip() {
  /** 서울 기준 '지금'. 서버 렌더 때는 null 이다(hydration 보호). */
  const now = useSeoulNow();
  const week = buildWeek();
  const { lunch } = UNVERIFIED.hours;
  /** 점심시간이 없는 요일 — 아래 한 줄에서 예외를 밝힌다. */
  const noLunch = week.filter((d) => d.note === '점심시간 없음').map((d) => `${d.ko}요일`);

  const todayIdx = now?.dow ?? null;

  return (
    <>
      {/*
        표를 판 위로 띄운다 — 바깥 그림자 + 칸마다 위쪽 옅은 흰 선(inset).
        ⚠️ 그림자는 **바깥 상자**가 진다. dl 은 둥근 모서리를 위해 overflow-hidden 이라
           안쪽에 건 그림자는 잘려 아무것도 안 보인다.
        ⚠️ 그림자를 Tailwind 임의값으로 썼더니 적용이 안 됐다(계산값이 투명 두 겹).
           한 번 쓰는 장식값이라 인라인 style 로 둔다.
      */}
      <div
        className="mt-10 rounded-[20px]"
        style={{ boxShadow: '0 26px 64px -28px rgba(0,0,0,0.75)' }}
      >
        {/*
          ⚠️ 칸 사이 선은 grid 의 gap-px 에 **dl 의 배경색이 비쳐** 만들어진다.
             선 색을 바꾸려면 dl 배경을 바꿔야 한다 — 칸마다 border 를 주면 맞닿는
             자리에서 두 겹이 된다.
        */}
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-white/25 card-glass/22 sm:grid-cols-4 lg:grid-cols-7">
          {week.map((d, n) => {
            const on = todayIdx === n;
            const live = on && now ? liveOf(d, now.min) : null;
            return (
              <div
                key={d.ko}
                /*
                 * ⚠️ 7 은 2 로도 4 로도 나누어떨어지지 않는다. 마지막 칸을 그냥 두면
                 *    좁은 화면에서 **빈 슬롯이 회색 사각형으로 남는다**(칸 사이 1px 선의
                 *    바탕색이 그대로 보인다). 마지막 칸이 남은 폭을 차지하게 한다.
                 *
                 * ★★ 오늘 칸을 흰 면 → **테두리**로 (2026-08-25 운영자: "이것보다는
                 *    그냥 테두리를 잘보이게 TODAY 로 표시하고") ★★
                 *    면을 통째로 채우면 그 칸만 다른 표처럼 보였다. 테두리는 표의 결을
                 *    지키면서 '여기' 만 짚는다.
                 * ⚠️ border 가 아니라 **안쪽 그림자(inset ring)** 다. border 를 주면
                 *    그 칸만 2px 커져 옆 칸들이 밀린다.
                 */
                className={`relative flex flex-col gap-3 px-5 py-7 ${
                  n === week.length - 1 ? 'col-span-2 lg:col-span-1' : ''
                } bg-dusk ${on ? '' : 'shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]'}`}
                style={
                  on
                    ? { boxShadow: 'inset 0 0 0 2px var(--color-signal)' }
                    : undefined
                }
              >
                {/*
                  ⚠️ 색만으로 알리지 않는다 — 색을 못 보는 사람에게는 'TODAY' 라는
                     글자가 유일한 근거다. 배지를 지우지 말 것.
                */}
                {on && (
                  <span className="absolute top-4 right-4 rounded-full border border-signal/60 px-2.5 py-[3px] text-[13.5px] font-medium text-signal">
                    Today
                  </span>
                )}

                <dt
                  className={`text-[15px] font-semibold tracking-[0.02em] ${
                    d.closed ? 'text-white/60' : on ? 'text-white/75' : 'text-white/55'
                  }`}
                >
                  {/* 화면에는 '월', 낭독기에는 '월요일'. */}
                  {d.ko}
                  <span className="sr-only">요일</span>
                </dt>

                <dd>
                  <span
                    className={`tabular block text-[17.5px] leading-[1.5] font-bold tracking-[-0.01em] ${
                      d.closed ? 'text-white/55' : 'text-white'
                    }`}
                  >
                    {d.time}
                  </span>
                  {d.note && (
                    <span
                      className={`mt-2 block text-[14px] leading-[1.5] font-medium ${
                        d.closed ? 'text-white/65' : 'text-signal'
                      }`}
                    >
                      <Sentences text={d.note} />
                    </span>
                  )}

                  {/*
                    지금 상태 — 오늘 칸에만. 진료 중일 때만 점이 맥박한다.
                    ⚠️ 진료 중이 아닐 때 점이 계속 뛰면 '살아 있다' 는 신호가 거짓이 된다.
                  */}
                  {live && (
                    <span
                      className={`mt-3 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[13.5px] font-bold ${
                        live.open
                          ? 'bg-signal/15 text-signal'
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`relative inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-current ${
                          live.open ? 'live-dot' : ''
                        }`}
                      />
                      <Sentences text={live.text} />
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {/*
        점심시간은 요일 칸에 넣지 않는다 — 7칸 전부에 같은 값을 반복하게 되고,
        예외인 요일이 오히려 묻힌다.
      */}
      <p className="mt-6 text-[15.5px] leading-[1.8] text-white/60">
        점심시간{' '}
        <span className="tabular font-bold text-white">
          {lunch.start} – {lunch.end}
        </span>
        {noLunch.length > 0 && <span className="ml-2">({noLunch.join(' · ')} 제외)</span>}
      </p>

      {/*
        ⚠️⚠️ 이 줄을 지우지 말 것 ⚠️⚠️
          위의 '진료 중' 표시는 **정해진 진료시간만** 보고 판정한다. 공휴일과 임시
          휴진은 화면이 알 방법이 없다 — 그래서 2026-08-14 에 같은 기능을 한 번
          걷어냈었다. 지금은 운영자 요청으로 되살리되 **한계를 함께 적는 조건**이다.
          이 문장이 없으면 쉬는 날 "진료 중" 하나가 환자를 헛걸음시킨다.
      */}
      <p className="mt-2 text-[14.5px] leading-[1.8] text-white/60">
        공휴일·임시 휴진은 이 표시에 반영되지 않습니다. 방문 전{' '}
        <a href={CLINIC.phoneHref} className="font-bold text-white/70 underline underline-offset-4">
          {CLINIC.phone}
        </a>
        로 확인해 주세요.
      </p>
    </>
  );
}
