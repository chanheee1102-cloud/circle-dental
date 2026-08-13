import type { MetadataRoute } from 'next';
import { CLINIC } from '@/lib/clinic';
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
 * ★ priority 는 검색엔진이 참고만 하지만, 사이트 안에서 무엇이 중심인지 밝히는 신호다.
 *   증상 페이지를 진료 페이지와 같은 비중으로 둔 것은 의도다 — 검색 유입의 큰 축이다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => (p === '/' ? CLINIC.url : `${CLINIC.url}${p}`);

  const staticPages: MetadataRoute.Sitemap = flatNavPaths().map((p) => ({
    url: url(p),
    lastModified: now,
    changeFrequency: p === '/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : 0.8,
  }));

  const treatmentPages: MetadataRoute.Sitemap = TREATMENTS.map((t) => ({
    url: url(`/treatment/${t.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const symptomPages: MetadataRoute.Sitemap = SYMPTOMS.map((s) => ({
    url: url(`/insight/symptom/${s.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const conditionPages: MetadataRoute.Sitemap = CONDITIONS.map((c) => ({
    url: url(`/insight/condition/${c.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const journeyPages: MetadataRoute.Sitemap = JOURNEYS.map((j) => ({
    url: url(`/insight/journey/${j.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const implantPages: MetadataRoute.Sitemap = IMPLANT_TOPICS.map((t) => ({
    url: url(`/treatment/implant/${t.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const doctorPages: MetadataRoute.Sitemap = DOCTORS.map((d) => ({
    url: url(`/about/doctors/${d.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const specialPages: MetadataRoute.Sitemap = SPECIALS.map((s) => ({
    url: url(`/about/special/${s.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // nav 에 없는 페이지를 명시적으로 넣는다. 사이트맵에 없으면 발견이 늦거나 아예 안 된다.
  const extraHubs: MetadataRoute.Sitemap = [
    { url: url('/insight/condition'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // 개인정보처리방침은 푸터에만 있어 nav 에서 안 잡힌다. 법정 공개 의무 문서라 빠지면 안 된다.
    { url: url('/privacy'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Set 으로 중복 제거 — nav 에 이미 들어 있는 경로가 다시 들어오면 사이트맵이 중복 URL 을 낸다.
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
    ...doctorPages,
  ].filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });
}
