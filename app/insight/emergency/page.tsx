import type { Metadata } from 'next';
import { CLINIC } from '@/lib/clinic';
import { Container, SectionHead, Breadcrumb, MedicalNotice } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '치과 응급 상황 — 지금 해야 할 것',
  description:
    '치아가 빠졌을 때, 부러졌을 때, 밤에 참기 힘들 때. 병원에 도착하기 전 지금 할 수 있는 것과 하면 안 되는 것을 정리했습니다.',
  alternates: { canonical: '/insight/emergency' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '인사이트', path: '/insight' },
  { name: '응급 상황', path: '/insight/emergency' },
];

/**
 * 응급 가이드.
 *
 * ★ 이 페이지는 전환보다 안전이 목적이다.
 *   빠진 영구치는 30분 안에 어떻게 다루느냐로 살릴 수 있는지가 갈린다. 그 정보를
 *   병원 영업시간 안내 뒤에 숨기면 안 된다. 그래서 CTA 를 아래에 두지 않고 각 항목 안에 뒀다.
 * ★ "하면 안 되는 것" 을 반드시 함께 적는다 — 좋은 뜻으로 한 행동이 결과를 망치는 경우가
 *   응급 상황에서 특히 잦다(빠진 치아 뿌리를 문질러 닦는 것이 대표적이다).
 */
const CASES = [
  {
    id: 'knocked-out',
    title: '치아가 통째로 빠졌어요',
    urgency: '30분 이내',
    answer:
      '빠진 영구치는 빨리 제자리에 돌려놓을수록 살릴 가능성이 높아지며, 30분 이내가 가장 좋습니다. 치아의 머리 부분만 잡고 뿌리는 만지지 마세요. 뿌리 표면에 붙어 있는 세포가 다시 붙는 데 결정적인데, 문질러 닦으면 그 세포가 죽습니다.',
    doList: [
      '치아 머리(씹는 면) 부분만 잡습니다.',
      '흙이 묻었다면 우유나 생리식염수에 살짝 헹구기만 합니다.',
      '가능하면 원래 자리에 조심스럽게 다시 끼워 넣고 거즈를 물어 고정합니다.',
      '끼우기 어렵다면 우유에 담가 가지고 오세요. 우유가 없으면 입안 볼과 잇몸 사이에 물고 옵니다.',
    ],
    dontList: [
      '뿌리를 손으로 문지르거나 솔로 닦지 마세요.',
      '수돗물에 오래 담가두지 마세요. 세포가 손상됩니다.',
      '휴지나 마른 천에 싸서 가져오지 마세요. 마르면 살리기 어렵습니다.',
    ],
    note: '유치가 빠진 경우에는 다시 심지 않습니다. 아래에서 올라오는 영구치가 다칠 수 있습니다.',
  },
  {
    id: 'fractured',
    title: '치아가 부러지거나 깨졌어요',
    urgency: '당일',
    answer:
      '부러진 조각이 있다면 버리지 말고 우유나 생리식염수에 담가 함께 가져오세요. 조각을 그대로 붙일 수 있는 경우가 있습니다. 안쪽에서 붉은 점이 보이거나 피가 비친다면 신경이 노출된 것이라 그날 안에 처치가 필요합니다.',
    doList: [
      '부러진 조각을 우유나 생리식염수에 담아 가져옵니다.',
      '날카로운 단면이 혀나 볼을 긁는다면 약국의 치과용 왁스나 무설탕 껌으로 임시로 덮습니다.',
      '부기가 있으면 바깥쪽에서 냉찜질을 합니다.',
    ],
    dontList: [
      '접착제로 직접 붙이지 마세요. 신경이 손상되고 나중에 치료가 더 어려워집니다.',
      '아픈 쪽으로 씹지 마세요.',
    ],
    note: '겉보기에 작게 깨졌어도 안쪽으로 금이 이어져 있을 수 있어 확인이 필요합니다.',
  },
  {
    id: 'severe-pain',
    title: '밤에 통증이 심해서 참기 어려워요',
    urgency: '진통 후 다음 진료일',
    answer:
      '가만히 있어도 욱신거리고 누우면 심해지는 통증은 치아 속 신경에 염증이 생겼을 때 나타납니다. 베개를 높여 머리를 심장보다 높게 두면 압력이 줄어 조금 덜해집니다. 진통제는 표시된 용법대로 복용하고, 절대 알약을 아픈 치아나 잇몸 위에 올려두지 마세요.',
    doList: [
      '머리를 높이고 앉은 자세에 가깝게 쉽니다.',
      '바깥쪽 볼에 냉찜질을 합니다.',
      '아픈 쪽으로 씹지 않고, 아주 차갑거나 뜨거운 음식을 피합니다.',
    ],
    dontList: [
      '진통제를 잇몸에 직접 올려두지 마세요. 화학 화상을 입습니다.',
      '뜨거운 찜질은 염증을 키울 수 있습니다.',
      '술로 통증을 눌러보려 하지 마세요.',
    ],
    note: '얼굴이 붓거나 열이 나거나 입이 잘 벌어지지 않으면 다음 날을 기다리지 말고 진료를 받아야 합니다.',
  },
  {
    id: 'swelling',
    title: '얼굴이나 잇몸이 부어올랐어요',
    urgency: '즉시',
    answer:
      '치과 감염으로 인한 부기는 번지는 속도가 빠를 수 있어 응급에 가깝게 봅니다. 특히 눈 주변이나 목 쪽으로 번지거나, 입이 잘 벌어지지 않거나, 삼키기 힘들거나 숨쉬기 불편하다면 지체하지 말고 진료를 받아야 합니다. 이 경우는 치과 진료시간을 기다리지 말고 응급실을 포함해 가장 빨리 갈 수 있는 곳으로 가는 편이 안전합니다.',
    doList: [
      '바깥쪽에서 냉찜질을 합니다.',
      '고름 주머니가 보여도 건드리지 말고 그대로 둡니다.',
      '체온을 확인하고 열이 나는지 기록해 둡니다.',
    ],
    dontList: [
      '부은 곳을 누르거나 터뜨리려 하지 마세요. 감염이 더 넓게 번집니다.',
      '뜨거운 찜질을 하지 마세요.',
      '남은 항생제를 임의로 복용하지 마세요.',
    ],
    note: '숨쉬기 불편하거나 삼키기 어려우면 즉시 응급실로 가셔야 합니다.',
  },
  {
    id: 'post-extraction',
    title: '발치했는데 피가 멈추지 않아요',
    urgency: '2시간 이상 지속 시',
    answer:
      '발치 후 약간 배어나오는 정도는 정상이지만, 거즈를 물었는데도 선홍색 피가 계속 나온다면 조치가 필요합니다. 거즈를 새로 접어 상처 부위에 정확히 올리고 30분간 세게 물어보세요. 이때 중간에 확인하려고 자꾸 빼면 굳으려던 혈병이 다시 떨어집니다.',
    doList: [
      '깨끗한 거즈를 두툼하게 접어 상처 위에 정확히 놓고 30분간 꾹 뭅니다.',
      '앉은 자세를 유지하고 머리를 높입니다.',
      '거즈가 없으면 티백(홍차)을 적셔 물어도 도움이 됩니다.',
    ],
    dontList: [
      '침을 세게 뱉거나 빨대를 쓰지 마세요. 혈병이 빠집니다.',
      '뜨거운 음식이나 술, 흡연을 피하세요.',
      '상처를 혀로 자꾸 건드리지 마세요.',
    ],
    note: '2시간 이상 눌러도 멈추지 않거나 어지럽다면 바로 연락 주세요.',
  },
];

export default function EmergencyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          faqSchema(CASES.map((c) => ({ q: c.title, a: c.answer }))),
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <SectionHead
          eyebrow="응급 상황"
          title="지금 할 수 있는 것과, 하면 안 되는 것"
          desc="응급 상황에서는 좋은 뜻으로 한 행동이 결과를 바꾸기도 합니다. 병원에 오시기 전 몇 분 동안의 조치를 정리했습니다."
        />

        {/* 전화 안내를 맨 위에 둔다 — 급한 사람이 아래까지 읽지 않는다. */}
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl bg-brand-700 px-7 py-6 text-white">
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-black">지금 상황을 먼저 말씀해 주세요</p>
            <p className="mt-1 text-[13.5px] text-brand-100/85">
              바로 오셔야 하는지, 조치 후 다음 진료일에 오셔도 되는지 판단해 드립니다.
            </p>
          </div>
          <a
            href={CLINIC.phoneHref}
            className="shrink-0 rounded-lg bg-white px-6 py-3 text-[16px] font-black text-brand-700"
          >
            {CLINIC.phone}
          </a>
        </div>

        <div className="mt-12 space-y-5">
          {CASES.map((c) => (
            <article
              key={c.id}
              id={c.id}
              className="scroll-mt-28 overflow-hidden rounded-2xl border border-brand-100 bg-white"
            >
              <div className="border-b border-brand-50 p-7">
                <span className="inline-flex rounded-lg bg-gold-400/20 px-3 py-1 text-[11.5px] font-black text-gold-600">
                  {c.urgency}
                </span>
                <h2 className="mt-3.5 text-[20px] font-black leading-snug tracking-[-0.01em] text-ink sm:text-[22px]">
                  {c.title}
                </h2>
                <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.85] text-ink">{c.answer}</p>
              </div>

              <div className="grid gap-0 sm:grid-cols-2">
                <div className="border-b border-brand-50 p-7 sm:border-b-0 sm:border-r">
                  <h3 className="text-[13px] font-black tracking-wide text-brand-700">이렇게 하세요</h3>
                  <ul className="mt-3.5 space-y-2.5">
                    {c.doList.map((d) => (
                      <li key={d} className="flex gap-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                        <span aria-hidden className="mt-0.5 shrink-0 font-black text-brand-500">
                          ○
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-7">
                  <h3 className="text-[13px] font-black tracking-wide text-gold-600">
                    이건 하지 마세요
                  </h3>
                  <ul className="mt-3.5 space-y-2.5">
                    {c.dontList.map((d) => (
                      <li key={d} className="flex gap-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                        <span aria-hidden className="mt-0.5 shrink-0 font-black text-gold-500">
                          ✕
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="border-t border-brand-50 bg-cream/60 px-7 py-4 text-[13.5px] leading-relaxed text-ink-soft">
                {c.note}
              </p>
            </article>
          ))}
        </div>

        <MedicalNotice extra="숨쉬기 어렵거나 삼키기 힘들 정도의 부기, 멈추지 않는 출혈, 의식이 흐려지는 증상은 치과가 아니라 응급실로 가셔야 합니다." />
      </Container>
    </>
  );
}
