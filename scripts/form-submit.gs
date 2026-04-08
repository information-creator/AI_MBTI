// Google Apps Script — 구글 폼 제출 시 Supabase 저장 + Slack 알람
// 사용법: 구글 폼 스크립트 편집기에 붙여넣고 onFormSubmit 트리거 설정
// 아래 값을 실제 값으로 교체하세요

const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'
const SLACK_WEBHOOK = 'YOUR_SLACK_WEBHOOK_URL'

function onFormSubmit(e) {
  const responses = e.response.getItemResponses()
  const data = {}

  responses.forEach(r => {
    const title = r.getItem().getTitle()
    const value = r.getResponse()

    if (title.includes('이름')) data.name = value
    else if (title.includes('연락처')) data.phone = value
    else if (title.includes('관심') || title.includes('과정')) data.interest = value
    else if (title.includes('AIMBTI') || title.includes('유형')) data.type_code = value
    else if (title.includes('상황') || title.includes('직업')) data.source = value
    else if (title.includes('고민')) data.concern = value
  })

  // Supabase 저장 (중복 전화번호 무시)
  UrlFetchApp.fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=ignore-duplicates,return=minimal'
    },
    payload: JSON.stringify(data)
  })

  // Slack 알람
  UrlFetchApp.fetch(SLACK_WEBHOOK, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      text: `🔔 새 상담 신청이 들어왔어요!\n*이름:* ${data.name || '-'}\n*연락처:* ${data.phone || '-'}\n*관심 과정:* ${data.interest || '-'}\n*AIMBTI 유형:* ${data.type_code || '-'}\n*현재 상황:* ${data.source || '-'}\n*고민:* ${data.concern || '-'}`
    })
  })
}
