import type { NextConfig } from 'next';

/**
 * 옛 홈페이지(아임웹) → 새 사이트 주소 대응표.
 *
 * ★★ 왜 이게 배포와 **같은 순간**에 있어야 하나 ★★
 *   circle-dental.co.kr 은 지금까지 아임웹으로 만든 사이트를 서빙했다. 그 사이트의
 *   sitemap 에 24개 주소가 있고, 새 구조와 경로가 하나도 겹치지 않는다.
 *   리다이렉트 없이 도메인만 갈아끼우면 그 24개가 전부 404 가 되고,
 *   그동안 쌓인 색인·외부 링크·네이버 노출이 함께 사라진다. 나중에 붙이면 그만큼 손해가 쌓인다.
 *
 * ★★ 대응은 전부 **실제로 열어 보고** 정했다 (2026-08-18) ★★
 *   옛 사이트는 페이지 제목을 전부 "동그라미치과" 하나로만 달아 놔서 URL·제목만으로는
 *   무슨 페이지인지 알 수 없었다. Playwright 로 렌더해 본문을 읽고 짝을 지었다.
 *   - /30 · /31 · /51 · /HOME → 넷 다 **홈의 변형**이다(/51 은 지금 홈과 같은 문구).
 *   - /52 → 아임웹 게시판 글쓰기 화면("권한이 없습니다"). 대응할 내용이 없어 홈으로.
 *   - /special → "동그라미의 특별함" 요약. 새 사이트에 단독 허브가 없어 /about 이 가깝다.
 *   - /aesthetic_prosthetics → 본문이 "심미보철 · 올세라믹 크라운" 이라 /treatment/aesthetic.
 *     (겉보기 이름 때문에 crown-prosthesis 로 잘못 짚기 쉽다. 본문을 봐야 한다.)
 *
 * ★ 숫자 주소 여섯(/32 /37 /43 /47 /48 /50)은 옛 사이트에서 이미 301 이었다.
 *   그 **최종 목적지로 곧장** 보낸다 — 리다이렉트를 두 번 태우면 신호가 그만큼 샌다.
 * ⚠️ /36 은 옛 사이트에서도 404 다(그런데 옛 홈페이지가 링크하고 있었다). 함께 사라진다.
 * ⚠️ 옛 sitemap 이 http:// 로 적혀 있다. https 승격은 호스팅이 처리하지만 배포 후 확인할 것.
 */
const OLD_SITE: Array<[string, string]> = [
  // 홈의 여러 판본
  ['/HOME', '/'],
  ['/30', '/'],
  ['/31', '/'],
  ['/51', '/'],
  ['/52', '/'],

  // 병원 소개
  ['/special', '/about'],
  ['/32', '/about'], // → /special
  ['/doctor', '/about/doctors'],
  ['/preview', '/about/tour'],

  // 진료
  ['/implant', '/treatment/implant'],
  ['/50', '/treatment/implant'], // → /implant
  ['/natural_teeth', '/treatment/save-natural-tooth'],
  ['/37', '/treatment/save-natural-tooth'], // → /natural_teeth
  ['/dental_nerve_treatment', '/treatment/endodontic'],
  ['/cavity', '/treatment/cavity'],
  ['/scaling', '/treatment/scaling-prevention'],
  ['/wisdomtooth', '/treatment/wisdom-tooth'],
  ['/47', '/treatment/wisdom-tooth'], // → /wisdomtooth
  ['/aesthetic_prosthetics', '/treatment/aesthetic'],
  ['/teeth_whitening', '/treatment/aesthetic'],
  ['/43', '/treatment/aesthetic'], // → /aesthetic_prosthetics

  // 내원·예약
  ['/information', '/visit'],
  ['/reservation', '/contact'],
  ['/48', '/contact'], // → /reservation
];

/**
 * 관습적인 주소 (2026-08-14).
 *
 * 사람도 크롤러도 /service, /clinic 같은 주소를 먼저 찍어 본다. 우리 진료 페이지는
 * /treatment 라, 그 주소로 들어온 요청이 404 로 끝나면 **없는 페이지로 읽힌다**
 * (외부 진단: "핵심 페이지 누락: service").
 * 내용을 복제하지 않고 정본 한 곳을 가리킨다 — 같은 내용이 두 주소에 있으면
 * 그게 오히려 어느 쪽이 정본인지 흐린다.
 */
const CONVENTIONAL: Array<[string, string]> = [
  ['/service', '/treatment'],
  ['/services', '/treatment'],
  ['/clinic', '/about'],
  ['/location', '/visit'],
];

/**
 * 보안 헤더.
 *
 * ★ 순위에 직접 미치는 영향은 작지만 감사 도구가 가장 먼저 지적하는 자리이고,
 *   HTTPS·보안 항목은 배포 후에야 판정되는 몇 안 되는 체크리스트 항목이다.
 *
 * ⚠️ CSP 는 일부러 넣지 않았다. Next 가 만드는 인라인 스크립트·스타일 때문에 잘못 걸면
 *    화면이 통째로 깨진다. 넣으려면 `Content-Security-Policy-Report-Only` 로 먼저
 *    한동안 관찰하고 위반 보고를 보고 좁혀야 한다.
 * ⚠️ HSTS 에 `preload` 는 넣지 않았다. preload 목록은 **되돌리기가 매우 느리다** —
 *    하위 도메인 하나를 http 로 띄울 일이 생기면 그때 손쓸 방법이 없다.
 * ⚠️ X-Frame-Options 는 **우리 페이지가 남의 프레임에 갇히는 것**을 막는 것이고,
 *    우리가 넣은 구글 지도 iframe 과는 무관하다(지도는 정상 동작한다).
 * ⚠️ Permissions-Policy 에서 geolocation 은 막지 않는다 — 지도 임베드의 '내 위치' 가 죽는다.
 */
const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /*
   * 상위 폴더(C:\Users\FORYOUCOM)에도 package-lock.json 이 있어서 Next 가 그쪽을 워크스페이스
   * 루트로 잘못 잡는다. 그대로 두면 빌드 추적이 엉뚱한 범위를 훑는다. 이 폴더로 고정한다.
   */
  outputFileTracingRoot: __dirname,
  // 이미지 최적화 — 실제 사진 도입 시 remotePatterns 추가.
  images: { formats: ['image/avif', 'image/webp'] },

  async redirects() {
    return [
      ...OLD_SITE.map(([source, destination]) => ({ source, destination, permanent: true })),
      ...CONVENTIONAL.map(([source, destination]) => ({ source, destination, permanent: true })),
      /*
       * www → apex.
       *
       * ★ 지금은 두 주소가 **둘 다 200** 을 낸다(실측). 같은 문서가 두 곳에 있는 셈이다.
       *   canonical 이 전부 apex 를 가리켜 대부분 해소되지만, canonical 은 '힌트' 이고
       *   301 은 '사실' 이다. 못 박아 두는 편이 맞다.
       * ⚠️ 이건 **두 번째 방어선**이다. 요청이 앱까지 오기 전에 끝내는 것이 낫기 때문에
       *    호스팅(Vercel 도메인 설정)에서도 www 를 리다이렉트로 등록할 것.
       *    둘 다 있어도 충돌하지 않는다 — 호스팅이 먼저 처리하면 여기까지 오지 않는다.
       */
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.circle-dental.co.kr' }],
        destination: 'https://circle-dental.co.kr/:path*',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      {
        source: '/llms.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },
};

export default nextConfig;
