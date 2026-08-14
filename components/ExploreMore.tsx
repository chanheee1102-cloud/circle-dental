import Link from 'next/link';
import { SYMPTOMS } from '@/lib/symptoms';
import { CONDITIONS } from '@/lib/conditions';
import { TREATMENTS } from '@/lib/treatments';
import { WHY_US_COUNT } from '@/lib/whyUs';
import { Container } from '@/components/ui';
import { Reveal } from '@/components/Reveal';
import { headingId } from '@/components/article';

/**
 * 더 알아보기 — 홈에서 각 주제 페이지로 보내는 한 칸.
 *
 * ★★ 왜 이 컴포넌트가 생겼나 (2026-08-14 운영자) ★★
 *   홈이 15,000px 을 넘겼다. 망설임·근거 12가지·진료 10줄·증상·인사이트·둘러보기·절차를
 *   전부 홈에 세로로 쌓았기 때문이다. 홈을 짧게 하고 내용은 주제별 페이지로 옮겼다.
 *
 *   ⚠️ 그런데 **섹션을 지우면 그 페이지로 가는 길도 같이 사라진다.** 홈은 크롤러가 가장
 *      자주, 가장 먼저 읽는 문서라 여기서 링크가 끊기면 안쪽 페이지의 발견이 늦어진다.
 *      (사이트맵이 있어도 내부 링크가 있는 문서가 먼저·자주 크롤링된다.)
 *   → 그래서 옮긴 만큼을 **링크 한 칸으로 압축해서 남긴다.** 스크롤은 줄고 링크 그래프는
 *     그대로다.
 *
 * ★ 링크 글자에 '자세히 보기' 같은 빈 말을 쓰지 않는다. 무엇이 몇 개 있는지 숫자로 적으면
 *   사람은 갈지 말지 판단할 수 있고, 기계는 그 페이지가 무엇인지 링크 문맥으로 알 수 있다.
 * ★ 숫자는 전부 데이터에서 센다 — 항목이 늘면 화면이 저절로 따라온다.
 */
const CARDS = [
  {
    href: '/about/why',
    eyebrow: '왜 동그라미치과인가',
    title: '미루게 되는 이유와, 그에 대한 답',
    desc: `무섭고 비싸고 시간 없어서 미뤄 온 이유 여섯 가지에 각각 답했습니다. 근거 ${WHY_US_COUNT}가지를 의료진·장비·편의로 나눠 정리했습니다.`,
  },
  {
    href: '/treatment',
    eyebrow: '진료 영역',
    title: '어떤 경우에 어떤 진료를 하나요?',
    desc: `${TREATMENTS.length}가지 진료를 '이런 경우에 봅니다' 기준으로 정리했습니다. 시술명을 몰라도 자기 상황으로 찾을 수 있습니다.`,
  },
  {
    href: '/insight/symptom',
    eyebrow: '증상으로 찾기',
    title: '병명은 몰라도 됩니다',
    desc: `지금 느끼는 증상 ${SYMPTOMS.length}가지와 질환 ${CONDITIONS.length}가지를 원인·확인 방법과 함께 적었습니다.`,
  },
  {
    href: '/about/process',
    eyebrow: '첫 방문',
    title: '처음 오면 무엇을 하나요?',
    desc: '문진부터 계획 수립까지 다섯 단계와, 챙겨 오시면 좋은 것을 정리했습니다.',
  },
  {
    href: '/insight/cost',
    eyebrow: '비용',
    title: '건강보험이 되는 것과 안 되는 것',
    desc: '항목별로 보험 적용 여부와 무엇이 비용을 가르는지 표로 비교했습니다.',
  },
  {
    href: '/about/tour',
    eyebrow: '공간',
    title: '어떤 곳에서 진료하나요?',
    desc: '상담실·진료실·소독실 실제 사진 열두 장을 설명과 함께 뒀습니다.',
  },
];

export function ExploreMore() {
  return (
    <section className="border-y border-brand-200/60 bg-brand-50/40 py-24 lg:py-28">
      <Container>
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            더 알아보기
          </p>
          <h2
            id={headingId('무엇이 더 궁금하신가요')}
            className="display-sm mt-4 scroll-mt-28 text-[30px] text-ink sm:text-[38px]"
          >
            무엇이 더 궁금하신가요?
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">
            주제별로 따로 정리해 뒀습니다. 필요한 것만 눌러 보시면 됩니다.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <li key={c.href}>
              <Reveal delay={(i % 3) * 60} className="h-full">
                <Link
                  href={c.href}
                  className="group flex h-full flex-col rounded-2xl border border-brand-200/70 bg-white p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="text-[11.5px] font-black tracking-[0.14em] text-brand-500 uppercase">
                    {c.eyebrow}
                  </span>
                  <span className="display-sm mt-3 text-[19px] leading-snug text-ink transition-colors group-hover:text-brand-700">
                    {c.title}
                  </span>
                  <span className="mt-3 flex-1 text-[14px] leading-[1.75] text-ink-soft">
                    {c.desc}
                  </span>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-black text-brand-700">
                    보러 가기
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
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
