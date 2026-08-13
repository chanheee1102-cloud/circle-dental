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
