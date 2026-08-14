import { WHY_US, WHY_US_COUNT } from '@/lib/whyUs';
import { Container } from '@/components/ui';
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
    <section className="border-y border-brand-200/60 bg-cream-deep/40 py-24 lg:py-28">
      <Container>
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
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
          <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">
            {/* ⚠️ 숫자 앞에 {' '} 이 필요하다 — 없으면 JSX 가 줄바꿈을 삼켜 "것들을12가지" 로 붙는다(실측). */}
            누가 보는지, 무엇으로 보는지, 오시기 편한지 — 병원을 고를 때 실제로 궁금한 것들을{' '}
            {WHY_US_COUNT}가지로 정리했습니다.
          </p>
        </div>

        <div className="mt-14 space-y-12">
          {WHY_US.map((group, gi) => (
            <Reveal key={group.key} delay={gi * 80}>
              <div>
                {/* 갈래 머리 — 갈래 이름과 부제를 한 줄에. 얇은 선으로만 나눠 카드와 위계를 만든다. */}
                <div className="flex items-baseline gap-3 border-b border-brand-200/70 pb-3.5">
                  <span className="text-[13px] font-black tracking-[0.06em] text-gold-600">
                    {group.key}
                  </span>
                  <span aria-hidden className="text-brand-300">·</span>
                  <span className="text-[13.5px] font-bold text-ink-muted">{group.label}</span>
                </div>

                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {group.cards.map((c, i) => (
                    <li
                      key={c.title}
                      className="group flex h-full flex-col rounded-xl border border-brand-200/70 bg-white p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
                    >
                      <p className="text-[11px] font-black tracking-[0.06em] text-brand-400">
                        {group.key} {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3 className="display-sm mt-3 text-[16.5px] leading-snug text-ink">
                        {c.title}
                      </h3>
                      <p className="mt-3 flex-1 text-[14px] leading-[1.8] text-ink-soft">{c.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
