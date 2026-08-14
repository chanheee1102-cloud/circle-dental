import { serializeJsonLd, clinicSchema, websiteSchema, directorPersonSchema } from '@/lib/seo';

/**
 * 이 페이지의 구조화 데이터 전체 — **스크립트 하나, @graph 하나**.
 *
 * ★★ 왜 하나로 합치나 ★★
 *   예전에는 `<script type="application/ld+json">` 를 서너 개씩 따로 냈다. 문법상 틀린 건
 *   아니지만 크롤러 입장에서는 **서로 남남인 조각들**이다. "이 문서의 발행자" 와
 *   "이 병원" 이 같은 존재인지 알 방법이 없고, "이 글의 저자" 와 "저 원장 페이지의 사람" 도
 *   이어지지 않는다. 하나의 @graph 안에서 @id 로 이으면 그 관계가 명시된다 —
 *   지식패널은 이렇게 이어진 **엔티티 그래프**를 보고 만들어진다.
 *
 * ★ 병원(Dentist)·사이트(WebSite)·대표원장(Person) 세 노드는 여기서 자동으로 앞에 붙는다.
 *   페이지마다 손으로 넣으면 언젠가 빠뜨린 페이지가 생긴다. 같은 @id 가 페이지마다
 *   반복되는 것은 문제가 아니다 — **같은 엔티티**라는 뜻이고, 그게 @id 의 존재 이유다.
 *   (문제가 되는 건 **한 페이지 안에** 같은 @id 가 두 번 나오는 경우라, 아래에서 합친다.)
 *
 * ⚠️ 클라이언트 컴포넌트로 만들지 말 것. JSON-LD 는 크롤러가 자바스크립트를 실행하지 않고도
 *    읽을 수 있어야 의미가 있다. 서버에서 렌더된 HTML 안에 들어 있어야 한다.
 */
export function JsonLd({
  data,
  /** 병원·사이트·대표원장 노드를 앞에 붙일지. 기본 true — 끌 일은 거의 없다. */
  site = true,
}: {
  data?: unknown | unknown[];
  site?: boolean;
}) {
  const given = (Array.isArray(data) ? data : data ? [data] : []).filter(Boolean);
  const nodes = [
    ...(site ? [clinicSchema(), websiteSchema(), directorPersonSchema()] : []),
    ...given,
  ].map(stripContext);

  const graph = mergeById(nodes);

  return (
    // eslint-disable-next-line react/no-danger
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}

/** @graph 안에서는 노드마다 @context 를 달지 않는다 — 바깥에 한 번이면 된다. */
function stripContext(node: unknown) {
  if (!node || typeof node !== 'object') return node as Record<string, unknown>;
  const { '@context': _ctx, ...rest } = node as Record<string, unknown>;
  return rest;
}

/**
 * 같은 @id 를 가진 노드를 하나로 합친다.
 *
 * ★ 왜 필요한가 — 원장 상세 페이지가 자기 Physician 노드를 내는데, 위에서 자동으로 붙는
 *   대표원장 Person 노드와 **@id 가 같다**(같은 사람이니 당연하다). 그대로 두면 한 문서
 *   안에 같은 URI 가 두 번 나와 어느 쪽을 믿을지 모호해진다.
 * ★ 뒤에 온 값이 이긴다 — 페이지가 직접 낸 노드가 자동 노드보다 그 페이지 사정을 잘 안다.
 * ★ @id 가 없는 노드는 합치지 않고 순서대로 둔다.
 */
function mergeById(nodes: Record<string, unknown>[]) {
  const out: Record<string, unknown>[] = [];
  const seen = new Map<string, number>();
  for (const n of nodes) {
    const id = typeof n?.['@id'] === 'string' ? (n['@id'] as string) : null;
    if (id && seen.has(id)) {
      const at = seen.get(id)!;
      out[at] = { ...out[at], ...n };
      continue;
    }
    if (id) seen.set(id, out.length);
    out.push(n);
  }
  return out;
}
