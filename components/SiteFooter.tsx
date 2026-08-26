import Link from 'next/link';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { NAV } from '@/lib/nav';
import { LogoLockup } from '@/components/Logo';
import { SITE_MODIFIED, formatKoreanDate } from '@/lib/contentMeta';

/**
 * 전역 푸터.
 *
 * ★ 사업자 정보는 여기 한 곳에만 적는다. 두 군데 적으면 반드시 어긋난다.
 * ★ 진료시간은 확인 전까지 '확인 중' 으로 표시한다. 임의의 시간을 적어 두면
 *   그걸 보고 온 환자가 헛걸음한다 — 잘못된 정보는 없는 것보다 나쁘다.
 *
 * ★★ 규격·배치 정리 (2026-08-14 운영자: "밑에좀 잘 정리해줘 규격, 배치, 줄 다 맞춰서") ★★
 *   네 가지가 어긋나 있었다.
 *     ① 메뉴가 **3칸 격자에 4개**라 '내원 안내' 만 둘째 줄로 밀렸는데,
 *        첫 줄의 높이를 항목 열한 개짜리 '진료' 가 정하는 바람에 그 위로
 *        빈 화면이 200px 넘게 생겼다. 화면에서 가장 눈에 띄던 결함이다.
 *     ② 공식 채널 네 개가 flex-wrap 이라 글자 수대로 폭이 제각각이었다
 *        ('인스타그램' 과 '카카오톡 상담' 이 한 줄에 서면 오른쪽 끝이 안 맞는다).
 *     ③ 아래 사업자 정보가 왼쪽 2줄 / 오른쪽 3줄이라 두 칸의 끝이 어긋났고,
 *        진료시간은 다섯 항목이 한 줄에 이어 붙어 어디서 끊어 읽어야 할지 알 수 없었다.
 *     ④ 푸터 폭(1200)만 본문 폭(1320)과 달라 스크롤을 내리면 양옆이 미묘하게 좁아졌다.
 *   → 한 줄짜리 5칸 격자(브랜드 + 메뉴 4)로 세우고, 폭이 정해진 것끼리 줄을 맞췄다.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-brand-100 bg-brand-900 text-brand-100">
      {/* 본문 Container(max-w-[1320px] px-5 lg:px-8)와 같은 폭·여백 — 푸터만 좁으면 축이 어긋난다. */}
      <div className="mx-auto max-w-[1320px] px-5 py-14 lg:px-8">
        {/*
          ★ 5칸 한 줄 — 브랜드 한 칸 + 메뉴 네 칸. 메뉴를 3칸에 넣으면 4번째가 반드시 밀린다.
          ⚠️ 메뉴 칸을 minmax(0,1fr) 로 잡을 것. 그냥 1fr 이면 '오시는 길·진료시간' 같은
             긴 항목이 칸을 밀어내 네 칸의 폭이 서로 달라진다.
        */}
        {/*
          ⚠️ 브랜드 칸을 1024px 에서도 300px 로 두면 메뉴 칸이 125px 로 눌려
             '오시는 길·진료시간' 이 두 줄로 접힌다(실측). 그 폭에서는 240px 로 줄인다.
        */}
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[240px_repeat(4,minmax(0,1fr))] xl:grid-cols-[300px_repeat(4,minmax(0,1fr))] xl:gap-x-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <LogoLockup tone="light" />
            {/*
              ★ 병원 영문명 (2026-08-18). 지어낸 문구가 아니라 CLINIC.nameEn 에 이미 있던
                정식 영문 표기이고, 로고 이미지 안에도 같은 글자가 들어 있다. 지금까지는
                기계용 데이터(alternateName)로만 쓰이고 화면에는 한 번도 안 나왔다.
              ★ 영문 세리프로 쓴다 — 라틴 문자만 있는 자리라 조건에 맞고, 푸터에서
                한 줄이 결이 다르면 그것만으로 마감이 정돈돼 보인다.
            */}
            <p className="display-en mt-4 text-[13px] tracking-[0.22em] text-brand-300/80">
              {CLINIC.nameEn}
            </p>
            <p className="mt-5 text-[14px] leading-relaxed text-brand-200/90 lg:max-w-none">
              {CLINIC.description}
            </p>
            {/*
              ★ 전화 버튼을 칸 폭에 꽉 채운다(w-full). 아래 채널 격자와 좌우 끝이 맞아
                왼쪽 칸 전체가 하나의 세로 줄로 읽힌다. 글자 길이에 따라 폭이 정해지면
                그 아래 격자와 오른쪽 끝이 어긋난다.
              ★ 넓은 화면에서는 채널 격자 폭(=칸 폭)이 300px 라 버튼도 300px 다.
            */}
            <a
              href={CLINIC.phoneHref}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-white/10 text-[16.5px] font-black text-white transition-colors hover:bg-white/20 sm:max-w-[340px] lg:max-w-none"
            >
              <span className="tabular-nums">{CLINIC.phone}</span>
            </a>

            {/*
              ★★ 공식 채널 (2026-08-14 운영자) ★★
                푸터의 채널 링크는 장식이 아니다. 여기 걸린 주소가 그대로
                `sameAs` 로도 나가(lib/seo.ts) "이 홈페이지와 저 계정이 같은 병원" 이라는
                선언이 된다. 지식패널·지역 검색이 그 값을 읽는다.
                ⚠️ 그래서 **확인된 계정만** 건다. 없는 주소를 걸면 404 를 가리키는
                   동일성 선언이 되어 오히려 신호를 해친다.
              ★ 아이콘만 두지 않고 이름을 함께 적는다 — 아이콘만 있으면 스크린리더에서
                "링크" 로만 읽히고, 검색엔진도 무엇으로 가는 링크인지 알 수 없다.
            */}
            {/*
              ★ 네 개를 2×2 격자로 세운다 — 폭이 같아야 오른쪽 끝이 한 선에 선다.
                전에는 flex-wrap 이라 '인스타그램'(5자)과 '카카오톡 상담'(7자)의 폭이 달랐다.
              ★ 화살표를 오른쪽 끝으로 밀어(justify-between) 네 칸의 화살표가 같은 자리에 온다.
              ⚠️ 배열로 돌린다. 전에는 같은 마크업 네 벌이 복사돼 있어서 한 곳만 고치면
                 나머지 셋과 어긋났다(실제로 그런 상태였다).
            */}
            <div className="mt-7 sm:max-w-[340px] lg:max-w-none">
              <p className="text-[12.5px] font-black tracking-[0.16em] text-brand-200/60 uppercase">
                공식 채널
              </p>
              {/*
                ⚠️ 1024~1279px 구간에서는 한 칸씩 세운다. 그 폭에서 브랜드 칸이 240px 라
                   두 칸으로 나누면 버튼 하나가 115px 가 되고 '카카오톡 상담'(70px 필요)이
                   48px 자리에 들어가 잘린다(실측). 이름이 잘리면 채널을 못 알아본다.
              */}
              <ul className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-1 xl:grid-cols-2">
                {CHANNELS.map((ch) => (
                  <li key={ch.label}>
                    <a
                      href={ch.href}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={`${CLINIC.name} ${ch.label} (새 창)`}
                      className="group flex h-11 w-full items-center justify-between gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 text-[13px] font-bold text-brand-100 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <ch.Icon />
                        <span className="truncate">{ch.label}</span>
                      </span>
                      <span
                        aria-hidden
                        className="shrink-0 text-[12.5px] text-brand-200/60 transition-transform group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/*
            메뉴 네 칸 — 격자의 직계 자식이라 넷이 한 줄에 서고 제목의 윗선이 정확히 맞는다.
            (전에는 이 넷이 따로 3칸 격자에 들어가 있어 마지막 하나가 아래로 밀렸다.)
          */}
          {NAV.map((item) => (
            <nav key={item.href} aria-label={`푸터 ${item.label}`}>
              <p className="text-[13px] font-black tracking-wide text-white">{item.label}</p>
              <ul className="mt-4 space-y-2.5">
                {(item.children ?? [{ label: item.label, href: item.href }]).map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className="text-[13px] leading-snug text-brand-200/80 transition-colors hover:text-white"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/*
          ★★ 사업자 정보 — 라벨을 세워 네 칸으로 나눈다 ★★
            전에는 두 칸에 문장이 이어 붙어 있어서 어느 값이 무엇인지 읽어야 알았고
            (왼쪽 2줄 / 오른쪽 3줄이라 두 칸의 아랫선도 어긋났다),
            진료시간 다섯 항목이 가운뎃점으로 한 줄에 이어져 끊어 읽을 곳이 없었다.
          ★ dl 로 쓴다 — '주소'·'대표자' 는 장식이 아니라 값의 이름이다.
            기계도 사람도 라벨과 값의 짝을 그대로 읽는다.
          ★ 진료시간은 **한 줄에 하나씩**. 요일별로 다른 값이라 이어 붙이면 안 된다.
          ⚠️ hours.verified 가 false 면 통째로 감춘다 — 확인 안 된 진료시간을 적어 두면
             그걸 보고 온 환자가 헛걸음한다.
        */}
        <dl className="mt-14 grid gap-x-8 gap-y-9 border-t border-white/10 pt-9 text-[12.5px] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[12.5px] font-black tracking-[0.16em] text-brand-200/50 uppercase">
              주소
            </dt>
            <dd className="mt-2.5 space-y-1 leading-relaxed text-brand-200/80">
              <span className="block">{CLINIC.address.full}</span>
              <span className="block">
                {CLINIC.address.building} · {CLINIC.nearestStation} 인근
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-[12.5px] font-black tracking-[0.16em] text-brand-200/50 uppercase">
              연락처
            </dt>
            <dd className="mt-2.5 space-y-1 leading-relaxed text-brand-200/80">
              <span className="block">대표전화 / FAX {CLINIC.phone}</span>
              <span className="block break-all">{CLINIC.email}</span>
            </dd>
          </div>

          <div>
            <dt className="text-[12.5px] font-black tracking-[0.16em] text-brand-200/50 uppercase">
              사업자 정보
            </dt>
            <dd className="mt-2.5 space-y-1 leading-relaxed text-brand-200/80">
              <span className="block">대표자 {CLINIC.director}</span>
              <span className="block">사업자등록번호 {CLINIC.bizNo}</span>
            </dd>
          </div>

          {UNVERIFIED.hours.verified && (
            <div>
              <dt className="text-[12.5px] font-black tracking-[0.16em] text-brand-200/50 uppercase">
                진료시간
              </dt>
              <dd className="mt-2.5 space-y-1 leading-relaxed text-brand-200/80">
                {UNVERIFIED.hours.display.map((h) => (
                  <span key={h.label} className="flex justify-between gap-3">
                    <span>{h.label}</span>
                    <span className="tabular-nums text-brand-200/90">{h.time}</span>
                  </span>
                ))}
                <span className="block pt-1 text-brand-200/60">{UNVERIFIED.hours.closed}</span>
              </dd>
            </div>
          )}
        </dl>

        {/*
          의료법상 고지.
          ⚠️ 구분선(border-t)은 **바깥 칸**에 건다. 문단에 직접 걸면 선이 문단 폭(86ch)까지만
             그어져 화면 중간에서 뚝 끊긴 줄로 보인다 — 실제로 그렇게 보이던 것을 고쳤다.
             글줄 길이는 문단이, 선은 칸이 각각 맡는다.
        */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="max-w-[86ch] text-[12.5px] leading-relaxed text-brand-200/50">
            본 사이트의 진료 정보는 일반적인 이해를 돕기 위한 것으로 개별 진단을 대신하지 않습니다. 치료
            결과는 개인의 구강 상태와 전신 건강에 따라 다를 수 있으며, 모든 의료 행위에는 부작용이 따를 수
            있습니다.
          </p>
        </div>
        {/*
          개인정보처리방침은 푸터에 둔다 — 「개인정보 보호법」 제30조가 '정보주체가 쉽게 확인할 수
          있도록' 공개하라고 정하고 있고, 그 관행상의 자리가 푸터다. 주 메뉴에 올리면 진료 정보를
          찾는 흐름을 방해하고, 없으면 법적으로도 AI 신뢰도 평가에서도 감점이다.
        */}
        {/*
          ★★ 최종 확인일 — 모든 페이지에 (2026-08-14) ★★
            외부 진단이 "날짜 정보 없음 / 최근 연도는 있으나 구체적 날짜 없음" 으로 잡았다.
            본문형 페이지에는 발행·수정일을 달았지만 **홈에는 없었다.** 홈은 대부분의
            방문자와 크롤러가 처음 만나는 문서라, 거기 날짜가 없으면 사이트 전체가
            "언제 기준인지 모르는 곳" 으로 읽힌다.
          ★ `<time datetime>` 으로 기계 판독 값을 함께 준다. 사람에게는 한국어로,
            기계에게는 ISO 8601 로.
          ⚠️ 이 날짜는 lib/contentMeta.ts 의 SITE_MODIFIED 다. **실제로 내용을 고친 날만**
             올린다 — 안 고쳤는데 날짜만 올리면 그건 사실과 다른 표시이고,
             병원 홈페이지에서는 위험한 종류의 거짓말이다.
        */}
        {/*
          맨 아랫줄 — 넓은 화면에서는 좌(링크·확인일)/우(저작권)로 갈라 양 끝에 붙이고,
          좁은 화면에서는 세로로 쌓는다. 셋을 한 줄에 흘려 두면 줄바꿈 위치가 화면 폭마다
          달라져 어디서 끊길지 알 수 없었다.
        */}
        <div className="mt-8 flex flex-col gap-3 text-[12.5px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="font-bold text-brand-200/80 transition-colors hover:text-white"
            >
              개인정보처리방침
            </Link>
            <span className="text-brand-200/60">
              병원 정보 최종 확인{' '}
              <time dateTime={SITE_MODIFIED} className="font-semibold text-brand-200/80">
                {formatKoreanDate(SITE_MODIFIED)}
              </time>
            </span>
          </div>
          <span className="text-brand-200/40">
            &copy; {new Date().getFullYear()} {CLINIC.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

/**
 * 공식 채널 네 개.
 *
 * ★★ 왜 목록으로 빼는가 ★★
 *   전에는 같은 마크업 네 벌이 복사돼 있었다. 클래스 하나를 고치면 나머지 셋이
 *   그대로 남아 규격이 어긋난다 — 실제로 그렇게 어긋나 있었다.
 *
 * ⚠️ 여기 걸린 주소가 그대로 `sameAs` 로도 나가(lib/seo.ts) "이 홈페이지와 저 계정이
 *    같은 병원" 이라는 선언이 된다. **확인된 계정만** 건다. 없는 주소를 걸면 404 를
 *    가리키는 동일성 선언이 되어 오히려 신호를 해친다.
 * ★ 아이콘만 두지 않고 이름을 함께 적는다 — 아이콘만 있으면 스크린리더에서 "링크" 로만
 *   읽히고, 검색엔진도 무엇으로 가는 링크인지 알 수 없다.
 */
const CHANNELS = [
  { label: '인스타그램', href: CLINIC.social.instagram, Icon: InstagramIcon },
  { label: '네이버 블로그', href: CLINIC.social.naverBlog, Icon: NaverMark },
  { label: '네이버 예약', href: CLINIC.booking.naver, Icon: NaverMark },
  { label: '카카오톡 상담', href: CLINIC.booking.kakao, Icon: KakaoMark },
] as const;

/*
 * 채널 아이콘 — 인라인 SVG 로 둔다.
 * ★ 아이콘 폰트나 외부 이미지를 쓰지 않는 이유: 요청이 하나 더 늘고, 늦게 뜨면
 *   푸터가 한 번 흔들린다. 세 개짜리라 인라인이 언제나 이긴다.
 * ★ 인스타그램은 브랜드 색(그라데이션)을 쓰지 않고 단색으로 둔다 — 짙은 푸터 위에서
 *   원색 그라데이션은 혼자 튀어 광고처럼 보인다. 네이버·카카오는 각인된 색이 강해
 *   단색으로 두면 오히려 못 알아보므로 브랜드 색을 유지한다.
 */
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false">
      <rect x="2.6" y="2.6" width="14.8" height="14.8" rx="4.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="14.3" cy="5.7" r="1" fill="currentColor" />
    </svg>
  );
}

function NaverMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false">
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.6" fill="#03C75A" />
      <path d="M7.4 13.4V6.6h1.9l2.2 3.4V6.6h1.9v6.8h-1.9L9.3 10v3.4H7.4Z" fill="#fff" />
    </svg>
  );
}

function KakaoMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false">
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.6" fill="#FEE500" />
      <path
        d="M10 5.6c-2.9 0-5.2 1.8-5.2 4.1 0 1.5 1 2.8 2.5 3.5l-.6 2.2c-.05.2.16.35.33.24l2.6-1.7c.12.01.24.02.37.02 2.9 0 5.2-1.8 5.2-4.2S12.9 5.6 10 5.6Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}
