import type { MetadataRoute } from 'next';
import { CLINIC } from '@/lib/clinic';
import { contentDates } from '@/lib/contentMeta';
import { flatNavPaths } from '@/lib/nav';
import { TREATMENTS } from '@/lib/treatments';
import { SYMPTOMS } from '@/lib/symptoms';
import { CONDITIONS } from '@/lib/conditions';
import { JOURNEYS } from '@/lib/insight';
import { IMPLANT_TOPICS } from '@/lib/implantTopics';
import { SPECIALS } from '@/lib/specials';
import { DOCTORS } from '@/lib/doctors';

/**
 * sitemap.xml.
 *
 * ★ 데이터에서 자동 생성한다 — 손으로 관리하면 페이지를 추가하고 여기 넣는 것을 잊는다.
 *   사이트맵에 없는 페이지는 크롤링이 늦어지거나 아예 발견되지 않는다.
 *
 * ★★ lastmod 는 빌드 시각이 아니라 **그 페이지를 실제로 고친 날**이다 (2026-08-18 수정) ★★
 *   전에는 91개 항목이 전부 `new Date()` 였다. 밀리초까지 같은 값이 91번 나오면
 *   그게 빌드 시각이라는 사실이 그대로 드러난다. 구글은 lastmod 를 **"일관되고 검증
 *   가능하게 정확할 때만"** 쓴다고 명시하므로, 이 상태에서는 사이트 전체의 lastmod 가
 *   통째로 무시된다. 더 나쁜 것은 사이트맵과 JSON-LD 의 dateModified 가 **서로 다른
 *   날짜를 말하는** 상태였다는 점이다 — 둘이 어긋나면 어느 쪽도 못 믿게 된다.
 *
 *   그래서 JSON-LD 와 **같은 출처**(lib/contentMeta.ts)에서 날짜를 가져온다.
 *   페이지 본문을 고쳤으면 거기 날짜만 올리면 사이트맵·스키마·화면 표기가 함께 움직인다.
 *   ⚠️ 여기서 `new Date()` 로 되돌리지 말 것.
 *
 * ★ priority · changeFrequency 는 **구글이 무시한다**(공식 문서 명시).
 *   빼도 그만이지만 네이버·빙 등이 참고할 여지가 있어 남겨 둔다.
 *   다만 "이 값을 올리면 순위가 오른다" 는 기대는 하지 말 것.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => (p === '/' ? CLINIC.url : `${CLINIC.url}${p}`);

  /** 경로 하나를 사이트맵 항목으로. 날짜는 항상 contentDates 에서 온다. */
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
  ): MetadataRoute.Sitemap[number] => ({
    url: url(path),
    lastModified: contentDates(path).modified,
    changeFrequency,
    priority,
  });

  const staticPages = flatNavPaths().map((p) =>
    entry(p, p === '/' ? 1 : 0.8, p === '/' ? 'weekly' : 'monthly'),
  );

  // nav 에 없는 페이지를 명시적으로 넣는다. 사이트맵에 없으면 발견이 늦거나 안 된다.
  const extraHubs = [
    entry('/insight/condition', 0.8),
    // 개인정보처리방침은 푸터에만 있어 nav 에서 안 잡힌다. 법정 공개 의무 문서라 빠지면 안 된다.
    entry('/privacy', 0.3, 'yearly'),
  ];

  const treatmentPages = TREATMENTS.map((t) => entry(`/treatment/${t.slug}`, 0.9));
  const symptomPages = SYMPTOMS.map((s) => entry(`/insight/symptom/${s.slug}`, 0.9));
  const conditionPages = CONDITIONS.map((c) => entry(`/insight/condition/${c.slug}`, 0.9));
  const journeyPages = JOURNEYS.map((j) => entry(`/insight/journey/${j.slug}`, 0.8));
  const implantPages = IMPLANT_TOPICS.map((t) => entry(`/treatment/implant/${t.slug}`, 0.85));
  const specialPages = SPECIALS.map((s) => entry(`/about/special/${s.slug}`, 0.8));

  // Set 으로 중복 제거 — nav 에 이미 들어 있는 경로가 다시 들어오면 중복 URL 이 나간다.
  const seen = new Set<string>();
  return [
    ...staticPages,
    ...extraHubs,
    ...treatmentPages,
    ...symptomPages,
    ...conditionPages,
    ...journeyPages,
    ...implantPages,
    ...specialPages,
  ].filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });
}
