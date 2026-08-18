import { CONCERNS } from '@/lib/concerns';
import { Container, Sentences } from '@/components/ui';
import { Reveal } from '@/components/Reveal';
import { ConcernCard } from '@/components/ConcernCard';

/**
 * '이런 고민, 하고 계셨나요' — 망설임에서 시작하는 입구.
 *
 * ★ 진료 목록과 반대 방향의 입구다
 *   위쪽 목록은 '무엇을 치료할지 아는 사람' 을 위한 것이고, 여기는 **아직 모르는 사람**
 *   — 무서워서, 바가지 쓸까 봐, 시간이 없어서 미뤄 온 사람 — 을 위한 자리다.
 *   치과를 미루는 이유는 대개 치료 자체가 아니라 망설임이다.
 *
 * ★★ 어두운 면은 그대로, 상투적인 장식만 걷어냈다 (2026-08-18 운영자) ★★
 *   운영자: "클로드 느낌 조금 줄여줘." 정확한 지적이었는데, **어두운 면 자체가 문제는
 *   아니었다.** 문제는 그 위에 얹힌 세 가지였다:
 *     ① 둥근 카드 **왼쪽에 세운 강조 세로선**
 *     ② 카드마다 크게 세운 따옴표 장식 글리프
 *     ③ 강조색으로 칠한 '→' 링크 글자 — 여섯 장에서 여섯 번 반복
 *   셋 다 걷어냈다. 카드는 테두리도 강조선도 없는 무지 면이고, 밝기 차이로만 구분한다.
 *   (한 번 밝은 면으로 바꿔 봤다가 운영자 판단으로 어두운 면으로 되돌렸다.
 *    앞뒤가 전부 흰 면이라 여기가 어두워야 스크롤에 마디가 생긴다 — 원래 이유가 맞았다.)
 *
 * ★ 참고 화면(운영자 제공)에는 카드마다 원형 사진이 있었지만 **넣지 않았다.**
 *   고민 여섯 개에 대응하는 사진이 우리에게 없다. 진료실 사진을 '비용이 걱정된다' 옆에
 *   아무렇게나 붙이면 장식조차 못 되고 문맥만 흐린다. 사진은 생기면 그때 넣는다.
 *
 * ⚠️ 문구는 전부 lib/concerns.ts 에서 온다. 여기서 문장을 만들지 않는다 —
 *    "안 아프게 해 드립니다" 같은 효과 단정은 의료광고법이 금지하고 지킬 수도 없다.
 */
export function ConcernsSection() {
  /* 제목은 어절 단위로 끊어 차례로 올린다. 문장은 아래 한 곳에서만 온다. */
  const words = '이런 마음으로 미뤄오셨다면'.split(' ');

  return (
    <section className="relative overflow-hidden bg-brand-900 py-24 text-white lg:py-28">
      {/*
        ★ 배경의 큰 동그라미 셋 — 병원 이름이 '동그라미' 다.
          어두운 면을 그냥 두면 평평한 검은 판인데, 여기에 흔한 보라·파랑 그라데이션 얼룩을
          깔면 그거야말로 어디서나 보는 화면이 된다. 대신 **브랜드의 모티프**를 아주 옅게
          띄우고 느리게 움직인다. 이 병원에서만 성립하는 배경이다.
        ⚠️ 선 두께 1px · 흰색 4% 를 넘기지 말 것. 글자 뒤에서 무늬가 읽히기 시작하면
           그때부터는 배경이 아니라 방해다.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="drift absolute -top-24 -left-20 h-[420px] w-[420px] rounded-full border border-white/[0.05]" />
        <span className="drift drift-slow absolute top-1/3 -right-32 h-[560px] w-[560px] rounded-full border border-white/[0.04]" />
        <span className="drift drift-late absolute -bottom-28 left-1/3 h-[300px] w-[300px] rounded-full border border-white/[0.055]" />
      </div>

      <Container>
        <Reveal className="reveal-plain relative max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-gold-400 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            망설임
          </p>
          <h2 className="display-sm mt-4 text-[30px] text-white sm:text-[38px]">
            {words.map((w, i) => (
              /*
               * 어절마다 가면(overflow:hidden)을 씌우고 그 안에서 밀어 올린다.
               * ⚠️ 어절 사이 공백은 가면 **바깥**에 둔다. 안에 넣으면 inline-block 이
               *    끝 공백을 먹어 "이런마음으로미뤄오셨다면" 이 된다.
               */
              <span key={w}>
                <span className="word-mask">
                  <span style={{ transitionDelay: `${i * 110}ms` }}>{w}</span>
                </span>
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-brand-200/85">
            <Sentences text="치과를 미루는 이유는 대개 치료가 아니라 망설임입니다. 자주 듣는 이야기와 저희가 하는 일을 정리했습니다." />
          </p>
        </Reveal>

        <ul className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CONCERNS.map((c, i) => (
            <ConcernCard key={c.quote} concern={c} order={i} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
