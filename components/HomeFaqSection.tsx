import Link from 'next/link';
import { CLINIC_QA, HOME_FAQ_COUNT } from '@/lib/faq';
import { Container } from '@/components/ui';
import { Reveal } from '@/components/Reveal';

/**
 * 홈 화면의 자주 묻는 질문.
 *
 * ★ `<details>` 로 짠다 — 자바스크립트 없이 브라우저가 여닫는다.
 *   접힌 내용도 HTML 안에 그대로 있으므로 **크롤러와 AI 가 답까지 읽는다.**
 *   JS 로 만든 아코디언은 초기 HTML 에 답이 없어 그 자체로 인용되지 않는 경우가 많다.
 *   이 사이트의 다른 FAQ 도 같은 방식이라 형식이 갈라지지 않는다.
 *
 * ★ 앞의 여섯 개만 편다. 전부 펼치면 홈이 FAQ 페이지가 되고 `/faq` 로 갈 이유가 사라진다.
 *   자르는 개수는 lib/faq.ts 가 정한다 — 여기서 숫자를 만들지 않는다.
 *
 * ⚠️ FAQPage 스키마는 여기서 내지 않는다. `/faq` 가 이미 같은 문답으로 내고 있어서,
 *    두 URL 이 같은 Q&A 를 주장하면 검색엔진이 어느 쪽이 정본인지 못 고른다.
 *    홈에서는 사람이 읽을 수 있게만 보여 주고 구조화 데이터는 한 곳에서만 낸다.
 */
export function HomeFaqSection() {
  const items = CLINIC_QA.slice(0, HOME_FAQ_COUNT);

  return (
    <section className="py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          {/* 왼쪽 — 제목과 전체 보기. 오른쪽 목록이 길어도 이 열은 위에 붙어 따라온다. */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div>
            <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              FAQ
            </p>
            <h2 className="display-sm mt-4 text-[30px] text-ink sm:text-[36px]">
              자주 묻는 질문
            </h2>
            <p className="mt-5 text-[15.5px] leading-[1.85] text-ink-soft">
              내원 전 가장 많이 받는 질문 {items.length}가지입니다. 더 궁금한 것은 전체 페이지에서
              확인하실 수 있습니다.
            </p>
            <Link
              href="/faq"
              className="group mt-7 inline-flex items-center gap-2 border-b-[1.5px] border-brand-400 pb-1 text-[14.5px] font-bold text-brand-700 transition-colors hover:border-brand-700"
            >
              자주 묻는 질문 전체 보기{' '}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
          </Reveal>

          {/* 오른쪽 — 문답. 첫 항목만 열어 둔다: 여는 방법을 한 번 보여 주면 나머지도 눌린다. */}
          <div className="divide-y divide-brand-200/70 border-y border-brand-200/70">
            {items.map((qa, i) => (
              <Reveal key={qa.q} delay={Math.min(i, 5) * 50}>
              <details className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start gap-4 py-6 transition-colors hover:text-brand-700 [&::-webkit-details-marker]:hidden">
                  <span className="mt-0.5 shrink-0 text-[11.5px] font-black tracking-[0.14em] text-gold-600 uppercase">
                    Q {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-[16px] font-bold leading-snug text-ink transition-colors group-hover:text-brand-700 sm:text-[17px]">
                    {qa.q}
                  </span>
                  {/*
                    +/− 대신 회전하는 십자 하나로 둔다. 두 글리프를 갈아 끼우면
                    글꼴에 따라 폭이 달라져 줄이 흔들린다.
                  */}
                  <span
                    aria-hidden
                    className="relative mt-1 h-3.5 w-3.5 shrink-0 text-brand-400 transition-transform duration-300 group-open:rotate-45"
                  >
                    <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                    <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                  </span>
                </summary>
                <p className="max-w-[68ch] pr-8 pb-7 pl-[3.4rem] text-[15px] leading-[1.9] text-ink-soft">
                  {qa.a}
                </p>
              </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
