import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  CLINIC,
  UNVERIFIED,
  TREATMENT_PILLARS,
  PUBLICATION,
  OUTREACH,
} from '@/lib/clinic';
import { IMG, OUTREACH_VIDEO } from '@/lib/assets';
import { heroFacts } from '@/lib/heroFacts';
import { HeroMedia } from '@/components/HeroMedia';
import { Reveal } from '@/components/Reveal';
import { DOCTORS, OUTREACH_PHOTO, OUTREACH_BROADCAST, PUBLICATION_DETAIL } from '@/lib/doctors';
import { SYMPTOMS } from '@/lib/symptoms';
import { TREATMENTS } from '@/lib/treatments';
import { Container, SectionHead, CardLink, ContactCta, Sentences } from '@/components/ui';
import { ClinicMap } from '@/components/ClinicMap';
import { CopyButton } from '@/components/CopyButton';
import { WhyUsSection } from '@/components/WhyUsSection';
import { HomeFaqSection } from '@/components/HomeFaqSection';
import { ConcernsSection } from '@/components/ConcernsSection';
import { InteriorSlider } from '@/components/InteriorSlider';
import { VideoFacade } from '@/components/VideoFacade';
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
        ★★ 순서 재설계 (2026-08-14 운영자: "중요한 것부터, 질문·진료 목록은 좀 내리자") ★★

        예전 순서는 진료(PillarSection·CareList)가 2·3번이었다. AEO 를 생각하면 시술명이
        위에 있는 게 유리해 보이지만, **사람은 그 순서로 읽지 않는다.**
        병원을 처음 보는 사람은 "무슨 치료 하나" 보다 "여기 믿을 만한가" 를 먼저 판단한다.
        그 판단이 서기 전에는 시술 목록이 아무리 길어도 눈에 안 들어온다.

        그래서 **신뢰 → 공감 → 근거 → 구체 → 확인 → 행동** 으로 세웠다.

          1 Hero          누구이고 지금 갈 수 있는가
          2 Doctor        누가 보는가 — 병원 선택에서 가장 강한 신호
          3 Concerns      내 망설임이 여기 있는가 (아직 결심 안 한 사람을 붙잡는 자리)
          4 WhyUs         그래서 무엇이 다른가 — 12가지 구체 근거
          5 Pillar        무엇을 하는가 (사진 네 갈래)
          6 Interior      어떤 공간인가 (슬라이드)
          7 Outreach      어떤 곳인가 — 사회공헌
          8 CareList      진료 영역 전체 (여기부터는 '찾아보는' 구간)
          9 Symptom       내 증상으로 찾기
         10 Insight       더 읽을거리
         11 FAQ           궁금증 해소
         12 Hours         언제·어디로
         13 Cta           연락

        ★ 검색·AI 는 순서보다 **문서에 있는가**를 본다. 아래로 내려도 같은 페이지 안이라
          인용 가능성은 그대로다. 반대로 사람은 순서에 그대로 영향을 받는다.
        ★ StrengthSection('특별함 5가지')은 WhyUs 와 같은 말이라 제거했다.
          원문은 /about 과 /about/special 에 그대로 있다.

        ★★ 섹션을 합쳤다가 **되돌렸다** (2026-08-14 운영자) ★★
          한 번은 13 → 11 로 줄였다. CareList 를 Pillar 안에 칩으로 넣고,
          Symptom + Insight 를 한 섹션 좌우로 합쳐 13,473 → 11,559px 를 만들었다.

          운영자 판단은 **"스크롤 안 줄여도 된다. 퀄리티가 우선"** 이다. 맞는 판단이다 —
          줄여서 얻은 건 1,900px 인데, 잃은 건 각 주제가 자기 자리를 갖는 구조였다.
          진료 열 갈래가 칩 한 줄로 눌리고, 증상과 인사이트가 좁은 반 칸씩 나눠 가지면서
          둘 다 곁다리처럼 보였다. 세로로 긴 것은 사이트에서 문제가 아니다 —
          **한 화면에 두 가지 이야기가 눌려 들어가는 것**이 문제다.

          ⚠️ 다시 합치지 말 것 (합치려면 운영자 GO 필요).
      */}
      <Hero />
      <DoctorSection />
      <ConcernsSection />
      <WhyUsSection />
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
      <InteriorSection />
      <OutreachSection />

      {/*
        ★★ 진료 영역 열 줄 목록을 /treatment 로 옮겼다 (2026-08-14 운영자) ★★
          위 PillarSection 이 이미 '어떤 진료를 받을 수 있나요?' 에 사진 카드로 답하는데
          그 바로 아래에서 같은 질문에 열 줄로 다시 답하고 있었다. 홈만 길어지고
          어느 쪽도 끝까지 안 읽힌다.
        ⚠️ 링크는 살아 있다 — PillarSection 아래 '전체 진료과목' 버튼과 주 메뉴(진료),
           그리고 헤더 메가메뉴의 진료 목록이 그 길이다.
      */}
      <SymptomEntry />
      <InsightPromo />
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
     * ★ 높이를 '한 화면 - 헤더' 로 정확히 잡는다.
     *   92vh 처럼 어림으로 두면 헤더(86px)만큼 넘쳐 **사실 띠 아래가 잘린다**(실측 13px).
     *   첫 화면에 띠 전체가 들어오는 것이 이 구성의 전제라 어림값을 쓰지 않는다.
     */
    /*
     * ★ 모바일 높이를 '한 화면 − 헤더(60) − 하단 고정 바(66)' 로 잡는다.
     *   620px 고정이라 기기마다 어중간하게 남거나 잘렸다.
     *   ⚠️ vh 가 아니라 dvh — 주소창이 접히며 vh 가 변해 화면이 한 번 출렁인다.
     */
    <section className="relative flex min-h-[calc(100dvh-126px)] flex-col overflow-hidden sm:min-h-[620px] lg:min-h-[calc(100vh-86px)]">
      {/* 폴백 배경 — 사진마저 늦게 뜨는 회선에서도 화면이 비지 않는다. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900" />

      {/* 사진을 깔고 그 위로 영상이 서서히 겹친다 — components/HeroMedia.tsx 주석 참조. */}
      <HeroMedia />

      {/* 가독성 오버레이 — 배경 위 흰 글씨의 대비를 확보한다. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-brand-900/65 via-brand-900/50 to-brand-900/80"
      />
      {/*
        ★ 글자가 놓이는 가운데만 한 번 더 눌러 준다.
          화면 전체를 균일하게 어둡게 하면 배경이 통째로 죽는다. 타원으로 가운데만 누르면
          글자는 읽히고 영상·사진은 산다.
      */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(34,32,29,0.5),transparent_72%)]"
      />

      {/*
        ★ 로드 시퀀스 — 눈썹 → 제목 → 설명 → 버튼 → 사실 띠 순으로 한 번 떠오른다.
          한 번에 다 나타나는 것보다 '읽는 순서' 를 몸으로 알려 준다. 60~80ms 씩만 어긋내
          알아채기 전에 끝난다 — 기다림으로 느껴지는 순간부터는 방해다.
      */}
      <Container className="relative flex flex-1 flex-col justify-center py-24 text-center">
        <p
          className="enter on-photo text-[13px] font-bold tracking-[0.01em] text-white/80 sm:text-[15px]"
          style={{ animationDelay: '60ms' }}
        >
          10년 이상 경력의 대학 병원 출신 의료진, 디지털 의료장비 활용
        </p>

        <h1
          className="display enter on-photo mt-5 text-[36px] text-white sm:text-[58px] lg:text-[72px]"
          style={{ animationDelay: '140ms' }}
        >
          환자 중심 진료, 소통하는 치과
        </h1>

        <p
          className="enter on-photo mx-auto mt-7 max-w-2xl text-[15px] leading-[1.85] text-white/85 sm:text-[17px]"
          style={{ animationDelay: '220ms' }}
        >
          환자들의 치과에 대한 두려움을 깊이 공감하며, 최대한 아프지 않고
          <br className="hidden sm:block" /> 과잉 진료없이 편안하게 치료를 받고 가실 수 있도록
          노력합니다.
        </p>

        <div
          className="enter mt-10 flex flex-wrap justify-center gap-3.5"
          style={{ animationDelay: '300ms' }}
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
            className="group inline-flex h-[54px] w-[228px] items-center justify-center gap-2.5 rounded-full bg-white text-[16px] font-black text-brand-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1 sm:h-[64px] sm:w-[236px] sm:text-[17px]"
          >
            예약하기
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <Link
            href="/insight/symptom"
            className="group inline-flex h-[54px] w-[228px] items-center justify-center gap-2.5 rounded-full border-[1.5px] border-white/70 text-[16px] font-black text-white backdrop-blur-[2px] transition-all hover:-translate-y-1 hover:border-white hover:bg-white/15 sm:h-[64px] sm:w-[236px] sm:text-[17px]"
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
          className="enter relative border-t border-white/15 bg-brand-900/45 backdrop-blur-sm"
          style={{ animationDelay: '400ms' }}
        >
          <Container>
            {/*
              ⚠️ 열 수를 항목 수에 맞춘다.
                4열에 5칸이면 마지막 하나가 다음 줄에 혼자 떨어져 빈 칸 셋이 남는다(실측).
                항목 수는 병원이 확인해 준 사실의 개수라 미리 알 수 없으므로 계산해서 넣는다.
            */}
            <dl
              className="fact-strip grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-3"
              style={{ ['--cols' as string]: facts.length }}
            >
              {facts.map((f, i) => (
                /*
                 * ⚠️ 좁은 화면에서는 앞의 넷만 — 2열이라 다섯이면 세 번째 줄에 하나만 남고
                 *    히어로가 두 화면을 넘긴다. 넷이면 2×2 로 딱 떨어진다.
                 */
                <div
                  key={f.label}
                  className={`px-5 py-6 text-center ${i >= 4 ? 'hidden lg:block' : ''}`}
                >
                  <dt className="text-[10.5px] font-black tracking-[0.22em] text-white/45 uppercase">
                    {f.label}
                  </dt>
                  <dd className="mt-2 text-[14px] font-bold leading-snug tabular-nums text-white/95 sm:text-[15px]">
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

        {/* 세 장을 같은 크기로. 원본 비율(625×670)을 그대로 써 인물이 잘리지 않는다. */}
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOCTORS.map((d, i) => (
            <li key={d.slug}>
              <Reveal delay={i * 70}>
                <Link
                  href={`/about/doctors/${d.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-brand-200/70 bg-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1.5 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="relative aspect-[625/670] overflow-hidden bg-brand-100">
                    <Image
                      src={d.photo}
                      alt={`${CLINIC.name} ${d.role} ${d.name}`}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-6">
                    <p className="text-[12px] font-black tracking-[0.08em] text-gold-600">{d.role}</p>
                    <h3 className="display mt-2 text-[24px] tracking-[0.04em] text-ink group-hover:text-brand-700">
                      {d.name}
                    </h3>
                    <p className="mt-3 text-[13.5px] font-bold text-brand-600">
                      보건복지부 인정 통합치의학과 전문의
                    </p>

                    {/* 경력 두 줄만 — 카드에서 다 읽히지 않는다. 나머지는 개별 페이지에 있다. */}
                    <ul className="mt-4 space-y-1.5 border-t border-brand-100 pt-4">
                      {d.career
                        .filter((c) => !/통합치의학과 전문의/.test(c))
                        .slice(0, 2)
                        .map((c) => (
                          <li key={c} className="text-[13px] leading-relaxed text-ink-soft">
                            {c}
                          </li>
                        ))}
                    </ul>

                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-black text-brand-700">
                      프로필 보기
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

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
        <div className="mt-14 rounded-2xl border border-brand-200/70 bg-brand-50/40 px-7 py-10 lg:px-12">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.16em] text-brand-500 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            인증 · 수료
          </p>

          {/*
            ★★ 올리면 조명이 켜지듯 뜬다 (2026-08-14 운영자: "마우스 갖다대면 임팩트") ★★
              상패·인증서는 실물이 유리와 금속이라 **빛을 받는 물건**이다. 그 성질을 그대로 쓴다.
                ① 뒤에서 옅은 빛이 번지고(스포트라이트)
                ② 액자가 살짝 떠오르며 커지고
                ③ 그림자가 깊고 길어진다.
              세 가지가 함께 움직여야 '조명이 켜졌다' 로 읽힌다. 하나만 하면 그냥 커진 것이다.

            ★ 스포트라이트를 쓰는 이유 — 이 PNG 들은 배경이 지워져 있어(누끼) 테두리가 없다.
              카드처럼 배경을 밝히는 방법이 안 통한다. 뒤에 번지는 빛은 모양과 무관하게
              먹히고, 오히려 물건이 떠 있는 느낌을 만든다.

            ★★ 링크로 만든다 — 손이 올라가면 눌리는 것이어야 한다 ★★
              움직이기만 하고 눌리지 않으면 사용자는 두 번 세 번 눌러 본 뒤에야 포기한다.
              누르면 실물 사진이 크게 있는 의료진 페이지로 간다.
            ⚠️ 움직임에 민감한 사용자에게는 확대·이동을 끈다(motion-reduce). 빛과 그림자는
               남겨 둔다 — 그것만으로도 어디에 손이 있는지 알 수 있다.
               ⚠️ Tailwind v4 는 translate/scale 을 **transform 이 아니라 각각의 CSS 속성**으로 낸다.
                  그래서 `transform-none` 으로는 안 꺼진다(실측: 껐다고 생각했는데 그대로 움직였다).
                  `translate-none` + `scale-100` 두 개를 써야 한다.
                  그리고 **hover 변형까지 겹쳐 써야** 한다 — `motion-reduce:translate-none` 만으로는
                  CSS 출력 순서상 뒤에 오는 `group-hover:-translate-y-2.5` 에 밀린다(실측).
          */}
          <ul className="mt-9 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {IMG.credentials.map((c) => (
              <li key={c.src} className="flex flex-col">
                <Link
                  href="/about/doctors"
                  aria-label={`${c.label} — 의료진 페이지에서 크게 보기`}
                  className="group flex flex-col rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 focus-visible:ring-offset-brand-50"
                >
                  {/* 밑변 정렬 — 비율이 달라도 네 장이 같은 선 위에 선다. */}
                  <div className="relative flex h-[170px] items-end justify-center sm:h-[200px]">
                    {/* 스포트라이트 — 액자 뒤에서 번지는 빛. 장식이라 스크린리더에서 숨긴다. */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[86%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,115,92,0.34),transparent_68%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <Image
                      src={c.src}
                      alt={c.label}
                      width={236}
                      height={242}
                      loading="lazy"
                      sizes="(max-width: 640px) 40vw, 220px"
                      className="relative h-auto max-h-full w-auto drop-shadow-[0_10px_26px_rgba(58,33,26,0.18)] transition-all duration-500 ease-out group-hover:-translate-y-2.5 group-hover:scale-[1.07] group-hover:drop-shadow-[0_22px_38px_rgba(58,33,26,0.34)] motion-reduce:group-hover:translate-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  {/*
                    캡션 자리를 두 줄 높이로 고정한다 — 이름 길이가 달라 한 줄/두 줄이 오가면
                    카드 아래 선이 어긋난다(원본이 정확히 그랬다).
                  */}
                  <p className="mt-5 flex min-h-[2.9rem] items-start justify-center text-center text-[13px] leading-snug text-ink-soft transition-colors duration-300 group-hover:font-bold group-hover:text-brand-700">
                    {c.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/*
            발표 논문 — 원본도 인증패 아래에 가로로 긴 배너로 뒀다.
            제목만 적어 두면 '있다는 말' 로만 읽히므로 실물 화면을 함께 보여 준다.
          */}
          <div className="mt-12 border-t border-brand-200/70 pt-10">
            <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.16em] text-brand-500 uppercase">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              발표 논문
            </p>
            <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center">
              <div className="min-w-0">
                <p className="text-[16px] leading-relaxed font-bold text-ink">
                  {PUBLICATION_DETAIL.title}
                </p>
                <p className="mt-2.5 text-[13.5px] text-ink-muted">{PUBLICATION_DETAIL.authors}</p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  <Link
                    href="/about/trust"
                    className="group inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-[14.5px] font-black text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5"
                  >
                    근거 · 인증 전체 보기
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/about/doctors"
                    className="inline-flex items-center gap-2 rounded-full border border-brand-300 bg-white px-6 py-3 text-[14.5px] font-black text-brand-700 transition-colors hover:border-brand-400"
                  >
                    의료진 소개
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[768/430] overflow-hidden rounded-xl border border-brand-200/70 bg-white">
                <Image
                  src={PUBLICATION_DETAIL.image}
                  alt="발표 논문 화면 — Long-term Follow-up of Complicated Crown Fracture With Fragment Reattachment"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  /* 원본은 위 60%가 흐린 배경이고 노트북·논문이 아래쪽에 있다 — 아래를 기준으로 자른다. */
                  className="object-cover object-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * 증상 진입 — 이 사이트에만 있는 축(AEO 핵심).
 *
 * ★★ 한 번 인사이트와 합쳤다가 되돌렸다 (2026-08-14 운영자) ★★
 *   좌우로 반 칸씩 나눠 가지면 스크롤은 줄지만 **둘 다 곁다리처럼 보인다.**
 *   증상으로 들어오는 사람은 이 사이트에서 가장 중요한 손님이라 자기 화면을 가져야 한다.
 *
 * ★ 카드가 순서대로 떠오른다 — 여섯 개가 한꺼번에 나타나면 어디부터 볼지 알 수 없다.
 *   40ms 씩만 어긋내 '왼쪽 위부터' 라는 것을 몸으로 알려 준다.
 */
function SymptomEntry() {
  const featured = SYMPTOMS.slice(0, 6);
  return (
    <section className="relative overflow-hidden border-y border-brand-200/60 bg-brand-50/40 py-24 lg:py-28">
      {/* 옅은 얼룩 하나 — 넓은 단색 배경은 화면을 납작하게 만든다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/3 h-[460px] w-[460px] rounded-full bg-brand-100/50 blur-3xl"
      />
      <Container className="relative">
        <Reveal>
          <SectionHead
            eyebrow="증상으로 찾기"
            title={
              <>
                병명은 몰라도 됩니다.
                <br />
                지금 느끼는 것부터 찾으세요.
              </>
            }
            desc="어떤 치료가 필요한지는 진단의 결과지 출발점이 아닙니다. 증상에서 시작해 가능한 원인과 확인 방법을 정리했습니다."
          />
        </Reveal>
        <div className="mt-12 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s, i) => (
            <Reveal key={s.slug} delay={i * 40}>
              <Link
                href={`/insight/symptom/${s.slug}`}
                className="group flex h-full items-center justify-between gap-4 rounded-xl border border-brand-200/70 bg-white px-6 py-5.5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="text-[15.5px] font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
                  {s.title}
                </span>
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-brand-500 group-hover:text-white"
                >
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Link
          href="/insight/symptom"
          className="group mt-9 inline-flex items-center gap-2 text-[15.5px] font-black text-brand-700"
        >
          <span className="border-b-[1.5px] border-transparent transition-colors group-hover:border-brand-700">
            증상 {SYMPTOMS.length}가지 전체 보기
          </span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Container>
    </section>
  );
}

/**
 * 인사이트 — 읽을거리 넷.
 *
 * ★ 증상 섹션과 다시 분리했다(위 주석 참고). 여기는 '아직 안 아픈데 알아보는 사람' 자리다.
 * ★ 카드는 왼쪽부터 60ms 씩 어긋내 떠오른다.
 */
function InsightPromo() {
  const cards = [
    {
      href: '/insight/journey',
      title: '치료 여정',
      desc: '임플란트는 몇 번 와야 하는지, 신경치료는 얼마나 걸리는지 회차별로 정리했습니다.',
      tag: '기간·회차',
    },
    {
      href: '/insight/cost',
      title: '비용 가이드',
      desc: '건강보험이 되는 항목과 되지 않는 항목, 65세 임플란트 보험 조건을 설명합니다.',
      tag: '보험',
    },
    {
      href: '/insight/glossary',
      title: '용어 사전',
      desc: '진료실에서 듣는 말을 짧게 풀었습니다. 크라운, 인레이, 치수염 같은 단어들입니다.',
      tag: '용어',
    },
    {
      href: '/insight/emergency',
      title: '응급 상황',
      desc: '치아가 빠졌거나 부러졌을 때, 밤에 참기 힘들 때 지금 할 수 있는 것을 정리했습니다.',
      tag: '지금 당장',
    },
  ];
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <Reveal>
          <SectionHead
            eyebrow="인사이트"
            title="설명을 미리 읽고 오시면 진료실에서 할 이야기가 달라집니다"
            desc="진료 시간에 다 담기 어려운 배경 설명을 문서로 정리했습니다."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.href} delay={i * 60} className="h-full">
              <CardLink {...c} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** 내부 둘러보기 — 실제 병원 사진 갤러리. */
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

/** 사회공헌 — 원문 그대로. */
function OutreachSection() {
  return (
    <section className="border-y border-brand-200/60 bg-gradient-to-br from-brand-700 to-brand-900 py-20 text-white lg:py-24">
      <Container>
        {/*
          ⚠️ 여기에 OUTREACH 두 줄을 다시 늘어놓지 않는다.
            사진 아래 캡션이 이미 그 두 줄이라 위아래로 **똑같은 문장이 두 번** 나왔다(실측).
            머리글은 '무엇을 해 왔는가' 한 줄로만 요약하고, 구체는 캡션이 맡는다.
        */}
        <Reveal className="text-center">
          <p className="text-[12.5px] font-black tracking-[0.24em] text-brand-200 uppercase">
            Circle Dental Clinic
          </p>
          <h2 className="display-sm mt-4 text-[28px] sm:text-[34px]">동그라미 치과 사회공헌</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-[1.85] text-brand-100/85">
            진료실 밖에서도 해 온 일이 있습니다. 아래 두 장이 그 기록입니다.
          </p>
        </Reveal>

        {/*
          ★ 두 장을 **가로로 나란히** 둔다 (2026-08-14 운영자, 원본 홈페이지도 같은 구성).
            세로로 쌓으면 두 활동이 별개의 이야기처럼 읽히는데 실제로는 '봉사' 라는 한 갈래다.
            설명도 사진 바로 아래에 각각 붙여 어느 사진의 이야기인지 헷갈리지 않게 한다.
          ★ 오른쪽은 방영분 영상이다. 썸네일로 **방영 장면 사진**을 쓴다 —
            플레이어의 검은 첫 프레임을 두면 무엇을 재생하는지 알 수 없다.
          ★★ 크기를 줄였다 (2026-08-14 운영자: "사진이랑 영상 크기 좀 줄여줘") ★★
            컨테이너(1,256px) 를 꽉 채우면 한 장이 604×453px 이라 **사진 두 장이
            한 화면을 통째로 먹었다.** 여기는 '이런 일도 해 왔다' 를 보여 주는 자리지
            사진 자체가 주인공인 자리가 아니다.
            → 폭을 880px 로 묶어 가운데 두고, 비율도 4:3 → 16:11 로 눕혔다.
              한 장 428×294px — 무슨 사진인지 알아보기에 충분하면서 화면을 뺏지 않는다.
          ★ 두 칸의 비율을 똑같이 맞춰 아래 설명 줄이 같은 선에서 시작한다.
          ★ 왼쪽 먼저, 오른쪽이 90ms 뒤에 떠오른다 — 둘이 동시에 나타나면 한 덩어리로 보인다.
        */}
        <div className="mx-auto mt-12 grid max-w-[880px] gap-6 md:grid-cols-2">
          <Reveal className="h-full">
            <figure>
              <div className="group overflow-hidden rounded-2xl shadow-[var(--shadow-lift)]">
                <Image
                  src={OUTREACH_PHOTO.src}
                  alt={OUTREACH_PHOTO.alt}
                  width={880}
                  height={605}
                  className="aspect-[16/11] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-4 text-center text-[14.5px] leading-relaxed text-brand-100/85">
                {OUTREACH[0]}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={90} className="h-full">
            <figure>
              <VideoFacade
                embedSrc={`${OUTREACH_VIDEO.embed}&autoplay=1`}
                poster={OUTREACH_BROADCAST.src}
                posterAlt={OUTREACH_BROADCAST.alt}
                label="TV조선 구조신호 시그널 24회 방영분 재생 — 동그라미치과의원 무료 틀니 제공"
                ratio="aspect-[16/11]"
              />
              <figcaption className="mt-4 text-center text-[14.5px] leading-relaxed text-brand-100/85">
                {OUTREACH[1]}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/**
 * 진료시간 · 오시는 길.
 *
 * ★★ 가독성 재설계 (2026-08-14 운영자: "가독성 가시성 좋게") ★★
 *   두 가지가 문제였다.
 *     ① 시간표에서 **무엇이 다른지**가 안 보였다. 네 줄이 똑같은 무게로 늘어서 있어
 *        '화·목 야간진료' 와 '점심시간(쉬는 시간)' 이 같은 종류로 읽혔다.
 *        점심시간은 **여는 시간이 아니라 닫는 시간**인데 나란히 있으니 헷갈린다.
 *     ② 오른쪽 칸이 라벨·값만 세로로 쌓여 있고 아래가 통째로 비었다.
 *        주소는 이 페이지에서 가장 많이 **복사되는** 값인데 누를 것이 하나도 없었다.
 *
 *   → 시간표는 '진료' 와 '쉬는 시간·휴진' 을 색과 위치로 갈라 놓고,
 *     오른쪽은 주소·전화를 **누를 수 있는 것**으로 바꾸고 빈자리에 오는 방법을 채웠다.
 *
 * ⚠️ 값은 전부 UNVERIFIED.hours / CLINIC 에서 온다. 여기서 시간을 적지 않는다 —
 *    두 곳에 적힌 진료시간은 반드시 어긋나고, 틀린 진료시간은 환자를 헛걸음시킨다.
 */
function HoursSection() {
  /* 진료하는 시간과 쉬는 시간을 나눈다 — 화면에서 같은 줄에 섞이면 안 되는 두 종류다. */
  const open = UNVERIFIED.hours.display.filter((h) => h.label !== '점심시간');
  const lunch = UNVERIFIED.hours.display.find((h) => h.label === '점심시간');

  return (
    <section className="border-t border-brand-200/60 bg-brand-50/40 py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            {/* 질문형 제목 + 즉답. '치과 진료시간' 은 지역 검색에서 가장 흔한 질의 중 하나다. */}
            <SectionHead
              eyebrow="진료시간 안내"
              title="진료시간이 어떻게 되나요?"
              desc="평일은 오전 9시 30분에 시작합니다. 화요일과 목요일은 저녁 8시 30분까지 야간 진료를 하고, 토요일은 오후 2시까지 봅니다. 일요일과 공휴일은 쉽니다."
            />

            <div className="mt-9 overflow-hidden rounded-2xl border border-brand-200/70 bg-white shadow-[var(--shadow-soft)]">
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

          <div className="min-w-0">
            {/* '어디에 있나요 / 주차 되나요' 는 내원 직전에 가장 많이 검색되는 두 문장이다. */}
            <SectionHead
              eyebrow="오시는 길"
              title="어디에 있고 주차는 되나요?"
              desc={`고양시 덕양구 화정동 ${CLINIC.address.building} 3층입니다. 주차는 ${CLINIC.parking.type}이며 ${CLINIC.parking.fee}입니다.`}
            />

            {/*
              ★★ 주소는 '읽는 값' 이 아니라 '쓰는 값' 이다 ★★
                택시 앱·카톡·지도 검색창에 붙여 넣으려고 보는 정보인데, 긴 주소를 손으로
                드래그하는 것은 휴대폰에서 특히 성가시다. 복사 버튼을 옆에 둔다.
            */}
            <div className="mt-9 rounded-2xl border border-brand-200/70 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-7">
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
          </div>
        </div>

        {/* 지도 — 홈에서 바로 위치를 확인하고 길찾기까지 갈 수 있게 한다. */}
        <div className="mt-14">
          <ClinicMap height={400} />
        </div>
      </Container>
    </section>
  );
}
