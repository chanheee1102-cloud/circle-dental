/*
 * faq 아래 모든 페이지의 결 — 어두운 서브페이지 (2026-08-31 오너: "서브페이지 전부").
 *
 * ⚠️ 이 파일을 지우면 이 폴더만 밝은 결로 되돌아간다. 색은 globals.css 의
 *    .page-dark 한 곳에 모여 있다 — 값을 바꾸려면 거기서 바꿀 것.
 * ⚠️ 홈(/)에는 붙이지 않는다. 홈은 밝은 결이 기준이다.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="page-dark">{children}</div>;
}
