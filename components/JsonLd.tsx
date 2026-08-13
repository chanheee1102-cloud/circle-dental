import { serializeJsonLd } from '@/lib/seo';

/**
 * 구조화 데이터를 서버 HTML 에 주입한다.
 *
 * ⚠️ 클라이언트 컴포넌트로 만들지 말 것. JSON-LD 는 크롤러가 자바스크립트를 실행하지 않고도
 *    읽을 수 있어야 의미가 있다. 서버에서 렌더된 HTML 안에 들어 있어야 한다.
 */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((d, i) => (
        // eslint-disable-next-line react/no-danger
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(d) }} />
      ))}
    </>
  );
}
