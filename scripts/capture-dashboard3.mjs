import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = 'http://localhost:3000';
const outDir = 'public/screen';
await fs.mkdir(outDir, { recursive: true });

// 캡처할 뷰 목록 (좌측 메뉴의 id와 맞춤)
const views = [
  { id: 'overview', file: 'dashboard3.png', label: '종합' },
  { id: 'funnel', file: 'dashboard3-funnel.png', label: '퍼널' },
  { id: 'meta', file: 'dashboard3-meta.png', label: 'Meta Ads' },
  { id: 'abtest', file: 'dashboard3-abtest.png', label: 'A/B 테스트' },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

const url = `${baseUrl}/dashboard3`;
console.log(`▶ ${url}`);
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

// 비밀번호 게이트 통과
const PASS = '720972';
try {
  const pwInput = await page.waitForSelector('input[type="password"]', { timeout: 8000 });
  if (pwInput) {
    console.log('  🔒 비밀번호 입력…');
    await pwInput.fill(PASS);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForSelector('input[type="password"]', { state: 'detached', timeout: 8000 });
    console.log('  ✓ 로그인');
  }
} catch {
  console.log('  (비밀번호 게이트 없음)');
}

// 초기 데이터 로드 대기
try {
  await page.waitForLoadState('networkidle', { timeout: 30000 });
} catch {}
await page.waitForTimeout(2500);

for (const v of views) {
  console.log(`\n  ▶ 뷰 전환: ${v.label}`);
  // 좌측 메뉴에서 해당 뷰 클릭 — 텍스트 매칭
  const menuLabels = {
    overview: '종합',
    funnel: '퍼널',
    meta: 'Meta Ads',
    abtest: 'A/B',
  };
  const label = menuLabels[v.id];
  try {
    await page.locator(`button:has-text("${label}")`).first().click({ timeout: 5000 });
  } catch {
    console.log(`    ⚠ 메뉴 클릭 실패: ${label}`);
  }
  await page.waitForTimeout(2000);
  try {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  } catch {}
  await page.waitForTimeout(1500);

  const out = path.join(outDir, v.file);
  await page.screenshot({ path: out, fullPage: true });
  const stat = await fs.stat(out);
  console.log(`    ✓ ${out} (${(stat.size / 1024).toFixed(1)} KB)`);
}

await browser.close();
console.log('\n✓ done');
