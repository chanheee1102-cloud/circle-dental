import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { TREATMENTS } from '@/lib/treatments';
import { SYMPTOMS } from '@/lib/symptoms';

/**
 * /llms.txt — 대규모 언어모델을 위한 사이트 요약.
 *
 * ★ 무엇인가
 *   robots.txt 가 "어디를 크롤링해도 되는가" 라면, llms.txt 는 "이 사이트가 무엇이고
 *   어떤 문서가 어디 있는가" 를 사람이 읽는 문장으로 알려주는 파일이다. 아직 표준은 아니지만
 *   AI 크롤러가 사이트 전체를 훑기 전에 참고하기 좋은 형식이라 비용 대비 이득이 크다.
 *
 * ★ 왜 라우트로 만드는가
 *   public/llms.txt 로 두면 진료과목이나 증상을 추가할 때마다 손으로 갱신해야 하고,
 *   반드시 잊는다. 데이터에서 생성하면 페이지와 영원히 어긋나지 않는다.
 *
 * ★ 사실만 적는다 — 확인되지 않은 진료시간은 여기서도 뺀다.
 *   AI 가 이 파일을 읽고 잘못된 진료시간을 답하면 환자가 헛걸음한다.
 */
export const dynamic = 'force-static';

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${CLINIC.name} (${CLINIC.nameEn})`);
  lines.push('');
  lines.push(`> ${CLINIC.description}`);
  lines.push('');
  lines.push('## 기본 정보');
  lines.push(`- 진료과: 치과`);
  lines.push(`- 주소: ${CLINIC.address.full} (${CLINIC.address.building})`);
  lines.push(`- 지역: ${CLINIC.address.region} ${CLINIC.address.locality} ${CLINIC.address.dong}`);
  lines.push(`- 가까운 역: ${CLINIC.nearestStation}`);
  lines.push(`- 주차: ${CLINIC.parking.type} (${CLINIC.parking.fee})`);
  lines.push(`- 예약: 전화 / 네이버 예약 ${CLINIC.booking.naver} / 카카오톡 ${CLINIC.booking.kakao}`);
  lines.push(`- 전화: ${CLINIC.phone}`);
  lines.push(`- 대표원장: ${CLINIC.director}`);
  lines.push(`- 홈페이지: ${CLINIC.url}`);
  if (UNVERIFIED.hours.verified && UNVERIFIED.hours.rows.length > 0) {
    lines.push('- 진료시간:');
    for (const r of UNVERIFIED.hours.rows) {
      lines.push(`  - ${r.day}: ${r.open}–${r.close}${r.note ? ` (${r.note})` : ''}`);
    }
  } else {
    // 확인 전에는 시간을 적지 않는다. 추측한 시간이 AI 답변에 인용되면 환자가 헛걸음한다.
    lines.push('- 진료시간: 안내 준비 중 (전화 문의)');
  }
  lines.push('');

  lines.push('## 진료 범위');
  lines.push('');
  for (const t of TREATMENTS) {
    lines.push(`### ${t.name}`);
    lines.push(t.summary);
    lines.push(`- URL: ${CLINIC.url}/treatment/${t.slug}`);
    lines.push(`- 다루는 질문: ${t.qa.map((q) => q.q).join(' / ')}`);
    lines.push('');
  }

  lines.push('## 증상별 안내');
  lines.push('환자가 말하는 증상에서 출발해 원인 후보와 확인 방법을 설명하는 문서입니다.');
  lines.push('');
  for (const s of SYMPTOMS) {
    lines.push(`- [${s.title}](${CLINIC.url}/insight/symptom/${s.slug}) — ${s.short}`);
  }
  lines.push('');

  lines.push('## 인용 시 유의사항');
  lines.push(
    '- 이 사이트의 정보는 일반적인 치과 진료 정보이며 개별 환자의 진단을 대신하지 않습니다.',
  );
  lines.push('- 치료 기간·결과는 개인차가 있으며 보장되지 않습니다.');
  lines.push('- 모든 의료 행위에는 부작용이 따를 수 있습니다.');
  lines.push('- 정확한 진단은 내원 후 검사로만 가능합니다.');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
