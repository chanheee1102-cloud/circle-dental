import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  CLINIC,
  UNVERIFIED,
  TREATMENT_PILLARS,
  CREDENTIALS,
  PUBLICATION,
  OUTREACH,
} from '@/lib/clinic';
import { IMG, OUTREACH_VIDEO } from '@/lib/assets';
import { heroFacts } from '@/lib/heroFacts';
import { HeroMedia } from '@/components/HeroMedia';
import { Reveal } from '@/components/Reveal';
import { DOCTORS, OUTREACH_PHOTO, OUTREACH_BROADCAST } from '@/lib/doctors';
import { SYMPTOMS } from '@/lib/symptoms';
import { Container, SectionHead, CardLink, ContactCta } from '@/components/ui';
import { ClinicMap } from '@/components/ClinicMap';
import { WhyUsSection } from '@/components/WhyUsSection';
import { HomeFaqSection } from '@/components/HomeFaqSection';
import { CareListSection } from '@/components/CareListSection';
import { ConcernsSection } from '@/components/ConcernsSection';
import { InteriorSlider } from '@/components/InteriorSlider';
import { VideoFacade } from '@/components/VideoFacade';

export const metadata: Metadata = {
  title: `${CLINIC.name} | 고양시 덕양구 화정동 치과`,
  description:
    '고양시 덕양구 화정동 동그라미치과의원. 10년 이상 경력의 대학병원 교수 출신 대표원장이 진료합니다. 자연치아살리기·임플란트·심미치료·사랑니치료. 화·목 야간진료 오후 8시 30분까지.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
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
      */}
      <Hero />
      <DoctorSection />
      <ConcernsSection />
      <WhyUsSection />
      <PillarSection />
      <InteriorSection />
      <OutreachSection />
      <CareListSection />
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

        <div className="mt-12 grid gap-6 rounded-2xl border border-brand-200/70 bg-brand-50/50 p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10 lg:p-9">
          <div>
            <p className="text-[12px] font-black tracking-[0.08em] text-brand-500">인증 · 수료</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {CREDENTIALS.map((c) => (
                <li key={c} className="flex items-center gap-2 text-[13.5px] text-ink-soft">
                  <span
                    aria-hidden
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[9px] text-white"
                  >
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[12px] font-black tracking-[0.08em] text-brand-500">발표 논문</p>
            <p className="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-ink-soft">
              {PUBLICATION}
            </p>
          </div>

          <Link
            href="/about/doctors"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand-700 px-7 py-3.5 text-[15px] font-black text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-0.5"
          >
            의료진 전체 보기 <span aria-hidden>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

/** 증상 진입 — 이 사이트에만 있는 축(AEO 핵심). */
function SymptomEntry() {
  const featured = SYMPTOMS.slice(0, 6);
  return (
    <section className="border-y border-brand-200/60 bg-brand-50/40 py-24 lg:py-28">
      <Container>
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
        <div className="mt-12 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <Link
              key={s.slug}
              href={`/insight/symptom/${s.slug}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-brand-200/70 bg-white px-6 py-5.5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="text-[15.5px] font-bold leading-snug text-ink group-hover:text-brand-700">
                {s.title}
              </span>
              <span
                aria-hidden
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500 transition-all group-hover:bg-brand-500 group-hover:text-white"
              >
                →
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/insight/symptom"
          className="mt-9 inline-flex items-center gap-2 text-[15.5px] font-black text-brand-700 hover:underline"
        >
          증상 {SYMPTOMS.length}가지 전체 보기 <span aria-hidden>→</span>
        </Link>
      </Container>
    </section>
  );
}

/** 내부 둘러보기 — 실제 병원 사진 갤러리. */
function InteriorSection() {
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[12px] font-black tracking-[0.2em] text-brand-500 uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            공간
          </p>
          <h2 className="display-sm mt-4 text-[30px] text-ink sm:text-[38px]">
            어떤 공간에서 진료하나요?
          </h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-ink-soft">
            상담실과 진료실, 소독실까지 실제 사진입니다. 옆으로 넘겨 보실 수 있습니다.
          </p>
        </div>
        {/* 격자 대신 슬라이드 — 열두 장을 한 줄 자리로 다 보여 준다(components/InteriorSlider.tsx). */}
        <div className="mt-12">
          <InteriorSlider />
        </div>
        <div className="mt-10">
          <Link
            href="/about/tour"
            className="inline-flex items-center gap-2 border-b-[1.5px] border-brand-400 pb-1 text-[14.5px] font-bold text-brand-700 transition-colors hover:border-brand-700"
          >
            둘러보기 페이지에서 전체 보기 <span aria-hidden>→</span>
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
        <div className="text-center">
          <p className="text-[12.5px] font-black tracking-[0.24em] text-brand-200 uppercase">
            Circle Dental Clinic
          </p>
          <h2 className="display-sm mt-4 text-[28px] sm:text-[34px]">동그라미 치과 사회공헌</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-[1.85] text-brand-100/85">
            진료실 밖에서도 해 온 일이 있습니다. 아래 두 장이 그 기록입니다.
          </p>
        </div>

        {/*
          ★ 두 장을 **가로로 나란히** 둔다 (2026-08-14 운영자, 원본 홈페이지도 같은 구성).
            세로로 쌓으면 두 활동이 별개의 이야기처럼 읽히는데 실제로는 '봉사' 라는 한 갈래다.
            설명도 사진 바로 아래에 각각 붙여 어느 사진의 이야기인지 헷갈리지 않게 한다.
          ★ 오른쪽은 방영분 영상이다. 썸네일로 **방영 장면 사진**을 쓴다 —
            플레이어의 검은 첫 프레임을 두면 무엇을 재생하는지 알 수 없다.
          ★ 두 칸의 비율을 4:3 으로 맞춘다. 원본 사진이 499×420(≈6:5)이라 큰 왜곡 없이
            같은 높이로 떨어지고, 아래 설명 줄도 같은 선에서 시작한다.
        */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <figure>
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-lift)]">
              <Image
                src={OUTREACH_PHOTO.src}
                alt={OUTREACH_PHOTO.alt}
                width={1256}
                height={840}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <figcaption className="mt-4 text-center text-[14.5px] leading-relaxed text-brand-100/85">
              {OUTREACH[0]}
            </figcaption>
          </figure>

          <figure>
            <VideoFacade
              embedSrc={`${OUTREACH_VIDEO.embed}&autoplay=1`}
              poster={OUTREACH_BROADCAST.src}
              posterAlt={OUTREACH_BROADCAST.alt}
              label="TV조선 구조신호 시그널 24회 방영분 재생 — 동그라미치과의원 무료 틀니 제공"
              ratio="aspect-[4/3]"
            />
            <figcaption className="mt-4 text-center text-[14.5px] leading-relaxed text-brand-100/85">
              {OUTREACH[1]}
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}

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
        <SectionHead
          eyebrow="인사이트"
          title="설명을 미리 읽고 오시면 진료실에서 할 이야기가 달라집니다"
          desc="진료 시간에 다 담기 어려운 배경 설명을 문서로 정리했습니다."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <CardLink key={c.href} {...c} />
          ))}
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
