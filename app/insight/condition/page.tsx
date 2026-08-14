import type { Metadata } from 'next';
import Link from 'next/link';
import { CONDITIONS } from '@/lib/conditions';
import { Container, SectionHead, Breadcrumb, MedicalNotice, ContactCta } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '질환 사전',
  description:
    '치주염, 치수염, 드라이소켓, 턱관절장애, 임플란트주위염까지. 진료실에서 들은 병명을 한 문장 정의부터 진행 단계·치료까지 정리했습니다.',
  alternates: { canonical: '/insight/condition' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '인사이트', path: '/insight' },
  { name: '질환 사전', path: '/insight/condition' },
];

/**
 * 질환 사전 허브.
 *
 * ★ 목록에 정의 한 문장을 그대로 노출한다 — 클릭 전에 답의 방향이 보이고,
 *   이 페이지 자체도 정의형 질의의 인용 대상이 된다.
 */
export default function ConditionIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          /*
            ⚠️⚠️ 여기에 FAQPage 를 내지 않는다 (2026-08-14, 실측으로 발견) ⚠️⚠️
              전에는 `${c.name}(${c.aka[0]})이란?` 15문항을 마크업하고 있었다. 그런데
              **그 질문 문장은 화면 어디에도 없다** — 이 페이지는 질환 이름과 정의를 늘어놓는
              목록이지 문답이 아니다. 질문을 코드에서 만들어 붙인 것이라 실측에서
              '화면에 없는 문답 15건' 으로 잡혔다.
              화면에 없는 문답을 마크업하는 것은 구글 구조화 데이터 정책 위반이고
              수동 조치 대상이다. 문답은 각 질환 상세 페이지가 이미 제대로 내고 있다.
          */
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          as="h1"
          eyebrow="질환 사전"
          title="진료실에서 들은 그 병명, 무엇인지부터"
          desc="증상으로 찾기가 병명을 모를 때의 입구라면, 여기는 이미 병명을 들은 분을 위한 자리입니다. 한 문장 정의부터 진행 단계와 치료 방향까지 정리했습니다."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {CONDITIONS.map((c) => (
            <Link
              key={c.slug}
              href={`/insight/condition/${c.slug}`}
              className="group flex h-full flex-col rounded-xl border border-brand-200/70 bg-white p-7 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="display-sm text-[19px] text-ink group-hover:text-brand-700">{c.name}</h2>
                <span className="text-[13px] font-semibold text-ink-muted">{c.aka.join(' · ')}</span>
              </div>
              <p className="mt-3 flex-1 text-[14.5px] leading-[1.8] text-ink-soft">{c.definition}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-black text-brand-700">
                자세히 보기
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>

        <MedicalNotice />
      </Container>

      <ContactCta
        title="병명을 알아도 내 상태는 다를 수 있습니다"
        desc="같은 진단이라도 진행 정도와 남은 조직 상태에 따라 치료가 갈립니다. 검사로 확인해야 정해집니다."
      />
    </>
  );
}
