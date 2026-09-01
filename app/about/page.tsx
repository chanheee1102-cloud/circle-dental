import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import Link from 'next/link';
import Image from 'next/image';
import { CLINIC, TREATMENT_PILLARS, OUTREACH, CREDENTIALS } from '@/lib/clinic';
import { IMG } from '@/lib/assets';
import { Container, SectionHead, ContactCta, PageHero, Sentences } from '@/components/ui';
import { SpecialGrid } from '@/components/SpecialGrid';
import { WhyUsSection } from '@/components/WhyUsSection';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '동그라미의 특별함',
  description:
    '고양시 덕양구 화정동 동그라미치과의원. 자연 그대로의 치아를 최대한 살리는 것이 진료 철학이며, 임플란트는 마지막 선택이 될 수 있도록 합니다. 10년 이상 경력의 대학병원 교수 출신 대표원장이 진료합니다.',
  alternates: { canonical: '/about' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '병원 소개', path: '/about' },
];

/**
 * 병원 소개.
 *
 * ★★ 이 페이지의 모든 문장은 기존 홈페이지 원문에서 온다 ★★
 *   이전 버전에는 제가 지어낸 '네 가지 원칙' 이 있었다. 병원 방침을 외부에서 창작하면
 *   실제와 어긋나고, 의료광고에서 사실이 아닌 표시는 의료법 제56조 위반이다. 전부 걷어냈다.
 *   출처는 lib/clinic.ts 의 STRENGTHS / TREATMENT_PILLARS / OUTREACH / CREDENTIALS 이며
 *   그 상수들 자체가 원문을 담고 있다.
 *
 * ★ AEO 구조 — 질문형 H2 + 즉답
 *   "동그라미치과의원은 어떤 곳인가요" 같은 질의에 대해 AI 는 질문과 같은 제목 바로 뒤의
 *   짧은 문단을 인용한다. 그래서 소개문을 서술형 제목("병원 소개") 아래 묻지 않고,
 *   실제 질문을 제목으로 세우고 그 자리에서 답을 끝낸다.
 */
const ABOUT_QA = [
  {
    q: '동그라미치과의원은 어떤 곳인가요?',
    a: '경기도 고양시 덕양구 화정동 현창빌딩 3층에 있는 치과의원입니다. 자연 그대로의 치아를 최대한 살리는 것을 진료 철학으로 두고, 임플란트는 마지막 선택이 될 수 있도록 합니다. 10년 이상 경력의 대학병원 교수 출신 대표원장과 보건복지부 인정 전문의로 구성된 의료진이 진료합니다.',
  },
  {
    q: '어떤 진료를 받을 수 있나요?',
    a: '자연치아살리기(충치치료·치아신경치료·잇몸치료), 임플란트, 심미치료(심미보철·치아미백), 사랑니치료를 진료합니다. 같은 증상이라도 남은 치아와 잇몸뼈 상태에 따라 선택이 달라지므로 검사 후 계획을 세웁니다.',
  },
  {
    q: '진료시간은 어떻게 되나요?',
    a: '월·수·금은 오전 9시 30분부터 오후 6시 30분까지, 화·목은 오후 8시 30분까지 야간 진료를 합니다. 토요일은 오후 2시까지이며 일요일과 공휴일은 휴진입니다. 평일 점심시간은 오후 1시부터 2시 30분까지입니다.',
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: '동그라미의 특별함',
            description: ABOUT_QA[0].a,
            path: '/about',
          }),
          faqSchema(ABOUT_QA),
        ]}
      />

      {/*
        ⚠️ 여기서 자기 h1 을 다시 그리지 말 것 (2026-08-28) — 전에 그렇게 두는 바람에
           15장을 한 번에 바꿀 때 이 페이지만 옛 모습으로 남았다(오너: "여기는 그대론데?").
           머리는 PageHero 하나가 전담한다.
        ⚠️ 문장은 기존 홈페이지 원문 그대로다. 병원 방침을 지어내면 의료법 제56조 위반이다.
      */}
      <PageHero
        trail={TRAIL}
        photo="corridor"
        eyebrow="병원 소개"
        title="자연 그대로의 치아를 최대한 살리는 것이 동그라미 치과의 진료 철학입니다"
        desc="임플란트는 마지막 선택이 될 수 있도록 합니다. 뽑고 심는 것이 빠른 길처럼 보여도, 자연치아는 씹는 힘의 세기와 방향을 감지하는 감각을 갖고 있어 대체하기 어렵습니다. 그래서 남길 수 있는 조건인지를 먼저 확인합니다."
      />

      <Container className="py-12 lg:py-16">
        <div className="max-w-[70ch]">
          <ArticleMeta path="/about" />
        </div>

        {/*
          진료 네 갈래 — **같은 크기의 카드 넷**으로 둔다.
          ⚠️ 알약으로 되돌리지 말 것 (2026-08-28 오너) — 이름 길이가 제각각이라 알약이
             네 개 다른 크기로 늘어서고, 왼쪽에 몰려 붙는다. 격자는 그 둘을 한 번에 없앤다.
        */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TREATMENT_PILLARS.map((p) => (
            <Link
              key={p.key}
              href={p.href}
              className="card-glass group flex items-center justify-between gap-3 rounded-[16px] border border-mist px-6 py-5 text-[16.5px] font-bold text-charcoal"
            >
              {p.name}
              <span
                aria-hidden
                className="text-ash transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </Container>

      {/* 자주 묻는 것 — AEO 인용 지점 */}
      <section className="border-y border-brand-200/60 bg-parchment py-16">
        <Container>
          {/* ⚠️ 실선 구분으로 되돌리지 말 것 — 글만 늘어놓으면 덩어리의 오른쪽 끝이
              들쭉날쭉해진다(2026-08-28 오너 지적). 가장자리를 잡아 주는 것은 카드다. */}
          <div className="mx-auto grid max-w-4xl gap-4">
            {ABOUT_QA.map((qa) => (
              <article
                key={qa.q}
                className="card-glass rounded-[18px] border border-mist p-7 sm:p-8"
              >
                <h2 className="display-sm text-[20px] text-ink sm:text-[22px]">{qa.q}</h2>
                <p className="mt-3.5 max-w-[70ch] text-[17px] leading-[1.85] text-ink-soft"><Sentences text={qa.a} /></p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* 특별함 5 — 원문 그대로 */}
      <section className="py-16 lg:py-24">
        <Container>
          <SectionHead
            eyebrow="동그라미 치과만의 특별함"
            title="다섯 가지를 약속합니다"
            desc="각 항목을 누르면 어떤 장비와 방법을 쓰는지, 그 용어가 무엇인지 자세히 보실 수 있습니다."
          />
          <div className="mt-12">
            <SpecialGrid eager />
          </div>
        </Container>
      </section>

      {/* 의료진 — 원문 그대로 */}
      <section className="border-y border-brand-200/60 bg-brand-50/40 py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHead
                eyebrow="의료진"
                title={
                  <>
                    대학병원 교수출신{' '}
                    <br />
                    대표원장님과 의료진
                  </>
                }
                desc="손끝의 숙련도에 따라 결과가 달라지는 치과 진료, 10년 이상 경력의 교수출신 대표원장님과 보건복지부 인정 전문의들로만 구성된 의료진이 한차원 높은 의료서비스를 제공합니다."
              />
              <ul className="mt-8 space-y-2.5">
                {CREDENTIALS.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[16px] text-ink-soft">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[13.5px] text-white"
                    >
                      ✓
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
              <Link
                href="/about/doctors"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-7 py-3.5 text-[16.5px] font-black text-white shadow-[var(--shadow-btn)] transition-transform hover:-translate-y-1"
              >
                의료진 자세히 보기 <span aria-hidden>→</span>
              </Link>
            </div>
            {/* 홈(app/page.tsx)의 의료진 사진과 같은 틀·같은 기준점 — 이유는 그쪽 주석 참조. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-b from-brand-100 to-brand-200 shadow-[var(--shadow-lift)]">
              <Image
                src={IMG.doctors}
                alt="동그라미치과의원 의료진"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[50%_92%]"
              />
            </div>
          </div>
        </Container>
      </section>

      {/*
        ★ 홈에서 옮겨 왔다 (2026-08-18 운영자: "메인은 진짜 필요한 것만").
          '무엇이 다른가' 12가지는 홈에서 1,584px 를 차지했는데, 병원을 이미 들여다보기로
          한 사람이 읽을 내용이지 처음 훑는 사람에게 들이밀 것이 아니다.
          이 페이지가 바로 그 '들여다보는' 자리이고, 위의 '다섯 가지 약속' 과도 결이 같다.
        ⚠️ 홈에서 지운 것이 아니라 **옮긴 것**이다 — 링크는 주 메뉴(병원 소개)로 살아 있다.
      */}
      <WhyUsSection />

      {/* 사회공헌 — 원문 그대로 */}
      <Container className="py-16">
        <SectionHead eyebrow="사회공헌" title="동그라미 치과 사회공헌" />
        <div className="mt-8 max-w-2xl space-y-3">
          {OUTREACH.map((o) => (
            <p key={o} className="text-[17px] leading-relaxed text-ink-soft">
              {o}
            </p>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { href: '/about/doctors', t: '의료진 소개', d: '교수 출신 대표원장' },
            { href: '/about/tour', t: '둘러보기', d: '병원 내부 사진' },
            { href: '/visit', t: '오시는 길', d: `${CLINIC.address.dong} 현창빌딩 3층` },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-2xl border border-brand-200/70 card-glass p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-brand-400"
            >
              <h2 className="text-[18px] font-black text-ink group-hover:text-brand-700">{c.t}</h2>
              <p className="mt-2 text-[15px] text-ink-soft">{c.d}</p>
            </Link>
          ))}
        </div>
      </Container>

      <ContactCta />
    </>
  );
}
