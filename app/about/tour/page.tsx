import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import Image from 'next/image';
import { IMG } from '@/lib/assets';
import { CLINIC } from '@/lib/clinic';
import { Container, SectionHead, Breadcrumb, ContactCta } from '@/components/ui';
import { Reveal } from '@/components/Reveal';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '병원 둘러보기',
  description: `${CLINIC.name} 내부 사진입니다. 상담실, 진료실, 대기 공간을 미리 보실 수 있습니다. ${CLINIC.address.dong} 현창빌딩 3층.`,
  alternates: { canonical: '/about/tour' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '병원 소개', path: '/about' },
  { name: '둘러보기', path: '/about/tour' },
];

/**
 * 병원 둘러보기.
 *
 * ★ 처음 가는 병원의 낯섦은 실제 방문을 미루게 하는 이유 중 하나다.
 *   내부를 미리 보여 주는 것만으로 그 문턱이 낮아진다.
 * ★ 사진은 기존 홈페이지의 실제 병원 사진이다.
 * ★ 첫 두 장만 priority — 나머지는 지연 로딩한다. 12장을 한꺼번에 받으면 초기 로딩이 무겁다.
 */
export default function TourPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(TRAIL)} />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          as="h1"
          eyebrow="Circle Dental Clinic"
          title="동그라미 치과 내부 둘러보기"
          desc="상담실과 진료실을 미리 보고 오시면 첫 방문이 조금 덜 낯섭니다."
        />

        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/about/tour" />
        </div>

        {/*
          ★★ 사진마다 설명을 눈에 보이게 단다 (2026-08-14) ★★
            전에는 사진 열두 장뿐이고 글이 120자였다. 사람에게는 "예쁘네" 로 끝나고,
            검색·답변 엔진 입장에서는 **인용할 문장이 하나도 없는 페이지**였다.
            사진이 무엇을 보여 주는지 한 줄씩 붙이면 같은 사진이 근거가 된다.
            설명은 lib/assets.ts 한 곳에서만 온다 — 사진 순서가 바뀌어도 어긋나지 않는다.
        */}
        {/*
          ★★ 격자로 바꿨다 — 벽돌쌓기(masonry)를 걷어냈다 (2026-08-14 운영자: "줄이나 규격 좀 맞춰줘") ★★
            `columns-3` 는 원본 비율대로 세로 길이가 제각각이라 **줄이 안 맞는다.**
            게다가 CSS 다단은 위→아래로 채운 뒤 다음 단으로 넘어가서 사진 순서가
            **왼쪽 위 → 왼쪽 아래 → 가운데 위** 로 읽힌다. 사람이 훑는 순서와 반대다.
            → 4:3 로 통일한 격자로 바꿨다. 줄이 맞고, 읽는 순서도 왼→오른쪽이다.

          ★ 카드 높이도 맞춘다 — 설명 줄 수가 달라 카드 키가 들쭉날쭉하던 것을
            `h-full` + `flex-col` + `mt-auto` 로 아래 선까지 맞췄다.
          ★ 사진은 순서대로 떠오른다(Reveal delay). 열두 장이 한꺼번에 나타나면
            어디부터 볼지 알 수 없다.
        */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {IMG.interior.map((shot, i) => (
            <Reveal key={shot.src} delay={(i % 3) * 70} className="h-full">
              <figure className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-200/60 bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-100">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    priority={i < 3}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                </div>
                <figcaption className="px-5 py-4 text-[13.5px] leading-relaxed text-ink-soft">
                  {shot.alt}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>

      <ContactCta
        title="직접 보시면 더 정확합니다"
        desc="궁금한 점이 있으시면 방문 전에 전화로 물어보셔도 됩니다."
      />
    </>
  );
}
