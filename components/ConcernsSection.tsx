import Link from 'next/link';
import { CONCERNS } from '@/lib/concerns';
import { Container, Sentences } from '@/components/ui';
import { Reveal } from '@/components/Reveal';

/**
 * '이런 고민, 하고 계셨나요' — 망설임에서 시작하는 입구.
 *
 * ★ 진료 목록과 반대 방향의 입구다
 *   위쪽 목록은 '무엇을 치료할지 아는 사람' 을 위한 것이고, 여기는 **아직 모르는 사람**
 *   — 무서워서, 바가지 쓸까 봐, 시간이 없어서 미뤄 온 사람 — 을 위한 자리다.
 *   치과를 미루는 이유는 대개 치료 자체가 아니라 망설임이다.
 *
 * ★ 디자인은 우리 것으로
 *   따옴표를 큰 장식 글리프로 세우고 왼쪽에 세로 강조선을 둔다. 카드 여섯 장을
 *   똑같이 늘어놓는 대신, 어두운 면 위에 흰 카드를 얹어 앞뒤 섹션과 무게를 다르게 한다.
 *   (앞 섹션이 흰 배경 목록이라 여기까지 희면 스크롤이 평평해진다.)
 *
 * ⚠️ 문구는 전부 lib/concerns.ts 에서 온다. 여기서 문장을 만들지 않는다 —
 *    "안 아프게 해 드립니다" 같은 효과 단정은 의료광고법이 금지하고 지킬 수도 없다.
 */
export function ConcernsSection() {
  return (
    <section className="bg-brand-900 py-24 text-white lg:py-28">
      <Container>
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-gold-400 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            망설임
          </p>
          <h2 className="display-sm mt-4 text-[30px] text-white sm:text-[38px]">
            이런 마음으로 미뤄오셨다면
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-brand-200/85">
            <Sentences text="치과를 미루는 이유는 대개 치료가 아니라 망설임입니다. 자주 듣는 이야기와 저희가 하는 일을 정리했습니다." />
          </p>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CONCERNS.map((c, i) => (
            <li key={c.quote} className="h-full">
              <Reveal delay={Math.min(i, 5) * 60} className="h-full">
                <Link
                  href={c.href}
                  className="group flex h-full flex-col rounded-xl border-l-[3px] border-gold-500 bg-white/[0.06] p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/[0.11]"
                >
                  {/* 따옴표는 장식이다 — 스크린리더가 읽으면 문장이 끊긴다. */}
                  <span
                    aria-hidden
                    className="display -mb-3 block text-[38px] leading-none text-gold-400/50"
                  >
                    &ldquo;
                  </span>
                  <p className="text-[16.5px] font-bold leading-snug text-white">{c.quote}</p>
                  <p className="mt-4 flex-1 text-[14.5px] leading-[1.8] text-brand-200/85">
                    {c.answer}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[13.5px] font-black text-gold-400">
                    {c.cta}
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
