import Link from 'next/link';
import { FIRST_VISIT_FLOW } from '@/lib/firstVisit';
import { Container, Sentences } from '@/components/ui';
import { Reveal } from '@/components/Reveal';
import { headingId } from '@/components/article';

/**
 * 진행 절차 — 홈에 두는 요약.
 *
 * ★★ 왜 홈에도 두나 ★★
 *   "어떻게 진행하나요" 는 결심 직전에 나오는 질문이다. 그런데 이 답이 `/about/process`
 *   에만 있어서, 홈만 보고 판단하는 사람에게는 **없는 것과 같았다**(외부 진단:
 *   "진행 절차 안내 없음 — AI 인용 불가").
 *
 * ★ 절차 문구는 lib/firstVisit.ts 한 곳에서 온다. 홈과 상세 페이지, 그리고 HowTo
 *   구조화 데이터가 전부 같은 배열을 읽으므로 어긋날 수 없다.
 * ★ 화면에 보이는 단계와 마크업된 단계가 같아야 한다 — 안 보이는 절차를 HowTo 로
 *   내면 구조화 데이터 정책 위반이다.
 */
export function ProcessSection() {
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            진행 절차
          </p>
          <h2
            id={headingId('처음 오시면 어떻게 진행하나요')}
            className="display-sm mt-4 scroll-mt-28 text-[30px] text-ink sm:text-[38px]"
          >
            처음 오시면 어떻게 진행하나요?
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">
            <Sentences text="문진 → 촬영 → 검사 → 설명 순으로 진행합니다. 통증이나 감염처럼 급한 상황이면 그날 응급 처치를 먼저 하고, 급하지 않으면 계획을 세운 뒤 다음 방문부터 치료를 시작합니다." />
          </p>
        </Reveal>

        {/*
          가로 다섯 칸 — 세로로 쌓으면 '길다' 는 인상이 먼저 와서 절차가 부담스러워 보인다.
          가로로 두면 다섯 단계가 한눈에 들어와 오히려 짧게 느껴진다.
        */}
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FIRST_VISIT_FLOW.map((f, i) => (
            <li key={f.t}>
              <Reveal delay={i * 60} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-brand-200/70 bg-white p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]">
                  <span
                    aria-hidden
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-300 text-[13px] font-black tabular-nums text-brand-500"
                  >
                    {f.n}
                  </span>
                  <h3 className="mt-4 text-[16.5px] font-black text-ink">{f.t}</h3>
                  <p className="mt-2.5 text-[14px] leading-[1.75] text-ink-soft">{f.d}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Link
          href="/about/process"
          className="group mt-10 inline-flex items-center gap-2 border-b-[1.5px] border-brand-400 pb-1 text-[14.5px] font-bold text-brand-700 transition-colors hover:border-brand-700"
        >
          챙길 것과 자주 묻는 질문까지 보기{' '}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Container>
    </section>
  );
}
