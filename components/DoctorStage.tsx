import Image from 'next/image';
import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';
import { DOCTORS } from '@/lib/doctors';

/**
 * 의료진 — **대표원장 한 판, 아래에 원장 두 분이 한 줄.** 셋 다 가로형 유리 카드다.
 *
 * ★★ 짜임 (2026-08-31 운영자) ★★
 *   ① 대표원장 — 사진 왼쪽, 오른쪽에 이름 · 자격 · 경력 · 학회.
 *      ⚠️ 오른쪽 글은 **두 칸**이다(경력 | 학회). 한 칸으로 쌓았더니 경력 아래가 크게 비고
 *         학회가 판 맨 아래로 떨어졌다 — 운영자: "대표원장 학회는 오른쪽에 해주고".
 *   ② 원장 두 분 — **사진 왼쪽 · 내용 오른쪽 한 카드**로, 둘이 한 줄에 선다.
 *      사진을 줄이고 학회는 뺐다(운영자: "사진 크기 좀 줄여주고, 학회활동 생략해줘").
 *      학회 전체는 의료진 소개 페이지에 있다.
 *
 *   ⚠️⚠️ **손을 올리면 뜨는 팝업을 되살리지 말 것** ⚠️⚠️
 *     한 번 만들었다 걷어냈다. 판이 줄 전체를 덮어 다른 원장으로 못 옮겨갔고, 판이 유리라
 *     뒤가 비쳤고, 판이 아래 버튼 자리까지 늘어났고, 손가락·크롤러에는 아예 안 보였다.
 *   ★ 지금은 처음부터 다 보인다. 감출 것이 없으니 어긋날 것도 없다.
 *
 * ★★ 원장 개별 페이지는 없다 (2026-08-31) ★★
 *   "의료진페이지 한명한명 만들지말고, 지금 의료진 소개 페이지만 냅둬줘."
 *   링크는 전부 /about/doctors 한 곳으로 간다. 사람마다 다른 곳으로 보내는 링크를
 *   다시 만들지 말 것 — 갈 페이지가 없다.
 *
 * ⚠️ 경력·학회는 lib/doctors.ts **원문 그대로**다(license·keyCareer). 여기서 문장을
 *    만들거나 잘라 쓰지 않는다 — 거기에는 원문 부분집합인지 확인하는 가드가 있다.
 * ⚠️⚠️ 글자를 작게 만들거나 흐린 흰색을 쓰지 말 것 (운영자: "너무 문구 작고",
 *    "문구 어두운건 다 흰색으로"). 위계는 크기·굵기와 골드가 맡는다.
 *
 * ★★ 색감 ★★
 *   골드(--color-signal #d9a441, 어두운 면 글자 7.42:1)는 작고 구조적인 자리에만 —
 *   직함 · 자격 표식 · 구분선 · 버튼 테두리.
 *   ⚠️ 큰 면을 골드로 채우지 말 것 — 전에 학회 판을 채웠다가 "너무 황금색이랑 안 어울린다".
 *
 * ★★ 사진 배경 ★★
 *   세 사진은 촬영 배경이 서로 달랐다(#c0bdba · #dddfe4 · #cdcdd3 — 실측).
 *   `-bg` 판은 그 톤을 하나로 맞춰 둔 것이다(scripts/normalizeDoctorBg.mjs).
 *   ⚠️ 원본 파일을 쓰면 세 배경이 도로 어긋난다.
 *
 * ★ 누끼(배경 제거)는 네 번 시도해 네 번 실패했다 — 배경이 방사형인 데다 인물 그림자가
 *   얹혀 있어, 예측 오차가 가운과 배경의 차이(27~48)와 같다. 색만 보는 방법으로는 못 가른다.
 *   되는 방법은 사람 분리 모델(rembg·포토샵 배경 제거)로 한 번 따서 투명 PNG 를 넣는 것뿐.
 *   그때는 아래 evened() 만 바꾸면 된다. ⚠️ 임계값을 바꿔 가며 다시 시도하지 말 것.
 */

/** 사진 배경을 맞춰 둔 판. ⚠️ 원본을 쓰면 배경이 도로 어긋난다. */
const evened = (photo: string) => photo.replace(/\.jpg$/i, '-bg.jpg');

/** 사진이 앉는 회색 판 — 통일된 사진 배경색과 같은 값이라 경계가 안 보인다. */

type Doc = (typeof DOCTORS)[number];

/**
 * 유리 판.
 * ⚠️ .pane-dark 를 쓰지 말 것 — 그건 뒤를 눌러서 유리를 만드는 **밝은 바탕용**이다.
 *    이미 어두운 면에서는 누를 것이 없어 검은 네모가 된다. .pane-frost 가 그 자리를 위해 있다.
 */

/**
 * 사진 아래를 흐려 없애는 마스크 — 어두운 면 위에서 스튜디오 배경이 네모로 남지 않게.
 * ⚠️ 값을 낮추면(더 일찍 사라지면) 흰 가운 아랫단까지 지워진다. 실측으로 잡은 값이다.
 */
const FADE =
  'linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,0.55) 92%, rgba(0,0,0,0) 100%)';

/** 무대 위 한 사람 — 사진 아래에 이름·자격이 가운데로 선다. */
function Stand({ d, big }: { d: Doc; big?: boolean }) {
  return (
    /* ⚠️ 양옆을 pt 로 내리지 말 것 — 사진 아랫변을 맞추는 방식으로 바뀌었다(위 주석). */
    <div className="reveal flex flex-col items-center text-center">
      {/*
        ⚠️ 사진에 테두리·배경판을 주지 말 것 — 그 순간 다시 카드가 된다.
           아래로 흐려 없애는 것만으로 사진이 면 위에 '서 있게' 된다.
      */}
      {/*
        ⚠️ 높이를 비율로 되돌리지 말 것 — 폭이 다르면 높이가 따라 달라져 사진 아랫변이
           어긋나고, 그만큼 이름 줄이 위아래로 흩어진다(2026-08-31 오너 지적).
        ⚠️ 가운데의 -mt 는 두 높이의 **차이와 같다**(460-380=80). 한쪽만 바꾸면 줄이 깨진다.
      */}
      <div
        className={`relative w-full ${
          big
            ? 'h-[360px] sm:h-[430px] lg:-mt-20 lg:h-[460px]'
            : 'h-[300px] sm:h-[360px] lg:h-[380px]'
        }`}
        style={{ maskImage: FADE, WebkitMaskImage: FADE }}
      >
        <Image
          src={evened(d.photo)}
          alt={`${d.name} ${d.role}`}
          fill
          sizes={big ? '(max-width: 1023px) 80vw, 420px' : '(max-width: 1023px) 60vw, 320px'}
          className="object-cover object-top"
          priority={big}
        />
      </div>

      <p className={`font-bold text-signal ${big ? 'text-[15px]' : 'text-[14.5px]'}`}>
        {d.role}
      </p>
      <p
        className={`mt-2 font-bold tracking-[0.14em] text-oat ${
          big ? 'text-[30px] sm:text-[34px]' : 'text-[26px] sm:text-[29px]'
        }`}
      >
        <span className="-mr-[0.14em]">{d.name}</span>
      </p>
      <p className={`mt-4 font-bold text-oat ${big ? 'text-[17px]' : 'text-[16.5px]'}`}>
        {d.license}
      </p>
      {/* ⚠️ 학회는 여기 넣지 말 것 — 세로가 길어져 무대 구도가 무너진다. 전체는 소개 페이지에 있다. */}
      <ul className="mt-2.5 space-y-1.5">
        {d.keyCareer.map((c) => (
          <li key={c} className="text-[16px] leading-[1.55] text-oat/75">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DoctorStage() {
  const [director, ...rest] = DOCTORS;
  if (!director) return null;
  const [left, right] = rest;

  return (
    <div className="mt-16">
      {/*
        ⚠️ 가운데 칸을 양옆보다 넓게 둔다(1.25fr). 같은 폭으로 두면 셋이 동급으로 읽혀
           무대 구도가 사라진다. 양옆은 lg:pt-16 만큼 내려 앉는다(Stand 참조).
        ⚠️ items-start 를 유지할 것 — 가운데가 끌어올려지는 것은 양옆이 내려간 결과다.
      */}
      {/* ⚠️ lg:pt-20 — 가운데를 -mt-20 만큼 끌어올렸으므로 그만큼 위에 자리를 비워 둔다. */}
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10 lg:pt-20">
        {left ? <Stand d={left} /> : <div aria-hidden />}
        <Stand d={director} big />
        {right ? <Stand d={right} /> : <div aria-hidden />}
      </div>

      {/*
        ★ 갈 곳은 **의료진 소개 페이지 하나**다. 원장 개별 페이지는 없앴다.
          경력 전체와 학회 전체가 거기 있다.
      */}
      <div className="mt-16 flex justify-center">
        <Link
          href="/about/doctors"
          className="inline-flex items-center gap-2 rounded-full border border-signal/60 px-7 py-3.5 text-[16px] font-bold text-oat transition-colors hover:bg-white/10"
        >
          의료진 자세히 보기
          <span aria-hidden className="text-signal">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
