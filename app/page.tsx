import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  CLINIC,
  UNVERIFIED,
  STRENGTHS,
  TREATMENT_PILLARS,
  CREDENTIALS,
  PUBLICATION,
  OUTREACH,
} from '@/lib/clinic';
import { IMG, HERO_VIDEO, OUTREACH_VIDEO } from '@/lib/assets';
import { DOCTORS, OUTREACH_PHOTO } from '@/lib/doctors';
import { SYMPTOMS } from '@/lib/symptoms';
import { Container, SectionHead, CardLink, ContactCta } from '@/components/ui';
import { SpecialGrid } from '@/components/SpecialGrid';
import { ClinicMap } from '@/components/ClinicMap';

export const metadata: Metadata = {
  title: `${CLINIC.name} | 고양시 덕양구 화정동 치과`,
  description:
    '고양시 덕양구 화정동 동그라미치과의원. 10년 이상 경력의 대학병원 교수 출신 대표원장이 진료합니다. 자연치아살리기·임플란트·심미치료·사랑니치료. 화·목 야간진료 오후 8시 30분까지.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PillarSection />
      <StrengthSection />
      <DoctorSection />
      <SymptomEntry />
      <InteriorSection />
      <OutreachSection />
      <InsightPromo />
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
  return (
    <section className="relative min-h-[600px] overflow-hidden lg:min-h-[86vh]">
      {/* 폴백 배경 — 영상이 로드되기 전/실패해도 화면이 비지 않는다. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900" />

      {/*
        Vimeo 배경 영상 — 화면비가 다른 두 영상을 화면 크기에 따라 갈라 쓴다.
        원본 홈페이지도 데스크톱용(16:9)과 모바일용(4:5) 영상을 따로 두고 있다.
        하나만 쓰면 반대쪽에서 좌우 또는 상하가 크게 잘린다.
        cover 계산은 globals.css 의 .video-cover-* 참조.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <iframe
          src={HERO_VIDEO.desktop}
          title=""
          tabIndex={-1}
          allow="autoplay"
          className="video-cover video-cover-16x9 hidden lg:block"
        />
        <iframe
          src={HERO_VIDEO.mobile}
          title=""
          tabIndex={-1}
          allow="autoplay"
          className="video-cover video-cover-4x5 block lg:hidden"
        />
      </div>

      {/* 가독성 오버레이 — 영상 위 흰 글씨의 대비를 확보한다. 없으면 밝은 프레임에서 글씨가 사라진다. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-brand-900/60 via-brand-900/45 to-brand-900/75"
      />

      <Container className="relative flex min-h-[600px] flex-col justify-center py-24 text-center lg:min-h-[86vh]">
        <p className="on-photo text-[14px] font-bold tracking-[-0.01em] text-white/90 sm:text-[17px]">
          10년 이상 경력의 대학 병원 출신 의료진, 디지털 의료장비 활용
        </p>

        <h1 className="display on-photo mt-5 text-[34px] text-white sm:text-[54px] lg:text-[66px]">
          환자 중심 진료, 소통하는 치과
        </h1>

        <p className="on-photo mx-auto mt-8 max-w-2xl text-[15px] leading-[1.9] text-white/85 sm:text-[17px]">
          환자들의 치과에 대한 두려움을 깊이 공감하며, 최대한 아프지 않고
          <br className="hidden sm:block" /> 과잉 진료없이 편안하게 치료를 받고 가실 수 있도록
          노력합니다.
        </p>

        <div className="mt-11 flex flex-wrap justify-center gap-3.5">
          <a
            href={CLINIC.phoneHref}
            className="group inline-flex items-center gap-3 rounded-lg bg-white px-9 py-4.5 text-[18px] font-black text-brand-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1"
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
          <h2 className="display-sm mt-4 text-[30px] text-ink sm:text-[38px]">
            동그라미 치과 진료정보
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TREATMENT_PILLARS.map((p, i) => (
            <Link
              key={p.key}
              href={p.href}
              className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl shadow-[var(--shadow-soft)] transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-lift)]"
            >
              <Image
                src={img[i]}
                alt=""
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
          ))}
        </div>
      </Container>
    </section>
  );
}

/** 동그라미 치과만의 특별함 — 원문 5개 항목. */
function StrengthSection() {
  return (
    <section className="border-y border-brand-200/60 bg-gradient-to-b from-white to-brand-50/50 py-24 lg:py-28">
      <Container>
        <div className="text-center">
          <h2 className="display-sm text-[30px] text-ink sm:text-[38px]">동그라미 치과만의 특별함</h2>
        </div>

        <div className="mt-14">
          <SpecialGrid />
        </div>
      </Container>
    </section>
  );
}

/** 의료진 — 실제 단체 사진 + 인증·논문. 원문 카피 유지. */
function DoctorSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-brand-100/40 blur-3xl"
      />
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow="의료진 소개"
              title={
                <>
                  대학병원 교수출신
                  <br />
                  대표원장님과 의료진
                </>
              }
              desc="손끝의 숙련도에 따라 결과가 달라지는 치과 진료, 10년 이상 경력의 교수출신 대표원장님과 보건복지부 인정 전문의들로만 구성된 의료진이 한차원 높은 의료서비스를 제공합니다."
            />

            <ul className="mt-9 space-y-2.5">
              {CREDENTIALS.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[15px] text-ink-soft">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] text-white"
                  >
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-brand-200/70 bg-white p-6 shadow-[var(--shadow-soft)]">
              <p className="text-[11.5px] font-black tracking-[0.16em] text-brand-500 uppercase">
                발표 논문
              </p>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink">{PUBLICATION}</p>
            </div>

            {/* 원장 3인 바로가기 — 이름은 그 자체로 검색 질의라 홈에서부터 개별 페이지로 연결한다. */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {DOCTORS.map((d) => (
                <Link
                  key={d.slug}
                  href={`/about/doctors/${d.slug}`}
                  className="group flex items-center gap-3 rounded-2xl border border-brand-200/70 bg-white p-3 transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-100">
                    <Image src={d.photo} alt="" fill sizes="56px" className="object-cover object-top" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black tracking-wide text-brand-500">{d.role}</p>
                    <p className="text-[16px] font-black tracking-[0.04em] text-ink group-hover:text-brand-700">
                      {d.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/about/doctors"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 px-7 py-3.5 text-[15.5px] font-black text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-1"
            >
              의료진 자세히 보기 <span aria-hidden>→</span>
            </Link>
          </div>

          {/*
            ★ 원본 PNG 는 위쪽 60% 가 거의 비어 있고(워터마크만) 인물이 아래쪽에 몰려 있다.
              그대로 넣으면 카드 위가 휑해 보인다. 4:3 틀에 object-bottom 으로 아래를 기준
              삼아 잘라 인물이 화면을 채우게 한다. 원본 파일은 건드리지 않는다 —
              나중에 다른 비율이 필요하면 이 클래스만 바꾸면 된다.
          */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-b from-brand-100 to-brand-200 shadow-[var(--shadow-lift)]">
            <Image
              src={IMG.doctors}
              alt="동그라미치과의원 의료진"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-bottom"
            />
          </div>
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
        <div className="text-center">
          <p className="text-[12.5px] font-black tracking-[0.24em] text-brand-500 uppercase">
            Circle Dental Clinic
          </p>
          <h2 className="display-sm mt-4 text-[30px] text-ink sm:text-[38px]">
            동그라미 치과 내부 둘러보기
          </h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IMG.interior.slice(0, 6).map((src, i) => (
            <div
              key={src}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-[var(--shadow-soft)]"
            >
              <Image
                src={src}
                alt={`동그라미치과의원 내부 ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/about/tour"
            className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-brand-300 bg-white px-7 py-3.5 text-[15.5px] font-bold text-brand-700 transition-all hover:-translate-y-1 hover:border-brand-400"
          >
            전체 사진 보기 <span aria-hidden>→</span>
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
        <div className="text-center">
          <p className="text-[12.5px] font-black tracking-[0.24em] text-brand-200 uppercase">
            Circle Dental Clinic
          </p>
          <h2 className="display-sm mt-4 text-[28px] sm:text-[34px]">동그라미 치과 사회공헌</h2>
          <div className="mx-auto mt-9 max-w-2xl space-y-3">
            {OUTREACH.map((o) => (
              <p key={o} className="text-[16px] leading-relaxed text-brand-100/90">
                {o}
              </p>
            ))}
          </div>
        </div>

        {/* 실제 봉사 현장 사진 — 문구만 있을 때보다 훨씬 힘을 받는다. */}
        <div className="mx-auto mt-11 max-w-2xl overflow-hidden rounded-2xl shadow-[var(--shadow-lift)]">
          <Image
            src={OUTREACH_PHOTO.src}
            alt={OUTREACH_PHOTO.alt}
            width={1256}
            height={840}
            className="h-auto w-full object-cover"
          />
        </div>

        {/*
          방영분 영상 — 여기는 배경이 아니라 '보는' 영상이라 컨트롤을 남기고 자동재생하지 않는다.
          자동으로 소리가 나면 그 자체로 이탈 사유가 된다.
          16:9 틀에 맞춰 letterbox 없이 들어간다(원본이 2:1 이라 위아래 여백은 플레이어가 처리).
        */}
        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl shadow-[var(--shadow-lift)]">
          <div className="relative aspect-video bg-brand-900">
            <iframe
              src={OUTREACH_VIDEO.embed}
              title="TV조선 구조신호 시그널 24회 — 동그라미치과의원 무료 틀니 제공"
              loading="lazy"
              allow="fullscreen; picture-in-picture"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
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
            <SectionHead eyebrow="진료시간 안내" title="화·목은 저녁 8시 30분까지 진료합니다" />
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
            <SectionHead eyebrow="오시는 길" title="화정동 현창빌딩 3층입니다" />
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
