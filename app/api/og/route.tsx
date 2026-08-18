import { ImageResponse } from 'next/og';
import { CLINIC } from '@/lib/clinic';

/**
 * 페이지별 공유 카드.
 *
 * ★★ 왜 만들었나 (2026-08-18 전수 측정) ★★
 *   91페이지에 og:image 가 **10종**뿐이었다. 사진이 있는 페이지는 그 사진을 쓰지만
 *   나머지는 전부 `/opengraph-image` 한 장을 나눠 썼다(그중 16페이지는 홈과 완전히 동일).
 *   카카오톡에 '임플란트' 페이지를 붙이든 '비용 가이드' 를 붙이든 같은 그림이 떴다는 뜻이다.
 *   순위 요소는 아니지만 **공유 링크의 클릭률에 직접** 영향을 준다.
 *
 * ★ 왜 라우트 하나로 푸는가
 *   Next 의 opengraph-image 규약을 쓰면 라우트 세그먼트마다 파일을 하나씩 둬야 한다
 *   (시술·증상·질환·여정·의료진·특별함… 파일 일곱 개 + 같은 디자인 코드 일곱 벌).
 *   제목만 바뀌는 카드라 **쿼리로 제목을 받는 라우트 하나**면 충분하고, 디자인이 한 곳에 모인다.
 *
 * ★ 디자인은 app/opengraph-image.tsx(홈 카드)와 같은 결이다 — 같은 병원의 카드가
 *   페이지마다 다른 스타일이면 그게 더 어색하다. 다른 것은 제목 한 줄뿐이다.
 *
 * ⚠️⚠️ satori 규칙 — **자식이 둘 이상인 div 에는 display 를 반드시 명시**한다.
 *    안 하면 렌더가 통째로 실패한다("Expected <div> to have explicit display: flex or none").
 *    글자 조각을 한 div 에 여럿 늘어놓는 것도 '자식 둘 이상' 이라 같은 오류가 난다 —
 *    그래서 문자열은 미리 합쳐서 하나로 넣는다.
 * ⚠️ 글꼴은 지정하지 않는다. 기본 글꼴로도 한글이 렌더되고, Pretendard 를 실으면
 *    빌드 용량과 시간이 크게 는다(홈 카드와 같은 판단).
 */
export const runtime = 'nodejs';

const SIZE = { width: 1200, height: 630 };

export function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get('t') ?? '';
  /*
   * 제목은 그림으로만 그려지므로 스크립트가 실행될 여지는 없다. 그래도 길이는 자른다 —
   * 긴 문자열이 들어오면 글자가 카드를 넘어가 레이아웃이 무너지고, 렌더 비용도 는다.
   */
  const title = raw.replace(/\s+/g, ' ').trim().slice(0, 60);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '76px 80px',
          background: 'linear-gradient(135deg, #4a3a30 0%, #2e241d 62%, #241c17 100%)',
          color: '#fff',
          fontSize: 32,
        }}
      >
        {/* 브랜드 모티프 — 병원 이름이 '동그라미'라 원을 쓴다. */}
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: -140,
            width: 520,
            height: 520,
            borderRadius: 520,
            border: '2px solid rgba(255,255,255,0.10)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 40,
            bottom: -200,
            width: 380,
            height: 380,
            borderRadius: 380,
            background: 'rgba(212,168,83,0.10)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 14,
              background: '#d4a853',
              marginRight: 16,
              display: 'flex',
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              letterSpacing: 6,
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            CIRCLE DENTAL CLINIC
          </div>
        </div>

        {/* 이 카드의 주인공 — 페이지 제목. 홈 카드에서는 이 자리가 병원 이름이었다. */}
        <div
          style={{
            display: 'flex',
            marginTop: 26,
            fontSize: title.length > 26 ? 60 : 76,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.18,
          }}
        >
          {title || CLINIC.name}
        </div>

        <div
          style={{
            marginTop: 46,
            paddingTop: 34,
            borderTop: '1px solid rgba(255,255,255,0.16)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 800 }}>{CLINIC.name}</div>
          <div
            style={{
              display: 'flex',
              marginTop: 14,
              fontSize: 27,
              color: 'rgba(255,255,255,0.68)',
            }}
          >
            {`${CLINIC.address.locality} ${CLINIC.address.dong} · ${CLINIC.nearestStation} 인근   ·   ${CLINIC.phone}`}
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      /* 제목이 같으면 그림도 같다 — 공유될 때마다 다시 그릴 이유가 없다. */
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
  );
}
