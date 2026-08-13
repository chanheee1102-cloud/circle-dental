# builder/ — 원본 사이트 수집 파이프라인

신규 치과 URL 하나로 이 저장소와 같은 결과를 만들기 위한 스크립트 모음.
전체 설계는 상위 폴더의 **`BUILDER-SPEC.md`**를 먼저 읽을 것.

## 실행 순서

```bash
# 0) 준비 — 이 PC는 백신이 SSL을 가로채므로 항상 이 옵션이 필요하다
export NODE_OPTIONS=--use-system-ca

# 1) 스크린샷 + 페이지 발견 + 디자인 토큰   ★ 여기서 크롤 대상이 정해진다
node builder/01-screenshot.js https://대상치과.co.kr
#    → shots/*.png (데스크톱·모바일 풀샷)
#    → shots/_tokens.json (실측 색·폰트)
#    ⚠️ "발견한 페이지 1개" 로 나오면 즉시 중단하고 크롤 로직부터 고칠 것

# 2) HTML 수집 — PowerShell 로 (curl 은 이 환경에서 실패)
#    01 이 출력한 경로 목록을 page_<이름>.html 로 저장

# 3) 자산 URL 추출 (전 페이지 대상)
node builder/02-extract-assets.js
#    → assets2.txt (신규 이미지 URL 목록)

# 4) 이미지 다운로드
powershell -File builder/05-download.ps1

# 5) 이미지 ↔ 문맥 매핑 (이게 무슨 사진인지 1차 단서)
node builder/03-map-context.js

# 6) 배너에서 사진 영역만 잘라내기 (1920x575 형태)
node builder/04-crop-banners.js

# 7) 영상 화면비 실측 — ★ 건너뛰지 말 것
#    https://vimeo.com/api/oembed.json?url=https://vimeo.com/<ID>
```

## 스크립트별 역할

| 파일 | 하는 일 | 주의 |
|---|---|---|
| `01-screenshot.js` | 내부 링크 전수 발견 → 데스크톱/모바일 풀샷 → 색·폰트 실측 | `networkidle` 금지 (Vimeo가 계속 통신) |
| `02-extract-assets.js` | 전 페이지에서 이미지 URL 수집, 기존 보유분과 대조 | `img src`·`data-src`·`srcset`·CSS `url()` 전부 |
| `03-map-context.js` | 이미지 파일명을 HTML에서 찾아 앞 3000자 한글 추출 | 용도 추정의 1차 단서. 확정은 사람이 |
| `04-crop-banners.js` | ratio ≥ 2.8 배너에서 좌측 45% 색면 제거 | 원본은 `[색면+번호]|[사진]` 구조 |
| `05-download.ps1` | 이미지 다운로드 + manifest.csv | `Remove-Item` 쓰지 말 것(경로 차단됨) |

## 이 파이프라인이 막아주는 실수

`BUILDER-SPEC.md` §9의 10개 실수 중 **#1·#8·#9·#10 (전체의 40%)** 이
01번 스크립트의 전수 크롤만으로 사라진다. 나머지는 스크린샷 판독으로 잡는다.

## 아직 사람이 해야 하는 것

1. **이미지가 무엇인지 최종 판정** — 문맥 매핑은 절반만 맞춘다
2. **병원 고유 주장의 사실 여부** — 원문에 없으면 만들지 말 것
3. **진료 범위 확정** — 메뉴에 없는 진료를 넣을지는 원장 확인 사항
