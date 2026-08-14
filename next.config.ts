import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /*
   * 상위 폴더(C:\Users\FORYOUCOM)에도 package-lock.json 이 있어서 Next 가 그쪽을 워크스페이스
   * 루트로 잘못 잡는다. 그대로 두면 빌드 추적이 엉뚱한 범위를 훑는다. 이 폴더로 고정한다.
   */
  outputFileTracingRoot: __dirname,
  // 이미지 최적화 — 실제 사진 도입 시 remotePatterns 추가.
  images: { formats: ['image/avif', 'image/webp'] },
  /*
   * ★★ 관습적인 주소를 살려 둔다 (2026-08-14) ★★
   *   사람도 크롤러도 /service, /clinic 같은 주소를 먼저 찍어 본다. 우리 진료 페이지는
   *   /treatment 라, 그 주소로 들어온 요청이 404 로 끝나면 **없는 페이지로 읽힌다**
   *   (외부 진단: "핵심 페이지 누락: service").
   *   내용을 복제하지 않고 301 로 정본 한 곳을 가리킨다 — 같은 내용이 두 주소에 있으면
   *   그게 오히려 어느 쪽이 정본인지 흐린다.
   * ⚠️ 302 가 아니라 **permanent** 다. 임시 이동으로 알리면 색인 신호가 옮겨 가지 않는다.
   */
  async redirects() {
    return [
      { source: '/service', destination: '/treatment', permanent: true },
      { source: '/services', destination: '/treatment', permanent: true },
      { source: '/clinic', destination: '/about', permanent: true },
      { source: '/location', destination: '/visit', permanent: true },
      { source: '/doctor', destination: '/about/doctors', permanent: true },
      { source: '/reservation', destination: '/contact', permanent: true },
    ];
  },
  // AI 크롤러·검색엔진이 읽는 정적 자산은 캐시를 길게, HTML 은 짧게.
  async headers() {
    return [
      {
        source: '/llms.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },
};

export default nextConfig;
