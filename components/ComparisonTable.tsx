import type { ComparisonTable as Data } from '@/lib/comparisons';
import { Sentences } from '@/components/ui';

/**
 * 비교표 렌더러.
 *
 * ★ 표는 접근성 요구가 많은 요소다. 여기서 지키는 것:
 *   `<caption>` 으로 무슨 표인지 밝히고, 머리 칸은 `<th scope>` 로 방향을 준다.
 *   스크린리더는 이 둘이 있어야 "행: 옆 치아를 깎나요, 열: 브릿지, 값: 양옆 치아를 깎습니다"
 *   처럼 읽는다. 없으면 숫자와 낱말이 순서 없이 쏟아진다.
 * ★ 좁은 화면에서 표는 반드시 넘친다. 감싼 div 안에서만 가로 스크롤되게 한다 —
 *   페이지 본문이 통째로 가로 스크롤되면 그건 고장으로 보인다.
 * ★ 첫 열(비교 기준)을 고정하지 않는다. sticky 로 붙이면 좁은 화면에서 값 칸이
 *   더 좁아져 글자가 세로로 쪼개진다.
 */
export function ComparisonTable({ data }: { data: Data }) {
  return (
    <section aria-labelledby={data.id} className="reveal scroll-mt-28">
      <h2 id={data.id} className="display-sm scroll-mt-28 text-[22px] text-ink sm:text-[26px]">
        {data.title}
      </h2>
      <p className="mt-3 max-w-[64ch] text-[16.5px] leading-[1.8] text-ink-soft"><Sentences text={data.lead} /></p>

      <div className="mt-7 overflow-x-auto rounded-2xl border border-brand-200/70">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">{data.title}</caption>
          <thead>
            <tr className="bg-brand-50/70">
              <th scope="col" className="px-6 py-4 text-[14px] font-black text-ink-muted">
                비교 기준
              </th>
              {data.columns.map((c) => (
                <th key={c} scope="col" className="px-6 py-4 text-[15.5px] font-black text-ink">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.label} className="border-t border-brand-100">
                <th
                  scope="row"
                  className="bg-parchment px-6 py-4 align-top text-[15px] font-bold text-ink-soft"
                >
                  {r.label}
                </th>
                {r.cells.map((cell, i) => (
                  <td
                    key={`${r.label}-${i}`}
                    className="px-6 py-4 align-top text-[15.5px] leading-relaxed text-ink"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ⚠️ 이 줄을 빼지 말 것 — 표는 차이를 보여 주는 것이지 판단을 대신하지 않는다. */}
      <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-ink-muted"><Sentences text={data.note} /></p>
    </section>
  );
}
