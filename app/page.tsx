import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  CLINIC,
  UNVERIFIED,
  TREATMENT_PILLARS,
  PUBLICATION,
} from '@/lib/clinic';
import { IMG } from '@/lib/assets';
import { heroFacts } from '@/lib/heroFacts';
import { HeroMedia } from '@/components/HeroMedia';
import { HeroMarquee } from '@/components/HeroMarquee';
import { CredentialFan } from '@/components/CredentialFan';
import { DoctorStage } from '@/components/DoctorStage';
import { Reveal } from '@/components/Reveal';
import { InteriorSlider } from '@/components/InteriorSlider';
import { DOCTORS, PUBLICATION_DETAIL } from '@/lib/doctors';
import { TREATMENTS } from '@/lib/treatments';
import { Container, SectionHead, ContactCta, Sentences } from '@/components/ui';
import { CopyButton } from '@/components/CopyButton';
import { WhyUsSection } from '@/components/WhyUsSection';
import { HomeFaqSection } from '@/components/HomeFaqSection';
import { ConcernsSection } from '@/components/ConcernsSection';
import { JsonLd } from '@/components/JsonLd';
import { medicalWebPageSchema, faqSchema, imageObjectSchema } from '@/lib/seo';
import { CLINIC_QA, HOME_FAQ_COUNT } from '@/lib/faq';
import { imageMeta } from '@/lib/imageSize';

export const metadata: Metadata = {
  title: `${CLINIC.name} | 고양시 덕양구 화정동 치과`,
  description:
    '고양시 덕양구 화정동 동그라미치과의원. 10년 이상 경력의 대학병원 교수 출신 대표원장이 진료합니다. 자연치아살리기·임플란트·심미치료·사랑니치료. 화·목 야간진료 오후 8시 30분까지.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  /*
   * ★★ 홈에도 FAQPage 를 낸다 (2026-08-14) ★★
   *   전에는 "/faq 가 이미 같은 문답으로 내고 있어 두 URL 이 다투게 된다" 는 이유로
   *   홈에서는 일부러 안 냈다. 다시 보면 그건 과한 조심이었다 — 구글이 금지하는 것은
   *   **화면에 없는 문답을 마크업하는 것**이지, 같은 문답이 두 문서에 보이는 것이 아니다.
   *   홈의 여섯 개는 아래 FAQ 섹션이 실제로 화면에 그린다.
   *
   *   ⚠️⚠️ 여기 배열은 반드시 **화면이 그리는 것과 같은 slice** 여야 한다 ⚠️⚠️
   *      숫자를 여기서 새로 만들지 않고 lib/faq.ts 의 HOME_FAQ_COUNT 를 그대로 쓴다.
   *      화면은 6개인데 마크업에 12개를 넣는 순간 구조화 데이터 정책 위반이고
   *      수동 조치 대상이 된다.
   */
  const homeFaq = CLINIC_QA.slice(0, HOME_FAQ_COUNT);
  /** 대표 이미지 — 크기는 파일에서 직접 읽는다. 손으로 적으면 사진 교체 순간 거짓값이 된다. */
  const heroImage = imageMeta(IMG.interior[0].src, IMG.interior[0].alt);

  return (
    <>
      <JsonLd
        data={[
          medicalWebPageSchema({
            title: `${CLINIC.name} — 고양시 덕양구 화정동 치과`,
            description: metadata.description as string,
            path: '/',
            image: heroImage,
          }),
          heroImage ? imageObjectSchema({ path: '/', ...heroImage }) : null,
          faqSchema(homeFaq, '/'),
          /*
            ⚠️⚠️ 여기에 HowTo 를 다시 넣지 말 것 (2026-08-14) ⚠️⚠️
              절차 다섯 단계를 홈에서 /about/process 로 옮기면서 이 마크업도 함께 뺐다.
              **화면에 없는 절차를 HowTo 로 내면 구조화 데이터 정책 위반**이고 수동 조치 대상이다.
              절차 HowTo 는 그 단계들이 실제로 보이는 /about/process 가 그대로 내고 있다.
          */
        ]}
      />
      {/*
        ★★ 홈에 남길 것만 남긴다 (2026-08-18 운영자: "진짜 필요한 내용만") ★★

          13,434px 를 재 보니 열한 섹션이 5~15%씩 고르게 차지하고 있었다. 고르다는 것은
          **무엇이 중요한지 화면이 말해 주지 않는다**는 뜻이다. 처음 온 사람이 결정하는 데
          필요한 것만 남기고 나머지는 이미 있는 전용 페이지로 넘겼다.

            1 Hero       누구이고 지금 갈 수 있는가
            2 Doctor     누가 보는가 — 병원 선택에서 가장 강한 신호
            3 Concerns   내 망설임이 여기 있는가
            4 Pillar     무엇을 하는가 (사진 네 갈래)
            5 Interior   어떤 공간인가 (자동으로 넘어가는 슬라이드)
            6 FAQ        궁금증 해소
            7 Hours      언제·어디로
            8 Cta        연락

          옮긴 것 — WhyUs 12가지 → /about · 사회공헌 → /about(이미 있었음) ·
                   미리 알아두기 홍보 → 제거 · 지도 → /visit
          바꾼 것 — 증상으로 찾기 자리를 **병원 둘러보기**로 (2026-08-18 운영자).
                   증상 입구는 망설임 섹션의 "증상으로 찾아보기" 와 주 메뉴가 맡는다.

        ★ 검색·AI 는 순서보다 **문서에 있는가**를 본다. 옮긴 내용도 사이트 안에 그대로 있고
          링크가 살아 있으므로 인용 가능성은 유지된다. 반대로 사람은 순서와 분량에
          그대로 영향을 받는다.

        ★★ 지난 판단들 (되돌리기 전에 읽을 것) ★★
          · 섹션을 13 → 11 로 합쳤다가 되돌렸다 — "스크롤 안 줄여도 된다. 퀄리티가 우선."
            세로로 긴 것은 문제가 아니고 **한 화면에 두 이야기가 눌려 드는 것**이 문제다.
          · 신뢰 지표 표는 /about/trust, 진행 절차는 /about/process 가 맡는다.
          · 진료 열 줄 목록은 /treatment 가 맡는다.
          ⚠️ 위 셋을 홈으로 다시 가져오지 말 것 (가져오려면 운영자 GO 필요).
      */}
      {/*
        ★★ 홈을 덜어냈다 (2026-08-18 운영자: "진짜 필요한 내용만 남기고 다 다른 페이지로") ★★

          13,434px 를 재 보니 열한 섹션이 5~15%씩 고르게 차지하고 있었다. 고르다는 것은
          **무엇이 중요한지 화면이 말해 주지 않는다**는 뜻이다. 처음 온 사람이 결정하는 데
          필요한 것만 남기고 나머지는 이미 있는 전용 페이지로 넘긴다.

          남긴 것 — 누구이고(Hero) · 누가 보고(Doctor) · 내 망설임이 여기 있고(Concerns) ·
                   무엇을 하고(Pillar) · 내 증상에서 시작하고(Symptom) ·
                   자주 묻는 것(FAQ) · 언제 어디로(Hours)

          옮긴 것
            · WhyUs 12가지 (1,584px)  → /about  (그 페이지가 '무엇이 다른가' 를 다룬다)
            · 병원 둘러보기 (806px)    → /about/tour  **이미 같은 내용이 있었다**
            · 사회공헌 (707px)        → /about       **이미 같은 내용이 있었다**
            · 미리 알아두기 홍보 (678px) → 제거. 바로 위 증상 섹션이 같은 곳(/insight)으로
                                        보내고 있었다. 한 목적지에 두 섹션은 낭비다.
            · 지도 (약 550px)         → /visit 에만. 주소·전화는 홈에 남는다.

        ⚠️ 링크는 하나도 안 끊는다. 옮긴 것들은 전부 주 메뉴·푸터에서 닿고,
           /about 카드에서도 닿는다(아래 재크롤로 확인 — 고아 페이지 0).
        ⚠️ FAQ 는 남긴다. 홈의 FAQPage 스키마가 그 화면을 근거로 나가므로,
           섹션을 빼면 스키마도 함께 빼야 한다(app/page.tsx 위 JsonLd 주석 참고).
      */}
      <Hero />
      <DoctorSection />
      <ConcernsSection />
      <PillarSection />
      {/*
        ★★ 신뢰 지표를 /about/trust 로 옮겼다 (2026-08-14 운영자) ★★
          숫자 여섯 + 인증표 다섯 줄 + 논문 + 방송 + 진료시간을 홈 한 화면에 몰아넣으니
          **아무것도 눈에 안 들어왔다**(운영자: "가시성 가독성 떨어진다").
          홈은 의료진 섹션의 인증패 쇼케이스로 "그런 근거가 있다" 까지만 하고,
          실제 표와 목록은 전용 페이지가 맡는다.
        ⚠️ 홈에서 뺐다고 링크까지 빼면 안 된다 — 의료진 섹션 안에 '근거 · 인증 전체 보기'
           버튼을 두었고 주 메뉴에도 올렸다.
      */}
      {/*
        ★★ 진행 절차를 /about/process 로 되돌렸다 (2026-08-14 운영자) ★★
          다섯 단계를 가로로 펼치니 카드마다 글이 다섯 줄씩 들어가 홈에서 읽히지 않았다.
          절차는 **내원을 결심한 사람이 찾아 읽는 것**이지 훑는 사람에게 들이밀 것이 아니다.
        ⚠️ 링크는 살아 있다 — 주 메뉴(병원 소개 → 진료 절차), 푸터, 그리고 아래 FAQ 섹션에
           '처음 오시면 어떻게 진행하나요?' 로 걸어 두었다.
      */}

      {/*
        ★★ 진료 영역 열 줄 목록을 /treatment 로 옮겼다 (2026-08-14 운영자) ★★
          위 PillarSection 이 이미 '어떤 진료를 받을 수 있나요?' 에 사진 카드로 답하는데
          그 바로 아래에서 같은 질문에 열 줄로 다시 답하고 있었다. 홈만 길어지고
          어느 쪽도 끝까지 안 읽힌다.
        ⚠️ 링크는 살아 있다 — PillarSection 아래 '전체 진료과목' 버튼과 주 메뉴(진료),
           그리고 헤더 메가메뉴의 진료 목록이 그 길이다.
      */}
      <InteriorSection />
      <HomeFaqSection />
      <HoursSection />
      <ContactCta />
    </>
  );
}

/**
 * 히어로.
 *
 * ★ 배경은 기존 홈페이지가 쓰던 Vimeo 영상을 그대로 임베드한다(lib/assets.ts 주석 참조).
 *   영상은 `pointer-events-none` 으로 클릭을 막고, 위에 어두운 그라데이션을 덮어
 *   흰 글씨의 대비를 확보한다. 영상 위 텍스트는 대비가 무너지기 쉬워서
 *   `.on-photo` 로 아주 옅은 그림자까지 함께 깐다.
 * ★ 카피는 기존 홈페이지 1번 슬라이드 원문 그대로다.
 * ★ 영상이 뜨지 않는 환경(느린 네트워크·차단)에서도 배경이 비지 않게
 *   아래에 브랜드 그라데이션을 깔아 둔다.
 */
function Hero() {
  const facts = heroFacts();

  return (
    /*
     * ★ 히어로 전체가 한 화면에 들어가게 세로 배치로 짠다.
     *   사실 띠를 뒤에 그냥 붙이면 화면 높이 뒤에 더해져 **스크롤해야 보인다.**
     *   첫 화면에서 사실을 보여 주는 것이 이 띠의 존재 이유라 그러면 의미가 없다.
     */
    /*
     * ★★ 헤더 아래로 파고든다 (2026-08-25 운영자: "아예 똑같이 해줘. 헤더랑 전부") ★★
     *   두 번째 버전처럼 사진이 화면 맨 위까지 이어지고 헤더가 그 위에 투명하게 얹힌다.
     *   헤더는 sticky 라 흐름에서 자리를 차지하므로, 음수 위쪽 여백으로 그만큼 끌어올린다.
     *   ⚠️ 값(60/86)은 SiteHeader 의 안 내린 상태 높이와 **같아야 한다**. 헤더 높이를
     *      바꾸면 여기도 같이 바꿀 것 — 안 그러면 위에 크림색 띠가 남는다.
     *   ⚠️ 헤더 쪽 짝은 SiteHeader 의 overHero 다. 한쪽만 되돌리면 흰 글씨가 크림색
     *      배경 위에 놓여 통째로 사라지거나, 사진이 헤더에 잘린다.
     *
     * ★ 높이 — 이제 화면 맨 위에서 시작하므로 한 화면 전체를 쓴다.
     *   ⚠️ 모바일은 하단 고정 바(66px)를 빼야 사실 띠가 그 바에 가리지 않는다.
     *   ⚠️ vh 가 아니라 svh/dvh — 주소창이 접히며 vh 가 변해 화면이 한 번 출렁인다.
     */
    <section className="relative -mt-[60px] flex min-h-[calc(100dvh-66px)] flex-col overflow-hidden sm:-mt-[86px] lg:min-h-screen">
      {/* 폴백 배경 — 사진마저 늦게 뜨는 회선에서도 화면이 비지 않는다. */}
      <div aria-hidden className="absolute inset-0 bg-[#0d1113]" />

      {/* 사진을 깔고 그 위로 영상이 서서히 겹친다 — components/HeroMedia.tsx 주석 참조. */}
      <HeroMedia />

      {/*
        가독성 오버레이 — 배경 위 흰 글씨의 대비를 확보한다.
        ★★ 두 번째 버전의 값을 그대로 쓴다 (2026-08-25) ★★
           위(헤더)와 아래(문구·띠)를 누르고 가운데는 40% 만 눌러 사진을 살린다.
           예전에는 가운데가 가장 어두운 타원을 한 겹 더 깔았는데, 글이 아래로 내려온
           지금은 그 타원이 글도 없는 화면 한가운데만 거무스름하게 만든다.
        ⚠️ 색이 brand-900(#22201d, 웜)이 아니라 중성 먹색(8,12,14)이다 — v2 와 같은
           인상을 내려면 스크림 색부터 같아야 한다. 갈색 스크림은 사진을 누렇게 만든다.
      */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg,rgba(8,12,14,.62) 0%,rgba(8,12,14,.40) 40%,rgba(8,12,14,.88) 100%)',
        }}
      />

      {/*
        ★ 로드 시퀀스 — 눈썹 → 제목 → 설명 → 버튼 → 사실 띠 순으로 한 번 떠오른다.
          한 번에 다 나타나는 것보다 '읽는 순서' 를 몸으로 알려 준다. 60~80ms 씩만 어긋내
          알아채기 전에 끝난다 — 기다림으로 느껴지는 순간부터는 방해다.
      */}
      {/*
        ★ 마퀴 — 화면 맨 위를 가로지른다. 흐름 안에 둔다(absolute 금지).
          띄워 두면 글자 크기가 화면 **폭**(13.9vw)을 따르는 탓에, 폭이 넓고 세로가
          짧은 창에서 아래 글 덩어리와 서로를 모른 채 겹친다. flex 열에 넣어 두면
          겹칠 수가 없다.
        ⚠️ 위 여백은 '헤더 높이 + 4vh' 다 — 헤더가 투명하게 겹쳐 있으므로 그만큼
           내려야 로고·메뉴와 글자가 부딪히지 않는다. 헤더 높이를 바꾸면 여기도 같이.
      */}
      <div
        className="enter relative shrink-0 pt-[calc(60px+4vh)] sm:pt-[calc(86px+4vh)]"
        style={{ animationDelay: '60ms' }}
      >
        <HeroMarquee text="Save your own tooth" />
      </div>

      {/*
        ★★ 가운데 정렬 → 왼쪽 아래 (2026-08-25 운영자: "히어로는 두번째버전 디자인이
           좋은것 같아") ★★ 두 번째 버전처럼 문구·버튼·사실 띠를 한 덩어리로 묶어
           화면 아래에 붙인다. mt-auto 가 남는 자리를 위에 몰아준다 — 자리가 모자라면
           히어로가 조금 길어질 뿐 마퀴와 겹치지 않는다.
        ⚠️ 글은 왼쪽 정렬이지만 **컨테이너는 본문과 같은 Container** 를 쓴다. 다른
           섹션들과 왼쪽 기준선이 어긋나면 첫 화면만 따로 노는 것처럼 보인다.
           (두 번째 버전은 자기만의 여백 식(7.24vw)을 쓰는데, 그걸 그대로 옮기면
            이 사이트에서는 히어로만 오른쪽으로 밀려 아래 섹션들과 어긋난다.)
      */}
      <Container className="relative mt-auto pb-7 pt-10 sm:pb-9 sm:pt-16">
        {/*
          지역 한 줄 — 첫 화면에서 "어디 병원인지" 를 못박는다.
          ⚠️ 예전 이 자리의 "10년 이상 경력의 대학 병원 출신 의료진…" 문장은 아래
             사실 띠가 더 구체적으로 말한다(전문의 3인 / 대표원장 외래교수).
             같은 말을 두 번 하지 않으려고 뺐고, 대신 히어로에 없던 지역을 넣었다.
        */}
        <p
          className="enter on-photo text-[13px] font-bold tracking-[-0.01em] text-white/75"
          style={{ animationDelay: '140ms' }}
        >
          고양시 덕양구 화정동
        </p>

        {/*
          ⚠️ 여기만 이 사이트의 .display(900, 자간 -0.042em)를 쓰지 않는다.
             두 번째 버전과 같은 인상을 내려면 크기·굵기·자간이 같아야 한다
             (extrabold 800 / -0.03em / clamp 18~44px). .display 를 다시 씌우면
             글자가 두 단계 굵어지고 커져서 배치가 통째로 달라진다.
          ⚠️ clamp 로 화면 폭을 따라가므로 어느 폭에서도 한 줄이다 — 줄바꿈을 억지로
             넣지 말 것.
        */}
        <h1
          className="enter on-photo mt-3 text-[clamp(18px,7vw,44px)] leading-[1.34] font-extrabold tracking-[-0.03em] text-white"
          style={{ animationDelay: '220ms' }}
        >
          환자 중심 진료, 소통하는 치과
        </h1>

        {/*
          무엇을 보는지 — 항목만. 문장으로 늘리지 않는다.
          ⚠️ 이름을 여기 직접 적지 않는다. TREATMENT_PILLARS 가 진료 카드 섹션과
             같은 원본이라, 한쪽만 바뀌면 첫 화면과 본문이 어긋난다.
        */}
        <p
          className="enter on-photo mt-4 text-[15px] font-medium tracking-[-0.01em] text-white/70"
          style={{ animationDelay: '280ms' }}
        >
          {TREATMENT_PILLARS.map((p) => p.name).join(' · ')}
        </p>

        {/*
          ★★ 버튼 규격을 두 번째 버전에 맞췄다 (2026-08-25 운영자: "아예 똑같이") ★★
             전에는 흰 알약 두 개가 h-64px / w-236px 로 크게 못 박혀 있었다. v2 는
             더 작고(px-8 py-3.5, 15px) **주 버튼이 흰색이 아니라 브랜드색으로 채워진다.**
             글자 크기·굵기·여백을 v2 값 그대로 가져오고, 폭은 못 박지 않는다(내용만큼).
          ⚠️ 폭을 안 박으므로 두 버튼의 폭이 글자 수만큼 달라진다 — v2 도 그렇다.
             예전의 '둘을 정확히 같은 크기로' 규칙은 이 배치에는 적용하지 않는다.
        */}
        <div
          className="enter mt-7 flex flex-wrap items-center gap-3"
          style={{ animationDelay: '340ms' }}
        >
          {/*
            ★★ 첫 버튼을 전화번호 → '예약하기' 로 (2026-08-14 운영자) ★★
              첫 화면의 주 버튼은 **가장 많은 사람이 하려는 행동** 하나여야 한다.
              전화번호를 적어 두면 '지금 전화할 수 있는 사람' 에게만 버튼이고,
              근무 중이거나 밤에 보는 사람에게는 누를 수 없는 버튼이다.
              예약은 시간과 무관하게 누를 수 있다.
            ★ 전화가 사라지는 것은 아니다 — 헤더(데스크톱)·햄버거 메뉴(모바일)·
              오른쪽 아래 버튼·푸터·하단 고정 바에 그대로 있다.
            ★ 외부 도메인이라 새 창 + rel="noopener" — 없으면 열린 창이 window.opener 로
              이 페이지를 조작할 수 있다.
          */}
          {/*
            ★★ 두 버튼의 규격을 맞춘다 (2026-08-14 운영자) ★★
              전에는 글자 크기(18/17)·좌우 여백(px-9/px-8)·모서리가 서로 달랐고,
              첫 버튼에만 동그란 화살표가 붙어 있었다. 나란히 선 버튼 둘의 규격이 어긋나면
              **디자인이 아니라 실수처럼 보인다**.
              → 높이와 폭을 **못 박는다**(h/w). 모서리는 완전한 알약형(rounded-full) —
                병원 이름이 '동그라미'라 원형 모티프가 버튼에서도 이어진다.
            ★ 둘의 차이는 규격이 아니라 **무게**로 만든다. 주 버튼은 흰 면으로 채우고,
              보조 버튼은 테두리만 둔다. 사진 위라 흰 면이 가장 강하게 읽힌다.
            ⚠️ 여백(px/py)으로 크기를 맞추려 하지 말 것. 실제로 그렇게 해 봤더니
               ① '예약하기'(4자)와 '증상으로 찾아보기'(9자)의 폭이 190 vs 205 로 어긋났고
               ② 보조 버튼에만 있는 1.5px 테두리 때문에 높이가 56 vs 58 로 달라졌다.
               모바일에서 둘이 위아래로 쌓이면 그 15px 차이가 그대로 보인다.
               높이·폭을 직접 지정해야 어느 화면에서도 정확히 같은 크기로 선다.
          */}
          <a
            href={CLINIC.booking.naver}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="예약하기 — 네이버 예약 새 창으로 열기"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-mint-500 px-8 py-3.5 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            예약하기
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <Link
            href="/insight/symptom"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/35 px-7 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
          >
            증상으로 찾아보기
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Container>

      {/*
        ★★ 사실 띠 ★★
          확인된 사실만 올라온다(lib/heroFacts.ts 주석 참조).
          ⚠️ 여기를 홍보 문구로 메우지 말 것 — 그 순간 이 자리는 광고가 된다.
          ⚠️ 한 칸짜리 띠는 그리지 않는다. 넓은 띠에 값 하나면 뭔가 빠진 것처럼 보인다.
      */}
      {facts.length >= 2 && (
        <div
          className="enter relative border-t border-white/15"
          style={{ animationDelay: '420ms' }}
        >
          <Container>
            {/*
              ★★ 가운데 정렬 · 세로 칸막이 → 왼쪽 정렬 (2026-08-25, 두 번째 버전 이식) ★★
                 위 문구가 왼쪽으로 내려오면서 가운데 정렬한 띠만 따로 놀았다. 칸막이도
                 뺐다 — 위에 이미 가로 경계선이 있어 두 겹이 되고, 값의 길이가 제각각이라
                 칸막이가 글자와 붙는 자리가 생긴다.
              ⚠️ 배경 판(bg-brand-900/45 + backdrop-blur)도 뺐다. 아래로 갈수록 짙어지는
                 오버레이가 이미 이 자리를 충분히 눌러 준다. 판을 겹치면 띠만 도드라져
                 첫 화면이 두 덩어리로 갈린다.
              ⚠️ 열 수를 항목 수에 맞춘다 — 5열에 5칸. 넉 줄짜리 --cols 를 지우면
                 lg 에서 마지막 칸이 다음 줄로 떨어진다.
              ⚠️ 좁은 화면은 2열이고 다섯 번째(주차)는 한 줄을 통째로 쓴다. 예전에는
                 다섯 번째를 lg 미만에서 아예 감췄는데, 주차 여부는 **모바일에서 가장
                 많이 확인하는 값**이라 감출 것이 아니었다.
            */}
            <dl
              className="fact-strip grid grid-cols-2 gap-y-1 sm:grid-cols-3"
              style={{ ['--cols' as string]: facts.length }}
            >
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className={`py-4 pr-6 sm:py-5 ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  {/* 라벨·값 규격도 두 번째 버전 값 그대로 (11.5px / 0.14em, 15px bold). */}
                  <dt className="text-[11.5px] font-bold tracking-[0.14em] text-white/60 uppercase">
                    {f.label}
                  </dt>
                  <dd className="mt-1.5 text-[14px] font-bold leading-snug tabular-nums text-white sm:text-[15px]">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      )}
    </section>
  );
}

/** 진료 4대 축 — 기존 홈페이지 '동그라미 치과 진료정보' 섹션. 카피·이미지 모두 원문. */
function PillarSection() {
  const img = [
    IMG.treatment.natural,
    IMG.treatment.implant,
    IMG.treatment.aesthetic,
    IMG.treatment.wisdom,
  ];
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <div className="text-center">
          <p className="text-[12.5px] font-black tracking-[0.24em] text-brand-500 uppercase">
            Circle Dental Clinic
          </p>
          {/*
            ★ 제목을 질문형으로 둔다.
              AI 검색은 문서에서 "질문과 같은 제목 + 바로 뒤에 오는 짧은 답" 을 찾아 인용한다.
              '동그라미 치과 진료정보' 같은 명사구는 환자가 실제로 치는 문장과 매칭이 약하다.
              단, 질문만 던지고 끝내면 안 된다 — 바로 아래 한 문장으로 답한 뒤 카드로 펼친다.
              (진단에서 '질문형 제목 1/23' 으로 잡히던 항목이 이것이다.)
          */}
          <h2 className="display-sm mt-4 text-[30px] text-ink sm:text-[38px]">
            어떤 진료를 받을 수 있나요?
          </h2>
          <p className="mx-auto mt-5 max-w-[62ch] text-[16px] leading-[1.85] text-ink-soft">
            <Sentences text="자연치아를 살리는 치료를 중심에 두고 임플란트, 심미치료, 사랑니 발치까지 진료합니다. 충치·신경·잇몸 치료와 스케일링 같은 기본 진료도 함께 보고 있습니다." />
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TREATMENT_PILLARS.map((p, i) => (
            <Reveal key={p.key} delay={Math.min(i, 3) * 70} className="h-full">
            <Link
              href={p.href}
              className="group relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl shadow-[var(--shadow-soft)] transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]"
            >
              {/*
                alt 를 비워 두었었다. 카드에 제목이 글자로 있으니 스크린리더에는 중복이라는
                판단이었고 접근성 기준상 틀린 선택은 아니다. 다만 **AI 는 사진의 내용을
                alt 로만 안다** — 비워 두면 이 사진이 무엇인지 아는 경로가 없다.
                그래서 제목을 되풀이하지 않고 사진에 찍힌 것을 설명하는 문장을 넣는다.
                두 목적이 충돌하지 않는 유일한 지점이다.
              */}
              <Image
                src={img[i].src}
                alt={img[i].alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* 사진 위 글씨의 대비를 확보한다. 없으면 밝은 사진에서 흰 글씨가 사라진다. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent"
              />
              <div className="relative p-7">
                <span aria-hidden className="block h-px w-9 bg-white/70" />
                <h3 className="display-sm mt-4 text-[21px] text-white">{p.name}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-white/85">{p.copy}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-black tracking-[0.14em] text-white/90 uppercase">
                  More View
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>

        {/*
          ★ 홈에서 열 줄 목록을 뺀 대신 여기로 길을 낸다 (2026-08-14).
            카드 넷은 '무엇을 잘하는가' 를 보여 주지만 나머지 여섯(신경·잇몸·충치·보철·
            스케일링·어린이)으로 가는 길이 이 섹션 안에 없었다. 링크가 없으면 그 여섯은
            홈에서 존재하지 않는 것과 같다.
        */}
        <div className="mt-12 text-center">
          <Link
            href="/treatment"
            className="group inline-flex items-center gap-2.5 rounded-full border border-brand-300 bg-white px-7 py-3.5 text-[15px] font-black text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
          >
            전체 진료과목 {TREATMENTS.length}가지 보기
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

/*
 * (2026-08-14) StrengthSection 제거 — WhyUsSection 이 대신한다.
 *
 * '특별함 5가지' 와 'WHY US 12가지' 는 같은 사실을 두 번 말하는 것이라 둘 다 두면
 * 어느 쪽도 끝까지 안 읽힌다. 특별함 원문(SpecialGrid)은 /about 과 /about/special 에
 * 그대로 살아 있으므로 내용이 사라지는 것은 아니다.
 */

/**
 * 의료진 — 홈에서 히어로 다음으로 오는 섹션.
 *
 * ★★ 왜 사진을 크게 쓰는가 (2026-08-14 재설계) ★★
 *   예전에는 단체 사진 한 장 옆에 **56px 짜리 썸네일 세 개**를 붙여 뒀다.
 *   그런데 우리에겐 세 원장의 625×670 인물 사진이 이미 있다. 병원을 고르는 사람이
 *   가장 오래 보는 것이 사람 얼굴인데, 그 자산을 손톱만 하게 쓰고 있었던 셈이다.
 *   → 세 장을 같은 크기로 나란히 세우고 이름·자격·경력을 아래에 붙인다.
 *
 * ★ 카드마다 개별 페이지로 간다. 사람 이름은 그 자체로 검색 질의라("변석호 원장")
 *   각자의 페이지가 있어야 그 질의에 답할 수 있다.
 *
 * ★ 인증·논문은 얼굴 아래로 내렸다. 먼저 읽힐 것은 아니지만 지울 것도 아니다 —
 *   교수 출신·학회 정회원·발표 논문은 이 병원의 가장 단단한 근거다.
 *
 * ⚠️ 경력 문구는 lib/doctors.ts 에서만 온다. 여기서 만들지 않는다 —
 *    의료인 경력 허위 표시는 의료법 제56조 위반이다.
 */
function DoctorSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-brand-100/40 blur-3xl"
      />
      <Container className="relative">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            의료진 소개
          </p>
          <h2 className="display-sm mt-4 text-[30px] text-ink sm:text-[38px]">누가 진료하나요?</h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">
            <Sentences text="세 분 원장 모두 보건복지부 인정 통합치의학과 전문의입니다. 대표원장은 경희대학교 치의학전문대학원 외래교수이자 치의학박사입니다." />
          </p>
        </div>

        {/*
          ★★ 카드 세 장 → 무대 구도 (2026-08-25 운영자: "대표원장 가운데에 딱 뜨고
             그 왼쪽 오른쪽 밑에 각각 원장들 뜨고, 좀 카드 형식 말고 이렇게 원래
             동그라미치과 참고해서 스크롤이벤트랑 넣고") ★★
             원본(circle-dental.co.kr)은 세 분을 누끼로 따서 가운데가 크고 높게,
             양옆이 작고 낮게 세워 뒀다. 한 줄로 늘어놓은 카드 세 장과 달리 **구도
             자체가 위계를 말한다** — 누가 대표원장인지 글을 안 읽어도 보인다.
          ⚠️ 흰 카드·테두리·그림자를 없앤 대신 사진 아래를 마스크로 지운다. 안 지우면
             스튜디오 배경의 회색 네모가 바닥에 남아 '상자를 없앤' 게 아니라
             '테두리만 지운' 것이 된다(components/DoctorStage.tsx 주석 참조).
          ⚠️ 여기서 IntersectionObserver 를 새로 만들지 않는다 — 등장은 이 사이트의
             .reveal 클래스와 레이아웃에 하나뿐인 RevealScript 가 맡는다.
        */}
        <DoctorStage />
        {/*
          ★★ 원본 홈페이지와 같은 배치 — 네 장을 한 줄에 (2026-08-14 운영자) ★★
            자동으로 넘기는 쇼케이스를 만들었다가 되돌렸다. 운영자 판단은
            "그냥 이대로 나오게 하되 **줄이랑 규격을 맞춰라**" 다.

          ★★ 원본이 어긋나 있던 두 가지를 여기서 바로잡는다 ★★
            원본 홈페이지는 사진을 그대로 흘려 두어서
              ① 세 번째(세계근관치료학회, 236×178)만 다른 셋(236×242)보다 납작한데
                 세로 가운데 정렬이라 **혼자 아래로 내려앉고**,
              ② 그 바람에 캡션도 혼자 한참 아래에 찍힌다.
            → 같은 높이의 칸에 `object-contain` + **아래 정렬**로 담는다.
              비율이 달라도 네 장의 **밑변이 한 선에 서고**, 캡션도 같은 줄에서 시작한다.
              잘리는 인증서는 없다.

          ★ 액자를 씌우지 않는다 — 인증서 사진에 이미 금색 액자가 찍혀 있어
            테두리를 더하면 액자 안의 액자가 되고 그 여백만큼 인증서가 작아진다.
            그림자만 옅게 깔아 바탕에서 떠 보이게 한다.
          ⚠️ 원본이 236px 라 그보다 크게 늘리면 뭉개진다. 칸 높이를 200px 선에서 멈춘다.
        */}
        {/*
          ★★ 상자를 걷어냈다 (2026-08-25 운영자: "여기도 테두리좀 없애고") ★★
             테두리 + 옅은 바탕 + 안쪽 여백으로 묶어 두던 것을 없앴다. 바로 위
             의료진 무대도 상자가 없어졌는데 여기만 네모가 남아 한 섹션 안에서
             두 가지 언어가 섞여 있었다.
          ⚠️ 상자가 사라진 만큼 위아래 여백이 구분을 대신한다 — mt 를 줄이지 말 것.
             줄이면 인증패가 의료진 경력 줄에 붙어 한 덩어리로 읽힌다.
        */}
        <div className="mt-20 lg:mt-24">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.16em] text-brand-500 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            인증 · 수료
          </p>

          {/*
            ★★ 조명 hover → 부채꼴 펼침 + 커서 3D (2026-08-25 운영자: "이렇게 버전2에서
               스크롤 이벤트를 버전 1에도 입혀보자") ★★
               전에는 손을 올리면 뒤에서 빛이 번지고 액자가 떠오르는 연출이었다
               (2026-08-14 운영자: "마우스 갖다대면 임팩트"). 그 의도 — 상패는 빛을 받는
               물건이라는 것 — 는 그대로 살리되, 두 번째 버전의 **스크롤로 펼쳐지는 진열**
               로 바꿨다. 손을 올려야만 반응하던 것이 이제 스크롤만 해도 움직인다.
            ⚠️ 스포트라이트는 뺐다 — 펼침·기울기·층·바닥 그림자 넷이 이미 충분히 말한다.
               넷 위에 빛까지 겹치면 지저분해진다. 되살릴 거면 넷 중 하나를 빼고 넣을 것.
            ★ 링크·밑변 정렬·두 줄 캡션 높이는 그대로 유지했다(컴포넌트 주석 참조).
              세 가지 다 여기서 겪고 고친 것들이라 연출이 바뀌어도 끌고 간다.
          */}
          <CredentialFan />

          {/*
            발표 논문 — 원본도 인증패 아래에 가로로 긴 배너로 뒀다.
            제목만 적어 두면 '있다는 말' 로만 읽히므로 실물 화면을 함께 보여 준다.
          */}
          {/*
            ★★ 사진을 오른쪽 상자에 가두지 않고 **면 전체로** 쓴다 (2026-08-18 운영자) ★★
              원본 홈페이지가 이 자리를 가로로 긴 배너 한 장으로 뒀다. 왼쪽은 흐린 여백,
              오른쪽에 노트북과 논문이 있는 구도라 **여백 위에 글을 얹으라고 만든 사진**이다.
              그동안은 이걸 420px 상자에 넣어 노트북만 잘라 보여 줬는데, 그러면 사진이
              '첨부물' 이 되고 논문은 옆에 적힌 글로만 남는다.
              배너로 깔면 논문 화면 자체가 근거가 되고, 이 섹션에서 가장 무거운 자리가 된다.

            ★ 큰 화면에서만 글을 사진 위에 얹는다(왼쪽 52%). 좁은 화면에서는 사진 오른쪽의
              흰 논문 위로 글이 겹쳐 읽을 수 없게 되므로 **어둡게 덮는 정도를 다르게** 준다.
            ⚠️ 흰 글씨는 `.on-photo` 두 겹 그림자를 함께 쓴다. 이 사진은 흐린 밝은 배경이라
               덮개만으로는 글자 가장자리가 뭉갠다(globals.css .on-photo 주석).
          */}
          <div className="mt-12 border-t border-brand-200/70 pt-10">
            <div className="relative overflow-hidden rounded-2xl bg-brand-900">
              <Image
                src={PUBLICATION_DETAIL.banner}
                alt="발표 논문 화면 — Long-term Follow-up of Complicated Crown Fracture With Fragment Reattachment: Two Case Reports"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 1320px"
                /* 노트북이 오른쪽에 있다 — 좁아질수록 오른쪽을 남기고 왼쪽 여백부터 잘라낸다. */
                className="object-cover object-right"
              />
              {/*
                덮개를 **두 장으로 나눈다.**
                ⚠️ 한 요소에 `bg-brand-900/82 lg:bg-gradient-to-r` 를 같이 걸면 안 된다.
                   앞은 background-color, 뒤는 background-image 라 **서로 다른 속성**이고,
                   큰 화면에서 둘 다 살아남아 사진 전체가 어두워진다(논문 글씨가 안 보였다).
                ★ 좁은 화면 — 글이 사진 전체 위에 놓이므로 고르게 덮는다.
                ★ 큰 화면 — 글은 왼쪽 54%에만 있다. 왼쪽은 짙게, 노트북이 있는 오른쪽은
                  완전히 비운다. 멈춤 위치를 직접 적는 이유는 to-transparent 만으로는
                  가운데가 70%쯤 덮여 논문이 회색으로 뭉개지기 때문이다.
              */}
              <div aria-hidden className="absolute inset-0 bg-brand-900/82 lg:hidden" />
              <div
                aria-hidden
                className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,rgba(34,32,29,0.94)_0%,rgba(34,32,29,0.88)_34%,rgba(34,32,29,0.45)_54%,rgba(34,32,29,0)_70%)]"
              />

              <div className="relative px-7 py-12 sm:px-10 lg:w-[54%] lg:py-16 xl:py-20">
                <p className="on-photo flex items-center gap-2.5 text-[12px] font-black tracking-[0.16em] text-gold-400 uppercase">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                  발표 논문
                </p>
                <p className="on-photo mt-5 text-[17px] leading-[1.55] font-bold text-white sm:text-[19px]">
                  {PUBLICATION_DETAIL.title}
                </p>
                <p className="on-photo mt-3 text-[13.5px] text-brand-200">
                  {PUBLICATION_DETAIL.authors}
                </p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  <Link
                    href="/about/trust"
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14.5px] font-black text-brand-800 shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5"
                  >
                    근거 · 인증 전체 보기
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/about/doctors"
                    className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/45 px-6 py-3 text-[14.5px] font-black text-white transition-colors hover:bg-white/10"
                  >
                    의료진 소개
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * 내부 둘러보기 — 실제 병원 사진 갤러리.
 *
 * ★★ 홈에서 뺐다가 **되돌렸다** (2026-08-18 운영자) ★★
 *   홈을 덜어내면서 "같은 내용이 /about/tour 에 이미 있다" 는 이유로 지웠는데,
 *   운영자가 다시 넣기를 원했다. 맞는 판단이다 — 같은 사진이라도 **역할이 다르다.**
 *   /about/tour 는 찾아 들어가서 보는 자리이고, 홈의 이 슬라이드는 병원을 처음 보는
 *   사람에게 **공간을 먼저 보여 주는** 자리다. 저절로 넘어가는 움직임 자체가
 *   "볼 것이 더 있다" 를 알린다.
 * ⚠️ 다시 지우지 말 것 (지우려면 운영자 GO 필요).
 */
function InteriorSection() {
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <Reveal className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            공간
          </p>
          <h2 className="display-sm mt-4 text-[30px] text-ink sm:text-[38px]">
            어떤 공간에서 진료하나요?
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">
            <Sentences text="상담실과 진료실, 소독실까지 실제 사진입니다. 옆으로 넘겨 보실 수 있습니다." />
          </p>
        </Reveal>
        {/* 격자 대신 슬라이드 — 열두 장을 한 줄 자리로 다 보여 준다(components/InteriorSlider.tsx). */}
        <div className="mt-12">
          <InteriorSlider />
        </div>
        <div className="mt-10">
          <Link
            href="/about/tour"
            className="group inline-flex items-center gap-2 border-b-[1.5px] border-brand-400 pb-1 text-[14.5px] font-bold text-brand-700 transition-colors hover:border-brand-700"
          >
            둘러보기 페이지에서 전체 보기{' '}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function HoursSection() {
  /* 진료하는 시간과 쉬는 시간을 나눈다 — 화면에서 같은 줄에 섞이면 안 되는 두 종류다. */
  const open = UNVERIFIED.hours.display.filter((h) => h.label !== '점심시간');
  const lunch = UNVERIFIED.hours.display.find((h) => h.label === '점심시간');

  return (
    <section className="border-t border-brand-200/60 bg-brand-50/40 py-24 lg:py-28">
      <Container>
        {/*
          ★★ 한 덩이 안에서 **왼쪽 설명 · 오른쪽 표** (2026-08-18 운영자) ★★
            오늘 이 자리를 네 번 고쳤다. 남기는 이유가 아니라 **버린 이유**를 적어 둔다.

              ① 좌우 2단(진료시간 | 오시는 길)  → 버림. 둘 다 넣으려다 둘 다 좁아졌다.
                 시간표는 요일과 시간을 양 끝으로 벌려야 읽히는데 폭이 없어 줄이 붙었다.
              ② 탭으로 하나씩              → 버림. 운영자: "탭으로 나누지 말고."
              ③ 위아래로 쌓기              → 버림. 폭은 넉넉해졌는데 **너무 길어졌다**
                 (설명 아래 표, 그 아래 또 설명 아래 카드로 네 덩이가 세로로 늘어섰다).
              ④ 지금 — 각 덩이 안에서 왼쪽에 제목·설명, 오른쪽에 표·카드.
                 설명과 표가 **같은 높이를 나눠 쓰므로** 세로가 절반이 되고 폭도 산다.

          ★ 좌우를 5:5 로 나눈다 (2026-08-18 운영자: "너무 비율이 별론데").
            처음엔 왼쪽을 330px 로 좁게 잡았는데, 오른쪽 표가 과하게 넓어져
            제목과 표의 무게가 어긋나 보였다. 반씩 나누면 두 덩이가 같은 크기로 읽힌다.
          ⚠️ 여기서 오른쪽을 더 줄이지 말 것 — 시간표의 요일과 시간이 붙는다.
            (앞서 "왼쪽을 키우지 말 것" 이라고 적었던 것은 이 수정으로 뒤집혔다.)
          ⚠️ 좁은 화면에서는 그냥 쌓인다(lg 미만). 한 칸에서 좌우로 나누면 둘 다 못 읽는다.
        */}
        <div className="space-y-16 lg:space-y-20">
                <div className="min-w-0 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-x-14">
            {/* 질문형 제목 + 즉답. '치과 진료시간' 은 지역 검색에서 가장 흔한 질의 중 하나다. */}
            <SectionHead
              eyebrow="진료시간 안내"
              title="진료시간이 어떻게 되나요?"
              desc="평일은 오전 9시 30분에 시작합니다. 화요일과 목요일은 저녁 8시 30분까지 야간 진료를 하고, 토요일은 오후 2시까지 봅니다. 일요일과 공휴일은 쉽니다."
            />

            <div className="overflow-hidden rounded-2xl border border-brand-200/70 bg-white shadow-[var(--shadow-soft)]">
              {/*
                ★ 요일과 시간을 **양 끝으로** 벌리지 않고 시간을 크게 세운다.
                  치과 시간표에서 사람이 찾는 것은 요일이 아니라 **시간**이다.
                ★ 시간은 tabular-nums — 자릿수가 어긋나면 표가 흔들려 보인다.
              */}
              <dl>
                {open.map((h, i) => (
                  <div
                    key={h.label}
                    className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-5 sm:px-7 ${
                      i > 0 ? 'border-t border-brand-100' : ''
                    }`}
                  >
                    <dt className="flex items-center gap-2.5">
                      <span className="text-[15.5px] font-black text-ink">{h.label}</span>
                      {h.note && (
                        <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[11.5px] font-black text-gold-600">
                          {h.note}
                        </span>
                      )}
                    </dt>
                    <dd className="tabular text-[19px] font-black text-brand-700 sm:text-[21px]">
                      {h.time}
                    </dd>
                  </div>
                ))}
              </dl>

              {/*
                ★★ 쉬는 시간·휴진은 **아래 칸으로 분리한다** ★★
                  진료 시간과 같은 목록에 두면 "이때도 여는구나" 로 읽힌다.
                  배경을 눌러 색을 다르게 하고, 여는 시간이 아님을 글자로도 밝힌다.
              */}
              <div className="border-t border-brand-200/70 bg-brand-50/70 px-6 py-5 sm:px-7">
                <p className="text-[11.5px] font-black tracking-[0.14em] text-ink-muted uppercase">
                  이 시간에는 진료하지 않습니다
                </p>
                <div className="mt-3 space-y-2">
                  {lunch && (
                    <p className="flex items-center justify-between gap-4 text-[14.5px]">
                      <span className="font-bold text-ink-soft">{lunch.label}</span>
                      <span className="tabular font-black text-ink-soft">{lunch.time}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-[14.5px] font-bold text-ink-soft">
                    <span
                      aria-hidden
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-300 text-[10px] text-white"
                    >
                      ✕
                    </span>
                    {UNVERIFIED.hours.closed}
                  </p>
                </div>
              </div>
            </div>
                </div>

                <div className="min-w-0 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-x-14">
            {/* '어디에 있나요 / 주차 되나요' 는 내원 직전에 가장 많이 검색되는 두 문장이다. */}
            <SectionHead
              eyebrow="오시는 길"
              title="어디에 있고 주차는 되나요?"
              desc={`고양시 덕양구 화정동 ${CLINIC.address.building} 3층입니다. 주차는 ${CLINIC.parking.type}이며 ${CLINIC.parking.fee}입니다.`}
            />

            <div className="min-w-0">
            {/*
              ★★ 주소는 '읽는 값' 이 아니라 '쓰는 값' 이다 ★★
                택시 앱·카톡·지도 검색창에 붙여 넣으려고 보는 정보인데, 긴 주소를 손으로
                드래그하는 것은 휴대폰에서 특히 성가시다. 복사 버튼을 옆에 둔다.
            */}
            <div className="rounded-2xl border border-brand-200/70 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-7">
              <p className="text-[11.5px] font-black tracking-[0.16em] text-brand-500 uppercase">
                주소
              </p>
              <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                <p className="max-w-[36ch] text-[16.5px] leading-relaxed font-bold text-ink">
                  {CLINIC.address.full}
                </p>
                <CopyButton text={CLINIC.address.full} />
              </div>
              <p className="mt-2.5 text-[13.5px] text-ink-muted">
                {CLINIC.address.building} · {CLINIC.nearestStation} 인근
              </p>

              {/* 전화는 가장 큰 요소로. 내원 결정의 마지막 한 걸음은 여전히 전화다. */}
              {/*
                ⚠️ 좁은 화면에서는 **세로로 쌓는다** (2026-08-14 실측).
                   라벨과 번호를 양 끝으로 벌리면 390px 화면에서 둘 다 두 줄로 쪼개져
                   "대표전화 /" / "FAX" · "031-972-" / "2875" 로 깨졌다.
                   번호는 절대 쪼개지면 안 되는 값이라 whitespace-nowrap 을 함께 건다.
              */}
              <a
                href={CLINIC.phoneHref}
                className="group mt-6 flex flex-col items-center gap-1 rounded-xl bg-brand-700 px-6 py-4 text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <span className="text-[11.5px] font-black tracking-[0.14em] whitespace-nowrap text-brand-200 uppercase sm:text-[12px]">
                  대표전화 / FAX
                </span>
                <span className="tabular text-[24px] font-black whitespace-nowrap">
                  {CLINIC.phone}
                </span>
              </a>

              {/*
                ★ 빈자리를 '오는 방법' 으로 채운다.
                  전에는 이메일 아래가 통째로 비어 있었다. 여기 들어갈 값은 전부
                  이미 확인된 것들이라 새로 만들 필요가 없었다.
                ⚠️ 기계식 주차장 주의사항을 빼지 말 것 — 큰 차량이 헛걸음하는 것을 막는다.
              */}
              <dl className="mt-6 space-y-3.5 border-t border-brand-100 pt-6">
                <div className="flex gap-3">
                  <dt className="w-[62px] shrink-0 text-[13px] font-black text-ink-muted">주차</dt>
                  <dd className="text-[14.5px] leading-relaxed text-ink-soft">
                    {CLINIC.parking.type} · <strong className="font-black text-brand-700">{CLINIC.parking.fee}</strong>
                    <span className="mt-1 block text-[13px] text-ink-muted">{CLINIC.parking.note}</span>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-[62px] shrink-0 text-[13px] font-black text-ink-muted">이메일</dt>
                  <dd className="min-w-0 text-[14.5px] break-all text-ink-soft">
                    <a href={`mailto:${CLINIC.email}`} className="hover:text-brand-700 hover:underline">
                      {CLINIC.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

                  {/*
                    ⚠️ 지도는 여기 두지 않는다 (2026-08-18 운영자: 홈을 덜어내기).
                       420px 짜리 지도가 홈에서 두 번째로 큰 덩어리였는데, 같은 지도가
                       /visit 에 이미 있다. 홈에는 **주소와 전화**만 남기고 길찾기는
                       아래 버튼으로 넘긴다.
                    ★ 지도를 뺐으면 **가는 길을 반드시 열어 둬야 한다.** 안 그러면
                      "여기 있습니다" 로 끝나고 길찾기까지 가는 통로가 사라진다.
                  */}
                  <div className="mt-8 flex flex-wrap gap-2.5">
                    <Link
                      href="/visit"
                      className="group inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-[14.5px] font-black text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5"
                    >
                      지도 · 길찾기 보기
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                    <a
                      href={CLINIC.phoneHref}
                      className="inline-flex items-center gap-2 rounded-full border border-brand-300 bg-white px-6 py-3 text-[14.5px] font-black text-brand-700 transition-colors hover:border-brand-400"
                    >
                      {CLINIC.phone}
                    </a>
                  </div>
            </div>
                </div>
        </div>
      </Container>
    </section>
  );
}
