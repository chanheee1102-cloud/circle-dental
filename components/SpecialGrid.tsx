import Link from 'next/link';
import Image from 'next/image';
import { SPECIALS } from '@/lib/specials';
import { StrengthIcon } from '@/components/StrengthIcons';

/**
 * '동그라미 치과만의 특별함' 카드 5장.
 *
 * ★ 홈과 /about 이 함께 쓴다. 두 곳에 각각 만들면 한쪽만 고쳐져 어긋난다.
 * ★ 사진을 카드 안에 크게 둔다 — 아이콘만 있을 때보다 무엇에 대한 이야기인지 즉시 읽힌다.
 *   아이콘은 사진 위에 작게 얹어 5장이 한 세트로 보이게 하는 역할만 한다.
 * ★ 첫 두 장만 priority — 5장을 한꺼번에 우선 로딩하면 첫 화면이 느려진다.
 */
export function SpecialGrid({ eager = false }: { eager?: boolean }) {
  return (
    <div className="reveal-stack grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {SPECIALS.map((s, i) => (
        <Link
          key={s.slug}
          href={`/about/special/${s.slug}`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-brand-200/70 card-glass shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1.5 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={s.image}
              alt={s.alt}
              fill
              priority={eager && i < 2}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* 아래쪽만 어둡게 — 그 위에 올린 번호와 아이콘이 밝은 사진에서도 읽힌다. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-transparent to-transparent"
            />
            <span
              aria-hidden
              className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-xl card-glass/95 text-brand-600 shadow-lg backdrop-blur"
            >
              <StrengthIcon name={s.key} />
            </span>
            <span
              aria-hidden
              className="absolute bottom-5 right-5 text-[22px] font-black leading-none text-white/85"
            >
              {s.no}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-7">
            <p className="text-[13.5px] font-black tracking-[0.12em] text-brand-500">{s.eyebrow}</p>
            <h3 className="display-sm mt-2.5 text-[20px] text-ink group-hover:text-brand-700">
              {s.title}
            </h3>
            <p className="mt-3.5 flex-1 text-[15.5px] leading-[1.8] text-ink-soft">{s.body}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-black text-brand-700">
              자세히 보기
              <span
                aria-hidden
                className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[13.5px] transition-all group-hover:bg-brand-500 group-hover:text-white"
              >
                →
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
