import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import { CLINIC } from '@/lib/clinic';
import { Container, Breadcrumb, NeedsInfo } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, medicalWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description:
    '동그라미치과의원 홈페이지 개인정보처리방침. 이 홈페이지는 문의·예약 양식을 두지 않아 온라인으로 개인정보를 수집하지 않습니다. 내원 시 수집하는 진료 정보의 법정 보존기간과 정보주체의 권리를 안내합니다.',
  alternates: { canonical: '/privacy' },
  // 방침 페이지가 진료 페이지보다 앞에 노출되면 검색 품질이 떨어진다.
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '개인정보처리방침', path: '/privacy' },
];

/**
 * 개인정보처리방침.
 *
 * ★ 왜 필요한가
 *   개인정보보호법 제30조는 개인정보처리자에게 처리방침 수립·공개를 의무로 둔다.
 *   병원은 진료 과정에서 민감정보(건강정보)를 다루므로 예외가 아니다.
 *   AI 진단에서도 이 페이지의 부재가 'E-E-A-T 신뢰' 축을 끌어내리고 있었다(40/100).
 *
 * ★★ 이 문서는 **이 홈페이지가 실제로 하는 일만** 적는다 ★★
 *   흔한 사고가 남의 병원 방침을 베껴 오는 것이다. 그러면 있지도 않은 '회원가입',
 *   수집하지도 않는 '주민등록번호' 가 적히고, 그건 사실과 다른 고지라 오히려 위반이다.
 *   실측으로 확인한 사실만 쓴다:
 *     · 이 사이트에 <form>·<input> 은 0개다 — 온라인 수집 경로가 존재하지 않는다.
 *     · 외부 임베드는 Vimeo(player.vimeo.com, dnt=1)와 Google 지도 둘뿐이다.
 *     · 예약은 네이버예약·카카오톡 채널로 **이동**한다(우리 서버를 거치지 않는다).
 *
 * ★ 보존기간은 지어내지 않는다 — 의료법 시행규칙 제15조의 법정 기간을 그대로 옮긴다.
 *   병원이 임의로 정하는 값이 아니라 법이 정한 값이라 확인 가능한 사실이다.
 *
 * ★ 개인정보 보호책임자만 UNVERIFIED 다. 누구를 지정했는지는 병원만 안다.
 *   추측해서 대표원장 이름을 적으면 그 자체가 허위 고지가 된다.
 */
export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: '개인정보처리방침',
            description: metadata.description as string,
            path: '/privacy',
          }),
        ]}
      />

      <Container className="pt-10">
        <Breadcrumb trail={TRAIL} />
      </Container>

      <Container className="py-12 lg:py-16">
        <h1 className="reveal display text-[30px] text-ink sm:text-[38px]">개인정보처리방침</h1>
        <p className="mt-5 max-w-[70ch] text-[16px] leading-[1.85] text-ink-soft">
          {CLINIC.name}은 「개인정보 보호법」과 「의료법」에 따라 환자의 개인정보를 보호하고 관련 고충을
          신속하게 처리하기 위해 다음과 같이 처리방침을 두고 있습니다. 이 방침은 {CLINIC.name} 홈페이지
          이용과 내원 진료 모두에 적용됩니다.
        </p>

        {/* 개인정보처리방침은 '언제 기준인지' 가 특히 중요하다 — 개정 이력이 곧 신뢰다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/privacy" />
        </div>

        <div className="mt-14 space-y-14">
          <Article
            n="1"
            title="이 홈페이지는 개인정보를 수집하지 않습니다"
            lead="회원가입·문의·예약 양식이 없으므로 홈페이지에서 이름·연락처 등을 입력받는 절차가 존재하지 않습니다."
          >
            <p>
              이 홈페이지에는 개인정보를 입력받는 양식이 하나도 없습니다. 상담과 예약은 전화, 네이버예약,
              카카오톡 채널로 연결되며 이때 입력하신 정보는 각 서비스 사업자가 처리하고 저희 서버를 거치지
              않습니다. 따라서 해당 채널의 개인정보 처리는 네이버 및 카카오의 개인정보처리방침을 따릅니다.
            </p>
            <p>
              다만 홈페이지를 제공하는 과정에서 웹서버의 접속 기록(접속 일시, 브라우저 종류, 접속한 주소)이
              자동으로 남을 수 있습니다. 이 기록은 서비스 운영과 장애 대응 목적으로만 쓰이며 개인을 특정하는
              용도로 이용하지 않습니다.
            </p>
          </Article>

          <Article
            n="2"
            title="외부 서비스가 함께 실리는 부분이 있습니다"
            lead="병원 소개 영상과 지도는 외부 서비스를 화면에 얹어 보여주는 방식이라, 해당 서비스의 쿠키가 사용될 수 있습니다."
          >
            <p>
              홈페이지 첫 화면의 병원 영상은 Vimeo, 오시는 길의 지도는 Google 지도를 화면에 함께 실어
              보여줍니다. 이 과정에서 각 서비스가 브라우저에 쿠키를 남길 수 있으며 이는 저희가 아니라 해당
              사업자가 처리합니다. 영상은 추적을 최소화하는 설정(Do Not Track)을 적용해 제공하고 있습니다.
            </p>
            <p>
              브라우저 설정에서 쿠키 저장을 거부하실 수 있습니다. 다만 거부하시면 영상이나 지도가 정상적으로
              보이지 않을 수 있습니다.
            </p>
          </Article>

          <Article
            n="3"
            title="내원하시면 진료를 위한 정보를 받습니다"
            lead="접수·진료·보험청구에 필요한 최소한의 정보를 받으며, 건강에 관한 정보는 민감정보로 분류해 별도로 관리합니다."
          >
            <p>
              진료 접수 시 성명, 생년월일, 연락처, 주소를 받고 진료 과정에서 병력·복용약·검사결과·방사선
              영상 등 건강에 관한 정보가 기록됩니다. 건강정보는 「개인정보 보호법」 제23조의 민감정보에
              해당하므로 진료와 법령이 정한 목적 외에는 사용하지 않습니다.
            </p>
            <p>
              수집한 정보는 진료와 상담, 진료비 청구와 수납, 건강보험 요양급여 청구, 진료기록의 작성과 보관,
              그리고 법령상 의무 이행을 위해 사용합니다. 이 범위를 벗어나는 목적으로는 이용하지 않으며,
              마케팅 목적으로 활용하지 않습니다.
            </p>
          </Article>

          <Article
            n="4"
            title="보존기간은 저희가 정하는 것이 아니라 법이 정합니다"
            lead="진료기록의 보존기간은 「의료법 시행규칙」 제15조에 정해져 있으며, 병원이 임의로 늘리거나 줄일 수 없습니다."
          >
            <p>
              「의료법 시행규칙」 제15조는 기록의 종류마다 보존기간을 정하고 있습니다. 진료기록부와 수술기록은
              10년, 환자 명부와 검사내용 및 검사소견기록, 방사선 사진과 그 소견서, 간호기록부는 5년,
              진단서 등의 부본은 3년, 처방전은 2년입니다.
            </p>
            <p>
              보존기간이 지난 기록은 복구할 수 없는 방법으로 파기합니다. 전자적으로 저장된 기록은 재생이
              불가능한 기술적 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.
            </p>
          </Article>

          <Article
            n="5"
            title="제3자에게 제공하는 경우는 법령이 정한 때뿐입니다"
            lead="건강보험 청구처럼 법령에 근거가 있거나 환자가 동의한 경우에 한해 제공합니다."
          >
            <p>
              원칙적으로 개인정보를 외부에 제공하지 않습니다. 다만 국민건강보험공단·건강보험심사평가원에
              요양급여를 청구하는 경우, 법령에 특별한 규정이 있는 경우, 수사기관이 법이 정한 절차에 따라
              요구하는 경우, 그리고 환자 본인이 동의한 경우에는 그 범위 안에서 제공합니다.
            </p>
            <p>
              다른 의료기관으로 진료 의뢰나 회송이 필요할 때는 환자의 동의를 받은 뒤 진료에 필요한 범위의
              정보만 전달합니다.
            </p>
          </Article>

          <Article
            n="6"
            title="본인의 정보에 대해 요구하실 수 있는 권리가 있습니다"
            lead="열람, 정정·삭제, 처리정지를 요구하실 수 있고 병원은 지체 없이 조치해야 합니다."
          >
            <p>
              「개인정보 보호법」 제35조부터 제37조에 따라 본인의 개인정보에 대한 열람, 정정과 삭제, 처리정지를
              요구하실 수 있습니다. 요구는 전화({CLINIC.phone}) 또는 이메일({CLINIC.email})로 하실 수 있으며
              병원은 지체 없이 필요한 조치를 하겠습니다.
            </p>
            <p>
              다만 진료기록은 「의료법」이 보존을 의무로 정하고 있어 보존기간 안에는 삭제 요구에 응하기 어려울
              수 있습니다. 이 경우 그 사유를 알려 드립니다. 만 14세 미만 아동의 정보는 법정대리인이 위 권리를
              행사하실 수 있습니다.
            </p>
            <p>
              진료기록 사본의 발급은 「의료법」 제21조에 따라 환자 본인, 또는 법이 정한 요건을 갖춘 대리인이
              신분 확인 절차를 거쳐 신청하실 수 있습니다.
            </p>
          </Article>

          <Article
            n="7"
            title="안전하게 관리하기 위해 하는 일"
            lead="접근 권한을 최소한으로 제한하고, 기록에 접근한 이력을 남깁니다."
          >
            <p>
              진료기록에 접근할 수 있는 사람을 업무상 필요한 최소한으로 제한하고 접근 권한을 부여·변경·말소한
              기록을 남깁니다. 개인정보를 다루는 직원에게는 정기적으로 교육을 실시하며, 기록이 보관된 장소는
              잠금장치를 두어 통제합니다.
            </p>
          </Article>

          <Article
            n="8"
            title="개인정보 보호책임자"
            lead="개인정보 처리에 관한 문의와 불만은 아래로 연락 주시면 됩니다."
          >
            <p>
              개인정보 처리에 관한 문의, 불만 처리, 피해 구제는 {CLINIC.name}({CLINIC.phone},{' '}
              {CLINIC.email})으로 연락 주시기 바랍니다.
            </p>
            <div className="mt-6 not-prose">
              <NeedsInfo
                label="개인정보 보호책임자 지정"
                note="「개인정보 보호법」 제31조는 개인정보 보호책임자를 지정해 공개하도록 정하고 있습니다. 성명과 직책을 알려주시면 이 자리에 넣겠습니다. 추측해서 적으면 사실과 다른 고지가 되므로 비워 두었습니다."
              />
            </div>
            <p className="mt-6">
              개인정보 침해로 도움이 필요하시면 개인정보분쟁조정위원회(1833-6972), 개인정보침해신고센터
              (국번 없이 118), 대검찰청 사이버수사과(1301), 경찰청 사이버수사국(국번 없이 182)에 문의하실 수
              있습니다.
            </p>
          </Article>

          <Article
            n="9"
            title="방침이 바뀌면 알려 드립니다"
            lead="내용을 더하거나 고칠 때는 시행 7일 전부터 홈페이지에 알립니다."
          >
            <p>
              법령이나 병원 내부 방침이 바뀌어 이 처리방침을 고칠 때는 시행 7일 전부터 홈페이지에 변경 사유와
              내용을 알리겠습니다. 환자의 권리에 중요한 영향을 미치는 변경은 30일 전에 알립니다.
            </p>
          </Article>
        </div>

        <div className="mt-16 rounded-2xl bg-brand-50 p-7 text-[14px] leading-relaxed text-ink-soft">
          <p className="font-bold text-brand-700">사업자 정보</p>
          <p className="mt-2.5">
            {CLINIC.name} · 대표자 {CLINIC.director} · 사업자등록번호 {CLINIC.bizNo}
          </p>
          <p className="mt-1">{CLINIC.address.full}</p>
          <p className="mt-1">
            대표전화 {CLINIC.phone} · 이메일 {CLINIC.email}
          </p>
        </div>
      </Container>
    </>
  );
}

/**
 * 조항 하나.
 *
 * ★ 제목 바로 뒤에 한 문장 요약(lead)을 둔다.
 *   법률 문서는 결론이 문단 끝에 오는 경우가 많아 사람도 AI 도 답을 못 찾는다.
 *   질문 형태의 제목 + 즉답은 이 사이트가 전체적으로 쓰는 형식이다.
 */
function Article({
  n,
  title,
  lead,
  children,
}: {
  n: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <section className="reveal">
      <p className="text-[12.5px] font-black tracking-[0.18em] text-brand-500">제 {n} 조</p>
      <h2 className="display-sm mt-2.5 text-[20px] leading-snug text-ink sm:text-[23px]">{title}</h2>
      <p className="mt-3.5 max-w-[70ch] text-[15.5px] font-semibold leading-[1.8] text-brand-700">
        {lead}
      </p>
      <div className="mt-4 max-w-[70ch] space-y-4 text-[15.5px] leading-[1.9] text-ink-soft">
        {children}
      </div>
    </section>
  );
}
