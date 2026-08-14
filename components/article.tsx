import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';
import { DOCTORS } from '@/lib/doctors';
import { contentDates, formatKoreanDate } from '@/lib/contentMeta';

/**
 * 본문형 문서에 공통으로 붙는 조각들 — 요약 / 목차 / 저자·수정일 / 참고자료.
 *
 * ★★ 왜 이 넷인가 ★★
 *   검색엔진과 답변 엔진이 "이 글을 믿고 인용할지" 판단할 때 보는 것이 정확히 이 넷이다.
 *     요약    문서 맨 앞에서 결론을 먼저 준다 → 답변에 그대로 인용되는 자리
 *     목차    H2·H3 에 id 를 달고 앵커로 잇는다 → 특정 구간을 직접 인용·링크할 수 있게
 *     저자    누가 썼고 누가 검토했나 + 언제 기준인가 → 의료 정보의 두 축(E-E-A-T)
 *     참고    통계·법령의 원 출처 → 주장에 근거가 붙는다
 *
 * ★ 화면 구성은 최소한으로 둔다. 운영자 지침은 "디자인 틀을 크게 바꾸지 말 것" 이라,
 *   전부 본문 흐름 안에 조용히 얹히는 형태로만 만든다.
 */

/**
 * 문장 앞부분만 잘라 요약 한 줄로 만든다.
 *
 * ★ 요약을 사람이 따로 쓰지 않는 이유 — 새로 쓰는 순간 본문에 없는 말이 섞일 수 있다.
 *   우리 문답은 애초에 **첫 문장에서 답이 끝나도록** 쓰여 있으므로(lib/treatments.ts 주석),
 *   그 첫 문장을 그대로 뽑으면 지어내지 않으면서 요약이 된다.
 * ★ 마침표 뒤가 소수점·약어가 아닌 경우에만 문장 끝으로 본다.
 */
export function firstSentence(text: string, maxLen = 110) {
  const m = text.match(/^[\s\S]*?[.!?](?=\s|$)/);
  const s = (m ? m[0] : text).trim();
  return s.length > maxLen ? `${s.slice(0, maxLen - 1).trimEnd()}…` : s;
}

/**
 * 공백을 뺀 글자수 — Article 스키마의 wordCount 에 쓴다.
 *
 * ★ 영어권 기준의 '단어 수' 는 한국어에서 의미가 없다(띄어쓰기 단위가 다르다).
 *   문서 깊이를 나타내는 값으로는 공백 제외 글자수가 실제에 가깝다.
 */
export function charCount(...parts: string[]) {
  return parts.join('').replace(/\s+/g, '').length;
}

/** 한글·영문·숫자만 남기고 헤딩 문자열을 앵커 id 로 바꾼다. */
export function headingId(text: string) {
  return text
    .replace(/\s+/g, '-')
    .replace(/[^0-9A-Za-z가-힣\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

/**
 * 한눈에 보기 — 문서 맨 앞의 요약 블록.
 *
 * ★ 3~5줄로 끊는다. 여섯 줄을 넘으면 요약이 아니라 또 하나의 본문이 되고,
 *   답변 엔진이 "어디까지가 결론인지" 를 못 고른다.
 * ⚠️ 여기에 본문에 없는 사실을 새로 쓰지 않는다. 요약은 본문의 압축이지 추가가 아니다.
 */
export function KeyPoints({ items, title = '한눈에 보기' }: { items: string[]; title?: string }) {
  if (items.length === 0) return null;
  return (
    <aside
      aria-label={title}
      className="rounded-2xl border border-brand-200/70 bg-brand-50/60 p-6 sm:p-7"
    >
      <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.16em] text-brand-600 uppercase">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {items.slice(0, 5).map((t) => (
          <li key={t} className="flex gap-3 text-[15px] leading-[1.75] text-ink-soft">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/**
 * 목차 — 헤딩 앵커로 잇는다.
 *
 * ★ 목차의 진짜 값어치는 사람보다 **기계**에 있다. #앵커가 있으면 답변 엔진이
 *   문서 전체가 아니라 그 구간을 가리켜 인용할 수 있고, 검색 결과에도
 *   'jump to' 링크가 붙는다. 헤딩에 id 가 없으면 그게 아예 불가능하다.
 * ⚠️ items 의 문자열은 화면 헤딩과 **똑같아야** 한다 — 목차와 본문이 어긋나면
 *    누른 곳으로 안 가는 목차가 된다.
 */
export function TableOfContents({ items }: { items: string[] }) {
  if (items.length < 3) return null; // 두 줄짜리 목차는 자리만 차지한다
  return (
    <nav aria-label="목차" className="rounded-2xl border border-brand-200/70 bg-white p-6 sm:p-7">
      <p className="text-[12px] font-black tracking-[0.16em] text-brand-600 uppercase">목차</p>
      <ol className="mt-4 space-y-2">
        {items.map((t, i) => (
          <li key={t} className="flex gap-3 text-[14.5px] leading-relaxed">
            <span aria-hidden className="shrink-0 tabular-nums font-black text-brand-300">
              {String(i + 1).padStart(2, '0')}
            </span>
            <a
              href={`#${headingId(t)}`}
              className="text-ink-soft underline-offset-4 transition-colors hover:text-brand-700 hover:underline"
            >
              {t}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * 저자·검토자·최종 수정일.
 *
 * ★★ 왜 화면에 보여야 하나 ★★
 *   구조화 데이터에만 적어 두면 "기계용으로만 써 둔 값" 이다. 사람이 읽는 자리에도
 *   같은 값이 있어야 그 선언이 사실로 받아들여진다 — 검색 품질 평가 기준이 정확히
 *   이 대응을 본다. `<time datetime>` 으로 기계 판독 값도 함께 준다.
 *
 * ⚠️⚠️ "원장이 직접 작성" 이라고 쓰지 않는다 ⚠️⚠️
 *    이 글들은 병원이 공개한 자료를 정리한 것이고, 의료 내용은 대표원장이 **검토**한다.
 *    작성 주체를 부풀리면 그 자체가 거짓 표시다(의료법 제56조).
 */
export function ArticleMeta({ path }: { path: string }) {
  const { published, modified } = contentDates(path);
  const d = DOCTORS[0];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-brand-100 pt-6 text-[13.5px] text-ink-muted">
      <span>
        의료 내용 검토{' '}
        <Link
          href={`/about/doctors/${d.slug}`}
          rel="author"
          className="font-bold text-brand-700 underline-offset-4 hover:underline"
        >
          {d.name} {d.role}
        </Link>
        <span className="ml-1.5 text-ink-muted">· 보건복지부 인정 통합치의학과 전문의</span>
      </span>
      <span aria-hidden className="text-brand-200">
        |
      </span>
      <span>
        발행 <time dateTime={published}>{formatKoreanDate(published)}</time>
      </span>
      <span>
        최종 수정 <time dateTime={modified}>{formatKoreanDate(modified)}</time>
      </span>
    </div>
  );
}

export interface Reference {
  /** 발행 기관 — 원 출처가 어디인지가 링크 주소보다 중요하다. */
  publisher: string;
  title: string;
  url: string;
}

/**
 * 참고자료 — 본문이 인용한 원 출처.
 *
 * ★★ 여기에 적을 수 있는 것 ★★
 *   본문이 **실제로 근거로 삼은** 공식 문서만이다. 정부·공공기관(go.kr)·학회(or.kr)·
 *   대학(ac.kr)처럼 원 출처를 직접 가리킨다.
 * ⚠️⚠️ 읽지 않은 문서를 목록에 채워 넣지 않는다 ⚠️⚠️
 *    출처 목록은 "이 주장에 근거가 있다" 는 선언이다. 관련 없는 링크를 늘어놓으면
 *    권위를 빌리는 시늉일 뿐이고, 의료 정보에서는 그 자체가 위험한 거짓말이 된다.
 */
export function References({ items }: { items: Reference[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="references" className="rounded-2xl border border-brand-200/70 bg-white p-6 sm:p-7">
      <h2 id="references" className="text-[15px] font-black text-ink">
        참고자료 · 출처
      </h2>
      <ol className="mt-4 space-y-3">
        {items.map((r) => (
          <li key={r.url} className="text-[13.5px] leading-relaxed text-ink-soft">
            <span className="font-bold text-ink">{r.publisher}</span>{' '}
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-brand-700 underline underline-offset-4 hover:text-brand-500"
            >
              {r.title}
            </a>
            <span aria-hidden className="ml-1 text-[11px] text-ink-muted">
              ↗
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[12.5px] leading-relaxed text-ink-muted">
        본 문서의 의료 정보는 {CLINIC.name} 의료진이 검토했습니다. 개인의 상태에 따라 적용이 다를
        수 있으므로 진단은 반드시 내원 후 받으시기 바랍니다.
      </p>
    </section>
  );
}
