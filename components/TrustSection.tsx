import Link from 'next/link';
import { TRUST_STATS, CREDENTIAL_ROWS, MEDIA_APPEARANCES, ACCESS_FACTS } from '@/lib/trustSignals';
import { PUBLICATION_DETAIL } from '@/lib/doctors';
import { Container, Sentences } from '@/components/ui';
import { Reveal } from '@/components/Reveal';
import { headingId } from '@/components/article';

/**
 * 신뢰 지표 — 숫자 · 인증표 · 언론.
 *
 * ★★ 왜 한 자리에 모으나 ★★
 *   자격도 인증패도 논문도 방송도 원래 이 사이트에 다 있었다. 그런데 **흩어져 있어서
 *   세어지지 않았다.** 답변 엔진은 "전문의 3명, 인증 4건, 논문 1편" 처럼 셀 수 있는 것을
 *   인용하지, 여러 페이지에 흩어진 인상을 인용하지 않는다.
 *
 * ⚠️⚠️ 여기에 환자 후기·별점·치료 전후 사진을 넣지 말 것 ⚠️⚠️
 *   의료법 제56조 제2항이 **치료경험담 광고를 금지**한다. 일반 업종의 '고객 후기' 를
 *   그대로 옮기면 그 자체가 위법이다. 의료에서 쓸 수 있는 신뢰 지표는
 *   **자격 · 학회 · 논문 · 언론** 쪽이고, 이 섹션은 그것만 다룬다.
 *
 * ★ 숫자는 전부 저장소 데이터를 센 값이다(lib/trustSignals.ts). 손으로 적은 값이 없어
 *   원장이 늘거나 인증이 추가되면 화면이 저절로 따라온다.
 */
export function TrustSection({ headless = false }: { headless?: boolean }) {
  return (
    <section className={headless ? 'pb-20' : 'border-y border-brand-200/60 bg-white py-24 lg:py-28'}>
      <Container>
        {/*
          ★ headless — 전용 페이지(/about/trust)는 이미 h1 으로 같은 질문을 걸어 두었다.
            여기서 h2 로 한 번 더 쓰면 같은 문장이 화면에 두 번 나오고 헤딩 구조도 흐려진다.
        */}
        {!headless && (
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            근거
          </p>
          <h2
            id={headingId('무엇을 근거로 믿을 수 있나요')}
            className="display-sm mt-4 scroll-mt-28 text-[30px] text-ink sm:text-[38px]"
          >
            무엇을 근거로 믿을 수 있나요?
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">
            <Sentences text="병원이 스스로 좋다고 말하는 것은 근거가 아닙니다. 아래는 제3자가 준 자격과 인증, 학술지에 실린 논문, 방송에 나간 기록입니다. 실물 사진은 의료진 페이지에 있습니다." />
          </p>
        </Reveal>
        )}

        {/* ── 숫자 ── */}
        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-brand-200/70 bg-brand-200/70 lg:grid-cols-3">
          {TRUST_STATS.map((s, i) => (
            <div key={s.label} className="bg-white px-6 py-7">
              <Reveal delay={(i % 3) * 60}>
                <dt className="text-[13px] leading-snug font-bold text-ink-muted">{s.label}</dt>
                <dd className="display mt-2.5 text-[30px] tracking-[-0.01em] text-brand-700 sm:text-[34px]">
                  {s.value}
                </dd>
              </Reveal>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.35fr_1fr]">
          {/*
            ⚠️ min-w-0 을 반드시 둔다 — 그리드 자식은 기본이 `min-width: auto` 라
               내용의 최소 폭 아래로 줄지 않는다. 이 칸 안의 min-w-[520px] 표 때문에
               390px 화면에서 **문서 전체가 153px 가로 스크롤**됐다(실측).
               넘친 것은 표가 아니라 표를 담은 칸이었다.
          */}
          <div className="min-w-0">
            <h3
              id={headingId('인증과 자격은 어디서 받았나요')}
              className="scroll-mt-28 text-[19px] font-black text-ink"
            >
              인증과 자격은 어디서 받았나요?
            </h3>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
              발급처를 함께 적었습니다. &lsquo;수료증 4건&rsquo;은 인상이지만 &lsquo;세계근관치료학회가 준
              수료증&rsquo;은 확인할 수 있는 사실입니다.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-brand-200/70">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <caption className="sr-only">동그라미치과의원 의료진의 인증·자격과 발급처</caption>
                <thead>
                  <tr className="bg-brand-50/70">
                    <th scope="col" className="px-5 py-3.5 text-[12.5px] font-black text-ink">
                      항목
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-[12.5px] font-black text-ink">
                      발급처
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-[12.5px] font-black text-ink">
                      구분
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CREDENTIAL_ROWS.map((c) => (
                    <tr key={c.name} className="border-t border-brand-100">
                      <th
                        scope="row"
                        className="px-5 py-3.5 align-top text-[14px] font-bold text-ink"
                      >
                        {c.name}
                      </th>
                      <td className="px-5 py-3.5 align-top text-[14px] text-ink-soft">{c.issuer}</td>
                      <td className="px-5 py-3.5 align-top text-[13px] whitespace-nowrap text-ink-muted">{c.kind}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 논문 · 언론 · 접근성 ── */}
          <div className="min-w-0 space-y-8">
            <div>
              <h3
                id={headingId('학술 활동이 있나요')}
                className="scroll-mt-28 text-[19px] font-black text-ink"
              >
                학술 활동이 있나요?
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                대표원장이 공저자로 참여한 논문이 국제 학술지에 실려 있습니다.
              </p>
              <p className="mt-3 rounded-xl border border-brand-200/70 bg-brand-50/50 p-4 text-[13.5px] leading-relaxed text-ink">
                {PUBLICATION_DETAIL.title}
                <span className="mt-1.5 block text-[12.5px] text-ink-muted">
                  {PUBLICATION_DETAIL.authors}
                </span>
              </p>
            </div>

            {MEDIA_APPEARANCES.length > 0 && (
              <div>
                <h3
                  id={headingId('방송에 나온 적이 있나요')}
                  className="scroll-mt-28 text-[19px] font-black text-ink"
                >
                  방송에 나온 적이 있나요?
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {MEDIA_APPEARANCES.map((m) => (
                    <li
                      key={m.program}
                      className="text-[14.5px] leading-relaxed text-ink-soft"
                    >
                      <span className="font-black text-ink">{m.outlet}</span> {m.program} —{' '}
                      {m.what}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {ACCESS_FACTS.length > 0 && (
              <div>
                <h3
                  id={headingId('언제 갈 수 있나요')}
                  className="scroll-mt-28 text-[19px] font-black text-ink"
                >
                  언제 갈 수 있나요?
                </h3>
                <dl className="mt-3 space-y-2">
                  {ACCESS_FACTS.map((f) => (
                    <div key={f.label} className="flex gap-3 text-[14.5px] leading-relaxed">
                      <dt className="shrink-0 font-bold text-ink-muted">{f.label}</dt>
                      <dd className="text-ink-soft">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        <Link
          href="/about/doctors"
          className="group mt-12 inline-flex items-center gap-2 border-b-[1.5px] border-brand-400 pb-1 text-[14.5px] font-bold text-brand-700 transition-colors hover:border-brand-700"
        >
          인증패 · 논문 실물 사진 보기{' '}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Container>
    </section>
  );
}
