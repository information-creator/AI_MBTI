/**
 * GA4 Measurement Protocol — 유입 소스별 가상 세션 주입
 *
 * 사용법:
 *   node scripts/claude-ga4.js           # 100세션
 *   node scripts/claude-ga4.js 200       # 200세션
 *   node scripts/claude-ga4.js 10 debug  # 10세션 + debug endpoint (검증용)
 */

const MEASUREMENT_ID = 'G-X6R0LGZKDJ'
const API_SECRET     = 'Uxt4ltCoQdWBzGKXqFO35Q'
const BASE_URL       = 'https://aimbti.vercel.app'

const PROD_EP  = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`
const DEBUG_EP = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`

// ── 유입 소스 (가중치) ──────────────────────────────────────────────────────
const SOURCES = [
  { utm_source: 'instagram',  utm_medium: 'social',   utm_campaign: 'launch',   weight: 30 },
  { utm_source: 'kakaotalk',  utm_medium: 'social',   utm_campaign: 'share',    weight: 25 },
  { utm_source: '(direct)',   utm_medium: '(none)',   utm_campaign: '',         weight: 20 },
  { utm_source: 'naver',      utm_medium: 'cpc',      utm_campaign: 'brand',    weight: 10 },
  { utm_source: 'google',     utm_medium: 'organic',  utm_campaign: '',         weight: 8  },
  { utm_source: 'twitter',    utm_medium: 'social',   utm_campaign: 'viral',    weight: 4  },
  { utm_source: 'linktree',   utm_medium: 'referral', utm_campaign: '',         weight: 3  },
]

// ── 시나리오 (가중치) ────────────────────────────────────────────────────────
const SCENARIOS = [
  { name: '완주+부트캠프', dropout: null,       bootcamp: true,  share: false, weight: 35 },
  { name: '완주+공유',     dropout: null,       bootcamp: false, share: true,  weight: 20 },
  { name: '완주만',        dropout: null,       bootcamp: false, share: false, weight: 10 },
  { name: 'CTA후이탈',    dropout: 'cta',      weight: 15 },
  { name: '테스트중이탈', dropout: 'mid_test', weight: 10 },
  { name: '결과후이탈',   dropout: 'result',   weight: 10 },
]

const TYPE_CODES = ['HALF','HALP','HACF','HACP','HSLF','HSLP','HSCF','HSCP',
                    'TALF','TALP','TACF','TACP','TSLF','TSLP','TSCF','TSCP']

// ── 유틸 ────────────────────────────────────────────────────────────────────
function pick(arr) {
  const total = arr.reduce((s, c) => s + c.weight, 0)
  let r = Math.random() * total
  for (const item of arr) { r -= item.weight; if (r <= 0) return item }
  return arr[0]
}

function uid() {
  return `${Math.floor(Math.random() * 1e10)}.${Math.floor(Date.now() / 1000)}`
}

function utmUrl(path, source) {
  if (!source.utm_campaign && source.utm_source === '(direct)') return `${BASE_URL}${path}`
  const p = new URLSearchParams()
  if (source.utm_source !== '(direct)') p.set('utm_source', source.utm_source)
  if (source.utm_medium !== '(none)')   p.set('utm_medium', source.utm_medium)
  if (source.utm_campaign)              p.set('utm_campaign', source.utm_campaign)
  return `${BASE_URL}${path}?${p.toString()}`
}

// ── 전송 ────────────────────────────────────────────────────────────────────
async function send(endpoint, clientId, sessionId, events) {
  const body = JSON.stringify({
    client_id: clientId,
    events: events.map(e => ({
      ...e,
      params: {
        ga_session_id:     String(sessionId),
        ga_session_number: 1,
        ...(e.params ?? {}),
      },
    })),
  })
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  if (endpoint === DEBUG_EP) {
    const json = await res.json()
    if (json.validationMessages?.length) {
      console.error('\n[debug]', JSON.stringify(json.validationMessages))
    }
  }
  return res.status
}

// ── 세션 시뮬레이션 ──────────────────────────────────────────────────────────
async function runSession(endpoint, i) {
  const scenario  = pick(SCENARIOS)
  const source    = pick(SOURCES)
  const clientId  = uid()
  const sessionId = Math.floor(Date.now() / 1000) + i
  const typeCode  = TYPE_CODES[Math.floor(Math.random() * TYPE_CODES.length)]

  // 랜딩 page_view (UTM 포함)
  await send(endpoint, clientId, sessionId, [{
    name: 'page_view',
    params: {
      page_location: utmUrl('', source),
      page_title:    'AI 시대 생존력 진단 | 나는 AI에 대체될까?',
      engagement_time_msec: 800 + Math.floor(Math.random() * 2000),
    },
  }])

  if (scenario.dropout === 'cta') { process.stdout.write('l'); return }

  // CTA 클릭
  await send(endpoint, clientId, sessionId, [{
    name: 'cta_click',
    params: { location: 'hero', engagement_time_msec: 500 },
  }])

  // /test page_view
  await send(endpoint, clientId, sessionId, [{
    name: 'page_view',
    params: {
      page_location: `${BASE_URL}/test`,
      page_title:    'AI 진단 테스트',
      engagement_time_msec: 300,
    },
  }])

  if (scenario.dropout === 'mid_test') { process.stdout.write('m'); return }

  // 테스트 완료
  await send(endpoint, clientId, sessionId, [{
    name: 'test_complete',
    params: { type_code: typeCode, engagement_time_msec: 8000 + Math.floor(Math.random() * 5000) },
  }])

  // 결과 page_view
  await send(endpoint, clientId, sessionId, [{
    name: 'page_view',
    params: {
      page_location: `${BASE_URL}/result/${typeCode}`,
      page_title:    `결과: ${typeCode}`,
      engagement_time_msec: 1500 + Math.floor(Math.random() * 2000),
    },
  }])

  if (scenario.dropout === 'result') { process.stdout.write('r'); return }

  if (scenario.bootcamp) {
    await send(endpoint, clientId, sessionId, [{
      name: 'bootcamp_click',
      params: { type_code: typeCode, engagement_time_msec: 400 },
    }])
  }

  if (scenario.share) {
    await send(endpoint, clientId, sessionId, [{
      name: 'share_click',
      params: { type_code: typeCode, method: 'link_copy', engagement_time_msec: 300 },
    }])
  }

  process.stdout.write('.')
}

// ── 메인 ────────────────────────────────────────────────────────────────────
async function main() {
  const TOTAL       = parseInt(process.argv[2] || '100', 10)
  const isDebug     = process.argv[3] === 'debug'
  const CONCURRENCY = isDebug ? 1 : 20
  const endpoint    = isDebug ? DEBUG_EP : PROD_EP

  console.log(`\n🚀 GA4 세션 주입 시작`)
  console.log(`   세션: ${TOTAL}  동시: ${CONCURRENCY}  모드: ${isDebug ? 'DEBUG' : 'PROD'}`)
  console.log(`   소스: instagram·kakaotalk·direct·naver·google·twitter·linktree`)
  console.log(`   . 완주  l 랜딩이탈  m 중간이탈  r 결과이탈\n`)

  for (let i = 0; i < TOTAL; i += CONCURRENCY) {
    const batch = []
    for (let j = i; j < Math.min(i + CONCURRENCY, TOTAL); j++) {
      batch.push(runSession(endpoint, j))
    }
    await Promise.all(batch)
  }

  console.log(`\n\n✅ ${TOTAL}세션 완료`)
  console.log(`\n📊 GA4 확인:`)
  console.log(`   실시간  → https://analytics.google.com/analytics/web/#/a389908076p531252719/reports/realtime`)
  console.log(`   트래픽  → 보고서 > 획득 > 트래픽 획득 (24시간 후 집계)`)
}

main().catch(console.error)
