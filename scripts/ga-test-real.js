const { chromium } = require('playwright')

const URL = 'https://aimbti-jet.vercel.app'
const TOTAL = 30 // 실제 브라우저 클릭이라 시간 걸림, 30개로 시작
const CONCURRENCY = 3

// 이탈 시나리오 (가중치)
const SCENARIOS = [
  { name: '완주 + 부트캠프', dropout: null, bootcamp: true, weight: 35 },
  { name: '완주 + 공유', dropout: null, bootcamp: false, share: true, weight: 20 },
  { name: '완주만', dropout: null, bootcamp: false, share: false, weight: 10 },
  { name: 'CTA 후 이탈', dropout: 'cta', weight: 15 },
  { name: '테스트 중 이탈', dropout: 'mid_test', weight: 10 },
  { name: '결과 후 이탈', dropout: 'result', weight: 10 },
]

function pickScenario() {
  const total = SCENARIOS.reduce((s, c) => s + c.weight, 0)
  let r = Math.random() * total
  for (const s of SCENARIOS) {
    r -= s.weight
    if (r <= 0) return s
  }
  return SCENARIOS[0]
}

async function runSession(browser, i) {
  const scenario = pickScenario()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // 1. 랜딩 방문
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(500)

    if (scenario.dropout === 'cta') {
      console.log(`  [${i+1}] 이탈: 랜딩에서`)
      return
    }

    // 2. CTA 클릭 (히어로 버튼)
    await page.click('a[href="/test"]')
    await page.waitForURL('**/test', { timeout: 10000 })
    await page.waitForTimeout(500)

    // 3. 문항 답변
    const questions = await page.locator('button.w-full').all()
    const totalQ = 20 // 전체 문항 수

    // 이탈: 테스트 중간에 나가기
    const dropAt = scenario.dropout === 'mid_test'
      ? Math.floor(Math.random() * (totalQ - 5)) + 2
      : totalQ

    for (let q = 0; q < dropAt; q++) {
      await page.waitForSelector('button.w-full', { timeout: 10000 })
      const buttons = await page.locator('button.w-full').all()
      if (buttons.length === 0) break

      // 랜덤으로 첫 번째 또는 두 번째 선택지 클릭
      const pick = Math.random() > 0.5 ? 0 : Math.min(1, buttons.length - 1)
      await buttons[pick].click()
      await page.waitForTimeout(300)

      // 마지막 문항이면 결과 페이지로 이동 대기
      if (q === totalQ - 1) {
        await page.waitForURL('**/result/**', { timeout: 15000 })
      }
    }

    if (scenario.dropout === 'mid_test') {
      console.log(`  [${i+1}] 이탈: 테스트 ${dropAt}번째 문항에서`)
      return
    }

    // 4. 결과 페이지 대기
    await page.waitForURL('**/result/**', { timeout: 15000 })
    await page.waitForTimeout(1000)

    if (scenario.dropout === 'result') {
      console.log(`  [${i+1}] 이탈: 결과 페이지에서`)
      return
    }

    // 5. 부트캠프 클릭
    if (scenario.bootcamp) {
      const bootcampBtn = page.locator('a:has-text("무료 커리큘럼")')
      if (await bootcampBtn.count() > 0) {
        await bootcampBtn.click()
        await page.waitForTimeout(500)
      }
    }

    // 6. 공유 클릭
    if (scenario.share) {
      const shareBtn = page.locator('button:has-text("링크 복사")')
      if (await shareBtn.count() > 0) {
        await shareBtn.click()
        await page.waitForTimeout(300)
      }
    }

    const currentUrl = page.url()
    const typeMatch = currentUrl.match(/result\/([^?]+)/)
    console.log(`  [${i+1}] 완주: ${scenario.name}`)

  } catch (e) {
    console.error(`  [${i+1}] 오류: ${e.message.split('\n')[0]}`)
  } finally {
    await context.close()
  }
}

async function main() {
  console.log(`\n🚀 실제 브라우저 테스트 시작 (${TOTAL}세션, 동시 ${CONCURRENCY}개)\n`)

  const browser = await chromium.launch({ headless: true })

  for (let i = 0; i < TOTAL; i += CONCURRENCY) {
    const batch = []
    for (let j = i; j < Math.min(i + CONCURRENCY, TOTAL); j++) {
      batch.push(runSession(browser, j))
    }
    await Promise.all(batch)
    console.log(`진행: ${Math.min(i + CONCURRENCY, TOTAL)}/${TOTAL}`)
  }

  await browser.close()

  console.log('\n✅ 완료')
  console.log('\n📊 Supabase에서 바로 확인 가능:')
  console.log('  SELECT type_code, COUNT(*) FROM results_v2 GROUP BY type_code;')
  console.log('\n📈 GA4 실시간 보고서에서도 이벤트 확인 가능')
}

main().catch(console.error)
