import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * 이미지 파일의 실제 픽셀 크기를 읽는다.
 *
 * ★★ 왜 손으로 적지 않는가 ★★
 *   ImageObject 스키마는 width/height 를 요구한다. 그런데 그 값을 페이지마다 손으로 적으면
 *   ① 사진을 교체하는 순간 **거짓값이 되고**, ② 89개 페이지에 흩어져 있어 아무도 고치지 않는다.
 *   구조화 데이터에서 틀린 값은 없는 것보다 나쁘다 — 그래서 파일에서 직접 읽는다.
 *
 * ★ 빌드 시점에만 돈다. 이 사이트는 전부 정적 생성(generateStaticParams)이라
 *   런타임 비용이 0 이고, 결과가 HTML 에 박혀 나간다.
 * ★ 라이브러리를 쓰지 않는다 — PNG 와 JPEG 두 형식이면 헤더 몇 바이트로 끝난다.
 *   의존성 하나를 늘릴 만한 일이 아니다.
 *
 * ⚠️ 못 읽으면 null 을 돌려준다. 그 경우 호출부가 ImageObject 를 **아예 내지 않는다** —
 *    크기를 모르는 채 0 이나 어림값을 넣는 것이 최악이다.
 */
export interface ImageSize {
  width: number;
  height: number;
}

const cache = new Map<string, ImageSize | null>();

export function imageSize(publicPath: string): ImageSize | null {
  if (cache.has(publicPath)) return cache.get(publicPath)!;
  const result = read(publicPath);
  cache.set(publicPath, result);
  return result;
}

function read(publicPath: string): ImageSize | null {
  try {
    const buf = readFileSync(join(process.cwd(), 'public', publicPath.replace(/^\//, '')));

    // PNG — 8바이트 시그니처 뒤 IHDR 에 폭·높이가 빅엔디안 4바이트씩 들어 있다.
    if (buf[0] === 0x89 && buf[1] === 0x50) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }

    // JPEG — SOFn 마커(0xC0~0xCF, 단 C4/C8/CC 제외)를 찾아 그 안의 높이·폭을 읽는다.
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) {
          i++;
          continue;
        }
        const marker = buf[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
        }
        const len = buf.readUInt16BE(i + 2);
        if (len < 2) break;
        i += 2 + len;
      }
    }
  } catch {
    // 파일이 없거나 읽을 수 없으면 조용히 포기한다 — 아래 null 로 떨어진다.
  }
  return null;
}

/**
 * ImageObject 에 넣을 값을 한 번에 만든다.
 * 크기를 못 읽으면 undefined 를 돌려주므로 호출부에서 그대로 조건부로 쓰면 된다.
 */
export function imageMeta(src: string, caption: string) {
  const size = imageSize(src);
  return size ? { src, caption, width: size.width, height: size.height } : undefined;
}
