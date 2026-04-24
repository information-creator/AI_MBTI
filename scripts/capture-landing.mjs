import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const versions = ['v1', 'v3', 'v4'];
const baseUrl = 'http://localhost:3000';
const outRoot = 'public/landing';

// Meta 광고 규격 (1080 width 기준)
const ratios = [
  { name: '1x1',    w: 1080, h: 1080 }, // 피드 정사각형
  { name: '1_91x1', w: 1200, h: 628  }, // 페북 링크/가로형
  { name: '9x16',   w: 1080, h: 1920 }, // 스토리/릴스
];

// 모바일 뷰포트로 렌더 → 레티나 해상도로 캡처
const MOBILE_W = 390;
const DSR = 3; // deviceScaleFactor → 실제 캡처는 1170 width

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: MOBILE_W, height: 844 },
  deviceScaleFactor: DSR,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
});

for (const v of versions) {
  const dir = path.join(outRoot, v);
  await fs.mkdir(dir, { recursive: true });

  const page = await context.newPage();
  const url = `${baseUrl}/${v}`;
  console.log(`\n▶ ${url}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  const fullBuf = await page.screenshot({ fullPage: true });
  const orig = await sharp(fullBuf).metadata();
  console.log(`  full: ${orig.width}×${orig.height} (mobile render)`);

  // 1080 width로 리사이즈 (비율 유지)
  const resized = await sharp(fullBuf)
    .resize({ width: 1080 })
    .png()
    .toBuffer();
  const rm = await sharp(resized).metadata();
  await fs.writeFile(path.join(dir, 'full.png'), resized);
  console.log(`  resized: ${rm.width}×${rm.height}`);

  // 비율별 크롭: source(1080 wide)에서 비율에 맞게 top crop → 타겟 사이즈로 resize
  for (const r of ratios) {
    const out = path.join(dir, `${r.name}.png`);
    const targetRatio = r.w / r.h;
    const srcCropH = Math.round(rm.width / targetRatio);

    let pipeline = sharp(resized);
    if (srcCropH <= rm.height) {
      pipeline = pipeline.extract({ left: 0, top: 0, width: rm.width, height: srcCropH });
    } else {
      // 페이지 높이가 부족 → 하단 흰색 패딩
      pipeline = pipeline
        .extend({
          top: 0,
          bottom: srcCropH - rm.height,
          left: 0,
          right: 0,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .extract({ left: 0, top: 0, width: rm.width, height: srcCropH });
    }

    await pipeline
      .resize({ width: r.w, height: r.h, fit: 'fill' })
      .png({ quality: 95 })
      .toFile(out);
    console.log(`  → ${out} (${r.w}×${r.h})`);
  }

  await page.close();
}

await browser.close();
console.log('\n✓ done');
