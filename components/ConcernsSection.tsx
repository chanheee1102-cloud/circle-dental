import { Sentences } from '@/components/ui';
import { Reveal } from '@/components/Reveal';
import { ConcernPhone } from '@/components/ConcernPhone';

/**
 * '이런 마음으로 미뤄오셨다면' — 망설임에서 시작하는 입구.
 *
 * ★ 진료 목록과 반대 방향의 입구다
 *   위쪽 목록은 '무엇을 치료할지 아는 사람' 을 위한 것이고, 여기는 **아직 모르는 사람**
 *   — 무서워서, 바가지 쓸까 봐, 시간이 없어서 미뤄 온 사람 — 을 위한 자리다.
 *   치과를 미루는 이유는 대개 치료 자체가 아니라 망설임이다.
 *
 * ★★ 이 섹션은 네 번 갈아엎였다. 손대기 전에 순서를 볼 것 ★★
 *   2026-08-18  카드 3×2 격자에서 장식(강조 세로선·따옴표 글리프·강조색 화살표)만 걷어냄
 *               → "클로드 느낌 조금 줄여줘" 는 해결됐다고 봤는데 아니었다.
 *   2026-08-25 ① "여기 클로드 느낌나는데"
 *               → 원인은 장식이 아니라 **골격**이었다. 똑같은 상자 여섯 개가 격자로
 *                 앉아 있는 것 자체가 그 인상을 만든다. 세로 대화로 바꿈.
 *              ② "잘 안보이고 좀 왼쪽으로 치우친 느낌? 너무 스크롤 길어"
 *               → 세로 대화가 2,080px 로 불었다. 가로로 넘기는 줄기로 바꿈.
 *              ③ "너무 별로야 … 애플디자이너처럼 멋있게"
 *               → 흰 말풍선 + 스크롤이 모는 가운데 확대로 바꿈.
 *              ④ "이거 그냥 아이폰 UI 넣어서 좀 카톡 배경으로 할까? 그리고 대답도 좀
 *                 친절한 원장 느낌으로"  ← **지금**
 *
 * ★★ ①~③ 이 전부 실패한 이유 (다음 사람이 같은 데를 돌지 않도록) ★★
 *   셋 다 **여섯 덩어리를 어떻게 늘어놓을까** 의 문제였다. 늘어놓는 한 격자든 줄기든
 *   '반복되는 카드' 인상에서 못 벗어난다. 기기 화면 하나에 담으니 여섯이 한 덩어리의
 *   대화가 되면서 셀 것이 없어졌다. 판단의 자세한 근거는
 *   **components/ConcernPhone.tsx** 머리말에 있다(카카오톡을 베끼지 않은 이유 포함).
 *
 * ★★ 어두운 면은 네 번 내내 지켰다 ★★
 *   한 번 밝은 면으로 바꿔 봤다가 운영자 판단으로 되돌렸다. 앞뒤가 전부 흰 면이라
 *   여기가 어두워야 스크롤에 마디가 생긴다 — 원래 이유가 맞았다.
 *
 * ⚠️ 문구는 전부 lib/concerns.ts 에서 온다. 여기서 문장을 만들지 않는다 —
 *    "안 아프게 해 드립니다" 같은 효과 단정은 의료광고법이 금지하고 지킬 수도 없다.
 *    말투 규칙(친절한 원장 느낌 · 사실은 불변)도 그 파일 머리말에 있다.
 *
 * ⚠️⚠️ 아래 section 에 overflow-hidden 을 다시 넣지 말 것 ⚠️⚠️
 *    ConcernPhone 안쪽이 position:sticky 다. **조상 아무 곳에나 overflow 가 있으면
 *    sticky 는 그 요소를 기준으로 잡혀 사실상 죽는다.** 여기 overflow-hidden 이
 *    있던 동안 제목이 고정 구간 끝에서 화면 밖 -1058px 로 나가 있었다(실측).
 *    배경 동그라미를 가두는 일은 아래 절대배치 div 가 대신한다.
 * ⚠️ 세로 여백도 section 에 두지 않는다 — 고정일 때는 h-screen 이 높이를 정하고,
 *    아닐 때는 ConcernPhone 이 py 를 준다.
 */
export function ConcernsSection() {
  /* 제목은 어절 단위로 끊어 차례로 올린다. 문장은 아래 한 곳에서만 온다. */
  const words = '이런 마음으로 미뤄오셨다면'.split(' ');

  return (
    /*
     * ⚠️ 여기는 화면 폭 그대로 둔다 — ConcernPhone 이 sticky + h-screen 으로 한 장면을
     *    통째로 쓰기 때문에 안으로 들이면 그 고정이 깨진다. 색만 dusk 로 맞춘다.
     */
    <section className="relative bg-wine-deep text-parchment">
      {/*
        ★ 배경의 큰 동그라미 셋 — 병원 이름이 '동그라미' 다.
          어두운 면을 그냥 두면 평평한 검은 판인데, 여기에 흔한 보라·파랑 그라데이션 얼룩을
          깔면 그거야말로 어디서나 보는 화면이 된다. 대신 **브랜드의 모티프**를 아주 옅게
          띄우고 느리게 움직인다. 이 병원에서만 성립하는 배경이다.
        ⚠️ 선 두께 1px · 흰색 4% 를 넘기지 말 것. 글자 뒤에서 무늬가 읽히기 시작하면
           그때부터는 배경이 아니라 방해다.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="drift absolute -top-24 -left-20 h-[420px] w-[420px] rounded-full border border-white/[0.05]" />
        <span className="drift drift-slow absolute top-1/3 -right-32 h-[560px] w-[560px] rounded-full border border-white/[0.04]" />
        <span className="drift drift-late absolute -bottom-28 left-1/3 h-[300px] w-[300px] rounded-full border border-white/[0.055]" />
      </div>

      <ConcernPhone
        heading={
          <Reveal className="reveal-plain relative max-w-xl lg:max-w-[38rem]">
          {/* ⚠️ 영문 대문자 눈썹을 되살리지 말 것 — 한글에는 대문자가 없다(components/home.tsx 주석). */}
          <p className="eyebrow-chip text-mist">망설임</p>
          {/*
            ★ 이 섹션의 제목만 다른 섹션보다 크다. 여기는 화면에 고정돼 한 장면을
              통째로 쓰는 자리라 다른 섹션과 같은 크기면 왼쪽이 비어 보인다.
              (기기와의 거리를 좁히는 일도 겸한다 — ConcernPhone 의 격자 폭 주석 참고)
          */}
          <h2 className="display-ko mt-5 text-[clamp(30px,4.8vw,50px)] text-parchment">
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
          <p className="mt-6 text-[18px] leading-[1.9] text-parchment">
            <Sentences text="치과를 미루는 이유는 대개 치료가 아니라 망설임입니다. 자주 듣는 이야기와 저희가 하는 일을 정리했습니다." />
          </p>
          </Reveal>
        }
      />
    </section>
  );
}
