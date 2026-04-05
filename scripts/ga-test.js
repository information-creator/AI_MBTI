const { chromium } = require('playwright')

const URL = 'https://aimbti-jet.vercel.app'

const TYPES = ['HALF', 'TSCF', 'HSLF', 'TSCP', 'HALP', 'HACF', 'HACP', 'TALF']
const LOCATIONS = ['hero', 'header', 'type_preview', 'viral']
const SHARE_METHODS = ['kakao', 'link', 'card']

// 시나리오 정의 (이탈 지점 포함)
const SCENARIOS = [
  { name: '완주 + 부트캠프 클릭', weight: 30, dropout: null, bootcamp: true, share: false },
  { name: '완주 + 공유', weight: 20, dropout: null, bootcamp: false, share: true },
  { name: '완주만', weight: 15, dropout: null, bootcamp: false, share: false },
  { name: 'CTA 클릭 후 이탈', weight: 15, dropout: 'after_cta', bootcamp: false, share: false },
  { name: '테스트 시작 후 이탈', weight: 10, dropout: 'after_start', bootcamp: false, share: false },
  { name: '완주 후 이탈', weight: 10, dropout: 'after_complete', bootcamp: false, share: false },
]

function pickScenario() {
  const total = SCENARIOS.reduce((sum, s) => sum + s.weight, 0)
  let rand = Math.random() * total
  for (const s of SCENARIOS) {
    rand -= s.weight
    if (rand <= 0) return s
  }
  return SCENARIOS[0]
}

async function runSession(page, i) {
  const scenario = pickScenario()
  const type = TYPES[i % TYPES.length]
  const score = Math.floor(Math.random() * 60) + 20
  const location = LOCATIONS[i % LOCATIONS.length]

  // 랜딩 방문 (page_view 자동)
  await page.goto(URL, { waitUntil: 'networkidle' })

  if (scenario.dropout === null || scenario.dropout === 'after_cta' || scenario.dropout === 'after_start' || scenario.dropout === 'after_complete') {
    // CTA 클릭
    await page.evaluate(({ location }) => {
      gtag('event', 'cta_click', { location })
    }, { location })
  }

  if (scenario.dropout === 'after_cta') {
    console.log(`  [${i+1}] 이탈: CTA 클릭 후`)
    return
  }

  // 테스트 시작
  await page.evaluate(() => gtag('event', 'test_start'))

  if (scenario.dropout === 'after_start') {
    console.log(`  [${i+1}] 이탈: 테스트 시작 후`)
    return
  }

  // 테스트 완료
  await page.evaluate(({ type, score }) => {
    gtag('event', 'test_complete', { type_code: type, ai_score: score })
  }, { type, score })

  // 결과 조회
  await page.evaluate(({ type, score }) => {
    gtag('event', 'result_view', { type_code: type, ai_score: score })
  }, { type, score })

  if (scenario.dropout === 'after_complete') {
    console.log(`  [${i+1}] 이탈: 결과 조회 후`)
    return
  }

  // 부트캠프 클릭
  if (scenario.bootcamp) {
    await page.evaluate(({ type }) => {
      gtag('event', 'bootcamp_click', { type_code: type, bootcamp: 'metacoding' })
    }, { type })
  }

  // 공유
  if (scenario.share) {
    const method = SHARE_METHODS[i % SHARE_METHODS.length]
    await page.evaluate(({ method }) => {
      gtag('event', 'share_click', { method })
    }, { method })
  }

  console.log(`  [${i+1}] 완주: ${scenario.name} | 유형: ${type} | 점수: ${score}`)
}

async function main() {
  const TOTAL = 100
  const CONCURRENCY = 5 // 동시 실행 수

  console.log(`\n🚀 GA4 테스트 시작 (${TOTAL}세션, 동시 ${CONCURRENCY}개)\n`)

  const browser = await chromium.launch({ headless: true })

  const stats = { total: 0, dropout_cta: 0, dropout_start: 0, dropout_complete: 0, complete: 0 }

  for (let i = 0; i < TOTAL; i += CONCURRENCY) {
    const batch = []
    for (let j = i; j < Math.min(i + CONCURRENCY, TOTAL); j++) {
      const context = await browser.newContext()
      const page = await context.newPage()
      batch.push(
        runSession(page, j)
          .catch(e => console.error(`  세션 ${j+1} 오류:`, e.message))
          .finally(() => context.close())
      )
    }
    await Promise.all(batch)
    stats.total += Math.min(CONCURRENCY, TOTAL - i)
    process.stdout.write(`\r진행: ${Math.min(i + CONCURRENCY, TOTAL)}/${TOTAL}`)
  }

  await browser.close()

  console.log('\n\n✅ 완료\n')
  console.log('📊 GA4에서 확인할 것:')
  console.log('  - 보고서 → 참여도 → 이벤트 (24~48시간 후)')
  console.log('  - 탐색 → 깔때기 탐색: 각 단계별 이탈율')
  console.log('  - 탐색 → 경로 탐색: result_view 이후 행동')
}

main().catch(console.error)
