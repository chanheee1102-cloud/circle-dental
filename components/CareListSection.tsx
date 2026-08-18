import Link from 'next/link';
import { TREATMENTS } from '@/lib/treatments';
import { Container, Sentences } from '@/components/ui';
import { Reveal } from '@/components/Reveal';

/**
 * 진료 영역 전체 목록 — 번호 + 이름 + 한 줄 요약 + '이런 경우' 칩 + 링크.
 *
 * ★★ 홈에서 /treatment 로 옮겼다 (2026-08-14 운영자: "이것도 서브페이지로") ★★
 *   홈에는 이미 사진 카드 네 장(PillarSection)이 '어떤 진료를 받을 수 있나요?' 에 답하고
 *   있었다. 그 아래에 열 줄짜리 목록을 또 두니 **같은 질문에 두 번 답하면서** 홈만
 *   길어졌다. 목록은 훑어서 자기 것을 찾는 도구라, 진료과목 페이지에 있는 편이 맞다.
 *   ⚠️ 홈에서 뺀 만큼 길은 남긴다 — PillarSection 아래에 '전체 진료과목' 링크를 두었다.
 *
 * ★ /treatment 의 카드 격자를 이 목록이 **대체한다** (중복 제거)
 *   카드에는 요약만 있었고 '이런 경우' 는 없었다. 목록 한 줄에 요약과 칩을 함께 담으면
 *   같은 자리에서 두 가지를 다 볼 수 있어 카드를 따로 둘 이유가 없어진다.
 *
 * ★ 칩에 무엇을 넣는가
 *   장비 이름이나 브랜드를 늘어놓지 않는다. 우리가 확인한 것은 **'이런 경우에 봅니다'**
 *   (treatments.whoFor) 이고, 환자가 자기 상황을 찾는 데도 그쪽이 실제로 쓸모 있다.
 *   ⚠️ 여기서 문구를 새로 만들지 않는다 — 전부 lib/treatments.ts 에서 온다.
 *
 * ★ 디자인은 우리 것으로
 *   번호를 크게 두되 **테두리만 있는 원**에 담아 브랜드 모티프(동그라미)와 잇는다.
 *   행 전체가 링크이고, 올리면 배경이 아주 옅게 깔리며 화살표가 움직인다.
 *
 * @param headless 페이지가 이미 자기 제목(h1)을 갖고 있을 때 섹션 제목을 생략한다.
 *                 제목이 둘이면 무엇이 이 페이지의 주제인지 기계가 판단하지 못한다.
 */
export function CareListSection({ headless = false }: { headless?: boolean } = {}) {
  const list = (
    <ul className="border-t border-brand-200/70">
      {TREATMENTS.map((t, i) => (
        <li key={t.slug} className="border-b border-brand-200/70">
          <Reveal delay={Math.min(i, 5) * 40}>
            <Link
              href={`/treatment/${t.slug}`}
              className="group grid items-start gap-x-6 gap-y-3 px-2 py-7 transition-colors hover:bg-brand-50/70 sm:px-4 lg:grid-cols-[auto_minmax(0,240px)_1fr_auto] lg:items-center"
            >
              {/* 번호 — 테두리 원. 병원 이름이 '동그라미'라 이 모티프를 계속 쓴다. */}
              <span
                aria-hidden
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-300 text-[14px] font-black tabular-nums text-brand-500 transition-colors group-hover:border-gold-500 group-hover:text-gold-600"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0">
                <h3 className="display-sm text-[19px] text-ink transition-colors group-hover:text-brand-700 sm:text-[21px]">
                  {t.name}
                </h3>
                {/*
                  이 진료 페이지에 답이 몇 개 적혀 있는지 — 카드 격자에 있던 값이다.
                  '읽을 것이 있다' 는 신호라 목록으로 옮길 때 함께 가져왔다.
                */}
                <p className="mt-1.5 text-[12.5px] font-bold tracking-wide text-brand-500 tabular-nums">
                  질문 {t.qa.length}개
                </p>
              </div>

              <div className="min-w-0">
                {/* 한 줄 요약 — 카드 격자가 보여 주던 값. 칩만으로는 무엇을 하는 치료인지 모른다. */}
                <p className="text-[14.5px] leading-[1.7] text-ink-soft">{t.summary}</p>

                {/* '이런 경우' — 셋까지만. 넷을 넘으면 줄이 두 줄이 되어 목록의 리듬이 깨진다. */}
                <ul className="mt-3 flex flex-wrap gap-2">
                  {t.whoFor.slice(0, 3).map((w) => (
                    <li
                      key={w}
                      className="rounded-full bg-brand-100/80 px-2.5 py-1 text-[12.5px] leading-snug text-ink-soft"
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              <span
                aria-hidden
                className="hidden text-[18px] text-brand-300 transition-all group-hover:translate-x-1 group-hover:text-gold-600 lg:inline"
              >
                →
              </span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );

  /*
    headless — 페이지가 이미 자기 제목과 Container 를 갖고 있는 경우.
    ⚠️ 여기서 Container 를 한 번 더 감싸면 좌우 여백이 두 겹으로 들어가 본문 폭이 어긋난다.
       (padding 을 px-0 으로 지우는 방법은 쓰지 않는다 — Tailwind 는 클래스 문자열 순서가
        아니라 CSS 파일 순서로 이기고 지므로 px-0 이 px-5 를 이긴다는 보장이 없다.)
  */
  if (headless) return list;

  return (
    <section className="py-24 lg:py-28">
      <Container>
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            진료 영역
          </p>
          <h2 className="display-sm mt-4 text-[30px] text-ink sm:text-[38px]">
            어떤 경우에 어떤 진료를 하나요?
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">
            <Sentences
              text={`${TREATMENTS.length}가지 진료 영역을 ‘이런 경우에 봅니다’ 기준으로 정리했습니다. 자기 상황과 가까운 줄을 눌러 보세요.`}
            />
          </p>
        </div>

        <div className="mt-14">{list}</div>
      </Container>
    </section>
  );
}
