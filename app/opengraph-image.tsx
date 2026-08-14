import { ImageResponse } from 'next/og';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';

/**
 * 공유 카드 이미지 (Open Graph / Twitter).
 *
 * ★★ 왜 필요한가 ★★
 *   카카오톡·페이스북·슬랙에 주소를 붙여 넣으면 이 이미지가 뜬다. 없으면 회색 상자이거나
 *   본문 아무 사진이나 잘려 나온다 — 병원 주소를 공유받은 사람에게 첫인상이 그것이다.
 *   검사 기준도 **1200×630 이상**을 요구한다.
 *
 * ★ 사진 대신 타이포로 만드는 이유
 *   내부 사진은 4:3 이라 1200×630 에 넣으면 위아래가 잘려 무엇을 찍은 것인지 알기 어렵다.
 *   공유 카드에서 가장 중요한 정보는 **병원 이름·지역·전화번호** 세 가지이고,
 *   그건 사진보다 글자가 훨씬 정확하게 전달한다.
 *
 * ★ 값은 전부 CLINIC 에서 온다 — 여기서 다시 적으면 언젠가 어긋난다.
 * ⚠️ 글꼴은 지정하지 않는다. ImageResponse 의 기본 글꼴로도 한글이 렌더되고,
 *    Pretendard 를 넣으려면 폰트 파일을 빌드에 싣게 되어 빌드 시간과 용량이 크게 는다.
 *    공유 카드 한 장을 위해 치를 값이 아니다.
 */
export const runtime = 'nodejs';
export const alt = `${CLINIC.name} — ${CLINIC.address.locality} ${CLINIC.address.dong} 치과`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  const hours = UNVERIFIED.hours.verified
    ? UNVERIFIED.hours.display
        .filter((h) => h.label !== '점심시간')
        .map((h) => `${h.label} ${h.time}`)
        .join('   ·   ')
    : '';

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

        {/*
          ⚠️⚠️ satori 규칙 — **자식이 둘 이상인 div 에는 반드시 display 를 명시**한다 ⚠️⚠️
             안 하면 빌드가 통째로 실패한다(실측: "Expected <div> to have explicit
             display: flex or display: none"). 글자 여러 조각을 한 div 에 늘어놓는 것도
             '자식 둘 이상' 이라 같은 오류가 난다 — 그래서 문자열은 미리 합쳐서 하나로 넣는다.
        */}
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

        <div
          style={{ display: 'flex', marginTop: 26, fontSize: 84, fontWeight: 800, letterSpacing: -2 }}
        >
          {CLINIC.name}
        </div>

        <div
          style={{ display: 'flex', marginTop: 22, fontSize: 36, color: 'rgba(255,255,255,0.88)' }}
        >
          {`${CLINIC.address.locality} ${CLINIC.address.dong} · ${CLINIC.nearestStation} 인근`}
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
          <div style={{ display: 'flex', fontSize: 46, fontWeight: 800, letterSpacing: 1 }}>
            {CLINIC.phone}
          </div>
          {hours ? (
            <div
              style={{
                display: 'flex',
                marginTop: 14,
                fontSize: 27,
                color: 'rgba(255,255,255,0.68)',
              }}
            >
              {hours}
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
