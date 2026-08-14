import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { CLINIC, UNVERIFIED, TREATMENT_PILLARS } from '@/lib/clinic';
import { IMG } from '@/lib/assets';
import { heroFacts } from '@/lib/heroFacts';
import { HeroMedia } from '@/components/HeroMedia';
import { Reveal } from '@/components/Reveal';
import { DOCTORS } from '@/lib/doctors';
import { ExploreMore } from '@/components/ExploreMore';
import { TrustSection } from '@/components/TrustSection';
import { FIRST_VISIT_FLOW } from '@/lib/firstVisit';
import { abs } from '@/lib/seo';
import { Container, SectionHead, ContactCta } from '@/components/ui';
import { ClinicMap } from '@/components/ClinicMap';
import { HomeFaqSection } from '@/components/HomeFaqSection';
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
            ★ 첫 방문 절차를 HowTo 로 낸다 — "치과 처음 가면 뭐 해요" 는 실제 질의이고,
              HowTo 는 답변 엔진이 단계별로 그대로 인용하는 형식이다.
            ⚠️ 화면에 같은 4단계가 보인다(ProcessSection). 안 보이는 절차를 마크업하면
               구조화 데이터 정책 위반이다.
          */
          {
            '@type': 'HowTo',
            '@id': `${abs('/')}#firstvisit`,
            name: '치과 첫 방문 진행 절차',
            description:
              '동그라미치과의원에 처음 오시면 접수와 문진, 방사선 촬영, 구강 검사, 설명과 계획 수립 순서로 진행합니다.',
            totalTime: 'PT40M',
            step: FIRST_VISIT_FLOW.map((f, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: f.t,
              text: f.d,
              url: `${abs('/about/process')}#${encodeURIComponent(f.t)}`,
            })),
          },
        ]}
      />
      {/*
        ★★ 순서 재설계 (2026-08-14 운영자: "중요한 것부터, 질문·진료 목록은 좀 내리자") ★★

        예전 순서는 진료(PillarSection·CareList)가 2·3번이었다. AEO 를 생각하면 시술명이
        위에 있는 게 유리해 보이지만, **사람은 그 순서로 읽지 않는다.**
        병원을 처음 보는 사람은 "무슨 치료 하나" 보다 "여기 믿을 만한가" 를 먼저 판단한다.
        그 판단이 서기 전에는 시술 목록이 아무리 길어도 눈에 안 들어온다.

        그래서 **신뢰 → 공감 → 근거 → 구체 → 확인 → 행동** 으로 세웠다.

          1 Hero      누구이고 지금 갈 수 있는가
          2 Doctor    누가 보는가 — 병원 선택에서 가장 강한 신호
          3 Pillar    무엇을 하는가 (사진 네 갈래 + 전체 목록 링크)
          4 Trust     무엇을 근거로 믿을 수 있는가 (숫자·인증·논문·언론)
          5 Explore   나머지 주제로 가는 여섯 칸
          6 FAQ       궁금증 해소 (여섯 문답 + 전체 보기)
          7 Hours     언제·어디로
          8 Cta       연락

        ★★ 홈을 짧게, 내용은 주제별 페이지로 (2026-08-14 운영자) ★★

          한때 홈에 망설임·근거 12가지·진료 10줄·증상·인사이트·둘러보기·절차·사회공헌을
          전부 세로로 쌓아 **15,510px** 이 됐다. AEO 를 위해 다 넣는다는 생각이었는데,
          그 전제가 틀렸다.

          답변 엔진(RAG)은 페이지를 통독하지 않는다. 질문과 가까운 **문맥 조각(chunk)** 을
          찾아 인용한다. 한 문서에 병원 소개·진료·FAQ·근거가 뒤섞여 있으면
          ① 그 문서의 핵심 주제가 흐려져 벡터 검색에서 노이즈가 되고,
          ② 인용할 때 줄 수 있는 주소가 **홈 URL 하나뿐**이다.
          주제별 전용 URL 로 나누면 "이 병원 왜 가야 해?" 에는 /about/why 를,
          "비용 어때?" 에는 /insight/cost 를 **콕 집어** 인용할 수 있다.
          게다가 스크롤이 길면 LCP·CLS 가 나빠져 기본 SEO 가 깎이는데,
          AEO 는 그 기본 SEO 위에서만 동작한다.

          옮긴 곳
            망설임 6 + 근거 12   → /about/why (새로 만듦)
            진료 영역 전체       → /treatment
            증상으로 찾기        → /insight/symptom
            인사이트 넷          → /insight
            첫 방문 절차         → /about/process
            둘러보기             → /about/tour
            사회공헌             → /about

          ⚠️⚠️ 섹션을 지울 때 **그 페이지로 가는 링크까지 지우면 안 된다** ⚠️⚠️
             홈은 크롤러가 가장 먼저·자주 읽는 문서라, 여기서 링크가 끊기면 안쪽 페이지
             발견이 늦어진다. 그래서 ExploreMore 여섯 칸으로 압축해 남겼다.
             내부 링크 그래프는 유지하면서 스크롤만 줄인 것이다.

        ★ StrengthSection('특별함 5가지')은 WhyUs 와 같은 말이라 제거했다.
          원문은 /about 과 /about/special 에 그대로 있다.
      */}
      <Hero />
      <DoctorSection />
      <PillarSection />
      {/*
        ★★ 신뢰 지표 ★★
          자격·인증·논문·방송이 사이트 곳곳에 있었지만 **한 자리에 모여 세어지지 않았다.**
          답변 엔진은 "전문의 3명, 인증 4건" 처럼 셀 수 있는 것을 인용한다.
          진료(Pillar) 바로 뒤에 두는 이유는, "무슨 치료 하나" 를 본 직후가
          "그걸 믿고 맡겨도 되나" 를 묻는 자리이기 때문이다.
        ⚠️ 여기에 환자 후기·별점을 넣지 말 것 — 의료법 제56조 제2항 치료경험담 광고 금지.
      */}
      <TrustSection />
      {/*
        옮긴 주제들로 가는 길. 섹션을 지우면 그 페이지로 가는 링크도 같이 사라지므로
        여섯 칸으로 압축해 남긴다(components/ExploreMore.tsx 주석 참고).
      */}
      <ExploreMore />
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
    <section className="relative flex min-h-[620px] flex-col overflow-hidden lg:min-h-[calc(100vh-86px)]">
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
          <a
            href={CLINIC.phoneHref}
            className="group inline-flex items-center gap-3 rounded-lg bg-white px-9 py-4.5 text-[18px] font-black tabular-nums text-brand-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1"
          >
            {CLINIC.phone}
            <span
              aria-hidden
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-[13px] transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
          <Link
            href="/insight/symptom"
            className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-white/60 bg-white/10 px-8 py-4.5 text-[17px] font-bold text-white backdrop-blur transition-all hover:-translate-y-1 hover:bg-white/20"
          >
            증상으로 찾아보기 <span aria-hidden>→</span>
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
            자연치아를 살리는 치료를 중심에 두고 임플란트, 심미치료, 사랑니 발치까지 진료합니다. 충치·신경·잇몸
            치료와 스케일링 같은 기본 진료도 함께 보고 있습니다.
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
            세 분 원장 모두 보건복지부 인정 통합치의학과 전문의입니다. 대표원장은 경희대학교
            치의학전문대학원 외래교수이자 치의학박사입니다.
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
          ★★ 인증패·논문 밴드를 **의료진 페이지로 옮겼다** (2026-08-14 운영자) ★★
            홈에 작은 액자 넷을 늘어놓으니 보기에 나빴다. 이유가 있다 — 인증서 사진에는
            이미 금색 액자가 찍혀 있는데 거기에 카드 테두리를 한 겹 더 씌우니
            액자 안의 액자가 되고, 그 여백만큼 정작 인증서는 작아졌다.
            `/about/doctors` 에는 같은 자료가 **크게, 액자 없이** 있다 — 같은 것을 두 번,
            그것도 홈에서는 더 못하게 보여 줄 이유가 없다.
          ★ 홈에는 '있다는 사실' 과 그리로 가는 길만 남긴다. 신뢰 지표 숫자는
            아래 TrustSection 이 이미 세어서 보여 준다.
        */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl border border-brand-200/70 bg-brand-50/50 px-7 py-6">
          <p className="max-w-[62ch] text-[14.5px] leading-relaxed text-ink-soft">
            전문의 자격과 인증·수료 {IMG.credentials.length}건, 국제 학술지 발표 논문의 실물 자료를
            의료진 페이지에 두었습니다.
          </p>
          <Link
            href="/about/doctors"
            className="group ml-auto inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-brand-700 px-6 py-3 text-[14.5px] font-black text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5"
          >
            의료진 · 인증 보기
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

/** 진료시간·오시는 길 — 기존 홈페이지 표기 그대로. */
function HoursSection() {
  return (
    <section className="border-t border-brand-200/60 bg-brand-50/40 py-24 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            {/* 질문형 제목 + 즉답. '치과 진료시간' 은 지역 검색에서 가장 흔한 질의 중 하나다. */}
            <SectionHead
              eyebrow="진료시간 안내"
              title="진료시간이 어떻게 되나요?"
              desc="평일은 오전 9시 30분에 시작합니다. 화요일과 목요일은 저녁 8시 30분까지 야간 진료를 하고, 토요일은 오후 2시까지 봅니다. 일요일과 공휴일은 쉽니다."
            />
            <div className="mt-9 overflow-hidden rounded-2xl border border-brand-200/70 bg-white shadow-[var(--shadow-soft)]">
              {UNVERIFIED.hours.display.map((h, i) => (
                <div
                  key={h.label}
                  className={`flex items-baseline justify-between gap-4 px-7 py-5 ${
                    i > 0 ? 'border-t border-brand-100' : ''
                  } ${h.label === '점심시간' ? 'bg-brand-50/70' : ''}`}
                >
                  <span className="text-[15.5px] font-black text-ink">{h.label}</span>
                  <span className="text-right">
                    <span className="text-[16px] font-bold text-brand-700">{h.time}</span>
                    {h.note && (
                      <span className="ml-2 rounded-lg bg-gold-500/15 px-2.5 py-1 text-[11.5px] font-black text-gold-600">
                        {h.note}
                      </span>
                    )}
                  </span>
                </div>
              ))}
              <p className="border-t border-brand-100 bg-white px-7 py-4 text-[13.5px] font-semibold text-ink-muted">
                ※ {UNVERIFIED.hours.closed}
              </p>
            </div>
          </div>

          <div>
            {/* '어디에 있나요 / 주차 되나요' 는 내원 직전에 가장 많이 검색되는 두 문장이다. */}
            <SectionHead
              eyebrow="오시는 길"
              title="어디에 있고 주차는 되나요?"
              desc={`고양시 덕양구 화정동 ${CLINIC.address.building} 3층입니다. 주차는 ${CLINIC.parking.type}이며 ${CLINIC.parking.fee}입니다.`}
            />
            <dl className="mt-9 space-y-6">
              <div>
                <dt className="text-[12px] font-black tracking-[0.16em] text-brand-500 uppercase">
                  주소
                </dt>
                <dd className="mt-2 text-[17px] font-bold leading-relaxed text-ink">
                  {CLINIC.address.full}
                </dd>
              </div>
              <div>
                <dt className="text-[12px] font-black tracking-[0.16em] text-brand-500 uppercase">
                  대표전화 / FAX
                </dt>
                <dd className="mt-2">
                  <a
                    href={CLINIC.phoneHref}
                    className="display-sm text-[30px] text-brand-700 hover:underline"
                  >
                    {CLINIC.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[12px] font-black tracking-[0.16em] text-brand-500 uppercase">
                  이메일
                </dt>
                <dd className="mt-2 text-[15.5px] text-ink-soft">{CLINIC.email}</dd>
              </div>
            </dl>
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
