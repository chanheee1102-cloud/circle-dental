/**
 * '이런 고민, 하고 계셨나요' — 환자가 실제로 품는 망설임과 그에 대한 답.
 *
 * ★★ 왜 이 섹션이 필요한가 ★★
 *   치과를 미루는 이유는 대개 '치료' 자체가 아니라 **망설임**이다.
 *   무서워서, 바가지 쓸까 봐, 시간이 없어서, 얼마 나올지 몰라서.
 *   진료 항목만 늘어놓으면 그 사람은 자기 이야기를 못 찾는다.
 *
 * ★★ 한 줄도 지어내지 않는다 ★★
 *   답변은 **이미 확인된 사실**로만 쓴다. 각 항목의 `source` 가 그 근거다.
 *   "안 아프게 해 드립니다" 같은 효과 단정은 쓰지 않는다 — 의료광고법이 금지하고,
 *   실제로 지킬 수 없는 약속이다. 우리가 말할 수 있는 것은 '무엇을 하는가' 까지다.
 *
 * ★ 모든 카드는 **실재하는 페이지**로 이어진다. 고민을 읽고 나서 갈 곳이 없으면
 *   그 자리에서 이탈한다. href 는 전부 이 저장소 안의 라우트다.
 */
export interface Concern {
  /** 환자의 말 — 따옴표 안에 그대로. 병원 말투로 다듬지 않는다. */
  quote: string;
  /** 답 — 두 문장 이내. 할 수 있는 것만 적는다. */
  answer: string;
  /** 이어지는 페이지. */
  href: string;
  /** 링크 글자 — '자세히 보기' 같은 빈 말 대신 갈 곳을 밝힌다. */
  cta: string;
  /** 답변의 근거. 화면에는 안 나오지만 사실 확인할 때 쓴다. */
  source: string;
}

export const CONCERNS: Concern[] = [
  {
    quote: '치과가 무서워서 계속 미뤄왔어요.',
    answer:
      '도포마취제와 마취가글로 주사 놓기 전 감각을 먼저 줄이고, 통증을 줄여 주는 마취 장비를 함께 씁니다.',
    href: '/about/special/pain-control',
    cta: '통증을 줄이는 방법',
    source: 'lib/clinic.ts STRENGTHS.pain — 도포마취제·마취가글·마취 장비 (원본 홈페이지 표기)',
  },
  {
    quote: '과잉진료 당할까 봐 걱정돼요.',
    answer:
      '자연치아를 최대한 살리고 임플란트는 마지막 선택이 되도록 봅니다. 다만 살릴 수 없는 치아를 억지로 끌고 가지도 않습니다.',
    href: '/treatment/save-natural-tooth',
    cta: '자연치아 살리기',
    source: 'lib/treatments.ts save-natural-tooth intro — 진료 철학 원문',
  },
  {
    quote: '다른 치과에서 뽑아야 한다고 들었어요.',
    answer:
      '뽑기 전에 한 번 더 보는 것이 이 진료의 출발점입니다. 신경치료 후 다시 아픈 경우, 금이 갔다고 들은 경우도 같습니다.',
    href: '/treatment/save-natural-tooth',
    cta: '살릴 수 있는지 보기',
    source: 'lib/treatments.ts save-natural-tooth whoFor — "다른 곳에서 발치를 권유받은 경우" 등',
  },
  {
    quote: '어디가 문제인지 저도 잘 모르겠어요.',
    answer:
      '병명은 몰라도 됩니다. 지금 느끼는 증상에서 시작해 무엇을 확인해야 하는지 찾아볼 수 있게 정리해 뒀습니다.',
    href: '/insight/symptom',
    cta: '증상으로 찾아보기',
    source: 'lib/symptoms.ts — 증상 26종 페이지. 홈 SymptomEntry 와 같은 출처',
  },
  {
    quote: '비용이 얼마나 나올지 몰라 겁이 나요.',
    answer:
      '진료비는 상태에 따라 달라 미리 확정할 수 없지만, 무엇이 보험이 되고 무엇이 비용을 좌우하는지는 미리 아실 수 있습니다.',
    href: '/insight/cost',
    cta: '비용 가이드',
    source: 'lib/insight.ts COST_TOPICS — 건강보험 적용·조건부·비급여 구분 안내',
  },
  {
    quote: '낮에는 도저히 시간을 못 내요.',
    answer:
      '화요일과 목요일은 저녁 8시 30분까지, 토요일은 오후 2시까지 봅니다.',
    href: '/visit',
    cta: '진료시간 · 오시는 길',
    source: 'lib/clinic.ts UNVERIFIED.hours — 화·목 20:30 / 토 14:00',
  },
];
