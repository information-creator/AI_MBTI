import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = 'http://localhost:3000';
const outDir = 'public/screen';
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

// 테스트 페이지
console.log('▶ /test (진단)');
await page.goto(`${baseUrl}/test`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(outDir, 'service-test.png'), fullPage: false });

// analyzing(프로그레스) 생략 — /result/[id]로 바로

// Supabase에 최근 결과가 없을 수 있으니 로컬 결과 폴백 사용
const resultUrl = `${baseUrl}/result/local?type=HALF&score=35&sa=3&sb=3&sc=3&sd=3&se=3`;
console.log(`▶ ${resultUrl}`);
await page.goto(resultUrl, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: path.join(outDir, 'service-result.png'), fullPage: false });

// 결과 페이지 스크롤해서 중간(유형 설명)
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, 'service-result-mid.png'), fullPage: false });

// 학습 연결 CTA (이북·오픈챗)
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, 'service-cta.png'), fullPage: false });

console.log('✓ done');
await browser.close();
