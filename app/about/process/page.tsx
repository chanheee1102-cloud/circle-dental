import type { Metadata } from 'next';
import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';
import { Container, SectionHead, Breadcrumb, MedicalNotice, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, abs } from '@/lib/seo';

export const metadata: Metadata = {
  title: '치과 처음 갈 때 — 무엇을 하고 무엇을 챙기나',
  description:
    '치과 첫 방문에는 문진, 방사선 촬영, 구강 검사, 계획 설명 순으로 진행됩니다. 무엇을 챙겨야 하는지, 복용 중인 약은 왜 알려야 하는지 정리했습니다.',
  alternates: { canonical: '/about/process' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '병원 소개', path: '/about' },
  { name: '진료 절차', path: '/about/process' },
];

/**
 * 첫 방문 안내.
 *
 * ★★ 이전 버전에서 걷어낸 것 ★★
 *   원래 이 페이지에는 '저희는 이렇게 진행합니다' 형태의 5단계와 단계별 소요시간이 있었다.
 *   전부 내가 지어낸 병원 방침이었다. 기존 홈페이지에 그런 내용이 없고, 병원이 실제로
 *   어떤 순서로 진료하는지 확인한 바가 없다. 의료광고에서 사실이 아닌 표시는 의료법 위반이다.
 *
 * ★ 대신 남긴 것 — **일반적인 치과 진료 절차**
 *   "치과 처음 가면 뭐 해요" 는 실제로 많이 들어오는 질의이고, 여기에 답하는 것은
 *   특정 병원의 방침을 주장하지 않고도 가능하다. 그래서 주어를 병원이 아니라
 *   '일반적으로' 로 바꿔 표준 절차를 설명한다. 사실 확인이 필요 없고, 병원 사정이
 *   바뀌어도 이 문서는 그대로 유효하다.
 *
 * ⚠️ 여기에 '저희는~' 문장을 다시 넣지 말 것. 넣으려면 원장님 확인이 먼저다.
 */
const FLOW = [
  {
    n: '01',
    t: '접수와 문진',
    d: '복용 중인 약과 전신 질환을 확인합니다. 혈압약, 당뇨약, 골다공증약, 항응고제는 치료 계획과 안전에 직접 영향을 주기 때문에 빠짐없이 알리는 것이 중요합니다.',
  },
  {
    n: '02',
    t: '방사선 촬영',
    d: '전체가 보이는 파노라마 사진을 찍고 필요하면 부위별로 추가 촬영합니다. 치아 사이나 뿌리 끝처럼 눈으로 볼 수 없는 곳은 사진이 아니면 확인할 방법이 없습니다.',
  },
  {
    n: '03',
    t: '구강 검사',
    d: '치아를 하나씩 확인하고 잇몸 주머니 깊이를 잽니다. 필요하면 씹어 보게 해서 통증이 재현되는지, 온도 자극에 어떻게 반응하는지 확인합니다.',
  },
  {
    n: '04',
    t: '설명과 계획 수립',
    d: '촬영한 사진을 함께 보며 지금 상태를 확인합니다. 급한 것과 지켜봐도 되는 것을 나누고, 각각 하지 않았을 때 어떻게 되는지와 대안을 함께 듣는 것이 좋습니다.',
  },
  {
    n: '05',
    t: '치료와 유지관리',
    d: '통증과 감염을 먼저 다루고 기능 회복으로 넘어가는 것이 일반적인 순서입니다. 치료를 마칠 때 다음에 언제 무엇을 확인할지 정해 두면 실제 사용 기간이 달라집니다.',
  },
];

const FIRST_VISIT_QA = [
  {
    q: '치과에 처음 가면 무엇을 하나요?',
    a: '문진, 방사선 촬영, 구강 검사, 설명 순으로 진행하는 것이 일반적입니다. 통증이나 감염처럼 급한 상황이면 그날 응급 처치를 먼저 하고, 급하지 않으면 검사와 계획 수립까지 하고 다음 방문부터 치료를 시작하는 경우가 많습니다.',
  },
  {
    q: '치과에 갈 때 무엇을 챙겨야 하나요?',
    a: '신분증과 복용 중인 약 목록을 챙기시면 됩니다. 다른 병원에서 찍은 방사선 사진이나 치료 기록이 있다면 함께 가져가면 중복 촬영을 줄일 수 있습니다.',
  },
  {
    q: '복용 중인 약을 꼭 알려야 하나요?',
    a: '반드시 알려야 합니다. 항응고제(아스피린·와파린 등)는 발치 시 출혈에, 골다공증 주사제는 발치 후 뼈 회복에 직접 영향을 줍니다. 임의로 중단하지 말고 복용 중이라는 사실만 알리면 치과와 주치의가 상의해 일정을 조율합니다.',
  },
  {
    q: '임신 중에도 치과 진료를 받을 수 있나요?',
    a: '받을 수 있습니다. 임신 중에는 호르몬 변화로 잇몸 염증이 잘 생겨 오히려 관리가 더 필요합니다. 다만 시기에 따라 권장되는 처치가 달라지므로 임신 주수를 먼저 알리는 것이 좋습니다.',
  },
  {
    q: '방사선 촬영은 안전한가요?',
    a: '치과용 방사선 촬영의 선량은 일상에서 받는 자연 방사선에 비해 매우 낮은 수준입니다. 다만 임신 중이거나 가능성이 있다면 미리 알려 촬영 여부와 방법을 상의하는 것이 좋습니다.',
  },
];

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: '치과 처음 갈 때 — 무엇을 하고 무엇을 챙기나',
            description: FIRST_VISIT_QA[0].a,
            path: '/about/process',
          }),
          faqSchema(FIRST_VISIT_QA),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: '치과 첫 방문 절차',
            description: FIRST_VISIT_QA[0].a,
            url: abs('/about/process'),
            step: FLOW.map((f, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: f.t,
              text: f.d,
            })),
          },
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          as="h1"
          eyebrow="첫 방문 안내"
          title="치과에 처음 가면 무엇을 하나요?"
          desc="무엇을 하는지 모르면 첫 방문이 부담스럽습니다. 일반적으로 어떤 순서로 진행되는지 정리했습니다."
        />

        <ol className="relative mt-14 space-y-0 border-l-2 border-brand-200 pl-8">
          {FLOW.map((f) => (
            <li key={f.n} className="relative pb-10 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[41px] top-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-brand-300 bg-cream text-[12px] font-black text-brand-600"
              >
                {f.n}
              </span>
              <h2 className="display-sm text-[19px] text-ink">{f.t}</h2>
              <p className="mt-3 max-w-[64ch] text-[15.5px] leading-[1.85] text-ink-soft">{f.d}</p>
            </li>
          ))}
        </ol>
      </Container>

      <section className="border-y border-brand-200/60 bg-white py-16">
        <Container>
          <h2 className="display-sm text-[24px] text-ink sm:text-[28px]">첫 방문 전 자주 묻는 것</h2>
          <div className="mt-8 divide-y divide-brand-100 border-t border-brand-100">
            {FIRST_VISIT_QA.map((qa) => (
              <article key={qa.q} className="py-6">
                <h3 className="text-[18px] font-black leading-snug text-ink">{qa.q}</h3>
                <p className="mt-3 max-w-[68ch] text-[15.5px] leading-[1.85] text-ink-soft">{qa.a}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <div className="rounded-2xl border border-brand-200/70 bg-white p-8 shadow-[var(--shadow-soft)]">
          <h2 className="display-sm text-[19px] text-ink">동그라미치과의원 방문 안내</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
            진료시간과 위치는 내원 안내에서, 예약은 아래 채널로 확인하실 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={CLINIC.phoneHref}
              className="rounded-lg bg-gradient-to-b from-brand-500 to-brand-600 px-6 py-3 text-[15.5px] font-black text-white shadow-[var(--shadow-btn)]"
            >
              {CLINIC.phone}
            </a>
            <a
              href={CLINIC.booking.naver}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-brand-300 bg-white px-6 py-3 text-[15.5px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              네이버 예약
            </a>
            <a
              href={CLINIC.booking.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-brand-300 bg-white px-6 py-3 text-[15.5px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              카카오톡 상담
            </a>
            <Link
              href="/visit"
              className="rounded-lg border border-brand-300 bg-white px-6 py-3 text-[15.5px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              오시는 길
            </Link>
          </div>
        </div>

        <MedicalNotice />
      </Container>

      <ContactCta />
    </>
  );
}
