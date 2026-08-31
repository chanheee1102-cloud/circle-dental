"""
고운바탕(한글 세리프)을 홈에서 **실제로 쓰는 글자만** 남겨 잘라낸다.

★★ 왜 자르나 ★★
  원본이 1.8MB 다. 제목 열댓 줄 때문에 그 파일을 받게 하면 첫 화면이 늦어진다.
  이 저장소는 폰트 로딩 비용을 깐깐하게 관리한다(app/layout.tsx · globals.css 주석).
  잘라내면 31KB 언저리로 떨어진다.

★★ 왜 손으로 적지 않고 빌드 결과에서 읽나 ★★
  처음엔 쓸 글자를 이 파일에 손으로 적어 뒀다. 그랬더니 제목을 한 줄 고칠 때마다
  목록이 어긋났고, **글꼴에 없는 글자만 Pretendard 로 떨어져** 한 줄에 글꼴이
  두 벌 보였다(실제로 15자가 그랬다). 눈으로는 "왜 어색하지" 정도로만 느껴져 놓치기 쉽다.
  그래서 빌드된 홈 HTML 에서 `.display-ko` 로 그려지는 글자를 직접 긁는다 — 어긋날 수가 없다.

★★ 쓰는 법 ★★
    npm run build
    python scripts/subset-gowun.py
    npm run build        # 잘라낸 글꼴로 다시 빌드

⚠️ 홈 제목 문구를 바꾸면 **반드시 다시 돌릴 것.** 안 돌리면 새 글자가 다른 글꼴로 그려진다.
★ 2026-08-28 부터 세리프는 전 페이지다(.display / .display-sm). 그래서 빌드된 HTML 을 전부 읽는다.
"""

import io
import os
import re
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

# ⚠️ 윈도우 콘솔은 기본이 cp949 라 한글·em-dash 를 못 찍고 스크립트가 죽는다.
#    잘라내기는 이미 끝난 뒤 마지막 print 에서 죽어서 더 헷갈린다 — 출력을 UTF-8 로 고정한다.
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'public', 'fonts', 'gowun', 'GowunBatang-Regular.woff')
DST = os.path.join(ROOT, 'public', 'fonts', 'gowun', 'gowun-subset.woff2')

# 세리프를 쓰는 페이지의 빌드 결과. 홈 하나뿐이다(2026-08-27).
# 세리프를 쓰는 페이지 = **전부**. 홈만 세리프이던 때는 index.html 하나였지만,
# 2026-08-28 에 .display / .display-sm 도 세리프가 되면서 모든 페이지가 대상이 됐다.
SRC_HTML = sorted(
    os.path.join(d, f)
    for d, _, fs_ in os.walk(os.path.join(ROOT, '.next', 'server', 'app'))
    for f in fs_
    if f.endswith('.html')
)

# 항상 넣어 두는 여유분 — 숫자·문장부호·라틴.
# 글자 수가 늘어도 파일은 거의 안 커지므로 넉넉히 잡는다.
ALWAYS = (
    '0123456789'
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    'abcdefghijklmnopqrstuvwxyz'
    ' .,·—–-~/():;?!%&\'"‘’“”…'
)


def used_glyphs():
    """빌드된 HTML 에서 .display-ko 로 그려지는 글자를 모은다."""
    chars = set()
    seen_any = False
    for path in SRC_HTML:
        if not os.path.exists(path):
            continue
        seen_any = True
        html = io.open(path, encoding='utf-8').read()
        # ⚠️ 제목 안에 같은 태그가 중첩되는 경우는 없다 — 있으면 이 정규식을 고칠 것.
        for m in re.finditer(
            # display-ko(홈) 뿐 아니라 display / display-sm(전 페이지)도 세리프다.
            r'<(h1|h2|h3|h4|p|span|div|a|li|strong)\b[^>]*class="[^"]*\bdisplay(?:-ko|-sm)?\b[^"]*"[^>]*>(.*?)</\1>',
            html,
            re.S,
        ):
            inner = re.sub(r'<[^>]*>', ' ', m.group(2))
            inner = re.sub(r'&[a-zA-Z]+;|&#\d+;', ' ', inner)
            chars |= set(inner)
    if not seen_any:
        sys.exit('빌드 결과가 없다. 먼저 `npm run build` 를 돌릴 것.')
    return chars - set(' \n\t\r')


def main():
    chars = used_glyphs() | set(ALWAYS)
    text = ''.join(sorted(chars))

    subset.main([
        SRC,
        '--text=' + text,
        '--flavor=woff2',
        '--output-file=' + DST,
        '--layout-features=*',
        '--no-hinting',
        '--desubroutinize',
    ])

    # 잘라낸 뒤 실제로 다 들어갔는지 되확인한다 — 넣었다고 믿지 않는다.
    have = set()
    for t in TTFont(DST)['cmap'].tables:
        have |= set(chr(c) for c in t.cmap.keys())
    missing = sorted(chars - have)

    print('원본  %5d KB' % (os.path.getsize(SRC) // 1024))
    print('잘라냄 %4d KB' % (os.path.getsize(DST) // 1024))
    print('글자   %4d 자' % len(chars))
    if missing:
        # 원본 글꼴 자체에 없는 글자다. 제목에서 그 글자를 빼거나 다른 글꼴을 써야 한다.
        sys.exit('!! 원본 글꼴에 없는 글자: ' + ''.join(missing))
    print('OK — 홈 제목의 모든 글자가 들어갔다')


if __name__ == '__main__':
    main()
