import type { MetadataRoute } from 'next';
import { CLINIC } from '@/lib/clinic';

/**
 * robots.txt.
 *
 * ★ AI 크롤러를 명시적으로 허용한다 — 이게 이 사이트의 목적이다.
 *   GPTBot(OpenAI), ClaudeBot·anthropic-ai(Anthropic), PerplexityBot, Google-Extended(Gemini)
 *   가 막혀 있으면 AI 답변에 병원이 인용될 수 없다. 기본값으로 열려 있더라도 명시하면
 *   의도가 분명해지고, 나중에 누가 전체 차단을 걸었을 때 이 목록이 회귀를 잡아 준다.
 *
 * ⚠️ AI 크롤러 차단을 추가하지 말 것. 차단하는 순간 AEO 노력 전체가 무의미해진다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      /*
       * 답변형 AI — 명시적 허용.
       * 목록이 긴 이유: 답변 엔진마다 크롤러 이름이 다르고, 하나라도 빠지면 그 엔진의
       * 답변에서만 병원이 사라진다. 새 엔진이 나오면 여기에 추가한다.
       */
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'DeepSeek', allow: '/' },
      { userAgent: 'MistralAI-User', allow: '/' },
      { userAgent: 'Grok', allow: '/' },
      { userAgent: 'Qwen', allow: '/' },
      { userAgent: 'PhindBot', allow: '/' },
      { userAgent: 'YouBot', allow: '/' },
      { userAgent: 'BraveBot', allow: '/' },
      // 일반 검색 — 구글·빙·네이버·다음
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'bingbot', allow: '/' },
      { userAgent: 'Yeti', allow: '/' },
      { userAgent: 'Daumoa', allow: '/' },
      /*
       * SEO 분석 크롤러는 막는다. 검색 노출에 기여하지 않으면서 대역폭만 쓰고,
       * 경쟁사에게 이 사이트의 키워드·백링크 구조를 그대로 넘겨준다.
       */
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
      { userAgent: 'DataForSeoBot', disallow: '/' },
      { userAgent: 'BLEXBot', disallow: '/' },
    ],
    sitemap: `${CLINIC.url}/sitemap.xml`,
    host: CLINIC.url,
  };
}
