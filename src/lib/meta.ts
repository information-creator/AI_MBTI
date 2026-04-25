export function fbqEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.fbq?.('track', name, params)
}

// 이북/오픈챗 등 가입 의향 액션만 Lead로 발사 (세션당 1회 캡, 결과 페이지 진입은 ViewContent로 분리)
export function fbqLeadOnce(params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (sessionStorage.getItem('lead_fired') === '1') return
  window.fbq?.('track', 'Lead', params)
  sessionStorage.setItem('lead_fired', '1')
}
