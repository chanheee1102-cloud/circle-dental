import Link from 'next/link';
import { Container } from '@/components/ui';
import { CLINIC } from '@/lib/clinic';

/**
 * 404.
 * ★ 막다른 길로 두지 않는다 — 잘못된 링크로 들어온 사람에게 다음 갈 곳을 준다.
 *   검색엔진도 404 에서 내부 링크를 따라 나머지 사이트를 다시 크롤링한다.
 */
export default function NotFound() {
  const links = [
    { href: '/insight/symptom', t: '증상으로 찾기', d: '지금 느끼는 것에서 시작' },
    { href: '/treatment', t: '진료과목', d: '어떤 치료를 하는지' },
    { href: '/visit', t: '오시는 길', d: '위치와 연락처' },
  ];
  return (
    <Container className="py-28 text-center">
      <p className="text-[14px] font-black tracking-[0.2em] text-gold-600 uppercase">404</p>
      <h1 className="mt-4 text-[30px] font-black tracking-[-0.02em] text-ink sm:text-[38px]">
        찾으시는 페이지가 없습니다
      </h1>
      <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
        주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 아래에서 찾아보세요.
      </p>

      <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-2xl border border-brand-100 card-glass p-5 text-left transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <span className="block text-[16.5px] font-black text-ink">{l.t}</span>
            <span className="mt-1 block text-[14px] text-ink-soft">{l.d}</span>
          </Link>
        ))}
      </div>

      <a
        href={CLINIC.phoneHref}
        className="mt-10 inline-flex rounded-full bg-brand-700 px-7 py-3.5 text-[17px] font-black text-white transition-colors hover:bg-brand-600"
      >
        {CLINIC.phone}
      </a>
    </Container>
  );
}
