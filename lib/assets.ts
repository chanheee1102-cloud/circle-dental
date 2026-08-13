/**
 * 이미지 자산 매니페스트.
 *
 * ★ 파일명이 해시라 그대로 쓰면 코드에서 무엇인지 알 수 없다. 여기서 한 번 이름을 붙이고,
 *   페이지는 이 상수만 참조한다. 나중에 사진을 교체할 때도 이 파일 한 줄만 고치면 된다.
 *
 * ★ 출처 — 병원이 기존 홈페이지(circle-dental.co.kr)에 올려 둔 자산을 그대로 옮겼다.
 *   같은 병원의 새 홈페이지로 이동하는 것이므로 사용 주체가 바뀌지 않는다.
 *   (스톡 사진이 아니라 실제 이 병원 사진이라는 점이 중요하다 — 다른 병원 사진을
 *    쓰면 그 자체가 허위 표시다.)
 */

const P = '/img';

export const IMG = {
  /** 병원 로고 원본(가로형). 헤더·푸터가 쓴다. */
  logo: `${P}/20210927_36acb8c3e0ae7.png`,
  logoAlt: `${P}/20210927_9e1c74b875fdd.png`,

  /** 진료 4대 축 카드 — 기존 홈페이지의 '동그라미 치과 진료정보' 섹션 이미지. */
  treatment: {
    natural: `${P}/20210901_29b044c2d4b92.png`,
    implant: `${P}/20210901_a15ee499c06d8.png`,
    aesthetic: `${P}/20210901_b57681799e6ab.png`,
    wisdom: `${P}/20210901_27c6b2623d6b5.png`,
  },

  /**
   * '동그라미 치과만의 특별함' 원본 자산.
   * ⚠️ 화면에서는 쓰지 않는다 — 아이콘이 아니라 **문구가 박힌 캡처 이미지**라
   *    작게 넣으면 글자가 뭉개진다. 대신 components/StrengthIcons.tsx 의 인라인 SVG 를 쓴다.
   *    원본이 필요할 때를 대비해 목록만 남겨 둔다.
   */
  strengthLegacy: [
    `${P}/20211105_ff46111bf5901.png`,
    `${P}/20211105_49df0995a4576.png`,
    `${P}/20211105_e781e6d5f6320.png`,
    `${P}/20211105_aa757fdbac9f9.png`,
    `${P}/20211105_2eef4ed664c1f.png`,
  ],

  /** 의료진 단체 사진 — 가운데가 대표원장 변석호. */
  doctors: `${P}/20211123_bbf2515cc8c8e.jpg`,

  /** 대표원장 인증·수료 이미지. */
  credentials: [
    { src: `${P}/20211103_512c7ae40d0a6.png`, label: '오스템임플란트 연구자문치과 위촉패' },
    { src: `${P}/20211103_90109c0540488.png`, label: 'Professional implant Training course 수료패' },
    { src: `${P}/20211103_6b7c5d873ca27.png`, label: '세계근관치료학회 수료증' },
    { src: `${P}/20211123_d616cc90b9198.jpg`, label: '대한치과보존학회 회원증' },
  ],

  /** 내부 둘러보기 — 기존 홈페이지 '동그라미 치과 내부 둘러보기' 갤러리. */
  interior: [
    `${P}/20210923_5e82b10a99850.jpg`,
    `${P}/20210923_6b7e0b66df9e0.jpg`,
    `${P}/20210923_43d85ec16a0eb.jpg`,
    `${P}/20210923_217b53ad1570b.jpg`,
    `${P}/20210923_595f40b6ee28f.jpg`,
    `${P}/20210923_72fa74e154297.jpg`,
    `${P}/20210923_956b5d44b57ef.jpg`,
    `${P}/20210923_14482879bf993.jpg`,
    `${P}/20210923_ed347b4ffee21.jpg`,
    `${P}/20210923_bfab24c2d7395.jpg`,
    `${P}/20210923_67b5506b18b26.jpg`,
    `${P}/20210902_c9d4c8d8ff172.jpg`,
  ],
} as const;

/**
 * 히어로 배경 영상.
 *
 * ★ 기존 홈페이지가 Vimeo 에 올려 둔 영상이다. 파일을 내려받아 재호스팅하지 않고
 *   원본과 같은 방식으로 임베드한다 — 저작·트래픽 주체를 바꾸지 않는 것이 맞고,
 *   Vimeo 가 화질·대역폭을 알아서 조절해 주므로 성능에도 유리하다.
 * ★ background=1 은 컨트롤·제목을 모두 숨긴 배경 재생 모드다. muted 는 필수 —
 *   음소거가 아니면 브라우저가 자동재생을 막는다.
 */
const vimeoBg = (id: string, hash?: string) =>
  `https://player.vimeo.com/video/${id}?${hash ? `h=${hash}&` : ''}background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1`;

/**
 * ★ 영상이 세 개인데 화면비가 전부 다르다 — 이걸 모르고 하나만 쓰면 반드시 어긋난다.
 *   실제로 처음에 모바일용(4:5)을 데스크톱 히어로에 넣고 16:9 로 계산해서
 *   화면 가운데만 차고 양옆이 비었다. Vimeo oEmbed 로 실측한 값은 다음과 같다.
 *
 *     601092926  426×240 (16:9)  '동그라미 치과의원 영상(클린본).mp4'   → 데스크톱 히어로
 *     640233415  240×300 (4:5)   '..._모바일용.mp4'                    → 모바일 히어로
 *     613292079  426×214 (2:1)   '시그널 24회 최종 MASTER.mp4'         → 사회공헌(TV조선 방영분)
 *
 *   ⚠️ 영상을 교체할 때는 화면비를 먼저 확인하고, CSS 의 cover 클래스도 함께 맞출 것.
 *      확인법: https://vimeo.com/api/oembed.json?url=https://vimeo.com/<ID>
 */
export const HERO_VIDEO = {
  /** 데스크톱 — 16:9. globals.css 의 .video-cover-16x9 와 짝이다. */
  desktop: vimeoBg('601092926'),
  /** 모바일 — 4:5 세로. .video-cover-4x5 와 짝이다. */
  mobile: vimeoBg('640233415', '53c2ec8b24'),
} as const;

/** 사회공헌 섹션 — TV조선 [구조신호 시그널] 24회 방영분. */
export const OUTREACH_VIDEO = {
  id: '613292079',
  embed: `https://player.vimeo.com/video/613292079?dnt=1&title=0&byline=0&portrait=0`,
} as const;
