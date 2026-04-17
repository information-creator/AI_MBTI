// GA4 Measurement Protocol 테스트 데이터 전송
const MEASUREMENT_ID = 'G-X6R0LGZKDJ'
const API_SECRET = 'Uxt4ltCoQdWBzGKXqFO35Q'
const ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`

const TYPE_CODES = ['HALF', 'HALP', 'HACF', 'HACP', 'HSLF', 'HSLP', 'HSCF', 'HSCP',
                    'TALF', 'TALP', 'TACF', 'TACP', 'TSLF', 'TSLP', 'TSCF', 'TSCP']

function randomType() {
  return TYPE_CODES[Math.floor(Math.random() * TYPE_CODES.length)]
}
function randomScore() {
  return Math.floor(Math.random() * 61) + 20
}
function randomClientId() {
  return `${Math.floor(Math.random() * 9000000000) + 1000000000}.${Math.floor(Date.now() / 1000)}`
}

async function sendEvents(clientId, sessionId, events) {
  // 모든 이벤트에 session_id와 engagement_time_msec 추가
  const enriched = events.map(e => ({
    name: e.name,
    params: {
      ...e.params,
      session_id: sessionId,
      engagement_time_msec: Math.floor(Math.random() * 30000) + 1000,
      page_location: 'https://mcodegc.com',
      page_title: 'AI 시대 생존력 테스트',
    }
  }))

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      user_properties: {
        traffic_source: { value: 'test_script' }
      },
      events: enriched,
    }),
  })
  return res.status
}

async function simulateUser(index) {
  const clientId = randomClientId()
  const sessionId = `${Date.now()}${index}`
  const typeCode = randomType()
  const aiScore = randomScore()
  const timeOnPage = Math.floor(Math.random() * 120) + 10

  // 1. page_view (랜딩)
  await sendEvents(clientId, sessionId, [{
    name: 'page_view',
    params: { page_location: 'https://mcodegc.com/', page_title: 'AI 시대 생존력 테스트' }
  }])

  // 2. page_view (테스트 페이지) + test_start
  await sendEvents(clientId, sessionId, [
    { name: 'page_view', params: { page_location: 'https://mcodegc.com/test', page_title: '테스트 진행' } },
    { name: 'test_start', params: {} }
  ])

  // 3. test_complete (분석 페이지)
  await sendEvents(clientId, sessionId, [
    { name: 'page_view', params: { page_location: `https://mcodegc.com/analyzing?type=${typeCode}&score=${aiScore}`, page_title: '분석 중' } },
    { name: 'test_complete', params: { type_code: typeCode, ai_score: aiScore } }
  ])

  // 4. result_view (결과 페이지)
  await sendEvents(clientId, sessionId, [
    { name: 'page_view', params: { page_location: `https://mcodegc.com/result/${typeCode.toLowerCase()}`, page_title: `결과 - ${typeCode}` } },
    { name: 'result_view', params: { type_code: typeCode, ai_score: aiScore } }
  ])

  // 5. 랜덤 행동
  const actions = []

  if (Math.random() > 0.3) {
    actions.push({ name: 'share_click', params: { method: ['kakao', 'link', 'instagram', 'card_download'][Math.floor(Math.random() * 4)] } })
  }
  if (Math.random() > 0.5) {
    actions.push({ name: 'openchat_click', params: { type_code: typeCode } })
    actions.push({ name: 'exit_click', params: { label: 'openchat', type_code: typeCode } })
  }
  if (Math.random() > 0.5) {
    const action = Math.random() > 0.5 ? 'download' : 'unlock'
    actions.push({ name: 'ebook_click', params: { type_code: typeCode, action } })
    actions.push({ name: 'exit_click', params: { label: action === 'download' ? 'ebook_download' : 'ebook_metacode', type_code: typeCode } })
  }
  if (Math.random() > 0.7) {
    actions.push({ name: 'exit_click', params: { label: 'bottom_retest', destination: '/test', type_code: typeCode } })
  }
  if (Math.random() > 0.8) {
    actions.push({ name: 'cta_click', params: { location: 'result_bottom' } })
  }

  if (actions.length > 0) {
    await sendEvents(clientId, sessionId, actions)
  }

  // 6. page_exit
  await sendEvents(clientId, sessionId, [
    { name: 'page_exit', params: { type_code: typeCode, time_on_page: timeOnPage, exit_via: 'unload' } }
  ])

  console.log(`✓ User ${index + 1} — ${typeCode} (score: ${aiScore}, actions: ${actions.length})`)
}

// 50명 시뮬레이션
const USER_COUNT = 50
console.log(`\nGA4 테스트 데이터 전송 시작 (${USER_COUNT}명)...\n`)

for (let i = 0; i < USER_COUNT; i++) {
  await simulateUser(i)
  // 약간의 딜레이로 각 유저 분리
  await new Promise(r => setTimeout(r, 200))
}

console.log(`\n✅ 완료! GA4 실시간 보고서에서 확인하세요.`)
