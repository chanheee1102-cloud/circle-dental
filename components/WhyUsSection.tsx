import { WHY_US, WHY_US_COUNT } from '@/lib/whyUs';
import { Container, Sentences } from '@/components/ui';
import { Reveal } from '@/components/Reveal';

/**
 * '왜 동그라미치과인가' — 사람 / 장비 / 배려 세 갈래 카드.
 *
 * ★ 왜 카드로 펼치는가
 *   같은 내용을 줄글로 쓰면 끝까지 읽는 사람이 거의 없다. 병원을 고르는 사람은
 *   훑으면서 자기 기준에 걸리는 것만 멈춰 읽는다 — '야간진료' 하나 때문에 오는 사람과
 *   '전문의 3인' 때문에 오는 사람이 다르다. 카드는 그 훑기를 방해하지 않는다.
 *
 * ★ 세 갈래를 한 화면에 세로로 쌓는다
 *   탭으로 감추면 두 갈래는 아무도 안 본다. 스크롤은 공짜다.
 *
 * ★ 숫자를 손으로 적지 않는다 — 제목의 "N가지" 는 WHY_US_COUNT 에서 온다.
 *   카드를 하나 지웠는데 제목만 12로 남는 흔한 사고를 막는다.
 *
 * ⚠️ 카드 문장은 전부 lib/whyUs.ts 에서 온다. 여기서 문장을 만들지 않는다 —
 *    의료광고는 사실이 아닌 표시가 그대로 의료법 제56조 위반이다.
 */
export function WhyUsSection() {
  return (
    <section className="border-y border-brand-200/60 bg-wine-soft/40 py-24 lg:py-32">
      {/*
        ★★ 좌우 비대칭 — 제목을 왼쪽 레일에 세워 두고 내용만 오른쪽으로 흐른다 (2026-08-18) ★★
          운영자가 가져온 참고 사이트(리베리의원)에서 가장 값이 큰 아이디어였다.
          왼쪽 절반을 통째로 비우고 오른쪽에만 글을 놓으면, 같은 내용인데도 화면이 훨씬
          정돈되어 보인다. 우리 섹션은 지금까지 전부 '제목 → 그 아래 내용' 한 방향이라
          긴 페이지에서 리듬이 평평했다.

        ★ 제목을 sticky 로 붙인다. 카드 열두 장을 스크롤하는 동안 "지금 무엇을 읽고 있는지"가
          왼쪽에 계속 남아 있다 — 목차를 따로 두지 않고 같은 일을 한다.
        ⚠️ 좁은 화면에서는 이 배치를 쓰지 않는다(lg 이상에서만). 한 칸으로 접히면
           sticky 제목이 내용 위를 덮어 오히려 방해가 된다.
        ⚠️ 레일 폭을 더 키우지 말 것 — 카드가 4열에서 3열로 떨어지면서 글줄이 짧아진다.
      */}
      <Container>
        <div className="lg:grid lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-x-16">
          <div className="lg:sticky lg:top-28 lg:self-start lg:pt-1">
            <p className="flex items-center gap-2.5 text-[13.5px] font-black tracking-[0.2em] text-brand-500 uppercase">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              무엇이 다른가
            </p>
            {/*
              질문형 제목 + 즉답. 이 사이트가 전체적으로 쓰는 형식이다 —
              AI 검색이 "질문과 같은 제목 + 바로 뒤의 짧은 답" 을 찾아 인용한다.
            */}
            <h2 className="display-sm mt-4 text-[30px] text-ink sm:text-[38px]">
              동그라미치과는 무엇이 다른가요?
            </h2>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.85] text-ink-soft">
              {/* ⚠️ 숫자 앞에 {' '} 이 필요하다 — 없으면 JSX 가 줄바꿈을 삼켜 "것들을12가지" 로 붙는다(실측). */}
              누가 보는지, 무엇으로 보는지, 오시기 편한지 — 병원을 고를 때 실제로 궁금한 것들을{' '}
              {WHY_US_COUNT}가지로 정리했습니다.
            </p>
          </div>

          <div className="mt-14 space-y-12 lg:mt-0">
          {WHY_US.map((group, gi) => (
            <Reveal key={group.key} delay={gi * 45}>
              <div>
                {/* 갈래 머리 — 갈래 이름과 부제를 한 줄에. 얇은 선으로만 나눠 카드와 위계를 만든다. */}
                <div className="flex items-baseline gap-3 border-b border-brand-200/70 pb-3.5">
                  <span className="text-[14px] font-black tracking-[0.06em] text-gold-600">
                    {group.key}
                  </span>
                  <span aria-hidden className="text-ink-muted">·</span>
                  <span className="text-[14.5px] font-bold text-ink-muted">{group.label}</span>
                </div>

                {/*
                  ⚠️ 열 수는 **한 갈래의 카드 수(4장)에 맞춘다.** 왼쪽 레일이 생기면서
                     남는 폭이 줄었는데 3열로 두면 마지막 한 장이 혼자 다음 줄로 떨어진다
                     (실측에서 바로 드러났다). 2열이면 4장이 정확히 2×2 로 맞고
                     글줄도 길어져 읽기 편하다. 카드 수가 바뀌면 여기도 함께 볼 것.
                */}
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {group.cards.map((c, i) => (
                    <li
                      key={c.title}
                      className="group flex h-full flex-col rounded-xl border border-brand-200/70 card-glass p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
                    >
                      {/*
                        ★★ 원형 배지 (2026-08-18) ★★
                          참고 사이트(리베리의원)가 짙은 원 안에 흰 표시를 넣어 항목을 세는데,
                          우리는 병원 이름이 '동그라미'라 이 모티프가 오히려 더 명분이 있다
                          (globals.css 머리말: "원형 요소는 그대로 둔다 — 브랜드 모티프").
                        ★ 번호는 영문 세리프로 쓴다. 라틴 숫자만 있는 자리라 조건에 맞고,
                          본문 글꼴과 결이 달라 배지가 장식이 아니라 '표식'으로 읽힌다.
                      */}
                      <div className="flex items-center gap-2.5">
                        <span
                          aria-hidden
                          className="display-en inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[14px] text-white transition-colors group-hover:bg-gold-600"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-[13.5px] font-black tracking-[0.06em] text-brand-500">
                          {group.key}
                        </p>
                      </div>
                      <h3 className="display-sm mt-3.5 text-[17.5px] leading-snug text-ink">
                        {c.title}
                      </h3>
                      <p className="mt-3 flex-1 text-[15px] leading-[1.8] text-ink-soft"><Sentences text={c.body} /></p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
