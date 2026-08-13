import type { Metadata } from 'next';
import Image from 'next/image';
import { IMG } from '@/lib/assets';
import { CLINIC } from '@/lib/clinic';
import { Container, SectionHead, Breadcrumb, ContactCta } from '@/components/ui';
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
          eyebrow="Circle Dental Clinic"
          title="동그라미 치과 내부 둘러보기"
          desc="상담실과 진료실을 미리 보고 오시면 첫 방문이 조금 덜 낯섭니다."
        />

        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {IMG.interior.map((src, i) => (
            <figure
              key={src}
              className="group break-inside-avoid overflow-hidden rounded-xl shadow-[var(--shadow-soft)]"
            >
              <Image
                src={src}
                alt={`${CLINIC.name} 내부 ${i + 1}`}
                width={1200}
                height={900}
                priority={i < 2}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </figure>
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
