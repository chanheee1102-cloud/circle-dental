import Link from 'next/link';
import { CLINIC_QA, HOME_FAQ_COUNT } from '@/lib/faq';
import { Container } from '@/components/ui';
import { HomeHead, QuietLink } from '@/components/home';
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
    /* ⚠️ 한 칸 내려앉은 면 — 앞(시설)·뒤(진료시간)가 캔버스라 여기서 톤이 바뀌어야
       구획이 바뀐 것이 보인다. 홈의 면 차례는 globals.css .home-flow 주석에 있다. */
    <section className="bg-wine-soft py-24 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          {/* 왼쪽 — 제목과 전체 보기. 오른쪽 목록이 길어도 이 열은 위에 붙어 따라온다. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
          <div>
            <HomeHead
              label="자주 묻는 질문"
              title="자주 묻는 질문"
              desc={`내원 전 가장 많이 받는 질문 ${items.length}가지입니다. 더 궁금한 것은 전체 페이지에서 확인하실 수 있습니다.`}
            />
            {/*
              ★ 절차 링크를 여기 둔다 — 홈에서 절차 섹션을 뺐으니 그리로 가는 길이 있어야 한다.
                이 자리가 맞는 이유는 "궁금한 것" 을 다루는 섹션이라 "처음 가면 뭐 하나요" 가
                같은 갈래이기 때문이다.
            */}
            <div className="mt-7 flex flex-col gap-3">
              <QuietLink href="/faq">자주 묻는 질문 전체 보기</QuietLink>
              <QuietLink href="/about/process">처음 오시면 어떻게 진행하나요?</QuietLink>
            </div>
          </div>
          </div>

          {/*
            오른쪽 — 문답. **전부 닫힌 채로 시작한다** (2026-08-18 운영자).
            첫 항목을 열어 두면 '여는 방법을 보여 준다' 는 뜻이었는데, 실제로는 첫 답이
            펼쳐진 채라 목록이 한눈에 안 들어온다. 질문 여섯 줄이 나란히 보이는 편이
            '내 질문이 여기 있나' 를 훑기에 낫다.
            ⚠️ 접혀 있어도 답은 DOM 에 그대로 있다 — details 는 내용을 지우지 않는다.
               FAQ 스키마와 화면이 어긋나지 않는 이유다.
          */}
          <div className="divide-y divide-wine-line border-y border-wine-line">
            {items.map((qa, i) => (
              <Reveal key={qa.q} delay={Math.min(i, 5) * 30}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start gap-4 py-6 [&::-webkit-details-marker]:hidden">
                  {/* ⚠️ 'Q 01' 의 Q 를 뺐다 — 한국어 목록에 영문 머리글자는 장식일 뿐이다. */}
                  <span className="mt-0.5 shrink-0 text-[15px] font-medium tabular-nums text-ash">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-[17.5px] font-medium leading-snug text-charcoal transition-colors group-hover:text-ash sm:text-[19px]">
                    {qa.q}
                  </span>
                  {/*
                    +/− 대신 회전하는 십자 하나로 둔다. 두 글리프를 갈아 끼우면
                    글꼴에 따라 폭이 달라져 줄이 흔들린다.
                  */}
                  <span
                    aria-hidden
                    className="relative mt-1 h-3.5 w-3.5 shrink-0 text-clay-600 transition-transform duration-300 group-open:rotate-45"
                  >
                    <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                    <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                  </span>
                </summary>
                {/* ⚠️ 폭 제한은 ch 가 아니라 em 이다 — ch 는 숫자 0 의 폭이라 한글에서 약 0.68배로 좁아진다. */}
                <p className="max-w-[48em] pr-8 pb-7 pl-[2.9rem] text-[17.5px] leading-[1.9] text-ash">
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
