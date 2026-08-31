import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import './space.css';
import { CLINIC, TREATMENT_PILLARS, UNVERIFIED } from '@/lib/clinic';
import { DOCTORS } from '@/lib/doctors';
import { IMG } from '@/lib/assets';
import { imageSize } from '@/lib/imageSize';
import { HeroMedia } from '@/components/HeroMedia';
import { SpaceHeader, SpaceFooter } from './SpaceChrome';
import { ClinicMap } from '@/components/ClinicMap';

/**
 * /space — 메인 화면을 **손으로 새로 짠 것**.
 *
 * ★★ 왜 따로 만들었나 (2026-08-19 운영자) ★★
 *   "웹빌더 말고 새로 만들어보라는건데 저 디자인으로"
 *   빌더의 스킨(CSS 로 인상만 바꾸는 축)이 아니라, spacederma.co.kr 의 **짜임까지**
 *   손으로 옮긴 화면이다. 스킨으로는 못 하는 것이 있었다 —
 *   좌측 고정 소개 + 우측 가로 흐름, 원형 진료 항목, 사진이 화면 밖으로 흘러나가는 구성.
 *
 * ⚠️ 지금 홈(/)은 그대로 둔다. 나란히 놓고 보신 뒤에 바꿀지 정하시면 된다.
 *
 * ★ 글과 사진은 **전부 동그라미치과의 것**이다. 레퍼런스에서 가져온 것은 디자인 언어뿐이다
 *   (app/space/space.css 머리말 참조).
 */

export const metadata: Metadata = {
  title: `${CLINIC.name} | 새 메인 시안`,
  /* ⚠️ 시안이라 검색에 잡히면 안 된다 — 지금 홈과 중복으로 읽힌다. */
  robots: { index: false, follow: false },
};

/*
 * 구역 여백.
 *
 * ⚠️⚠️ 레퍼런스의 140px 을 그대로 옮겼다가 **구역마다 280px 이 빈 공간으로 남았다** ⚠️⚠️
 *   (실측: 여섯 구역 전부 정확히 280px = 140×2. '오시는 길' 은 65% 가 빈칸이었다.)
 *   레퍼런스가 그 여백을 견디는 이유는 **내용이 화면을 채우기 때문**이다 — 큰 사진,
 *   가득 찬 이미지, 진료시간 표. 여백만 베끼고 내용을 안 채우면 그냥 빈 화면이 된다.
 * ★ 그래서 여백을 조금 줄이고, 그보다 **내용을 채우는 쪽**을 함께 고쳤다.
 */
const SECTION = 'px-6 py-[clamp(64px,7vw,104px)] lg:px-10';

/*
 * 구역 제목 크기.
 * ★ 레퍼런스는 구역 제목이 **전부 같은 크기(40px)** 다(실측). 크기를 섞으면 위계가 흔들려
 *   "어디가 더 중요한지" 가 안 읽히고, 그게 완성도가 덜해 보이는 이유가 된다.
 * ⚠️ 한 곳에서만 정한다. 구역마다 숫자를 적으면 반드시 어긋난다.
 */
const SECTION_TITLE = 'clamp(23px,2.7vw,40px)';

export default function SpacePage() {
  const doctors = DOCTORS.slice(0, 3);
  /* ⚠️ TREATMENT_PILLARS 는 길이가 고정된 튜플이라 slice 하면 타입이 어긋난다. 그대로 쓴다. */
  const pillars = TREATMENT_PILLARS;
  /*
   * ★ 내부 사진에는 **판독기가 실제로 본 것**이 alt 로 붙어 있다(lib/assets.ts).
   *   "내부 1" 같은 번호 설명은 화면 읽기 프로그램에도 검색엔진에도 쓸모가 없다 —
   *   있는 설명을 버리고 번호를 지어내지 않는다.
   */
  const interiors = IMG.interior.slice(0, 6);

  /*
   * ★★ 사진 틀을 정하기 전에 **원본 비율을 먼저 읽는다** ★★
   *   처음엔 레퍼런스를 흉내 내느라 4:5·4:3 같은 틀을 먼저 정하고 사진을 끼웠다.
   *   그런데 이 병원 내부 사진은 전부 **가로형**(340×226 등)이라, 세로 틀에 넣으니
   *   좌우가 최대 49% 잘려 나갔다(실측). 절반 가까이 버린 것이다.
   *   틀에 사진을 맞추는 게 아니라 **사진에 틀을 맞춘다.**
   */
  /*
   * ★★ 이야기 구역 사진은 **글이 하는 말과 같은 장면**이어야 한다 ★★
   *   두 번 틀렸다.
   *     ① "가장 가로로 긴 사진" 으로 골랐더니 빈 상담 부스가 나왔다.
   *     ② 의료진 단체 사진으로 바꿨더니 흰 배경의 인물 컷이라, 옆 글
   *        ("오래 쓰실 수 있는 방향인지부터 **함께 확인합니다**")과 따로 놀았다.
   *   비율이나 인물 유무가 아니라 **장면**을 봐야 한다.
   *
   * ★ 그래서 대체텍스트에서 '함께 보는 장면' 을 찾는다. 이 사이트의 alt 는 판독기가
   *   실제로 본 것을 적어 둔 것이라(lib/assets.ts) 장면을 고르는 근거로 쓸 수 있다.
   * ⚠️ 못 찾으면 첫 사진으로 물러선다 — 없는 장면을 지어내지 않는다.
   */
  /*
   * 진료 구역의 넓은 사진 — 가장 가로로 긴 것을 쓴다.
   * ⚠️ 이야기 구역과 **다른 사진**이어야 한다. 같은 사진이 두 번 나오면 사진이 모자라 보인다.
   */
  const treatPhoto = (() => {
    let best: { src: string; alt: string } = IMG.interior[0];
    let bestRatio = 0;
    for (const p of IMG.interior) {
      const sz = imageSize(p.src);
      if (!sz) continue;
      const r = sz.width / sz.height;
      if (r > bestRatio) {
        bestRatio = r;
        best = p;
      }
    }
    return { src: best.src, alt: best.alt, ratio: bestRatio || 3 };
  })();

  /*
   * 브랜드 모멘트에 쓸 사진 — 사람이 없는 **공간** 사진.
   * ⚠️ 이야기·진료 구역과 겹치지 않는 것을 고른다. 같은 사진이 세 번 나오면
   *    사진이 모자란 병원으로 읽힌다.
   */
  const momentPhoto = IMG.interior.find((p) => /대기|입구|로비|복도/.test(p.alt)) ?? IMG.interior[2];

  const storyPhoto = (() => {
    /*
     * ⚠️ 찾는 **순서**가 중요하다. '상담' 을 먼저 넣었더니 '개별 상담 부스'(빈 공간)가
     *    먼저 걸렸다. 사람이 함께 화면을 보는 장면부터 찾고, 그다음에 공간을 찾는다.
     */
    const WANT = [/엑스레이|태블릿/, /설명|함께/, /모니터/, /상담/];
    let scene = IMG.interior[0] as { src: string; alt: string };
    for (const re of WANT) {
      const hit = IMG.interior.find((p) => re.test(p.alt));
      if (hit) {
        scene = hit;
        break;
      }
    }
    const sz = imageSize(scene.src);
    return { src: scene.src, alt: scene.alt, ratio: sz ? sz.width / sz.height : 4 / 3 };
  })();

  return (
    <div className="sp">
      <SpaceHeader />
      <Hero />
      <Doctors doctors={doctors} />
      <Treatments pillars={pillars} photo={treatPhoto} />
      <Story photo={storyPhoto} />
      <Interior photos={interiors} />
      <Moment photo={momentPhoto} />
      <Visit />
      <MapSection />
      <SpaceFooter />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
 * 첫 화면
 *   레퍼런스: 화면을 꽉 채운 영상 + 왼쪽에 붙은 가는 명조 세 줄 + 작은 설명. 버튼 없음.
 *   ⚠️ 우리는 영상이 아니라 사진이고, 병원 사진은 흰 벽·큰 창 때문에 대체로 밝다.
 *      그대로 흰 글씨를 얹으면 묻힌다(빌더에서 실제로 겪었다).
 *      그래서 **왼쪽만** 어둡게 깐다 — 글은 읽히고 사진은 산다.
 * ══════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* 폴백 배경 — 사진마저 늦게 뜨는 회선에서도 화면이 비지 않는다. */}
      <div aria-hidden className="absolute inset-0 bg-brand-900" />
      {/*
        ★ 레퍼런스의 첫 화면은 **영상**이다(개발자도구에서 main.webm 을 확인했다).
          이 프로젝트에는 배경 영상 자산과, 화면 크기를 재서 하나만 늦게 붙이는
          컴포넌트가 이미 있다 — 새로 만들지 않고 그대로 쓴다
          (components/HeroMedia.tsx 의 성능 주석 참조).
        ⚠️ 영상이 막히거나 늦으면 사진이 그대로 남는다. HeroMedia 가 그렇게 짜여 있다.
      */}
      <HeroMedia />
      {/*
        왼쪽만 눌러 주는 스크림 — 위 주석 참조.
        ⚠️⚠️ 여기 대비가 1.01:1 로 나온다는 측정을 믿지 말 것 (2026-08-28) ⚠️⚠️
          뒤가 **움직이는 화면**이라, 글자를 껐다 켜며 두 장을 찍어 비교하는 방식은
          여기서 못 쓴다 — 두 장 사이에 배경이 움직여서 '가장 많이 변한 픽셀' 이
          글자가 아니라 배경 픽셀이 된다. 그래서 늘 1.01 이 나온다(우연히 같은 값이 아니다).
          한 장 안에서 글상자의 가장 밝은 값과 가장 어두운 값을 재면 **15.80:1** 이다.
          그 가짜 신호를 믿고 스크림을 두 번 어둡게 만들었다가 되돌렸다. 반복하지 말 것.
      */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(24,22,20,.74) 0%, rgba(24,22,20,.58) 32%, rgba(24,22,20,.16) 62%, rgba(24,22,20,.06) 100%)',
        }}
      />

      {/*
        ⚠️ 아래쪽에 채널 버튼이 붙으므로 본문을 그만큼 위로 올린다.
           안 그러면 "오시는 길 / 전화번호" 바로 아래에 알약이 붙어 뭉친다(실측).
      */}
      <div className="relative w-full px-6 pb-[190px] lg:px-16">
        <p className="sp-label on-photo sp-rise !text-white" style={{ animationDelay: '80ms' }}>
          {CLINIC.nameEn}
        </p>

        {/*
          ★ 레퍼런스는 제목을 **세 줄로 끊어** 왼쪽에 세운다. 한 줄로 길게 뽑는 것과
            인상이 완전히 다르다 — 줄이 끊길 때마다 눈이 멈추고, 그 멈춤이 여백을 만든다.
        */}
        <h1
          className="sp-serif sp-rise mt-7 text-white"
          style={{ fontSize: 'clamp(28px,3.9vw,50px)', animationDelay: '180ms' }}
        >
          자연 그대로의 치아를
          <br />
          최대한 살리는 것,
          <br />
          {CLINIC.shortName}
        </h1>

        <p
          className="sp-rise mt-8 max-w-[38ch] text-[15px] leading-[2] text-white/75"
          style={{ animationDelay: '300ms' }}
        >
          {CLINIC.tagline}. 고양시 덕양구 화정동에서 자연치아를 먼저 살피고,
          필요한 만큼만 치료합니다.
        </p>

        <div className="sp-rise mt-12 flex flex-wrap gap-10" style={{ animationDelay: '420ms' }}>
          <Link href="/visit" className="sp-arrow !text-white">
            오시는 길
          </Link>
          <a href={CLINIC.phoneHref} className="sp-arrow !text-white">
            {CLINIC.phone}
          </a>
        </div>
      </div>

      <HeroChannels />
      <HeroBadge />
    </section>
  );
}

/* ══════════════════════════════════════════════════════
 * 첫 화면 왼쪽의 채널 버튼
 *
 * ★ 레퍼런스 히어로의 서명 중 하나 — 흰 알약이 왼쪽에 세로로 붙어 있다.
 *   본문 버튼은 얇은 선으로 두면서 **채널만 흰 면**으로 둔 것이라, 사진 위에서 유일하게
 *   눈에 드는 요소가 된다. 이 대비가 이 결의 성격이다.
 *
 * ⚠️ 실제로 있는 창구만 건다. 모양을 맞추려고 없는 채널을 만들면 누른 사람이 아무 데도 못 간다.
 * ⚠️ 화면이 좁으면 감춘다 — 모바일에는 이미 하단 바가 있어 두 벌이 겹친다.
 * ══════════════════════════════════════════════════════ */
function HeroChannels() {
  const items = [
    { label: 'NAVER', href: CLINIC.booking.naver, title: '네이버 예약' },
    { label: 'KAKAO', href: CLINIC.booking.kakao, title: '카카오톡 상담' },
    { label: 'BLOG', href: CLINIC.social.naverBlog, title: '네이버 블로그' },
  ];
  return (
    <ul className="absolute bottom-10 left-6 z-20 hidden flex-col gap-2.5 lg:left-16 lg:flex">
      {items.map((it, i) => (
        <li key={it.label}>
          <a
            href={it.href}
            target="_blank"
            rel="noreferrer"
            title={it.title}
            className="sp-rise flex h-11 w-[168px] items-center gap-3 rounded-full bg-white/92 pl-5 text-[13.5px] tracking-[0.16em] text-[color:var(--sp-ink)] backdrop-blur transition-colors duration-500 hover:bg-parchment"
            style={{ animationDelay: `${560 + i * 90}ms` }}
          >
            <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-[color:var(--sp-accent)]" />
            {it.label}
            <span className="sr-only">— {it.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ══════════════════════════════════════════════════════
 * 오른쪽 아래의 도는 원형 배지
 *
 * ★ 레퍼런스의 또 다른 서명 — 글자가 원을 따라 돌고 가운데에 마크가 있다.
 *   병원 이름이 한 번 더 나오는 자리이면서, 화면에 **유일하게 계속 움직이는 것**이라
 *   조용한 화면에 생기를 준다.
 *
 * ⚠️ SVG textPath 로 그린다 — 글자를 이미지로 만들면 검색엔진이 못 읽고 확대하면 뭉갠다.
 * ⚠️ aria-hidden 으로 둔다. 장식이고, 병원 이름은 제목에 이미 있다 —
 *    화면 읽기 프로그램에서 같은 이름이 두 번 읽히면 방해다.
 * ⚠️ 움직임에 민감한 사용자에게는 멈춘다(space.css 의 prefers-reduced-motion).
 * ══════════════════════════════════════════════════════ */
function HeroBadge() {
  return (
    <div aria-hidden className="absolute right-12 bottom-12 z-20 hidden lg:block">
      {/*
        ⚠️ 배지가 밝은 벽에 걸리면 흰 글자가 통째로 사라진다(실측).
           뒤에 아주 옅은 어두운 원을 깔아 어디에 놓여도 읽히게 한다.
      */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(15, 48, 42,.34) 40%, transparent 72%)' }}
      />
      <svg viewBox="0 0 160 160" className="sp-spin relative h-[156px] w-[156px]">
        <defs>
          <path
            id="sp-badge-path"
            d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0"
            fill="none"
          />
        </defs>
        <text
          fill="rgba(255,255,255,.92)"
          style={{ fontSize: 12.5, letterSpacing: '0.3em' }}
        >
          <textPath href="#sp-badge-path">
            CIRCLE DENTAL CLINIC · 자연치아를 먼저 ·
          </textPath>
        </text>
      </svg>
      {/* 가운데 마크 — 병원 이름의 모티프인 동그라미. */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="block h-10 w-10 rounded-full border border-white/70" />
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
 * 의료진
 *   레퍼런스의 대표 구성 — 왼쪽에 고정된 소개(라벨/제목/본문/화살표), 오른쪽에 가로로
 *   흐르는 카드. 카드 하나는 사진 + 베이지 정보판이 좌우로 붙어 있다.
 * ⚠️ 가로 스크롤은 **자바스크립트 없이** overflow-x 로만 만든다. 캐러셀 스크립트를 넣으면
 *    화면이 커지고, 스크립트가 실패했을 때 카드가 통째로 안 보인다.
 * ══════════════════════════════════════════════════════ */
function Doctors({ doctors }: { doctors: typeof DOCTORS }) {
  return (
    <section className={`${SECTION} sp-reveal`}>
      <div className="mx-auto grid max-w-[1560px] gap-14 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-20">
        <div className="lg:pt-10">
          <p className="sp-label">CIRCLE DOCTORS</p>
          <h2
            className="sp-serif mt-6"
            style={{ fontSize: SECTION_TITLE }}
          >
            세 명의 원장이
            <br />
            함께 봅니다
          </h2>
          <p className="mt-7 max-w-[34ch] text-[14.5px] leading-[2.05] text-[color:var(--sp-dim)]">
            같은 치료라도 누가 보느냐에 따라 판단이 달라집니다. 보존·근관·보철을 각각
            깊게 보는 원장들이 한 병원에서 함께 진료합니다.
          </p>
          <Link href="/about/doctors" className="sp-arrow mt-10">
            의료진 보기
          </Link>
        </div>

        {/*
          ⚠️ scrollbar 는 감추되 스크롤 자체는 살린다 — 터치로 밀 수 있어야 한다.
             (globals.css 의 .scrollbar-none 과 같은 뜻이지만 여기선 이 화면 안에서만.)
        */}
        {/*
          ⚠️ 스냅을 건다. 안 걸면 두 번째 카드의 **글 한가운데**에서 잘려 고장 난 것처럼 보인다
             (2026-08-19 운영자 지적). 레퍼런스도 다음 카드가 살짝 보이지만,
             보이는 것은 사진이지 잘린 글이 아니다.
        */}
        {/*
          ⚠️⚠️ 옆으로 밀리는 자리에는 **밀린다는 표시**가 있어야 한다 ⚠️⚠️
            표시가 없으니 두 번째 원장이 그냥 잘린 것처럼 보였다(운영자 지적, 실측 가로 넘침 32건).
            레퍼런스도 카드가 잘려 보이지만 **아래에 가는 진행 막대**가 있어서
            "밀면 더 있다" 로 읽힌다. 잘림 자체가 문제가 아니라 신호가 없던 것이 문제다.
          ★ 오른쪽 끝을 캔버스 색으로 흐리게 덮어 '이어진다' 는 느낌도 함께 준다.
        */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[color:var(--sp-canvas)] to-transparent"
          />
          <div className="sp-rail -mx-6 snap-x snap-mandatory overflow-x-auto px-6 pb-7 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex gap-6">
            {doctors.map((d) => (
              <li key={d.slug} className="flex w-[min(88vw,740px)] flex-none snap-start">
                {/*
                  ⚠️ 원본 비율을 그대로 쓴다. 3:4 틀에 끼웠더니 20% 가 잘렸다(실측).
                     크기를 명시하면 next/image 가 비율을 지키고 레이아웃도 안 흔들린다.
                */}
                {(() => {
                  const sz = imageSize(d.photo);
                  const h = 400;
                  const w = sz ? Math.round((sz.width / sz.height) * h) : 300;
                  return (
                    <Image
                      src={d.photo}
                      alt={`${d.name} ${d.role}`}
                      width={w}
                      height={h}
                      sizes="(max-width:1024px) 44vw, 380px"
                      className="h-[300px] w-auto flex-none object-cover sm:h-[400px]"
                    />
                  );
                })()}
                <div className="flex-1 bg-[color:var(--sp-band)] px-7 py-8">
                  <p className="text-[13.5px] tracking-[0.14em] text-[color:var(--sp-dim)]">
                    {d.role}
                  </p>
                  <p className="sp-serif mt-2 text-[26px]">{d.name}</p>
                  <ul className="mt-6 space-y-2">
                    {d.career.slice(0, 5).map((c) => (
                      <li
                        key={c}
                        className="flex gap-2 text-[13.5px] leading-[1.75] text-[color:var(--sp-dim)]"
                      >
                        <span aria-hidden className="mt-[7px] h-[3px] w-[3px] flex-none bg-current" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          </div>
          {/* 가는 진행 막대 — 밀 수 있다는 것을 말해 준다. */}
          <p className="mt-1 text-[11px] tracking-[0.18em] text-[color:var(--sp-dim)]">
            옆으로 밀어 보세요 ({doctors.length})
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
 * 진료
 *   레퍼런스 실측에서 border-radius 100% 가 28곳이었다 — 원이 이 사이트의 형태 언어다.
 *   그래서 진료 항목을 원으로 세운다.
 * ══════════════════════════════════════════════════════ */
function Treatments({
  pillars,
  photo,
}: {
  pillars: typeof TREATMENT_PILLARS;
  photo: { src: string; alt: string; ratio: number };
}) {
  return (
    <section className={`${SECTION} sp-reveal bg-[color:var(--sp-band)]`}>
      {/*
        ★ 레퍼런스의 진료 구역은 **큰 사진이 한쪽을 채우고** 원형 항목이 그 옆에 놓인다.
          원만 덩그러니 두면 33% 가 빈 화면이 된다(실측). 사진이 있어야 구역이 산다.
      */}
      <div className="mx-auto mb-14 max-w-[1560px]">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: String(Math.max(photo.ratio, 2.2)) }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="mx-auto max-w-[1560px] text-center">
        <p className="sp-label">CIRCLE TREATMENT</p>
        <h2 className="sp-serif mt-6" style={{ fontSize: SECTION_TITLE }}>
          무엇으로 오셨든
          <br />
          자연치아를 먼저 봅니다
        </h2>

        {/*
          ★ 원 안에 **시술 사진**을 넣는다. 글자만 든 원은 도형일 뿐이라 화면이 비어 보였다.
          ⚠️ 사진이 없는 시술은 글자만 남긴다 — 없는 사진을 다른 시술 것으로 채우면
             그 자체가 허위 표시다.
        */}
        <ul className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-14">
          {pillars.map((p) => {
            const shot = IMG.treatment[p.key as keyof typeof IMG.treatment];
            return (
              <li key={p.key}>
                <Link href={p.href} className="group block w-[min(74vw,268px)] text-center">
                  <span className="relative mx-auto block aspect-square w-full overflow-hidden rounded-full border border-[color:var(--sp-line)] bg-[color:var(--sp-canvas)] transition-colors duration-500 group-hover:border-[color:var(--sp-accent)]">
                    {shot && (
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        fill
                        sizes="268px"
                        className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-[color:var(--sp-ink)]/38 px-8">
                      <span className="sp-serif text-[20px] leading-[1.5] text-white">{p.name}</span>
                    </span>
                  </span>
                  <span className="mt-6 block px-3 text-[13.5px] leading-[1.9] text-[color:var(--sp-dim)]">
                    {p.copy}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
 * 이야기
 *   레퍼런스의 두 번째 리듬 — 사진이 왼쪽에서 화면 밖으로 흘러나가고 글이 오른쪽에 붙는다.
 *   첫 구역(왼쪽 글)과 좌우가 뒤집혀 있어 스크롤에 리듬이 생긴다.
 * ══════════════════════════════════════════════════════ */
function Story({ photo }: { photo: { src: string; alt: string; ratio: number } }) {
  return (
    <section className="sp-reveal relative overflow-hidden py-[clamp(64px,7vw,104px)]">
      <div className="mx-auto grid max-w-[1560px] items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,430px)] lg:gap-20 lg:px-10">
        {/*
          ⚠️ 틀을 4:3 으로 박아 두고 세로 사진(864×1211)을 넣었더니 46% 가 잘리고
             아래에 큰 빈 공간이 남았다(실측). 사진의 **제 비율**로 자리를 잡는다.
        */}
        <div
          className="relative w-full overflow-hidden lg:-ml-[8vw] lg:w-[calc(100%+8vw)]"
          style={{ aspectRatio: String(photo.ratio) }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width:1024px) 100vw, 60vw"
            className="object-cover"
          />
        </div>

        <div className="lg:text-right">
          <p className="sp-label">CIRCLE STORY</p>
          <h2 className="sp-serif mt-6" style={{ fontSize: SECTION_TITLE }}>
            빼지 않아도 되는 치아는
            <br />
            빼지 않습니다
          </h2>
          <p className="mt-7 text-[14.5px] leading-[2.05] text-[color:var(--sp-dim)] lg:ml-auto lg:max-w-[34ch]">
            임플란트가 마지막 선택이 될 수 있도록, 신경치료와 잇몸치료로 살릴 수 있는
            길을 먼저 찾습니다. 오래 쓰실 수 있는 방향인지부터 함께 확인합니다.
          </p>
          <Link href="/treatment/save-natural-tooth" className="sp-arrow mt-10">
            자연치아 살리기
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
 * 내부 둘러보기 — 사진이 오른쪽 화면 밖으로 이어진다(끝이 안 보이면 더 있다고 읽힌다).
 * ══════════════════════════════════════════════════════ */
function Interior({ photos }: { photos: (typeof IMG.interior)[number][] }) {
  /* ⚠️ 사진이 없는 병원도 있다 — 빈 구역을 그리면 만들다 만 화면이 된다. */
  if (photos.length === 0) return null;
  return (
    <section className="sp-reveal py-[clamp(64px,7vw,104px)]">
      <div className="mx-auto max-w-[1560px] px-6 lg:px-10">
        <p className="sp-label">CIRCLE SPACE</p>
        <h2 className="sp-serif mt-6" style={{ fontSize: SECTION_TITLE }}>
          치과가 편안한 공간이면
          <br />
          치료도 조금 덜 두렵습니다
        </h2>
      </div>

      <div className="relative mt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[color:var(--sp-canvas)] to-transparent"
        />
      <div className="overflow-x-auto pl-6 lg:pl-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/*
          ★ 높이만 맞추고 **폭은 사진이 정한다.** 가로 사진과 세로 사진이 섞여 있어도
            잘리는 곳 없이 한 줄로 흐른다 — 잡지의 사진 배열과 같은 방식이다.
          ⚠️ 비율을 하나로 강제하지 말 것. 처음에 4:5 로 묶었다가 35~49% 를 버렸다.
        */}
        <ul className="flex items-end gap-5 pr-6">
          {photos.map((p) => {
            const sz = imageSize(p.src);
            const h = 420;
            const w = sz ? Math.round((sz.width / sz.height) * h) : 560;
            return (
              <li key={p.src} className="flex-none">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={w}
                  height={h}
                  sizes="(max-width:1024px) 72vw, 520px"
                  className="h-[240px] w-auto max-w-none object-cover sm:h-[420px]"
                />
              </li>
            );
          })}
        </ul>
      </div>

      </div>
      <div className="mx-auto mt-12 max-w-[1560px] px-6 lg:px-10">
        <Link href="/about/tour" className="sp-arrow">
          전체 둘러보기
        </Link>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
 * 브랜드 모멘트
 *
 * ★ 레퍼런스는 정보 구역 사이에 **글이 거의 없는 한 장면**을 끼운다. 계속 읽기만 하면
 *   지치는데, 이런 자리가 한 번 쉬어 가게 해 준다.
 * ⚠️ 장식이지만 빈 화면은 아니다 — 병원 이름과 한 줄이 들어간다.
 * ══════════════════════════════════════════════════════ */
function Moment({ photo }: { photo: { src: string; alt: string } }) {
  return (
    <section className="sp-reveal relative flex min-h-[72vh] items-center justify-center overflow-hidden">
      <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-[#1a1815]/48" />
      <div className="relative px-6 text-center">
        <p className="sp-label on-photo !text-white">CIRCLE DENTAL CLINIC</p>
        <p className="sp-serif mt-6 text-white" style={{ fontSize: SECTION_TITLE }}>
          치아 하나를 오래 쓰는 일,
          <br />
          그것부터 함께 봅니다
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
 * 지도
 *
 * ★ 레퍼런스도 마지막에 지도를 넓게 깐다. "어디에 있는지" 는 병원 홈페이지에서
 *   가장 많이 찾는 정보 중 하나라, 링크로만 두면 한 번 더 눌러야 한다.
 * ⚠️ 좌표가 확인되지 않은 병원에서는 ClinicMap 이 스스로 아무것도 그리지 않는다 —
 *    없는 위치를 찍지 않는다는 뜻이라 그대로 둔다.
 * ══════════════════════════════════════════════════════ */
function MapSection() {
  return (
    <section className="sp-reveal">
      <ClinicMap height={520} />
    </section>
  );
}

/* ══════════════════════════════════════════════════════
 * 내원 안내
 *
 * ⚠️⚠️ 여기가 가장 비어 있었다 — **65% 가 빈칸**이었다(실측) ⚠️⚠️
 *   주소·전화만 네 줄 넣고 140px 여백을 양쪽에 뒀으니 당연했다.
 *   레퍼런스는 같은 자리에 **진료시간 표 + 큰 예약 창구 세 칸**을 둔다. 그래서 화면이 찬다.
 *   여백을 흉내 내기 전에 **채울 것을 먼저** 넣어야 했다.
 *
 * ★ 진료시간은 lib/clinic.ts 한 곳에서만 읽는다. 여기에 다시 적으면 반드시 어긋난다.
 * ⚠️ 예약 창구는 **실제로 있는 것만** 건다(네이버 예약·카카오톡·전화). 없는 창구를
 *    모양 맞추려고 만들면 누른 사람이 아무 데도 못 간다.
 * ══════════════════════════════════════════════════════ */
function Visit() {
  const hours = UNVERIFIED.hours;
  /* ⚠️ ext 를 선택 속성으로 명시한다 — as const 로 두면 항목마다 타입이 갈려 못 읽는다. */
  const ways: Array<{ label: string; sub: string; href: string; ext?: boolean }> = [
    { label: '오시는 길', sub: '지도와 대중교통', href: '/visit' },
    { label: '네이버 예약', sub: '바로 예약하기', href: CLINIC.booking.naver, ext: true },
    { label: '카카오톡 상담', sub: '궁금한 것을 물어보세요', href: CLINIC.booking.kakao, ext: true },
  ];

  return (
    <section className={`${SECTION} sp-reveal bg-[color:var(--sp-band)]`}>
      <div className="mx-auto max-w-[1560px]">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-24">
          <div>
            <p className="sp-label">CIRCLE VISIT</p>
            <h2 className="sp-serif mt-6" style={{ fontSize: SECTION_TITLE }}>
              {CLINIC.address.dong}에서
              <br />
              기다리고 있습니다
            </h2>
            <p className="mt-7 text-[14.5px] leading-[2.05] text-[color:var(--sp-dim)]">
              {CLINIC.address.full}
              <br />
              {CLINIC.nearestStation}
            </p>
            <a href={CLINIC.phoneHref} className="sp-serif mt-8 block text-[30px] tracking-[0.02em]">
              {CLINIC.phone}
            </a>
          </div>

          {/* 진료시간 — 가장 많이 확인하는 정보라 가장 넓은 자리에 둔다. */}
          <dl className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
            {hours.display.map((h: { label: string; time: string; note?: string }) => (
              <div key={h.label} className="border-t border-[color:var(--sp-line)] pt-5">
                <dt className="sp-label">{h.label}</dt>
                <dd className="mt-3 text-[16px] tracking-[0.02em]">
                  {h.time}
                  {h.note && (
                    <span className="ml-2 text-[13.5px] text-[color:var(--sp-dim)]">{h.note}</span>
                  )}
                </dd>
              </div>
            ))}
            <div className="border-t border-[color:var(--sp-line)] pt-5 sm:col-span-2">
              <dt className="sp-label">CLOSED</dt>
              <dd className="mt-3 text-[16px]">{hours.closed}</dd>
            </div>
          </dl>
        </div>

        {/* 예약 창구 — 레퍼런스의 세 칸 구성. 큰 면이 있어야 구역이 닫힌다. */}
        <ul className="mt-16 grid gap-4 sm:grid-cols-3">
          {ways.map((w) => (
            <li key={w.label}>
              <a
                href={w.href}
                {...(w.ext ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="group flex h-[168px] flex-col justify-between border border-[color:var(--sp-line)] bg-[color:var(--sp-canvas)] p-7 transition-colors duration-500 hover:border-[color:var(--sp-accent)]"
              >
                <span className="sp-label">{w.sub}</span>
                <span className="sp-serif flex items-center justify-between text-[21px]">
                  {w.label}
                  <span
                    aria-hidden
                    className="block h-px w-10 bg-current transition-all duration-500 group-hover:w-16"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
